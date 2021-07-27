import {ModelCtor}                         from "sequelize";
import {SequelizeManager}                  from "../models";
import {ReservationCreationProps, ReservationInstance} from "../models/reservation.model";
import { Request, Response}                from "express";
import {UserInstance}                      from "../models/user.model";
import {SessionInstance}                   from "../models/session.model";
import {PlateInstance}                     from "../models/plate.model";
import { getLoggedUser }                   from '../middlewares/auth.middleware';


export class ReservationController {
 
    Reservation : ModelCtor<ReservationInstance>;
    User        : ModelCtor<UserInstance>;
    Session     : ModelCtor<SessionInstance>;
    Plate       : ModelCtor<PlateInstance>;
 
    private static instance: ReservationController;
 
    public static async getInstance(): Promise<ReservationController> {
        if(ReservationController.instance === undefined) {
            const { Reservation, User, Session, Plate } = await SequelizeManager.getInstance();
            ReservationController.instance = new ReservationController(Reservation, User, Session, Plate);
        }
        return ReservationController.instance;
    }
 
    private constructor(Reservation: ModelCtor<ReservationInstance>, User: ModelCtor<UserInstance>, Session: ModelCtor<SessionInstance>, Plate: ModelCtor<PlateInstance>) {
        this.Reservation = Reservation;
        this.User    = User;
        this.Session = Session;
        this.Plate   = Plate;
    }
 
    public async getAll(): Promise<ReservationInstance[] | null> {
 
        const reservations = await this.Reservation.findAll({
            attributes: ['id', 'date', 'received', 'UserId', 'PlateId'],
            include: [{ model: this.User, attributes: ['id', 'username', 'firstname', 'lastname', 'address', 'cantEat'],
            include: [{ model: this.Plate, attributes: ['id', 'name', 'photo', 'quantity', 'comment'] 
            }]}]
        });
        return reservations;
    }

    public async getBy(name: any): Promise<ReservationInstance | null> {
        const id = parseInt(name);
        let reservation;
        if(isNaN(id)){
            return null; //TODO
        }else{
            reservation = await this.Reservation.findOne({
                attributes: ['id', 'date', 'received', 'UserId', 'PlateId'],
                where: { id },
                include: [{ model: this.Plate, attributes: ['id', 'name', 'photo', 'quantity', 'comment'], 
                include: [{ model: this.User, attributes: ['id', 'username', 'firstname', 'lastname']}]}]
            })
        }
        if (reservation !== null) {
            return reservation;
        }
        return null;
    }
    
    /*
    public async create(props: ReservationCreationProps, plateId: number): Promise<ReservationInstance | null> {

        const plate  = await this.Plate.findOne({where: { id: plateId }});
        if (plate === null) {
            return null
        }
        const reservation = await this.Reservation.create(props);
        await reservation.setPlate(plate);
        return reservation;
    }*/

    public async create(props: ReservationCreationProps, plateId: number, req: Request, res: Response): Promise<ReservationInstance | null> {

        const user = await getLoggedUser(req);
        if (user === null) {
            return null
        }
        const plate  = await this.Plate.findOne({where: { id: plateId }});
        if (plate === null) {
            return null
        }
        const reservation = await this.Reservation.create(props);
        await reservation.setPlate(plate);
        await reservation.setUser(user);
        return reservation;
    }

    public async remove(by: any): Promise<ReservationInstance | null> {
        const reservation = await this.getBy(by);
        if (reservation !== null) {
            reservation.destroy();
            return reservation;
        }
        return null;
    }
}
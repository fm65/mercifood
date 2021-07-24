import { ModelCtor } from "sequelize";
import { SequelizeManager } from "../models";
import { PlateCreationProps, PlateInstance } from "../models/plate.model";
import { Request, Response } from "express";
import { UserInstance } from "../models/user.model";
import { SessionInstance } from "../models/session.model";
import { getLoggedUser } from '../middlewares/auth.middleware';


export class PlateController {

    Plate: ModelCtor<PlateInstance>;
    User: ModelCtor<UserInstance>;
    Session: ModelCtor<SessionInstance>;

    private static instance: PlateController;

    public static async getInstance(): Promise<PlateController> {
        if (PlateController.instance === undefined) {
            const { Plate, User, Session } = await SequelizeManager.getInstance();
            PlateController.instance = new PlateController(Plate, User, Session);
        }
        return PlateController.instance;
    }

    private constructor(Plate: ModelCtor<PlateInstance>, User: ModelCtor<UserInstance>, Session: ModelCtor<SessionInstance>) {
        this.Plate = Plate;
        this.User = User;
        this.Session = Session;
    }

    public async getAll(): Promise<PlateInstance[] | null> {

        const plates = await this.Plate.findAll({
            attributes: ['id', 'name', 'photo', 'quantity', 'number', 'comment', 'reserved'],
            include: { model: this.User, attributes: ['username', 'firstname', 'lastname'] },
        });
        return plates;
    }

    public async getBy(name: any): Promise<PlateInstance | null> {
        const id = parseInt(name);
        let plate;
        if (isNaN(id)) {
            plate = await this.Plate.findOne({ where: { name } })
        } else {
            plate = await this.Plate.findOne({ where: { id } })
        }
        if (plate !== null) {
            return plate;
        }
        return null;
    }

    // public async getByUser(id: any): Promise<PlateInstance[] | null> {
    //     const plates = await this.Plate.findAll({
    //         attributes: ['id', 'name', 'photo', 'quantity', 'number', 'comment', 'reserved'],
    //         include: { model: this.User, attributes: ['username', 'firstname', 'lastname'] },
    //     });

    //     const platesByUserID =  plates.filter(
    //         plate => plate.UserId === parseInt(id));
    //         console.log(parseInt(id))
    //     return platesByUserID;
    // }

    public async create(props: PlateCreationProps, req: Request, res: Response): Promise<PlateInstance | null> {

        const user = await getLoggedUser(req);
        if (user === null) {
            return null
        }
        const plate = await this.Plate.create(props);
        await plate.setUser(user);
        return plate;
    }

    public async remove(by: any): Promise<PlateInstance | null> {
        const plate = await this.getBy(by);
        if (plate !== null) {
            plate.destroy();
            return plate;
        }
        return null;
    }
}
import {Dialect}                                 from "sequelize/types/lib/sequelize";
import {ModelCtor, Sequelize}                    from "sequelize";
import userCreator, {UserInstance}               from "./user.model";
import sessionCreator, {SessionInstance}         from "./session.model";
import plateCreator, {PlateInstance}             from "./plate.model";
import recipeCreator, {RecipeInstance}           from "./recipe.model";
import reservationCreator, {ReservationInstance} from "./reservation.model";
import evaluationCreator, {EvaluationInstance}   from "./evaluation.model";

export interface SequelizeManagerProps {
    sequelize      : Sequelize;
    User           : ModelCtor<UserInstance>;
    Session        : ModelCtor<SessionInstance>;
    Plate          : ModelCtor<PlateInstance>;
    Recipe         : ModelCtor<RecipeInstance>;
    Reservation         : ModelCtor<ReservationInstance>;
    Evaluation     : ModelCtor<EvaluationInstance>;
}

export class SequelizeManager implements SequelizeManagerProps {

    private static instance?: SequelizeManager;

    sequelize      : Sequelize;
    User           : ModelCtor<UserInstance>;
    Session        : ModelCtor<SessionInstance>;
    Plate          : ModelCtor<PlateInstance>;
    Recipe         : ModelCtor<RecipeInstance>;
    Reservation         : ModelCtor<ReservationInstance>;
    Evaluation     : ModelCtor<EvaluationInstance>;

    private constructor(props: SequelizeManagerProps) {
        this.sequelize       = props.sequelize;
        this.User            = props.User;
        this.Session         = props.Session;
        this.Plate           = props.Plate;
        this.Recipe          = props.Recipe;
        this.Reservation          = props.Reservation;
        this.Evaluation      = props.Evaluation;
    }

    public static async getInstance(): Promise<SequelizeManager> {
        if(SequelizeManager.instance === undefined) {
            SequelizeManager.instance = await SequelizeManager.initialize();
        }
        return SequelizeManager.instance;
    }

    private static async initialize(): Promise<SequelizeManager> {
        const sequelize = new Sequelize({
            dialect : process.env.DB_DRIVER as Dialect,
            host    : process.env.DB_HOST,
            database: process.env.DB_NAME,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port    : Number.parseInt(process.env.DB_PORT as string), 
            
            define: {
                freezeTableName: true,
                paranoid       : true,
                timestamps     : true
            }
        });
        await sequelize.authenticate();
        const managerProps: SequelizeManagerProps = {
            sequelize,
            User           : userCreator(sequelize),
            Session        : sessionCreator(sequelize),
            Plate          : plateCreator(sequelize),
            Recipe         : recipeCreator(sequelize),
            Reservation         : reservationCreator(sequelize),
            Evaluation     : evaluationCreator(sequelize)
        }
        SequelizeManager.associate(managerProps);
        await sequelize.sync();
        return new SequelizeManager(managerProps);
    }

    private static associate(props: SequelizeManagerProps): void {
        props.User.hasMany(props.Session); 
        props.Session.belongsTo(props.User);
        
        props.User.hasMany(props.Plate);
        props.Plate.belongsTo(props.User);

        props.Plate.hasMany(props.Reservation);
        props.Reservation.belongsTo(props.Plate);

        props.User.hasMany(props.Reservation);
        props.Reservation.belongsTo(props.User);
        
        props.Reservation.hasMany(props.Evaluation);
        props.Evaluation.belongsTo(props.Reservation);
    }
}
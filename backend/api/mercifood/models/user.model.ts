import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    BelongsToManyAddAssociationMixin
} from "sequelize";

import {SessionInstance}    from "./session.model";
import {PlateInstance}      from "./plate.model";
import {EvaluationInstance} from "./evaluation.model";

export interface UserProps {
    id?      : number;
    firstname: string;
    lastname : string;
    username : string;
    password : string;
    email    : string;
    photo?   : string;
    number?  : string;
    address? : string;
    zipcode? : number;
    city?    : string;
    cantEat? : string;
    bio?     : string;
    role     : number;
    isAvailable: boolean;
}

export interface UserCreationProps extends UserProps {}

export interface UserInstance extends Model<UserProps, UserCreationProps>, UserProps {
    getSessions: HasManyGetAssociationsMixin<SessionInstance>;
    addSession : HasManyAddAssociationMixin<SessionInstance, "id">;
    
    getPlates: HasManyGetAssociationsMixin<PlateInstance>;
    addPlate : BelongsToManyAddAssociationMixin<PlateInstance, "id">;

    getEvaluations: HasManyGetAssociationsMixin<EvaluationInstance>;
    setEvaluation: BelongsToManyAddAssociationMixin<EvaluationInstance, "id">;
}

export default function(sequelize: Sequelize): ModelCtor<UserInstance> {
    return sequelize.define<UserInstance>("User", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey   : true,
            autoIncrement: true
        },
        firstname: {
            type  : DataTypes.STRING
        },
        lastname: {
            type  : DataTypes.STRING
        },
        username: {
            type  : DataTypes.STRING,
            unique: true
        },
        password: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        photo: {
            type: DataTypes.BLOB
        },
        number: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        },
        zipcode: {
            type: DataTypes.INTEGER
        },
        city: {
            type: DataTypes.STRING
        },
        cantEat: {
            type: DataTypes.STRING
        },
        bio: {
            type: DataTypes.STRING
        },
        role: {
            type : DataTypes.INTEGER
        },
        isAvailable: {
            type : DataTypes.BOOLEAN
        }
    });
}
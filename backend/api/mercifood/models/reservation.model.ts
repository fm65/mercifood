import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    BelongsToSetAssociationMixin,
    BelongsToGetAssociationMixin
} from "sequelize";

import {PlateInstance} from "./plate.model";
import {UserInstance} from "./user.model";

export interface ReservationProps {
    id?     : number;
    date    : string;
    received: boolean;
    UserId?:  number;
    PlateId?: number;
}

export interface ReservationCreationProps extends ReservationProps {}

export interface ReservationInstance extends Model<ReservationProps, ReservationCreationProps>, ReservationProps {
    setPlate: BelongsToSetAssociationMixin<PlateInstance, "id">;
    getPlate: BelongsToGetAssociationMixin<PlateInstance>;
    setUser: BelongsToSetAssociationMixin<UserInstance, "id">;
    getUser: BelongsToGetAssociationMixin<UserInstance>;
}

export default function(sequelize: Sequelize): ModelCtor<ReservationInstance> {
    return sequelize.define<ReservationInstance>("Reservation", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey   : true,
            autoIncrement: true
        },
        date: {
            type  : DataTypes.DATE
        },
        received: {
            type  : DataTypes.BOOLEAN
        }
    });
}
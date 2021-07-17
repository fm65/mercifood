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

export interface ReservationProps {
    id?     : number;
    date    : string;
    received: boolean;
    PlateId?: number;
}

export interface ReservationCreationProps extends ReservationProps {}

export interface ReservationInstance extends Model<ReservationProps, ReservationCreationProps>, ReservationProps {
    setPlate: BelongsToSetAssociationMixin<PlateInstance, "id">;
    getPlate: BelongsToGetAssociationMixin<PlateInstance>;
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
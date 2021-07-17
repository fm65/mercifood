import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    BelongsToSetAssociationMixin,
    BelongsToGetAssociationMixin,
} from "sequelize";

import {UserInstance} from "./user.model";
import {ReservationInstance} from "./reservation.model";

export interface EvaluationProps {
    id?    : number;
    date   : string;
    rate   : boolean;
    comment: string;
    photo  : string;
    UserId?: number;
    ReservationId?: number;
}

export interface EvaluationCreationProps extends EvaluationProps {}

export interface EvaluationInstance extends Model<EvaluationProps, EvaluationCreationProps>, EvaluationProps {
    setUser: BelongsToSetAssociationMixin<UserInstance, "id">;
    getUser: BelongsToGetAssociationMixin<UserInstance>;

    setReservation: BelongsToSetAssociationMixin<ReservationInstance, "id">;
    getReservation: BelongsToGetAssociationMixin<ReservationInstance>;
}

export default function(sequelize: Sequelize): ModelCtor<EvaluationInstance> {
    return sequelize.define<EvaluationInstance>("Evaluation", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey   : true,
            autoIncrement: true
        },
        date: {
            type  : DataTypes.DATE
        },
        rate: {
            type  : DataTypes.BOOLEAN
        },
        comment: {
            type  : DataTypes.TEXT
        },
        photo: {
            type  : DataTypes.BLOB
        }
    });
}
import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    BelongsToSetAssociationMixin,
    BelongsToGetAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin
} from "sequelize";

import {UserInstance} from "./user.model";
import {RecipeInstance} from "./recipe.model";
import {ReservationInstance} from "./reservation.model";

export interface PlateProps {
    id?     : number;
    name    : string;
    photo   : string;
    quantity: number;
    number  : number;
    comment : string;
    reserved?: boolean;
    UserId? : number;
    RecipeId?: number;
}

export interface PlateCreationProps extends PlateProps {}

export interface PlateInstance extends Model<PlateProps, PlateCreationProps>, PlateProps {
    setUser: BelongsToSetAssociationMixin<UserInstance, "id">;
    getUser: BelongsToGetAssociationMixin<UserInstance>;

    getRecipe: BelongsToGetAssociationMixin<RecipeInstance>;
    setRecipe: BelongsToSetAssociationMixin<RecipeInstance, "id">;

    getReservations: HasManyGetAssociationsMixin<ReservationInstance>;
    addReservation : HasManyAddAssociationMixin<ReservationInstance, "id">;
}

export default function(sequelize: Sequelize): ModelCtor<PlateInstance> {
    return sequelize.define<PlateInstance>("Plate", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey   : true,
            autoIncrement: true
        },
        name: {
            type  : DataTypes.STRING
        },
        photo: {
            type  : DataTypes.BLOB
        },
        quantity: {
            type  : DataTypes.FLOAT
        },
        number: {
            type  : DataTypes.INTEGER
        },
        comment: {
            type  : DataTypes.TEXT
        },
        reserved: {
            type  : DataTypes.BOOLEAN
        }
    });
}
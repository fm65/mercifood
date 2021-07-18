import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
} from "sequelize";

import {PlateInstance} from "./plate.model";

export interface RecipeProps {
    id?       : number; 
    name      : number;
    ingredient: string;
    note      : string;
}

export interface RecipeCreationProps extends RecipeProps {}

export interface RecipeInstance extends Model<RecipeProps, RecipeCreationProps>, RecipeProps {
    getPlates: HasManyGetAssociationsMixin<PlateInstance>;
    addPlate : HasManyAddAssociationMixin<PlateInstance, "id">;
}

export default function(sequelize: Sequelize): ModelCtor<RecipeInstance> {
    return sequelize.define<RecipeInstance>("Recipe", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey   : true,
            autoIncrement: true
        },
        name: {
            type  : DataTypes.STRING
        },
        ingredient: {
            type  : DataTypes.STRING
        },
        note: {
            type: DataTypes.TEXT
        }
    });
}
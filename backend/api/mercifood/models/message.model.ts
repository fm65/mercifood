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

export interface MessageProps {
    id?     : number;
    text    : string;
    sendDate   : string;
    recipient?   : string;
    sender?   : string;
    UserId? : number;

}

export interface MessageCreationProps extends MessageProps {}

export interface MessageInstance extends Model<MessageProps, MessageCreationProps>, MessageProps {
    setUser: BelongsToSetAssociationMixin<UserInstance, "id">;
    getUser: BelongsToGetAssociationMixin<UserInstance>;
}

export default function(sequelize: Sequelize): ModelCtor<MessageInstance> {
    return sequelize.define<MessageInstance>("Message", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey   : true,
            autoIncrement: true
        },
        text: {
            type  : DataTypes.TEXT
        },
        sendDate: {
            type  : DataTypes.STRING
        }
        ,
        recipient: {
             type  : DataTypes.STRING
        },
        sender: {
             type  : DataTypes.STRING
        }
    });
}
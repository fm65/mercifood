import {ModelCtor}                         from "sequelize";
import {SequelizeManager}                  from "../models";
import {ReservationCreationProps, ReservationInstance} from "../models/reservation.model";
import { Request, Response}                from "express";
import {UserInstance}                      from "../models/user.model";
import {SessionInstance}                   from "../models/session.model";
import {PlateInstance}                     from "../models/plate.model";
import {RecipeCreationProps, RecipeInstance}                     from "../models/recipe.model";
import { getLoggedUser }                   from '../middlewares/auth.middleware';


export class RecipeController {
 
    Recipe : ModelCtor<RecipeInstance>;
    User        : ModelCtor<UserInstance>;
    Session     : ModelCtor<SessionInstance>;
    // Plate       : ModelCtor<PlateInstance>;
 
    private static instance: RecipeController;
 
    public static async getInstance(): Promise<RecipeController> {
        if(RecipeController.instance === undefined) {
            const { Recipe, User, Session } = await SequelizeManager.getInstance();
            RecipeController.instance = new RecipeController(Recipe, User, Session);
        }
        return RecipeController.instance;
    }
 
    private constructor(Recipe: ModelCtor<RecipeInstance>, User: ModelCtor<UserInstance>, Session: ModelCtor<SessionInstance>) {
        this.Recipe = Recipe;
        this.User    = User;
        this.Session = Session;
        // this.Plate   = Plate;
    }
 
    public async getAll(): Promise<RecipeInstance[] | null> {
 
        const recipes = await this.Recipe.findAll({
            attributes: ['id', 'name', 'ingredient', 'note'],
            // include: [{ model: this.Plate, attributes: ['id', 'name', 'photo', 'quantity', 'comment'], 
            // include: [{ model: this.User, attributes: ['id', 'username', 'firstname', 'lastname']}]}]
        });
        return recipes;
    }

    public async getBy(name: any): Promise<RecipeInstance | null> {
        const id = parseInt(name);
        let recipe;
        if(isNaN(id)){
            return null; //TODO
        }else{
            recipe = await this.Recipe.findOne({
                attributes: ['id', ',name', 'ingredient', 'note'],
                where: { id },
                // include: [{ model: this.Plate, attributes: ['id', 'name', 'photo', 'quantity', 'comment'], 
                // include: [{ model: this.User, attributes: ['id', 'username', 'firstname', 'lastname']}]}]
            })
        }
        if (recipe !== null) {
            return recipe;
        }
        return null;
    }
 
    public async create(props: RecipeCreationProps): Promise<RecipeInstance | null> {
        const recipe = await this.Recipe.create(props);
        return recipe;
    }

    public async remove(by: any): Promise<RecipeInstance | null> {
        const recipe = await this.getBy(by);
        if (recipe !== null) {
            recipe.destroy();
            return recipe;
        }
        return null;
    }
}
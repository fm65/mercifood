import express from "express";
import {check, validationResult} from 'express-validator';
import { RecipeController } from "../controllers/recipe.controller";
import { isAuth, hasRole} from '../middlewares/auth.middleware';

//const isAdmin = hasRole(1); 

const recipeRouter = express.Router();

recipeRouter.post("/", isAuth,
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const name     = req.body.name;
        const ingredient = req.body.ingredient;
        const note  = req.body.note;

        const recipeController = await RecipeController.getInstance();
        const recipe = await recipeController.create({
            name,
            ingredient,
            note
        },
        );
    if(recipe !== null) {
        res.status(201).json(recipe).end();
    } else {
        res.status(409).send({error: 'can not create recipe'}).end();
    }
});

recipeRouter.get("/", isAuth, async function(req, res) {
    const recipeController = await RecipeController.getInstance();
    const recipe = await recipeController.getAll();
    if(recipe !== null) {
        res.status(200);
        res.json(recipe);
    }else {
        res.status(404).end();
    }
});

recipeRouter.get("/:by", isAuth, async function(req,res) {
    const recipeController = await RecipeController.getInstance();
    const recipe = await recipeController.getBy(req.params.by);
    if(recipe !== null) {
        res.status(200).json(recipe).end();
    } else {
        res.status(404).send({error: 'field not found'}).end();
    }
})

recipeRouter.delete("/:by", isAuth, async function(req,res) {
    const recipeController = await RecipeController.getInstance();
    const recipe = await recipeController.remove(req.params.by);
    if(recipe !== null) {
        res.status(200).send({success: 'Deletion completed'}).end();
    } else {
        res.status(404).send({error: 'Not such reservation'}).end();
    }
})

export {
    recipeRouter
};
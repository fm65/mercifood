import express from "express";
import {check, validationResult} from 'express-validator';
import { UserController } from "../controllers/user.controller";
import { isAuth, hasRole} from '../middlewares/auth.middleware';

const isAdmin = hasRole(1); 

const userRouter = express.Router();

userRouter.get("/", isAuth, async function(req, res) {
    const plateController = await UserController.getInstance();
    const plate = await plateController.getAll();
    if(plate !== null) {
        res.status(200);
        res.json(plate);
    }else {
        res.status(404).end();
    }
});
userRouter.get("/availables", isAuth, async function(req, res) {
    const plateController = await UserController.getInstance();
    const plate = await plateController.getAll(true);
    if(plate !== null) {
        res.status(200);
        res.json(plate);
    }else {
        res.status(404).end();
    }
});
userRouter.get("/:by", isAuth, async function(req,res) {
    const userController = await UserController.getInstance();
    const user = await userController.getBy(req.params.by);
    if(user !== null) {
        res.status(200).json(user).end();
    } else {
        res.status(404).send({error: 'field not found'}).end();
    }
})

userRouter.put("/:by", isAuth, async function (req, res) {
    const userController = await UserController.getInstance();
    const user = await userController.getBy(req.params.by);
    if (user !== null) {
        await user.update({
            firstname  : req.body.firstname,
            lastname   : req.body.lastname,
            username   : req.body.name,
            password   : req.body.password,
            email      : req.body.email,
            photo      : req.body.photo,
            number     : req.body.number,
            address    : req.body.address,
            zipcode    : req.body.zipcode,
            city       : req.body.city,
            cantEat    : req.body.cantEat,
            bio        : req.body.bio,
            isAvailable: req.body.isAvailable
        })
        res.status(201).json(user).end();
    } else {
        res.status(404).send({error: "No such user"}).end();
    }
})

userRouter.delete("/:by", isAuth, isAdmin, async function(req,res) {
    const userController = await UserController.getInstance();
    const user = await userController.remove(req.params.by, req);
    if(user !== null) {
        res.status(200).send({success: 'Deletion completed'}).end();
    } else {
        res.status(404).send({error: 'Not such user'}).end();
    }
})

userRouter.delete("/unsuscribe/:by", isAuth, async function(req,res) {
    const userController = await UserController.getInstance();
    const user = await userController.remove(req.params.by, req, true);
    if(user !== null) {
        res.status(200).send({success: 'Deletion completed'}).end();
    } else {
        res.status(404).send({error: 'Not such user'}).end();
    }
})
export {
    userRouter
};
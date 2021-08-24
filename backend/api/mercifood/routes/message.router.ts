import express from "express";
import {check, validationResult} from 'express-validator';
import { MessageController } from "../controllers/message.controller";
import { UserController } from "../controllers/user.controller";
import { isAuth, hasRole} from '../middlewares/auth.middleware';
import { User } from "../models/chat.model";

//const isAdmin = hasRole(1); 

const messageRouter = express.Router();

messageRouter.post("/", isAuth,
        check('text').isLength({ max: 255 }),
        check('text').isLength({ min: 1 }),
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const text = req.body.text;
        const sendDate     = String(new Date());
        const recipient  = req.body.recipient;
        const sender  = req.body.sender;
        
        const messageController = await MessageController.getInstance();
        const message = await messageController.create({
            text,
            sendDate,
            recipient,
            sender
        },recipient,sender,req, res
        );
    if(message !== null) {
        res.status(201).json(message).end();
    } else {
        res.status(409).send({error: 'can not create message'}).end();
    }
});

messageRouter.get("/", isAuth, async function(req, res) {
    const messageController = await MessageController.getInstance();
    const message = await messageController.getAll();
    if(message !== null) {
        res.status(200);
        res.json(message);
    }else {
        res.status(404).end();
    }
});

messageRouter.get("/:id", isAuth, async function(req,res) {
    const messageController = await MessageController.getInstance();
    const message = await messageController.getByUser(req.params.id);
    if(message !== null) {
        res.status(200).json(message).end();
    } else {
        res.status(404).send({error: 'field not found'}).end();
    }
})

/*
messageRouter.delete("/:by", isAuth, async function(req,res) {
    const reservationController = await ReservationController.getInstance();
    const reservation = await reservationController.remove(req.params.by);
    if(reservation !== null) {
        res.status(200).send({success: 'Deletion completed'}).end();
    } else {
        res.status(404).send({error: 'Not such reservation'}).end();
    }
})*/

export {
    messageRouter
};
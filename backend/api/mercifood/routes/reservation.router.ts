import express from "express";
import {check, validationResult} from 'express-validator';
import { ReservationController } from "../controllers/reservation.controller";
import { isAuth, hasRole} from '../middlewares/auth.middleware';

//const isAdmin = hasRole(1); 

const reservationRouter = express.Router();

reservationRouter.post("/", isAuth,
    check('plateId').isInt({ gt: 0 }),
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const date     = String(new Date());;
        const received = false;
        const plateId  = req.body.plateId;

        const reservationController = await ReservationController.getInstance();
        const reservation = await reservationController.create({
            date,
            received
        },
        plateId
        );
    if(reservation !== null) {
        res.status(201).json(reservation).end();
    } else {
        res.status(409).send({error: 'can not create reservation'}).end();
    }
});

reservationRouter.get("/", isAuth, async function(req, res) {
    const reservationController = await ReservationController.getInstance();
    const reservation = await reservationController.getAll();
    if(reservation !== null) {
        res.status(200);
        res.json(reservation);
    }else {
        res.status(404).end();
    }
});

reservationRouter.get("/:by", isAuth, async function(req,res) {
    const reservationController = await ReservationController.getInstance();
    const reservation = await reservationController.getBy(req.params.by);
    if(reservation !== null) {
        res.status(200).json(reservation).end();
    } else {
        res.status(404).send({error: 'field not found'}).end();
    }
})

reservationRouter.delete("/:by", isAuth, async function(req,res) {
    const reservationController = await ReservationController.getInstance();
    const reservation = await reservationController.remove(req.params.by);
    if(reservation !== null) {
        res.status(200).send({success: 'Deletion completed'}).end();
    } else {
        res.status(404).send({error: 'Not such reservation'}).end();
    }
})

export {
    reservationRouter
};
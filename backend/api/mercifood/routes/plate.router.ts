import express from "express";
import {check, validationResult} from 'express-validator';
import { PlateController } from "../controllers/plate.controller";
import { isAuth, hasRole} from '../middlewares/auth.middleware';

//const isAdmin = hasRole(1); 

const plateRouter = express.Router();

plateRouter.post("/", isAuth,
    check('name').isLength({ min: 2 }),
    check('quantity').isNumeric(),
    check('number').isInt({ gt: 0 }),
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const name     = req.body.name;
        const quantity = req.body.quantity;
        const number   = req.body.number;
        const photo    = req.body.photo;
        const comment  = req.body.comment;
        const reserved = false;
        

        const plateController = await PlateController.getInstance();
        const plate = await plateController.create({
            name,
            photo,
            quantity,
            number,
            reserved,
            comment
        },
        req, res
        );
    if(plate !== null) {
        res.status(201).json(plate).end();
    } else {
        res.status(409).send({error: 'can not create plate'}).end();
    }
});

plateRouter.get("/", isAuth, async function(req, res) {
    const plateController = await PlateController.getInstance();
    const plate = await plateController.getAll();
    if(plate !== null) {
        res.status(200);
        res.json(plate);
    }else {
        res.status(404).end();
    }
});

plateRouter.get("/:by", isAuth, async function(req,res) {
    const plateController = await PlateController.getInstance();
    const plate = await plateController.getBy(req.params.by);
    if(plate !== null) {
        res.status(200).json(plate).end();
    } else {
        res.status(404).send({error: 'field not found'}).end();
    }
})

// plateRouter.get("/users/:by", isAuth, async function(req,res) {
//     const plateController = await PlateController.getInstance();
//     const plates = await plateController.getByUser(req.params.by);
//     if(plates !== null) {
//         res.status(200).json(plates).end();
//     } else {
//         res.status(404).send({error: 'field not found'}).end();
//     }
// })

plateRouter.delete("/:by", isAuth, async function(req,res) {
    const plateController = await PlateController.getInstance();
    const plate = await plateController.remove(req.params.by);
    if(plate !== null) {
        res.status(200).send({success: 'Deletion completed'}).end();
    } else {
        res.status(404).send({error: 'Not such plate'}).end();
    }
})

plateRouter.put("/:by", isAuth, async function (req, res) {
    const plateController = await PlateController.getInstance();
    const plate = await plateController.getBy(req.params.by);
    if (plate !== null) {
        await plate.update({ 
            name     : req.body.name,
            quantity : req.body.quantity,
            number   : req.body.number,
            photo    : req.body.photo,
            reserved : req.body.reserved,
            comment  : req.body.comment
        })
        res.status(201).json(plate).end();
    } else {
        res.status(404).send({error: "No such plate"}).end();
    }

})

export {
    plateRouter
};
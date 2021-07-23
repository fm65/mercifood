import express from "express";
import { check, validationResult } from 'express-validator';
import { AuthController } from "../controllers/auth.controller";
import { hash } from "bcrypt";

const authRouter = express.Router();

authRouter.post("/subscribe",
    check('firstname').isLength({ min: 2 }).isAlpha(),
    check('lastname').isLength({ min: 2 }).isAlpha(),
    check('username').isLength({ min: 4 }).isAlphanumeric(),
    check('password').isLength({ min: 8 }),
    check('email').isEmail(),
    //check('address').isLength({ min: 5 }),
    //check('zipcode').isLength({ min: 5, max: 5 }).isNumeric(),
    //check('city').isLength({ min: 2 }),
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const firstname   = req.body.firstname;
        const lastname    = req.body.lastname;
        const username    = req.body.username;
        const password    = req.body.password;
        const email       = req.body.email;
        const address     = null;
        const zipcode     = null;
        const city        = null;
        const role        = 0; // [0: 'user', 1: 'admin']
        const isAvailable = false;

        const authController = await AuthController.getInstance();
        const passwordHashed = await hash(password, 5);
        const user = await authController.subscribe({
            firstname,
            lastname,
            username,
            password: passwordHashed,
            email,
            role,
            isAvailable,
        });
        if (user !== null) {
            res.json(user);
            res.status(201).end();
        } else {
            res.status(409).end();
        }
    });

authRouter.post("/login", async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if (username === undefined || password === undefined) {
        res.status(400).end();
        return;
    }
    const authController = await AuthController.getInstance();
    const data = await authController.log(username, password);
    if (data === null) {
        res.status(404).send({error: 'Invalid user login'}).end();
        return;
    } else {
        res.json({
            token: data.session.token,
            user: data.user
        });
    }
});

export {
    authRouter
};
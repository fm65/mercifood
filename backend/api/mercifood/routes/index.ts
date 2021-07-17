import {Express}           from "express";
import {authRouter}        from "./auth.router";
import {plateRouter}       from "./plate.router";
import {userRouter}        from "./user.router";
import {reservationRouter} from "./reservation.router";
/*
import {recipeRouter} from "./recipe.router";
import { evaluationRouter } from "./evaluation.router";
*/

export function buildRoutes(app: Express) {
    app.use("/auth", authRouter);
    app.use("/plates", plateRouter);
    app.use("/users", userRouter);
    app.use("/reservations", reservationRouter);
    /*app.use("/recipes", recipeRouter);
    app.use("/evaluations", evaluationRouter);
    */
}
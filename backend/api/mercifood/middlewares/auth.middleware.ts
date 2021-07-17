import { Request, Response, NextFunction } from "express";
import { SequelizeManager }                from "../models";
import { UserInstance }                    from "../models/user.model";

export async function isAuth(req: Request, res: Response, next: NextFunction): Promise<void> {		
	
	const bearerHeader = req.headers['authorization'];
	if (bearerHeader) {
		const bearer = bearerHeader.split(' ');
		const bearerToken = bearer[1];

		const {Session} = await SequelizeManager.getInstance();
		const session = Session.findOne({
        	where: {token: bearerToken}
        }).then((sess) => {
        	if (!sess) {
        		res.status(401).json();
        		return;
        	}
        	
        }).catch((err) => {
			console.log(err);
			res.status(401).json();
			return;
		});
		next();
	} else {
		res.sendStatus(403);
		return;
	}
}

export const hasRole =  (role: number) => {

	return async function hasRole(req: Request, res: Response, next: NextFunction): Promise<void>{

		const bearerHeader = req.headers['authorization'];
		if (bearerHeader) {
			const bearer = bearerHeader.split(' ');
			const bearerToken = bearer[1];

			const {User, Session} = await SequelizeManager.getInstance();

			const session = await Session.findOne({
	        	where: {token: bearerToken}
	        });
			if (session === null) {
				res.status(401).send({error: "Unauthorized user"}).end();
				return;
			}
	        const user = await User.findOne({
	            	where: { id: session.UserId }
		    });
			if (user === null) {
				res.status(401).send({error: "Unauthorized user"}).end();
				return;
			}
			if(!user || (user.role != role)) {
				res.status(401).send({error: "Unauthorized user"}).end();
				return;
			}
			next();
		} else {
			res.sendStatus(403).send({error: "Empty token"}).end();
			return;
		}
	}
}

export async function getLoggedUser(req: Request): Promise<UserInstance | null> {

	const bearerHeader = req.headers['authorization'];
	if (bearerHeader) {
		const bearer = bearerHeader.split(' ');
		const bearerToken = bearer[1];

		const {User, Session}   = await SequelizeManager.getInstance();

		const session = await Session.findOne({
			where: {token: bearerToken}
		});
		if (session === null) {
			return null;
		}
		const user = await User.findOne({
				where: { id: session.UserId }
		});
		return user;
	}
	return null;
}
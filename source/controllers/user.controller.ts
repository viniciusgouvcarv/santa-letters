import bcrypt from 'bcrypt';
import 'reflect-metadata';
import { User, UserRole } from '../entity/User';
import { extractIpFromRequest } from '../config/common';
import { createConnection, DeleteResult } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import { Session, SessionStatus } from '../entity/Session';

const connection = createConnection({
    type: 'mysql',
    logging: false,
    synchronize: true,
    host: process.env.DATABASE_HOST,
    entities: ['source/entity/*.ts'],
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT as string)
});

const register = async (req: Request, res: Response) => {
    connection
        .then(async (connect) => {
            const user = new User();
            if (!req.body.username || !req.body.password)
                return res.status(400).json({ message: 'PROVIDE_USERNAME_AND_PASSWORD' });

            const checkUsername = await connect.manager.find(User, {
                where: { username: req.body.username }
            });

            if (checkUsername.length > 0)
                return res.status(400).json({ message: 'USERNAME_ALREADY_IN_USE' });

            user.username = req.body.username;
            user.passwordHash = await bcrypt.hash(req.body.password, 12);
            user.createdDate = new Date().toISOString();
            await connect.manager.save(User, user);

            const session = new Session();
            session.user = user;
            session.ip = extractIpFromRequest(req);
            const newSession = await connect.manager.save(Session, session);

            if (newSession.user) delete newSession.user.passwordHash;

            return res.status(201).json(newSession);
        })
        .catch((error) => console.log(error));
};

const login = async (req: Request, res: Response) => {
    connection
        .then(async (connect) => {
            if (!req.body.username || !req.body.password)
                return res.status(400).json({ message: 'PROVIDE_USERNAME_AND_PASSWORD' });

            const user = await connect.manager.findOne(User, {
                where: { username: req.body.username }
            });

            if (!user || !(await user.checkPassword(req.body.password))) {
                return res.status(404).json({ message: 'USER_NOT_FOUND' });
            }

            const session = new Session();
            session.user = user;
            session.ip = extractIpFromRequest(req);
            await connect.manager.save(session);

            if (session.user) delete session.user.passwordHash;

            return res.status(201).json(session);
        })
        .catch((error) => console.log(error));
};

const logout = async (req: Request, res: Response) => {
    connection
        .then(async (connect) => {
            const session = await connect.manager.findOne(Session, {
                where: { token: req.headers['x-access-token'], status: SessionStatus.ACTIVE }
            });

            if (!session) return res.status(401).json({ message: 'INVALID_TOKEN' });

            session.status = SessionStatus.LOGOUT;
            await connect.manager.save(session);
            return res.status(200).json({ message: 'LOGGED_OUT_SUCCESSFULLY' });
        })
        .catch((error) => console.log(error));
};

const listUsers = (req: Request, res: Response) => {
    connection
        .then(async (connect) => {
            const users = await connect.manager.find(User);

            const userList = users.map((user) => {
                delete user.passwordHash;
                return user;
            });

            return res.status(200).json(userList);
        })
        .catch((error) => console.log(error));
};

const readUser = (req: Request, res: Response, next: NextFunction) => {
    connection
        .then(async (connect) => {
            if (!req.params.id) return res.status(400).json({ message: 'ID_MUST_BE_PROVIDED' });

            const user = await connect.manager.findOne(User, req.params.id);
            if (!user) return res.status(400).json({ message: 'INVALID_ID' });

            delete user.passwordHash;
            return res.status(200).json(user);
        })
        .catch((error) => console.log(error));
};

const updateUser = (req: Request, res: Response, next: NextFunction) => {
    connection
        .then(async (connect) => {
            const session = await connect.manager.findOne(Session, {
                where: { token: req.headers['x-access-token'], status: SessionStatus.ACTIVE },
                relations: ['user']
            });

            if (!session || !session.user)
                return res.status(401).json({ message: 'INVALID_TOKEN' });

            if (req.body.username) session.user.username = req.body.username;
            if (req.body.password)
                session.user.passwordHash = await bcrypt.hash(req.body.password, 12);

            const newUser = await connect.manager.save(session.user);
            delete newUser.passwordHash;
            return res.status(201).json(newUser);
        })
        .catch((error) => console.log(error));
};

const changeUserRole = (req: Request, res: Response, next: NextFunction) => {
    connection
        .then(async (connect) => {
            const session = await connect.manager.findOne(Session, {
                where: { token: req.headers['x-access-token'], status: SessionStatus.ACTIVE },
                relations: ['user']
            });

            if (!session || !session.user)
                return res.status(401).json({ message: 'INVALID_TOKEN' });

            if (session.user.role !== UserRole.SANTA)
                return res.status(400).json({ message: 'ONLY_SANTA_CAN_CHANGE_USER_ROLES' });

            if (!Object.values(UserRole).includes(req.body.role))
                return res.status(400).json({ message: 'ROLE_NOT_ALLOWED' });

            if (!req.params.id) return res.status(400).json({ message: 'ID_MUST_BE_PROVIDED' });

            const user = await connect.manager.findOne(User, req.params.id);
            if (!user) return res.status(400).json({ message: 'INVALID_ID' });

            user.role = req.body.role;
            user.updatedDate = new Date().toISOString();

            const newUser = await connect.manager.save(user);
            delete newUser.passwordHash;
            return res.status(201).json(newUser);
        })
        .catch((error) => console.log(error));
};

const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    connection
        .then(async (connect) => {
            const session = await connect.manager.findOne(Session, {
                where: { token: req.headers['x-access-token'], status: SessionStatus.ACTIVE },
                relations: ['user']
            });

            if (!session || !session.user)
                return res.status(401).json({ message: 'INVALID_TOKEN' });

            await connect.manager.softDelete(User, session.user);
            return res.status(204).json(DeleteResult);
        })
        .catch((error) => console.log(error));
};

export default {
    login,
    logout,
    register,
    readUser,
    listUsers,
    deleteUser,
    updateUser,
    changeUserRole
};

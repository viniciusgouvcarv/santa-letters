import 'reflect-metadata';
import { UserRole } from '../entity/User';
import { Letter, LetterStatus } from '../entity/Letter';
import { Request, Response, NextFunction } from 'express';
import { Session, SessionStatus } from '../entity/Session';
import { createConnection, DeleteResult, getConnection } from 'typeorm';

require('dotenv').config();

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

const createLetter = async (req: Request, res: Response) => {
    connection
        .then(async (connect) => {
            const session = await connect.manager.findOne(Session, {
                where: { token: req.headers['x-access-token'], status: SessionStatus.ACTIVE },
                relations: ['user']
            });

            if (!session || !session.user)
                return res.status(401).json({ message: 'INVALID_TOKEN' });

            if (session.user.role !== UserRole.CHILD)
                return res.status(400).json({ message: 'ONLY_CHILD_CAN_WRITE_LETTERS' });

            if (!req.body.description || !req.body.title)
                res.status(400).json({ message: 'LETTER_MUST_CONTAIN_TITLE_AND_DESCRIPTION' });

            const letter = new Letter();
            letter.description = req.body.description;
            letter.title = req.body.title;
            letter.createdDate = new Date().toISOString();
            letter.user = session.user;

            await connect.manager.save(letter);
            return res.status(201).json(letter);
        })
        .catch((error) => console.log(error));
};

const listLetters = (_req: Request, res: Response) => {
    connection
        .then(async (connect) => {
            const letters = await connect.manager.find(Letter);
            return res.status(200).json(letters);
        })
        .catch((error) => console.log(error));
};

const readLetter = (req: Request, res: Response, next: NextFunction) => {
    connection
        .then(async (connect) => {
            if (!req.params.id) return res.status(400).json({ message: 'ID_MUST_BE_PROVIDED' });

            const letter = await connect.manager.findOne(Letter, req.params.id);
            if (!letter) return res.status(400).json({ message: 'INVALID_ID' });

            return res.status(200).json(letter);
        })
        .catch((error) => console.log(error));
};

const updateLetter = (req: Request, res: Response, next: NextFunction) => {
    connection
        .then(async (connect) => {
            const session = await connect.manager.findOne(Session, {
                where: {
                    token: req.headers['x-access-token'],
                    status: SessionStatus.ACTIVE
                },
                relations: ['user']
            });

            if (!session || !session.user)
                return res.status(401).json({ message: 'INVALID_TOKEN' });

            if (!req.params.id) return res.status(400).json({ message: 'ID_MUST_BE_PROVIDED' });

            const letter = await connect.manager.findOne(Letter, req.params.id, {
                where: { user: session.user }
            });

            if (!letter) return res.status(400).json({ message: 'INVALID_ID' });

            if (req.body.description) letter.description = req.body.description;
            if (req.body.title) letter.title = req.body.title;
            letter.status = LetterStatus.NOT_READ_BY_SANTA;

            const newLetter = await connect.manager.save(letter);
            return res.status(201).json(newLetter);
        })
        .catch((error) => console.log(error));
};

const changeLetterStatus = (req: Request, res: Response, next: NextFunction) => {
    connection
        .then(async (connect) => {
            const session = await connect.manager.findOne(Session, {
                where: { token: req.headers['x-access-token'], status: SessionStatus.ACTIVE },
                relations: ['user']
            });

            if (!session || !session.user)
                return res.status(401).json({ message: 'INVALID_TOKEN' });

            if (session.user.role !== UserRole.SANTA)
                return res.status(400).json({ message: 'ONLY_SANTA_CAN_CHANGE_LETTER_STATUS' });

            if (!req.params.id) return res.status(400).json({ message: 'ID_MUST_BE_PROVIDED' });

            const letter = await connect.manager.findOne(Letter, req.params.id);
            if (!letter) return res.status(400).json({ message: 'INVALID_ID' });

            if (!Object.values(LetterStatus).includes(req.body.status))
                return res.status(400).json({ message: 'STATUS_NOT_ALLOWED' });

            letter.status = req.body.status;

            await connect.manager.save(letter);
            return res.status(201).json(letter);
        })
        .catch((error) => console.log(error));
};

const deleteLetter = (req: Request, res: Response, next: NextFunction) => {
    connection
        .then(async (connect) => {
            const session = await connect.manager.findOne(Session, {
                where: {
                    token: req.headers['x-access-token'],
                    status: SessionStatus.ACTIVE
                },
                relations: ['user']
            });

            if (!session || !session.user)
                return res.status(401).json({ message: 'INVALID_TOKEN' });

            if (!req.params.id) return res.status(400).json({ message: 'ID_MUST_BE_PROVIDED' });

            const letter = await connect.manager.findOne(Letter, req.params.id, {
                where: { user: session.user }
            });

            if (!letter) return res.status(400).json({ message: 'INVALID_ID' });

            await connect.manager.softDelete(Letter, letter);
            return res.status(204).json(DeleteResult);
        })
        .catch((error) => console.log(error));
};

export default {
    readLetter,
    listLetters,
    deleteLetter,
    createLetter,
    updateLetter,
    changeLetterStatus
};

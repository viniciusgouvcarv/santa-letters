import { Request, Response, NextFunction } from 'express';
import 'reflect-metadata';
import { createConnection, DeleteResult, getConnection } from 'typeorm';
import { Letter, LetterStatus } from '../entity/Letter';

const connection = createConnection({
    type: 'mysql',
    host: 'us-cdbr-east-03.cleardb.com',
    port: 3306,
    username: 'bbfb737b2f125d',
    password: 'a9881502',
    database: 'heroku_c47c6fe10a176fe',
    synchronize: true,
    logging: false,
    entities: ['source/entity/*.ts']
});

const createLetter = async (req: Request, res: Response) => {
    connection
        .then(async (connect) => {
            const letter = new Letter();
            if (!req.body.description || !req.body.title)
                res.status(400).json({ message: 'LETTER_MUST_CONTAIN_TITLE_AND_DESCRIPTION' });

            letter.description = req.body.description;
            letter.title = req.body.title;
            letter.createdDate = new Date().toISOString();
            await getConnection()
                .createQueryBuilder()
                .insert()
                .into(Letter)
                .values([letter])
                .execute();
            // const newLetter = await connect.manager.create(Letter, letter);
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
            if (!req.params.id) return res.status(400).json({ message: 'ID_MUST_BE_PROVIDED' });

            const letter = await connect.manager.findOne(Letter, req.params.id);
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
            if (!req.params.id) return res.status(400).json({ message: 'ID_MUST_BE_PROVIDED' });

            const letter = await connect.manager.findOne(Letter, req.params.id);
            if (!letter) return res.status(400).json({ message: 'INVALID_ID' });

            await connect.manager.delete(Letter, letter);
            return res.status(204).json(DeleteResult);
        })
        .catch((error) => console.log(error));
};

const cleanLetters = (req: Request, res: Response) => {
    connection
        .then(async (connect) => {
            await getConnection().dropDatabase();
        })
        .catch((error) => console.log(error));
};

export default {
    readLetter,
    listLetters,
    cleanLetters,
    deleteLetter,
    createLetter,
    updateLetter,
    changeLetterStatus
};

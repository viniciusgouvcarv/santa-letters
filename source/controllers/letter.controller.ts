import { json } from 'body-parser';
import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';

const NAMESPACE = 'Letter Controller';

const listLetters = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Letter controller');

    return res.status(200).json({
        message: 'pong'
    });
};

export default { listLetters };

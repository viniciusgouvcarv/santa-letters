import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

import config from './config/config';
import logging from './config/logging';
import letterRoutes from './routes/letter.route';
import UserRoutes from './routes/user.route';

const NAMESPACE = 'Server';
const router = express();

/** Logging the request */
router.use((req, res, next) => {
    logging.info(
        NAMESPACE,
        `METHOD - [${req.method}], URL - [${req.url}], IP [${req.socket.remoteAddress}]`
    );

    res.on('finish', () => {
        logging.info(
            NAMESPACE,
            `METHOD - [${req.method}], URL - [${req.url}], IP [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`
        );
    });

    next();
});

/** Parsing the request */
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/** Rules of our API */
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Origin',
        'Origin, X-Request-With, Content-Type, Accept, Authorization'
    );

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
        return res.status(200).json();
    }

    next();
});

/** Routes */
router.use('/letter', letterRoutes);
router.use('/user', UserRoutes);

/** Error Handling */
router.use((req, res) => {
    const error = new Error('Not Found');

    return res.status(404).json({
        message: error.message
    });
});

/** Creating the server */
const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () =>
    logging.info(NAMESPACE, `Server running on ${config.server.hostname}:${config.server.port}`)
);

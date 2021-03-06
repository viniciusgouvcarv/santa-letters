import express from 'express';
import controller from '../controllers/letter.controller';

const router = express.Router();

router.get('/ping', controller.listLetters);

export = router;

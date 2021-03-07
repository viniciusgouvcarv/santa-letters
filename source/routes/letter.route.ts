import express from 'express';
import controller from '../controllers/letter.controller';

const router = express.Router();

router.get('/list', controller.listLetters);
router.get('/read/:id', controller.readLetter);
router.post('/create', controller.createLetter);
router.put('/update/:id', controller.updateLetter);
router.patch('/changeStatus/:id', controller.changeLetterStatus);
router.delete('/delete/:id', controller.deleteLetter);
router.delete('/clean', controller.cleanLetters);

export = router;

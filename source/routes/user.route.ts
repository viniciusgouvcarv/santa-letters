import express from 'express';
import controller from '../controllers/user.controller';

const router = express.Router();

router.get('/list', controller.listUsers);
router.get('/read/:id', controller.readUser);
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.put('/update/', controller.updateUser);
router.patch('/changeRole/:id', controller.changeUserRole);
router.delete('/delete/', controller.deleteUser);

export = router;

import express from 'express';
import { test } from '../Controllers/user.controller.js';
import { verifyToken } from '../Utils/verifyToken.js';
import { updateUserInfo, deleteUserInfo, getUser, updateUserPassword } from '../Controllers/user.controller.js';


const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUserInfo);
router.delete('/delete/:id', verifyToken, deleteUserInfo);
router.post('/update-password/:id', verifyToken, updateUserPassword);
router.get('/:id', verifyToken, getUser)


export default router;
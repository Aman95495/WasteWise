import { signup, login, google, github, logout, sendVerificationCode, vendorSignup, vendorLogin, vendorLogout } from "../Controllers/auth.controller.js";
import express from 'express';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', google);
router.post('/github', github);
router.post('/logout', logout);
router.post('/send-verification-code', sendVerificationCode);
router.post('/vendor/signup', vendorSignup);
router.post('/vendor/login', vendorLogin);
router.post('/vendor/logout', vendorLogout);

export default router;
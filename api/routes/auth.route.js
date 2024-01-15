import express from 'express';
import { signup,signin, google, signout } from '../controllers/auth.controller.js';
import { varifyToken } from '../utils/varifyUser.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google)
router.get('/sign-out', signout)

export default router;
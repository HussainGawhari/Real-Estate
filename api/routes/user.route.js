import express from "express";
import { test, updateUser } from '../controllers/user.controller.js';
import { varifyToken } from "../utils/varifyUser.js";


const router = express.Router();

router.get('/test',test);
router.post('/update/:id',varifyToken, updateUser);
router.post('/delete/:id',varifyToken, deleteUser);

export default router;
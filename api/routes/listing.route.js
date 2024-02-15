import express from 'express';
import { varifyToken } from '../utils/varifyUser.js';
import { createListing, deleteListing } from '../controllers/listing.controller.js';

const router = express.Router();

router.post('/create', varifyToken, createListing);
router.delete('/delete/:id', varifyToken, deleteListing);



export default router;
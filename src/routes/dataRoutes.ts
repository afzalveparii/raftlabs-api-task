import express from 'express';
import { createData, getData } from '../controllers/dataController';
import { auth } from '../middlewares/auth';

const router = express.Router();

router.post('/', auth, createData);
router.get('/', auth, getData);

export default router;
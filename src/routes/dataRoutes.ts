import express from 'express';
import { DataController } from '../controllers/dataController';
import { auth } from '../middlewares/auth';

const router = express.Router();
const dataController = new DataController();

router.post('/', auth, (req, res) => dataController.createData(req, res));
router.get('/', auth, (req, res) => dataController.getData(req, res));
router.get('/getAllUsers', auth, (req, res) => dataController.getAllUsers(req, res));
router.put('/:id', auth, (req, res) => dataController.updateData(req, res));
router.delete('/', auth, (req, res) => dataController.deleteData(req, res));

export default router;
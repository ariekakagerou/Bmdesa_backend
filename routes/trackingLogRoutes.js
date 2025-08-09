import express from 'express';
import {
    getAllTrackingLogs,
    getTrackingLogsByShipment,
    createTrackingLog
} from '../controller/TrackingLogController.js';

const router = express.Router();

router.get('/', getAllTrackingLogs);
router.get('/:shipment_id', getTrackingLogsByShipment);
router.post('/', createTrackingLog);

export default router;
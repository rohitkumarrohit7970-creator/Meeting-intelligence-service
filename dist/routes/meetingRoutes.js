import { Router } from 'express';
import * as meetingController from '../controllers/meetingController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import * as aiService from '../services/aiService.js';
const router = Router();
router.use(authMiddleware);
router.post('/', meetingController.createMeeting);
router.get('/:id', meetingController.getMeeting);
router.get('/', meetingController.listMeetings);
router.post('/:id/analyze', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await aiService.analyzeMeeting(id, req.user.userId);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
export default router;

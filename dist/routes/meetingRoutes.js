import { Router } from 'express';
import * as meetingController from '../controllers/meetingController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import * as aiService from '../services/aiService.js';
const router = Router();
router.use(authMiddleware);
/**
 * @swagger
 * /api/meetings:
 *   post:
 *     summary: Create a new meeting
 *     tags: [Meetings]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, participants, meetingDate, transcript]
 *             properties:
 *               title: { type: string }
 *               participants: { type: array, items: { type: string } }
 *               meetingDate: { type: string, format: date-time }
 *               transcript:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     timestamp: { type: string }
 *                     speaker: { type: string }
 *                     text: { type: string }
 *     responses:
 *       201:
 *         description: Meeting created successfully
 */
router.post('/', meetingController.createMeeting);
/**
 * @swagger
 * /api/meetings/{id}:
 *   get:
 *     summary: Get meeting by ID
 *     tags: [Meetings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Meeting details
 */
router.get('/:id', meetingController.getMeeting);
/**
 * @swagger
 * /api/meetings:
 *   get:
 *     summary: List all meetings
 *     tags: [Meetings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of meetings
 */
router.get('/', meetingController.listMeetings);
/**
 * @swagger
 * /api/meetings/{id}/analyze:
 *   post:
 *     summary: Analyze meeting transcript
 *     tags: [Meetings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Analysis results
 */
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

import { Router } from 'express';
import * as actionItemController from '../controllers/actionItemController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = Router();
router.use(authMiddleware);
/**
 * @swagger
 * /api/action-items:
 *   post:
 *     summary: Create a manual action item
 *     tags: [Action Items]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [meetingId, task, assignee]
 *             properties:
 *               meetingId: { type: string, format: uuid }
 *               task: { type: string }
 *               assignee: { type: string }
 *               dueDate: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Action item created
 */
router.post('/', actionItemController.createActionItem);
/**
 * @swagger
 * /api/action-items/{id}/status:
 *   patch:
 *     summary: Update action item status
 *     tags: [Action Items]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [PENDING, IN_PROGRESS, COMPLETED] }
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', actionItemController.updateStatus);
/**
 * @swagger
 * /api/action-items:
 *   get:
 *     summary: Get all action items
 *     tags: [Action Items]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: assignee
 *         schema: { type: string }
 *       - in: query
 *         name: meetingId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of action items
 */
router.get('/', actionItemController.getActionItems);
/**
 * @swagger
 * /api/action-items/overdue:
 *   get:
 *     summary: Get overdue action items
 *     tags: [Action Items]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of overdue action items
 */
router.get('/overdue', actionItemController.getOverdueActionItems);
export default router;

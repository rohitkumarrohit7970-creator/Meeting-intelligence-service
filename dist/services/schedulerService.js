import cron from 'node-cron';
import prisma from '../config/prisma.js';
import * as actionItemService from './actionItemService.js';
import * as notificationService from './notificationService.js';
import logger from '../utils/logger.js';
export const initScheduler = () => {
    // Run every hour
    cron.schedule('0 * * * *', async () => {
        logger.info('Running scheduled job: Overdue Action Items Check');
        await checkAndNotifyOverdueItems();
    });
};
export const checkAndNotifyOverdueItems = async () => {
    try {
        const overdueItems = await actionItemService.getOverdueActionItems();
        for (const item of overdueItems) {
            const message = `🚨 *Overdue Action Item*\n*Task:* ${item.task}\n*Assigned To:* ${item.assignee}\n*Due Date:* ${item.dueDate ? new Date(item.dueDate).toLocaleString() : 'N/A'}`;
            try {
                await notificationService.sendSlackNotification(message);
                // Record reminder history
                await prisma.reminderHistory.create({
                    data: {
                        actionItemId: item.id,
                        status: 'SUCCESS',
                        sentAt: new Date(),
                    },
                });
            }
            catch (error) {
                await prisma.reminderHistory.create({
                    data: {
                        actionItemId: item.id,
                        status: 'FAILED',
                        error: error.message,
                        sentAt: new Date(),
                    },
                });
            }
        }
        logger.info(`Scheduled job completed. Notified ${overdueItems.length} items.`);
    }
    catch (error) {
        logger.error('Error in scheduled job', { error: error.message });
    }
};

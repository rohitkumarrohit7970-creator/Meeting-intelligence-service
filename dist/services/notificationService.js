import axios from 'axios';
import logger from '../utils/logger.js';
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
export const sendSlackNotification = async (message) => {
    if (!SLACK_WEBHOOK_URL || SLACK_WEBHOOK_URL.includes('YOUR/WEBHOOK/URL')) {
        logger.warn('Slack Webhook URL not configured. Skipping notification.');
        return;
    }
    try {
        await axios.post(SLACK_WEBHOOK_URL, {
            text: message,
        });
        logger.info('Slack notification sent successfully');
    }
    catch (error) {
        logger.error('Failed to send Slack notification', { error: error.message });
        throw error;
    }
};

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { requestTraceMiddleware, loggingMiddleware, unifiedResponseMiddleware } from './middleware/requestHandler.js';
import { globalErrorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';
import authRoutes from './routes/authRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import actionItemRoutes from './routes/actionItemRoutes.js';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
// Middleware
app.use(cors());
app.use(express.json());
app.use(requestTraceMiddleware);
app.use(loggingMiddleware);
app.use(unifiedResponseMiddleware);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'UP' });
});
// Evaluation endpoint
app.get('/api/evaluation', (req, res) => {
    res.json({
        candidateName: "Rohit Kumar",
        email: "rohit@example.com",
        repositoryUrl: "https://github.com/example/project",
        deployedUrl: "https://example.com",
        externalIntegration: "Slack Webhook",
        features: [
            "Authentication",
            "AI Analysis",
            "Meeting Management",
            "Action Item Management",
            "Validation & Error Handling"
        ]
    });
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/action-items', actionItemRoutes);
// Error handling
app.use(globalErrorHandler);
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});

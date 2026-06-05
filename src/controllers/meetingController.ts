import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import * as meetingService from '../services/meetingService.js';
import { z } from 'zod';

const createMeetingSchema = z.object({
  title: z.string().min(1),
  participants: z.array(z.string().email()),
  meetingDate: z.string().datetime(),
  transcript: z.array(z.object({
    timestamp: z.string(),
    speaker: z.string(),
    text: z.string(),
  })),
});

export const createMeeting = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const validatedData = createMeetingSchema.parse(req.body);
    const result = await meetingService.createMeeting(req.user!.userId, validatedData);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMeeting = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;
    const result = await meetingService.getMeeting(id, req.user!.userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const listMeetings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await meetingService.listMeetings(req.user!.userId, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

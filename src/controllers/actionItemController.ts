import { Request, Response, NextFunction } from 'express';
import * as actionItemService from '../services/actionItemService.js';
import { z } from 'zod';

const createActionItemSchema = z.object({
  meetingId: z.string().uuid(),
  task: z.string().min(1),
  assignee: z.string().min(1),
  dueDate: z.string().datetime().optional(),
  citations: z.array(z.any()).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
});

export const createActionItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createActionItemSchema.parse(req.body);
    const result = await actionItemService.createActionItem(validatedData);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;
    const validatedData = updateStatusSchema.parse(req.body);
    const result = await actionItemService.updateStatus(id, validatedData.status);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getActionItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      status: req.query.status as string,
      assignee: req.query.assignee as string,
      meetingId: req.query.meetingId as string,
    };
    const result = await actionItemService.getActionItems(filters);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOverdueActionItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await actionItemService.getOverdueActionItems();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

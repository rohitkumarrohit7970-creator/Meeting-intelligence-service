import prisma from '../config/prisma.js';
import { AppError } from '../middleware/errorHandler.js';

export const createActionItem = async (data: {
  meetingId: string;
  task: string;
  assignee: string;
  dueDate?: string;
  citations?: any[];
}) => {
  return await prisma.actionItem.create({
    data: {
      meetingId: data.meetingId,
      task: data.task,
      assignee: data.assignee,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      citations: data.citations ? JSON.stringify(data.citations) : null,
    },
  });
};

export const updateStatus = async (id: string, status: string) => {
  const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
  if (!validStatuses.includes(status)) {
    throw new AppError(400, 'INVALID_STATUS', `Status must be one of: ${validStatuses.join(', ')}`);
  }

  return await prisma.actionItem.update({
    where: { id },
    data: { status },
  });
};

export const getActionItems = async (filters: {
  status?: string;
  assignee?: string;
  meetingId?: string;
}) => {
  const where: any = {};
  if (filters.status) where.status = filters.status;
  if (filters.assignee) where.assignee = filters.assignee;
  if (filters.meetingId) where.meetingId = filters.meetingId;

  const items = await prisma.actionItem.findMany({ where });
  return items.map((item: any) => ({
    ...item,
    citations: item.citations ? JSON.parse(item.citations) : null,
  }));
}

export const getOverdueActionItems = async () => {
  const now = new Date();
  const items = await prisma.actionItem.findMany({
    where: {
      status: { not: 'COMPLETED' },
      dueDate: { lt: now },
    },
  });

  return items.map((item: any) => ({
    ...item,
    citations: item.citations ? JSON.parse(item.citations) : null,
  }));
};

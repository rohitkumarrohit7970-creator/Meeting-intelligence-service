import prisma from '../config/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
export const createMeeting = async (userId, data) => {
    return await prisma.meeting.create({
        data: {
            title: data.title,
            participants: JSON.stringify(data.participants),
            meetingDate: new Date(data.meetingDate),
            userId,
            transcripts: {
                create: data.transcript,
            },
        },
        include: {
            transcripts: true,
        },
    });
};
export const getMeeting = async (id, userId) => {
    const meeting = await prisma.meeting.findFirst({
        where: { id, userId },
        include: {
            transcripts: true,
            analysis: true,
            actionItems: true,
        },
    });
    if (!meeting) {
        throw new AppError(404, 'MEETING_NOT_FOUND', 'Meeting not found');
    }
    return {
        ...meeting,
        participants: JSON.parse(meeting.participants),
    };
};
export const listMeetings = async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [meetings, total] = await Promise.all([
        prisma.meeting.findMany({
            where: { userId },
            skip,
            take: limit,
            orderBy: { meetingDate: 'desc' },
        }),
        prisma.meeting.count({ where: { userId } }),
    ]);
    return {
        meetings: meetings.map((m) => ({ ...m, participants: JSON.parse(m.participants) })),
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

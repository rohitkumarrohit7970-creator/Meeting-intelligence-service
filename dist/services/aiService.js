import { Groq } from 'groq-sdk';
import prisma from '../config/prisma.js';
import { AppError } from '../middleware/errorHandler.js';
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});
export const analyzeMeeting = async (meetingId, userId) => {
    const meeting = await prisma.meeting.findFirst({
        where: { id: meetingId, userId },
        include: { transcripts: true },
    });
    if (!meeting) {
        throw new AppError(404, 'MEETING_NOT_FOUND', 'Meeting not found');
    }
    const transcriptText = meeting.transcripts
        .map((t) => `[${t.timestamp}] ${t.speaker}: ${t.text}`)
        .join('\n');
    const prompt = `
    Analyze the following meeting transcript and provide:
    1. A summary of the meeting.
    2. Action items identified, with assignees.
    3. Key decisions made.
    4. Follow-up suggestions.

    CRITICAL REQUIREMENT:
    Every insight (summary, action item, decision, follow-up) MUST include citations referencing the transcript segment(s) it was derived from.
    Citations should be in the format: [{"timestamp": "HH:MM"}].

    Format the output as a JSON object with the following structure:
    {
      "summary": [
        { "text": "...", "citations": [{ "timestamp": "..." }] }
      ],
      "actionItems": [
        { "task": "...", "assignee": "...", "citations": [{ "timestamp": "..." }] }
      ],
      "decisions": [
        { "text": "...", "citations": [{ "timestamp": "..." }] }
      ],
      "followUpSuggestions": [
        { "text": "...", "citations": [{ "timestamp": "..." }] }
      ]
    }

    Transcript:
    ${transcriptText}
  `;
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: 'You are a meeting intelligence assistant. You extract insights from transcripts and always provide citations.',
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        model: 'mixtral-8x7b-32768', // Or any other suitable model
        response_format: { type: 'json_object' },
    });
    const analysisResult = JSON.parse(completion.choices[0]?.message?.content || '{}');
    // Store the analysis
    await prisma.analysis.upsert({
        where: { meetingId },
        create: {
            meetingId,
            summary: JSON.stringify(analysisResult.summary),
            decisions: JSON.stringify(analysisResult.decisions),
            followUpSuggestions: JSON.stringify(analysisResult.followUpSuggestions),
        },
        update: {
            summary: JSON.stringify(analysisResult.summary),
            decisions: JSON.stringify(analysisResult.decisions),
            followUpSuggestions: JSON.stringify(analysisResult.followUpSuggestions),
        },
    });
    // Store action items
    if (analysisResult.actionItems) {
        // Clear existing action items for this meeting or update them? 
        // Requirement says "Create Action Item" and "Update Status". 
        // Usually, we'd want to sync them. For now, let's create them if they don't exist.
        for (const item of analysisResult.actionItems) {
            await prisma.actionItem.create({
                data: {
                    meetingId,
                    task: item.task,
                    assignee: item.assignee,
                    citations: JSON.stringify(item.citations),
                    status: 'PENDING',
                },
            });
        }
    }
    return analysisResult;
};

export const STUDY_COACH_SYSTEM = `You are CAMBA AI Study Coach — a friendly Cambridge English tutor for K12 Vietnamese students.
Analyze the student's learning data and return ONLY valid JSON:
{
  "dailyRecommendations": ["3 specific recommendations for today in Vietnamese"],
  "weeklyPlan": [
    { "day": "Thứ 2", "focus": "Reading", "tasks": ["task 1", "task 2"] }
  ],
  "progressSummary": "Brief progress summary in Vietnamese",
  "motivationMessage": "Encouraging message in Vietnamese",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "suggestedActions": [
    { "type": "lesson|review|mock_test|practice", "title": "Action title", "description": "Why this helps" }
  ]
}
All text must be in Vietnamese. Be specific and actionable.`;

export function buildStudyCoachPrompt(data: {
  studentName: string;
  currentLevel: string;
  totalXp: number;
  streak: number;
  recentAccuracy: number;
  completedLessons: number;
  weakSkills: string[];
}): string {
  return `Generate a personalized study plan for this student:

Name: ${data.studentName}
Current Cambridge level: ${data.currentLevel}
Total XP: ${data.totalXp}
Current streak: ${data.streak} days
Recent accuracy: ${data.recentAccuracy}%
Completed lessons: ${data.completedLessons}
Weak skills: ${data.weakSkills.join(", ") || "None identified yet"}

Return JSON study coach response only.`;
}

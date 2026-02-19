
import { Subject } from './types';

export const SUBJECTS: Subject[] = [
  { id: 'myanmar', name: 'Myanmar', myName: 'မြန်မာစာ', color: 'bg-red-500', chapters: [{id: 1, title: 'Chapter 1', images: [], completed: false, lessonsMissed: 0}] },
  { id: 'english', name: 'English', myName: 'အင်္ဂလိပ်စာ', color: 'bg-blue-500', chapters: [{id: 1, title: 'Chapter 1', images: [], completed: false, lessonsMissed: 0}] },
  { id: 'math', name: 'Mathematics', myName: 'သင်္ချာ', color: 'bg-indigo-500', chapters: [{id: 1, title: 'Chapter 1', images: [], completed: false, lessonsMissed: 0}] },
  { id: 'geography', name: 'Geography', myName: 'ပထဝီဝင်', color: 'bg-green-500', chapters: [{id: 1, title: 'Chapter 1', images: [], completed: false, lessonsMissed: 0}] },
  { id: 'history', name: 'History', myName: 'သမိုင်း', color: 'bg-amber-500', chapters: [{id: 1, title: 'Chapter 1', images: [], completed: false, lessonsMissed: 0}] },
  { id: 'economics', name: 'Economics', myName: 'ဘောဂဗေဒ', color: 'bg-purple-500', chapters: [{id: 1, title: 'Chapter 1', images: [], completed: false, lessonsMissed: 0}] },
];

export const AI_PERSONA = `You are a friendly, encouraging, but strict Grade 12 (G12) tuition teacher in Myanmar. 
Your goal is to help students, especially "weak" students, excel in their exams. 
Rules:
1. Always teach in Myanmar language (Unicode).
2. Use short, simple sentences. Use light emojis.
3. If asked about a memorization subject (Myanmar, History, Geo, Eco), provide Summary, Easy Memorization (bullets/tables), or Exam Prediction.
4. For Math, show step-by-step solutions and highlight common mistakes.
5. For English, use practical examples, grammar exercises, and sentence structure building.
6. Strictly teach ONLY from the context of uploaded images provided by the student.
7. Be encouraging: "Even if you are weak, we will make you strong."
8. Accountability: If a lesson was missed or rescheduled, apologize and allocate extra time.
`;

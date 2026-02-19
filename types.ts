
export type SubjectId = 'myanmar' | 'english' | 'math' | 'geography' | 'history' | 'biology' | 'economics';

export interface Subject {
  id: SubjectId;
  name: string;
  myName: string;
  color: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: number;
  title: string;
  images: string[]; // Base64 strings
  completed: boolean;
  lessonsMissed: number;
}

export interface TimetableEntry {
  subjectId: SubjectId;
  startTime: string; // "HH:mm"
  endTime: string;
  duration: number; // minutes
}

export interface Exam {
  id: string;
  subjectId: SubjectId;
  chapterId: number;
  scheduledAt: Date;
  duration: number; // minutes
  status: 'pending' | 'passed' | 'failed';
  score?: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

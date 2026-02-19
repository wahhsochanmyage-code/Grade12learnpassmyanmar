
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Classroom from './components/Classroom';
import Timetable from './components/Timetable';
import ExamRoom from './components/ExamRoom';
import { SubjectId, TimetableEntry, Subject, Chapter } from './types';
import { SUBJECTS } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'classroom' | 'exam' | 'timetable'>('dashboard');
  const [currentSubjectId, setCurrentSubjectId] = useState<SubjectId>('myanmar');
  const [subjects, setSubjects] = useState<Subject[]>(SUBJECTS);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [isTimetableFixed, setIsTimetableFixed] = useState(false);

  // Auto-switch subject based on timetable
  useEffect(() => {
    if (!isTimetableFixed) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const currentSlot = timetable.find(t => t.startTime <= timeStr && t.endTime >= timeStr);
      if (currentSlot && currentSlot.subjectId !== currentSubjectId) {
        setCurrentSubjectId(currentSlot.subjectId);
        // Automatic move could be annoying, but requirements say "automatically moved"
        setActiveView('classroom');
        alert(`Time to study ${currentSlot.subjectId.toUpperCase()}!`);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [isTimetableFixed, timetable, currentSubjectId]);

  const handleUpdateChapter = (updatedChapter: Chapter) => {
    setSubjects(prev => prev.map(s => {
      if (s.id === currentSubjectId) {
        return {
          ...s,
          chapters: s.chapters.map(c => c.id === updatedChapter.id ? updatedChapter : c)
        };
      }
      return s;
    }));
  };

  const handleSetTimetable = (entries: TimetableEntry[]) => {
    setTimetable(entries);
    setIsTimetableFixed(true);
    setActiveView('dashboard');
  };

  const currentSubject = subjects.find(s => s.id === currentSubjectId)!;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        currentSubject={currentSubjectId} 
        onSelectSubject={setCurrentSubjectId} 
        activeView={activeView}
        onSelectView={setActiveView}
      />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {activeView === 'dashboard' && (
          <Dashboard 
            currentSubjectId={currentSubjectId}
            subjects={subjects}
            timetable={timetable}
            onStartStudy={() => setActiveView('classroom')}
            onEnterExam={() => setActiveView('exam')}
          />
        )}

        {activeView === 'classroom' && (
          <div className="h-[calc(100vh-64px)]">
             <Classroom 
               subject={currentSubject} 
               onUpdateChapter={handleUpdateChapter} 
             />
          </div>
        )}

        {activeView === 'timetable' && (
          <div className="max-w-4xl mx-auto">
            <Timetable 
              timetable={timetable} 
              onSetTimetable={handleSetTimetable} 
              isFixed={isTimetableFixed} 
            />
          </div>
        )}

        {activeView === 'exam' && (
          <div className="h-[calc(100vh-64px)]">
            <ExamRoom 
              subject={currentSubject} 
              onFinish={(score) => {
                alert(`Exam Finished! Your score: ${score}`);
                setActiveView('dashboard');
              }} 
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

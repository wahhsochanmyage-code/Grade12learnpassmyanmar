
import React from 'react';
import { SUBJECTS } from '../constants';
import { SubjectId } from '../types';

interface SidebarProps {
  currentSubject: SubjectId;
  onSelectSubject: (id: SubjectId) => void;
  activeView: 'dashboard' | 'classroom' | 'exam' | 'timetable';
  onSelectView: (view: 'dashboard' | 'classroom' | 'exam' | 'timetable') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSubject, onSelectSubject, activeView, onSelectView }) => {
  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col shadow-sm fixed left-0 top-0 z-10">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
          <span>🎓</span> Shwe G12
        </h1>
        <p className="text-xs text-gray-500 mt-1 myanmar-text">အားမငယ်နဲ့၊ တို့အတူတူကြိုးစားမယ်</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <button 
          onClick={() => onSelectView('dashboard')}
          className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeView === 'dashboard' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'hover:bg-gray-50 text-gray-600'}`}
        >
          🏠 Home
        </button>
        <button 
          onClick={() => onSelectView('timetable')}
          className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeView === 'timetable' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'hover:bg-gray-50 text-gray-600'}`}
        >
          📅 Timetable
        </button>

        <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Classrooms
        </div>
        {SUBJECTS.map((sub) => (
          <button
            key={sub.id}
            onClick={() => {
              onSelectSubject(sub.id);
              onSelectView('classroom');
            }}
            className={`w-full text-left px-4 py-3 rounded-xl flex flex-col transition-all ${
              currentSubject === sub.id && activeView === 'classroom'
                ? 'bg-indigo-600 text-white shadow-md transform scale-[1.02]'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <span className="text-sm font-medium">{sub.name}</span>
            <span className="text-xs opacity-80 myanmar-text">{sub.myName}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t bg-gray-50">
        <div className="bg-white p-3 rounded-lg shadow-sm border border-indigo-100">
          <p className="text-[10px] text-indigo-500 font-bold uppercase">Study Streak</p>
          <p className="text-lg font-bold">🔥 5 Days</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;


import React from 'react';
import { SubjectId, TimetableEntry, Subject } from '../types';

interface DashboardProps {
  currentSubjectId: SubjectId;
  subjects: Subject[];
  timetable: TimetableEntry[];
  onStartStudy: () => void;
  onEnterExam: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentSubjectId, subjects, timetable, onStartStudy, onEnterExam }) => {
  const currentSubject = subjects.find(s => s.id === currentSubjectId);
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  const currentSlot = timetable.find(t => t.startTime <= timeStr && t.endTime >= timeStr);
  const nextSlot = timetable.find(t => t.startTime > timeStr);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-xl">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Welcome Back, Champion!</h2>
          <p className="myanmar-text text-indigo-100 max-w-xl text-lg">
            အားမငယ်နဲ့၊ တို့အဖွဲ့မှာ ညံ့တဲ့သူမရှိဘူး။ ကြိုးစားတဲ့သူပဲ ရှိတယ်။ အခုချက်ချင်း စာပြန်စရအောင်။
          </p>
          <div className="mt-8 flex gap-4">
            <button 
              onClick={onStartStudy}
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2"
            >
              📖 Go to Classroom
            </button>
            <button 
              onClick={onEnterExam}
              className="bg-indigo-400/30 border border-white/20 px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-all"
            >
              📝 Take Exam
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10 scale-150">
          🎓
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Task */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              Now Studying
            </h3>
            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{timeStr}</span>
          </div>
          
          <div className="flex items-center gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-100">
             <div className={`w-16 h-16 ${currentSubject?.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                {currentSubject?.id === 'math' ? '🧮' : '📚'}
             </div>
             <div>
                <h4 className="text-2xl font-black text-gray-800 uppercase tracking-tight">{currentSubject?.name}</h4>
                <p className="myanmar-text text-gray-500">{currentSubject?.myName}</p>
                <p className="text-xs font-bold text-indigo-500 mt-1 uppercase tracking-widest">{currentSlot?.startTime} - {currentSlot?.endTime}</p>
             </div>
             <div className="ml-auto">
                <button 
                  onClick={onStartStudy}
                  className="bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:rotate-12 transition-all"
                >
                  ▶️
                </button>
             </div>
          </div>

          <div className="mt-8">
            <h4 className="font-bold text-gray-800 mb-4">Today's Goals</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-white border rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded text-indigo-600" />
                <span className="text-sm text-gray-700">Finish Chapter 1 Notes (Myanmar)</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-white border rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded text-indigo-600" />
                <span className="text-sm text-gray-700">Submit Math Homework (Matrices)</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-white border rounded-xl hover:shadow-md transition-shadow cursor-pointer opacity-50">
                <input type="checkbox" disabled className="w-5 h-5 rounded" />
                <span className="text-sm text-gray-700 italic line-through">Memorize Geography Summary</span>
              </label>
            </div>
          </div>
        </div>

        {/* Sidebar Mini Tasks */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="font-bold text-gray-800 mb-4">Next Class</h3>
            {nextSlot ? (
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center text-xl">⏳</div>
                <div>
                  <p className="font-bold text-amber-800">{subjects.find(s => s.id === nextSlot.subjectId)?.name}</p>
                  <p className="text-xs text-amber-600">{nextSlot.startTime}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No more classes today. Rest well!</p>
            )}
          </div>

          <div className="bg-indigo-600 rounded-2xl p-6 shadow-xl text-white">
            <h3 className="font-bold mb-2">Teacher's Note</h3>
            <p className="text-sm myanmar-text text-indigo-100 italic leading-relaxed">
              "သင်္ချာက ခက်တယ်မထင်နဲ့၊ အခြေခံကစရင် အားလုံးဖြစ်နိုင်ပါတယ်။ မေးခွန်းတွေ အများကြီးမေးပါ။ ငါက မင်းတို့ဘက်မှာ အမြဲရှိတယ်။"
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">👨‍🏫</div>
              <span className="text-xs font-bold uppercase">AI Teacher</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

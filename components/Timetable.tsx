
import React, { useState } from 'react';
import { TimetableEntry } from '../types';
import { SUBJECTS } from '../constants';

interface TimetableProps {
  timetable: TimetableEntry[];
  onSetTimetable: (entries: TimetableEntry[]) => void;
  isFixed: boolean;
}

const Timetable: React.FC<TimetableProps> = ({ timetable, onSetTimetable, isFixed }) => {
  const [proposed, setProposed] = useState<TimetableEntry[]>([
    { subjectId: 'myanmar', startTime: '08:00', endTime: '09:30', duration: 90 },
    { subjectId: 'english', startTime: '09:45', endTime: '11:15', duration: 90 },
    { subjectId: 'math', startTime: '12:30', endTime: '14:30', duration: 120 },
    { subjectId: 'history', startTime: '14:45', endTime: '16:00', duration: 75 },
    { subjectId: 'geography', startTime: '19:00', endTime: '20:30', duration: 90 },
  ]);

  if (isFixed) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Fixed Timetable</h2>
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Locked 🔒</span>
        </div>
        <div className="space-y-3">
          {timetable.map((entry, idx) => {
            const sub = SUBJECTS.find(s => s.id === entry.subjectId);
            return (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                <div className="w-20 text-sm font-bold text-indigo-600">{entry.startTime}</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{sub?.name}</p>
                  <p className="text-xs text-gray-500 myanmar-text">{sub?.myName}</p>
                </div>
                <div className="text-xs font-medium text-gray-400">{entry.duration} mins</div>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-xs text-gray-400 italic">"Once the AI sets the path, the student must walk it."</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Timetable Consultation</h2>
        <p className="text-sm text-gray-500 mt-1 myanmar-text">AI ဆရာနဲ့ တိုင်ပင်ပြီး သင်ခန်းစာဇယားကို အတည်ပြုပါ။ အတည်ပြုပြီးရင် ပြင်လို့မရတော့ပါဘူး။</p>
      </div>

      <div className="space-y-4 mb-8">
        {proposed.map((entry, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
             <select 
               className="bg-white border rounded-lg px-2 py-1 text-sm font-medium"
               value={entry.subjectId}
               onChange={(e) => {
                 const newProposed = [...proposed];
                 newProposed[idx].subjectId = e.target.value as any;
                 setProposed(newProposed);
               }}
             >
               {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
             </select>
             <div className="flex items-center gap-2">
               <input 
                 type="time" 
                 className="bg-white border rounded-lg px-2 py-1 text-sm" 
                 value={entry.startTime}
                 onChange={(e) => {
                   const newProposed = [...proposed];
                   newProposed[idx].startTime = e.target.value;
                   setProposed(newProposed);
                 }}
               />
               <span>to</span>
               <input 
                 type="time" 
                 className="bg-white border rounded-lg px-2 py-1 text-sm" 
                 value={entry.endTime}
                 onChange={(e) => {
                    const newProposed = [...proposed];
                    newProposed[idx].endTime = e.target.value;
                    setProposed(newProposed);
                  }}
               />
             </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => onSetTimetable(proposed)}
        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
      >
        <span>✅ Finalize & Lock Timetable</span>
      </button>
    </div>
  );
};

export default Timetable;

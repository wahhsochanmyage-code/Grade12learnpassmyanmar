
import React, { useState, useEffect } from 'react';
import { Exam, Subject } from '../types';
import { generateExam } from '../services/gemini';

interface ExamRoomProps {
  subject: Subject;
  onFinish: (score: number) => void;
}

const ExamRoom: React.FC<ExamRoomProps> = ({ subject, onFinish }) => {
  const [examData, setExamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(1200); // 20 mins
  const [isCheatDetected, setIsCheatDetected] = useState(false);

  useEffect(() => {
    const loadExam = async () => {
      try {
        const data = await generateExam(subject.name, "Chapter 1", subject.chapters[0].images);
        setExamData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadExam();

    // Discipline Check
    const handleBlur = () => {
      setIsCheatDetected(true);
    };
    window.addEventListener('blur', handleBlur);

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      window.removeEventListener('blur', handleBlur);
      clearInterval(timer);
    };
  }, [subject]);

  if (isCheatDetected) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-red-50 p-8 text-center rounded-2xl">
        <h2 className="text-4xl font-bold text-red-600 mb-4">EXAM FAILED ❌</h2>
        <p className="text-red-500 font-bold mb-4">DISCIPLINE BREACH: Screen focus lost.</p>
        <p className="text-gray-600 myanmar-text">စာမေးပွဲခန်းထဲကနေ ထွက်သွားတဲ့အတွက် ကျရှုံးတယ်လို့ သတ်မှတ်ပါတယ်။ စည်းကမ်းက အရေးကြီးပါတယ်။</p>
        <button onClick={() => onFinish(0)} className="mt-8 bg-red-600 text-white px-8 py-3 rounded-lg">Return to Dashboard</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl p-8">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="myanmar-text text-gray-500">ဆရာက မေးခွန်းတွေ ထုတ်နေပါတယ်။ ခဏစောင့်ပေးပါ...</p>
      </div>
    );
  }

  const handleSubmit = () => {
    let score = 0;
    examData.questions.forEach((q: any) => {
      if (answers[q.id] === q.correctAnswer) score += q.marks;
    });
    onFinish(score);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-indigo-600">
      <div className="p-6 bg-indigo-600 text-white flex justify-between items-center sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-bold">{subject.name} Final Exam</h2>
          <p className="text-xs opacity-80 uppercase font-bold">Chapter 1 Test</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase font-bold opacity-80">Time Remaining</p>
          <p className={`text-2xl font-mono font-bold ${timeLeft < 60 ? 'animate-pulse text-red-300' : ''}`}>
            {formatTime(timeLeft)}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-12">
        {examData.questions.map((q: any, idx: number) => (
          <div key={q.id} className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex gap-3">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">{idx + 1}</span>
              {q.question}
            </h3>
            {q.options ? (
              <div className="grid grid-cols-1 gap-3 ml-11">
                {q.options.map((opt: string) => (
                  <label key={opt} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${answers[q.id] === opt ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name={`q-${q.id}`} 
                      className="w-4 h-4 text-indigo-600" 
                      checked={answers[q.id] === opt}
                      onChange={() => setAnswers({...answers, [q.id]: opt})}
                    />
                    <span className="text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            ) : (
              <textarea 
                className="w-full ml-11 p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                rows={4}
                placeholder="ဒီမှာ အဖြေရေးပါ..."
                onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
              />
            )}
          </div>
        ))}
      </div>

      <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
        <p className="text-sm text-gray-500 italic myanmar-text">စည်းကမ်းရှိရှိ ဖြေဆိုပါ။</p>
        <button 
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
        >
          Submit Exam
        </button>
      </div>
    </div>
  );
};

export default ExamRoom;

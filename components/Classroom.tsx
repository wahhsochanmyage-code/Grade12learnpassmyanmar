
import React, { useState, useRef, useEffect } from 'react';
import { Subject, Chapter, Message } from '../types';
import { getAITeacherResponse } from '../services/gemini';

interface ClassroomProps {
  subject: Subject;
  onUpdateChapter: (chapter: Chapter) => void;
}

const Classroom: React.FC<ClassroomProps> = ({ subject, onUpdateChapter }) => {
  const [currentChapter] = useState(subject.chapters[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Fix: Cast Array.from(files) to File[] to resolve "unknown" to "Blob" assignment error
    const filePromises = (Array.from(files) as File[]).map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(newImages => {
      const updatedChapter = { ...currentChapter, images: [...currentChapter.images, ...newImages] };
      onUpdateChapter(updatedChapter);
      
      // Initial teaching session
      if (currentChapter.images.length === 0) {
        handleSendMessage("မင်္ဂလာပါ။ ဒီသင်ခန်းစာကို စတင်သင်ကြားပေးပါဦး ဆရာ။");
      }
    });
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || currentChapter.images.length === 0) return;

    const newMessage: Message = { role: 'user', text: messageText };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setLoading(true);

    try {
      const context = `Teaching ${subject.name} - ${currentChapter.title}. Images uploaded: ${currentChapter.images.length}`;
      const response = await getAITeacherResponse(messageText, currentChapter.images, context);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "ဆောရီးပါ။ အင်တာနက်အနည်းငယ် အခက်အခဲရှိနေလို့ ပြန်ကြိုးစားပေးပါဦး။" }]);
    } finally {
      setLoading(false);
    }
  };

  if (currentChapter.images.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl shadow-sm border border-dashed border-indigo-200">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-3xl mb-4">📚</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Wait! Lesson images required.</h2>
        <p className="text-gray-500 myanmar-text mb-6">သင်ခန်းစာ ဓာတ်ပုံများ မတင်ရသေးဘဲ စာသင်လို့မရပါဘူး။ ဖတ်စာအုပ် ဒါမှမဟုတ် မှတ်စုပုံတွေ အရင်တင်ပေးပါ။</p>
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          📷 Upload Lesson Images
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-indigo-600 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">👨‍🏫</div>
          <div>
            <p className="text-xs opacity-80 uppercase font-bold tracking-wider">{subject.name} Teacher</p>
            <h3 className="font-bold myanmar-text">{currentChapter.title} - သင်ကြားနေသည်</h3>
          </div>
        </div>
        <div className="flex gap-2">
           <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium">📷 {currentChapter.images.length} Images</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-tl-none myanmar-text leading-relaxed'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 p-4 rounded-2xl shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
              <span className="text-xs text-gray-400 ml-2">Teacher is typing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Chips */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t bg-gray-50/50">
        <button 
          onClick={() => handleSendMessage("ဒီသင်ခန်းစာကို အချက် (၅) ချက်နဲ့ အကျဉ်းချုပ်ပေးပါ။")}
          className="whitespace-nowrap px-3 py-1.5 bg-white border rounded-full text-xs text-indigo-600 hover:bg-indigo-50 transition-colors myanmar-text"
        >
          📌 အကျဉ်းချုပ်ပေးပါ
        </button>
        <button 
          onClick={() => handleSendMessage("ကျက်ရလွယ်အောင် Bullet points လေးတွေနဲ့ ပြောပြပေးပါ။")}
          className="whitespace-nowrap px-3 py-1.5 bg-white border rounded-full text-xs text-indigo-600 hover:bg-indigo-50 transition-colors myanmar-text"
        >
          💡 ကျက်ရလွယ်တဲ့နည်း
        </button>
        <button 
          onClick={() => handleSendMessage("ဒီအခန်းက စာမေးပွဲမှာ ဘယ်လိုမေးလေ့ရှိလဲ?")}
          className="whitespace-nowrap px-3 py-1.5 bg-white border rounded-full text-xs text-indigo-600 hover:bg-indigo-50 transition-colors myanmar-text"
        >
          📝 စာမေးပွဲ ခန့်မှန်းချက်
        </button>
        <button 
          onClick={() => handleSendMessage("ဥပမာအလွယ်ဆုံးတွေနဲ့ ရှင်းပြပေးပါခင်ဗျာ။")}
          className="whitespace-nowrap px-3 py-1.5 bg-white border rounded-full text-xs text-indigo-600 hover:bg-indigo-50 transition-colors myanmar-text"
        >
          🍎 ဥပမာအလွယ်ပေးပါ
        </button>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="မေးချင်တာမေးပါ (ဥပမာ- ဒါကိုမနားလည်ဘူး ရှင်းပြပါ)"
          className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none myanmar-text"
        />
        <button 
          disabled={loading || !input.trim()}
          onClick={() => handleSendMessage()}
          className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md"
        >
          🚀
        </button>
      </div>
    </div>
  );
};

export default Classroom;

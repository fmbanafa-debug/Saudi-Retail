import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, ShoppingBag, Zap, Award, Activity, 
  MessageSquare, Lock, Loader2, Sparkles, ArrowRight
} from 'lucide-react';

// المكون الرئيسي للتطبيق
const App = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isScrolled, setIsScrolled] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [cooldown, setCooldown] = useState(0); 
  const [dailyRequests, setDailyRequests] = useState(0);
  const DAILY_LIMIT = 15;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const saved = localStorage.getItem('banafa_v5_usage');
    const today = new Date().toDateString();
    if (saved) {
      const { count, date } = JSON.parse(saved);
      if (date === today) setDailyRequests(count);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleAiAnalysis = async () => {
    if (cooldown > 0 || dailyRequests >= DAILY_LIMIT || !aiPrompt) return;
    setIsLoading(true);
    setAiResponse('');
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await response.json();
      if (response.ok) {
        setAiResponse(data.candidates?.[0]?.content?.parts?.[0]?.text || 'تحليل غير متوفر.');
        const newCount = dailyRequests + 1;
        setDailyRequests(newCount);
        setCooldown(45);
        localStorage.setItem('banafa_v5_usage', JSON.stringify({ count: newCount, date: new Date().toDateString() }));
      } else {
        setAiResponse(data.error || 'خطأ من الخادم.');
      }
    } catch (err) {
      setAiResponse('خطأ اتصال: تحقق من إعداد GEMINI_API_KEY في Vercel.');
    } finally {
      setIsLoading(false);
    }
  };

  const growthData = [
    { year: '2024', sallah: 400, qstore: 240, deal: 180 },
    { year: '2026', sallah: 510, qstore: 450, deal: 300 },
    { year: '2030', sallah: 800, qstore: 1100, deal: 820 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className={`fixed top-0 w-full z-50 transition-all ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 font-black">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">B</div>
            <span>BANAFA'S</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-xl text-sm font-bold ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>المقارنة</button>
            <button onClick={() => setActiveTab('data')} className={`px-4 py-2 rounded-xl text-sm font-bold ${activeTab === 'data' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>المؤشرات</button>
          </div>
          <button onClick={() => setIsAiModalOpen(true)} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            <Sparkles size={16} /> المحلل
          </button>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['الصالة الاقتصادية', 'متجر كيو', 'متجر ديل'].map((name, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6"><ShoppingBag /></div>
                <h3 className="text-xl font-black mb-4">{name}</h3>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{width: `${90 - i*10}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-[2rem] shadow-xl h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="sallah" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.1} />
                <Area type="monotone" dataKey="qstore" stroke="#10b981" fill="#10b981" fillOpacity={0.05} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </main>

      {isAiModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAiModalOpen(false)}></div>
          <div className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-lg flex items-center gap-2"><Sparkles className="text-indigo-600" /> Banafa AI</h3>
              <button onClick={() => setIsAiModalOpen(false)}>✕</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold tracking-tighter">الطلبات: {dailyRequests}/{DAILY_LIMIT}</span>
                {cooldown > 0 && <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">انتظار: {cooldown}ث</span>}
              </div>
              {aiResponse ? <div className="bg-slate-50 p-4 rounded-xl text-sm leading-relaxed">{aiResponse}</div> : <p className="text-center text-slate-400 py-10">اطرح سؤالك المالي...</p>}
              {isLoading && <Loader2 className="animate-spin text-indigo-600 mx-auto" />}
            </div>
            <div className="p-6 border-t flex gap-2 bg-white">
              <input type="text" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="اكتب سؤالك هنا..." className="flex-1 bg-slate-100 p-3 rounded-xl outline-none focus:ring-2 ring-indigo-500" onKeyPress={(e) => e.key === 'Enter' && handleAiAnalysis()} />
              <button disabled={isLoading || cooldown > 0 || dailyRequests >= DAILY_LIMIT || !aiPrompt} onClick={handleAiAnalysis} className="bg-indigo-600 text-white p-3 rounded-xl disabled:bg-slate-300 transition-all">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// تشغيل التطبيق
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

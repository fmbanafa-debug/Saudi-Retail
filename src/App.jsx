import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, ShoppingBag, Zap, Award, BarChart3, 
  Activity, MessageSquare, Lock, AlertCircle, Loader2, Sparkles, ArrowRight
} from 'lucide-react';

// تم دمج المكون في ملف واحد لحل مشكلة "Could not resolve ./App.jsx"
const App = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // AI Protection & State
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
    
    const saved = localStorage.getItem('banafa_v3_usage');
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
        setAiResponse(data.candidates?.[0]?.content?.parts?.[0]?.text || 'لم يتوفر تحليل.');
        const newCount = dailyRequests + 1;
        setDailyRequests(newCount);
        setCooldown(45);
        localStorage.setItem('banafa_v3_usage', JSON.stringify({ count: newCount, date: new Date().toDateString() }));
      } else {
        setAiResponse(data.error || 'خطأ في الخادم.');
      }
    } catch (err) {
      setAiResponse('خطأ في الاتصال. تأكد من إعداد المفتاح في Vercel.');
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
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-100">B</div>
            <h1 className="text-xl font-black">BANAFA'S</h1>
          </div>
          
          <nav className="hidden lg:flex bg-slate-100 p-1 rounded-2xl">
             {['overview', 'data'].map((tab) => (
               <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === tab ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
               >
                 {tab === 'overview' ? 'المقارنة' : 'المؤشرات'}
               </button>
             ))}
          </nav>

          <button 
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl"
          >
            <Sparkles size={18} />
            <span>المحلل الذكي</span>
          </button>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {activeTab === 'overview' && (
            <div className="space-y-12 animate-in fade-in duration-700">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">تحليل القوى الشرائية<br/><span className="text-indigo-600">للتجزئة السعودية</span></h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { name: 'الصالة الاقتصادية', color: 'bg-blue-600', val: 95, tag: 'زعيم التوفير' },
                        { name: 'متجر كيو', color: 'bg-emerald-600', val: 85, tag: 'الجودة الحديثة' },
                        { name: 'متجر ديل', color: 'bg-amber-500', val: 80, tag: 'سرعة الصفقات' }
                    ].map((store, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                            <div className={`${store.color} w-14 h-14 rounded-2xl mb-6 flex items-center justify-center text-white shadow-lg`}>
                                <ShoppingBag size={28} />
                            </div>
                            <h3 className="text-2xl font-black mb-1">{store.name}</h3>
                            <span className="text-xs font-bold text-indigo-600 uppercase mb-4 block">{store.tag}</span>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-4">
                                <div className={`h-full ${store.color}`} style={{width: `${store.val}%`}}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'data' && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 h-[450px] animate-in zoom-in-95 duration-500">
                <h3 className="text-xl font-black mb-8 flex items-center gap-2"><Activity className="text-indigo-600" /> توقعات النمو المالي 2030</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="sallah" name="الصالة" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.1} strokeWidth={3} />
                        <Area type="monotone" dataKey="qstore" name="كيو" stroke="#10b981" fill="#10b981" fillOpacity={0.05} strokeWidth={3} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        )}
      </main>

      {isAiModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsAiModalOpen(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <Sparkles className="text-indigo-600" size={24}/>
                <h3 className="text-2xl font-black">المحلل الذكي</h3>
              </div>
              <button onClick={() => setIsAiModalOpen(false)} className="text-slate-400">✕</button>
            </div>

            <div className="p-8 overflow-y-auto flex-1 space-y-6">
              <div className="flex gap-2">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${cooldown > 0 ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                  {cooldown > 0 ? `وضع الحماية: ${cooldown} ثانية` : 'النظام جاهز'}
                </div>
                <div className="px-4 py-1.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-600 uppercase">
                  الطلبات: {dailyRequests} / {DAILY_LIMIT}
                </div>
              </div>

              {aiResponse && (
                <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 text-sm leading-relaxed whitespace-pre-wrap">
                  {aiResponse}
                </div>
              )}
              {isLoading && <Loader2 className="animate-spin text-indigo-600 mx-auto" size={32} />}
            </div>

            <div className="p-8 bg-white border-t border-slate-100">
              <div className="relative">
                <input 
                  type="text" 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="اسأل عن توقعات متجر كيو..."
                  className="w-full bg-slate-50 border-2 border-transparent px-8 py-5 rounded-[2rem] focus:outline-none focus:border-indigo-600 transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleAiAnalysis()}
                />
                <button 
                  disabled={isLoading || cooldown > 0 || dailyRequests >= DAILY_LIMIT || !aiPrompt}
                  onClick={handleAiAnalysis}
                  className="absolute left-3 top-3 bottom-3 bg-indigo-600 text-white px-6 rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? '...' : <ArrowRight size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Mounting
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

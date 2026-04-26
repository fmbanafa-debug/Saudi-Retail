import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, ShoppingBag, Zap, Award, Activity, 
  MessageSquare, Lock, Loader2, Sparkles, ArrowRight,
  ShieldCheck, BarChart3, PieChart as PieIcon, ChevronRight, CheckCircle2
} from 'lucide-react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const App = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // AI States
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
    const saved = localStorage.getItem('banafa_v6_usage');
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
        setAiResponse(data.candidates?.[0]?.content?.parts?.[0]?.text || 'تحليل غير متوفر حالياً.');
        const newCount = dailyRequests + 1;
        setDailyRequests(newCount);
        setCooldown(45);
        localStorage.setItem('banafa_v6_usage', JSON.stringify({ count: newCount, date: new Date().toDateString() }));
      } else {
        setAiResponse(data.error || 'حدث خطأ في الخادم.');
      }
    } catch (err) {
      setAiResponse('خطأ اتصال: تأكد من إعداد مفتاح API في Vercel.');
    } finally {
      setIsLoading(false);
    }
  };

  // Data Sets
  const growthData = [
    { year: '2024', sallah: 400, qstore: 240, deal: 180 },
    { year: '2026', sallah: 510, qstore: 450, deal: 300 },
    { year: '2028', sallah: 680, qstore: 720, deal: 550 },
    { year: '2030', sallah: 850, qstore: 1100, deal: 820 },
  ];

  const marketShare = [
    { name: 'الصالة الاقتصادية', value: 45 },
    { name: 'متجر كيو', value: 32 },
    { name: 'متجر ديل', value: 23 },
  ];

  const capabilityMatrix = [
    { feature: 'تنوع السلع', sallah: 95, qstore: 75, deal: 80 },
    { feature: 'السعر التنافسي', sallah: 98, qstore: 82, deal: 90 },
    { feature: 'تجربة التطبيق', sallah: 45, qstore: 96, deal: 85 },
    { feature: 'سرعة التوصيل', sallah: 55, qstore: 88, deal: 94 },
  ];

  const storeCards = [
    {
      id: 'sallah',
      name: 'الصالة الاقتصادية',
      tag: 'زعيم التوفير التقليدي',
      color: 'bg-indigo-600',
      description: 'الرائد في مبيعات الجملة والتوفير العائلي الضخم والانتشار الجغرافي الواسع.',
      strengths: ['أسعار الجملة', 'تنوع غذائي هائل', 'فروع ضخمة'],
      score: 8.7
    },
    {
      id: 'qstore',
      name: 'متجر كيو (Q Store)',
      tag: 'تجربة التسوق العصرية',
      color: 'bg-emerald-600',
      description: 'الوجهة المفضلة للمنظفات والعناية الشخصية بتجربة رقمية فائقة السلاسة.',
      strengths: ['تطبيق ذكي', 'هوية بصرية قوية', 'منتجات حصرية'],
      score: 9.3
    },
    {
      id: 'deal',
      name: 'متجر ديل (Deal)',
      tag: 'قناص الصفقات اليومية',
      color: 'bg-amber-500',
      description: 'يتميز بسرعة دوران المخزون واقتناص الصفقات "الترند" في وقت قياسي.',
      strengths: ['عروض فلاش', 'لوجستيات سريعة', 'تنوع إلكتروني'],
      score: 8.9
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Navigation */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-slate-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-indigo-200 shadow-xl">B</div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black tracking-tight leading-none">BANAFA'S</h1>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Financial Analysis</p>
            </div>
          </div>
          
          <nav className="hidden lg:flex bg-slate-200/50 p-1 rounded-2xl border border-white/50">
             {[
               { id: 'overview', label: 'المقارنة الفنية' },
               { id: 'data', label: 'المؤشرات والنمو' },
               { id: 'future', label: 'رؤية 2030' }
             ].map((tab) => (
               <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === tab.id ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-indigo-500'}`}
               >
                 {tab.label}
               </button>
             ))}
          </nav>

          <button 
            onClick={() => setIsAiModalOpen(true)}
            className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            <Sparkles size={18} className="group-hover:animate-pulse" />
            <span className="hidden md:inline">المحلل الذكي</span>
          </button>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Tab 1: Overview & Cards */}
        {activeTab === 'overview' && (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <section className="text-center">
              <span className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-black mb-6 inline-block uppercase tracking-wider">تحليل حصري 2026</span>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">صراع العمالقة:<br/><span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">القيمة مقابل السعر</span></h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">تحليل عميق لأداء المتاجر الكبرى في السوق السعودي بمقاييس الكفاءة المالية واللوجستية.</p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {storeCards.map((store) => (
                <div key={store.id} className="group bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-2 h-full ${store.color}`}></div>
                  <div className="flex justify-between items-start mb-8">
                    <div className={`${store.color} p-4 rounded-2xl text-white shadow-lg shadow-current/20`}>
                      <ShoppingBag size={24} />
                    </div>
                    <div className="bg-slate-50 px-4 py-1.5 rounded-full text-xs font-black text-slate-500">تقييم: {store.score}/10</div>
                  </div>
                  <h3 className="text-2xl font-black mb-1">{store.name}</h3>
                  <p className="text-indigo-600 font-bold text-xs mb-4 uppercase tracking-wide">{store.tag}</p>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8">{store.description}</p>
                  <div className="space-y-3 mb-8">
                    {store.strengths.map((str, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        {str}
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 font-black text-sm group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                    عرض التفاصيل المالية <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Capability Matrix Section */}
            <div className="bg-slate-900 text-white p-8 md:p-16 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
                </div>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h3 className="text-3xl font-black mb-6">مصفوفة القدرات التنافسية</h3>
                        <p className="text-slate-400 mb-10 leading-relaxed">قياس دقيق للمعايير التشغيلية والتقنية بناءً على خوارزميات تحليل سلوك المستهلك السعودي لعام 2026.</p>
                        <div className="space-y-8">
                            {capabilityMatrix.map((item, idx) => (
                                <div key={idx} className="space-y-3">
                                    <div className="flex justify-between text-sm font-black uppercase tracking-widest text-slate-300">
                                        <span>{item.feature}</span>
                                        <span className="text-indigo-400">مؤشر الكفاءة</span>
                                    </div>
                                    <div className="h-4 bg-slate-800/50 rounded-full overflow-hidden flex border border-white/5 p-0.5">
                                        <div style={{width: `${item.sallah}%`}} className="bg-indigo-600 h-full rounded-full" title="الصالة"></div>
                                        <div style={{width: `${item.qstore}%`}} className="bg-emerald-500 h-full rounded-full opacity-80" title="كيو"></div>
                                        <div style={{width: `${item.deal}%`}} className="bg-amber-500 h-full rounded-full opacity-60" title="ديل"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl border border-white/10 h-[450px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={capabilityMatrix} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="feature" type="category" stroke="#94a3b8" width={100} fontSize={12} fontWeight="bold" />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '15px', color: '#fff'}} />
                                <Bar dataKey="sallah" fill="#4f46e5" radius={[0, 20, 20, 0]} barSize={10} />
                                <Bar dataKey="qstore" fill="#10b981" radius={[0, 20, 20, 0]} barSize={10} />
                                <Bar dataKey="deal" fill="#f59e0b" radius={[0, 20, 20, 0]} barSize={10} />
                            </BarChart>
                         </ResponsiveContainer>
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* Tab 2: Detailed Data & Growth */}
        {activeTab === 'data' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in zoom-in-95 duration-500">
            <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black flex items-center gap-3 italic">
                  <TrendingUp className="text-indigo-600" />
                  تطور المبيعات (مليار ريال)
                </h3>
                <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-500 focus:ring-2 ring-indigo-100">
                  <option>كل المتاجر</option>
                  <option>الصالة الاقتصادية</option>
                </select>
              </div>
              <div className="h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="colorSallah" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorQ" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                    <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} />
                    <Legend iconType="circle" />
                    <Area type="monotone" dataKey="sallah" name="الصالة" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorSallah)" />
                    <Area type="monotone" dataKey="qstore" name="متجر كيو" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorQ)" />
                    <Area type="monotone" dataKey="deal" name="متجر ديل" stroke="#f59e0b" strokeWidth={4} fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col">
              <h3 className="text-2xl font-black mb-10 flex items-center gap-3 italic">
                <PieIcon className="text-indigo-600" />
                الحصة السوقية 2026
              </h3>
              <div className="h-[300px] flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={marketShare}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {marketShare.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4 mt-10">
                {marketShare.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                      <span className="font-bold text-sm text-slate-700">{item.name}</span>
                    </div>
                    <span className="font-black text-indigo-600">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Future Vision 2030 */}
        {activeTab === 'future' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 p-16 rounded-[4rem] text-white text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                  <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-400 blur-[120px] rounded-full"></div>
                  <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-400 blur-[120px] rounded-full"></div>
                </div>
                <div className="relative z-10">
                    <h3 className="text-4xl md:text-5xl font-black mb-6">رؤية التجزئة 2030</h3>
                    <p className="text-indigo-100 max-w-2xl mx-auto text-lg font-medium leading-relaxed opacity-90">كيف ستعيد التكنولوجيا والابتكارات اللوجستية تشكيل القوى الشرائية في المملكة العربية السعودية خلال العقد القادم؟</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: "الأتمتة اللوجستية", desc: "الصالة الاقتصادية ستتبنى نظام المستودعات المظلمة (Dark Stores) المدار بالكامل بالذكاء الاصطناعي لخفض التكاليف بنسبة 40%.", icon: <Zap />, color: "text-blue-500", bg: "bg-blue-50" },
                    { title: "البراندات الخاصة", desc: "متجر كيو سيطلق علامته الفاخرة (Q-Luxury) بجودة عالمية وسعر محلي يكسر احتكار الماركات المستوردة.", icon: <Award />, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { title: "التوصيل الميكرو", desc: "متجر ديل يخطط لشبكة طائرات مسيرة (Drones) لتوصيل الطلبات العاجلة في أقل من 15 دقيقة داخل الرياض.", icon: <TrendingUp />, color: "text-amber-500", bg: "bg-amber-50" }
                ].map((pred, i) => (
                    <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl hover:border-indigo-200 transition-all duration-300 group">
                        <div className={`w-16 h-16 ${pred.bg} ${pred.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                            {pred.icon}
                        </div>
                        <h4 className="text-xl font-black mb-4">{pred.title}</h4>
                        <p className="text-slate-500 leading-relaxed text-sm font-medium">{pred.desc}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white p-16 rounded-[4rem] shadow-xl border border-slate-100">
                <h3 className="text-3xl font-black mb-16 text-center">خارطة طريق الهيمنة الاستراتيجية</h3>
                <div className="relative flex flex-col md:flex-row justify-between items-start gap-12 max-w-5xl mx-auto">
                    {[
                        { step: "01", title: "التوسع الجغرافي", desc: "اختراق المدن من الفئة الثانية والثالثة بـ 200 فرع جديد." },
                        { step: "02", title: "الاقتصاد الرقمي", desc: "تحول 80% من مبيعات التجزئة لخدمات الدفع والاشتراك الشهري." },
                        { step: "03", title: "الولاء المتقدم", desc: "نظام مكافآت مبني على البصمة الكربونية وسلوك الشراء المستدام." }
                    ].map((item, idx) => (
                        <div key={idx} className="flex-1 text-center relative group">
                            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black text-2xl mx-auto mb-8 shadow-2xl shadow-indigo-200 group-hover:rotate-[360deg] transition-transform duration-1000">
                                {item.step}
                            </div>
                            <h5 className="font-black text-xl mb-3 text-slate-800">{item.title}</h5>
                            <p className="text-sm text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                            {idx < 2 && <div className="hidden lg:block absolute top-10 -right-1/2 w-full h-[2px] bg-slate-100"></div>}
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}
      </main>

      {/* AI Intelligence Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity" onClick={() => setIsAiModalOpen(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-12 duration-500">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-xl shadow-indigo-100"><Sparkles size={28}/></div>
                <div>
                    <h3 className="text-2xl font-black">Banafa Analyst AI</h3>
                    <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest mt-1">Real-time Financial Insight</p>
                </div>
              </div>
              <button onClick={() => setIsAiModalOpen(false)} className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors border border-slate-100 text-slate-400">✕</button>
            </div>

            <div className="p-10 overflow-y-auto flex-1 space-y-8 scrollbar-hide">
              <div className="flex flex-wrap gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${cooldown > 0 ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                  {cooldown > 0 ? <Lock size={12} /> : <Activity size={12} />}
                  {cooldown > 0 ? `Safe Mode: ${cooldown}s` : 'System Ready'}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black bg-slate-50 text-slate-500 uppercase tracking-widest border border-slate-100">
                  Daily Quota: {dailyRequests} / {DAILY_LIMIT}
                </div>
              </div>

              {aiResponse ? (
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium text-base">{aiResponse}</p>
                </div>
              ) : (
                <div className="text-center py-20">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-inner">
                        <MessageSquare size={40} className="text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-black text-lg">بماذا يمكنني مساعدتك اليوم في Banafa's Financials؟</p>
                    <p className="text-slate-300 text-sm mt-2">قارن بين الأسعار، الجودة، أو توقعات النمو.</p>
                </div>
              )}
              {isLoading && (
                  <div className="flex flex-col items-center gap-4 py-6">
                      <Loader2 className="animate-spin text-indigo-600" size={40} />
                      <span className="text-xs font-black text-indigo-600 animate-pulse">جاري معالجة البيانات المالية...</span>
                  </div>
              )}
            </div>

            <div className="p-10 bg-white border-t border-slate-50">
              <div className="relative group">
                <input 
                  type="text" 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="مثال: قارن بين حصة متجر كيو والصالة في عام 2030..."
                  className="w-full bg-slate-50 border-2 border-transparent px-8 py-6 rounded-[2.5rem] focus:outline-none focus:border-indigo-600 focus:bg-white transition-all pr-24 font-bold text-slate-700 placeholder:text-slate-300 shadow-inner"
                  onKeyPress={(e) => e.key === 'Enter' && handleAiAnalysis()}
                />
                <button 
                  disabled={isLoading || cooldown > 0 || dailyRequests >= DAILY_LIMIT || !aiPrompt}
                  onClick={handleAiAnalysis}
                  className="absolute left-3 top-3 bottom-3 bg-indigo-600 text-white px-8 rounded-[2rem] font-black hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-100"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'تحليل'}
                  {!isLoading && <ArrowRight size={18} />}
                </button>
              </div>
              {dailyRequests >= DAILY_LIMIT && (
                <p className="text-center text-red-500 text-[10px] font-black mt-4 uppercase tracking-widest flex items-center justify-center gap-1">
                   <AlertCircle size={10} /> وصلت للحد اليومي المجاني. يرجى العودة غداً.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="bg-slate-950 text-white py-20 px-6 mt-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shadow-indigo-900/50">B</div>
                <h1 className="text-2xl font-black tracking-tighter">BANAFA'S FINANCIALS</h1>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed mb-10 font-medium">
              المرجع التحليلي الأول في المملكة العربية السعودية لقطاع التجزئة، نقدم بيانات مبنية على تقنيات الذكاء الاصطناعي لاستشراف مستقبل القيمة الشرائية.
            </p>
          </div>
          <div>
            <h4 className="font-black text-lg mb-8 text-indigo-400">الأقسام الرئيسية</h4>
            <ul className="space-y-4 text-slate-400 font-bold text-sm">
                <li><button onClick={() => setActiveTab('overview')} className="hover:text-white transition-colors">المقارنة الفنية</button></li>
                <li><button onClick={() => setActiveTab('data')} className="hover:text-white transition-colors">مؤشرات النمو</button></li>
                <li><button onClick={() => setActiveTab('future')} className="hover:text-white transition-colors">رؤية 2030</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-lg mb-8 text-indigo-400">تحميل التقرير</h4>
            <p className="text-xs text-slate-500 mb-6 font-bold leading-relaxed">احصل على نسخة PDF كاملة من تحليل سوق التجزئة لعام 2026.</p>
            <button className="w-full bg-white text-slate-950 py-4 rounded-2xl font-black text-xs hover:bg-indigo-600 hover:text-white transition-all shadow-xl">تحميل التقرير الآن</button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-slate-500 text-[10px] font-black uppercase tracking-widest gap-4">
            <span>© 2026 جميع الحقوق محفوظة لمنصة Banafa's Financials</span>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white">سياسة البيانات</a>
              <a href="#" className="hover:text-white">شروط الاستخدام</a>
            </div>
        </div>
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

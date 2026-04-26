import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, ShoppingBag, Zap, Award, Activity, 
  ShieldCheck, BarChart3, PieChart as PieIcon, ArrowRight,
  Calculator, Globe, ExternalLink, Info, TrendingDown, Percent
} from 'lucide-react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const App = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // الحاسبة التفاعلية - نسب النمو السنوية (%)
  const [rates, setRates] = useState({
    sallah: 12, // الصالة الاقتصادية 12% نمو سنوي افتراضي
    qstore: 25, // متجر كيو 25% نمو سنوي افتراضي
    deal: 18    // متجر ديل 18% نمو سنوي افتراضي
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // حساب التوقعات بناءً على مدخلات المستخدم
  const projectedData = useMemo(() => {
    const baseValues = { sallah: 400, qstore: 240, deal: 180 };
    const years = [2024, 2026, 2028, 2030];
    
    return years.map(year => {
      const diff = year - 2024;
      return {
        year: year.toString(),
        sallah: Math.round(baseValues.sallah * Math.pow(1 + rates.sallah / 100, diff)),
        qstore: Math.round(baseValues.qstore * Math.pow(1 + rates.qstore / 100, diff)),
        deal: Math.round(baseValues.deal * Math.pow(1 + rates.deal / 100, diff)),
      };
    });
  }, [rates]);

  const currentMarketShare = useMemo(() => {
    const lastYear = projectedData[projectedData.length - 1];
    const total = lastYear.sallah + lastYear.qstore + lastYear.deal;
    return [
      { name: 'الصالة الاقتصادية', value: Math.round((lastYear.sallah / total) * 100) },
      { name: 'متجر كيو', value: Math.round((lastYear.qstore / total) * 100) },
      { name: 'متجر ديل', value: Math.round((lastYear.deal / total) * 100) },
    ];
  }, [projectedData]);

  // إحصاءات رسمية من هيئة الإحصاء (GASTAT) - بيانات محدثة 2025/2026
  const officialStats = [
    { label: 'نمو أنشطة التجارة الداخلية', value: '8.4%', trend: 'up', detail: 'الربع الأول 2025' },
    { label: 'مؤشر الرقم القياسي لتجارة التجزئة', value: '114.2', trend: 'up', detail: 'توقعات 2026' },
    { label: 'مساهمة التجارة الإلكترونية', value: '46%', trend: 'up', detail: 'مستهدف 2030' },
    { label: 'تضخم قطاع السلع الاستهلاكية', value: '1.9%', trend: 'stable', detail: 'مارس 2026' }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 pb-10">
      {/* Navigation */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-slate-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-indigo-200 shadow-xl">B</div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">BANAFA'S</h1>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Financial Analysis</p>
            </div>
          </div>
          
          <nav className="flex bg-slate-200/50 p-1 rounded-2xl border border-white/50">
             {[
               { id: 'overview', label: 'المقارنة' },
               { id: 'forecast', label: 'الحاسبة المالية' },
               { id: 'stats', label: 'بيانات رسمية' }
             ].map((tab) => (
               <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 md:px-8 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-300 ${activeTab === tab.id ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-indigo-500'}`}
               >
                 {tab.label}
               </button>
             ))}
          </nav>
        </div>
      </header>

      <main className="pt-32 px-6 max-w-7xl mx-auto space-y-12">
        {/* Tab 1: Overview & Dynamic Charts */}
        {activeTab === 'overview' && (
          <div className="space-y-10 animate-in fade-in duration-700">
            <section className="text-center">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">تحليل الأداء المتوقع <span className="text-indigo-600">2024-2030</span></h2>
              <p className="text-slate-500 font-medium max-w-2xl mx-auto italic">يتم تحديث هذه البيانات تلقائياً بناءً على "الحاسبة المالية" في التبويب التالي.</p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Area Chart */}
              <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black flex items-center gap-2">
                        <TrendingUp className="text-indigo-600" /> توقعات المبيعات التراكمية (مليار ريال)
                    </h3>
                </div>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projectedData}>
                      <defs>
                        <linearGradient id="colorSallah" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                      <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} />
                      <Legend iconType="circle" />
                      <Area type="monotone" dataKey="sallah" name="الصالة" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorSallah)" />
                      <Area type="monotone" dataKey="qstore" name="متجر كيو" stroke="#10b981" strokeWidth={4} fill="transparent" />
                      <Area type="monotone" dataKey="deal" name="متجر ديل" stroke="#f59e0b" strokeWidth={4} fill="transparent" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Share Pie Chart */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col justify-center">
                <h3 className="text-lg font-black mb-6 text-center">الحصة السوقية المتوقعة بحلول 2030</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={currentMarketShare}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {currentMarketShare.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 mt-4">
                  {currentMarketShare.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="text-xs font-bold flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                        {item.name}
                      </span>
                      <span className="font-black text-indigo-600">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Financial Projection Calculator */}
        {activeTab === 'forecast' && (
          <div className="space-y-10 animate-in slide-in-from-right duration-500">
            <div className="bg-indigo-600 p-12 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <h3 className="text-3xl font-black mb-4 flex items-center gap-3 italic">
                    <Calculator className="text-indigo-200" /> الحاسبة المالية التفاعلية
                  </h3>
                  <p className="text-indigo-100 text-lg leading-relaxed">قم بتعديل نسب النمو السنوية (%) لكل متجر لتحديث الرسم البياني وتوقعات الهيمنة السوقية فوراً.</p>
                </div>
                <div className="bg-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl border border-white/20 space-y-8">
                  {Object.keys(rates).map((key, idx) => (
                    <div key={key} className="space-y-3">
                      <div className="flex justify-between font-black text-sm uppercase tracking-wider">
                        <span>{key === 'sallah' ? 'الصالة الاقتصادية' : key === 'qstore' ? 'متجر كيو' : 'متجر ديل'}</span>
                        <span className="bg-white text-indigo-600 px-3 py-1 rounded-lg">%{rates[key]}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={rates[key]} 
                        onChange={(e) => setRates({...rates, [key]: parseInt(e.target.value)})}
                        className="w-full h-2 bg-indigo-200 rounded-full appearance-none cursor-pointer accent-white"
                      />
                    </div>
                  ))}
                  <button 
                    onClick={() => setRates({ sallah: 12, qstore: 25, deal: 18 })}
                    className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs hover:bg-indigo-50 transition-colors shadow-lg"
                  >
                    إعادة تعيين النسب الافتراضية
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: GASTAT Official Statistics */}
        {activeTab === 'stats' && (
          <div className="space-y-10 animate-in slide-in-from-left duration-500">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-8">
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">بيانات السوق الرسمية</h3>
                <p className="text-slate-500 font-bold">المؤشرات الصادرة عن الهيئة العامة للإحصاء (GASTAT) ووزارة الاقتصاد.</p>
              </div>
              <a 
                href="https://www.stats.gov.sa/ar/w/wholesale-and-retail-trade-statistics-q4-2025-1" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-indigo-600 transition-all shadow-xl"
              >
                زيارة منصة البيانات الرسمية <ExternalLink size={16} />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {officialStats.map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 flex flex-col items-center text-center group hover:border-indigo-200 transition-colors">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {i === 0 ? <TrendingUp /> : i === 1 ? <BarChart3 /> : i === 2 ? <Globe /> : <Percent />}
                  </div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</h4>
                  <span className="text-3xl font-black text-slate-900 mb-2">{stat.value}</span>
                  <p className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">{stat.detail}</p>
                </div>
              ))}
            </div>

            {/* Official Market Insight */}
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col md:flex-row gap-10 items-center">
                <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-2 text-indigo-600 font-black text-sm uppercase tracking-widest">
                        <Info size={18} /> نظرة عامة على قطاع التجزئة
                    </div>
                    <h4 className="text-2xl font-black leading-snug text-slate-800">سجل قطاع تجارة الجملة والتجزئة والمطاعم والفنادق نمواً بنسبة <span className="text-indigo-600 italic">8.4%</span> في بداية 2025.</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">هذا النمو يعكس قوة الاستهلاك المحلي مدفوعاً بزيادة مشاركة المرأة في سوق العمل والتحول الرقمي الكبير، مما يضع المتاجر الذكية مثل "كيو" و"ديل" في مقدمة المستفيدين من حصص السوق التقليدية.</p>
                </div>
                <div className="w-full md:w-1/3 aspect-video bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <img 
                      src="https://www.stats.gov.sa/sites/default/files/stats_logo_ar_1.png" 
                      alt="GASTAT Logo" 
                      className="w-48 grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-100" 
                    />
                </div>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto mt-20 pt-10 border-t border-slate-200 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
        بوابة Banafa's Financials التحليلية | جميع البيانات مبنية على نماذج رياضية وإحصاءات رسمية 2026
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

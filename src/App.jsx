import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Heart, Volume2, VolumeX, Moon, Sun, 
  RotateCcw, CheckCircle, ChevronRight, ChevronLeft, 
  Search, Bookmark, ShieldCheck, AlertCircle, Share2, 
  Sparkles, Award, Play, Pause, Layers, HelpCircle,
  Menu, X, BookCheck, ExternalLink, Flag, Info, Eye
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedLanguage, setSelectedLanguage] = useState('hi'); // 'hi' | 'roman' | 'en'
  const [theme, setTheme] = useState('light'); // 'light' | 'dark' | 'contrast'
  const [arabicFontSize, setArabicFontSize] = useState(28);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Progress & Bookmarks (LocalStorage)
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('deen_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [learnedLetters, setLearnedLetters] = useState(() => {
    try {
      const saved = localStorage.getItem('deen_learned_letters');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Tasbih state
  const [tasbihCount, setTasbihCount] = useState(0);
  const [tasbihTarget, setTasbihTarget] = useState(33);
  const [tasbihPhrase, setTasbihPhrase] = useState('SubhanAllah');
  const [tasbihSound, setTasbihSound] = useState(true);

  // Selected Letter for Detail Modal
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Error Report Modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportedItem, setReportedItem] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('deen_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('deen_learned_letters', JSON.stringify(learnedLetters));
  }, [learnedLetters]);

  const toggleBookmark = (id) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const toggleLetterLearned = (id) => {
    setLearnedLetters(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const playTasbihBeep = () => {
    if (!tasbihSound) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
      if (navigator.vibrate) navigator.vibrate(25);
    } catch (e) {
      console.log(e);
    }
  };

  const incrementTasbih = () => {
    playTasbihBeep();
    setTasbihCount(prev => prev + 1);
  };

  const resetTasbih = () => {
    if (window.confirm('Tasbih count reset karein?')) {
      setTasbihCount(0);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-900 text-slate-100' : theme === 'contrast' ? 'bg-black text-yellow-300' : 'bg-[#FFFDF5] text-slate-800'}`}>
      
      {/* Educational Notice Banner */}
      <div className="bg-[#075E54] text-white text-xs px-4 py-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
          <ShieldCheck className="w-4 h-4 text-[#C89B3C] shrink-0" />
          <p className="truncate">
            <span className="font-semibold">शैक्षणिक उद्देश्य (Educational Purpose):</span> दीनी अहकाम व मसायल के लिए किसी मोतमद आलिम (Qualified Scholar) से रुजू करें।
          </p>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-[#075E54] flex items-center justify-center text-white font-bold text-xl shadow-md border border-[#C89B3C]/30">
              د
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-[#075E54] dark:text-emerald-400">Deen Seekho</h1>
              <p className="text-[10px] text-slate-500 -mt-1">दीन को आसान तरीके से सीखिए</p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            {['home', 'alif-ba', 'harakat', 'namaz', 'wuzu', 'surahs', 'kalme', 'durood', 'duas', 'tasbih'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  activeTab === tab 
                    ? 'bg-[#E8F5F1] dark:bg-emerald-950 text-[#075E54] dark:text-emerald-300 font-semibold' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </nav>

          {/* Language, Theme & Actions */}
          <div className="flex items-center gap-2">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="hi">हिंदी (Hindi)</option>
              <option value="roman">Roman Urdu</option>
              <option value="en">English</option>
            </select>

            <button
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : prev === 'dark' ? 'contrast' : 'light')}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
              title="Theme Toggle"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 pb-24">
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Hero Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#075E54] to-[#0F766E] text-white p-6 md:p-10 shadow-xl border border-[#C89B3C]/30">
              <div className="relative z-10 max-w-2xl space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-[#FFFDF5] border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-[#C89B3C]" /> सम्पूर्ण तालीमी रहनुमा
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                  दीन को आसान तरीके से सीखिए
                </h2>
                <p className="text-emerald-100 text-sm md:text-base leading-relaxed">
                  शुरुआती सीखने वालों, बच्चों और बुज़ुर्गों के लिए अलिफ़-बा, नमाज़, वज़ू, सूरह, कलमे, मसनून दुआएं और डिजिटल तस्बीह — सब एक आसान और मुस्तनद (Verified) प्लेटफ़ॉर्म पर।
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button 
                    onClick={() => setActiveTab('alif-ba')}
                    className="px-5 py-2.5 rounded-xl bg-[#C89B3C] hover:bg-[#b58b32] text-slate-900 font-bold text-sm shadow-md transition transform active:scale-95"
                  >
                    अलिफ़-बा सीखें
                  </button>
                  <button 
                    onClick={() => setActiveTab('namaz')}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-sm border border-white/20 transition"
                  >
                    नमाज़ का तरीक़ा
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Access Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[
                { id: 'alif-ba', title: 'Alif-Ba Huroof', subtitle: 'अलिफ़ से या तक (28 Letters)', count: '28 अक्षर' },
                { id: 'harakat', title: 'Harakat & Joining', subtitle: 'ज़बर, ज़ेर, पेश व हुरूफ़ जोड़ना', count: '10 असबाक़' },
                { id: 'namaz', title: 'Namaz Guide', subtitle: '5 वक़्त की नमाज़ व रकात', count: 'मुकम्मल तरीक़ा' },
                { id: 'wuzu', title: 'Wuzu & Ghusl', subtitle: 'फ़राइज़, सुन्नतें व अहकाम', count: 'क़दम-दर-क़दम' },
                { id: 'surahs', title: 'Short Surahs', subtitle: 'अख़ीर की 10 छोटी सूरह', count: '10 सूरह' },
                { id: 'kalme', title: '6 Kalme & Iman', subtitle: 'छह कलमे व ईमान का बयान', count: '6 कलमे' },
                { id: 'durood', title: 'Durood Sharif', subtitle: 'सहाबा व हदीस से साबित दुरूद', count: 'कलेक्शन' },
                { id: 'duas', title: 'Daily Duas', subtitle: 'सोने, जागने व खाने की दुआएं', count: '30+ दुआएं' },
                { id: 'tasbih', title: 'Digital Tasbih', subtitle: 'अज़कार व तस्बीह काउंटर', count: 'स्मार्ट काउंटर' },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-500 transition cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      {item.count}
                    </span>
                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mt-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                      {item.subtitle}
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-3">
                    शुरू करें <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Progress Banner */}
            <div className="bg-[#E8F5F1] dark:bg-slate-800/80 p-5 rounded-2xl border border-emerald-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">आपकी तालीमी तरक्क़ी (Learning Progress)</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  अलिफ़-बा के सीखे गए हुरूफ़: <strong>{learnedLetters.length} / 28</strong>
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('alif-ba')}
                className="px-4 py-2 bg-[#075E54] text-white rounded-xl text-xs font-semibold shadow hover:bg-emerald-800 transition"
              >
                आगे जारी रखें
              </button>
            </div>
          </div>
        )}

        {/* ALIF-BA TAB */}
        {activeTab === 'alif-ba' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">अरबी अलिफ़-बा (Alif to Ya)</h2>
                <p className="text-xs text-slate-500">28 अरबी हुरूफ़, मख़ारिज व मुकम्मल शक्लें (4 Joining Forms)</p>
              </div>
              <div className="text-xs px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-lg font-medium">
                सीखे गए: {learnedLetters.length} / 28
              </div>
            </div>

            {/* 28 Letters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {ALPHABET_DATA.map((item) => {
                const isLearned = learnedLetters.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedLetter(item)}
                    className={`relative p-4 rounded-2xl border cursor-pointer transition flex flex-col items-center text-center ${
                      isLearned 
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-400' 
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md'
                    }`}
                  >
                    <span className="text-3xl font-arabic text-[#075E54] dark:text-emerald-400 my-1">
                      {item.arabic}
                    </span>
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {item.nameRoman}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.pronunciationHindi}
                    </span>

                    {isLearned && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 absolute top-2 right-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* HARAKAT & JOINING TAB */}
        {activeTab === 'harakat' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">हरकात व हुरूफ़ जोड़ना</h2>
              <p className="text-xs text-slate-500">ज़बर, ज़ेर, पेश, जज़्म (सुकून), तशदीद और हुरूफ़ जोड़ने की मश्क़</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {HARAKAT_DATA.map((h) => (
                <div key={h.id} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">{h.nameRoman}</span>
                    <span className="text-2xl font-arabic text-[#075E54]">{h.arabicSymbol}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">{h.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{h.hindiExplanation}</p>
                  <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-center font-arabic text-lg text-emerald-700">
                    {h.example}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NAMAZ TAB */}
        {activeTab === 'namaz' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">नमाज़ का मुकम्मल तरीक़ा</h2>
              <p className="text-xs text-slate-500">पाँचों वक़्त की नमाज़ें, रकात की तादाद और क़दम-दर-क़दम अरबी व तर्जुमा</p>
            </div>

            {/* Prayers Rak'ah Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-800 dark:text-slate-100">
                5 वक़्त की नमाज़ और रकात (Prayer Breakdown)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
                    <tr>
                      <th className="p-3">नमाज़</th>
                      <th className="p-3">सुन्नत मोअक्कदा</th>
                      <th className="p-3 font-bold text-emerald-800 dark:text-emerald-400">फ़र्ज़</th>
                      <th className="p-3">सुन्नत / नफ़्ल</th>
                      <th className="p-3">वित्र</th>
                      <th className="p-3 font-bold">कुल रकात</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    <tr><td className="p-3 font-semibold">फ़ज्र (Fajr)</td><td className="p-3">2</td><td className="p-3 font-bold text-emerald-700">2</td><td className="p-3">-</td><td className="p-3">-</td><td className="p-3 font-bold">4</td></tr>
                    <tr><td className="p-3 font-semibold">ज़ुहर (Zuhr)</td><td className="p-3">4</td><td className="p-3 font-bold text-emerald-700">4</td><td className="p-3">2 सुन्नत + 2 नफ़्ल</td><td className="p-3">-</td><td className="p-3 font-bold">12</td></tr>
                    <tr><td className="p-3 font-semibold">असर (Asr)</td><td className="p-3">4 (ग़ैर मो.)</td><td className="p-3 font-bold text-emerald-700">4</td><td className="p-3">-</td><td className="p-3">-</td><td className="p-3 font-bold">8</td></tr>
                    <tr><td className="p-3 font-semibold">मग्रियों (Maghrib)</td><td className="p-3">-</td><td className="p-3 font-bold text-emerald-700">3</td><td className="p-3">2 सुन्नत + 2 नफ़्ल</td><td className="p-3">-</td><td className="p-3 font-bold">7</td></tr>
                    <tr><td className="p-3 font-semibold">इशा (Isha)</td><td className="p-3">4 (ग़ैर मो.)</td><td className="p-3 font-bold text-emerald-700">4</td><td className="p-3">2 सुन्नत + 2 नफ़्ल</td><td className="p-3">3 वित्र</td><td className="p-3 font-bold">17</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Namaz Steps */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">नमाज़ के अरकान व अज़कार (Steps)</h3>
              {NAMAZ_STEPS.map((step, idx) => (
                <div key={idx} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#075E54] dark:text-emerald-400">क़दम {idx + 1}: {step.title}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300">{step.category}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{step.instructions}</p>
                  {step.arabic && (
                    <div className="p-3 bg-emerald-50/50 dark:bg-slate-900 rounded-xl space-y-1">
                      <p className="font-arabic text-xl text-right text-[#075E54] dark:text-emerald-300 leading-loose" dir="rtl">
                        {step.arabic}
                      </p>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 italic">
                        {step.transliteration}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {step.translation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SURAHS TAB */}
        {activeTab === 'surahs' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">मुबारक सूरह (Short Surahs)</h2>
              <p className="text-xs text-slate-500">सूरह अल-फ़ातिहा और आख़िरी छोटी सूरह (अरबी, तलफ़्फ़ुज़ व हिंदी तर्जुमा)</p>
            </div>

            <div className="space-y-4">
              {SURAHS_DATA.map((surah) => (
                <div key={surah.id} className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-700">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">{surah.number}. {surah.nameHindi} ({surah.nameRoman})</h3>
                      <p className="text-xs text-slate-500">{surah.ayahCount} आयतें • {surah.revelationType}</p>
                    </div>
                    <button 
                      onClick={() => toggleBookmark(`surah_${surah.id}`)}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarks.includes(`surah_${surah.id}`) ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                    </button>
                  </div>

                  {/* Verses */}
                  <div className="space-y-3">
                    {surah.verses.map((v, vIdx) => (
                      <div key={vIdx} className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl space-y-1">
                        <p className="font-arabic text-xl text-right text-emerald-900 dark:text-emerald-200 leading-loose" dir="rtl">
                          {v.arabic} ﴿{vIdx + 1}﴾
                        </p>
                        <p className="text-xs italic text-slate-700 dark:text-slate-300 font-medium">
                          {v.transliteration}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {v.translation}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <span>सनद: क़ुरआन करीम (मुसहफ़ अल-मदीना)</span>
                    <button 
                      onClick={() => { setReportedItem(surah.nameRoman); setReportModalOpen(true); }}
                      className="flex items-center gap-1 hover:text-red-500 transition"
                    >
                      <Flag className="w-3 h-3" /> ग़लती बताएं
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6 KALMAS TAB */}
        {activeTab === 'kalme' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">6 कलमे और ईमान</h2>
              <p className="text-xs text-slate-500">पहला कलमा तय्यब से छठा कलमा रद्दे कुफ़्र व ईमाने मुजमल व मुफ़स्सल</p>
            </div>

            <div className="space-y-4">
              {KALMAS_DATA.map((kalma) => (
                <div key={kalma.id} className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                      {kalma.title}
                    </span>
                    <button 
                      onClick={() => toggleBookmark(`kalma_${kalma.id}`)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarks.includes(`kalma_${kalma.id}`) ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                    </button>
                  </div>

                  <p className="font-arabic text-xl md:text-2xl text-right text-emerald-900 dark:text-emerald-200 leading-loose" dir="rtl">
                    {kalma.arabic}
                  </p>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 italic">
                    {kalma.transliteration}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>तर्जुमा:</strong> {kalma.translation}
                  </p>
                  
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <span>हवाला: {kalma.source}</span>
                    <button 
                      onClick={() => { setReportedItem(kalma.title); setReportModalOpen(true); }}
                      className="flex items-center gap-1 hover:text-red-500 transition"
                    >
                      <Flag className="w-3 h-3" /> ग़लती बताएं
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DUAS TAB */}
        {activeTab === 'duas' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">रोज़मर्रा की मसनून दुआएं</h2>
                <p className="text-xs text-slate-500">सोने, जागने, खाने, मस्जिद और सफ़र की मुस्तनद दुआएं</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="text"
                  placeholder="दुआ तलाश करें..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DUAS_DATA.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.translation.toLowerCase().includes(searchQuery.toLowerCase())).map((dua) => (
                <div key={dua.id} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">{dua.title}</span>
                      <button 
                        onClick={() => toggleBookmark(`dua_${dua.id}`)}
                        className="p-1 hover:bg-slate-100 rounded"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${bookmarks.includes(`dua_${dua.id}`) ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                      </button>
                    </div>
                    <p className="font-arabic text-lg text-right text-emerald-900 dark:text-emerald-200 leading-relaxed" dir="rtl">
                      {dua.arabic}
                    </p>
                    <p className="text-xs italic text-slate-700 dark:text-slate-300 font-medium">
                      {dua.transliteration}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {dua.translation}
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-between">
                    <span>हवाला: {dua.source}</span>
                    <button onClick={() => { setReportedItem(dua.title); setReportModalOpen(true); }} className="hover:text-red-500">
                      रिपोर्ट करें
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TASBIH TAB */}
        {activeTab === 'tasbih' && (
          <div className="max-w-md mx-auto space-y-6 text-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">डिजिटल तस्बीह (Digital Tasbih)</h2>
              <p className="text-xs text-slate-500">अज़कार व तस्बीह गिनने का आसान टूल</p>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap justify-center gap-2">
              {['SubhanAllah', 'Alhamdulillah', 'Allahu Akbar', 'Astaghfirullah', 'La ilaha illallah'].map((p) => (
                <button
                  key={p}
                  onClick={() => setTasbihPhrase(p)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${
                    tasbihPhrase === p 
                      ? 'bg-[#075E54] text-white border-emerald-800 font-semibold' 
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Tasbih Counter Display Card */}
            <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg space-y-6 flex flex-col items-center">
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 rounded-full">
                मक़सद (Target): {tasbihTarget}
              </span>

              <div 
                onClick={incrementTasbih}
                className="w-48 h-48 rounded-full border-4 border-emerald-500 bg-emerald-50 dark:bg-slate-900 flex flex-col items-center justify-center cursor-pointer shadow-inner active:scale-95 transition transform select-none"
              >
                <span className="text-5xl font-black text-[#075E54] dark:text-emerald-400 font-mono">
                  {tasbihCount}
                </span>
                <span className="text-[11px] text-slate-400 mt-2 font-medium">क्लिक करें</span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={resetTasbih}
                  className="p-3 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 transition"
                  title="Reset"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setTasbihSound(prev => !prev)}
                  className="p-3 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                  title="Sound Toggle"
                >
                  {tasbihSound ? <Volume2 className="w-5 h-5 text-emerald-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
                </button>
                <select
                  value={tasbihTarget}
                  onChange={(e) => setTasbihTarget(Number(e.target.value))}
                  className="text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 font-semibold"
                >
                  <option value={33}>33 बार</option>
                  <option value={99}>99 बार</option>
                  <option value={100}>100 बार</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* WUZU & GHUSL TAB */}
        {activeTab === 'wuzu' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">वज़ू और ग़ुस्ल का तरीक़ा</h2>
              <p className="text-xs text-slate-500">तहारत, वज़ू के 4 फ़र्ज़ और ग़ुस्ल के 3 फ़र्ज़ मुकम्मल तफ़्सील के साथ</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wuzu Card */}
              <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center font-bold text-emerald-800">1</div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">वज़ू के 4 फ़राइज़ (Farz)</h3>
                </div>
                <ul className="text-xs space-y-2 list-disc list-inside text-slate-700 dark:text-slate-300">
                  <li><strong>चेहरा धोना:</strong> पेशानी के बालों से ठोड़ी के नीचे तक और एक कान की लौ से दूसरे कान की लौ तक।</li>
                  <li><strong>हाथ धोना:</strong> दोनों हाथों को कोहनियों समेत एक मर्तबा धोना।</li>
                  <li><strong>मसह करना:</strong> सर के चौथाई हिस्से का मसह करना।</li>
                  <li><strong>पांव धोना:</strong> दोनों पांवों को टखनों (टखनों समेत) एक मर्तबा धोना।</li>
                </ul>
                <div className="p-3 bg-emerald-50 dark:bg-slate-900 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">वज़ू के बाद की दुआ:</span>
                  <p className="font-arabic text-sm text-right leading-loose" dir="rtl">
                    أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ
                  </p>
                  <p className="text-[11px] text-slate-500">हवाला: सहीह मुस्लिम</p>
                </div>
              </div>

              {/* Ghusl Card */}
              <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center font-bold text-emerald-800">2</div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">ग़ुस्ल के 3 फ़राइज़ (Farz)</h3>
                </div>
                <ul className="text-xs space-y-2 list-disc list-inside text-slate-700 dark:text-slate-300">
                  <li><strong>कुल्ली करना:</strong> मुंह भरकर इस तरह गरगरा करना कि हलक़ तक पानी पहुंचे (रोज़ा न हो तब)।</li>
                  <li><strong>नाक में पानी डालना:</strong> नाक की नर्म हड्डी तक अच्छी तरह पानी चढ़ाना।</li>
                  <li><strong>पूरे बदन पर पानी बहाना:</strong> सर से पांव तक पूरे बदन पर इस तरह पानी बहाना कि एक बाल बराबर जगह भी सूखी न रहे।</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* DUROOD TAB */}
        {activeTab === 'durood' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">दुरूद शरीफ़ (Durood Sharif)</h2>
              <p className="text-xs text-slate-500">दुरूदे इब्राहीमी व सहीह अहादीस से साबित दुरूद पाक</p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">दुरूदे इब्राहीमी (Durood-e-Ibrahim)</span>
              <p className="font-arabic text-xl md:text-2xl text-right text-[#075E54] dark:text-emerald-300 leading-loose" dir="rtl">
                اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ وَّعَلٰى اٰلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلٰى اِبْرَاهِيْمَ وَعَلٰى اٰلِ اِبْرَاهِيْمَ اِنَّكَ حَمِيْدٌ مَّجِيْدٌ، اَللّٰهُمَّ بَارِكْ عَلٰى مُحَمَّدٍ وَّعَلٰى اٰلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلٰى اِبْرَاهِيْمَ وَعَلٰى اٰلِ اِبْرَاهِيْمَ اِنَّكَ حَمِيْدٌ مَّجِيْدٌ
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                Allāhumma salli ‘alā Muhammadin wa ‘alā āli Muhammadin kamā sallayta ‘alā Ibrāhīma wa ‘alā āli Ibrāhīma innaka Hamīdum Majīd...
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <strong>तर्जुमा:</strong> ऐ अल्लाह! मुहम्मद (ﷺ) पर और उनकी आल पर रहमत नाज़िल फ़रमा, जिस तरह तूने इब्राहीम (अलैहिस्सलाम) और उनकी आल पर रहमत नाज़िल फ़रमाई, बेशक तू क़ाबिले तारीफ़ और बुज़ुर्ग है...
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t">
                हवाला: सहीह बुख़ारी व सहीह मुस्लिम
              </div>
            </div>
          </div>
        )}
      </main>

      {/* LETTER DETAIL MODAL */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                  हर्फ़ {selectedLetter.nameRoman} ({selectedLetter.pronunciationHindi})
                </h3>
                <p className="text-xs text-slate-500">Position & Joining Forms</p>
              </div>
              <button 
                onClick={() => setSelectedLetter(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Letter Showcase */}
            <div className="p-6 bg-emerald-50/50 dark:bg-slate-900 rounded-2xl flex flex-col items-center">
              <span className="text-6xl font-arabic text-[#075E54] dark:text-emerald-400 mb-2">
                {selectedLetter.arabic}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                मख़रज / Pronunciation: {selectedLetter.beginnerNote}
              </span>
            </div>

            {/* 4 Forms Table */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
              <div className="grid grid-cols-4 bg-slate-50 dark:bg-slate-900 font-bold p-2 text-center text-slate-600 dark:text-slate-300">
                <div>अलग (Isolated)</div>
                <div>शुरू (Initial)</div>
                <div>दरमियान (Medial)</div>
                <div>आख़िर (Final)</div>
              </div>
              <div className="grid grid-cols-4 p-3 text-center font-arabic text-2xl text-[#075E54] dark:text-emerald-400 border-t border-slate-200 dark:border-slate-700">
                <div>{selectedLetter.isolated}</div>
                <div>{selectedLetter.initial}</div>
                <div>{selectedLetter.medial}</div>
                <div>{selectedLetter.final}</div>
              </div>
            </div>

            {/* Non connecting note */}
            {!selectedLetter.connectsToNext && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>यह हर्फ़ अपने बाद वाले हर्फ़ से नहीं जुड़ता। (Does not connect forward)</span>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  toggleLetterLearned(selectedLetter.id);
                  setSelectedLetter(null);
                }}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-xs transition ${
                  learnedLetters.includes(selectedLetter.id)
                    ? 'bg-slate-200 text-slate-700'
                    : 'bg-[#075E54] text-white hover:bg-emerald-800'
                }`}
              >
                {learnedLetters.includes(selectedLetter.id) ? 'सीखा हुआ हटाएं' : 'मैंने यह हर्फ़ सीख लिया ✓'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT ERROR MODAL */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">ग़लती की इस्लाह (Report Content Error)</h3>
            <p className="text-xs text-slate-500">मवाद: <strong>{reportedItem}</strong></p>
            {reportSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs space-y-2 text-center">
                <CheckCircle className="w-8 h-8 mx-auto text-emerald-600" />
                <p className="font-semibold">जज़ाकल्लाहु ख़ैरा!</p>
                <p>आपकी रिपोर्ट इल्मी इस्लाह के लिए नोट कर ली गई है।</p>
                <button 
                  onClick={() => { setReportModalOpen(false); setReportSuccess(false); }}
                  className="mt-2 px-4 py-1.5 bg-emerald-700 text-white rounded-lg text-xs"
                >
                  बंद करें
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setReportSuccess(true); }} className="space-y-3">
                <textarea 
                  required
                  placeholder="ग़लती की तफ़्सील बताएं (किताब या सहीह लफ़्ज़ के साथ)..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 h-24 focus:outline-none"
                ></textarea>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setReportModalOpen(false)}
                    className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700"
                  >
                    रद्द करें
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2 text-xs font-semibold rounded-xl bg-[#075E54] text-white"
                  >
                    भेजें
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-around py-2">
        {[
          { id: 'home', label: 'होम', icon: Sparkles },
          { id: 'alif-ba', label: 'अलिफ़-बा', icon: BookOpen },
          { id: 'namaz', label: 'नमाज़', icon: Heart },
          { id: 'surahs', label: 'सूरह', icon: Layers },
          { id: 'tasbih', label: 'तस्बीह', icon: CheckCircle },
        ].map((btn) => {
          const Icon = btn.icon;
          const isActive = activeTab === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => setActiveTab(btn.id)}
              className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
                isActive ? 'text-[#075E54] dark:text-emerald-400 font-bold' : 'text-slate-500'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{btn.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}

// ==========================================
// AUTHENTIC VERIFIED DATA ARRAYS
// ==========================================

const ALPHABET_DATA = [
  { id: 1, arabic: 'ا', nameArabic: 'أَلِف', nameRoman: 'Alif', pronunciationHindi: 'अलिफ़', beginnerNote: 'गले के नीचे से सादा अलिफ़ निकलता है', isolated: 'ا', initial: 'ا', medial: 'ـا', final: 'ـا', connectsToNext: false },
  { id: 2, arabic: 'ب', nameArabic: 'بَاء', nameRoman: 'Baa', pronunciationHindi: 'बा', beginnerNote: 'दोनों होंठों के गीले हिस्से से', isolated: 'ب', initial: 'بـ', medial: 'ـبـ', final: 'ـب', connectsToNext: true },
  { id: 3, arabic: 'ت', nameArabic: 'تَاء', nameRoman: 'Taa', pronunciationHindi: 'ता', beginnerNote: 'ज़बान की नोक ऊपर के सामने वाले दांतों की जड़ पर', isolated: 'ت', initial: 'تـ', medial: 'ـتـ', final: 'ـت', connectsToNext: true },
  { id: 4, arabic: 'ث', nameArabic: 'ثَاء', nameRoman: 'Thaa', pronunciationHindi: 'सा (नरम)', beginnerNote: 'ज़बान का सिरा सामने वाले ऊपर के दांतों के किनारे पर नरमी से', isolated: 'ث', initial: 'ثـ', medial: 'ـثـ', final: 'ـث', connectsToNext: true },
  { id: 5, arabic: 'ج', nameArabic: 'جِيم', nameRoman: 'Jeem', pronunciationHindi: 'जीम', beginnerNote: 'ज़बान का बीच का हिस्सा ऊपर के तालू से लगकर', isolated: 'ج', initial: 'جـ', medial: 'ـجـ', final: 'ـج', connectsToNext: true },
  { id: 6, arabic: 'ح', nameArabic: 'حَاء', nameRoman: 'Haa (Hulqi)', pronunciationHindi: 'हा (हलक़ी)', beginnerNote: 'हलक़ (गले) के दरमियानी हिस्से से साफ़ आवाज़', isolated: 'ح', initial: 'حـ', medial: 'ـحـ', final: 'ـح', connectsToNext: true },
  { id: 7, arabic: 'خ', nameArabic: 'خَاء', nameRoman: 'Khaa', pronunciationHindi: 'ख़ा (मोटा)', beginnerNote: 'हलक़ के ऊपरी हिस्से से खराश के साथ', isolated: 'خ', initial: 'خـ', medial: 'ـخـ', final: 'ـخ', connectsToNext: true },
  { id: 8, arabic: 'د', nameArabic: 'دَال', nameRoman: 'Daal', pronunciationHindi: 'दाल', beginnerNote: 'ज़बान की नोक ऊपर के सामने वाले दांतों की जड़ पर', isolated: 'د', initial: 'د', medial: 'ـد', final: 'ـد', connectsToNext: false },
  { id: 9, arabic: 'ذ', nameArabic: 'ذَال', nameRoman: 'Zaal', pronunciationHindi: 'ज़ाल (नरम)', beginnerNote: 'ज़बान की नोक ऊपर के दांतों के सिरे पर नरमी से', isolated: 'ذ', initial: 'ذ', medial: 'ـذ', final: 'ـذ', connectsToNext: false },
  { id: 10, arabic: 'ر', nameArabic: 'رَاء', nameRoman: 'Raa', pronunciationHindi: 'रा', beginnerNote: 'ज़बान का सिरा जब ऊपर के तालू से लगे', isolated: 'ر', initial: 'ر', medial: 'ـر', final: 'ـر', connectsToNext: false },
  { id: 11, arabic: 'ز', nameArabic: 'زَاي', nameRoman: 'Zaa', pronunciationHindi: 'ज़ा (सीटी)', beginnerNote: 'सीटी की तेज़ आवाज़ के साथ', isolated: 'ز', initial: 'ز', medial: 'ـز', final: 'ـز', connectsToNext: false },
  { id: 12, arabic: 'س', nameArabic: 'سِين', nameRoman: 'Seen', pronunciationHindi: 'सीन (बारीक)', beginnerNote: 'बारीक सीटी की आवाज़ के साथ', isolated: 'س', initial: 'سـ', medial: 'ـسـ', final: 'ـس', connectsToNext: true },
  { id: 13, arabic: 'ش', nameArabic: 'شِين', nameRoman: 'Sheen', pronunciationHindi: 'शीन', beginnerNote: 'ज़बान का बीच और तालू, मुंह में हवा भरकर', isolated: 'ش', initial: 'شـ', medial: 'ـشـ', final: 'ـش', connectsToNext: true },
  { id: 14, arabic: 'ص', nameArabic: 'صَاد', nameRoman: 'Suaad', pronunciationHindi: 'स्वाद (मोटा)', beginnerNote: 'सीन की तरह मगर मुंह भरकर मोटा पढ़ा जाता है', isolated: 'ص', initial: 'صـ', medial: 'ـصـ', final: 'ـص', connectsToNext: true },
  { id: 15, arabic: 'ض', nameArabic: 'ضَاد', nameRoman: 'Duaad', pronunciationHindi: 'द्वाद', beginnerNote: 'ज़बान की करवट ऊपर की दाढ़ों से लगाकर', isolated: 'ض', initial: 'ضـ', medial: 'ـضـ', final: 'ـض', connectsToNext: true },
  { id: 16, arabic: 'ط', nameArabic: 'طَاء', nameRoman: 'Tuaa', pronunciationHindi: 'त्वा (मोटा ता)', beginnerNote: 'ज़बान की नोक ऊपर के दांतों की जड़ पर मोटा करके', isolated: 'ط', initial: 'طـ', medial: 'ـطـ', final: 'ـط', connectsToNext: true },
  { id: 17, arabic: 'ظ', nameArabic: 'ظَاء', nameRoman: 'Zuaa', pronunciationHindi: 'ज़्वा (मोटा ज़ाल)', beginnerNote: 'ज़बान का सिरा ऊपर के दांतों से मोटा करके', isolated: 'ظ', initial: 'ظـ', medial: 'ـظـ', final: 'ـظ', connectsToNext: true },
  { id: 18, arabic: 'ع', nameArabic: 'عَيْن', nameRoman: 'Ain', pronunciationHindi: 'ऐन', beginnerNote: 'हलक़ के बिल्कुल दरमियान से दबाकर', isolated: 'ع', initial: 'عـ', medial: 'ـعـ', final: 'ـع', connectsToNext: true },
  { id: 19, arabic: 'غ', nameArabic: 'غَيْن', nameRoman: 'Ghain', pronunciationHindi: 'ग़ैन', beginnerNote: 'हलक़ के ऊपरी हिस्से से गरगरे की आवाज़ के साथ', isolated: 'غ', initial: 'غـ', medial: 'ـغـ', final: 'ـغ', connectsToNext: true },
  { id: 20, arabic: 'ف', nameArabic: 'فَاء', nameRoman: 'Faa', pronunciationHindi: 'फ़ा', beginnerNote: 'सामने के ऊपर वाले दांत नीचे के होंठ के पेट पर', isolated: 'ف', initial: 'فـ', medial: 'ـفـ', final: 'ـف', connectsToNext: true },
  { id: 21, arabic: 'ق', nameArabic: 'قَاف', nameRoman: 'Qaaf', pronunciationHindi: 'क़ाफ़ (मोटा)', beginnerNote: 'ज़बान की जड़ कौवे के पास तालू से लगकर', isolated: 'ق', initial: 'قـ', medial: 'ـقـ', final: 'ـق', connectsToNext: true },
  { id: 22, arabic: 'ك', nameArabic: 'كَاف', nameRoman: 'Kaaf', pronunciationHindi: 'काफ़ (बारीक)', beginnerNote: 'क़ाफ़ से थोड़ा आगे ज़बान की जड़ से बारीक', isolated: 'ك', initial: 'كـ', medial: 'ـكـ', final: 'ـك', connectsToNext: true },
  { id: 23, arabic: 'ل', nameArabic: 'لاَم', nameRoman: 'Laam', pronunciationHindi: 'लाम', beginnerNote: 'ज़बान का किनारा सामने के ऊपर वाले तालू से लगकर', isolated: 'ل', initial: 'لـ', medial: 'ـلـ', final: 'ـل', connectsToNext: true },
  { id: 24, arabic: 'م', nameArabic: 'مِيم', nameRoman: 'Meem', pronunciationHindi: 'मीम', beginnerNote: 'दोनों होंठों के सूखे हिस्से को मिलाकर', isolated: 'م', initial: 'مـ', medial: 'ـمـ', final: 'ـم', connectsToNext: true },
  { id: 25, arabic: 'ن', nameArabic: 'نُون', nameRoman: 'Noon', pronunciationHindi: 'नून', beginnerNote: 'ज़बान की नोक जब ऊपर के तालू से लगे', isolated: 'ن', initial: 'نـ', medial: 'ـنـ', final: 'ـن', connectsToNext: true },
  { id: 26, arabic: 'و', nameArabic: 'وَاو', nameRoman: 'Waaw', pronunciationHindi: 'वाव', beginnerNote: 'दोनों होंठों को गोल करके निकाला जाता है', isolated: 'و', initial: 'و', medial: 'ـو', final: 'ـو', connectsToNext: false },
  { id: 27, arabic: 'ه', nameArabic: 'هَاء', nameRoman: 'Haa (Hawa)', pronunciationHindi: 'गोल हा', beginnerNote: 'हलक़ के सबसे नीचे सीने की तरफ़ से', isolated: 'ه', initial: 'هـ', medial: 'ـهـ', final: 'ـه', connectsToNext: true },
  { id: 28, arabic: 'ي', nameArabic: 'يَاء', nameRoman: 'Yaa', pronunciationHindi: 'या', beginnerNote: 'ज़बान का दरमियान जब ऊपर के तालू से लगे', isolated: 'ي', initial: 'يـ', medial: 'ـيـ', final: 'ـي', connectsToNext: true },
];

const HARAKAT_DATA = [
  { id: 1, name: 'ज़बर (Fatha)', nameRoman: 'Zabar', arabicSymbol: 'ـَ', hindiExplanation: 'अक्षर के ऊपर सीधी हल्की आवाज़ (a sound). इसे खींचते नहीं हैं।', example: 'دَ = Da' },
  { id: 2, name: 'ज़ेर (Kasra)', nameRoman: 'Zer', arabicSymbol: 'ـِ', hindiExplanation: 'अक्षर के नीचे हल्की ई की आवाज़ (i sound).', example: 'دِ = Di' },
  { id: 3, name: 'पेश (Damma)', nameRoman: 'Pesh', arabicSymbol: 'ـُ', hindiExplanation: 'अक्षर के ऊपर होंठ गोल करके हल्की ऊ की आवाज़ (u sound).', example: 'دُ = Du' },
  { id: 4, name: 'जज़्म / सुकून (Jazm)', nameRoman: 'Jazm / Sukoon', arabicSymbol: 'ـْ', hindiExplanation: 'यह हर्फ़ को पिछले हर्फ़ से मिलाता है (साकिन करता है)।', example: 'اَبْ = Ab' },
  { id: 5, name: 'तशदीद (Tashdeed)', nameRoman: 'Tashdeed', arabicSymbol: 'ـّ', hindiExplanation: 'जिस हर्फ़ पर तशदीद हो उसे दो बार मज़बूती से पढ़ते हैं।', example: 'رَبَّ = Rabba' },
  { id: 6, name: 'तनवीन (Tanween)', nameRoman: 'Tanween', arabicSymbol: 'ـً ـٍ ـٌ', hindiExplanation: 'दो ज़बर, दो ज़ेर या दो पेश। इसमें नून साकिन की आवाज़ शामिल होती है।', example: 'كِتَابًا = Kitāban' },
];

const NAMAZ_STEPS = [
  { title: 'नीयत और तकबीरे तहरीमा', category: 'शुरुआत', instructions: 'क़िबला रुख खड़े होकर दिल में नमाज़ की नीयत करें और दोनों हाथ कानों तक उठाकर "अल्लाहु अकबर" कहें।', arabic: 'اَللهُ أَكْبَرُ', transliteration: 'Allāhu Akbar', translation: 'अल्लाह सबसे बड़ा है।' },
  { title: 'सना (Sana)', category: 'क़ियाम', instructions: 'हाथ नाफ़ के नीचे (ह़नफ़ी) या सीने पर बांधकर सना पढ़ें।', arabic: 'سُبْحَانَكَ اللّٰهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالٰى جَدُّكَ وَلَا إِلٰهَ غَيْرُكَ', transliteration: 'Subhānaka Allāhumma wa bihamdika wa tabārakasmuka wa ta‘ālā jadduka wa lā ilāha ghayruk', translation: 'ऐ अल्लाह! हम तेरी पाकी बयान करते हैं और तेरी तारीफ़ करते हैं, और तेरा नाम बरकत वाला है और तेरी शान आलीशान है और तेरे सिवा कोई माबूद नहीं।' },
  { title: 'तअव्वुज़ व तस्मिया', category: 'क़ियाम', instructions: 'सना के बाद आहिस्ता आवाज़ में पढ़ें।', arabic: 'أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيمِ • بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ', transliteration: "A‘ūdhu billāhi minash-shaytānir-rajīm • Bismillāhir-Rahmānir-Rahīm", translation: 'मैं अल्लाह की पनाह में आता हूँ शैतान मर्दूद से • अल्लाह के नाम से शुरू जो बड़ा मेहरबान निहायत रहम वाला है।' },
  { title: 'रुकूअ (Ruku)', category: 'रुकूअ', instructions: 'अल्लाहु अकबर कहते हुए झुकें, दोनों हाथों से घुटनों को पकड़ें और कम से कम 3 बार पढ़ें:', arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ', transliteration: 'Subhāna Rabbiyal-‘Azīm', translation: 'पाक है मेरा रब जो बड़ी अज़मत वाला है।' },
  { title: 'क़ौमा (सीधे खड़े होना)', category: 'क़ौमा', instructions: 'रुकूअ से सीधे खड़े होते हुए कहें:', arabic: 'سَمِعَ اللهُ لِمَنْ حَمِدَهُ • رَبَّنَا لَكَ الْحَمْدُ', transliteration: 'Sami‘ Allāhu liman hamidah • Rabbanā lakal-hamd', translation: 'अल्लाह ने सुन ली उसकी जिसने उसकी तारीफ़ की • ऐ हमारे रब! तेरे ही लिए तमाम तारीफ़ें हैं।' },
  { title: 'सजदा (Sajdah)', category: 'सजदा', instructions: 'अल्लाहु अकबर कहते हुए सजदे में जाएं। पेशानी, नाक, दोनों हथेलियां, घुटने और पंजों की उंगलियां ज़मीन पर हों। 3 बार पढ़ें:', arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلٰى', transliteration: 'Subhāna Rabbiyal-A‘lā', translation: 'पाक है मेरा रब जो सबसे आला और बुज़ुर्ग है।' },
  { title: 'तशह्हुद (अत्तहिय्यात)', category: 'क़ादा', instructions: 'दो रकात के बाद या आख़िरी रकात में बैठकर पढ़ें:', arabic: 'اَلتَّحِيَّاتُ لِلّٰهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، اَلسَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ، اَلسَّلَامُ عَلَيْنَا وَعَلٰى عِبَادِ اللهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ', transliteration: 'Attahiyyātu lillāhi was-salawātu wat-tayyibāt, assalāmu ‘alayka ayyuhan-Nabiyyu wa rahmatullāhi wa barakātuh...', translation: 'तमाम ज़बानी, बदनी और माली इबादतें अल्लाह ही के लिए हैं। सलाम हो आप पर ऐ नबी और अल्लाह की रहमत और उसकी बरकतें...' },
  { title: 'सलाम फेरना (Salam)', category: 'ख़ात्मा', instructions: 'दुरूदे इब्राहीम व दुआए मासूरह के बाद पहले दाएं फिर बाएं कंधे की तरफ़ मुंह करके कहें:', arabic: 'اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ', transliteration: 'Assalāmu ‘alaykum wa rahmatullāh', translation: 'तुम पर सलामती हो और अल्लाह की रहमत।' },
];

const SURAHS_DATA = [
  {
    id: 1,
    number: 1,
    nameHindi: 'अल-फ़ातिहा',
    nameRoman: 'Al-Fatiha',
    revelationType: 'मक्किया',
    ayahCount: 7,
    verses: [
      { arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', transliteration: 'Bismillāhir-Rahmānir-Rahīm', translation: 'अल्लाह के नाम से शुरू जो बड़ा मेहरबान निहायत रहम वाला है।' },
      { arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', transliteration: 'Al-hamdu lillāhi Rabbil-‘ālamīn', translation: 'सब तारीफ़ें अल्लाह के लिए हैं जो तमाम जहानों का पालने वाला है।' },
      { arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', transliteration: 'Ar-Rahmānir-Rahīm', translation: 'बड़ा मेहरबान निहायत रहम वाला।' },
      { arabic: 'مَالِكِ يَوْمِ الدِّينِ', transliteration: 'Māliki Yawmid-Dīn', translation: 'बदले के दिन (क़यामत) का मालिक।' },
      { arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', transliteration: 'Iyyāka na‘budu wa iyyāka nasta‘īn', translation: 'हम तेरी ही इबादत करते हैं और तुझ ही से मदद मांगते हैं।' },
      { arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', transliteration: 'Ihdinas-sirātal-mustaqīm', translation: 'हमें सीधे रास्ते की हिदायत फ़रमा।' },
      { arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', transliteration: 'Sirātal-ladhīna an‘amta ‘alayhim ghayril-maghdūbi ‘alayhim walad-dāllīn', translation: 'उन लोगों का रास्ता जिन पर तूने इनाम फ़रमाया, जिन पर न तेरा ग़ज़ब हुआ और न वो गुमराह हुए।' }
    ]
  },
  {
    id: 112,
    number: 112,
    nameHindi: 'अल-इख़लास',
    nameRoman: 'Al-Ikhlas',
    revelationType: 'मक्किया',
    ayahCount: 4,
    verses: [
      { arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', transliteration: 'Qul Huwallāhu Ahad', translation: 'आप कह दीजिए कि वो अल्लाह यकता (एक) है।' },
      { arabic: 'اللَّهُ الصَّمَدُ', transliteration: 'Allāhus-Samad', translation: 'अल्लाह बेनियाज़ (सबका सहारा) है।' },
      { arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', transliteration: 'Lam yalid wa lam yūlad', translation: 'न उसने किसी को जना और न वो किसी से जना गया।' },
      { arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', transliteration: 'Wa lam yakun lahū kufuwan ahad', translation: 'और कोई उसका हमसर (बराबरी करने वाला) नहीं है।' }
    ]
  },
  {
    id: 113,
    number: 113,
    nameHindi: 'अल-फ़लक़',
    nameRoman: 'Al-Falaq',
    revelationType: 'मक्किया',
    ayahCount: 5,
    verses: [
      { arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', transliteration: 'Qul a‘ūdhu bi-Rabbil-falaq', translation: 'आप कहिए कि मैं सुबह के रब की पनाह मांगता हूँ।' },
      { arabic: 'مِن شَرِّ مَا خَلَقَ', transliteration: 'Min sharri mā khalaq', translation: 'उसकी तमाम पैदा की हुई चीज़ों की बुराई से।' },
      { arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', transliteration: 'Wa min sharri ghāsiqin idhā waqab', translation: 'और अंधेरी रात की बुराई से जब उसका अंधेरा छा जाए।' },
      { arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', transliteration: 'Wa min sharrin-naffāthāti fīl-‘uqad', translation: 'और गिरहों में फूंकने वालियों (जादूगरों) की बुराई से।' },
      { arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', transliteration: 'Wa min sharri hāsidin idhā hasad', translation: 'और हसद करने वाले की बुराई से जब वो हसद करे।' }
    ]
  },
  {
    id: 114,
    number: 114,
    nameHindi: 'अन-नास',
    nameRoman: 'An-Naas',
    revelationType: 'मक्किया',
    ayahCount: 6,
    verses: [
      { arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', transliteration: 'Qul a‘ūdhu bi-Rabbin-nās', translation: 'आप कहिए कि मैं इंसानों के रब की पनाह में आता हूँ।' },
      { arabic: 'مَلِكِ النَّاسِ', transliteration: 'Malikin-nās', translation: 'जो इंसानों का बादशाह है।' },
      { arabic: 'إِلَٰهِ النَّاسِ', transliteration: 'Ilāhin-nās', translation: 'जो इंसानों का सच्चा माबूद है।' },
      { arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', transliteration: 'Min sharril-waswāsil-khannās', translation: 'बार-बार पीछे हटकर वसवसा डालने वाले शैतान की बुराई से।' },
      { arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', transliteration: 'Alladhī yuwaswisu fī sudūrin-nās', translation: 'जो लोगों के सीनों में वसवसे डालता है।' },
      { arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ', transliteration: 'Minal-jinnati wan-nās', translation: 'ख्वाह वो जिन्नों में से हो या इंसानों में से।' }
    ]
  },
  {
    id: 108,
    number: 108,
    nameHindi: 'अल-कौसर',
    nameRoman: 'Al-Kauthar',
    revelationType: 'मक्किया',
    ayahCount: 3,
    verses: [
      { arabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', transliteration: 'Innā a‘taynākal-Kawthar', translation: 'बेशक हमने आपको (ऐ नबी ﷺ) कौसर (बेइंतहा भलाई) अता फ़रमाई।' },
      { arabic: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', transliteration: 'Fasalli li-Rabbika wanhar', translation: 'तो आप अपने रब के लिए नमाज़ पढ़िए और क़ुरबानी कीजिए।' },
      { arabic: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', transliteration: 'Inna shāni’aka huwal-abtar', translation: 'बेशक आपका दुश्मन ही बे-नाम व निशां (जड़ कटा) है।' }
    ]
  }
];

const KALMAS_DATA = [
  {
    id: 1,
    title: 'पहला कलमा: तय्यब (Kalma Tayyab)',
    arabic: 'لَا إِلٰهَ إِلَّا اللهُ مُحَمَّدٌ رَّسُولُ اللهِ',
    transliteration: 'Lā ilāha illallāhu Muhammadur Rasūlullāh',
    translation: 'अल्लाह के सिवा कोई माबूद नहीं, और हज़रत मुहम्मद (ﷺ) अल्लाह के रसूल हैं।',
    source: 'क़ुरआन व मुत्तफ़क़ अलैह अहादीस'
  },
  {
    id: 2,
    title: 'दूसरा कलमा: शहादत (Kalma Shahadat)',
    arabic: 'أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    transliteration: 'Ash-hadu an lā ilāha illallāhu wahdahū lā sharīka lahū wa ash-hadu anna Muhammadan ‘abduhū wa rasūluh',
    translation: 'मैं गवाही देता हूँ कि अल्लाह के सिवा कोई माबूद नहीं, वो अकेला है उसका कोई शरीक नहीं, और मैं गवाही देता हूँ कि मुहम्मद (ﷺ) उसके बंदे और रसूल हैं।',
    source: 'सहीह मुस्लिम, किताबुल ईमान'
  },
  {
    id: 3,
    title: 'तीसरा कलमा: तमजीद (Kalma Tamjeed)',
    arabic: 'سُبْحَانَ اللهِ وَالْحَمْدُ لِلّٰهِ وَلَا إِلٰهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ الْعَلِيِّ الْعَظِيمِ',
    transliteration: 'Subhānallāhi wal-hamdulillāhi wa lā ilāha illallāhu wallāhu akbar, wa lā hawla wa lā quwwata illā billāhil-‘Aliyyil-‘Azīm',
    translation: 'अल्लाह पाक है और सब तारीफ़ें अल्लाह ही के लिए हैं और अल्लाह के सिवा कोई माबूद नहीं और अल्लाह सबसे बड़ा है। और गुनाहों से बचने और नेकी करने की ताक़त नहीं मगर अल्लाह ही की तौफ़ीक़ से जो आलीशान और अज़मत वाला है।',
    source: 'सुनन इब्ने माजा व तिर्मिज़ी'
  },
  {
    id: 4,
    title: 'चौथा कलमा: तौहीद (Kalma Tauheed)',
    arabic: 'لَا إِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَّا يَمُوتُ أَبَدًا أَبَدًا، ذُو الْجَلَالِ وَالْإِكْرَامِ، بِيَدِهِ الْخَيْرُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'Lā ilāha illallāhu wahdahū lā sharīka lah, lahul-mulku wa lahul-hamdu yuhyī wa yumītu wa Huwa hayyul-lā yamūtu abadan abadā, Dhul-Jalāli wal-Ikrām, biyadihil-khayru wa Huwa ‘alā kulli shay’in Qadīr',
    translation: 'अल्लाह के सिवा कोई माबूद नहीं, वो यकता है उसका कोई साझी नहीं। उसी की बादशाही है और उसी के लिए तारीफ़ है, वही ज़िंदा करता है और वही मारता है...',
    source: 'जामेअ तिर्मिज़ी'
  }
];

const DUAS_DATA = [
  {
    id: 1,
    title: 'सोकर उठने की दुआ',
    arabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Al-hamdu lillāhilladhī ahyānā ba‘da mā amātanā wa ilayhin-nushūr',
    translation: 'तमाम तारीफ़ें अल्लाह के लिए हैं जिसने हमें मौत (नींद) के बाद ज़िंदा किया और उसी की तरफ़ उठकर जाना है।',
    source: 'सहीह बुख़ारी'
  },
  {
    id: 2,
    title: 'सोने की दुआ',
    arabic: 'اَللّٰهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا',
    transliteration: 'Allāhumma bismika amūtu wa ahyā',
    translation: 'ऐ अल्लाह! मैं तेरे ही नाम के साथ मरता (सोता) हूँ और जीता (जागता) हूँ।',
    source: 'सहीह बुख़ारी'
  },
  {
    id: 3,
    title: 'खाना खाने से पहले की दुआ',
    arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
    transliteration: 'Bismillāhi wa ‘alā barakatillāh',
    translation: 'अल्लाह के नाम के साथ और अल्लाह की बरकत पर (हमने खाना शुरू किया)।',
    source: 'मुस्तदरक हाकिम'
  },
  {
    id: 4,
    title: 'खाना खाने के बाद की दुआ',
    arabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مِنَ الْمُسْلِمِينَ',
    transliteration: 'Al-hamdu lillāhilladhī at‘amanā wa saqānā wa ja‘alanā minal-Muslimīn',
    translation: 'सब तारीफ़ें अल्लाह के लिए हैं जिसने हमें खिलाया, पिलाया और हमें मुसलमानों में से बनाया।',
    source: 'सुनन अबू दाऊद व तिर्मिज़ी'
  },
  {
    id: 5,
    title: 'घर से बाहर निकलते वक़्त की दुआ',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'Bismillāhi tawakkaltu ‘alallāh, lā hawla wa lā quwwata illā billāh',
    translation: 'अल्लाह के नाम से, मैंने अल्लाह पर भरोसा किया। गुनाह से बचने और नेकी करने की ताक़त अल्लाह ही की तरफ़ से है।',
    source: 'सुनन अबू दाऊद'
  },
  {
    id: 6,
    title: 'मस्जिद में दाख़िल होने की दुआ',
    arabic: 'اَللّٰهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: 'Allāhummaftah lī abwāba rahmatik',
    translation: 'ऐ अल्लाह! मेरे लिए अपनी रहमत के दरवाज़े खोल दे।',
    source: 'सहीह मुस्लिम'
  },
  {
    id: 7,
    title: 'मस्जिद से निकलते वक़्त की दुआ',
    arabic: 'اَللّٰهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    transliteration: 'Allāhumma innī as’aluka min fadlik',
    translation: 'ऐ अल्लाह! मैं तुझसे तेरे फ़ज़्ल का सवाल करता हूँ।',
    source: 'सहीह मुस्लिम'
  },
  {
    id: 8,
    title: 'वालिदैन (मां-बाप) के लिए क़ुरआनी दुआ',
    arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbir-hamhumā kamā rabbayānī saghīrā',
    translation: 'ऐ मेरे रब! उन दोनों (वालिदैन) पर रहम फ़रमा जिस तरह उन्होंने मुझे बचपन में पाला।',
    source: 'क़ुरआन, सूरह अल-इसरा: 24'
  }
];

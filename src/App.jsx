import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Check, BookOpen, Video, Award, Compass, Clock, DollarSign, Sparkles, Heart, MessageCircle, ArrowRight, Play, HelpCircle, RefreshCw, Home, TrendingUp, Target, Zap, User, Settings, ChevronLeft, Code, Database, Brain, BarChart3, Menu, X, Sliders, Eye, GraduationCap } from 'lucide-react';

const pathways = {
  "qa-to-swe": {
    id: "qa-to-swe",
    fromRole: "QA Analyst",
    toRole: "Software Engineer",
    icon: Code,
    color: "violet",
    totalDuration: "12 Weeks",
    description: "Transition from testing to building. This pathway focuses on JavaScript full-stack development—the highest-demand stack for career changers.",
    steps: [
      { id: 1, title: "The Foundations", subtitle: "HTML, CSS, Git", duration: "3 Weeks", tags: ["FREE", "PROJECT-BASED"], why: "This curriculum is community-vetted as the best starting point. Git is the critical tool employers demand to prove you can collaborate in a team.", progress: 65, resource: { type: "Curriculum", name: "The Odin Project: Foundations", desc: "A text-heavy, deep-dive curriculum that forces you to set up a local development environment." }, altResource: { type: "Video Series", name: "SuperSimpleDev: HTML & CSS Full Course", desc: "A visual, step-by-step video walkthrough for visual learners who find documentation dry." } },
      { id: 2, title: "Full-Stack JavaScript", subtitle: "React & Node.js", duration: "5 Weeks", tags: ["FREE", "HIGH DEMAND", "CERTIFICATION"], why: "Job descriptions show 40% higher demand for React over other frameworks. This single path teaches both front-end and back-end, maximizing your learning ROI.", progress: 20, resource: { type: "Interactive Course", name: "Full Stack Open (University of Helsinki)", desc: "Industry-standard rigorous coursework with code submission and real feedback." }, altResource: { type: "Interactive Video", name: "Scrimba: Learn React for Free", desc: "Interactive screencasts where you can pause and edit code directly in the video player." } },
      { id: 3, title: "Your 'Experience' Project", subtitle: "Portfolio Piece", duration: "4 Weeks", tags: ["PORTFOLIO", "HIREABLE SIGNAL"], why: "Reddit data confirms that for non-CS grads, a deployed complex project is the #1 substitute for work experience. This is your proof of capability.", progress: 0, resource: { type: "Project Brief", name: "Build a Full-Stack E-Commerce Clone", desc: "Build a shopping cart with Stripe integration. Hosting it on Vercel proves you understand deployment." }, altResource: { type: "Guided Project", name: "YouTube: Build an Amazon Clone (5 Hour Build)", desc: "Follow along with a senior dev to build the feature, then customize it for your portfolio." } }
    ]
  },
  "da-to-mle": {
    id: "da-to-mle",
    fromRole: "Data Analyst",
    toRole: "ML Engineer",
    icon: Brain,
    color: "cyan",
    totalDuration: "16 Weeks",
    description: "Level up from analyzing data to building predictive models. This pathway fills the gap between SQL dashboards and production ML systems.",
    steps: [
      { id: 1, title: "Core Machine Learning", subtitle: "Algorithms & Scikit-learn", duration: "4 Weeks", tags: ["FREE", "CERTIFICATION", "PROJECT-BASED"], why: "This fills the gap between simple analysis and building predictive models. Kaggle's courses are the community's most-trusted starting point with real certificates.", progress: 100, resource: { type: "Interactive Course", name: "Kaggle: Intro to Machine Learning", desc: "Hands-on course covering decision trees, random forests, and model validation with real datasets." }, altResource: { type: "Video Course", name: "StatQuest: Machine Learning Fundamentals", desc: "Josh Starmer's visual explanations make complex algorithms intuitive and memorable." } },
      { id: 2, title: "Deep Learning & Neural Nets", subtitle: "TensorFlow/PyTorch", duration: "5 Weeks", tags: ["FREE", "AI-RESISTANT", "HIGH DEMAND"], why: "This is the 'AI-resistant' skill. You'll learn to build the neural networks that power modern AI, moving you far beyond traditional analyst work.", progress: 45, resource: { type: "Interactive Course", name: "Kaggle: Intro to Deep Learning", desc: "Learn neural networks, CNNs, and transfer learning with GPU-accelerated notebooks." }, altResource: { type: "Video Series", name: "3Blue1Brown: Neural Networks", desc: "Beautiful visual explanations of how neural networks actually work under the hood." } },
      { id: 3, title: "MLOps & Deployment", subtitle: "FastAPI, Docker, Cloud", duration: "4 Weeks", tags: ["FREE", "HIREABLE SIGNAL"], why: "The final, most crucial step. This proves you're an engineer, not just an analyst. You can build tools the rest of the company can use.", progress: 0, resource: { type: "Tutorial Series", name: "Made With ML: MLOps Course", desc: "End-to-end MLOps covering testing, versioning, deployment, and monitoring." }, altResource: { type: "Video Tutorial", name: "Patrick Loeber: Deploy ML Models with FastAPI", desc: "Step-by-step video guide to wrapping your model in a REST API." } },
      { id: 4, title: "Capstone Project", subtitle: "End-to-End ML System", duration: "3 Weeks", tags: ["PORTFOLIO", "INTERVIEW-READY"], why: "Your 'stuck' feeling comes from analysis projects. This proves you can build a complete ML system from data to deployment.", progress: 0, resource: { type: "Project Brief", name: "Build a Customer Churn Predictor", desc: "Full pipeline: data processing, model training, API deployment, and monitoring dashboard." }, altResource: { type: "Guided Project", name: "YouTube: Complete ML Project Tutorial", desc: "Follow along building a sentiment analysis system deployed on AWS." } }
    ]
  }
};

const Tag = ({ label }) => {
  const getTagStyle = (tag) => {
    if (tag.includes("FREE")) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    if (tag.includes("PROJECT") || tag.includes("PORTFOLIO")) return "bg-violet-500/20 text-violet-300 border-violet-500/30";
    if (tag.includes("CERT") || tag.includes("HIREABLE") || tag.includes("INTERVIEW")) return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    if (tag.includes("DEMAND") || tag.includes("AI-RESISTANT")) return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
    return "bg-slate-500/20 text-slate-300 border-slate-500/30";
  };
  return <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getTagStyle(label)}`}>{label}</span>;
};

const ProgressRing = ({ progress, size = 52 }) => {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  const isComplete = progress === 100;
  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgb(51 65 85)" strokeWidth="4" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={isComplete ? "#10b981" : "url(#grad)"} strokeWidth="4" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-500" />
        <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {isComplete ? <Check className="w-5 h-5 text-emerald-400" /> : <span className="text-sm font-bold text-white">{progress > 0 ? `${progress}%` : ''}</span>}
      </div>
    </div>
  );
};

const OverallProgress = ({ pathway }) => {
  const totalProgress = pathway.steps.reduce((sum, s) => sum + s.progress, 0);
  const avgProgress = Math.round(totalProgress / pathway.steps.length);
  const completedSteps = pathway.steps.filter(s => s.progress === 100).length;
  return (
    <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-700/50 mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-300">Overall Progress</span>
        <span className="text-sm text-slate-400">{completedSteps}/{pathway.steps.length} steps completed</span>
      </div>
      <div className="h-4 bg-slate-700 rounded-full overflow-hidden mb-3">
        <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all duration-500" style={{ width: `${avgProgress}%` }} />
      </div>
      <div className="flex justify-between text-sm text-slate-500">
        <span>{avgProgress}% complete</span>
        <span>~{pathway.totalDuration} total</span>
      </div>
    </div>
  );
};

const StepCard = ({ step, stepNum, isExpanded, onToggle, isStruggling, onStruggle, color }) => {
  const [showWhy, setShowWhy] = useState(false);
  const resource = isStruggling ? step.altResource : step.resource;
  const isComplete = step.progress === 100;
  return (
    <div className="relative">
      <div className={`relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border transition-all duration-300 ${isExpanded ? 'border-violet-500/50 shadow-lg shadow-violet-500/5' : 'border-slate-700/50 hover:border-slate-600/50'} ${isComplete ? 'border-emerald-500/30' : ''}`}>
        <button onClick={onToggle} className="w-full p-5 lg:p-6 flex items-center gap-4 text-left">
          <ProgressRing progress={step.progress} />
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold ${isComplete ? 'text-emerald-300' : 'text-white'}`}>Step {stepNum}: {step.title}</h3>
            <p className="text-slate-400">{step.subtitle} • {step.duration}</p>
          </div>
          <div className="hidden md:flex gap-2 flex-wrap">{step.tags.slice(0,3).map((tag, i) => <Tag key={i} label={tag} />)}</div>
          {isExpanded ? <ChevronDown className="w-6 h-6 text-slate-400" /> : <ChevronRight className="w-6 h-6 text-slate-400" />}
        </button>
        {isExpanded && (
          <div className="px-5 lg:px-6 pb-5 lg:pb-6 space-y-4">
            <div className="flex gap-2 flex-wrap md:hidden">{step.tags.map((tag, i) => <Tag key={i} label={tag} />)}</div>
            <div className={`p-4 lg:p-5 rounded-xl border ${isStruggling ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-700/30 border-slate-600/30'}`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${isStruggling ? 'bg-emerald-500/20' : 'bg-violet-500/20'}`}>
                  {resource.type.includes("Video") ? <Video className={`w-6 h-6 ${isStruggling ? 'text-emerald-400' : 'text-violet-400'}`} /> : <BookOpen className={`w-6 h-6 ${isStruggling ? 'text-emerald-400' : 'text-violet-400'}`} />}
                </div>
                <div className="flex-1">
                  <span className="text-xs text-slate-500 uppercase tracking-wide">{isStruggling ? '🎯 Visual Alternative' : resource.type}</span>
                  <h4 className="font-semibold text-white text-lg mt-1">{resource.name}</h4>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">{resource.desc}</p>
                  <button className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-sm font-medium rounded-xl transition-all">
                    {isComplete ? 'Review' : 'Start Learning'} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowWhy(!showWhy)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm rounded-xl border border-slate-600/50 transition-all">
                <HelpCircle className="w-4 h-4" /> Why this step?
              </button>
              <button onClick={onStruggle} className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl border transition-all ${isStruggling ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300 border-slate-600/50'}`}>
                <RefreshCw className="w-4 h-4" /> {isStruggling ? 'Show original' : "I'm struggling"}
              </button>
            </div>
            {showWhy && (
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                <p className="text-sm text-slate-300 flex gap-3"><Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" /> {step.why}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ConstraintSlider = ({ label, icon: Icon, value, onChange, min, max, step, format, description }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-300">{label}</span>
        </div>
        <span className="text-sm font-semibold text-violet-400">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-violet-500"
        style={{
          background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((value - min) / (max - min)) * 100}%, #334155 ${((value - min) / (max - min)) * 100}%, #334155 100%)`
        }}
      />
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  );
};

const Sidebar = ({ userName, currentView, onNavigate, constraints, setConstraints }) => {
  return (
    <div className="hidden lg:flex flex-col w-80 bg-slate-900/80 border-r border-slate-800 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-xl">
            <Compass className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">SkillBridge AI</h1>
            <p className="text-xs text-slate-400">Your Career Navigator</p>
          </div>
        </div>
      </div>
      
      {/* User Profile Section */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3 px-3 py-3 bg-slate-800/50 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
            {userName.charAt(0)}
          </div>
          <div>
            <p className="text-white font-medium">{userName}</p>
            <p className="text-xs text-slate-400">QA Analyst → Career Changer</p>
          </div>
        </div>
      </div>

      {/* Constraints Section */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-white">Your Constraints</h3>
        </div>
        
        <div className="space-y-6">
          <ConstraintSlider
            label="Monthly Budget"
            icon={DollarSign}
            value={constraints.budget}
            onChange={(v) => setConstraints({...constraints, budget: v})}
            min={0}
            max={500}
            step={25}
            format={(v) => v === 0 ? 'Free Only' : `$${v}/mo`}
            description={constraints.budget === 0 ? "Prioritizing free resources" : "Including premium options"}
          />
          
          <ConstraintSlider
            label="Weekly Hours"
            icon={Clock}
            value={constraints.hours}
            onChange={(v) => setConstraints({...constraints, hours: v})}
            min={5}
            max={40}
            step={5}
            format={(v) => `${v} hrs/week`}
            description={constraints.hours <= 10 ? "Part-time learning pace" : constraints.hours <= 20 ? "Moderate commitment" : "Intensive schedule"}
          />
        </div>
      </div>

      {/* Learning Preferences */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Learning Style</h3>
        </div>
        
        <div className="space-y-2">
          {[
            { id: 'visual', label: 'Visual (Videos)', icon: Video },
            { id: 'reading', label: 'Reading (Docs)', icon: BookOpen },
            { id: 'handson', label: 'Hands-on (Projects)', icon: Code },
          ].map((style) => (
            <button
              key={style.id}
              onClick={() => setConstraints({...constraints, learningStyle: style.id})}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                constraints.learningStyle === style.id 
                  ? 'bg-violet-500/20 border border-violet-500/30 text-violet-300' 
                  : 'bg-slate-800/30 border border-slate-700/50 text-slate-400 hover:bg-slate-800/50'
              }`}
            >
              <style.icon className="w-4 h-4" />
              <span className="text-sm">{style.label}</span>
              {constraints.learningStyle === style.id && <Check className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </div>
      </div>

      {/* Current Optimization Banner */}
      <div className="p-4 border-b border-slate-800">
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-emerald-300">Optimizing for:</p>
              <p className="text-xs text-emerald-400/80 mt-1">
                {constraints.budget === 0 ? '✓ Zero Budget' : `✓ Under $${constraints.budget}/mo`}
                <br />
                ✓ {constraints.hours} hrs/week
                <br />
                ✓ {constraints.learningStyle === 'visual' ? 'Visual' : constraints.learningStyle === 'reading' ? 'Reading' : 'Hands-on'} Learning
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <button onClick={() => onNavigate('home')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'home' || currentView === 'pathway' ? 'bg-violet-500/20 text-violet-300' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <Home className="w-5 h-5" /> <span className="font-medium">Home</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
          <BarChart3 className="w-5 h-5" /> <span className="font-medium">Progress</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
          <Settings className="w-5 h-5" /> <span className="font-medium">Settings</span>
        </button>
      </nav>
    </div>
  );
};

const MobileHeader = ({ userName, onOpenConstraints }) => {
  return (
    <header className="lg:hidden border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-xl">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">SkillBridge AI</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onOpenConstraints}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-lg"
            >
              <Sliders className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-white">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const MobileConstraintsModal = ({ isOpen, onClose, constraints, setConstraints }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden">
      <div className="absolute bottom-0 left-0 right-0 bg-slate-900 rounded-t-3xl border-t border-slate-700 p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Your Constraints</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-6">
          <ConstraintSlider
            label="Monthly Budget"
            icon={DollarSign}
            value={constraints.budget}
            onChange={(v) => setConstraints({...constraints, budget: v})}
            min={0}
            max={500}
            step={25}
            format={(v) => v === 0 ? 'Free Only' : `$${v}/mo`}
            description={constraints.budget === 0 ? "Prioritizing free resources" : "Including premium options"}
          />
          
          <ConstraintSlider
            label="Weekly Hours"
            icon={Clock}
            value={constraints.hours}
            onChange={(v) => setConstraints({...constraints, hours: v})}
            min={5}
            max={40}
            step={5}
            format={(v) => `${v} hrs/week`}
            description={constraints.hours <= 10 ? "Part-time learning pace" : constraints.hours <= 20 ? "Moderate commitment" : "Intensive schedule"}
          />
          
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-slate-300">Learning Style</span>
            </div>
            <div className="space-y-2">
              {[
                { id: 'visual', label: 'Visual (Videos)', icon: Video },
                { id: 'reading', label: 'Reading (Docs)', icon: BookOpen },
                { id: 'handson', label: 'Hands-on (Projects)', icon: Code },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setConstraints({...constraints, learningStyle: style.id})}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    constraints.learningStyle === style.id 
                      ? 'bg-violet-500/20 border border-violet-500/30 text-violet-300' 
                      : 'bg-slate-800/30 border border-slate-700/50 text-slate-400'
                  }`}
                >
                  <style.icon className="w-4 h-4" />
                  <span className="text-sm">{style.label}</span>
                  {constraints.learningStyle === style.id && <Check className="w-4 h-4 ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full mt-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium rounded-xl"
        >
          Apply Constraints
        </button>
      </div>
    </div>
  );
};

const MobileNav = ({ currentView, onNavigate }) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 z-40">
      <div className="px-4 py-3">
        <div className="flex justify-around">
          {[{ icon: Home, label: 'Home', view: 'home' }, { icon: BarChart3, label: 'Progress', view: 'progress' }, { icon: Settings, label: 'Settings', view: 'settings' }].map(item => (
            <button key={item.view} onClick={() => item.view === 'home' && onNavigate('home')} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${currentView === item.view || (item.view === 'home' && currentView === 'pathway') ? 'text-violet-400' : 'text-slate-500 hover:text-slate-300'}`}>
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

const HomePage = ({ onSelectPathway, userName, constraints }) => {
  return (
    <div className="space-y-8">
      <div className="text-center py-8 lg:py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/20 border border-violet-500/30 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-sm text-violet-300">AI-Powered Career Navigation</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">Welcome back, {userName}</h1>
        <p className="text-slate-400 max-w-xl mx-auto">Your personalized pathways to an AI-resistant career. Each step is backed by community data and designed for your constraints.</p>
      </div>
      
      {/* Active Constraints Banner */}
      <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-violet-400" />
            <span className="text-sm font-medium text-white">Active Filters:</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs text-emerald-300">
              {constraints.budget === 0 ? '💰 Free Only' : `💰 Under $${constraints.budget}/mo`}
            </span>
            <span className="px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-xs text-cyan-300">
              ⏱️ {constraints.hours} hrs/week
            </span>
            <span className="px-3 py-1.5 bg-violet-500/20 border border-violet-500/30 rounded-full text-xs text-violet-300">
              {constraints.learningStyle === 'visual' ? '🎥 Visual' : constraints.learningStyle === 'reading' ? '📚 Reading' : '💻 Hands-on'}
            </span>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Your Pathways</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.values(pathways).map(pathway => {
            const Icon = pathway.icon;
            const progress = Math.round(pathway.steps.reduce((s, step) => s + step.progress, 0) / pathway.steps.length);
            return (
              <button key={pathway.id} onClick={() => onSelectPathway(pathway.id)} className="w-full p-5 lg:p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-2xl transition-all text-left group">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${pathway.color === 'violet' ? 'bg-violet-500/20' : 'bg-cyan-500/20'}`}>
                    <Icon className={`w-7 h-7 ${pathway.color === 'violet' ? 'text-violet-400' : 'text-cyan-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-slate-400">{pathway.fromRole}</span>
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                      <span className={`font-semibold ${pathway.color === 'violet' ? 'text-violet-300' : 'text-cyan-300'}`}>{pathway.toRole}</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{pathway.description}</p>
                    <div className="space-y-2">
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${pathway.color === 'violet' ? 'bg-violet-500' : 'bg-cyan-500'}`} style={{ width: `${progress}%` }} />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">{progress}% complete</span>
                        <div className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-4 h-4" /> {pathway.totalDuration}
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300 transition-colors mt-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="p-5 lg:p-6 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-xl">
            <DollarSign className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Free-First Philosophy</h3>
            <p className="text-sm text-slate-400">All pathways prioritize free, community-vetted resources. Paid options only when they offer clear ROI.</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {[{ icon: Target, label: "2 Pathways", sub: "Active" }, { icon: TrendingUp, label: "28%", sub: "Avg Progress" }, { icon: Zap, label: "12", sub: "Skills Tracked" }].map((stat, i) => (
          <div key={i} className="p-4 lg:p-5 bg-slate-800/30 rounded-xl border border-slate-700/50 text-center">
            <stat.icon className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <div className="text-xl lg:text-2xl font-bold text-white">{stat.label}</div>
            <div className="text-sm text-slate-500">{stat.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PathwayView = ({ pathway, onBack, constraints }) => {
  const [expandedStep, setExpandedStep] = useState(pathway.steps.find(s => s.progress < 100)?.id || 1);
  const [strugglingSteps, setStrugglingSteps] = useState({});
  const toggleStruggle = (stepId) => setStrugglingSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  const Icon = pathway.icon;
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ChevronLeft className="w-5 h-5" /> All Pathways
      </button>
      
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${pathway.color === 'violet' ? 'bg-violet-500/20' : 'bg-cyan-500/20'}`}>
          <Icon className={`w-7 h-7 ${pathway.color === 'violet' ? 'text-violet-400' : 'text-cyan-400'}`} />
        </div>
        <div>
          <div className="flex items-center gap-2 text-lg">
            <span className="text-slate-400">{pathway.fromRole}</span>
            <ArrowRight className="w-5 h-5 text-slate-500" />
            <span className={`font-semibold ${pathway.color === 'violet' ? 'text-violet-300' : 'text-cyan-300'}`}>{pathway.toRole}</span>
          </div>
        </div>
      </div>
      
      <div className="p-5 lg:p-6 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 rounded-2xl border border-violet-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-violet-500/20 rounded-xl hidden sm:block">
            <Sparkles className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Your Personalized Pathway</h2>
            <p className="text-slate-300 leading-relaxed">{pathway.description} All resources below are <span className="text-emerald-400 font-medium">{constraints.budget === 0 ? 'free' : `under $${constraints.budget}/mo`}</span> to respect your budget.</p>
            <div className="flex items-center gap-6 mt-4 text-sm text-slate-400">
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {pathway.totalDuration} total</span>
              <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> {pathway.steps.length} steps</span>
            </div>
          </div>
        </div>
      </div>
      
      <OverallProgress pathway={pathway} />
      
      <div className="space-y-4">
        {pathway.steps.map((step, i) => (
          <StepCard key={step.id} step={step} stepNum={i + 1} isExpanded={expandedStep === step.id} onToggle={() => setExpandedStep(expandedStep === step.id ? null : step.id)} isStruggling={strugglingSteps[step.id]} onStruggle={() => toggleStruggle(step.id)} color={pathway.color} />
        ))}
      </div>
      
      <div className="p-5 lg:p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-violet-400" /> Help us improve your pathway
        </h3>
        <textarea className="w-full p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-300 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 resize-none" rows={3} placeholder="Is a resource outdated? Too difficult? Let us know..." />
        <div className="flex justify-end mt-4">
          <button className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium rounded-xl transition-all">
            Submit Feedback
          </button>
        </div>
      </div>
      
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
        <p className="text-sm text-amber-300/80 text-center flex items-center justify-center gap-2">
          <Heart className="w-4 h-4" /> Remember: Every expert was once a beginner. You've got this.
        </p>
      </div>
    </div>
  );
};

export default function SkillBridgeAI() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedPathway, setSelectedPathway] = useState(null);
  const [mobileConstraintsOpen, setMobileConstraintsOpen] = useState(false);
  const [constraints, setConstraints] = useState({
    budget: 0,
    hours: 10,
    learningStyle: 'visual'
  });
  const userName = "Sarah";
  
  const handleSelectPathway = (pathwayId) => { 
    setSelectedPathway(pathwayId); 
    setCurrentView('pathway'); 
  };
  
  const handleBack = () => { 
    setCurrentView('home'); 
    setSelectedPathway(null); 
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex">
      <Sidebar 
        userName={userName} 
        currentView={currentView} 
        onNavigate={setCurrentView}
        constraints={constraints}
        setConstraints={setConstraints}
      />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <MobileHeader userName={userName} onOpenConstraints={() => setMobileConstraintsOpen(true)} />
        
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
          {currentView === 'home' && <HomePage onSelectPathway={handleSelectPathway} userName={userName} constraints={constraints} />}
          {currentView === 'pathway' && selectedPathway && <PathwayView pathway={pathways[selectedPathway]} onBack={handleBack} constraints={constraints} />}
        </main>
        
        <MobileNav currentView={currentView} onNavigate={(view) => { if (view === 'home') handleBack(); else setCurrentView(view); }} />
        <div className="h-20 lg:h-0" />
      </div>
      
      <MobileConstraintsModal 
        isOpen={mobileConstraintsOpen} 
        onClose={() => setMobileConstraintsOpen(false)}
        constraints={constraints}
        setConstraints={setConstraints}
      />
    </div>
  );
}
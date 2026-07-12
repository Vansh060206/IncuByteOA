import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, ArrowRight, Shield, Layers, CreditCard, 
  History, Database, 
  ChevronDown, Cpu, ExternalLink 
} from 'lucide-react';
import { getCarImage } from './VehicleDetails';

export const LandingPage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* Floating Navigation Header */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-slate-950/90 border-b border-slate-900/60 backdrop-blur-md py-4' 
          : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2.5 bg-indigo-650 rounded-xl group-hover:bg-indigo-550 transition-colors shadow-lg shadow-indigo-650/15">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">AutoVault</span>
              <span className="block text-[9px] text-indigo-400 font-bold tracking-widest uppercase">Fleet Console</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-wider text-slate-400">
            <button onClick={() => scrollToSection('platform')} className="hover:text-white transition-colors">Platform</button>
            <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => scrollToSection('showcase')} className="hover:text-white transition-colors">Showcase</button>
            <button onClick={() => scrollToSection('experience')} className="hover:text-white transition-colors">Experience</button>
          </nav>

          {/* Auth CTA Actions */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white px-4 py-2.5 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="text-xs font-bold uppercase tracking-wider text-white bg-indigo-650 hover:bg-indigo-755 px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-655/10"
            >
              Get Started
            </Link>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[55%] h-[55%] rounded-full bg-indigo-650/10 blur-[150px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[45%] h-[45%] rounded-full bg-indigo-900/10 blur-[150px] pointer-events-none -z-10"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-[0.25] -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-5 space-y-6 text-left relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-extrabold tracking-widest text-indigo-400 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
              Automotive Inventory, Reimagined
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
              Command your inventory.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-200">Drive your business.</span>
            </h1>

            <p className="text-slate-400 text-base leading-relaxed font-semibold">
              A modern, high-precision dealership operations platform built to manage fleets, track unit telemetry, and streamline transactions from one clean, intelligent cockpit.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => scrollToSection('showcase')}
                className="flex items-center gap-2 bg-indigo-650 hover:bg-indigo-755 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-indigo-650/20 group"
              >
                <span>Explore Inventory</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <Link
                to="/login"
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all"
              >
                <span>Access Dashboard</span>
              </Link>
            </div>

            {/* System Status telemetry badge */}
            <div className="pt-8 border-t border-slate-900 grid grid-cols-3 gap-4 text-left font-mono">
              <div>
                <span className="block text-2xl font-black text-white tracking-tight">100%</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold font-sans">Role-Based Access</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-white tracking-tight">REALTIME</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold font-sans">Unit Visibility</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-white tracking-tight">SECURED</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold font-sans">Checkout Logs</span>
              </div>
            </div>

          </div>

          {/* Hero Right Cinematic Image */}
          <div className="lg:col-span-7 relative flex justify-center items-center">
            {/* Ambient backing light */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent blur-[80px] pointer-events-none rounded-full"></div>
            
            <div className="relative w-full max-w-2xl aspect-[16/10] bg-slate-900/50 rounded-2xl border border-slate-800/80 p-2.5 overflow-hidden shadow-2xl group">
              <div className="w-full h-full rounded-xl overflow-hidden relative">
                <img 
                  src={getCarImage('mercedes', 'amg')} 
                  alt="Cinematic sports car hero"
                  className="w-full h-full object-cover object-center scale-[1.01] group-hover:scale-[1.03] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                
                {/* Float specs card overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 border border-slate-800/60 backdrop-blur-md p-4 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block font-sans">Featured Model</span>
                    <span className="text-sm font-black text-white font-mono">MERCEDES-AMG GT COUPE</span>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    Secured stock
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 inset-x-0 flex justify-center">
          <button 
            onClick={() => scrollToSection('platform')}
            className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-white transition-colors group cursor-pointer"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Discover Platform</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>

      </section>

      {/* Product Value Section */}
      <section id="platform" className="py-24 bg-[#fafafa] text-slate-800 relative z-10 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl space-y-4 mb-16">
            <span className="text-xs font-extrabold tracking-widest text-indigo-650 uppercase">Complete Inventory Control</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              One central console. Complete operational oversight.
            </h2>
            <p className="text-slate-500 text-base leading-relaxed font-semibold">
              Remove the guesswork from managing your car dealership catalog. AutoVault connects stock volumes, price matrices, sales auditing, and team roles under one high-performance interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Capability 01 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-6 shadow-sm hover:border-slate-300 transition-colors">
              <span className="text-4xl font-black text-slate-200 block font-mono">01</span>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-600" />
                  <span>Inventory Intelligence</span>
                </h3>
                <p className="text-sm text-slate-550 leading-relaxed font-semibold">
                  Monitor overall stock levels, valuation totals, alerts for low units, and custom vehicle specs in real time.
                </p>
              </div>
            </div>

            {/* Capability 02 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-6 shadow-sm hover:border-slate-300 transition-colors">
              <span className="text-4xl font-black text-slate-200 block font-mono">02</span>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-600" />
                  <span>Seamless Operations</span>
                </h3>
                <p className="text-sm text-slate-550 leading-relaxed font-semibold">
                  Add new models to the fleet catalog, update pricing details, process customer checkouts, and restock units in single clicks.
                </p>
              </div>
            </div>

            {/* Capability 03 */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-6 shadow-sm hover:border-slate-300 transition-colors">
              <span className="text-4xl font-black text-slate-200 block font-mono">03</span>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  <span>Controlled Access</span>
                </h3>
                <p className="text-sm text-slate-550 leading-relaxed font-semibold">
                  Enforce operational boundaries. Administrators manage unit values and restocks; standard users query details and complete transactions.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Automotive Showcase Section */}
      <section id="showcase" className="py-24 bg-[#090d16] text-white relative z-10 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-extrabold tracking-widest text-indigo-400 uppercase">Live Showroom Experience</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Where luxury engineering meets digital precision.
            </h2>
            <p className="text-slate-400 text-sm font-semibold">
              Browse some of the premium vehicle segments managed using our platform. Click below to register and access our active database.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            
            {/* Showcase 1: Dominant Mercedes GT Image (7 columns) */}
            <div className="md:col-span-7 relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-lg group aspect-[16/10]">
              <img 
                src={getCarImage('porsche', '911')} 
                alt="Porsche Coupe Spec"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-5 left-5 space-y-1">
                <span className="bg-slate-900/90 text-white text-[9px] font-bold px-2 py-0.5 rounded border border-slate-800 uppercase tracking-widest">SPORT COUPE</span>
                <h4 className="text-base font-black text-white font-mono">PORSCHE 911 COUPE</h4>
              </div>
            </div>

            {/* Showcase 2: Tesla Model Y Image (5 columns) */}
            <div className="md:col-span-5 relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-lg group aspect-[16/10] md:aspect-auto">
              <img 
                src={getCarImage('tesla', 'model y')} 
                alt="Tesla SUV Spec"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-5 left-5 space-y-1">
                <span className="bg-slate-900/90 text-white text-[9px] font-bold px-2 py-0.5 rounded border border-slate-800 uppercase tracking-widest">ELECTRIC SUV</span>
                <h4 className="text-base font-black text-white font-mono">TESLA MODEL Y</h4>
              </div>
            </div>

            {/* Showcase 3: Honda Civic Image (5 columns) */}
            <div className="md:col-span-5 relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-lg group aspect-[16/10] md:aspect-auto">
              <img 
                src={getCarImage('honda', 'civic')} 
                alt="Honda Sedan Spec"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-5 left-5 space-y-1">
                <span className="bg-slate-900/90 text-white text-[9px] font-bold px-2 py-0.5 rounded border border-slate-800 uppercase tracking-widest">SEDAN</span>
                <h4 className="text-base font-black text-white font-mono">HONDA CIVIC SPORT</h4>
              </div>
            </div>

            {/* Showcase 4: Toyota Corolla (7 columns) */}
            <div className="md:col-span-7 relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-lg group aspect-[16/10]">
              <img 
                src={getCarImage('toyota', 'corolla')} 
                alt="Toyota Sedan Spec"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-5 left-5 space-y-1">
                <span className="bg-slate-900/90 text-white text-[9px] font-bold px-2 py-0.5 rounded border border-slate-800 uppercase tracking-widest">FAMILY SEDAN</span>
                <h4 className="text-base font-black text-white font-mono">TOYOTA COROLLA</h4>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Product Experience Section */}
      <section id="experience" className="py-24 bg-[#fafafa] text-slate-800 relative z-10 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-extrabold tracking-widest text-indigo-650 uppercase">Operational Cockpit</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Everything your inventory needs. Nothing it doesn't.
            </h2>
            <p className="text-slate-500 text-sm font-semibold">
              AutoVault maps system logs, checkouts, and stock operations to keep fleet inventory valuation synchronized.
            </p>
          </div>

          {/* Browser Interface Mockup container showing the ACTUAL dashboard design */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-3 shadow-2xl overflow-hidden font-sans max-w-5xl mx-auto">
            
            {/* Header controls bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 px-3">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/50"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500/50"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500/50"></span>
              </div>
              <div className="bg-slate-950/70 border border-slate-900 text-slate-400 text-[10px] font-bold py-1 px-8 rounded-lg tracking-wide select-none">
                autovault.com/console/overview
              </div>
              <div className="w-6"></div>
            </div>

            {/* Replica of the Real Light Dashboard Panel */}
            <div className="bg-[#f8fafc] p-6 space-y-6 text-slate-800 rounded-b-xl border-t border-slate-950/20">
              
              {/* Actual KPI stats grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Total Inventory */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-1.5 text-left">
                  <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Total Inventory</span>
                  <span className="text-3xl font-black text-slate-800 tracking-tight font-mono">38</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-indigo-650 font-bold bg-indigo-50 border border-indigo-100/60 rounded-md px-2 py-0.5 w-fit">
                    <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>
                    <span>Showroom units</span>
                  </div>
                </div>

                {/* Asset Valuation */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-1.5 text-left">
                  <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Asset Valuation</span>
                  <span className="text-3xl font-black text-slate-800 tracking-tight font-mono">$6,595,000</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-650 font-bold bg-emerald-50 border border-emerald-100/60 rounded-md px-2 py-0.5 w-fit">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                    <span>FOB value</span>
                  </div>
                </div>

                {/* Gross Purchases */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-1.5 text-left">
                  <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Gross Purchases</span>
                  <span className="text-3xl font-black text-slate-800 tracking-tight font-mono">5</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-655 font-bold bg-slate-100 border border-slate-200/60 rounded-md px-2 py-0.5 w-fit">
                    <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                    <span>Completed checkouts</span>
                  </div>
                </div>

                {/* Stock Alerts */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-1.5 text-left">
                  <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Stock Alerts</span>
                  <span className="text-3xl font-black text-slate-800 tracking-tight font-mono">1</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-amber-650 font-bold bg-amber-50 border border-amber-100/60 rounded-md px-2 py-0.5 w-fit">
                    <span className="w-1 h-1 bg-amber-500 rounded-full animate-pulse"></span>
                    <span>Attention required</span>
                  </div>
                </div>

              </div>

              {/* Lower Section columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
                
                {/* Quick Actions grid (8 columns) */}
                <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Quick Actions Cockpit
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Add Vehicle */}
                    <div className="p-4 bg-indigo-50/20 border border-indigo-100/50 rounded-xl flex items-start justify-between group cursor-default">
                      <div className="space-y-1">
                        <span className="flex items-center justify-center w-7 h-7 bg-indigo-600 rounded-lg text-white font-bold">
                          +
                        </span>
                        <h5 className="text-xs font-bold text-slate-800 pt-2">Add New Vehicle</h5>
                        <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Create a showroom card specifications sheet.</p>
                      </div>
                    </div>
                    {/* Manage Inventory */}
                    <div className="p-4 bg-slate-50/50 border border-slate-200/60 rounded-xl flex items-start justify-between group cursor-default">
                      <div className="space-y-1">
                        <span className="flex items-center justify-center w-7 h-7 bg-slate-100 border border-slate-200 rounded-lg text-slate-655 font-bold">
                          <Layers className="w-4 h-4 text-slate-600" />
                        </span>
                        <h5 className="text-xs font-bold text-slate-800 pt-2">Manage Inventory</h5>
                        <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Configure models, filters, and edit stock values.</p>
                      </div>
                    </div>
                    {/* View Purchases */}
                    <div className="p-4 bg-slate-50/50 border border-slate-200/60 rounded-xl flex items-start justify-between group cursor-default">
                      <div className="space-y-1">
                        <span className="flex items-center justify-center w-7 h-7 bg-slate-100 border border-slate-200 rounded-lg text-slate-655 font-bold">
                          <CreditCard className="w-4 h-4 text-slate-600" />
                        </span>
                        <h5 className="text-xs font-bold text-slate-800 pt-2">View All Purchases</h5>
                        <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Review customer order lists and audit receipts.</p>
                      </div>
                    </div>
                    {/* View Activity */}
                    <div className="p-4 bg-slate-50/50 border border-slate-200/60 rounded-xl flex items-start justify-between group cursor-default">
                      <div className="space-y-1">
                        <span className="flex items-center justify-center w-7 h-7 bg-slate-100 border border-slate-200 rounded-lg text-slate-655 font-bold">
                          <History className="w-4 h-4 text-slate-600" />
                        </span>
                        <h5 className="text-xs font-bold text-slate-800 pt-2">View Activity Log</h5>
                        <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Verify system sync signals and restock tracking.</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Health & Queue panel (4 columns) */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Showroom Health */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-800">Showroom Health</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">Physical inventory volume distribution ratios.</p>
                    </div>

                    {/* Progress Ratio Bar */}
                    <div className="h-2.5 rounded-full bg-slate-100 flex overflow-hidden">
                      <div className="w-[75%] bg-emerald-500"></div>
                      <div className="w-[25%] bg-amber-500"></div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 font-mono">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        <span>Healthy (3)</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        <span>Low (1)</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        <span>Out (0)</span>
                      </span>
                    </div>
                  </div>

                  {/* Restock Logistics Queue */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Restock Logistics Queue
                    </h4>
                    
                    <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-800 block">BMW M4</span>
                        <span className="inline-block bg-amber-500/10 text-amber-600 border border-amber-200 text-[9px] font-bold px-1.5 rounded uppercase font-mono">
                          QTY: 1
                        </span>
                      </div>
                      <button className="px-2.5 py-1 bg-white border border-slate-200 text-[10px] font-bold text-indigo-650 rounded-md shadow-xs select-none">
                        Restock
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Feature Story Sections */}
      <section id="features" className="py-24 bg-[#090d16] text-white relative z-10 space-y-24 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          
          {/* Feature 1: Know every vehicle */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-extrabold tracking-widest text-indigo-400 uppercase">01 — Full Visibility</span>
              <h3 className="text-3xl font-black text-white tracking-tight leading-tight">
                Know every vehicle.
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed font-semibold">
                Access structured profiles detailing make, model, type, and unit counts. Filter through pricing models instantly to keep stock operations organized.
              </p>
              <div className="pt-4">
                <Link to="/register" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-350 hover:underline tracking-wider uppercase">
                  <span>Start tracking fleet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            
            {/* Visual element */}
            <div className="lg:col-span-7 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800/80 p-3 shadow-lg">
              <div className="aspect-[16/9] rounded-xl overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=800&q=80" 
                  alt="Full vehicle profiles visualization" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/40"></div>
              </div>
            </div>
          </div>

          {/* Feature 2: Move inventory with confidence */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual element */}
            <div className="lg:col-span-7 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800/80 p-3 shadow-lg order-last lg:order-first">
              <div className="aspect-[16/9] rounded-xl overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80" 
                  alt="Secure checkout logs visualization" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/40"></div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-extrabold tracking-widest text-indigo-400 uppercase">02 — Audited Transactions</span>
              <h3 className="text-3xl font-black text-white tracking-tight leading-tight">
                Move inventory with confidence.
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed font-semibold">
                Prevent stock conflicts. Our checkout protection verifies vehicle quantities in real time and compiles clear transaction histories upon order execution.
              </p>
              <div className="pt-4">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-350 hover:underline tracking-wider uppercase">
                  <span>Sign in to purchase</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Feature 3: Operational Control */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-extrabold tracking-widest text-indigo-400 uppercase">03 — Administrative Controls</span>
              <h3 className="text-3xl font-black text-white tracking-tight leading-tight">
                Built for operational control.
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed font-semibold">
                Manage catalogs, execute restocking orders, and audit user logs dynamically. Enforce safe administrative boundaries across the team.
              </p>
              <div className="pt-4">
                <Link to="/register" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-350 hover:underline tracking-wider uppercase">
                  <span>Create admin account</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Visual element */}
            <div className="lg:col-span-7 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800/80 p-3 shadow-lg">
              <div className="aspect-[16/9] rounded-xl overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=800&q=80" 
                  alt="Admin system console visualization" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/40"></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="relative py-28 flex items-center justify-center overflow-hidden border-t border-slate-900">
        
        {/* Background Image with dark overlays */}
        <div className="absolute inset-0 -z-10 bg-slate-950">
          <img 
            src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=80" 
            alt="Premium car headlights in dark ambient lighting"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <span className="text-xs font-extrabold tracking-widest text-indigo-400 uppercase">Operational Cockpit Access</span>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Your inventory deserves<br />a better command center.
          </h2>
          <p className="text-slate-350 text-base leading-relaxed max-w-xl mx-auto font-semibold">
            Bring clarity, control, and precision to every vehicle in your dealership's fleet catalog.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link 
              to="/register" 
              className="bg-indigo-650 hover:bg-indigo-755 text-white font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-xl transition-all shadow-lg shadow-indigo-655/15"
            >
              Get Started Now
            </Link>
            <Link 
              to="/login" 
              className="bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-xl transition-all backdrop-blur-md"
            >
              Access Dashboard
            </Link>
          </div>
        </div>

      </section>

      {/* Premium Minimalist Footer */}
      <footer className="bg-slate-950 text-slate-500 py-12 border-t border-slate-900/60 text-xs font-semibold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Logo brand and copy */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-slate-900 border border-slate-850 rounded-lg group-hover:border-slate-750 transition-colors">
                <Car className="w-4.5 h-4.5 text-indigo-400" />
              </div>
              <span className="text-sm font-extrabold text-white">AutoVault</span>
            </Link>
            <p className="text-slate-550 leading-relaxed max-w-sm">
              A high-precision, role-based dealership management platform built to control fleet stock, monitor valuation, and audit purchases.
            </p>
          </div>

          {/* Navigation links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform</h5>
            <ul className="space-y-2 text-[11px] font-bold uppercase tracking-wider text-slate-550">
              <li><button onClick={() => scrollToSection('platform')} className="hover:text-slate-300">Overview</button></li>
              <li><button onClick={() => scrollToSection('features')} className="hover:text-slate-300">Capabilities</button></li>
              <li><button onClick={() => scrollToSection('experience')} className="hover:text-slate-300">Console Experience</button></li>
            </ul>
          </div>

          {/* Account actions (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Access Suite</h5>
            <ul className="space-y-2 text-[11px] font-bold uppercase tracking-wider text-slate-550">
              <li><Link to="/login" className="hover:text-slate-300">Sign In to Cockpit</Link></li>
              <li><Link to="/register" className="hover:text-slate-300">Create New Space</Link></li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900/50 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] tracking-wide text-slate-550">
          <p>&copy; {new Date().getFullYear()} AutoVault. Engineered for Operational Control and Performance.</p>
          <div className="flex space-x-4">
            <span className="hover:text-slate-300 select-none cursor-default">Privacy Protocol</span>
            <span className="hover:text-slate-300 select-none cursor-default">Terms of Routing</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, Car, Shield, User as UserIcon, Menu, X, 
  LayoutDashboard, Layers, CreditCard, History 
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  // Unauthenticated layout (Login / Register / Public Landing)
  if (!user) {
    if (location.pathname === '/') {
      return <>{children}</>;
    }
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col relative overflow-hidden font-sans">
        {/* Ambient background glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.4] pointer-events-none"></div>
        
        <main className="flex-grow flex items-center justify-center p-4 relative z-10">
          {children}
        </main>
      </div>
    );
  }

  // Authenticated layout - Premium Sidebar Dashboard Shell (Dark Sidebar + Light Slate Main panel)
  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex font-sans">
      
      {/* Desktop Sidebar (Persistent on md screen sizes and up) */}
      <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0 left-0 bg-[#0f172a] text-slate-300 border-r border-slate-800 z-40 transition-all duration-300">
        
        {/* Brand Section */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-indigo-600 rounded-lg group-hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-650/15">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white">AutoVault</span>
              <span className="block text-xs text-indigo-400 font-semibold tracking-wide uppercase">Fleet Console</span>
            </div>
          </Link>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-grow px-4 py-6 space-y-1.5">
          {/* Admin Sidebar vs User Sidebar */}
          {user.role === 'ADMIN' ? (
            <>
              {/* ADMIN VIEW */}
              <Link
                to="/"
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all border ${
                  isActive('/')
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <LayoutDashboard className="w-4.5 h-4.5 shrink-0" />
                <span>Overview</span>
              </Link>
              
              <Link
                to="/inventory"
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all border ${
                  isActive('/inventory')
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <Layers className="w-4.5 h-4.5 shrink-0" />
                <span>Inventory</span>
              </Link>

              <Link
                to="/purchases"
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all border ${
                  isActive('/purchases')
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-4.5 h-4.5 shrink-0" />
                <span>Purchases</span>
              </Link>

              <Link
                to="/activity"
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all border ${
                  isActive('/activity')
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <History className="w-4.5 h-4.5 shrink-0" />
                <span>Activity</span>
              </Link>
            </>
          ) : (
            <>
              {/* STANDARD USER VIEW */}
              <Link
                to="/"
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all border ${
                  isActive('/')
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <Car className="w-4.5 h-4.5 shrink-0" />
                <span>Vehicles Catalog</span>
              </Link>

              <Link
                to="/purchases"
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all border ${
                  isActive('/purchases')
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-4.5 h-4.5 shrink-0" />
                <span>My Orders</span>
              </Link>

              <Link
                to="/activity"
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all border ${
                  isActive('/activity')
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <History className="w-4.5 h-4.5 shrink-0" />
                <span>My Activity</span>
              </Link>
            </>
          )}
        </nav>

        {/* User Info & Logout Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#020617]/55">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-indigo-400 shrink-0">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-grow">
              <p className="text-sm font-bold text-slate-100 truncate">{user.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {user.role === 'ADMIN' ? (
                  <span className="inline-flex items-center gap-0.5 bg-indigo-500/20 text-indigo-350 text-[9px] font-bold px-2 py-0.5 rounded border border-indigo-500/30 uppercase tracking-wide">
                    <Shield className="w-2.5 h-2.5" />
                    <span>Admin</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-450 font-semibold uppercase tracking-wide">Operator</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-sm font-semibold py-2.5 rounded-lg border border-slate-800 transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar (Collapsible slide-in menu) */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[#0f172a] text-slate-300 border-r border-slate-800 z-50 transform md:hidden transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <Link to="/" className="flex items-center space-x-3 group" onClick={() => setMobileMenuOpen(false)}>
            <div className="p-2 bg-indigo-600 rounded-lg shadow-md shadow-indigo-650/15">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white">AutoVault</span>
              <span className="block text-[10px] text-indigo-400 font-semibold tracking-wide uppercase">Fleet Console</span>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-850 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-grow px-4 py-6 space-y-1.5">
          {user.role === 'ADMIN' ? (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all border ${
                  isActive('/')
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <LayoutDashboard className="w-4.5 h-4.5 shrink-0" />
                <span>Overview</span>
              </Link>
              
              <Link
                to="/inventory"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all border ${
                  isActive('/inventory')
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <Layers className="w-4.5 h-4.5 shrink-0" />
                <span>Inventory</span>
              </Link>

              <Link
                to="/purchases"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all border ${
                  isActive('/purchases')
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-4.5 h-4.5 shrink-0" />
                <span>Purchases</span>
              </Link>

              <Link
                to="/activity"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all border ${
                  isActive('/activity')
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <History className="w-4.5 h-4.5 shrink-0" />
                <span>Activity</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all border ${
                  isActive('/')
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <Car className="w-4.5 h-4.5 shrink-0" />
                <span>Vehicles Catalog</span>
              </Link>

              <Link
                to="/purchases"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all border ${
                  isActive('/purchases')
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-4.5 h-4.5 shrink-0" />
                <span>My Orders</span>
              </Link>

              <Link
                to="/activity"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all border ${
                  isActive('/activity')
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <History className="w-4.5 h-4.5 shrink-0" />
                <span>My Activity</span>
              </Link>
            </>
          )}
        </nav>

        <div className="absolute bottom-0 inset-x-0 p-4 border-t border-slate-800 bg-[#020617]/55">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 text-indigo-400 shrink-0">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-grow">
              <p className="text-sm font-bold text-slate-100 truncate">{user.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {user.role === 'ADMIN' ? (
                  <span className="inline-flex items-center gap-0.5 bg-indigo-500/20 text-indigo-350 text-xs font-bold px-2 py-0.5 rounded border border-indigo-500/30 uppercase tracking-wide">
                    <Shield className="w-2.5 h-2.5" />
                    <span>Admin</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-455 font-semibold uppercase tracking-wide">Operator</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-sm font-semibold py-2.5 rounded-lg border border-slate-800 transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Screen Content Wrapper */}
      <div className="flex flex-col flex-grow min-h-screen md:pl-64">
        
        {/* Main Header (Sticky top navigation bar - Clean White/Light with gray border) */}
        <header className="h-16 border-b border-slate-200 bg-white/85 backdrop-blur-md sticky top-0 z-35 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Header Left (Mobile menu toggle + Page Indicator) */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors md:hidden"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
            <div className="hidden md:block">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-550">
                {location.pathname === '/' ? 'Inventory Operations' : location.pathname === '/admin' ? 'Administrative Suite' : 'Vehicle Information'}
              </span>
            </div>
          </div>

          {/* Header Right (User indicators) */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-655 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-505 animate-pulse"></span>
              <span className="hidden sm:inline font-medium">Session Connected:</span>
              <span className="font-bold text-slate-800">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Children Page Content */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto relative z-10">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <p className="tracking-wide">&copy; {new Date().getFullYear()} AutoVault. Engineered for Operational Excellence.</p>
        </footer>
      </div>
    </div>
  );
};

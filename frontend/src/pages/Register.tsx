import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schemas';
import type { RegisterInput } from '../schemas';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Car, Lock, Mail, User as UserIcon, Shield, Loader2, ArrowLeft, Cpu, ShieldCheck, Activity, Eye, EyeOff } from 'lucide-react';

export const Register: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'USER',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setSubmitting(true);
    try {
      await registerUser(data);
      toast.success('Successfully registered account!');
      navigate('/');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl min-h-[70vh] grid grid-cols-1 lg:grid-cols-12 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xl relative">
      
      {/* Left Column - Showcase Panel (Vibrant Dark Telemetry Panel) */}
      <div className="hidden lg:flex lg:col-span-5 bg-[#0f172a] text-slate-100 p-8 flex-col justify-between border-r border-slate-800 relative overflow-hidden">
        {/* Subtle grid lines background overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-[0.15] pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none"></div>

        {/* Top Section: Brand Info */}
        <div className="relative z-10 space-y-3.5">
          <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-800 text-slate-300 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>System Uptime 99.98%</span>
          </div>
          <h3 className="text-xl font-bold text-slate-550 tracking-tight leading-tight">
            Inventory & Fleet <br />
            <span className="text-cyan-400">Control Hub</span>
          </h3>
        </div>

        {/* Generated Supercar Showcase Image */}
        <div className="relative my-4 z-10 w-full h-36 rounded-xl border border-slate-800/60 overflow-hidden shadow-lg group">
          <img 
            src="/login_showcase_supercar.png" 
            alt="Futuristic Supercar Showcase" 
            className="w-full h-full object-cover object-center scale-[1.01] group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
          <span className="absolute bottom-2.5 left-3 bg-slate-950/85 text-[8px] font-bold text-cyan-400 uppercase tracking-widest px-2 py-0.5 rounded border border-slate-800">
            Concept telemetry active
          </span>
        </div>

        {/* System Indicators Card */}
        <div className="relative z-10 bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">System Indicators</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
              <span className="text-[8px] font-bold text-emerald-400 uppercase font-mono">Live</span>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2 bg-slate-900/30 rounded-lg border border-slate-800">
              <span className="text-[8px] uppercase font-bold text-slate-455 tracking-wide">Catalog Val.</span>
              <h5 className="text-xs font-bold text-slate-200 mt-0.5">$45.2M</h5>
            </div>
            <div className="p-2 bg-slate-900/30 rounded-lg border border-slate-800">
              <span className="text-[8px] uppercase font-bold text-slate-455 tracking-wide">Active Units</span>
              <h5 className="text-xs font-bold text-slate-200 mt-0.5">1,420</h5>
            </div>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-[9px] text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Engineered on Prisma & PostgreSQL</span>
            </div>
            <div className="flex items-center gap-2 text-[9px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Centralized JWT Authorization</span>
            </div>
          </div>
        </div>

        {/* Bottom Section: Footer Info */}
        <div className="relative z-10 text-[8px] text-slate-550 font-bold uppercase tracking-wider">
          AutoVault &copy; {new Date().getFullYear()}
        </div>
      </div>

      {/* Right Column - Authentication Form Area (Crisp White Canvas) */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-8 sm:p-12 bg-white relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-cyan-500/5 blur-[80px] pointer-events-none"></div>

        <div className="max-w-sm w-full space-y-6 relative z-10">
          
          {/* Header */}
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-md shadow-cyan-500/20 text-white">
                <Car className="w-6 h-6" />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight leading-tight">Create Account</h2>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Already have an account? 
              <Link to="/login" className="ml-1 font-bold text-cyan-600 hover:text-cyan-700 transition-colors inline-flex items-center gap-0.5 hover:underline">
                <ArrowLeft className="w-3.5 h-3.5 text-cyan-600" />
                <span>Sign in here</span>
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                Full Name
              </label>
              <div className="relative rounded-xl shadow-xs">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <UserIcon className="w-4 h-4" />
                </span>
                <input
                  id="name"
                  type="text"
                  className={`block w-full pl-10 pr-3 py-2.5 bg-white border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-600 transition-all font-medium ${
                    errors.name
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-slate-200/80 focus:border-cyan-600'
                  }`}
                  placeholder="John Doe"
                  {...register('name')}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.name.message}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-xs">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  className={`block w-full pl-10 pr-3 py-2.5 bg-white border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-600 transition-all font-medium ${
                    errors.email
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-slate-200/80 focus:border-cyan-600'
                  }`}
                  placeholder="name@example.com"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                Password
              </label>
              <div className="relative rounded-xl shadow-xs">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`block w-full pl-10 pr-10 py-2.5 bg-white border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-600 transition-all font-medium ${
                    errors.password
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-slate-200/80 focus:border-cyan-600'
                  }`}
                  placeholder="••••••••"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-655 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.password.message}</p>}
            </div>

            {/* Account Role */}
            <div>
              <label htmlFor="role" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                Account Role
              </label>
              <div className="relative rounded-xl shadow-xs">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Shield className="w-4 h-4" />
                </span>
                <select
                  id="role"
                  aria-label="Account Role"
                  className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200/80 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-600 transition-all font-medium"
                  {...register('role')}
                >
                  <option value="USER">User (Standard Access)</option>
                  <option value="ADMIN">Admin (Inventory Manager)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center py-2.5 px-4 text-sm font-bold rounded-xl text-white bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-600/10 hover:shadow-cyan-650/25 transition-all duration-200 active:scale-[0.98]"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

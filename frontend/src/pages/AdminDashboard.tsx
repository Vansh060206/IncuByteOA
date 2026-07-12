import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useVehicles, useRestockVehicle } from '../hooks/useVehicles';
import { getPurchaseHistory, getActivityLogs, addActivityLog } from '../utils/store';
import toast from 'react-hot-toast';
import { 
  Car, Layers, CreditCard, History, Plus, 
  ArrowRight, Database, Activity, RefreshCw,
  TrendingUp, AlertCircle, ShoppingBag, Clock, Loader2, ArrowUpRight
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useVehicles();
  const restockMutation = useRestockVehicle();

  // Local restock inline inputs
  const [restockingId, setRestockingId] = useState<string | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(5);

  const vehicles = data?.vehicles || [];
  const purchases = getPurchaseHistory();
  const logs = getActivityLogs();

  // 1. KPI Calculations (Real Data only)
  const totalInventory = vehicles.reduce((sum, v) => sum + v.quantity, 0);
  const totalInventoryValue = vehicles.reduce((sum, v) => sum + (Number(v.price) * v.quantity), 0);
  const totalPurchasesCount = purchases.reduce((sum, p) => sum + p.quantity, 0);
  const stockAlertsCount = vehicles.filter(v => v.quantity <= 3).length;

  // 2. Inventory Distribution Calculations
  const totalModels = vehicles.length || 1;
  const healthyCount = vehicles.filter(v => v.quantity > 3).length;
  const lowCount = vehicles.filter(v => v.quantity > 0 && v.quantity <= 3).length;
  const outCount = vehicles.filter(v => v.quantity === 0).length;

  const healthyPct = Math.round((healthyCount / totalModels) * 100);
  const lowPct = Math.round((lowCount / totalModels) * 105) > 100 ? 100 - healthyPct : Math.round((lowCount / totalModels) * 100);
  const outPct = 100 - healthyPct - lowPct;

  const attentionRequired = vehicles.filter(v => v.quantity <= 3);

  const handleRestock = async (id: string, make: string, model: string) => {
    if (restockAmount <= 0) {
      toast.error('Restock quantity must be positive');
      return;
    }
    try {
      await restockMutation.mutateAsync({ id, quantity: restockAmount });
      toast.success(`Restocked ${make} ${model} with ${restockAmount} units`);
      addActivityLog(`Admin restocked ${restockAmount} units of ${make} ${model}.`, 'restock');
      setRestockingId(null);
      setRestockAmount(5);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Restock failed');
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'system': return <Database className="w-3.5 h-3.5 text-indigo-500" />;
      case 'purchase': return <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />;
      case 'restock': return <RefreshCw className="w-3.5 h-3.5 text-amber-500" />;
      default: return <Activity className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-xl shadow-sm">
        <Loader2 className="w-8 h-8 text-indigo-650 animate-spin" />
        <div className="sr-only">Fetching fleet status...</div>
        <p className="mt-3 text-sm text-slate-500 font-semibold">Loading command cockpit...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Welcome Operational Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Operations Dashboard</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            System status operational. Showroom fleet features {vehicles.length} models across {totalInventory} total units.
          </p>
        </div>
        <button
          onClick={() => navigate('/inventory?action=add')}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-755 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-indigo-600/10 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* KPI Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Inventory */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform"></div>
          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Inventory</span>
          <p className="text-3xl font-black text-slate-850 mt-1">{totalInventory}</p>
          <div className="mt-2.5 flex items-center gap-1 text-sm text-indigo-650 font-bold">
            <Car className="w-3.5 h-3.5" />
            <span>Showroom units</span>
          </div>
          {/* Subtle Sparkline vector */}
          <svg className="absolute bottom-3 right-3 w-20 h-8 text-indigo-500/20" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M0,25 Q15,22 30,18 T60,12 T90,8 T100,4" />
          </svg>
        </div>

        {/* Valuation */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform"></div>
          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Asset Valuation</span>
          <p className="text-3xl font-black text-indigo-650 font-mono mt-1">${totalInventoryValue.toLocaleString()}</p>
          <div className="mt-2.5 flex items-center gap-1 text-sm text-emerald-600 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>FOB value</span>
          </div>
          {/* Subtle Sparkline vector */}
          <svg className="absolute bottom-3 right-3 w-20 h-8 text-emerald-500/25" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M0,28 C20,24 40,14 60,12 C80,10 90,6 100,4" />
          </svg>
        </div>

        {/* Purchases */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform"></div>
          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Gross Purchases</span>
          <p className="text-3xl font-black text-slate-855 mt-1">{totalPurchasesCount}</p>
          <div className="mt-2.5 flex items-center gap-1 text-sm text-violet-650 font-bold">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Completed checkouts</span>
          </div>
          {/* Subtle Sparkline vector */}
          <svg className="absolute bottom-3 right-3 w-20 h-8 text-violet-500/25" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M0,18 C15,22 30,12 45,15 C60,18 75,6 90,8 C95,9 100,4" />
          </svg>
        </div>

        {/* Stock Alerts */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform"></div>
          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Stock Alerts</span>
          <p className="text-3xl font-black text-amber-600 mt-1">{stockAlertsCount}</p>
          <div className="mt-2.5 flex items-center gap-1 text-sm text-amber-600 font-bold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Attention required</span>
          </div>
          {/* Subtle Sparkline vector */}
          <svg className="absolute bottom-3 right-3 w-20 h-8 text-amber-500/20" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M0,15 L20,15 L40,8 L60,8 L80,18 L100,18" />
          </svg>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Quick Actions (2x2) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Actions Cockpit</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <Link 
                to="/inventory?action=add"
                className="p-4 bg-indigo-50/10 border border-indigo-100 hover:border-indigo-500/40 rounded-xl transition-all duration-300 group flex items-start justify-between"
              >
                <div className="space-y-1.5">
                  <div className="p-2 bg-indigo-600 rounded-lg text-white w-fit shadow-sm shadow-indigo-600/10">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-650 transition-colors">Add New Vehicle</h4>
                  <p className="text-xs text-slate-500 font-medium">Create a showroom card specifications sheet.</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-indigo-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Link>

              <Link 
                to="/inventory"
                className="p-4 bg-emerald-50/5 border border-slate-200 hover:border-emerald-500/40 rounded-xl transition-all duration-300 group flex items-start justify-between"
              >
                <div className="space-y-1.5">
                  <div className="p-2 bg-emerald-100 border border-emerald-250 text-emerald-700 rounded-lg w-fit">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-750 transition-colors">Manage Inventory</h4>
                  <p className="text-xs text-slate-500 font-medium">Configure models, filters, and edit stock values.</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Link>

              <Link 
                to="/purchases"
                className="p-4 bg-amber-50/5 border border-slate-200 hover:border-amber-500/40 rounded-xl transition-all duration-300 group flex items-start justify-between"
              >
                <div className="space-y-1.5">
                  <div className="p-2 bg-amber-100 border border-amber-250 text-amber-700 rounded-lg w-fit">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-amber-750 transition-colors">View All Purchases</h4>
                  <p className="text-xs text-slate-500 font-medium">Review customer order lists and audit receipts.</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-amber-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Link>

              <Link 
                to="/activity"
                className="p-4 bg-violet-50/5 border border-slate-200 hover:border-violet-500/40 rounded-xl transition-all duration-300 group flex items-start justify-between"
              >
                <div className="space-y-1.5">
                  <div className="p-2 bg-violet-100 border border-violet-250 text-violet-755 rounded-lg w-fit">
                    <History className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-violet-755 transition-colors">View Activity Log</h4>
                  <p className="text-xs text-slate-500 font-medium">Verify system sync signals and restock tracking.</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-violet-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Link>

            </div>
          </div>

          {/* Recent Purchases table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Transaction History</h2>
              <Link to="/purchases" className="text-xs text-indigo-650 font-bold hover:underline inline-flex items-center gap-0.5">
                <span>View all Purchases</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {purchases.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-200 rounded-lg">
                <p className="text-slate-500 text-sm">No transaction histories recorded yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-100">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50">
                      <th className="py-2.5 px-4">Vehicle Detail</th>
                      <th className="py-2.5 px-4 text-center">Qty</th>
                      <th className="py-2.5 px-4 text-right">Total Price</th>
                      <th className="py-2.5 px-4 text-right pr-4">Purchase Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {purchases.slice(0, 5).map((p) => {
                      const itemPrice = Number(p.vehicle?.price) || 0;
                      const initial = p.vehicle?.make ? p.vehicle.make.charAt(0).toUpperCase() : 'V';
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                          
                          {/* Circle emblem vehicle details */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white font-extrabold text-[9px] uppercase shadow-2xs">
                                {initial}
                              </span>
                              <div>
                                <span className="font-bold text-slate-800 block leading-tight">
                                  {p.vehicle?.make} {p.vehicle?.model}
                                </span>
                                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                                  {p.vehicle?.category || 'Fleet Unit'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Quantity */}
                          <td className="py-3.5 px-4 text-center font-bold text-slate-850">
                            {p.quantity}
                          </td>

                          {/* Total Price */}
                          <td className="py-3.5 px-4 text-right font-mono font-black text-indigo-650">
                            ${(itemPrice * p.quantity).toLocaleString()}
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 text-right text-xs text-slate-500 font-semibold font-mono pr-4">
                            {new Date(p.purchaseDate).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Inventory Health distribution */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
            <div>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Showroom Health</h2>
              <p className="text-xs text-slate-450 mt-0.5">Physical inventory volume distribution ratios.</p>
            </div>

            {/* Segmented Progress Distribution Indicator bar */}
            <div className="w-full bg-slate-100 rounded-full h-3.5 border border-slate-200 overflow-hidden flex shadow-2xs">
              <div 
                className="h-full bg-emerald-500 transition-all cursor-help"
                style={{ width: `${healthyPct}%` }}
                title={`Healthy: ${healthyPct}% (${healthyCount} models)`}
              />
              <div 
                className="h-full bg-amber-500 transition-all cursor-help"
                style={{ width: `${lowPct}%` }}
                title={`Low Stock: ${lowPct}% (${lowCount} models)`}
              />
              <div 
                className="h-full bg-rose-500 transition-all cursor-help"
                style={{ width: `${outPct}%` }}
                title={`Out of Stock: ${outPct}% (${outCount} models)`}
              />
            </div>

            {/* Legenda details */}
            <div className="grid grid-cols-3 gap-2.5 text-[10px] font-bold text-slate-550">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-emerald-500"></span>
                <span>Healthy ({healthyCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-amber-500"></span>
                <span>Low ({lowCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-rose-500"></span>
                <span>Out ({outCount})</span>
              </div>
            </div>

            {/* Attention Required List */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Restock Logistics Queue</span>
              {attentionRequired.length === 0 ? (
                <p className="text-xs text-slate-500">All models are adequately stocked.</p>
              ) : (
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {attentionRequired.slice(0, 5).map(v => {
                    const carInitial = v.make ? v.make.charAt(0).toUpperCase() : 'V';
                    return (
                      <div key={v.id} className="flex justify-between items-center bg-slate-50/50 border border-slate-200/60 rounded-xl p-2.5 text-xs">
                        
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-white font-extrabold text-[9px] uppercase shadow-2xs shrink-0 select-none">
                            {carInitial}
                          </span>
                          <div>
                            <p className="font-bold text-slate-800 leading-tight">{v.make} {v.model}</p>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border mt-0.5 ${
                              v.quantity === 0 ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                              Qty: {v.quantity}
                            </span>
                          </div>
                        </div>
                        
                        {restockingId === v.id ? (
                          <div className="flex items-center space-x-1 shrink-0">
                            <input
                              type="number"
                              aria-label="Restock quantity count"
                              value={restockAmount}
                              onChange={(e) => setRestockAmount(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-10 px-1 border border-slate-350 text-center rounded text-[10px] focus:outline-none"
                            />
                            <button
                              onClick={() => handleRestock(v.id, v.make, v.model)}
                              className="bg-indigo-600 hover:bg-indigo-755 text-white px-2 py-1 rounded-md text-[9px] font-extrabold uppercase"
                            >
                              Add
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setRestockingId(v.id);
                              setRestockAmount(5);
                            }}
                            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-355 hover:bg-slate-100 text-[10px] font-extrabold text-indigo-650 rounded-md transition-all shrink-0 uppercase tracking-wide"
                          >
                            Restock
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity Timeline feed */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Activity</h2>
              <Link to="/activity" className="text-xs text-indigo-650 font-bold hover:underline inline-flex items-center gap-0.5">
                <span>View ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {logs.length === 0 ? (
              <p className="text-slate-500 text-sm">No activity logs synced.</p>
            ) : (
              <div className="space-y-4 relative">
                
                {/* Connector Timeline Line */}
                <div className="absolute left-[13.5px] top-4 bottom-4 w-[2px] border-l-2 border-dashed border-slate-100 pointer-events-none"></div>

                {logs.slice(0, 5).map((log) => {
                  let logScope = 'SYSTEM LOG';
                  if (log.type === 'purchase') logScope = 'TRANSACTION';
                  else if (log.type === 'restock') logScope = 'SUPPLY LINE';
                  else if (log.type === 'create') logScope = 'CATALOG';

                  return (
                    <div key={log.id} className="relative flex gap-3.5 items-start group">
                      
                      {/* Timeline Dot Icon Indicator */}
                      <span className={`relative z-10 p-1.5 bg-white border border-slate-200 rounded-xl flex items-center justify-center shrink-0 shadow-2xs`}>
                        {getLogIcon(log.type)}
                      </span>

                      {/* Log details inline block */}
                      <div className="flex-grow bg-slate-50/40 border border-slate-100/60 rounded-xl p-3 text-left">
                        <div className="flex items-center justify-between text-[9px] font-extrabold text-slate-400 tracking-wider mb-1 uppercase">
                          <span>{logScope}</span>
                          <span className="font-mono text-slate-400 flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {new Date(log.time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-700 leading-snug">
                          {log.message}
                        </p>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

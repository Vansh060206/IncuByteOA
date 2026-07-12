import React, { useState } from 'react';
import { getActivityLogs } from '../utils/store';
import { 
  Search, Database, ShoppingCart, RefreshCw, 
  Plus, Edit2, Trash2, ShieldAlert, Cpu 
} from 'lucide-react';

export const ActivityPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const logs = getActivityLogs();

  // Filter logs based on search and selection type
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || log.type.toUpperCase() === typeFilter.toUpperCase();
    return matchesSearch && matchesType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'system':
        return <Database className="w-4.5 h-4.5 text-indigo-600" />;
      case 'purchase':
        return <ShoppingCart className="w-4.5 h-4.5 text-emerald-600" />;
      case 'restock':
        return <RefreshCw className="w-4.5 h-4.5 text-amber-600" />;
      case 'create':
        return <Plus className="w-4.5 h-4.5 text-sky-600" />;
      case 'update':
        return <Edit2 className="w-4.5 h-4.5 text-blue-600" />;
      case 'delete':
        return <Trash2 className="w-4.5 h-4.5 text-rose-600" />;
      default:
        return <Cpu className="w-4.5 h-4.5 text-slate-600" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'system':
        return 'bg-indigo-50 border-indigo-100';
      case 'purchase':
        return 'bg-emerald-50 border-emerald-100';
      case 'restock':
        return 'bg-amber-50 border-amber-100';
      case 'create':
        return 'bg-sky-50 border-sky-100';
      case 'update':
        return 'bg-blue-50 border-blue-100';
      case 'delete':
        return 'bg-rose-50 border-rose-100';
      default:
        return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Activity Log Ledger</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Audit trail tracking inventory restocks, brand creations, transaction history, and system status logs.
          </p>
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-grow rounded-xl shadow-xs">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search activity messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition-all font-semibold"
            />
          </div>

          {/* Type Filter dropdown */}
          <select
            aria-label="Filter by Event Type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition-all font-semibold"
          >
            <option value="ALL">All Event Types</option>
            <option value="SYSTEM">System Logs</option>
            <option value="PURCHASE">Purchases</option>
            <option value="RESTOCK">Restocks</option>
            <option value="CREATE">Creations</option>
            <option value="UPDATE">Edits / Updates</option>
            <option value="DELETE">Deletions</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-16">
            <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500 font-semibold">No operational logs match current search criteria.</p>
          </div>
        ) : (
          <div className="space-y-6 relative">
            
            {/* Dashed Connector Line */}
            <div className="absolute left-[19px] top-6 bottom-6 w-[2px] border-l-2 border-dashed border-slate-200 pointer-events-none"></div>

            {filteredLogs.map((log) => {
              // Determine category label based on log event type
              let scopeLabel = 'SYSTEM LOG';
              if (log.type === 'purchase') scopeLabel = 'FLEET TRANSACTION';
              else if (log.type === 'restock') scopeLabel = 'SUPPLY CHAIN LOGISTICS';
              else if (log.type === 'create') scopeLabel = 'INVENTORY CREATION';
              else if (log.type === 'update') scopeLabel = 'FLEET MODIFICATION';
              else if (log.type === 'delete') scopeLabel = 'CATALOG DELETION';

              // Dynamic badge style
              let badgeColor = 'bg-slate-50 text-slate-655 border-slate-200/60';
              if (log.type === 'purchase') badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-100/60';
              else if (log.type === 'restock') badgeColor = 'bg-amber-50 text-amber-700 border-amber-100/60';
              else if (log.type === 'create') badgeColor = 'bg-sky-50 text-sky-700 border-sky-100/60';
              else if (log.type === 'system') badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-100/60';
              else if (log.type === 'update') badgeColor = 'bg-blue-50 text-blue-700 border-blue-100/60';
              else if (log.type === 'delete') badgeColor = 'bg-rose-50 text-rose-700 border-rose-100/60';

              return (
                <div key={log.id} className="relative flex gap-5 items-start group">
                  
                  {/* Timeline Dot Icon Indicator */}
                  <span className={`relative z-10 p-2.5 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-indigo-500/10 ${getIconBg(log.type)}`}>
                    {getIcon(log.type)}
                  </span>

                  {/* Log Card wrapper */}
                  <div className="flex-grow bg-slate-50/50 border border-slate-100 hover:border-slate-200/80 hover:bg-white hover:shadow-md hover:shadow-slate-100/50 rounded-xl p-4 transition-all duration-300 space-y-2 text-left">
                    
                    {/* Operational Category tag */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-extrabold text-slate-400 tracking-widest uppercase">
                        {scopeLabel}
                      </span>
                      <span className={`capitalize font-extrabold border px-2 py-0.5 rounded-full text-[9px] tracking-wide uppercase ${badgeColor}`}>
                        {log.type}
                      </span>
                    </div>

                    {/* Message text */}
                    <p className="text-sm font-semibold text-slate-800 leading-snug">
                      {log.message}
                    </p>
                    
                    {/* Timestamp */}
                    <div className="pt-1 flex items-center gap-1.5 text-[10px] text-slate-400 font-bold font-mono">
                      <span className="w-1 h-1 rounded-full bg-slate-350"></span>
                      <span>
                        {new Date(log.time).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </span>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

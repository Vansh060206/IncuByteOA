import React, { useState } from 'react';
import { getPurchaseHistory } from '../utils/store';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Search, Tag, AlertCircle } from 'lucide-react';

export const PurchasesPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  const allPurchases = getPurchaseHistory();
  
  // Filter history if user is normal USER (only see their own)
  const userPurchases = user?.role === 'ADMIN' 
    ? allPurchases 
    : allPurchases.filter(p => p.userId === user?.id || p.userId === 'anonymous');

  // Filter based on search criteria
  const filteredPurchases = userPurchases.filter(p => {
    const make = p.vehicle?.make || '';
    const model = p.vehicle?.model || '';
    const combined = `${make} ${model}`.toLowerCase();
    return combined.includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalQuantity = filteredPurchases.reduce((sum, p) => sum + p.quantity, 0);
  const totalValue = filteredPurchases.reduce((sum, p) => {
    const price = Number(p.vehicle?.price) || 0;
    return sum + (price * p.quantity);
  }, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Purchase Ledgers</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {user?.role === 'ADMIN' 
              ? 'Cross-reference fleet purchases, customer order histories, and ledger receipts.' 
              : 'Audit your submitted orders, checkouts, and historical receipts.'
            }
          </p>
        </div>
      </div>

      {/* Analytics stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Total Transactions */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Transactions</span>
            <p className="text-3xl font-black text-slate-850">{filteredPurchases.length}</p>
          </div>
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl relative z-10 shadow-xs">
            <CreditCard className="w-5 h-5" />
          </div>
          {/* Sparkline vector */}
          <svg className="absolute bottom-2 left-5 w-24 h-6 text-indigo-500/15" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M0,22 Q20,18 40,25 T80,10 T100,5" />
          </svg>
        </div>

        {/* Total Units Sold */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Units Sold</span>
            <p className="text-3xl font-black text-slate-850">{totalQuantity}</p>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl relative z-10 shadow-xs">
            <Tag className="w-5 h-5" />
          </div>
          {/* Sparkline vector */}
          <svg className="absolute bottom-2 left-5 w-24 h-6 text-emerald-500/15" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M0,25 C20,15 45,28 70,12 T100,2" />
          </svg>
        </div>

        {/* Volume Value */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Volume Value</span>
            <p className="text-3xl font-black text-indigo-650 font-mono">${totalValue.toLocaleString()}</p>
          </div>
          <div className="p-2.5 bg-indigo-50 text-indigo-650 rounded-xl relative z-10 shadow-xs">
            <DollarSignIcon className="w-5 h-5" />
          </div>
          {/* Sparkline vector */}
          <svg className="absolute bottom-2 left-5 w-24 h-6 text-indigo-600/15" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M0,28 C20,25 40,15 60,12 C80,9 90,4 100,2" />
          </svg>
        </div>

      </div>

      {/* Filter and Table Surface */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm p-5 space-y-5">
        
        {/* Search Bar */}
        <div className="relative max-w-sm rounded-xl shadow-xs">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by vehicle or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition-all font-semibold"
          />
        </div>

        {/* List Table */}
        {filteredPurchases.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-lg">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500 font-semibold">No purchase history records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-100">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider bg-slate-50">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Vehicle Detail</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Total Price</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 pl-6">Operator ID</th>
                  <th className="py-3 px-4 text-right">Purchase Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredPurchases.map((purchase) => {
                  const price = Number(purchase.vehicle?.price) || 0;
                  const total = price * purchase.quantity;
                  const initial = purchase.vehicle?.make ? purchase.vehicle.make.charAt(0).toUpperCase() : 'V';
                  
                  return (
                    <tr key={purchase.id} className="hover:bg-slate-55/20 transition-colors duration-150">
                      
                      {/* Monospace Code ID */}
                      <td className="py-4 px-4">
                        <span className="font-mono text-[11px] text-slate-500 bg-slate-50 border border-slate-200/50 px-2 py-0.5 rounded font-bold select-all">
                          {purchase.id}
                        </span>
                      </td>

                      {/* Brand Initial Emblem + Name */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-white font-black text-[11px] uppercase shadow-xs shrink-0 select-none">
                            {initial}
                          </span>
                          <div>
                            <span className="font-bold text-slate-800 block leading-tight">
                              {purchase.vehicle?.make || 'Unknown'} {purchase.vehicle?.model || 'Model'}
                            </span>
                            <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-wider block">
                              {purchase.vehicle?.category || 'Fleet Unit'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Qty */}
                      <td className="py-4 px-4 text-center font-bold text-slate-800">
                        {purchase.quantity}
                      </td>

                      {/* Unit Price */}
                      <td className="py-4 px-4 text-right font-mono text-slate-500 font-bold">
                        ${price.toLocaleString()}
                      </td>

                      {/* Total Price */}
                      <td className="py-4 px-4 text-right font-mono font-extrabold text-indigo-650">
                        ${total.toLocaleString()}
                      </td>

                      {/* Live Status Pill */}
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                          <span className="w-1 h-1 rounded-full bg-emerald-550 animate-pulse"></span>
                          <span>Completed</span>
                        </span>
                      </td>

                      {/* Operator initials avatar */}
                      <td className="py-4 px-4 pl-6 text-slate-500 text-xs font-semibold">
                        <span className="inline-flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 select-none">
                            {purchase.userId === 'anonymous' ? 'OP' : purchase.userId.substring(0, 2).toUpperCase()}
                          </span>
                          <span>{purchase.userId === 'anonymous' ? 'Local Operator' : purchase.userId.substring(0, 8)}</span>
                        </span>
                      </td>

                      {/* Purchase Date */}
                      <td className="py-4 px-4 text-right text-xs text-slate-500 font-semibold font-mono">
                        {new Date(purchase.purchaseDate).toLocaleDateString(undefined, {
                          year: 'numeric',
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
  );
};

const DollarSignIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

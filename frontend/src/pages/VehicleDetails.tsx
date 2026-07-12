import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useVehicle, usePurchaseVehicle } from '../hooks/useVehicles';
import { useAuth } from '../context/AuthContext';
import { addPurchase, addActivityLog } from '../utils/store';
import { Loader2, ArrowLeft, ShoppingCart, HelpCircle, FileText, Lock, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export const getCarImage = (make?: string, model?: string): string => {
  const brand = (make || '').trim().toLowerCase();
  const name = (model || '').trim().toLowerCase();
  const combined = `${brand} ${name}`;

  if (combined.includes('mercedes') || combined.includes('amg') || combined.includes('benz')) {
    return 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=800&q=80'; // Yellow Mercedes-AMG
  }
  if (combined.includes('toyota') || combined.includes('corolla') || combined.includes('camry') || combined.includes('fortuner')) {
    return 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80'; // White Corolla
  }
  if (combined.includes('honda') || combined.includes('civic') || combined.includes('city') || combined.includes('accord')) {
    return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'; // Blue Civic
  }
  if (combined.includes('tesla') || combined.includes('model y') || combined.includes('model 3') || combined.includes('model s')) {
    return 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80'; // White Tesla
  }
  if (combined.includes('mustang') || combined.includes('ford') || combined.includes('f-150')) {
    return 'https://images.unsplash.com/photo-1612462287955-4684d8520cfb?auto=format&fit=crop&w=800&q=80'; // Yellow Mustang
  }
  if (combined.includes('porsche') || combined.includes('911') || combined.includes('cayman')) {
    return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'; // Porsche
  }
  if (combined.includes('bmw') || combined.includes('m3') || combined.includes('m5') || combined.includes('series')) {
    return 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80'; // Black BMW
  }
  if (combined.includes('audi') || combined.includes('r8') || combined.includes('a4') || combined.includes('a6')) {
    return 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80'; // Audi
  }
  if (combined.includes('hyundai') || combined.includes('creta') || combined.includes('i20') || combined.includes('elantra')) {
    return 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=800&q=80'; // Hyundai
  }
  if (combined.includes('kia') || combined.includes('seltos') || combined.includes('sportage') || combined.includes('ev6')) {
    return 'https://images.unsplash.com/photo-1629897048514-3dd741685e56?auto=format&fit=crop&w=800&q=80'; // Kia
  }
  if (combined.includes('chevrolet') || combined.includes('camaro') || combined.includes('bolt')) {
    return 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'; // Chevy Camaro
  }
  if (combined.includes('nissan') || combined.includes('gt-r') || combined.includes('altima')) {
    return 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80'; // Nissan
  }
  return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'; // Porsche fallback
};

export const getBrandLogoLetter = (make?: string): string => {
  if (!make) return 'A';
  return make.trim().charAt(0).toUpperCase();
};

export const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: vehicle, isLoading, error } = useVehicle(id || '');
  const purchaseMutation = usePurchaseVehicle();

  const handlePurchase = async () => {
    if (!vehicle) return;
    try {
      await purchaseMutation.mutateAsync({ id: vehicle.id, quantity: 1 });
      toast.success(`Successfully purchased ${vehicle.make} ${vehicle.model}!`);
      
      // Sync telemetry logs
      addPurchase({
        userId: user?.id || 'anonymous',
        vehicleId: vehicle.id,
        quantity: 1,
        vehicle: {
          id: vehicle.id,
          make: vehicle.make,
          model: vehicle.model,
          category: vehicle.category,
          price: vehicle.price,
          quantity: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as any
      });
      addActivityLog(`Customer completed purchase of ${vehicle.make} ${vehicle.model}.`, 'purchase');

      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to complete purchase.';
      toast.error(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse py-6 font-sans">
        <div className="h-5 bg-slate-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-[380px] bg-slate-200 rounded-2xl"></div>
            <div className="h-[200px] bg-slate-200 rounded-2xl"></div>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-[250px] bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl max-w-xl mx-auto font-sans shadow-sm">
        <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-base font-bold text-slate-800">Vehicle Not Found</h3>
        <p className="text-sm text-slate-500 mt-1.5">The vehicle details could not be retrieved.</p>
        <Link to="/" className="text-sm text-indigo-650 font-bold hover:underline mt-4 inline-block">
          Return to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 font-sans text-slate-800">
      
      {/* Back Link Breadcrumb */}
      <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 gap-1.5 group font-bold">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to fleet catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side (8 cols): Showcase Image & Specs tabs */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Car Showcase Card */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden relative shadow-sm group">
            {/* Real Vehicle Image */}
            <div className="aspect-[16/9] w-full relative overflow-hidden bg-slate-100">
              <img 
                src={getCarImage(vehicle.make, vehicle.model)} 
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';
                }}
              />
              
              {/* Category Badge overlay */}
              <span className="absolute top-4 right-4 bg-slate-900/90 text-white text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg border border-slate-700/50 shadow-md">
                {vehicle.category}
              </span>

              {/* Styled Circular Brand Logo Emblem Overlay */}
              <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-slate-900/80 border-2 border-slate-500/35 backdrop-blur-md flex items-center justify-center text-white font-black text-lg font-mono shadow-lg">
                {getBrandLogoLetter(vehicle.make)}
              </div>
            </div>
          </div>

          {/* Details & Specs grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Description card (5 cols) */}
            <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-650" />
                <span>Description</span>
              </h3>
              <p className="text-sm text-slate-655 leading-relaxed font-semibold">
                The {vehicle.make} {vehicle.model} is a premium vehicle in the {vehicle.category} segment. Engineered for exceptional performance, durability, and a highly refined driving experience.
              </p>
            </div>

            {/* Technical Specs List (7 cols) */}
            <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Vehicle Specs
              </h3>
              
              <div className="divide-y divide-slate-100 text-sm font-semibold">
                <div className="flex justify-between py-2.5">
                  <span className="text-slate-500">MAKE</span>
                  <span className="text-slate-800 font-bold">{vehicle.make.toUpperCase()}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-slate-500">MODEL VARIANT</span>
                  <span className="text-slate-800 font-bold">{vehicle.model.toUpperCase()}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-slate-500">CATEGORY</span>
                  <span className="text-slate-800 font-bold">{vehicle.category.toUpperCase()}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-slate-500">FUEL TYPE</span>
                  <span className="text-slate-800 font-bold">GASOLINE / HYBRID</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-slate-500">TRANSMISSION</span>
                  <span className="text-slate-800 font-bold">AUTOMATIC</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-slate-500">PRODUCTION YEAR</span>
                  <span className="text-slate-800 font-bold">2026</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Side (4 cols): Pricing & Purchase controls */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          
          {/* Price tag card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
            <div>
              <span className="bg-indigo-500/10 text-indigo-700 border border-indigo-200 text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                {vehicle.category}
              </span>
              <h1 className="text-2xl font-black text-slate-855 mt-3 tracking-tight">
                {vehicle.make} {vehicle.model}
              </h1>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 uppercase font-bold font-sans">Price</span>
                
                {/* Brand Initial Circle badge next to price */}
                <span className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-655 font-bold text-xs font-mono">
                    {getBrandLogoLetter(vehicle.make)}
                  </span>
                  <span className="text-2xl font-black text-indigo-650">
                    ${Number(vehicle.price).toLocaleString()}
                  </span>
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-slate-500 uppercase font-bold font-sans">Stock Level</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider font-sans ${
                    vehicle.quantity === 0
                      ? 'bg-red-500/10 text-red-600 border border-red-200'
                      : vehicle.quantity <= 3
                      ? 'bg-amber-500/10 text-amber-600 border border-amber-200'
                      : 'bg-emerald-500/10 text-emerald-600 border border-emerald-200'
                  }`}
                >
                  {vehicle.quantity === 0 
                    ? 'Out of Stock' 
                    : vehicle.quantity <= 3 
                    ? `Only ${vehicle.quantity} Left` 
                    : `${vehicle.quantity} In Stock`
                  }
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Certified Inspection Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                <ShieldCheckIcon className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>3-Year Warranty & Fleet Support</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                <Globe className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Nationwide Transit Routing</span>
              </div>
            </div>
          </div>

          {/* Secure Purchase checkout controls */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5 shadow-sm">
            <button
              onClick={handlePurchase}
              disabled={vehicle.quantity === 0 || purchaseMutation.isPending}
              className="w-full flex items-center justify-center gap-1.5 py-3 px-4 text-sm font-semibold rounded-xl text-white bg-indigo-650 hover:bg-indigo-755 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {purchaseMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>{vehicle.quantity === 0 ? 'Out of Stock' : 'Checkout Vehicle'}</span>
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase font-bold tracking-widest font-mono text-slate-500">
              <Lock className="w-3.5 h-3.5" />
              <span>SSL Secure Checkout Processing</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <polyline points="9 11 11 13 15 9"></polyline>
  </svg>
);

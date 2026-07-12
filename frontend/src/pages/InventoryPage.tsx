import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleSchema } from '../schemas';
import type { VehicleInput } from '../schemas';
import { 
  useVehicles, useSearchVehicles, usePurchaseVehicle,
  useCreateVehicle, useUpdateVehicle, useDeleteVehicle, useRestockVehicle 
} from '../hooks/useVehicles';
import { useAuth } from '../context/AuthContext';
import type { Vehicle } from '../types';
import toast from 'react-hot-toast';
import { getCarImage, getBrandLogoLetter } from './VehicleDetails';
import { addActivityLog, addPurchase } from '../utils/store';
import { 
  Search, SlidersHorizontal, Plus, Edit2, Trash2, RefreshCw, 
  Grid, List, Loader2, X, Car, ArrowRight, AlertCircle, 
  Tag, Layers, DollarSign, Box 
} from 'lucide-react';


export const InventoryPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const isAdmin = user?.role === 'ADMIN';

  // UI state variables
  const [viewMode, setViewMode] = useState<'grid' | 'table'>(isAdmin ? 'table' : 'grid');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [restockingId, setRestockingId] = useState<string | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(5);

  // Search parameters filter state
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    category: '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
  });
  const [activeFilters, setActiveFilters] = useState(filters);
  const [isSearching, setIsSearching] = useState(false);

  // React Query endpoint hooks
  const { data: normalData, isLoading: normalLoading, error: normalError } = useVehicles();
  const { data: searchData, isLoading: searchLoading, error: searchError } = useSearchVehicles(activeFilters);
  
  const purchaseMutation = usePurchaseVehicle();
  const createMutation = useCreateVehicle();
  const updateMutation = useUpdateVehicle();
  const deleteMutation = useDeleteVehicle();
  const restockMutation = useRestockVehicle();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<VehicleInput>({
    resolver: zodResolver(vehicleSchema),
  });

  // Watch query params to trigger modal drawer
  useEffect(() => {
    if (searchParams.get('action') === 'add' && isAdmin) {
      setEditingVehicle(null);
      reset();
      setIsFormOpen(true);
      // clean parameters
      setSearchParams({});
    }
  }, [searchParams, isAdmin, reset, setSearchParams]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === '' ? undefined : name.includes('Price') ? parseFloat(value) : value,
    }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasActiveFilter = Object.values(filters).some((val) => val !== undefined && val !== '');
    setIsSearching(hasActiveFilter);
    setActiveFilters(filters);
  };

  const handleReset = () => {
    const emptyFilters = {
      make: '',
      model: '',
      category: '',
      minPrice: undefined,
      maxPrice: undefined,
    };
    setFilters(emptyFilters);
    setActiveFilters(emptyFilters);
    setIsSearching(false);
  };

  const handlePurchase = async (id: string, make: string, model: string, price: string | number) => {
    try {
      await purchaseMutation.mutateAsync({ id, quantity: 1 });
      toast.success(`Successfully purchased ${make} ${model}!`);
      
      // Persist transaction record
      addPurchase({
        userId: user?.id || 'anonymous',
        vehicleId: id,
        quantity: 1,
        vehicle: {
          id,
          make,
          model,
          category: '',
          price,
          quantity: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as Vehicle
      });
      addActivityLog(`Customer completed purchase of ${make} ${model}.`, 'purchase');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to complete purchase.');
    }
  };

  const handleFormSubmit = async (formData: VehicleInput) => {
    try {
      if (editingVehicle) {
        await updateMutation.mutateAsync({ id: editingVehicle.id, data: formData });
        toast.success('Vehicle updated successfully!');
        addActivityLog(`Admin updated vehicle details for ${formData.make} ${formData.model}.`, 'update');
      } else {
        await createMutation.mutateAsync(formData);
        toast.success('Vehicle created successfully!');
        addActivityLog(`Admin added new model ${formData.make} ${formData.model} to catalog.`, 'create');
      }
      setIsFormOpen(false);
      setEditingVehicle(null);
      reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error saving vehicle.');
    }
  };

  const handleEditClick = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setValue('make', vehicle.make);
    setValue('model', vehicle.model);
    setValue('category', vehicle.category);
    setValue('price', Number(vehicle.price));
    setValue('quantity', vehicle.quantity);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string, make: string, model: string) => {
    if (window.confirm(`Are you sure you want to delete ${make} ${model}?`)) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Vehicle deleted successfully');
        addActivityLog(`Admin deleted vehicle ${make} ${model} from inventory.`, 'delete');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete vehicle');
      }
    }
  };

  const handleRestock = async (id: string, make: string, model: string) => {
    if (restockAmount <= 0) {
      toast.error('Please enter a positive value to restock');
      return;
    }
    try {
      await restockMutation.mutateAsync({ id, quantity: restockAmount });
      toast.success('Vehicle restocked successfully');
      addActivityLog(`Admin restocked ${restockAmount} units of ${make} ${model}.`, 'restock');
      setRestockingId(null);
      setRestockAmount(5);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Restock failed');
    }
  };

  const isLoading = isSearching ? searchLoading : normalLoading;
  const error = isSearching ? searchError : normalError;
  const vehicles = isSearching ? searchData || [] : normalData?.vehicles || [];

  const getCategoryStyles = (category: string) => {
    switch (category.toUpperCase()) {
      case 'SUV':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'SEDAN':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'HATCHBACK':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'COUPE':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'TRUCK':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Fleet Inventory</h1>
          <p className="text-slate-500 text-sm mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Manage your showroom catalog, configure specifications, and audit live unit stock levels.</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="text-indigo-650 font-bold">Out of Stock: {vehicles.filter(v => v.quantity === 0).length}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2.5">
          {isAdmin && (
            <button
              onClick={() => {
                setEditingVehicle(null);
                reset();
                setIsFormOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-indigo-650/15"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          )}

          {isAdmin && (
            <div className="flex items-center border border-slate-200 rounded-xl bg-white p-0.5 shadow-2xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                title="Grid Showroom"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                title="Operations Table"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter panel */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Search Filters</h2>
          </div>
          {isSearching && (
            <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100 font-bold">
              Active Filtering Enabled
            </span>
          )}
        </div>

        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
          
          {/* Make */}
          <div className="relative rounded-xl shadow-2xs w-full">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <Car className="w-4 h-4" />
            </span>
            <input
              type="text"
              name="make"
              value={filters.make}
              onChange={handleFilterChange}
              placeholder="Make (e.g. Ford)"
              className="block w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition-all font-semibold"
            />
          </div>

          {/* Model */}
          <div className="relative rounded-xl shadow-2xs w-full">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <Tag className="w-4 h-4" />
            </span>
            <input
              type="text"
              name="model"
              value={filters.model}
              onChange={handleFilterChange}
              placeholder="Model (e.g. F-150)"
              className="block w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition-all font-semibold"
            />
          </div>

          {/* Category */}
          <div className="relative rounded-xl shadow-2xs w-full">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <Layers className="w-4 h-4" />
            </span>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="block w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition-all font-semibold"
            >
              <option value="">All Categories</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Coupe">Coupe</option>
              <option value="Truck">Truck</option>
            </select>
          </div>

          {/* Min Price */}
          <div className="relative rounded-xl shadow-2xs w-full">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <DollarSign className="w-4 h-4" />
            </span>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice || ''}
              onChange={handleFilterChange}
              placeholder="Min Price"
              className="block w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition-all font-semibold"
            />
          </div>

          {/* Max Price */}
          <div className="relative rounded-xl shadow-2xs w-full">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <DollarSign className="w-4 h-4" />
            </span>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice || ''}
              onChange={handleFilterChange}
              placeholder="Max Price"
              className="block w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-855 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition-all font-semibold"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-5 flex justify-end space-x-2.5 mt-1">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 text-sm font-bold border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-855 rounded-xl hover:bg-slate-50 transition-all"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-bold bg-indigo-650 hover:bg-indigo-755 text-white rounded-xl transition-all flex items-center gap-1.5 shadow-sm shadow-indigo-650/15"
            >
              <Search className="w-4 h-4" />
              <span>Search Catalog</span>
            </button>
          </div>
        </form>
      </div>

      {/* Main layout contents */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-xl shadow-sm">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <div className="sr-only">Fetching fleet status...</div>
          <p className="mt-3 text-sm text-slate-500 font-semibold">Fetching inventory catalog...</p>
        </div>
      ) : error ? (
        <div className="py-12 text-center bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
          <h4 className="text-base font-bold text-red-800">Database offline</h4>
          <p className="text-sm text-red-655 mt-1">Could not fetch catalog data. Please inspect backend container status.</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="py-16 text-center bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-slate-500 text-sm font-medium">No vehicles found matching search criteria.</p>
          <button onClick={handleReset} className="mt-3 text-sm text-indigo-600 font-bold hover:underline">
            Clear filters and reload
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID SHOWROOM VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => {
            // Determine Stock Badge pill with pulsing bullet
            let stockBadge = null;
            if (vehicle.quantity === 0) {
              stockBadge = (
                <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-100 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>Out of Stock</span>
                </span>
              );
            } else if (vehicle.quantity <= 3) {
              stockBadge = (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Only {vehicle.quantity} Left</span>
                </span>
              );
            } else {
              stockBadge = (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{vehicle.quantity} In Stock</span>
                </span>
              );
            }

            return (
              <div
                key={vehicle.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300 group shadow-sm"
              >
                <div className="p-5 space-y-4">
                  <div className="aspect-[16/10] w-full rounded-lg bg-slate-100 relative overflow-hidden border border-slate-200/60">
                    <img
                      src={getCarImage(vehicle.make, vehicle.model)}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <span className="absolute top-3 right-3 bg-slate-900/95 text-white text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded border border-slate-750 shadow-md">
                      {vehicle.category}
                    </span>
                    
                    {/* Brand emblem overlay */}
                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 border border-slate-500/35 backdrop-blur-xs flex items-center justify-center text-white font-black text-xs font-mono shadow-md select-none">
                      {getBrandLogoLetter(vehicle.make)}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        to={`/vehicle/${vehicle.id}`}
                        className="text-base font-extrabold text-slate-800 hover:text-indigo-650 transition-colors block tracking-tight truncate"
                      >
                        {vehicle.make} {vehicle.model}
                      </Link>
                      {isAdmin && (
                        <div className="flex space-x-1 shrink-0">
                          <button
                            onClick={() => handleEditClick(vehicle)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-55/20 rounded border border-transparent hover:border-slate-200 transition-all"
                            title="Edit Vehicle"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(vehicle.id, vehicle.make, vehicle.model)}
                            className="p-1.5 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded border border-transparent hover:border-red-100 transition-all"
                            title="Delete Vehicle"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">AWD</span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">Auto</span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">8-Speed</span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-black text-indigo-650 font-mono">
                        ${Number(vehicle.price).toLocaleString()}
                      </span>
                      {stockBadge}
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <button
                    disabled={vehicle.quantity === 0 || purchaseMutation.isPending}
                    onClick={() => handlePurchase(vehicle.id, vehicle.make, vehicle.model, vehicle.price)}
                    className="w-full flex items-center justify-center py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-xl text-white bg-indigo-600 hover:bg-indigo-750 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    {purchaseMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : vehicle.quantity === 0 ? (
                      'Sold Out'
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <span>Purchase Vehicle</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* OPERATIONS TABLE VIEW (Admins Only) */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-bold uppercase text-slate-400 tracking-widest bg-slate-50/70">
                  <th className="py-4 px-5">Vehicle</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4 text-right">Unit Price</th>
                  <th className="py-4 px-4 text-center">Stock level</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-50/50 group transition-colors duration-150">
                    <td className="py-4 px-5">
                      <span className="font-bold text-slate-800">{vehicle.make}</span>{' '}
                      <span className="text-slate-500 font-medium">{vehicle.model}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${getCategoryStyles(vehicle.category)}`}>
                        <span className="w-1 H-1 rounded-full bg-current"></span>
                        <span>{vehicle.category}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-indigo-650">
                      ${Number(vehicle.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-4 min-w-[140px]">
                      {restockingId === vehicle.id ? (
                        <div className="flex items-center justify-center space-x-1.5">
                          <input
                            type="number"
                            aria-label="Restock Amount"
                            value={restockAmount}
                            onChange={(e) => setRestockAmount(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-12 px-1.5 py-0.5 bg-white border border-slate-300 text-center rounded text-xs text-slate-800 focus:outline-none focus:border-indigo-600 transition-all font-semibold"
                          />
                          <button
                            onClick={() => handleRestock(vehicle.id, vehicle.make, vehicle.model)}
                            className="bg-indigo-600 hover:bg-indigo-700 px-2 py-0.5 rounded text-[10px] text-white font-bold transition-all shadow-xs"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => setRestockingId(null)}
                            className="text-slate-500 hover:text-slate-750 text-[10px] transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1 max-w-[120px] mx-auto">
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 px-0.5">
                            <span>Qty: {vehicle.quantity}</span>
                            <span className={vehicle.quantity === 0 ? 'text-red-500' : vehicle.quantity <= 3 ? 'text-amber-500' : 'text-emerald-500'}>
                              {vehicle.quantity === 0 ? 'Out' : vehicle.quantity <= 3 ? 'Low' : 'OK'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 border border-slate-200 overflow-hidden flex">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                vehicle.quantity === 0 ? 'bg-red-500' :
                                vehicle.quantity <= 3 ? 'bg-amber-500' :
                                'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, (vehicle.quantity / 15) * 100)}%` }}
                            />
                          </div>
                          <div className="h-2.5 flex justify-center">
                            <button
                              onClick={() => {
                                setRestockingId(vehicle.id);
                                setRestockAmount(5);
                              }}
                              className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[9px] text-indigo-600 hover:underline font-bold transition-all"
                            >
                              <RefreshCw className="w-2.5 h-2.5" />
                              <span>Restock</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex justify-end space-x-1">
                        <button
                          onClick={() => handleEditClick(vehicle)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all"
                          title="Edit Vehicle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.id, vehicle.make, vehicle.model)}
                          className="p-2 text-slate-400 hover:text-red-655 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all"
                          title="Delete Vehicle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FORM MODAL DRAWER OVERLAY (Add / Edit Vehicle) */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 relative animate-fadeIn">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-655 p-1 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              <span>{editingVehicle ? 'Edit Vehicle Info' : 'Add New Vehicle'}</span>
            </h3>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-slate-850">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Make / Brand
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <Tag className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Ford, Tesla"
                    className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition-all ${
                      errors.make ? 'border-red-500 focus:border-red-550' : 'border-slate-200'
                    }`}
                    {...register('make')}
                  />
                </div>
                {errors.make && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.make.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Model Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <Car className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Mustang, Model 3"
                    className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition-all ${
                      errors.model ? 'border-red-500 focus:border-red-550' : 'border-slate-200'
                    }`}
                    {...register('model')}
                  />
                </div>
                {errors.model && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.model.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <Layers className="w-4 h-4" />
                  </span>
                  <select
                    className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition-all ${
                      errors.category ? 'border-red-500 focus:border-red-550' : 'border-slate-200'
                    }`}
                    {...register('category')}
                  >
                    <option value="">Select category</option>
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Truck">Truck</option>
                  </select>
                </div>
                {errors.category && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Unit Price ($)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <DollarSign className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 29999.00"
                    className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition-all ${
                      errors.price ? 'border-red-500 focus:border-red-550' : 'border-slate-200'
                    }`}
                    {...register('price')}
                  />
                </div>
                {errors.price && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.price.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Stock Quantity
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <Box className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    placeholder="e.g. 10"
                    className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition-all ${
                      errors.quantity ? 'border-red-500 focus:border-red-555' : 'border-slate-200'
                    }`}
                    {...register('quantity')}
                  />
                </div>
                {errors.quantity && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.quantity.message}</p>}
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 py-2.5 px-4 border border-slate-200 text-sm font-semibold rounded-lg text-slate-550 hover:bg-slate-50 hover:text-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-grow py-2.5 px-4 text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-755 disabled:opacity-50 transition-all shadow-sm"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : editingVehicle ? (
                    'Save Changes'
                  ) : (
                    'Add Vehicle'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

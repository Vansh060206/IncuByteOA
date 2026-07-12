import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useVehicles } from '../hooks/useVehicles';
import type { Vehicle } from '../hooks/useVehicles';

export const Vehicles: React.FC = () => {
  const { user } = useAuth();
  const {
    vehicles,
    loading,
    error: apiError,
    fetchVehicles,
    searchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    purchaseVehicle,
    restockVehicle,
  } = useVehicles();

  // Search & Filter state
  const [searchMake, setSearchMake] = useState('');
  const [searchModel, setSearchModel] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchMinPrice, setSearchMinPrice] = useState('');
  const [searchMaxPrice, setSearchMaxPrice] = useState('');

  // Modal Dialog Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [restockAmount, setRestockAmount] = useState('10');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  const [formName, setFormName] = useState('');
  const [formMake, setFormMake] = useState('');
  const [formModel, setFormModel] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formQuantity, setFormQuantity] = useState('5');
  const [formYear, setFormYear] = useState(new Date().getFullYear().toString());
  const [formColor, setFormColor] = useState('');
  const [formLicensePlate, setFormLicensePlate] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchVehicles({
      make: searchMake,
      model: searchModel,
      category: searchCategory,
      minPrice: searchMinPrice,
      maxPrice: searchMaxPrice,
    });
  };

  const handleClearSearch = () => {
    setSearchMake('');
    setSearchModel('');
    setSearchCategory('');
    setSearchMinPrice('');
    setSearchMaxPrice('');
    fetchVehicles();
  };

  const openAddModal = () => {
    setEditingVehicle(null);
    setFormName('');
    setFormMake('');
    setFormModel('');
    setFormCategory('');
    setFormPrice('');
    setFormQuantity('5');
    setFormYear(new Date().getFullYear().toString());
    setFormColor('');
    setFormLicensePlate('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormName(vehicle.name);
    setFormMake(vehicle.make);
    setFormModel(vehicle.model);
    setFormCategory(vehicle.category);
    setFormPrice(vehicle.price.toString());
    setFormQuantity(vehicle.quantity.toString());
    setFormYear(vehicle.year.toString());
    setFormColor(vehicle.color);
    setFormLicensePlate(vehicle.licensePlate);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openRestockModal = (vehicle: Vehicle) => {
    setSelectedVehicleId(vehicle.id);
    setRestockAmount('10');
    setFormError(null);
    setIsRestockOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic Validation
    if (!formName || !formMake || !formModel || !formCategory || !formPrice || !formYear || !formColor || !formLicensePlate) {
      setFormError('Please fill in all required fields');
      return;
    }

    const priceNum = Number(formPrice);
    const quantityNum = Number(formQuantity);
    const yearNum = Number(formYear);

    if (isNaN(priceNum) || priceNum < 0) {
      setFormError('Price must be a valid positive number');
      return;
    }
    if (isNaN(yearNum) || yearNum < 1886) {
      setFormError('Please enter a valid year (> 1886)');
      return;
    }

    setSubmitting(true);
    try {
      if (editingVehicle) {
        // Edit flow
        await updateVehicle(editingVehicle.id, {
          name: formName,
          make: formMake,
          model: formModel,
          category: formCategory,
          price: priceNum,
          quantity: quantityNum,
          year: yearNum,
          color: formColor,
          licensePlate: formLicensePlate,
        });
      } else {
        // Create flow
        await createVehicle({
          name: formName,
          make: formMake,
          model: formModel,
          category: formCategory,
          price: priceNum,
          quantity: quantityNum,
          year: yearNum,
          color: formColor,
          licensePlate: formLicensePlate,
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this vehicle from inventory?')) {
      try {
        await deleteVehicle(id);
      } catch (err: any) {
        alert(err.message || 'Failed to delete vehicle');
      }
    }
  };

  const handlePurchase = async (id: string) => {
    try {
      await purchaseVehicle(id);
    } catch (err: any) {
      alert(err.message || 'Purchase failed');
    }
  };

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const amount = Number(restockAmount);
    if (isNaN(amount) || amount <= 0) {
      setFormError('Please enter a valid restock amount (> 0)');
      return;
    }

    setSubmitting(true);
    try {
      await restockVehicle(selectedVehicleId, amount);
      setIsRestockOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Restock failed');
    } finally {
      setSubmitting(false);
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dealership Inventory</h1>
          <p>Find, purchase, and manage vehicles available in stock</p>
        </div>
        {isAdmin && (
          <button onClick={openAddModal} className="btn btn-primary">
            + Add Vehicle
          </button>
        )}
      </div>

      {apiError && (
        <div className="alert alert-danger" style={{ marginBottom: '24px' }}>
          <span>{apiError}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <form onSubmit={handleSearch} className="card" style={{ marginBottom: '32px', padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Make</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Tesla"
              value={searchMake}
              onChange={(e) => setSearchMake(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Model</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Model Y"
              value={searchModel}
              onChange={(e) => setSearchModel(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. SUV"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Min Price ($)</label>
            <input
              type="number"
              className="form-control"
              placeholder="0"
              value={searchMinPrice}
              onChange={(e) => setSearchMinPrice(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Max Price ($)</label>
            <input
              type="number"
              className="form-control"
              placeholder="100000"
              value={searchMaxPrice}
              onChange={(e) => setSearchMaxPrice(e.target.value)}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={handleClearSearch} className="btn btn-secondary btn-sm">
            Clear Filters
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            Search Inventory
          </button>
        </div>
      </form>

      {/* Grid List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading inventory...</div>
      ) : (
        <div className="vehicles-grid">
          {vehicles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🚗</div>
              <h3>No vehicles found</h3>
              <p>Try tweaking your filters or check back later!</p>
            </div>
          ) : (
            vehicles.map((vehicle) => (
              <div key={vehicle.id} className="card vehicle-card">
                <div>
                  <div className="vehicle-header">
                    <div>
                      <h3 className="vehicle-title">{vehicle.make} {vehicle.model}</h3>
                      <p style={{ fontSize: '0.85rem' }}>{vehicle.name}</p>
                    </div>
                    <span className="vehicle-plate">{vehicle.licensePlate}</span>
                  </div>

                  <div className="vehicle-details">
                    <div className="detail-item">
                      <span className="detail-label">Category</span>
                      <span className="detail-value">{vehicle.category}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Price</span>
                      <span className="detail-value" style={{ color: 'var(--success)' }}>
                        ${vehicle.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Stock Status</span>
                      <span className="detail-value" style={{ color: vehicle.quantity === 0 ? 'var(--error)' : 'inherit' }}>
                        {vehicle.quantity === 0 ? 'Out of stock' : `${vehicle.quantity} available`}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Year / Color</span>
                      <span className="detail-value">{vehicle.year} ({vehicle.color})</span>
                    </div>
                  </div>
                </div>

                <div className="vehicle-actions">
                  <button
                    onClick={() => handlePurchase(vehicle.id)}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                    disabled={vehicle.quantity === 0}
                  >
                    Purchase
                  </button>
                  {isAdmin && (
                    <>
                      <button onClick={() => openRestockModal(vehicle)} className="btn btn-secondary btn-sm" title="Restock">
                        Restock
                      </button>
                      <button onClick={() => openEditModal(vehicle)} className="btn btn-secondary btn-sm" title="Edit">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(vehicle.id)} className="btn btn-danger btn-sm" title="Delete">
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add / Edit Modal Overlay */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={() => setIsModalOpen(false)} className="modal-close">×</button>
            <div className="modal-header">
              <h2>{editingVehicle ? 'Edit Vehicle Details' : 'Register New Vehicle'}</h2>
            </div>

            {formError && (
              <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'left' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Custom Display Name*</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. CEO's Commuter Car"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Make*</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Tesla"
                  value={formMake}
                  onChange={(e) => setFormMake(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Model*</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Model Y"
                  value={formModel}
                  onChange={(e) => setFormModel(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category*</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. SUV, Sedan, Coupe"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Price ($)*</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="45000"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Year*</label>
                <input
                  type="number"
                  className="form-control"
                  value={formYear}
                  onChange={(e) => setFormYear(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Color*</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Midnight Silver"
                  value={formColor}
                  onChange={(e) => setFormColor(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">License Plate Number*</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. AB12CDE"
                  value={formLicensePlate}
                  onChange={(e) => setFormLicensePlate(e.target.value)}
                />
              </div>

              {!editingVehicle && (
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Initial Quantity in Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(e.target.value)}
                  />
                </div>
              )}

              <div className="modal-footer" style={{ gridColumn: '1 / -1', margin: 0 }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restock Modal Overlay */}
      {isRestockOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '380px' }}>
            <button onClick={() => setIsRestockOpen(false)} className="modal-close">×</button>
            <div className="modal-header">
              <h2>Restock Vehicle</h2>
              <p>Add additional units of this vehicle to the showroom stock.</p>
            </div>

            {formError && (
              <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleRestockSubmit} style={{ textAlign: 'left' }}>
              <div className="form-group">
                <label className="form-label">Amount to Add</label>
                <input
                  type="number"
                  className="form-control"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(e.target.value)}
                />
              </div>
              <div className="modal-footer" style={{ margin: 0 }}>
                <button type="button" onClick={() => setIsRestockOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Restocking...' : 'Add Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

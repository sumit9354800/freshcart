import React, { useState } from 'react';
import { MapPin, Plus, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../common/Button';
import { useUser } from '../../context/UserContext';
import type { Address } from '../../types';

export interface StepAddressProps {
  initialAddress: Address;
  onNext: (address: Address) => void;
  onBack: () => void;
}

export function StepAddress({ initialAddress, onNext, onBack }: StepAddressProps) {
  const { addresses, addAddress } = useUser();
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    initialAddress?.id || addresses[0]?.id || 'custom'
  );
  const [isAddingNew, setIsAddingNew] = useState(addresses.length === 0);

  const [newAddr, setNewAddr] = useState<Omit<Address, 'id'>>({
    firstName: initialAddress?.firstName || '',
    lastName: initialAddress?.lastName || '',
    addressLine1: initialAddress?.addressLine1 || '',
    apartment: initialAddress?.apartment || '',
    city: initialAddress?.city || '',
    state: initialAddress?.state || '',
    postalCode: initialAddress?.postalCode || '',
    country: 'United States',
    phone: initialAddress?.phone || '',
    isDefault: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateNewAddress = (): boolean => {
    const errs: Record<string, string> = {};
    if (!newAddr.addressLine1.trim()) errs.addressLine1 = 'Street address is required';
    if (!newAddr.city.trim()) errs.city = 'City is required';
    if (!newAddr.state.trim()) errs.state = 'State is required';
    if (!newAddr.postalCode.trim()) errs.postalCode = 'Postal / ZIP code is required';
    if (!newAddr.country.trim()) errs.country = 'Country is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();

    if (isAddingNew) {
      if (!validateNewAddress()) return;
      const created = addAddress(newAddr);
      onNext(created);
    } else {
      const chosen = addresses.find((a) => a.id === selectedAddressId) || initialAddress;
      onNext(chosen);
    }
  };

  return (
    <form onSubmit={handleContinue} className="p-6 rounded-2xl border border-stone-200/80 bg-white space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
        <MapPin className="w-5 h-5 text-emerald-600" />
        <h3 className="text-base font-bold text-stone-900">Step 2 — Shipping Address</h3>
      </div>

      {/* Saved Addresses Selector */}
      {addresses.length > 0 && !isAddingNew && (
        <div className="space-y-3">
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider">
            Select a Saved Delivery Address
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {addresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id;
              return (
                <div
                  key={addr.id}
                  id={`saved-address-${addr.id}`}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-stone-900">
                      {addr.firstName} {addr.lastName}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600">{addr.addressLine1}</p>
                  {addr.apartment && <p className="text-xs text-stone-600">{addr.apartment}</p>}
                  <p className="text-xs text-stone-600">
                    {addr.city}, {addr.state} {addr.postalCode}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">{addr.country}</p>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            id="add-new-address-toggle"
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors pt-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Deliver to a new address instead</span>
          </button>
        </div>
      )}

      {/* New Address Form */}
      {isAddingNew && (
        <div className="space-y-4 pt-1">
          {addresses.length > 0 && (
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800 underline mb-2 cursor-pointer"
            >
              ← Choose from saved addresses
            </button>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              id="address-line1"
              value={newAddr.addressLine1}
              onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              placeholder="e.g. 742 Evergreen Terrace"
            />
            {errors.addressLine1 && (
              <p className="text-xs text-rose-600 mt-1">{errors.addressLine1}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Apartment, Suite, Unit (optional)
            </label>
            <input
              type="text"
              id="address-apartment"
              value={newAddr.apartment}
              onChange={(e) => setNewAddr({ ...newAddr, apartment: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              placeholder="e.g. Apt 4B"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                City *
              </label>
              <input
                type="text"
                id="address-city"
                value={newAddr.city}
                onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                placeholder="Springfield"
              />
              {errors.city && <p className="text-xs text-rose-600 mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                State / Province *
              </label>
              <input
                type="text"
                id="address-state"
                value={newAddr.state}
                onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                placeholder="IL"
              />
              {errors.state && <p className="text-xs text-rose-600 mt-1">{errors.state}</p>}
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Postal / ZIP Code *
              </label>
              <input
                type="text"
                id="address-postal"
                value={newAddr.postalCode}
                onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                placeholder="62704"
              />
              {errors.postalCode && (
                <p className="text-xs text-rose-600 mt-1">{errors.postalCode}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Country *</label>
            <select
              value={newAddr.country}
              onChange={(e) => setNewAddr({ ...newAddr, country: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 bg-white"
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-stone-100">
        <Button type="button" variant="outline" size="md" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back</span>
        </Button>
        <Button type="submit" variant="primary" size="md">
          <span>Continue to Delivery</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </form>
  );
}

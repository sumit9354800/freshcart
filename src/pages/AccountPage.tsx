import React, { useState } from 'react';
import { User, MapPin, Plus, Trash2, Check, Edit2, Package, Heart } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Link } from 'react-router-dom';
import type { Address } from '../types';

export function AccountPage() {
  const {
    profile,
    updateProfile,
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useUser();

  // Profile Form state
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);

  // Address Modal state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const [addrForm, setAddrForm] = useState<Omit<Address, 'id'>>({
    firstName: profile.firstName,
    lastName: profile.lastName,
    addressLine1: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: profile.phone,
    isDefault: false,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ firstName, lastName, email, phone });
  };

  const handleOpenNewAddress = () => {
    setEditingAddressId(null);
    setAddrForm({
      firstName: profile.firstName,
      lastName: profile.lastName,
      addressLine1: '',
      apartment: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      phone: profile.phone,
      isDefault: addresses.length === 0,
    });
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setAddrForm({
      firstName: addr.firstName,
      lastName: addr.lastName,
      addressLine1: addr.addressLine1,
      apartment: addr.apartment || '',
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
      phone: addr.phone || profile.phone,
      isDefault: addr.isDefault || false,
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddressId) {
      updateAddress(editingAddressId, addrForm);
    } else {
      addAddress(addrForm);
    }
    setIsAddressModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Breadcrumbs items={[{ label: 'Account Profile & Addresses' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Account Settings</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage your personal profile and saved shipping locations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/orders">
            <Button variant="outline" size="sm">
              <Package className="w-4 h-4 mr-1.5" />
              <span>Past Orders</span>
            </Button>
          </Link>
          <Link to="/wishlist">
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4 mr-1.5" />
              <span>Wishlist</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Form Card */}
      <div className="p-6 rounded-2xl border border-stone-200/80 bg-white space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
          <User className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-stone-900">Personal Information</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm">
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Address Book Card */}
      <div className="p-6 rounded-2xl border border-stone-200/80 bg-white space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-stone-900">Address Book</h2>
          </div>
          <Button variant="outline" size="sm" onClick={handleOpenNewAddress}>
            <Plus className="w-4 h-4 mr-1" />
            <span>Add New Address</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-4 rounded-xl border-2 transition-all relative flex flex-col justify-between ${
                addr.isDefault
                  ? 'border-emerald-600 bg-emerald-50/20'
                  : 'border-stone-200 bg-stone-50/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-stone-900 text-sm">
                    {addr.firstName} {addr.lastName}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Primary Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-600">{addr.addressLine1}</p>
                {addr.apartment && <p className="text-xs text-stone-600">{addr.apartment}</p>}
                <p className="text-xs text-stone-600">
                  {addr.city}, {addr.state} {addr.postalCode}
                </p>
                <p className="text-xs text-stone-400 mt-1">{addr.country}</p>
                {addr.phone && <p className="text-xs text-stone-400">{addr.phone}</p>}
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-200/60 text-xs">
                {!addr.isDefault ? (
                  <button
                    type="button"
                    onClick={() => setDefaultAddress(addr.id)}
                    className="font-semibold text-emerald-700 hover:underline"
                  >
                    Set as default
                  </button>
                ) : (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Default Address
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditAddress(addr)}
                    className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                    title="Edit address"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteAddress(addr.id)}
                      className="p-1 rounded-lg text-stone-400 hover:text-rose-600"
                      title="Delete address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Address Form Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title={editingAddressId ? 'Edit Shipping Address' : 'Add New Shipping Address'}
      >
        <form onSubmit={handleSaveAddress} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={addrForm.firstName}
                onChange={(e) => setAddrForm({ ...addrForm, firstName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={addrForm.lastName}
                onChange={(e) => setAddrForm({ ...addrForm, lastName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              required
              value={addrForm.addressLine1}
              onChange={(e) => setAddrForm({ ...addrForm, addressLine1: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              placeholder="123 Main St"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Apartment / Suite (optional)
            </label>
            <input
              type="text"
              value={addrForm.apartment}
              onChange={(e) => setAddrForm({ ...addrForm, apartment: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              placeholder="Apt 4B"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={addrForm.city}
                onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                State *
              </label>
              <input
                type="text"
                required
                value={addrForm.state}
                onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                ZIP Code *
              </label>
              <input
                type="text"
                required
                value={addrForm.postalCode}
                onChange={(e) => setAddrForm({ ...addrForm, postalCode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={addrForm.isDefault}
              onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>Set as primary delivery address</span>
          </label>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddressModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Address
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

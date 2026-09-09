import React, { useState } from 'react';
import { User, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';
import type { Customer } from '../../types';

export interface StepCustomerInfoProps {
  initialData: Customer;
  onNext: (data: Customer) => void;
}

export function StepCustomerInfo({ initialData, onNext }: StepCustomerInfoProps) {
  const [customer, setCustomer] = useState<Customer>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({});

  const validate = (): boolean => {
    const errs: Partial<Record<keyof Customer, string>> = {};
    if (!customer.firstName.trim()) errs.firstName = 'First name is required';
    if (!customer.lastName.trim()) errs.lastName = 'Last name is required';
    if (!customer.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      errs.email = 'Please provide a valid email';
    }
    if (!customer.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (customer.phone.trim().length < 7) {
      errs.phone = 'Please provide a valid phone number';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(customer);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-stone-200/80 bg-white space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
        <User className="w-5 h-5 text-emerald-600" />
        <h3 className="text-base font-bold text-stone-900">Step 1 — Customer Information</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            id="checkout-firstname"
            value={customer.firstName}
            onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            placeholder="e.g. Sarah"
          />
          {errors.firstName && (
            <p className="text-xs text-rose-600 mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            id="checkout-lastname"
            value={customer.lastName}
            onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            placeholder="e.g. Jenkins"
          />
          {errors.lastName && (
            <p className="text-xs text-rose-600 mt-1">{errors.lastName}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="checkout-email"
            value={customer.email}
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            placeholder="sarah.jenkins@example.com"
          />
          {errors.email && (
            <p className="text-xs text-rose-600 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            id="checkout-phone"
            value={customer.phone}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            placeholder="+1 (555) 234-8901"
          />
          {errors.phone && (
            <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-stone-100">
        <Button type="submit" variant="primary" size="md">
          <span>Continue to Shipping</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </form>
  );
}

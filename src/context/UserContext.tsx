import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../lib/storage';
import { useNotification } from './NotificationContext';
import { generateId } from '../lib/utils';
import type { Address, UserProfile } from '../types';

interface UserContextType {
  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => Address;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  defaultAddress?: Address;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(storage.getProfile());
  const [addresses, setAddresses] = useState<Address[]>(storage.getAddresses());
  const [isInitialized, setIsInitialized] = useState(false);

  const { showToast } = useNotification();

  useEffect(() => {
    setProfile(storage.getProfile());
    setAddresses(storage.getAddresses());
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      storage.setProfile(profile);
    }
  }, [profile, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      storage.setAddresses(addresses);
    }
  }, [addresses, isInitialized]);

  const updateProfile = useCallback(
    (updated: Partial<UserProfile>) => {
      setProfile((prev) => {
        const next = { ...prev, ...updated };
        showToast({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your personal information was saved successfully.',
        });
        return next;
      });
    },
    [showToast]
  );

  const addAddress = useCallback(
    (newAddr: Omit<Address, 'id'>): Address => {
      const id = generateId('addr');
      const isFirst = addresses.length === 0;
      const created: Address = {
        ...newAddr,
        id,
        isDefault: newAddr.isDefault || isFirst,
      };

      setAddresses((prev) => {
        const updated = created.isDefault
          ? prev.map((a) => ({ ...a, isDefault: false }))
          : prev;
        return [...updated, created];
      });

      showToast({
        type: 'success',
        title: 'Address Added',
        message: 'New shipping address has been saved to your account.',
      });

      return created;
    },
    [addresses.length, showToast]
  );

  const updateAddress = useCallback(
    (id: string, updatedFields: Partial<Address>) => {
      setAddresses((prev) => {
        let list = prev.map((a) => (a.id === id ? { ...a, ...updatedFields } : a));
        if (updatedFields.isDefault) {
          list = list.map((a) => (a.id === id ? { ...a, isDefault: true } : { ...a, isDefault: false }));
        }
        return list;
      });
      showToast({
        type: 'success',
        title: 'Address Updated',
        message: 'Your shipping address changes were saved.',
      });
    },
    [showToast]
  );

  const deleteAddress = useCallback(
    (id: string) => {
      setAddresses((prev) => {
        const remaining = prev.filter((a) => a.id !== id);
        // If we deleted the default, set first remaining as default
        if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
          remaining[0].isDefault = true;
        }
        return remaining;
      });
      showToast({
        type: 'info',
        title: 'Address Removed',
        message: 'The shipping address was removed from your address book.',
      });
    },
    [showToast]
  );

  const setDefaultAddress = useCallback(
    (id: string) => {
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }))
      );
      showToast({
        type: 'success',
        title: 'Default Address Set',
        message: 'This address is now your primary delivery address.',
      });
    },
    [showToast]
  );

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  return (
    <UserContext.Provider
      value={{
        profile,
        updateProfile,
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        defaultAddress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

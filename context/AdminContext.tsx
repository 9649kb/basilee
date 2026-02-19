
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';

interface AdminContextType {
  isAdmin: boolean;
  currentAdmin: AdminUser | null;
  admins: AdminUser[];
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  logout: () => void;
  checkPin: (pin: string) => boolean;
  addAdmin: (name: string, email: string, pin: string, isSuper?: boolean) => void;
  removeAdmin: (id: string) => void;
  toggleSuperAdmin: (id: string) => void;
  updateAdminPin: (adminId: string, oldPin: string, newPin: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const DEFAULT_ADMIN: AdminUser = { 
  id: 'default', 
  name: 'Basile', 
  email: 'contact@basilekadjolo.com',
  pin: '1234', 
  isSuperAdmin: true 
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [admins, setAdmins] = useState<AdminUser[]>([DEFAULT_ADMIN]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    const savedAdmins = localStorage.getItem('basile_admins_list_v5');
    if (savedAdmins) {
      setAdmins(JSON.parse(savedAdmins));
    }

    const savedSessionId = localStorage.getItem('basile_admin_session_id');
    if (savedSessionId) {
      const allAdmins = savedAdmins ? JSON.parse(savedAdmins) : [DEFAULT_ADMIN];
      const found = allAdmins.find((a: AdminUser) => a.id === savedSessionId);
      if (found) {
        setIsAdmin(true);
        setCurrentAdmin(found);
      }
    }
  }, []);

  const saveAdmins = (updated: AdminUser[]) => {
    setAdmins(updated);
    localStorage.setItem('basile_admins_list_v5', JSON.stringify(updated));
  };

  const checkPin = (pin: string): boolean => {
    const found = admins.find(a => a.pin === pin);
    if (found) {
      setIsAdmin(true);
      setCurrentAdmin(found);
      localStorage.setItem('basile_admin_session_id', found.id);
      setIsLoginModalOpen(false);
      return true;
    }
    return false;
  };

  const addAdmin = (name: string, email: string, pin: string, isSuper: boolean = false) => {
    const newAdmin: AdminUser = {
      id: `admin-${Date.now()}`,
      name,
      email,
      pin,
      isSuperAdmin: isSuper
    };
    saveAdmins([...admins, newAdmin]);
  };

  const removeAdmin = (id: string) => {
    if (id === 'default') return;
    const updated = admins.filter(a => a.id !== id);
    saveAdmins(updated);
    if (currentAdmin?.id === id) logout();
  };

  const toggleSuperAdmin = (id: string) => {
    if (id === 'default') return;
    const updated = admins.map(a => 
      a.id === id ? { ...a, isSuperAdmin: !a.isSuperAdmin } : a
    );
    saveAdmins(updated);
    
    if (currentAdmin?.id === id) {
      const updatedSelf = updated.find(a => a.id === id);
      if (updatedSelf) setCurrentAdmin(updatedSelf);
    }
  };

  const updateAdminPin = (adminId: string, oldPin: string, newPin: string): boolean => {
    const target = admins.find(a => a.id === adminId);
    if (target && target.pin === oldPin) {
      const updated = admins.map(a => a.id === adminId ? { ...a, pin: newPin } : a);
      saveAdmins(updated);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setCurrentAdmin(null);
    localStorage.removeItem('basile_admin_session_id');
    setIsSettingsModalOpen(false);
  };

  return (
    <AdminContext.Provider value={{ 
      isAdmin, currentAdmin, admins, isLoginModalOpen, setIsLoginModalOpen, 
      isSettingsModalOpen, setIsSettingsModalOpen, logout, checkPin,
      addAdmin, removeAdmin, toggleSuperAdmin, updateAdminPin
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AdminAuthModal from '../auth/AdminAuthModal';
import ScrollToTopButton from '../common/ScrollToTopButton';

const MainLayout = ({ children }) => {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/backoffice');

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-slate-50 relative">
        <main className="flex-grow">{children}</main>
        <ScrollToTopButton onOpenAdminModal={() => setIsAdminModalOpen(true)} />
        <AdminAuthModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FEFEFE] relative">
      <Header />

      <main className="flex-grow">{children}</main>

      <Footer />

      <ScrollToTopButton onOpenAdminModal={() => setIsAdminModalOpen(true)} />

      <AdminAuthModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
};

export default MainLayout;

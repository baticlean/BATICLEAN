import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Toast from '../common/Toast';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, Key, Eye, EyeOff } from 'lucide-react';

const AdminAuthModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    adminRegistrationKey: '',
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      setToast({ type: 'success', message: 'Connexion administrateur réussie !' });
      setTimeout(() => {
        onClose();
        navigate('/backoffice/dashboard');
      }, 1000);
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Identifiants administrateur incorrects.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(registerForm);
      setToast({ type: 'success', message: 'Compte Administrateur créé avec succès !' });
      setTimeout(() => {
        onClose();
        navigate('/backoffice/dashboard');
      }, 1000);
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Erreur lors de la création du compte administrateur.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Portail Administrateur Sécurisé" maxWidth="max-w-md">
        <div className="space-y-6">
          <div className="flex items-center justify-center p-3 bg-[#EBF4FC] rounded-2xl border border-[#ADD1F3]">
            <ShieldCheck className="w-8 h-8 text-[#195D9B] mr-3" />
            <div>
              <p className="text-xs font-bold text-[#195D9B] uppercase tracking-wider">Accès Back-Office</p>
              <p className="text-xs text-slate-600">Espace réservé à l'équipe de direction Baticlean.</p>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'login' ? 'bg-white text-[#195D9B] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Se Connecter
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'register' ? 'bg-white text-[#195D9B] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Créer un Compte
            </button>
          </div>

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Administrateur</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    placeholder="admin@baticlean.com"
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mot de passe</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Afficher ou masquer le mot de passe"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="primary" className="w-full justify-center" isLoading={loading}>
                Connexion Administrateur
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    required
                    value={registerForm.firstName}
                    onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                    placeholder="Jean"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nom</label>
                  <input
                    type="text"
                    required
                    value={registerForm.lastName}
                    onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                    placeholder="Kouassi"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Officiel</label>
                <input
                  type="email"
                  required
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  placeholder="admin@baticlean.com"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mot de passe</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Afficher ou masquer le mot de passe"
                  >
                    {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 text-[#EF9437]">
                  Clé d'Inscription Admin Secrète
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-[#EF9437] absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={registerForm.adminRegistrationKey}
                    onChange={(e) => setRegisterForm({ ...registerForm, adminRegistrationKey: e.target.value })}
                    placeholder="Clé secrète d'administration"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-[#EF9437]/40 focus:outline-none focus:ring-2 focus:ring-[#EF9437]"
                  />
                </div>
              </div>

              <Button type="submit" variant="secondary" className="w-full justify-center mt-2" isLoading={loading}>
                Créer mon Compte Admin
              </Button>
            </form>
          )}
        </div>
      </Modal>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </>
  );
};

export default AdminAuthModal;

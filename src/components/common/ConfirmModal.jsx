import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Trash2, ShieldAlert } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmation requise',
  message = 'Êtes-vous sûr de vouloir effectuer cette action ? Cette opération ne peut pas être annulée.',
  confirmText = 'Confirmer la suppression',
  cancelText = 'Annuler',
  variant = 'danger',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <Modal isOpen={isOpen} onClose={onClose} showHeader={false} maxWidth="max-w-md">
      <div className="p-6 text-center space-y-5">
        
        {/* Badge d'Icône avec Effet de Halo */}
        <div
          className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-lg transition-transform animate-bounce-subtle ${
            isDanger
              ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-rose-500/10'
              : 'bg-amber-50 text-amber-600 border border-amber-200 shadow-amber-500/10'
          }`}
        >
          {isDanger ? <Trash2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
        </div>

        {/* Textes de Titre et Explications */}
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-1/2 justify-center border border-slate-200 hover:bg-slate-100 font-semibold"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            isLoading={isLoading}
            className={`w-full sm:w-1/2 justify-center font-bold text-white shadow-md transition-all ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
            }`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;

import React, { useState, useEffect, useRef } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { generateQuotePdfApi, uploadCustomQuotePdfApi, sendQuotePdfToClientApi } from '../../services/adminService';
import { FileText, Download, UploadCloud, Send, CheckCircle2, RefreshCw, Eye } from 'lucide-react';
import Toast from '../common/Toast';

const QuotePdfModal = ({ isOpen, onClose, quoteRequest, onSuccess }) => {
  const [pdfBase64, setPdfBase64] = useState(quoteRequest?.pdfBase64 || '');
  const [pdfStatus, setPdfStatus] = useState(quoteRequest?.pdfStatus || 'NONE');
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [customNotes, setCustomNotes] = useState('Nous vous remercions pour votre confiance. Veuillez trouver ci-joint votre devis officiel de remise en état.');
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const handleGeneratePdf = async () => {
    if (!quoteRequest?._id) return;
    setGenerating(true);
    try {
      const res = await generateQuotePdfApi(quoteRequest._id);
      const data = res?.data || res;
      if (data?.pdfBase64) {
        setPdfBase64(data.pdfBase64);
        setPdfStatus(data.pdfStatus || 'GENERATED');
        setToast({ type: 'success', message: 'Devis PDF généré avec succès aux normes BTP !' });
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Erreur lors de la génération du Devis PDF.' });
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (isOpen && quoteRequest) {
      if (quoteRequest.pdfBase64) {
        setPdfBase64(quoteRequest.pdfBase64);
        setPdfStatus(quoteRequest.pdfStatus || 'GENERATED');
      } else {
        handleGeneratePdf();
      }
    }
  }, [isOpen, quoteRequest]);

  const handleDownloadPdf = () => {
    if (!pdfBase64) return;
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${pdfBase64}`;
    link.download = `Devis_Baticlean_${quoteRequest?.reference || 'DEV'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast({ type: 'info', message: 'Devis téléchargé ! Vous pouvez le retoucher sur Canva ou Acrobat si besoin.' });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setToast({ type: 'error', message: 'Veuillez sélectionner un fichier au format PDF uniquement.' });
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Content = reader.result.split(',')[1] || reader.result;
        await uploadCustomQuotePdfApi(quoteRequest._id, base64Content);
        setPdfBase64(base64Content);
        setPdfStatus('CUSTOM_UPLOADED');
        setToast({ type: 'success', message: 'Devis personnalisé (Canva/Word) importé et prêt à l\'envoi !' });
      } catch (error) {
        setToast({ type: 'error', message: 'Erreur lors de l\'importation du PDF.' });
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendToClient = async (e) => {
    e.preventDefault();
    if (!quoteRequest?._id) return;

    setSending(true);
    try {
      await sendQuotePdfToClientApi(quoteRequest._id, customNotes);
      setToast({ type: 'success', message: `Devis PDF expédié avec succès par email à ${quoteRequest.email || quoteRequest.clientId?.email} !` });
      setPdfStatus('SENT');
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Échec de l\'envoi du devis au client.' });
    } finally {
      setSending(false);
    }
  };

  const pdfDataUrl = pdfBase64 ? `data:application/pdf;base64,${pdfBase64}` : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Devis Officiel PDF - ${quoteRequest?.reference || ''}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* En-tête statut et boutons d'actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm">
                Client : {quoteRequest?.firstName} {quoteRequest?.lastName} ({quoteRequest?.buildingType} - {quoteRequest?.estimatedSurface || 0} m²)
              </span>
              {pdfStatus === 'SENT' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Devis Envoyé
                </span>
              ) : pdfStatus === 'CUSTOM_UPLOADED' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#195D9B] bg-[#EBF4FC] px-2.5 py-0.5 rounded-full border border-[#ADD1F3]">
                  PDF Personnalisé (Canva/Word)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#EF9437] bg-[#FEF7EE] px-2.5 py-0.5 rounded-full border border-[#FDE6D2]">
                  PDF Généré Auto
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">Destinataire : <strong>{quoteRequest?.email || quoteRequest?.clientId?.email || 'Non renseigné'}</strong></p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={handleGeneratePdf}
              isLoading={generating}
              title="Régénérer le PDF automatique"
            >
              Régénérer
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={Download}
              onClick={handleDownloadPdf}
              disabled={!pdfBase64}
              title="Télécharger pour modifier dans Canva"
            >
              Télécharger
            </Button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-[#EBF4FC] text-[#195D9B] border border-[#ADD1F3] rounded-xl text-xs font-bold hover:bg-[#195D9B] hover:text-white transition-all flex items-center gap-1.5"
              title="Importer un PDF retouché (Canva, Word)"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{uploading ? 'Importation...' : 'Importer Retouche'}</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="application/pdf"
              className="hidden"
            />
          </div>
        </div>

        {/* Aperçu du PDF dans la modale */}
        <div className="w-full h-96 bg-slate-900 rounded-2xl overflow-hidden border border-slate-300 relative flex items-center justify-center">
          {generating ? (
            <div className="text-center space-y-2 text-white p-6">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#EF9437]" />
              <p className="font-bold text-sm">Génération du Devis PDF Norme BTP...</p>
            </div>
          ) : pdfDataUrl ? (
            <iframe
              src={pdfDataUrl}
              title="Aperçu Devis PDF Baticlean"
              className="w-full h-full border-0"
            />
          ) : (
            <p className="text-slate-400 text-xs">Aucun PDF disponible pour l'instant.</p>
          )}
        </div>

        {/* Formulaire d'envoi automatique direct par email (Brevo) */}
        <form onSubmit={handleSendToClient} className="space-y-4 pt-2 border-t border-slate-200">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Message d'accompagnement dans l'Email du Client (Optionnel)</label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Rédigez un mot d'accompagnement..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500">
              * L'email sera expédié automatiquement avec le fichier PDF joint.
            </span>

            <Button
              type="submit"
              variant="secondary"
              icon={Send}
              isLoading={sending}
              disabled={!pdfBase64}
              className="px-6 py-2.5 font-extrabold text-sm"
            >
              Envoyer Automatiquement au Client
            </Button>
          </div>
        </form>
      </div>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </Modal>
  );
};

export default QuotePdfModal;

import React, { useState, useEffect, useRef } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';
import QuotePdfModal from '../../components/devis/QuotePdfModal';
import { useAuth } from '../../context/AuthContext';
import { socket } from '../../api/socket';
import {
  getAdminDashboardStats,
  getAdminQuoteRequests,
  updateQuoteStatus,
  deleteAdminQuoteRequest,
  getAdminProjects,
  createAdminProject,
  toggleAdminProjectPublication,
  deleteAdminProject,
  getAdminPartners,
  createAdminPartner,
  updateAdminPartner,
  toggleAdminPartnerPublication,
  deleteAdminPartner,
  getAdminPartnerRequests,
  respondToAdminPartnerRequest,
  deleteAdminPartnerRequest,
  getHeroMediaSetting,
  updateHeroMediaSetting,
  getCompanySettingsApi,
  updateCompanySettingsApi,
} from '../../services/adminService';
import {
  getAdminFaqsApi,
  createFaqApi,
  updateFaqApi,
  toggleFaqPublicationApi,
  deleteFaqApi,
} from '../../services/faqService';
import {
  getAdminTestimonialsApi,
  createAdminTestimonialApi,
  updateTestimonialStatusApi,
  deleteTestimonialApi,
} from '../../services/testimonialService';
import { FileText, Calendar, Clock, LogOut, RefreshCw, Plus, Trash2, Eye, EyeOff, HardHat, Handshake, CheckCircle2, XCircle, Image as ImageIcon, Video, Layers, Save, UploadCloud, Phone, Mail, MapPin, Building, Globe, Send, FileCheck, HelpCircle, Edit, Star, MessageSquare } from 'lucide-react';
import Toast from '../../components/common/Toast';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ totalQuotes: 0, pendingQuotes: 0, totalAppointments: 0, activeProjects: 0, totalPartners: 0 });
  const [quotes, setQuotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [partners, setPartners] = useState([]);
  const [partnerRequests, setPartnerRequests] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // État de la modale de confirmation personnalisée
  const [confirmModalState, setConfirmModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    isLoading: false,
  });

  const triggerConfirmModal = ({ title, message, onConfirm }) => {
    setConfirmModalState({
      isOpen: true,
      title,
      message,
      onConfirm: async () => {
        setConfirmModalState((prev) => ({ ...prev, isLoading: true }));
        try {
          await onConfirm();
        } finally {
          setConfirmModalState({ isOpen: false, title: '', message: '', onConfirm: null, isLoading: false });
        }
      },
      isLoading: false,
    });
  };

  const heroFileInputRef = useRef(null);
  const [heroMedia, setHeroMedia] = useState({
    mediaType: 'IMAGE',
    mediaUrl: '/logo.png',
    videoUrl: '',
    carouselImages: ['/logo.png'],
  });
  const [newCarouselUrl, setNewCarouselUrl] = useState('');
  const [savingHeroMedia, setSavingHeroMedia] = useState(false);

  const [companySettings, setCompanySettings] = useState({
    companyName: "Baticlean Côte d'Ivoire",
    officialPhone: '+225 07 68 38 87 79',
    phoneSecondary: '+225 01 02 03 04 05',
    officialWhatsapp: '+2250768388779',
    officialEmail: 'contact@baticlean.ci',
    emailDevis: 'devis@baticlean.ci',
    officialAddress: "Abidjan, Côte d'Ivoire - Cocody Angré 8ème Tranche",
    openingHoursWeek: 'Lundi - Samedi : 07h30 - 18h30',
    openingHoursWeekend: 'Dimanche : Sur rendez-vous uniquement',
    googleMapsUrl: '',
  });
  const [savingCompanySettings, setSavingCompanySettings] = useState(false);

  const [selectedQuoteForPdf, setSelectedQuoteForPdf] = useState(null);

  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isAddPartnerModalOpen, setIsAddPartnerModalOpen] = useState(false);
  const [selectedPartnerForEdit, setSelectedPartnerForEdit] = useState(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);

  const [selectedFaqForEdit, setSelectedFaqForEdit] = useState(null);
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    category: 'Prestations BTP',
    isPublished: true,
  });

  const [adminTestimonialForm, setAdminTestimonialForm] = useState({
    authorName: '',
    company: '',
    role: 'Promoteur / Client',
    rating: 5,
    title: '',
    comment: '',
    buildingType: 'Résidentiel',
    city: 'Abidjan',
    logoUrl: '',
  });

  const [selectedRequestForDecision, setSelectedRequestForDecision] = useState(null);
  const [decisionType, setDecisionType] = useState('ACCEPTED');
  const [responseNotes, setResponseNotes] = useState('');
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);

  const [newProject, setNewProject] = useState({
    name: '',
    buildingType: 'Résidentiel',
    city: 'Abidjan',
    commune: 'Cocody',
    surface: '',
    description: '',
    beforeImage: '',
    afterImage: '',
    isPublishedPublic: true,
  });

  const [newPartner, setNewPartner] = useState({
    name: '',
    category: 'Promoteur Immobilier',
    description: '',
    logoUrl: '',
    websiteUrl: '',
    contactPhone: '',
    contactEmail: '',
    isPublished: true,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const statsRes = await getAdminDashboardStats();
      const statsData = statsRes?.data || statsRes || {};
      setStats(statsData);

      const quotesRes = await getAdminQuoteRequests();
      const quotesData = quotesRes?.data || quotesRes || {};
      const loadedQuotes = Array.isArray(quotesData) 
        ? quotesData 
        : (quotesData.requests || quotesData.quoteRequests || statsData.recentRequests || []);
      setQuotes(loadedQuotes);

      const projectsRes = await getAdminProjects();
      const projectsData = projectsRes?.data || projectsRes || [];
      setProjects(Array.isArray(projectsData) ? projectsData : []);

      const partnersRes = await getAdminPartners();
      const partnersData = partnersRes?.data || partnersRes || [];
      setPartners(Array.isArray(partnersData) ? partnersData : []);

      const pReqRes = await getAdminPartnerRequests();
      const pReqData = pReqRes?.data || pReqRes || [];
      setPartnerRequests(Array.isArray(pReqData) ? pReqData : []);

      const faqsRes = await getAdminFaqsApi();
      const faqsData = faqsRes?.data || faqsRes || [];
      setFaqs(Array.isArray(faqsData) ? faqsData : []);

      const testRes = await getAdminTestimonialsApi();
      const testData = testRes?.data || testRes || [];
      setTestimonials(Array.isArray(testData) ? testData : []);

      const heroRes = await getHeroMediaSetting();
      const heroData = heroRes?.data || heroRes;
      if (heroData && heroData.mediaType) setHeroMedia(heroData);

      const settingsRes = await getCompanySettingsApi();
      const settingsData = settingsRes?.data || settingsRes;
      if (settingsData && settingsData.officialPhone) {
        setCompanySettings(settingsData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données d\'administration :', error);
      setToast({ type: 'error', message: 'Erreur lors du chargement des données d\'administration.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    socket.on('quote_request_created', (data) => {
      setToast({ type: 'info', message: `Nouvelle demande de devis reçue ! (${data.reference})` });
      fetchData();
    });

    socket.on('appointment_created', (data) => {
      setToast({ type: 'info', message: `Nouvelle réservation de visite enregistrée ! (${data.reference})` });
      fetchData();
    });

    socket.on('partner_request_created', (data) => {
      setToast({ type: 'info', message: `Nouvelle demande de partenariat de ${data.companyName} !` });
      fetchData();
    });

    socket.on('testimonial_created', (data) => {
      setToast({ type: 'info', message: `Nouvel avis client déposé par ${data.authorName} en attente de modération !` });
      fetchData();
    });

    socket.on('data_updated', () => {
      fetchData();
    });

    return () => {
      socket.off('quote_request_created');
      socket.off('appointment_created');
      socket.off('partner_request_created');
      socket.off('testimonial_created');
      socket.off('data_updated');
    };
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateQuoteStatus(id, newStatus);
      setToast({ type: 'success', message: 'Statut du dossier mis à jour avec succès.' });
      fetchData();
    } catch (error) {
      setToast({ type: 'error', message: 'Échec de mise à jour du statut.' });
    }
  };

  const handleDeleteQuoteRequest = (id) => {
    triggerConfirmModal({
      title: 'Supprimer la demande de devis ?',
      message: 'Voulez-vous vraiment supprimer cette demande de devis ? Cette action est irréversible.',
      onConfirm: async () => {
        try {
          await deleteAdminQuoteRequest(id);
          setToast({ type: 'success', message: 'Demande de devis supprimée.' });
          fetchData();
        } catch (error) {
          setToast({ type: 'error', message: 'Erreur de suppression de la demande de devis.' });
        }
      },
    });
  };

  const handleDeletePartnerRequest = (id) => {
    triggerConfirmModal({
      title: 'Supprimer la demande de partenariat ?',
      message: 'Voulez-vous vraiment supprimer cette demande de partenariat reçue ?',
      onConfirm: async () => {
        try {
          await deleteAdminPartnerRequest(id);
          setToast({ type: 'success', message: 'Demande de partenariat supprimée.' });
          fetchData();
        } catch (error) {
          setToast({ type: 'error', message: 'Erreur de suppression.' });
        }
      },
    });
  };

  const handleOpenCreatePartnerModal = () => {
    setSelectedPartnerForEdit(null);
    setNewPartner({
      name: '',
      category: 'Promoteur Immobilier',
      description: '',
      logoUrl: '',
      websiteUrl: '',
      contactPhone: '',
      contactEmail: '',
      isPublished: true,
    });
    setIsAddPartnerModalOpen(true);
  };

  const handleOpenEditPartnerModal = (partner) => {
    setSelectedPartnerForEdit(partner);
    setNewPartner({
      name: partner.name || '',
      category: partner.category || 'Promoteur Immobilier',
      description: partner.description || '',
      logoUrl: partner.logoUrl || '',
      websiteUrl: partner.websiteUrl || '',
      contactPhone: partner.contactPhone || '',
      contactEmail: partner.contactEmail || '',
      isPublished: partner.isPublished !== false,
    });
    setIsAddPartnerModalOpen(true);
  };

  const handleCreatePartnerSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPartnerForEdit) {
        await updateAdminPartner(selectedPartnerForEdit._id, newPartner);
        setToast({ type: 'success', message: 'Partenaire mis à jour avec succès !' });
      } else {
        await createAdminPartner(newPartner);
        setToast({ type: 'success', message: 'Partenaire ajouté et publié avec succès !' });
      }
      setIsAddPartnerModalOpen(false);
      fetchData();
    } catch (error) {
      setToast({ type: 'error', message: 'Erreur lors de l\'enregistrement du partenaire.' });
    }
  };

  const handleApproveTestimonial = async (id) => {
    try {
      await updateTestimonialStatusApi(id, 'APPROVED');
      setToast({ type: 'success', message: 'Avis client approuvé et publié sur le site public !' });
      fetchData();
    } catch (error) {
      setToast({ type: 'error', message: 'Échec de l\'approbation.' });
    }
  };

  const handleRejectTestimonial = async (id) => {
    try {
      await updateTestimonialStatusApi(id, 'REJECTED');
      setToast({ type: 'info', message: 'Avis client rejeté.' });
      fetchData();
    } catch (error) {
      setToast({ type: 'error', message: 'Échec du rejet.' });
    }
  };

  const handleDeleteTestimonial = (id) => {
    triggerConfirmModal({
      title: 'Supprimer cet avis client ?',
      message: 'Voulez-vous vraiment supprimer définitivement cet avis client ?',
      onConfirm: async () => {
        try {
          await deleteTestimonialApi(id);
          setToast({ type: 'success', message: 'Avis supprimé.' });
          fetchData();
        } catch (error) {
          setToast({ type: 'error', message: 'Erreur de suppression.' });
        }
      },
    });
  };

  const handleCreateAdminTestimonialSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAdminTestimonialApi(adminTestimonialForm);
      setToast({ type: 'success', message: 'Témoignage officiel publié directement sur le site !' });
      setIsTestimonialModalOpen(false);
      setAdminTestimonialForm({
        authorName: '',
        company: '',
        role: 'Promoteur / Client',
        rating: 5,
        title: '',
        comment: '',
        buildingType: 'Résidentiel',
        city: 'Abidjan',
        logoUrl: '',
      });
      fetchData();
    } catch (error) {
      setToast({ type: 'error', message: 'Erreur lors de l\'enregistrement du témoignage.' });
    }
  };

  const handleOpenCreateFaqModal = () => {
    setSelectedFaqForEdit(null);
    setFaqForm({
      question: '',
      answer: '',
      category: 'Prestations BTP',
      isPublished: true,
    });
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaqModal = (faq) => {
    setSelectedFaqForEdit(faq);
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'Prestations BTP',
      isPublished: faq.isPublished !== false,
    });
    setIsFaqModalOpen(true);
  };

  const handleSaveFaqSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedFaqForEdit) {
        await updateFaqApi(selectedFaqForEdit._id, faqForm);
        setToast({ type: 'success', message: 'Question FAQ mise à jour avec succès !' });
      } else {
        await createFaqApi(faqForm);
        setToast({ type: 'success', message: 'Nouvelle question FAQ ajoutée avec succès !' });
      }
      setIsFaqModalOpen(false);
      fetchData();
    } catch (error) {
      setToast({ type: 'error', message: 'Erreur lors de l\'enregistrement de la FAQ.' });
    }
  };

  const handleToggleFaqPublication = async (id) => {
    try {
      await toggleFaqPublicationApi(id);
      setToast({ type: 'success', message: 'Statut de publication de la FAQ modifié.' });
      fetchData();
    } catch (error) {
      setToast({ type: 'error', message: 'Échec de la modification.' });
    }
  };

  const handleDeleteFaq = (id) => {
    triggerConfirmModal({
      title: 'Supprimer cette question FAQ ?',
      message: 'Voulez-vous vraiment supprimer cette question/réponse de la FAQ ?',
      onConfirm: async () => {
        try {
          await deleteFaqApi(id);
          setToast({ type: 'success', message: 'Question FAQ supprimée.' });
          fetchData();
        } catch (error) {
          setToast({ type: 'error', message: 'Erreur de suppression.' });
        }
      },
    });
  };

  const handleSaveHeroMedia = async () => {
    setSavingHeroMedia(true);
    try {
      await updateHeroMediaSetting(heroMedia);
      setToast({ type: 'success', message: "Média Hero d'accueil mis à jour avec succès !" });
    } catch (error) {
      setToast({ type: 'error', message: 'Erreur lors de la sauvegarde du Média Hero.' });
    } finally {
      setSavingHeroMedia(false);
    }
  };

  const handleSaveCompanySettings = async () => {
    setSavingCompanySettings(true);
    try {
      await updateCompanySettingsApi(companySettings);
      setToast({ type: 'success', message: 'Coordonnées & Horaires de Baticlean mis à jour avec succès !' });
    } catch (error) {
      setToast({ type: 'error', message: 'Erreur lors de la mise à jour des coordonnées.' });
    } finally {
      setSavingCompanySettings(false);
    }
  };

  const handleHeroFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroMedia((prev) => ({
          ...prev,
          mediaUrl: reader.result,
        }));
        setToast({ type: 'success', message: 'Fichier image chargé ! Cliquez sur "Enregistrer les Modifs Média" pour publier.' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCarouselImage = () => {
    if (!newCarouselUrl.trim()) return;
    setHeroMedia({
      ...heroMedia,
      carouselImages: [...heroMedia.carouselImages, newCarouselUrl.trim()],
    });
    setNewCarouselUrl('');
  };

  const handleRemoveCarouselImage = (index) => {
    const updated = heroMedia.carouselImages.filter((_, idx) => idx !== index);
    setHeroMedia({
      ...heroMedia,
      carouselImages: updated.length > 0 ? updated : ['/logo.png'],
    });
  };

  const handleCreateProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAdminProject(newProject);
      setToast({ type: 'success', message: 'Réalisation ajoutée et publiée avec succès !' });
      setIsAddProjectModalOpen(false);
      setNewProject({
        name: '',
        buildingType: 'Résidentiel',
        city: 'Abidjan',
        commune: 'Cocody',
        surface: '',
        description: '',
        beforeImage: '',
        afterImage: '',
        isPublishedPublic: true,
      });
      fetchData();
    } catch (error) {
      setToast({ type: 'error', message: 'Erreur lors de la création de la réalisation.' });
    }
  };

  const handleOpenDecisionModal = (req, type) => {
    setSelectedRequestForDecision(req);
    setDecisionType(type);
    setResponseNotes(type === 'ACCEPTED' ? 'Nous sommes ravis de faire équipe avec votre structure. Notre responsable prendra contact avec vous.' : 'Nous ne pouvons pas donner une suite favorable à votre demande actuellement.');
  };

  const handleSendDecisionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequestForDecision) return;
    setIsSubmittingDecision(true);
    try {
      await respondToAdminPartnerRequest(selectedRequestForDecision._id, decisionType, responseNotes);
      setToast({
        type: 'success',
        message: decisionType === 'ACCEPTED' ? 'Demande acceptée ! Un email de confirmation a été envoyé.' : 'Demande refusée. Un email d\'information a été envoyé.',
      });
      setSelectedRequestForDecision(null);
      fetchData();
    } catch (error) {
      setToast({ type: 'error', message: 'Échec du traitement de la demande.' });
    } finally {
      setIsSubmittingDecision(false);
    }
  };

  const handleToggleProjectPublication = async (id) => {
    try {
      await toggleAdminProjectPublication(id);
      setToast({ type: 'success', message: 'Statut de publication du chantier modifié.' });
      fetchData();
    } catch (error) {
      setToast({ type: 'error', message: 'Échec de la modification.' });
    }
  };

  const handleDeleteProject = (id) => {
    triggerConfirmModal({
      title: 'Supprimer ce chantier livré ?',
      message: 'Voulez-vous vraiment supprimer cette réalisation du portfolio public Baticlean ?',
      onConfirm: async () => {
        try {
          await deleteAdminProject(id);
          setToast({ type: 'success', message: 'Réalisation supprimée.' });
          fetchData();
        } catch (error) {
          setToast({ type: 'error', message: 'Erreur de suppression.' });
        }
      },
    });
  };

  const handleTogglePartnerPublication = async (id) => {
    try {
      await toggleAdminPartnerPublication(id);
      setToast({ type: 'success', message: 'Statut de publication du partenaire modifié.' });
      fetchData();
    } catch (error) {
      setToast({ type: 'error', message: 'Échec de la modification.' });
    }
  };

  const handleDeletePartner = (id) => {
    triggerConfirmModal({
      title: 'Supprimer ce partenaire ?',
      message: 'Voulez-vous vraiment supprimer ce partenaire du réseau Baticlean ? Cette action retirera également sa fiche de la page partenaires.',
      onConfirm: async () => {
        try {
          await deleteAdminPartner(id);
          setToast({ type: 'success', message: 'Partenaire supprimé.' });
          fetchData();
        } catch (error) {
          setToast({ type: 'error', message: 'Erreur de suppression.' });
        }
      },
    });
  };

  const pendingTestimonialsCount = testimonials.filter(t => t.status === 'PENDING').length;

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#195D9B] text-white flex items-center justify-center font-bold text-lg">
              {user?.firstName?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Bonjour, {user?.firstName} {user?.lastName}
                </h1>
                <Badge variant="secondary">Admin Baticlean</Badge>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Temps Réel Actif
                </span>
              </div>
              <p className="text-xs text-slate-500">Tableau de bord de suivi opérationnel des chantiers.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" icon={RefreshCw} onClick={fetchData} isLoading={loading}>
              Actualiser
            </Button>
            <Button variant="ghost" size="sm" icon={LogOut} onClick={logout} className="text-rose-600 hover:bg-rose-50">
              Déconnexion
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Demandes de Devis</span>
              <FileText className="w-5 h-5 text-[#195D9B]" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">
              {stats.totalQuotes ?? stats.quoteRequests?.total ?? quotes.length ?? 0}
            </p>
            <p className="text-xs text-emerald-600 font-semibold">Dossiers enregistrés</p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avis Clients à Modérer</span>
              <Star className="w-5 h-5 text-[#EF9437] fill-[#EF9437]" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{pendingTestimonialsCount}</p>
            <p className="text-xs text-[#EF9437] font-semibold">{testimonials.length} avis au total</p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Demandes Partenariat</span>
              <Handshake className="w-5 h-5 text-[#EF9437]" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{partnerRequests.length}</p>
            <p className="text-xs text-[#EF9437] font-semibold">Demandes reçues</p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Partenaires Enregistrés</span>
              <Handshake className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">
              {partners.length || stats.totalPartners || 0}
            </p>
            <p className="text-xs text-emerald-600 font-semibold">Partenaires du réseau</p>
          </Card>
        </div>

        {/* Section 3: Gestion des Partenaires */}
        <Card className="p-6 space-y-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Gestion des Partenaires du Réseau</h2>
              <p className="text-xs text-slate-500">Ajoutez, modifiez et gérez les entreprises partenaires affichées sur le site.</p>
            </div>
            <Button variant="secondary" size="sm" icon={Plus} onClick={handleOpenCreatePartnerModal}>
              Ajouter un Partenaire
            </Button>
          </div>

          <div className="overflow-x-auto max-h-80 overflow-y-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-3">Partenaire</th>
                  <th className="p-3">Catégorie</th>
                  <th className="p-3">Contacts</th>
                  <th className="p-3">Site Web</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {partners.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      Aucun partenaire enregistré. Cliquez sur "Ajouter un Partenaire" pour créer votre premier partenariat.
                    </td>
                  </tr>
                ) : (
                  partners.map((partner) => (
                    <tr key={partner._id} className="hover:bg-slate-50/60">
                      <td className="p-3 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          {partner.logoUrl ? (
                            <img src={partner.logoUrl} alt={partner.name} className="w-7 h-7 object-contain rounded bg-slate-100 p-0.5 border" />
                          ) : (
                            <div className="w-7 h-7 rounded bg-[#EBF4FC] text-[#195D9B] font-bold flex items-center justify-center text-xs">
                              {partner.name.charAt(0)}
                            </div>
                          )}
                          <span>{partner.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-700">{partner.category}</td>
                      <td className="p-3 text-slate-600">
                        {partner.contactPhone && <p className="font-semibold">{partner.contactPhone}</p>}
                        {partner.contactEmail && <p className="text-[11px] text-slate-500">{partner.contactEmail}</p>}
                      </td>
                      <td className="p-3 text-slate-600">{partner.websiteUrl || '-'}</td>
                      <td className="p-3">
                        {partner.isPublished ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
                            <Eye className="w-3.5 h-3.5" /> En Ligne
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-lg">
                            <EyeOff className="w-3.5 h-3.5" /> Masqué
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditPartnerModal(partner)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Modifier le partenaire"
                          >
                            <Edit className="w-4 h-4 text-[#195D9B]" />
                          </button>
                          <button
                            onClick={() => handleTogglePartnerPublication(partner._id)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                            title={partner.isPublished ? 'Masquer du site' : 'Publier sur le site'}
                          >
                            {partner.isPublished ? <EyeOff className="w-4 h-4 text-slate-600" /> : <Eye className="w-4 h-4 text-[#195D9B]" />}
                          </button>
                          <button
                            onClick={() => handleDeletePartner(partner._id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Section TESTIMONIALS: Modération des Avis & Témoignages Clients BTP */}
        <Card className="p-6 space-y-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Gestion & Modération des Avis Clients BTP</h2>
                {pendingTestimonialsCount > 0 && (
                  <span className="px-2.5 py-0.5 bg-[#EF9437] text-white text-[11px] font-extrabold rounded-full animate-bounce">
                    {pendingTestimonialsCount} À Valider
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">Approuvez les avis réels déposés par vos clients ou ajoutez un témoignage officiel d'un promoteur.</p>
            </div>
            <Button variant="secondary" size="sm" icon={Plus} onClick={() => setIsTestimonialModalOpen(true)}>
              Ajouter Témoignage Officiel
            </Button>
          </div>

          <div className="overflow-x-auto max-h-80 overflow-y-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-3">Client / Auteur</th>
                  <th className="p-3">Note</th>
                  <th className="p-3">Avis / Remarque</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3 text-right">Actions de Modération</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {testimonials.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      Aucun avis déposé pour l'instant (0 mock data). Dès qu'un client dépose un avis sur le site public, il s'affichera ici pour validation.
                    </td>
                  </tr>
                ) : (
                  testimonials.map((t) => (
                    <tr key={t._id} className="hover:bg-slate-50/60">
                      <td className="p-3">
                        <p className="font-bold text-slate-900">{t.authorName}</p>
                        <p className="text-[11px] text-[#195D9B]">{t.company || t.role || 'Client Baticlean'}</p>
                        <p className="text-[10px] text-slate-500">{t.buildingType} ({t.city})</p>
                      </td>
                      <td className="p-3 font-bold text-[#EF9437]">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-[#EF9437]" />
                          <span>{t.rating} / 5</span>
                        </div>
                      </td>
                      <td className="p-3 max-w-sm">
                        {t.title && <p className="font-bold text-slate-900 text-[11px]">{t.title}</p>}
                        <p className="text-slate-600 line-clamp-2 text-[11px] italic">"{t.comment}"</p>
                      </td>
                      <td className="p-3">
                        {t.status === 'APPROVED' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approuvé (En Ligne)
                          </span>
                        ) : t.status === 'REJECTED' ? (
                          <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-lg">
                            <XCircle className="w-3.5 h-3.5" /> Rejeté
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#EF9437] font-bold bg-[#FEF7EE] px-2.5 py-1 rounded-lg">
                            <Clock className="w-3.5 h-3.5" /> En Attente
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {t.status !== 'APPROVED' && (
                            <button
                              onClick={() => handleApproveTestimonial(t._id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                              title="Approuver pour affichage sur le site public"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Approuver
                            </button>
                          )}
                          {t.status !== 'REJECTED' && (
                            <button
                              onClick={() => handleRejectTestimonial(t._id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 transition-colors flex items-center gap-1"
                              title="Rejeter l'avis"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Rejeter
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteTestimonial(t._id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Supprimer définitivement"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Section 0: Éditeur des Coordonnées & Horaires de la Société */}
        <Card className="p-6 space-y-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Éditeur des Coordonnées & Horaires de Baticlean</h2>
              <p className="text-xs text-slate-500">Modifiez les téléphones, emails, adresse et horaires d'ouverture affichés sur tout le site.</p>
            </div>
            <Button variant="secondary" size="sm" icon={Save} onClick={handleSaveCompanySettings} isLoading={savingCompanySettings}>
              Enregistrer les Coordonnées
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#195D9B]" /> Téléphone Principal
              </label>
              <input
                type="text"
                value={companySettings.officialPhone}
                onChange={(e) => setCompanySettings({ ...companySettings, officialPhone: e.target.value })}
                placeholder="+225 07 68 38 87 79"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" /> Téléphone Secondaire / Support
              </label>
              <input
                type="text"
                value={companySettings.phoneSecondary}
                onChange={(e) => setCompanySettings({ ...companySettings, phoneSecondary: e.target.value })}
                placeholder="+225 01 02 03 04 05"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> Numéro WhatsApp Direct
              </label>
              <input
                type="text"
                value={companySettings.officialWhatsapp}
                onChange={(e) => setCompanySettings({ ...companySettings, officialWhatsapp: e.target.value })}
                placeholder="+2250768388779"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#195D9B]" /> Email Général de Contact
              </label>
              <input
                type="email"
                value={companySettings.officialEmail}
                onChange={(e) => setCompanySettings({ ...companySettings, officialEmail: e.target.value })}
                placeholder="contact@baticlean.ci"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#EF9437]" /> Email pour les Devis & Propositions
              </label>
              <input
                type="email"
                value={companySettings.emailDevis}
                onChange={(e) => setCompanySettings({ ...companySettings, emailDevis: e.target.value })}
                placeholder="devis@baticlean.ci"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#EF9437]" /> Adresse du Siège / Zone
              </label>
              <input
                type="text"
                value={companySettings.officialAddress}
                onChange={(e) => setCompanySettings({ ...companySettings, officialAddress: e.target.value })}
                placeholder="Abidjan, Côte d'Ivoire - Cocody Angré"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#195D9B]" /> Horaires Semaine (Lun - Sam)
              </label>
              <input
                type="text"
                value={companySettings.openingHoursWeek}
                onChange={(e) => setCompanySettings({ ...companySettings, openingHoursWeek: e.target.value })}
                placeholder="Lundi - Samedi : 07h30 - 18h30"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#EF9437]" /> Horaires Dimanche / Jours fériés
              </label>
              <input
                type="text"
                value={companySettings.openingHoursWeekend}
                onChange={(e) => setCompanySettings({ ...companySettings, openingHoursWeekend: e.target.value })}
                placeholder="Dimanche : Sur rendez-vous uniquement"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" /> Lien Google Maps (Optionnel)
              </label>
              <input
                type="text"
                value={companySettings.googleMapsUrl}
                onChange={(e) => setCompanySettings({ ...companySettings, googleMapsUrl: e.target.value })}
                placeholder="https://maps.google.com/..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>
          </div>
        </Card>

        {/* Section FAQ: Gestion de la Foire Aux Questions */}
        <Card className="p-6 space-y-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Éditeur de la Foire Aux Questions (FAQ)</h2>
              <p className="text-xs text-slate-500">Ajoutez, modifiez ou masquez les questions/réponses affichées sur le site public.</p>
            </div>
            <Button variant="secondary" size="sm" icon={Plus} onClick={handleOpenCreateFaqModal}>
              Ajouter une FAQ
            </Button>
          </div>

          <div className="overflow-x-auto max-h-80 overflow-y-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-3">Question & Réponse</th>
                  <th className="p-3">Catégorie</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {faqs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      Aucune question FAQ enregistrée. Cliquez sur "Ajouter une FAQ" pour commencer.
                    </td>
                  </tr>
                ) : (
                  faqs.map((faq) => (
                    <tr key={faq._id} className="hover:bg-slate-50/60">
                      <td className="p-3 max-w-md">
                        <p className="font-bold text-slate-900 flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-[#195D9B] flex-shrink-0" />
                          <span>{faq.question}</span>
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{faq.answer}</p>
                      </td>
                      <td className="p-3 text-slate-700">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#EBF4FC] text-[#195D9B]">
                          {faq.category}
                        </span>
                      </td>
                      <td className="p-3">
                        {faq.isPublished ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
                            <Eye className="w-3.5 h-3.5" /> En Ligne
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-lg">
                            <EyeOff className="w-3.5 h-3.5" /> Masquée
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditFaqModal(faq)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Modifier la FAQ"
                          >
                            <Edit className="w-4 h-4 text-[#195D9B]" />
                          </button>
                          <button
                            onClick={() => handleToggleFaqPublication(faq._id)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                            title={faq.isPublished ? 'Masquer du site' : 'Publier sur le site'}
                          >
                            {faq.isPublished ? <EyeOff className="w-4 h-4 text-slate-600" /> : <Eye className="w-4 h-4 text-[#195D9B]" />}
                          </button>
                          <button
                            onClick={() => handleDeleteFaq(faq._id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Supprimer la FAQ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Section Média Hero (Zone Droite de la Page d'Accueil) */}
        <Card className="p-6 space-y-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Éditeur du Média Hero (Zone Droite d'Accueil)</h2>
              <p className="text-xs text-slate-500">Choisissez ce qui s'affiche à droite du texte principal : Image, Vidéo ou Carrousel d'images.</p>
            </div>
            <Button variant="secondary" size="sm" icon={Save} onClick={handleSaveHeroMedia} isLoading={savingHeroMedia}>
              Enregistrer les Modifs Média
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setHeroMedia({ ...heroMedia, mediaType: 'IMAGE' })}
              className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${heroMedia.mediaType === 'IMAGE' ? 'border-[#195D9B] bg-white shadow-sm text-[#195D9B]' : 'border-slate-200 bg-white/60 text-slate-600 hover:border-slate-300'}`}
            >
              <ImageIcon className="w-5 h-5" />
              <div className="text-left">
                <p className="font-bold text-xs">Image Unique</p>
                <p className="text-[11px] text-slate-500">Téléverser ou coller une URL</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setHeroMedia({ ...heroMedia, mediaType: 'VIDEO' })}
              className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${heroMedia.mediaType === 'VIDEO' ? 'border-[#195D9B] bg-white shadow-sm text-[#195D9B]' : 'border-slate-200 bg-white/60 text-slate-600 hover:border-slate-300'}`}
            >
              <Video className="w-5 h-5" />
              <div className="text-left">
                <p className="font-bold text-xs">Vidéo d'Intervention</p>
                <p className="text-[11px] text-slate-500">Lien MP4 ou YouTube</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setHeroMedia({ ...heroMedia, mediaType: 'CAROUSEL' })}
              className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${heroMedia.mediaType === 'CAROUSEL' ? 'border-[#195D9B] bg-white shadow-sm text-[#195D9B]' : 'border-slate-200 bg-white/60 text-slate-600 hover:border-slate-300'}`}
            >
              <Layers className="w-5 h-5" />
              <div className="text-left">
                <p className="font-bold text-xs">Carrousel d'Images</p>
                <p className="text-[11px] text-slate-500">Défilement automatique</p>
              </div>
            </button>
          </div>

          <input
            type="file"
            ref={heroFileInputRef}
            onChange={handleHeroFileUpload}
            accept="image/*"
            className="hidden"
          />

          {heroMedia.mediaType === 'IMAGE' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
                <div className="flex-grow space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">URL ou Fichier de l'Image Unique</label>
                  <input
                    type="text"
                    value={heroMedia.mediaUrl}
                    onChange={(e) => setHeroMedia({ ...heroMedia, mediaUrl: e.target.value })}
                    placeholder="https://.../mon-image.png ou /logo.png"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => heroFileInputRef.current?.click()}
                  className="px-4 py-2 bg-[#EBF4FC] text-[#195D9B] border border-[#ADD1F3] rounded-xl text-xs font-bold hover:bg-[#195D9B] hover:text-white transition-all flex items-center justify-center gap-2 h-10"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Choisir un fichier image</span>
                </button>
              </div>

              {heroMedia.mediaUrl && (
                <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 space-y-2">
                  <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Aperçu en direct :</p>
                  <div className="h-48 w-full max-w-sm mx-auto bg-white rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
                    <img
                      src={heroMedia.mediaUrl}
                      alt="Aperçu Hero"
                      onError={(e) => { e.currentTarget.src = '/logo.png'; }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {heroMedia.mediaType === 'VIDEO' && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">URL de la Vidéo (Lien direct .mp4 ou YouTube)</label>
              <input
                type="text"
                value={heroMedia.videoUrl}
                onChange={(e) => setHeroMedia({ ...heroMedia, videoUrl: e.target.value })}
                placeholder="https://.../video.mp4 ou https://www.youtube.com/watch?v=..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>
          )}

          {heroMedia.mediaType === 'CAROUSEL' && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-slate-700">Images du Carrousel Droit</label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCarouselUrl}
                  onChange={(e) => setNewCarouselUrl(e.target.value)}
                  placeholder="URL de l'image (https://...)"
                  className="flex-grow px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
                />
                <Button type="button" variant="secondary" size="sm" icon={Plus} onClick={handleAddCarouselImage}>
                  Ajouter
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {heroMedia.carouselImages?.map((url, index) => (
                  <div key={index} className="relative bg-slate-100 p-2 rounded-xl border border-slate-200 text-center space-y-2 group">
                    <img src={url} alt={`Aperçu ${index + 1}`} className="h-20 w-full object-cover bg-white rounded-lg border border-slate-100" />
                    <button
                      type="button"
                      onClick={() => handleRemoveCarouselImage(index)}
                      className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <p className="text-[10px] text-slate-500 truncate">{url}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Section 1: Demandes de Partenariat Reçues */}
        <Card className="p-6 space-y-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Demandes de Partenariat Reçues</h2>
              <p className="text-xs text-slate-500">Traitez, répondez par email ou supprimez les demandes obsolètes.</p>
            </div>
            <Badge variant="primary">{partnerRequests.filter(r => r.status === 'PENDING').length} en attente</Badge>
          </div>

          <div className="overflow-x-auto max-h-80 overflow-y-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-3">Référence</th>
                  <th className="p-3">Société & Contact</th>
                  <th className="p-3">Secteur</th>
                  <th className="p-3">Message / Synergie</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3 text-right">Décision & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {partnerRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      Aucune demande de partenariat enregistrée pour le moment.
                    </td>
                  </tr>
                ) : (
                  partnerRequests.map((r) => (
                    <tr key={r._id || r.reference} className="hover:bg-slate-50/60">
                      <td className="p-3 font-bold text-[#195D9B]">{r.reference}</td>
                      <td className="p-3">
                        <p className="font-bold text-slate-900">{r.companyName}</p>
                        <p className="text-[11px] text-slate-600">{r.contactName} ({r.phone})</p>
                        <p className="text-[11px] text-[#195D9B]">{r.email}</p>
                      </td>
                      <td className="p-3 text-slate-700">{r.activitySector}</td>
                      <td className="p-3 text-slate-600 max-w-xs truncate" title={r.message}>{r.message}</td>
                      <td className="p-3">
                        {r.status === 'ACCEPTED' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Acceptée
                          </span>
                        ) : r.status === 'REJECTED' ? (
                          <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-lg">
                            <XCircle className="w-3.5 h-3.5" /> Refusée
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#EF9437] font-bold bg-[#FEF7EE] px-2.5 py-1 rounded-lg">
                            <Clock className="w-3.5 h-3.5" /> En attente
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenDecisionModal(r, 'ACCEPTED')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Accepter
                          </button>
                          <button
                            onClick={() => handleOpenDecisionModal(r, 'REJECTED')}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 transition-colors flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Refuser
                          </button>
                          <button
                            onClick={() => handleDeletePartnerRequest(r._id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Supprimer la demande"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Section 2: Demandes de Devis */}
        <Card className="p-6 space-y-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Demandes de Devis Récentes</h2>
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Mise à jour temps réel Socket.io
            </span>
          </div>

          <div className="overflow-x-auto max-h-80 overflow-y-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-3">Référence</th>
                  <th className="p-3">Demandeur</th>
                  <th className="p-3">Localisation</th>
                  <th className="p-3">Bâtiment</th>
                  <th className="p-3">Devis PDF</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {quotes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      Aucune demande de devis enregistrée pour le moment.
                    </td>
                  </tr>
                ) : (
                  quotes.map((q) => (
                    <tr key={q._id || q.reference} className="hover:bg-slate-50/60">
                      <td className="p-3 font-bold text-[#195D9B]">{q.reference}</td>
                      <td className="p-3">
                        <p className="font-bold text-slate-900">{q.firstName || q.clientId?.contactName || 'Client'} {q.lastName || ''}</p>
                        <p className="text-[11px] text-slate-500">{q.phone || q.clientId?.phone || '-'}</p>
                        <p className="text-[11px] text-[#195D9B]">{q.email || q.clientId?.email || '-'}</p>
                      </td>
                      <td className="p-3 text-slate-700">{q.commune || q.district || q.city}</td>
                      <td className="p-3 font-medium text-slate-800">{q.buildingType} ({q.estimatedSurface || 0} m²)</td>
                      <td className="p-3">
                        {q.pdfStatus === 'SENT' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Devis Envoyé
                          </span>
                        ) : q.pdfStatus === 'CUSTOM_UPLOADED' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#195D9B] bg-[#EBF4FC] px-2 py-0.5 rounded-md border border-[#ADD1F3]">
                            <FileCheck className="w-3 h-3" /> Canva/Word
                          </span>
                        ) : q.pdfStatus === 'GENERATED' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#EF9437] bg-[#FEF7EE] px-2 py-0.5 rounded-md border border-[#FDE6D2]">
                            <FileText className="w-3 h-3" /> PDF Prêt
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            Non Généré
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedQuoteForPdf(q)}
                            className="px-2.5 py-1 rounded-lg bg-[#195D9B] text-white font-bold hover:bg-[#13497B] transition-colors flex items-center gap-1 shadow-sm"
                            title="Générer, prévisualiser ou envoyer le devis PDF"
                          >
                            <FileText className="w-3.5 h-3.5" /> Devis PDF
                          </button>
                          <button
                            onClick={() => handleStatusChange(q._id, 'ACCEPTED')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors"
                          >
                            Valider
                          </button>
                          <button
                            onClick={() => handleDeleteQuoteRequest(q._id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Supprimer le devis"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Section 4: Gestion des Réalisations / Chantiers */}
        <Card className="p-6 space-y-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Gestion des Réalisations & Chantiers Livrés</h2>
              <p className="text-xs text-slate-500">Gérez les projets affichés publiquement dans le portfolio du site.</p>
            </div>
            <Button variant="outline" size="sm" icon={Plus} onClick={() => setIsAddProjectModalOpen(true)}>
              Ajouter un Chantier Livré
            </Button>
          </div>

          <div className="overflow-x-auto max-h-80 overflow-y-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-3">Nom du Chantier</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Localisation</th>
                  <th className="p-3">Surface</th>
                  <th className="p-3">Statut Publication</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      Aucune réalisation publiée pour le moment.
                    </td>
                  </tr>
                ) : (
                  projects.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/60">
                      <td className="p-3 font-bold text-slate-900">{p.name}</td>
                      <td className="p-3 text-slate-700">{p.buildingType}</td>
                      <td className="p-3 text-slate-700">{p.city} {p.commune ? `(${p.commune})` : ''}</td>
                      <td className="p-3 text-slate-700">{p.surface ? `${p.surface} m²` : '-'}</td>
                      <td className="p-3">
                        {p.isPublishedPublic ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
                            <Eye className="w-3.5 h-3.5" /> En Ligne
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-lg">
                            <EyeOff className="w-3.5 h-3.5" /> Masqué
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleProjectPublication(p._id)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                            title={p.isPublishedPublic ? 'Masquer' : 'Publier'}
                          >
                            {p.isPublishedPublic ? <EyeOff className="w-4 h-4 text-slate-600" /> : <Eye className="w-4 h-4 text-[#195D9B]" />}
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p._id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modal Ajout / Édition de Partenaire */}
      <Modal
        isOpen={isAddPartnerModalOpen}
        onClose={() => setIsAddPartnerModalOpen(false)}
        title={selectedPartnerForEdit ? 'Modifier le Partenaire' : 'Ajouter un Partenaire Officiel'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreatePartnerSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nom du Partenaire / Entreprise *</label>
            <input
              type="text"
              required
              value={newPartner.name}
              onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
              placeholder="Ex: Vinci Construction / PFO Côte d'Ivoire"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie</label>
              <input
                type="text"
                value={newPartner.category}
                onChange={(e) => setNewPartner({ ...newPartner, category: e.target.value })}
                placeholder="Ex: Promoteur Immobilier"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Téléphone</label>
              <input
                type="text"
                value={newPartner.contactPhone}
                onChange={(e) => setNewPartner({ ...newPartner, contactPhone: e.target.value })}
                placeholder="+225..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email de Contact</label>
              <input
                type="email"
                value={newPartner.contactEmail}
                onChange={(e) => setNewPartner({ ...newPartner, contactEmail: e.target.value })}
                placeholder="contact@partenaire.ci"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Site Web Officiel</label>
              <input
                type="text"
                value={newPartner.websiteUrl}
                onChange={(e) => setNewPartner({ ...newPartner, websiteUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">URL du Logo (Optionnel)</label>
            <input
              type="text"
              value={newPartner.logoUrl}
              onChange={(e) => setNewPartner({ ...newPartner, logoUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Synergie</label>
            <textarea
              rows={3}
              value={newPartner.description}
              onChange={(e) => setNewPartner({ ...newPartner, description: e.target.value })}
              placeholder="Description des prestations et synergies..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>

          <Button type="submit" variant="secondary" className="w-full justify-center">
            {selectedPartnerForEdit ? 'Enregistrer les Modifications' : 'Enregistrer et Publier le Partenaire'}
          </Button>
        </form>
      </Modal>

      {/* Modal Ajout Direct de Témoignage Officiel (Admin) */}
      <Modal
        isOpen={isTestimonialModalOpen}
        onClose={() => setIsTestimonialModalOpen(false)}
        title="Ajouter un Témoignage Officiel d'un Client BTP"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateAdminTestimonialSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nom du Client / Contact *</label>
              <input
                type="text"
                required
                value={adminTestimonialForm.authorName}
                onChange={(e) => setAdminTestimonialForm({ ...adminTestimonialForm, authorName: e.target.value })}
                placeholder="Ex: Kouamé N'Dri"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Société / Cabinet</label>
              <input
                type="text"
                value={adminTestimonialForm.company}
                onChange={(e) => setAdminTestimonialForm({ ...adminTestimonialForm, company: e.target.value })}
                placeholder="Ex: SCI Cocody Residence"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Rôle / Qualité</label>
              <input
                type="text"
                value={adminTestimonialForm.role}
                onChange={(e) => setAdminTestimonialForm({ ...adminTestimonialForm, role: e.target.value })}
                placeholder="Ex: Promoteur / Architecte"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Note (1 à 5 ⭐)</label>
              <select
                value={adminTestimonialForm.rating}
                onChange={(e) => setAdminTestimonialForm({ ...adminTestimonialForm, rating: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B] bg-white"
              >
                <option value={5}>5 / 5 (Excellent)</option>
                <option value={4}>4 / 5 (Très Bon)</option>
                <option value={3}>3 / 5 (Moyen)</option>
                <option value={2}>2 / 5 (Passable)</option>
                <option value={1}>1 / 5 (Insatisfaisant)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Titre de l'Avis</label>
            <input
              type="text"
              value={adminTestimonialForm.title}
              onChange={(e) => setAdminTestimonialForm({ ...adminTestimonialForm, title: e.target.value })}
              placeholder="Ex: Livraison d'immeuble R+5 sans aucune réserve !"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Commentaire / Témoignage Réel *</label>
            <textarea
              rows={4}
              required
              value={adminTestimonialForm.comment}
              onChange={(e) => setAdminTestimonialForm({ ...adminTestimonialForm, comment: e.target.value })}
              placeholder="Saisissez la citation ou le retour d'expérience du client..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>

          <Button type="submit" variant="secondary" className="w-full justify-center">
            Publier Officiellement sur le Site
          </Button>
        </form>
      </Modal>

      {/* Modal Création/Édition de FAQ */}
      <Modal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
        title={selectedFaqForEdit ? 'Modifier la Question FAQ' : 'Ajouter une nouvelle Question FAQ'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveFaqSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Question posée par les clients *</label>
            <input
              type="text"
              required
              value={faqForm.question}
              onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
              placeholder="Ex: Quels produits et équipements utilisez-vous ?"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie</label>
            <select
              value={faqForm.category}
              onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B] bg-white"
            >
              <option value="Prestations BTP">Prestations BTP</option>
              <option value="Devis & Tarifs">Devis & Tarifs</option>
              <option value="Délais & Visites">Délais & Visites</option>
              <option value="Conformité HSE">Conformité HSE</option>
              <option value="Général">Général</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Réponse détaillée officielle Baticlean *</label>
            <textarea
              rows={4}
              required
              value={faqForm.answer}
              onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
              placeholder="Ex: Nous utilisons exclusivement des monobrosses professionnelles..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPublished"
              checked={faqForm.isPublished}
              onChange={(e) => setFaqForm({ ...faqForm, isPublished: e.target.checked })}
              className="w-4 h-4 text-[#195D9B] rounded border-slate-300"
            />
            <label htmlFor="isPublished" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Publier immédiatement cette question sur le site public
            </label>
          </div>

          <Button type="submit" variant="secondary" className="w-full justify-center">
            {selectedFaqForEdit ? 'Enregistrer les modifications' : 'Ajouter la FAQ au site'}
          </Button>
        </form>
      </Modal>

      {/* Modal Devis PDF */}
      {selectedQuoteForPdf && (
        <QuotePdfModal
          isOpen={!!selectedQuoteForPdf}
          onClose={() => setSelectedQuoteForPdf(null)}
          quoteRequest={selectedQuoteForPdf}
          onSuccess={fetchData}
        />
      )}

      {/* Modal Décision Partenariat */}
      {selectedRequestForDecision && (
        <Modal
          isOpen={!!selectedRequestForDecision}
          onClose={() => setSelectedRequestForDecision(null)}
          title={decisionType === 'ACCEPTED' ? 'Valider & Accepter le Partenariat' : 'Refuser la Demande de Partenariat'}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSendDecisionSubmit} className="space-y-4">
            <div className={`p-3 rounded-xl text-xs font-semibold ${decisionType === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
              <p className="font-bold">Demande : {selectedRequestForDecision.reference}</p>
              <p>Société : {selectedRequestForDecision.companyName} ({selectedRequestForDecision.contactName})</p>
              <p className="mt-1">Un email officiel sera automatiquement envoyé à : <strong>{selectedRequestForDecision.email}</strong></p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Message / Note dans l'Email envoyé au partenaire</label>
              <textarea
                rows={4}
                required
                value={responseNotes}
                onChange={(e) => setResponseNotes(e.target.value)}
                placeholder="Rédigez la note personnalisée qui sera insérée dans l'email..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>

            <Button
              type="submit"
              variant={decisionType === 'ACCEPTED' ? 'primary' : 'secondary'}
              className="w-full justify-center"
              isLoading={isSubmittingDecision}
            >
              Confirmé & Envoyer l'Email
            </Button>
          </form>
        </Modal>
      )}

      {/* Modal d'ajout de Projet/Chantier */}
      <Modal isOpen={isAddProjectModalOpen} onClose={() => setIsAddProjectModalOpen(false)} title="Ajouter un Chantier Livré" maxWidth="max-w-lg">
        <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nom du Projet / Bâtiment *</label>
            <input
              type="text"
              required
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              placeholder="Ex: Résidence Les Palmes / Tour BTP Plateau"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Type de Bâtiment</label>
              <input
                type="text"
                value={newProject.buildingType}
                onChange={(e) => setNewProject({ ...newProject, buildingType: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Surface (m²)</label>
              <input
                type="number"
                value={newProject.surface}
                onChange={(e) => setNewProject({ ...newProject, surface: e.target.value })}
                placeholder="450"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">URL Image Après Nettoyage (Rendu final)</label>
            <input
              type="text"
              value={newProject.afterImage}
              onChange={(e) => setNewProject({ ...newProject, afterImage: e.target.value })}
              placeholder="https://..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description des travaux réalisés</label>
            <textarea
              rows={2}
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#195D9B]"
            />
          </div>

          <Button type="submit" variant="secondary" className="w-full justify-center">
            Enregistrer et Publier le Chantier
          </Button>
        </form>
      </Modal>

      {/* Modale de Confirmation Personnalisée */}
      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        onClose={() => setConfirmModalState({ isOpen: false, title: '', message: '', onConfirm: null, isLoading: false })}
        onConfirm={confirmModalState.onConfirm}
        title={confirmModalState.title}
        message={confirmModalState.message}
        isLoading={confirmModalState.isLoading}
      />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminDashboard;

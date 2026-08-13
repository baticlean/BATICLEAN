import { useEffect } from 'react';

const SEO = ({ title, description }) => {
  useEffect(() => {
    const defaultTitle = "Baticlean — Spécialiste du Nettoyage après Construction & Fin de Chantier à Abidjan";
    const defaultDesc = "Baticlean est la référence du nettoyage après construction, de fin de chantier et de la remise en état de bâtiments neufs à Abidjan, Côte d'Ivoire. Demandez votre devis officiel sous 24h.";

    document.title = title ? `${title} | Baticlean` : defaultTitle;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || defaultDesc);
    }
  }, [title, description]);

  return null;
};

export default SEO;

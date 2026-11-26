/**
 * Interest areas the young person can pick in the app ("Centres d'intérêt"),
 * with FR/AR labels and the keywords used to recognise matching offers
 * (searched in the offer title + description, accents ignored).
 *
 * Single source of truth: served to the app by GET /questionnaire and used
 * by the offer matching.
 */
export interface InterestItem {
  id: string;
  fr: string;
  ar: string;
  keywords: string[];
}

export interface InterestCategory {
  id: string;
  fr: string;
  ar: string;
  icon: string;
  subItems: InterestItem[];
}

export const INTEREST_CATALOG: InterestCategory[] = [
  {
    id: 'technology', fr: 'Technologie', ar: 'التكنولوجيا', icon: 'computer',
    subItems: [
      { id: 'tech_web', fr: 'Développement web', ar: 'تطوير المواقع', keywords: ['web', 'site', 'developpeur', 'developpement', 'programmation', 'wordpress', 'مواقع'] },
      { id: 'tech_mobile', fr: 'Applications mobiles', ar: 'تطبيقات الهاتف', keywords: ['mobile', 'application', 'android', 'flutter', 'تطبيقات'] },
      { id: 'tech_data', fr: 'Analyse de données', ar: 'تحليل البيانات', keywords: ['donnees', 'data', 'analyse', 'excel', 'statistique', 'البيانات'] },
      { id: 'tech_design', fr: 'Design numérique', ar: 'التصميم الرقمي', keywords: ['design', 'graphisme', 'graphiste', 'infographie', 'ui', 'ux', 'التصميم'] },
      { id: 'tech_support', fr: 'Support technique', ar: 'الدعم التقني', keywords: ['support', 'informatique', 'technicien', 'helpdesk', 'reseau', 'maintenance informatique', 'الدعم التقني'] },
    ],
  },
  {
    id: 'creativity', fr: 'Créativité', ar: 'الإبداع', icon: 'palette',
    subItems: [
      { id: 'crea_art', fr: 'Arts et artisanat', ar: 'الفنون والحرف', keywords: ['art', 'artiste', 'artisanat', 'peinture', 'الفنون'] },
      { id: 'crea_photo', fr: 'Photographie', ar: 'التصوير الفوتوغرافي', keywords: ['photo', 'photographe', 'video', 'audiovisuel', 'التصوير'] },
      { id: 'crea_writing', fr: 'Écriture et rédaction', ar: 'الكتابة والتحرير', keywords: ['redaction', 'redacteur', 'ecriture', 'contenu', 'journalisme', 'community manager', 'الكتابة'] },
      { id: 'crea_music', fr: 'Musique et son', ar: 'الموسيقى والصوت', keywords: ['musique', 'son', 'audio', 'الموسيقى'] },
      { id: 'crea_fashion', fr: 'Mode et stylisme', ar: 'الأزياء والتصميم', keywords: ['mode', 'couture', 'stylisme', 'textile', 'الأزياء'] },
    ],
  },
  {
    id: 'manual_service', fr: 'Métiers manuels', ar: 'الخدمات اليدوية', icon: 'build',
    subItems: [
      { id: 'man_cook', fr: 'Cuisine et restauration', ar: 'الطبخ والمطعمة', keywords: ['cuisine', 'cuisinier', 'restauration', 'restaurant', 'patisserie', 'serveur', 'الطبخ'] },
      { id: 'man_agri', fr: 'Agriculture', ar: 'الفلاحة', keywords: ['agriculture', 'agricole', 'ferme', 'elevage', 'الفلاحة'] },
      { id: 'man_mech', fr: 'Mécanique et maintenance', ar: 'الميكانيك والصيانة', keywords: ['mecanique', 'mecanicien', 'maintenance', 'electricite', 'electricien', 'plomberie', 'الميكانيك', 'الصيانة'] },
      { id: 'man_beauty', fr: 'Beauté et coiffure', ar: 'التجميل والحلاقة', keywords: ['beaute', 'coiffure', 'coiffeur', 'esthetique', 'التجميل', 'الحلاقة'] },
      { id: 'man_craft', fr: 'Artisanat traditionnel', ar: 'الصناعة التقليدية', keywords: ['artisanat', 'artisan', 'traditionnel', 'الصناعة التقليدية'] },
    ],
  },
  {
    id: 'people', fr: 'Contact humain', ar: 'التعامل مع الناس', icon: 'people',
    subItems: [
      { id: 'ppl_sales', fr: 'Vente et commerce', ar: 'البيع والتجارة', keywords: ['vente', 'vendeur', 'commerce', 'commercial', 'e-commerce', 'boutique', 'البيع', 'التجارة'] },
      { id: 'ppl_care', fr: 'Santé et soins', ar: 'الرعاية الصحية', keywords: ['sante', 'soins', 'infirmier', 'aide-soignant', 'pharmacie', 'الرعاية الصحية'] },
      { id: 'ppl_teach', fr: 'Enseignement et formation', ar: 'التعليم والتدريب', keywords: ['enseignement', 'enseignant', 'professeur', 'animateur', 'formateur', 'soutien scolaire', 'التعليم'] },
      { id: 'ppl_social', fr: 'Action sociale', ar: 'العمل الاجتماعي', keywords: ['social', 'association', 'benevolat', 'humanitaire', 'العمل الاجتماعي'] },
      { id: 'ppl_tourism', fr: 'Tourisme et hôtellerie', ar: 'السياحة والضيافة', keywords: ['tourisme', 'hotel', 'hotelier', 'hoteliere', 'hotellerie', 'accueil', 'reception', 'guide', 'السياحة'] },
    ],
  },
];

export const INTEREST_ITEMS: InterestItem[] = INTEREST_CATALOG.flatMap((c) => c.subItems);

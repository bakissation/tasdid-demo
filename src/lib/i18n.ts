/**
 * Tiny tri-lingual dictionary (fr default, en, ar-RTL) — no i18n framework, just
 * typed maps. SATIM certification rule: the language must be *uniform* across the
 * summary → gateway → return → receipt → errors, so the same `Locale` drives both
 * the UI copy here AND the `language` param sent to SATIM in `start`.
 */
export const LOCALES = ['fr', 'en', 'ar'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'fr';

export function isLocale(value: unknown): value is Locale {
  return value === 'fr' || value === 'en' || value === 'ar';
}

/** Text direction for the `<html dir>` attribute. Arabic is right-to-left. */
export function dir(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

interface Dictionary {
  appName: string;
  langName: string;
  common: {
    download: string;
    print: string;
    email: string;
    back: string;
    loading: string;
    securedBySatim: string;
  };
  store: {
    badge: string;
    title: string;
    tagline: string;
    planName: string;
    planTagline: string;
    features: string[];
    perYear: string;
    buy: string;
    cards: string;
  };
  checkout: {
    title: string;
    summary: string;
    plan: string;
    amount: string;
    total: string;
    method: string;
    online: string;
    cibEdahabia: string;
    cgv: string;
    pay: string;
    paying: string;
    cancel: string;
  };
  status: {
    title: string;
    success: string;
    failed: string;
    processing: string;
    receiptNo: string;
    transactionId: string;
    orderNumber: string;
    approvalCode: string;
    dateTime: string;
    amount: string;
    paymentMode: string;
    errorMessage: string;
    contactSupport: string;
    helpMessage: string;
    backToStore: string;
  };
  admin: {
    title: string;
    subtitle: string;
    reconcile: string;
    reconcileHint: string;
    reconcileNow: string;
    reconciling: string;
    pending: string;
    advanced: string;
    advancedHint: string;
    none: string;
  };
}

const fr: Dictionary = {
  appName: 'Tasdid Store',
  langName: 'Français',
  common: {
    download: 'Télécharger',
    print: 'Imprimer',
    email: 'Email',
    back: 'Retour',
    loading: 'Chargement…',
    securedBySatim: 'Paiement sécurisé par SATIM (CIB / Edahabia)',
  },
  store: {
    badge: 'Démo de paiement',
    title: 'Passez à Tasdid Pro',
    tagline: "L'exemple de référence d'un paiement CIB/Edahabia de bout en bout, propulsé par la famille @bakissation.",
    planName: 'Pro',
    planTagline: 'Tout ce dont vous avez besoin, pour une année.',
    features: [
      'Accès complet à toutes les fonctionnalités',
      'Support prioritaire',
      'Reçu téléchargeable après paiement',
      'Paiement par carte CIB ou Edahabia',
    ],
    perYear: '/ an',
    buy: 'Souscrire',
    cards: 'Cartes acceptées',
  },
  checkout: {
    title: 'Finaliser la commande',
    summary: 'Récapitulatif',
    plan: 'Formule',
    amount: 'Montant',
    total: 'Total à payer',
    method: 'Moyen de paiement',
    online: 'En ligne',
    cibEdahabia: 'Carte CIB / Edahabia',
    cgv: "J'accepte les conditions générales de vente.",
    pay: 'Payer',
    paying: 'Redirection vers SATIM…',
    cancel: 'Annuler',
  },
  status: {
    title: 'Statut du paiement',
    success: 'Paiement réussi',
    failed: 'Échec du paiement',
    processing: 'Traitement du paiement',
    receiptNo: 'N° Reçu',
    transactionId: 'Identifiant de la transaction',
    orderNumber: 'Numéro de commande',
    approvalCode: "Code d'approbation",
    dateTime: 'Date et heure',
    amount: 'Montant',
    paymentMode: 'Mode de paiement',
    errorMessage: "Raison de l'échec",
    contactSupport: "Besoin d'aide ? Contactez le support SATIM :",
    helpMessage: 'En cas de problème de paiement, veuillez contacter le numéro vert de la SATIM.',
    backToStore: 'Retour à la boutique',
  },
  admin: {
    title: 'Administration',
    subtitle: 'SATIM n’a pas de webhooks — la réconciliation est la source de vérité.',
    reconcile: 'Réconciliation',
    reconcileHint:
      'Interroge SATIM pour chaque paiement en attente et fait avancer son état. Normalement déclenché par une tâche planifiée.',
    reconcileNow: 'Réconcilier maintenant',
    reconciling: 'Réconciliation…',
    pending: 'En attente',
    advanced: 'Pourquoi ce bouton ?',
    advancedHint:
      'En production, un planificateur (cron) appelle GET /api/pay/reconcile périodiquement. Ce bouton fait la même chose à la demande.',
    none: 'Aucun paiement en attente.',
  },
};

const en: Dictionary = {
  appName: 'Tasdid Store',
  langName: 'English',
  common: {
    download: 'Download',
    print: 'Print',
    email: 'Email',
    back: 'Back',
    loading: 'Loading…',
    securedBySatim: 'Payment secured by SATIM (CIB / Edahabia)',
  },
  store: {
    badge: 'Payment demo',
    title: 'Upgrade to Tasdid Pro',
    tagline: 'The reference example of an end-to-end CIB/Edahabia payment, powered by the @bakissation family.',
    planName: 'Pro',
    planTagline: 'Everything you need, for one year.',
    features: [
      'Full access to every feature',
      'Priority support',
      'Downloadable receipt after payment',
      'Pay with a CIB or Edahabia card',
    ],
    perYear: '/ year',
    buy: 'Subscribe',
    cards: 'Accepted cards',
  },
  checkout: {
    title: 'Complete your order',
    summary: 'Summary',
    plan: 'Plan',
    amount: 'Amount',
    total: 'Total to pay',
    method: 'Payment method',
    online: 'Online',
    cibEdahabia: 'CIB / Edahabia card',
    cgv: 'I agree to the terms and conditions of sale.',
    pay: 'Pay',
    paying: 'Redirecting to SATIM…',
    cancel: 'Cancel',
  },
  status: {
    title: 'Payment status',
    success: 'Payment Successful',
    failed: 'Payment Failed',
    processing: 'Payment Processing',
    receiptNo: 'Receipt No.',
    transactionId: 'Transaction ID',
    orderNumber: 'Order Number',
    approvalCode: 'Approval Code',
    dateTime: 'Date & Time',
    amount: 'Amount',
    paymentMode: 'Payment Mode',
    errorMessage: 'Failure Reason',
    contactSupport: 'Need help? Contact SATIM support:',
    helpMessage: 'In case of payment issues, please contact the SATIM green number.',
    backToStore: 'Back to store',
  },
  admin: {
    title: 'Administration',
    subtitle: 'SATIM has no webhooks — reconciliation is the source of truth.',
    reconcile: 'Reconciliation',
    reconcileHint:
      'Queries SATIM for every pending payment and advances its state. Normally triggered by a scheduled job.',
    reconcileNow: 'Reconcile now',
    reconciling: 'Reconciling…',
    pending: 'Pending',
    advanced: 'Why this button?',
    advancedHint:
      'In production a scheduler (cron) calls GET /api/pay/reconcile periodically. This button does the same on demand.',
    none: 'No pending payments.',
  },
};

const ar: Dictionary = {
  appName: 'متجر تسديد',
  langName: 'العربية',
  common: {
    download: 'تحميل',
    print: 'طباعة',
    email: 'البريد الإلكتروني',
    back: 'رجوع',
    loading: 'جارٍ التحميل…',
    securedBySatim: 'دفع آمن عبر ساتيم (CIB / الذهبية)',
  },
  store: {
    badge: 'عرض توضيحي للدفع',
    title: 'الترقية إلى تسديد برو',
    tagline: 'المثال المرجعي لعملية دفع CIB/الذهبية من البداية إلى النهاية، مدعومة من عائلة @bakissation.',
    planName: 'برو',
    planTagline: 'كل ما تحتاجه، لمدة سنة.',
    features: [
      'وصول كامل إلى جميع الميزات',
      'دعم ذو أولوية',
      'إيصال قابل للتحميل بعد الدفع',
      'الدفع ببطاقة CIB أو الذهبية',
    ],
    perYear: '/ سنة',
    buy: 'اشترك',
    cards: 'البطاقات المقبولة',
  },
  checkout: {
    title: 'إتمام الطلب',
    summary: 'الملخص',
    plan: 'الباقة',
    amount: 'المبلغ',
    total: 'المبلغ الإجمالي',
    method: 'طريقة الدفع',
    online: 'عبر الإنترنت',
    cibEdahabia: 'بطاقة CIB / الذهبية',
    cgv: 'أوافق على الشروط والأحكام العامة للبيع.',
    pay: 'ادفع',
    paying: 'إعادة التوجيه إلى ساتيم…',
    cancel: 'إلغاء',
  },
  status: {
    title: 'حالة الدفع',
    success: 'تم الدفع بنجاح',
    failed: 'فشل عملية الدفع',
    processing: 'جاري معالجة الدفع',
    receiptNo: 'رقم الإيصال',
    transactionId: 'معرّف المعاملة',
    orderNumber: 'رقم الطلب',
    approvalCode: 'رقم الموافقة',
    dateTime: 'التاريخ والوقت',
    amount: 'المبلغ',
    paymentMode: 'طريقة الدفع',
    errorMessage: 'سبب الفشل',
    contactSupport: 'تحتاج مساعدة؟ تواصل مع دعم ساتيم:',
    helpMessage: 'في حالة حدوث مشكلة في الدفع، يرجى الاتصال بالرقم الأخضر لـ ساتيم.',
    backToStore: 'العودة إلى المتجر',
  },
  admin: {
    title: 'الإدارة',
    subtitle: 'ساتيم لا يوفّر webhooks — المطابقة هي مصدر الحقيقة.',
    reconcile: 'المطابقة',
    reconcileHint: 'يستعلم ساتيم عن كل دفعة معلّقة ويُحدّث حالتها. يُشغّل عادةً عبر مهمة مجدولة.',
    reconcileNow: 'طابِق الآن',
    reconciling: 'جارٍ المطابقة…',
    pending: 'معلّق',
    advanced: 'لماذا هذا الزر؟',
    advancedHint:
      'في الإنتاج، يستدعي المُجدوِل (cron) المسار GET /api/pay/reconcile دوريًا. هذا الزر يقوم بنفس العمل عند الطلب.',
    none: 'لا توجد دفعات معلّقة.',
  },
};

const DICTIONARIES: Record<Locale, Dictionary> = { fr, en, ar };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

export type { Dictionary };

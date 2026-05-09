/**
 * Translation strings for the Verbara marketing site.
 *
 * Three locales must remain in PERFECT key parity:
 *   - es-419 (default, baseline)
 *   - en-US
 *   - pt-BR
 *
 * If you add a key to one locale, add it to ALL THREE in the same shape.
 * A future CI gate will enforce this (mirroring Verbara.Platform.Web's
 * i18n parity check).
 */

export type Locale = 'es-419' | 'en-US' | 'pt-BR';
export const LOCALES: readonly Locale[] = ['es-419', 'en-US', 'pt-BR'];
export const DEFAULT_LOCALE: Locale = 'es-419';

export interface Messages {
  meta: {
    site_title: string;
    site_description: string;
  };
  nav: {
    product: string;
    pricing: string;
    developer_license: string;
    github: string;
  };
  footer: {
    tagline: string;
    column_product: string;
    column_resources: string;
    column_legal: string;
    legal_eula: string;
    legal_privacy: string;
    legal_terms: string;
    copyright: string;
    trademark: string;
  };
  landing: {
    hero_title: string;
    hero_subtitle: string;
    cta_developer: string;
    cta_pricing: string;
    why_title: string;
    why_subtitle: string;
    why_b1_title: string;
    why_b1_body: string;
    why_b2_title: string;
    why_b2_body: string;
    why_b3_title: string;
    why_b3_body: string;
    stack_title: string;
    stack_subtitle: string;
    stack_role_sdk: string;
    stack_role_web: string;
    stack_role_platform: string;
    stack_role_pro: string;
  };
  pricing: {
    title: string;
    subtitle: string;
    cta_developer: string;
    cta_buy: string;
    cta_sales: string;
    cta_community: string;
    popular_badge: string;
    evaluators_badge: string;
    tier_0_name: string;
    tier_0_price: string;
    tier_0_tagline: string;
    tier_0_f1: string;
    tier_0_f2: string;
    tier_0_f3: string;
    tier_0_f4: string;
    tier_05_name: string;
    tier_05_price: string;
    tier_05_tagline: string;
    tier_05_f1: string;
    tier_05_f2: string;
    tier_05_f3: string;
    tier_05_f4: string;
    tier_1_name: string;
    tier_1_price: string;
    tier_1_tagline: string;
    tier_1_f1: string;
    tier_1_f2: string;
    tier_1_f3: string;
    tier_1_f4: string;
    tier_2_name: string;
    tier_2_price: string;
    tier_2_tagline: string;
    tier_2_f1: string;
    tier_2_f2: string;
    tier_2_f3: string;
    tier_2_f4: string;
    tier_3_name: string;
    tier_3_price: string;
    tier_3_tagline: string;
    tier_3_f1: string;
    tier_3_f2: string;
    tier_3_f3: string;
    tier_3_f4: string;
    tier_4_name: string;
    tier_4_price: string;
    tier_4_tagline: string;
    tier_4_f1: string;
    tier_4_f2: string;
    tier_4_f3: string;
    tier_4_f4: string;
    tier_5_name: string;
    tier_5_price: string;
    tier_5_tagline: string;
    tier_5_f1: string;
    tier_5_f2: string;
    tier_5_f3: string;
    tier_5_f4: string;
  };
  developer_license: {
    title: string;
    subtitle: string;
    coming_soon_title: string;
    coming_soon_body: string;
    contact_label: string;
    // Form fields (rendered when PUBLIC_TURNSTILE_SITE_KEY is configured)
    form_email_label: string;
    form_email_placeholder: string;
    form_fullName_label: string;
    form_fullName_placeholder: string;
    form_company_label: string;
    form_company_placeholder: string;
    form_useCase_label: string;
    form_useCase_placeholder: string;
    form_eula_label: string;
    form_submit: string;
    // States
    state_submitting: string;
    state_success_title: string;
    state_success_body_html: string; // contains {email} placeholder
    // Errors
    error_email_invalid: string;
    error_fullName_required: string;
    error_eula_required: string;
    error_captcha_required: string;
    error_rate_limited: string;
    error_service_unavailable: string;
    error_generic: string;
    // Sidebar
    what_you_get_title: string;
    what_you_get_agents: string;
    what_you_get_node: string;
    what_you_get_duration: string;
    what_you_get_features: string;
    what_you_get_mode: string;
  };
  legal_eula: {
    title: string;
    body: string;
  };
  legal_privacy: {
    title: string;
    body: string;
  };
  legal_terms: {
    title: string;
    body: string;
  };
}

const es_419: Messages = {
  meta: {
    site_title: 'Verbara — Plataforma open-core honesta para contact center',
    site_description:
      'Verbara es una plataforma open-core para contact center: motor auditable, módulos comerciales. Self-host gratis o hosted, sin tarifas por minuto.',
  },
  nav: {
    product: 'Producto',
    pricing: 'Precios',
    developer_license: 'Licencia gratuita',
    github: 'GitHub',
  },
  footer: {
    tagline: 'Open-core honesto para contact center.',
    column_product: 'Producto',
    column_resources: 'Recursos',
    column_legal: 'Legal',
    legal_eula: 'EULA',
    legal_privacy: 'Privacidad',
    legal_terms: 'Términos',
    copyright: '© 2026 Harol A. Reina H. y contribuidores de Verbara.',
    trademark:
      'Verbara™. "Asterisk" es marca registrada de Sangoma Technologies / Digium; Verbara es un proyecto independiente.',
  },
  landing: {
    hero_title: 'El contact center open-core honesto.',
    hero_subtitle:
      'Motor auditable bajo Apache 2.0 + módulos Pro comerciales. Self-host gratis o hosted desde $99 por agente al mes. Sin tarifas por minuto, sin lock-in.',
    cta_developer: 'Obtener licencia gratuita de developer',
    cta_pricing: 'Ver precios',
    why_title: '¿Por qué Verbara?',
    why_subtitle:
      'Twilio, Genesys y Five9 cobran por minuto o $115–249 por agente al mes y se quedan con tus datos. Vicidial es gratis pero su UX es de 2008. Verbara cierra esa brecha.',
    why_b1_title: 'Auditable',
    why_b1_body:
      'Backend Apache 2.0, frontend Apache 2.0, SDK MIT. Tu equipo de seguridad puede leer cada línea antes de comprar.',
    why_b2_title: 'On-premise o hosted',
    why_b2_body:
      'Corre todo en tu infraestructura (Tier 1–2) o pagas por agente al mes con SLA 99.5–99.9% (Tier 3–4). Tú eliges, sin lock-in.',
    why_b3_title: 'Sin tarifas por minuto',
    why_b3_body:
      'Twilio cobra $0.014–0.045 por minuto de llamada y por mensaje. Verbara conecta directamente a tu PBX (Asterisk) — paga solo por tu telco.',
    stack_title: 'El stack open-core',
    stack_subtitle:
      'Cuatro repositorios, un ecosistema. Cada uno con la licencia adecuada a su rol.',
    stack_role_sdk:
      'Primitivas de telefonía (AMI / AGI / ARI / Live API / Sessions / Voice AI) — atractor de comunidad',
    stack_role_web: 'UI del operador (admin / agente / analítica / operaciones)',
    stack_role_platform: 'Backend de aplicación — motor completo de contact center',
    stack_role_pro:
      'Capas comerciales (multi-tenant, analítica, cluster, licensing)',
  },
  pricing: {
    title: 'Precios',
    subtitle:
      'Plataforma open-core honesta — paga por el motor, nunca por la UI ni el backend base.',
    cta_developer: 'Licencia gratuita de developer',
    cta_buy: 'Comprar (próximamente)',
    cta_sales: 'Hablar con ventas',
    cta_community: 'Ver en GitHub',
    popular_badge: 'Más popular',
    evaluators_badge: 'Para evaluadores',
    tier_0_name: 'Community',
    tier_0_price: 'Gratis',
    tier_0_tagline: 'Self-host open source. Sin clave Pro.',
    tier_0_f1: 'Verbara Sdk (MIT) — SDK base completo',
    tier_0_f2: 'Self-host de Platform + Web (Apache 2.0)',
    tier_0_f3: 'Sin funciones Pro',
    tier_0_f4: 'Soporte comunitario (issues de GitHub)',
    tier_05_name: 'Pro Developer',
    tier_05_price: 'Gratis',
    tier_05_tagline: 'Todas las funciones Pro en modo WarnOnly. Auto-emitida.',
    tier_05_f1: 'Todas las funciones Pro desbloqueadas',
    tier_05_f2: '≤5 agentes · ≤1 nodo',
    tier_05_f3: '30 días renovables gratis',
    tier_05_f4: 'WarnOnly (nunca bloquea)',
    tier_1_name: 'Pro Self-Host Startup',
    tier_1_price: '$5.000 / año',
    tier_1_tagline: 'Conjunto restringido de funciones. ≤25 agentes.',
    tier_1_f1: 'Cluster, Dialer, EventStore, Routing, Realtime',
    tier_1_f2: 'Single-tenant solamente',
    tier_1_f3: '≤25 agentes · 1 clúster',
    tier_1_f4: 'Soporte por email SLA 48h',
    tier_2_name: 'Pro Self-Host Business',
    tier_2_price: '$30k–50k / año',
    tier_2_tagline: 'Todas las funciones Pro. Multi-tenant. Multi-clúster.',
    tier_2_f1: 'Todas las funciones Pro (incl. AgentAssist, CallAnalytics)',
    tier_2_f2: 'Aislamiento multi-tenant',
    tier_2_f3: '≤500 agentes · multi-clúster',
    tier_2_f4: 'Email + Slack SLA 24h',
    tier_3_name: 'SaaS Business',
    tier_3_price: '$99 / agente / mes',
    tier_3_tagline: 'Hospedado por Verbara. SLA 99.5%.',
    tier_3_f1: 'Todas las funciones Tier 2, hospedado',
    tier_3_f2: 'SLA 99.5%, soporte horario laboral',
    tier_3_f3: 'SAML básico',
    tier_3_f4: 'Mid-market (50–500 agentes)',
    tier_4_name: 'SaaS Enterprise',
    tier_4_price: '$249 / agente / mes',
    tier_4_tagline: 'Soporte 24/7. SLA 99.9%. CSM dedicado.',
    tier_4_f1: 'Funciones Tier 3 +',
    tier_4_f2: 'SLA 99.9%, soporte 24/7, CSM dedicado',
    tier_4_f3: 'SAML, IP allowlist, reportes SOC2/HIPAA/PCI',
    tier_4_f4: 'SLA personalizado',
    tier_5_name: 'White-label / OEM',
    tier_5_price: '$5k–50k + 10–30% rev share',
    tier_5_tagline: 'Eliminación de marca. Acuerdo de reventa.',
    tier_5_f1: 'Funciones Tier 4 +',
    tier_5_f2: 'Theming personalizado + eliminación de marca',
    tier_5_f3: 'Acuerdo de reventa',
    tier_5_f4: 'Soporte de partner Tier-2',
  },
  developer_license: {
    title: 'Licencia gratuita de Pro Developer',
    subtitle:
      'Evalúa todas las funciones de Verbara Pro sin contactar a ventas. Renovación gratuita cada 30 días.',
    coming_soon_title: 'Auto-servicio próximamente',
    coming_soon_body:
      'El portal de auto-emisión Tier 0.5 entra en línea con nuestro lanzamiento público. Mientras tanto, escribe a licensing@verbara.io para recibir una licencia de developer emitida manualmente — usualmente respondemos en menos de 24 horas.',
    contact_label: 'Contactar a licensing@verbara.io',
    form_email_label: 'Correo electrónico',
    form_email_placeholder: 'tu@empresa.com',
    form_fullName_label: 'Nombre completo',
    form_fullName_placeholder: 'Alicia García',
    form_company_label: 'Empresa (opcional)',
    form_company_placeholder: 'Acme Corp',
    form_useCase_label: 'Caso de uso (opcional)',
    form_useCase_placeholder: 'Describe brevemente cómo planeas evaluar Verbara Pro',
    form_eula_label: 'Acepto el EULA y la Política de privacidad',
    form_submit: 'Solicitar licencia gratuita',
    state_submitting: 'Enviando…',
    state_success_title: 'Solicitud recibida',
    state_success_body_html:
      'Revisa <strong>{email}</strong> en los próximos 5 minutos para recibir tu licencia. Para renovar, completa este mismo formulario en cualquier momento.',
    error_email_invalid: 'Ingresa una dirección de correo válida',
    error_fullName_required: 'El nombre completo es obligatorio',
    error_eula_required: 'Debes aceptar el EULA y la Política de privacidad',
    error_captcha_required: 'Por favor completa la verificación captcha',
    error_rate_limited:
      'Ya solicitaste una licencia recientemente. Inténtalo más tarde.',
    error_service_unavailable:
      'El servicio de emisión no está disponible en este momento. Intenta de nuevo en unos minutos o escribe a licensing@verbara.io.',
    error_generic:
      'Algo salió mal. Intenta de nuevo o escribe a licensing@verbara.io',
    what_you_get_title: 'Qué incluye',
    what_you_get_agents: 'Hasta 5 agentes concurrentes',
    what_you_get_node: '1 nodo de clúster',
    what_you_get_duration: 'Licencia de 30 días, renovación gratuita',
    what_you_get_features:
      'Todas las funciones Pro (multi-tenant, analítica, marcador, AgentAssist, CallAnalytics)',
    what_you_get_mode: 'Modo WarnOnly — nunca bloquea tu aplicación',
  },
  legal_eula: {
    title: 'Acuerdo de licencia de usuario final (EULA)',
    body: 'El EULA completo de Verbara Pro está siendo preparado por nuestros abogados. El archivo LICENSE actual del repositorio Verbara.Sdk.Pro (descargo de garantía, límite de responsabilidad, restricciones, ley aplicable: República de Colombia) rige el uso hasta que se publique el EULA formal. Para consultas de licenciamiento, escribe a licensing@verbara.io.',
  },
  legal_privacy: {
    title: 'Política de privacidad',
    body: 'Nuestra Política de privacidad está siendo preparada por nuestros abogados. Para consultas de protección de datos, escribe a legal@verbara.io. Este sitio usa Cloudflare Web Analytics (sin cookies, sin huella digital, anónimo).',
  },
  legal_terms: {
    title: 'Términos de servicio',
    body: 'Los Términos de servicio para los tiers SaaS hospedados por Verbara (Tier 3 SaaS Business, Tier 4 SaaS Enterprise) están siendo preparados. Para consultas comerciales, escribe a licensing@verbara.io.',
  },
};

const en_US: Messages = {
  meta: {
    site_title: 'Verbara — Open-core honest contact-center platform',
    site_description:
      'Verbara is an open-core contact-center platform: auditable engine, commercial overlays. Self-host free or hosted, no per-minute fees.',
  },
  nav: {
    product: 'Product',
    pricing: 'Pricing',
    developer_license: 'Free license',
    github: 'GitHub',
  },
  footer: {
    tagline: 'Open-core honest contact-center platform.',
    column_product: 'Product',
    column_resources: 'Resources',
    column_legal: 'Legal',
    legal_eula: 'EULA',
    legal_privacy: 'Privacy',
    legal_terms: 'Terms',
    copyright: '© 2026 Harol A. Reina H. and Verbara Contributors.',
    trademark:
      'Verbara™. "Asterisk" is a registered trademark of Sangoma Technologies / Digium; Verbara is an independent project.',
  },
  landing: {
    hero_title: 'The honest open-core contact center.',
    hero_subtitle:
      'Apache 2.0 auditable engine + commercial Pro overlays. Self-host free or hosted from $99/agent/month. No per-minute fees, no lock-in.',
    cta_developer: 'Get free developer license',
    cta_pricing: 'See pricing',
    why_title: 'Why Verbara?',
    why_subtitle:
      'Twilio, Genesys, and Five9 charge per-minute or $115–249/agent/month and keep your data. Vicidial is free but its UX is from 2008. Verbara closes the gap.',
    why_b1_title: 'Auditable',
    why_b1_body:
      'Apache 2.0 backend, Apache 2.0 frontend, MIT SDK. Your security team can read every line before you buy.',
    why_b2_title: 'On-premise or hosted',
    why_b2_body:
      'Run everything on your infrastructure (Tier 1–2) or pay per agent per month with 99.5–99.9% SLA (Tier 3–4). Your choice, no lock-in.',
    why_b3_title: 'No per-minute fees',
    why_b3_body:
      'Twilio charges $0.014–0.045 per call minute and per message. Verbara connects directly to your PBX (Asterisk) — pay only your telco.',
    stack_title: 'The open-core stack',
    stack_subtitle:
      'Four repositories, one ecosystem. Each with the right license for its role.',
    stack_role_sdk:
      'Telephony primitives (AMI / AGI / ARI / Live API / Sessions / Voice AI) — community attractor',
    stack_role_web: 'Operator UI (admin / agent / analytics / operations)',
    stack_role_platform: 'Backend application — full contact-center engine',
    stack_role_pro:
      'Enterprise overlays (multi-tenant, analytics, cluster, licensing)',
  },
  pricing: {
    title: 'Pricing',
    subtitle:
      'Open-core honest platform — pay for the engine, never for the UI or backend base.',
    cta_developer: 'Get free developer license',
    cta_buy: 'Buy (coming soon)',
    cta_sales: 'Talk to sales',
    cta_community: 'View on GitHub',
    popular_badge: 'Most popular',
    evaluators_badge: 'For evaluators',
    tier_0_name: 'Community',
    tier_0_price: 'Free',
    tier_0_tagline: 'Open-source self-host. No Pro key.',
    tier_0_f1: 'Verbara Sdk (MIT) — full base SDK',
    tier_0_f2: 'Self-host Platform + Web (Apache 2.0)',
    tier_0_f3: 'No Pro features',
    tier_0_f4: 'Community support (GitHub issues)',
    tier_05_name: 'Pro Developer',
    tier_05_price: 'Free',
    tier_05_tagline: 'All Pro features in WarnOnly mode. Auto-issued.',
    tier_05_f1: 'All Pro features unlocked',
    tier_05_f2: '≤5 agents · ≤1 node',
    tier_05_f3: '30-day rolling, free renewal',
    tier_05_f4: 'WarnOnly (never blocks)',
    tier_1_name: 'Pro Self-Host Startup',
    tier_1_price: '$5,000 / yr',
    tier_1_tagline: 'Restricted feature set. ≤25 agents.',
    tier_1_f1: 'Cluster, Dialer, EventStore, Routing, Realtime',
    tier_1_f2: 'Single-tenant only',
    tier_1_f3: '≤25 agents · 1 cluster',
    tier_1_f4: 'Email support 48h SLA',
    tier_2_name: 'Pro Self-Host Business',
    tier_2_price: '$30k–50k / yr',
    tier_2_tagline: 'All Pro features. Multi-tenant. Multi-cluster.',
    tier_2_f1: 'All Pro features (incl. AgentAssist, CallAnalytics)',
    tier_2_f2: 'Multi-tenant isolation',
    tier_2_f3: '≤500 agents · multi-cluster',
    tier_2_f4: 'Email + Slack 24h SLA',
    tier_3_name: 'SaaS Business',
    tier_3_price: '$99 / agent / mo',
    tier_3_tagline: 'Hosted by Verbara. 99.5% SLA.',
    tier_3_f1: 'All Tier 2 features, hosted',
    tier_3_f2: '99.5% SLA, business-hours support',
    tier_3_f3: 'Basic SAML',
    tier_3_f4: 'Mid-market (50–500 agents)',
    tier_4_name: 'SaaS Enterprise',
    tier_4_price: '$249 / agent / mo',
    tier_4_tagline: '24/7 support. 99.9% SLA. Dedicated CSM.',
    tier_4_f1: 'Tier 3 features +',
    tier_4_f2: '99.9% SLA, 24/7 support, dedicated CSM',
    tier_4_f3: 'SAML, IP allowlist, SOC2/HIPAA/PCI reports',
    tier_4_f4: 'Custom SLA',
    tier_5_name: 'White-label / OEM',
    tier_5_price: '$5k–50k + 10–30% rev share',
    tier_5_tagline: 'Branding removal. Reseller agreement.',
    tier_5_f1: 'Tier 4 features +',
    tier_5_f2: 'Custom theming + branding removal',
    tier_5_f3: 'Reseller agreement',
    tier_5_f4: 'Tier-2 partner support',
  },
  developer_license: {
    title: 'Free Pro Developer license',
    subtitle:
      'Evaluate the full Verbara Pro feature set with no sales contact. 30-day rolling renewal.',
    coming_soon_title: 'Self-service coming soon',
    coming_soon_body:
      'The Tier 0.5 self-issue portal launches with our public release. In the meantime, email licensing@verbara.io to receive a manually-issued developer license — we usually respond within 24 hours.',
    contact_label: 'Contact licensing@verbara.io',
    form_email_label: 'Email address',
    form_email_placeholder: 'you@company.com',
    form_fullName_label: 'Full name',
    form_fullName_placeholder: 'Alice Smith',
    form_company_label: 'Company (optional)',
    form_company_placeholder: 'Acme Corp',
    form_useCase_label: 'Use case (optional)',
    form_useCase_placeholder: 'Briefly describe how you plan to evaluate Verbara Pro',
    form_eula_label: 'I accept the EULA and the Privacy Policy',
    form_submit: 'Request free license',
    state_submitting: 'Sending…',
    state_success_title: 'Request received',
    state_success_body_html:
      'Check <strong>{email}</strong> for your developer license within 5 minutes. To extend, request a renewal from this same form anytime.',
    error_email_invalid: 'Enter a valid email address',
    error_fullName_required: 'Full name is required',
    error_eula_required: 'You must accept the EULA and Privacy Policy',
    error_captcha_required: 'Please complete the captcha verification',
    error_rate_limited:
      'You already requested a license recently. Please try again later.',
    error_service_unavailable:
      'The issuance service is not available right now. Please try again in a few minutes or email licensing@verbara.io.',
    error_generic:
      'Something went wrong. Please try again or email licensing@verbara.io.',
    what_you_get_title: "What's included",
    what_you_get_agents: 'Up to 5 concurrent agents',
    what_you_get_node: '1 cluster node',
    what_you_get_duration: '30-day license, free renewal',
    what_you_get_features:
      'All Pro features (multi-tenant, analytics, dialer, AgentAssist, CallAnalytics)',
    what_you_get_mode: 'Runs in WarnOnly mode — never blocks your application',
  },
  legal_eula: {
    title: 'End-User License Agreement',
    body: 'The full Verbara Pro EULA is being prepared by counsel. The current LICENSE file in the Verbara.Sdk.Pro repository (warranty disclaimer, liability cap, restrictions, governing law: Republic of Colombia) governs use until the formal EULA ships. For licensing inquiries, email licensing@verbara.io.',
  },
  legal_privacy: {
    title: 'Privacy Policy',
    body: 'Our Privacy Policy is being prepared by counsel. For data-protection inquiries, email legal@verbara.io. This site uses Cloudflare Web Analytics (no cookies, no fingerprinting, fully anonymous).',
  },
  legal_terms: {
    title: 'Terms of Service',
    body: 'Terms of Service for Verbara hosted SaaS tiers (Tier 3 SaaS Business, Tier 4 SaaS Enterprise) are being prepared. For sales inquiries, email licensing@verbara.io.',
  },
};

const pt_BR: Messages = {
  meta: {
    site_title: 'Verbara — Plataforma open-core honesta para contact center',
    site_description:
      'Verbara é uma plataforma open-core para contact center: motor auditável, módulos comerciais. Self-host gratuito ou hospedado, sem tarifas por minuto.',
  },
  nav: {
    product: 'Produto',
    pricing: 'Preços',
    developer_license: 'Licença gratuita',
    github: 'GitHub',
  },
  footer: {
    tagline: 'Open-core honesto para contact center.',
    column_product: 'Produto',
    column_resources: 'Recursos',
    column_legal: 'Legal',
    legal_eula: 'EULA',
    legal_privacy: 'Privacidade',
    legal_terms: 'Termos',
    copyright: '© 2026 Harol A. Reina H. e contribuidores da Verbara.',
    trademark:
      'Verbara™. "Asterisk" é marca registrada de Sangoma Technologies / Digium; Verbara é um projeto independente.',
  },
  landing: {
    hero_title: 'O contact center open-core honesto.',
    hero_subtitle:
      'Motor auditável sob Apache 2.0 + módulos Pro comerciais. Self-host gratuito ou hospedado a partir de $99 por agente/mês. Sem tarifas por minuto, sem lock-in.',
    cta_developer: 'Obter licença gratuita de developer',
    cta_pricing: 'Ver preços',
    why_title: 'Por que Verbara?',
    why_subtitle:
      'Twilio, Genesys e Five9 cobram por minuto ou $115–249/agente/mês e ficam com seus dados. Vicidial é grátis mas a UX é de 2008. Verbara fecha essa lacuna.',
    why_b1_title: 'Auditável',
    why_b1_body:
      'Backend Apache 2.0, frontend Apache 2.0, SDK MIT. Sua equipe de segurança pode ler cada linha antes de comprar.',
    why_b2_title: 'On-premise ou hospedado',
    why_b2_body:
      'Rode tudo na sua infraestrutura (Tier 1–2) ou pague por agente/mês com SLA 99,5–99,9% (Tier 3–4). Sua escolha, sem lock-in.',
    why_b3_title: 'Sem tarifas por minuto',
    why_b3_body:
      'Twilio cobra $0.014–0.045 por minuto de chamada e por mensagem. Verbara conecta direto ao seu PBX (Asterisk) — pague só sua telco.',
    stack_title: 'O stack open-core',
    stack_subtitle:
      'Quatro repositórios, um ecossistema. Cada um com a licença certa para seu papel.',
    stack_role_sdk:
      'Primitivas de telefonia (AMI / AGI / ARI / Live API / Sessions / Voice AI) — atrator de comunidade',
    stack_role_web: 'UI do operador (admin / agente / analítica / operações)',
    stack_role_platform: 'Backend de aplicação — motor completo de contact center',
    stack_role_pro:
      'Camadas comerciais (multi-tenant, analítica, cluster, licensing)',
  },
  pricing: {
    title: 'Preços',
    subtitle:
      'Plataforma open-core honesta — pague pelo motor, nunca pela UI ou pelo backend base.',
    cta_developer: 'Obter licença gratuita de developer',
    cta_buy: 'Comprar (em breve)',
    cta_sales: 'Falar com vendas',
    cta_community: 'Ver no GitHub',
    popular_badge: 'Mais popular',
    evaluators_badge: 'Para avaliadores',
    tier_0_name: 'Community',
    tier_0_price: 'Grátis',
    tier_0_tagline: 'Self-host open source. Sem chave Pro.',
    tier_0_f1: 'Verbara Sdk (MIT) — SDK base completo',
    tier_0_f2: 'Self-host do Platform + Web (Apache 2.0)',
    tier_0_f3: 'Sem funcionalidades Pro',
    tier_0_f4: 'Suporte da comunidade (issues do GitHub)',
    tier_05_name: 'Pro Developer',
    tier_05_price: 'Grátis',
    tier_05_tagline: 'Todas as funcionalidades Pro em modo WarnOnly. Autoemitida.',
    tier_05_f1: 'Todas as funcionalidades Pro desbloqueadas',
    tier_05_f2: '≤5 agentes · ≤1 nó',
    tier_05_f3: '30 dias renováveis grátis',
    tier_05_f4: 'WarnOnly (nunca bloqueia)',
    tier_1_name: 'Pro Self-Host Startup',
    tier_1_price: '$5.000 / ano',
    tier_1_tagline: 'Conjunto restrito de funcionalidades. ≤25 agentes.',
    tier_1_f1: 'Cluster, Dialer, EventStore, Routing, Realtime',
    tier_1_f2: 'Single-tenant apenas',
    tier_1_f3: '≤25 agentes · 1 cluster',
    tier_1_f4: 'Suporte por e-mail SLA 48h',
    tier_2_name: 'Pro Self-Host Business',
    tier_2_price: '$30k–50k / ano',
    tier_2_tagline: 'Todas as funcionalidades Pro. Multi-tenant. Multi-cluster.',
    tier_2_f1: 'Todas as funcionalidades Pro (incl. AgentAssist, CallAnalytics)',
    tier_2_f2: 'Isolamento multi-tenant',
    tier_2_f3: '≤500 agentes · multi-cluster',
    tier_2_f4: 'E-mail + Slack SLA 24h',
    tier_3_name: 'SaaS Business',
    tier_3_price: '$99 / agente / mês',
    tier_3_tagline: 'Hospedado pela Verbara. SLA 99,5%.',
    tier_3_f1: 'Todas as funcionalidades Tier 2, hospedado',
    tier_3_f2: 'SLA 99,5%, suporte em horário comercial',
    tier_3_f3: 'SAML básico',
    tier_3_f4: 'Mid-market (50–500 agentes)',
    tier_4_name: 'SaaS Enterprise',
    tier_4_price: '$249 / agente / mês',
    tier_4_tagline: 'Suporte 24/7. SLA 99,9%. CSM dedicado.',
    tier_4_f1: 'Funcionalidades Tier 3 +',
    tier_4_f2: 'SLA 99,9%, suporte 24/7, CSM dedicado',
    tier_4_f3: 'SAML, lista de IPs permitidas, relatórios SOC2/HIPAA/PCI',
    tier_4_f4: 'SLA personalizado',
    tier_5_name: 'White-label / OEM',
    tier_5_price: '$5k–50k + 10–30% rev share',
    tier_5_tagline: 'Remoção de marca. Acordo de revenda.',
    tier_5_f1: 'Funcionalidades Tier 4 +',
    tier_5_f2: 'Theming personalizado + remoção de marca',
    tier_5_f3: 'Acordo de revenda',
    tier_5_f4: 'Suporte de partner Tier-2',
  },
  developer_license: {
    title: 'Licença gratuita de Pro Developer',
    subtitle:
      'Avalie todas as funcionalidades do Verbara Pro sem contato com vendas. Renovação gratuita a cada 30 dias.',
    coming_soon_title: 'Autoatendimento em breve',
    coming_soon_body:
      'O portal de autoemissão Tier 0.5 entra no ar com nosso lançamento público. Enquanto isso, escreva para licensing@verbara.io para receber uma licença de developer emitida manualmente — geralmente respondemos em menos de 24 horas.',
    contact_label: 'Contato licensing@verbara.io',
    form_email_label: 'Endereço de e-mail',
    form_email_placeholder: 'voce@empresa.com',
    form_fullName_label: 'Nome completo',
    form_fullName_placeholder: 'Alice Silva',
    form_company_label: 'Empresa (opcional)',
    form_company_placeholder: 'Acme Corp',
    form_useCase_label: 'Caso de uso (opcional)',
    form_useCase_placeholder: 'Descreva brevemente como planeja avaliar o Verbara Pro',
    form_eula_label: 'Aceito o EULA e a Política de Privacidade',
    form_submit: 'Solicitar licença gratuita',
    state_submitting: 'Enviando…',
    state_success_title: 'Solicitação recebida',
    state_success_body_html:
      'Verifique <strong>{email}</strong> nos próximos 5 minutos para receber sua licença. Para renovar, preencha este mesmo formulário a qualquer momento.',
    error_email_invalid: 'Insira um endereço de e-mail válido',
    error_fullName_required: 'Nome completo é obrigatório',
    error_eula_required: 'Você deve aceitar o EULA e a Política de Privacidade',
    error_captcha_required: 'Por favor complete a verificação captcha',
    error_rate_limited:
      'Você já solicitou uma licença recentemente. Tente novamente mais tarde.',
    error_service_unavailable:
      'O serviço de emissão não está disponível no momento. Tente novamente em alguns minutos ou escreva para licensing@verbara.io.',
    error_generic:
      'Algo deu errado. Tente novamente ou escreva para licensing@verbara.io.',
    what_you_get_title: 'O que está incluído',
    what_you_get_agents: 'Até 5 agentes simultâneos',
    what_you_get_node: '1 nó de cluster',
    what_you_get_duration: 'Licença de 30 dias, renovação gratuita',
    what_you_get_features:
      'Todas as funcionalidades Pro (multi-tenant, analytics, dialer, AgentAssist, CallAnalytics)',
    what_you_get_mode: 'Modo WarnOnly — nunca bloqueia seu aplicativo',
  },
  legal_eula: {
    title: 'Contrato de licença de usuário final (EULA)',
    body: 'O EULA completo do Verbara Pro está sendo preparado por nossos advogados. O arquivo LICENSE atual do repositório Verbara.Sdk.Pro (isenção de garantia, limite de responsabilidade, restrições, lei aplicável: República da Colômbia) rege o uso até que o EULA formal seja publicado. Para consultas de licenciamento, escreva para licensing@verbara.io.',
  },
  legal_privacy: {
    title: 'Política de Privacidade',
    body: 'Nossa Política de Privacidade está sendo preparada por nossos advogados. Para consultas sobre proteção de dados, escreva para legal@verbara.io. Este site usa Cloudflare Web Analytics (sem cookies, sem rastreamento de impressão digital, totalmente anônimo).',
  },
  legal_terms: {
    title: 'Termos de Serviço',
    body: 'Os Termos de Serviço para os tiers SaaS hospedados pela Verbara (Tier 3 SaaS Business, Tier 4 SaaS Enterprise) estão sendo preparados. Para consultas comerciais, escreva para licensing@verbara.io.',
  },
};

export const messages: Record<Locale, Messages> = {
  'es-419': es_419,
  'en-US': en_US,
  'pt-BR': pt_BR,
};

// Alias for use in scripts
export const MESSAGES = messages;

/**
 * Get the messages bundle for a locale, falling back to the default.
 */
export function getMessages(locale: string | undefined): Messages {
  if (locale && (LOCALES as readonly string[]).includes(locale)) {
    return messages[locale as Locale];
  }
  return messages[DEFAULT_LOCALE];
}

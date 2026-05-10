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
  home: {
    // Hero (§7.1.1)
    hero_eyebrow: string;
    hero_h1_pre: string;
    hero_h1_accent: string;
    hero_sub: string;
    hero_cta_primary: string;
    hero_cta_secondary: string;
    hero_cta_dev_license: string;
    hero_trust_packages: string;
    hero_trust_tests: string;
    hero_trust_vulns: string;
    hero_trust_oss: string;

    // Anti-positioning (§7.1.2)
    ap_eyebrow: string;
    ap_h2_pre: string;
    ap_h2_accent: string;
    ap_sub: string;
    ap_col_verbara: string;
    ap_col_genesys: string;
    ap_col_asterisk: string;
    ap_col_vicidial: string;
    ap_row_source: string;
    ap_row_selfhost: string;
    ap_row_modern_ui: string;
    ap_row_ai: string;
    ap_row_multitenant: string;
    ap_row_latam: string;

    // How it works (§7.1.3)
    hiw_eyebrow: string;
    hiw_h2: string;
    hiw_caption: string;
    hiw_box_asterisk: string;
    hiw_box_asterisk_label: string;
    hiw_box_sdk: string;
    hiw_box_pro: string;
    hiw_box_platform: string;
    hiw_box_web: string;

    // Code proof (§7.1.4)
    cp_eyebrow: string;
    cp_h2_pre: string;
    cp_h2_accent: string;
    cp_filename: string;
    cp_caption: string;
    cp_card_packages_value: string;
    cp_card_packages_label: string;
    cp_card_tests_value: string;
    cp_card_tests_label: string;
    cp_card_vulns_value: string;
    cp_card_vulns_label: string;
    cp_card_aot_value: string;
    cp_card_aot_label: string;

    // Pricing teaser (§7.1.5)
    pt_eyebrow: string;
    pt_h2: string;
    pt_card_free_title: string;
    pt_card_free_tagline: string;
    pt_card_free_price: string;
    pt_card_free_cta: string;
    pt_card_self_title: string;
    pt_card_self_tagline: string;
    pt_card_self_price: string;
    pt_card_self_cta: string;
    pt_card_self_badge: string;
    pt_card_ent_title: string;
    pt_card_ent_tagline: string;
    pt_card_ent_price: string;
    pt_card_ent_cta: string;

    // FAQ (§7.1.6)
    faq_eyebrow: string;
    faq_h2: string;
    faq_q1: string;
    faq_a1: string;
    faq_q2: string;
    faq_a2: string;
    faq_q3: string;
    faq_a3: string;
    faq_q4: string;
    faq_a4: string;
    faq_q5: string;
    faq_a5: string;
    faq_q6: string;
    faq_a6: string;

    // Final CTA (§7.1.7)
    final_h2_pre: string;
    final_h2_accent: string;
    final_sub: string;
    final_cta: string;
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
    // Phase C — pricing redesign
    hero_h1: string;
    hero_sub: string;

    group_free_label: string;
    group_self_label: string;
    group_managed_label: string;

    matrix_eyebrow: string;
    matrix_h2: string;

    matrix_feat_oss_source: string;
    matrix_feat_pro_features: string;
    matrix_feat_multitenant: string;
    matrix_feat_clustering: string;
    matrix_feat_hosted: string;
    matrix_feat_sla: string;
    matrix_feat_support: string;
    matrix_feat_max_agents: string;
    matrix_feat_audit_retention: string;
    matrix_feat_whitelabel: string;

    matrix_support_community: string;
    matrix_support_dedicated: string;

    faq_q1: string;
    faq_a1: string;
    faq_q2: string;
    faq_a2: string;
    faq_q3: string;
    faq_a3: string;
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
  home: {
    hero_eyebrow: 'MIT SDK · Apache Platform · 0 vulns',
    hero_h1_pre: 'El contact center listo para IA que puedes',
    hero_h1_accent: 'auditar, ejecutar, poseer.',
    hero_sub: 'Open-core, CCaaS Asterisk-native para operadores cansados del vendor lock-in. Córrelo en tu data center, tu nube, o nuestro plano gestionado — tú decides.',
    hero_cta_primary: 'Corre el stack →',
    hero_cta_secondary: 'Hablar con ventas',
    hero_cta_dev_license: 'o consigue una licencia developer — gratis, firmada, válida 60 días →',
    hero_trust_packages: '27 paquetes SDK',
    hero_trust_tests: '2.893 tests unitarios',
    hero_trust_vulns: '0 paquetes vulnerables',
    hero_trust_oss: 'Open source en GitHub',

    ap_eyebrow: 'Lo que reemplazas',
    ap_h2_pre: 'Deja de rentar tu contact center.',
    ap_h2_accent: 'Empieza a correrlo.',
    ap_sub: 'Verbara está construido donde los trade-offs de los incumbentes se vuelven inaceptables: código, soberanía, costo total.',
    ap_col_verbara: 'Verbara',
    ap_col_genesys: 'Genesys / Five9',
    ap_col_asterisk: 'Asterisk + scripts',
    ap_col_vicidial: 'VICIdial / FreePBX',
    ap_row_source: 'Código disponible',
    ap_row_selfhost: 'Self-host',
    ap_row_modern_ui: 'UI de operación moderna',
    ap_row_ai: 'Pipeline AI nativo',
    ap_row_multitenant: 'Multi-tenant + clustering',
    ap_row_latam: 'LATAM por defecto (ES/PT)',

    hiw_eyebrow: 'Cómo funciona',
    hiw_h2: 'Cinco componentes, un stack, cada capa auditable.',
    hiw_caption: 'SDK y Platform son open-source. Pro añade overlays empresariales licenciados. Web es la UI de tus operadores.',
    hiw_box_asterisk: 'Asterisk PBX',
    hiw_box_asterisk_label: 'upstream',
    hiw_box_sdk: 'Verbara.Sdk',
    hiw_box_pro: 'Verbara.Sdk.Pro',
    hiw_box_platform: 'Verbara.Platform',
    hiw_box_web: 'Verbara.Platform.Web',

    cp_eyebrow: 'Lee el código',
    cp_h2_pre: 'Código real. Tests reales.',
    cp_h2_accent: 'Cero vaporware.',
    cp_filename: 'Program.cs',
    cp_caption: 'Usa Verbara.Sdk 2.1.0 — dotnet add package Verbara.Sdk →',
    cp_card_packages_value: '27',
    cp_card_packages_label: 'paquetes SDK',
    cp_card_tests_value: '2.893',
    cp_card_tests_label: 'tests unitarios pasando',
    cp_card_vulns_value: '0',
    cp_card_vulns_label: 'paquetes vulnerables',
    cp_card_aot_value: '.NET 10 AOT',
    cp_card_aot_label: 'compilación nativa anticipada',

    pt_eyebrow: 'Precios',
    pt_h2: 'Gratis para evaluar. Self-host o gestionado cuando escales.',
    pt_card_free_title: 'Gratis / Dev',
    pt_card_free_tagline: 'Tier 0 + Tier 0.5',
    pt_card_free_price: '$0',
    pt_card_free_cta: 'Ver licencia OSS →',
    pt_card_self_title: 'Self-Serve',
    pt_card_self_tagline: 'Tier 1 + Tier 2',
    pt_card_self_price: 'desde $5k/año',
    pt_card_self_cta: 'Ver planes self-host →',
    pt_card_self_badge: 'Recomendado',
    pt_card_ent_title: 'Enterprise',
    pt_card_ent_tagline: 'Tier 3 + Tier 4 + Tier 5',
    pt_card_ent_price: 'desde $99/agente/mes',
    pt_card_ent_cta: 'Hablar con ventas →',

    faq_eyebrow: 'FAQ',
    faq_h2: 'Respuestas directas.',
    faq_q1: '¿Necesito Asterisk instalado antes de adoptar Verbara?',
    faq_a1: 'Sí. Verbara está construido sobre Asterisk PBX como su substrato de telefonía — no lo reemplazamos, modernizamos la UX del operador, el pipeline de AI y los overlays Pro alrededor de él. Si no tienes Asterisk, lo despliegas junto con Verbara (setup único, bien documentado). Si ya corres Asterisk, Verbara se conecta a tu dialplan y configuración existentes.',
    faq_q2: '¿Corre en Kubernetes?',
    faq_a2: 'Sí. La Platform es K8s-native — multi-tenant y multi-clúster desde Tier 2. Los Helm charts vienen en Verbara.Sdk.Pro. También puedes correrlo en una sola VM con Docker Compose si tu escala no justifica K8s todavía — el stack es portable, sin dependencias ocultas de cloud.',
    faq_q3: '¿Qué pasa con mi deployment si dejo de pagar Pro?',
    faq_a3: 'El motor OSS (SDK MIT + Platform Apache) sigue corriendo indefinidamente — sin kill switch, sin verificación cloud. Pierdes acceso a las features Pro (multi-tenant, dialer predictivo, agent assist, clustering, overlays de analytics) cuando expira tu licencia. Datos y audit logs siguen siendo tuyos. No podemos ni vamos a desactivar una instalación que dejaste de pagar; simplemente dejamos de enviar releases nuevos de Pro.',
    faq_q4: '¿Hay SLA en la edición OSS?',
    faq_a4: 'No. La edición OSS (Tier 0) tiene soporte community vía GitHub issues y Discord público. Tiempo de respuesta best-effort. Los SLA arrancan en Tier 3 (SaaS gestionado, 99.5% uptime) y Tier 4 (99.9% con soporte 24/7 + CSM dedicado). Para tiers comerciales self-host (1, 2), soporte es email o email+Slack — rápido pero no respaldado por SLA.',
    faq_q5: '¿LATAM (ES, PT) es ciudadano de primera o traducción tardía?',
    faq_a5: 'Primera clase. El locale por defecto es es-419 (español LATAM neutro) — verbara.io/ sirve español, la versión inglesa vive en /en-US/. Documentación, soporte y UI del producto se autoran en tres locales (es-419, en-US, pt-BR) con paridad enforced en CI. Ejemplos en pricing, casos y nombres de tier se inclinan a contextos LATAM (BPO, telcos). Verbara está construido por gente que piensa en español.',
    faq_q6: '¿Cómo evalúo features Pro sin comprometerme?',
    faq_a6: 'Saca una licencia Pro Developer (Tier 0.5, gratis, auto-emitida en /developer-license/). Activa cada feature Pro en modo WarnOnly por 60 días — puedes correr multi-tenant, clustering, dialer predictivo, todo, con un warning "license expired" en logs. Después de 60 días decides: comprar un tier pago, volver a OSS, o renovar la licencia developer para otro ciclo de evaluación.',

    final_h2_pre: 'Deja de rentar tu contact center.',
    final_h2_accent: 'Empieza a correrlo.',
    final_sub: 'Licencia developer 60 días, firmada, gratis. Sin tarjeta de crédito.',
    final_cta: 'Obtén una licencia developer →',
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
    tier_05_f3: '60 días renovables gratis',
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
    hero_h1: 'Elige el tier que coincide con cómo operas.',
    hero_sub: 'Gratis para evaluar. Self-host con licencia cuando shipees. Gestionado cuando prefieras no operarlo tú.',

    group_free_label: 'Gratis · evaluadores · usuarios OSS',
    group_self_label: 'Self-host · pago anual',
    group_managed_label: 'SaaS gestionado · contact sales',

    matrix_eyebrow: 'Comparar features',
    matrix_h2: 'Cada feature, cada tier — sin asteriscos.',

    matrix_feat_oss_source: 'SDK + Platform open-source',
    matrix_feat_pro_features: 'Features Pro',
    matrix_feat_multitenant: 'Multi-tenant',
    matrix_feat_clustering: 'Clustering / multi-clúster',
    matrix_feat_hosted: 'Hospedado por Verbara',
    matrix_feat_sla: 'SLA',
    matrix_feat_support: 'Soporte',
    matrix_feat_max_agents: 'Agentes máximos',
    matrix_feat_audit_retention: 'Retención de audit log',
    matrix_feat_whitelabel: 'White-label / OEM',

    matrix_support_community: 'community',
    matrix_support_dedicated: 'dedicado',

    faq_q1: '¿Puedo subir o bajar de tier?',
    faq_a1: 'Sí, en cualquier momento. Las features se ajustan al cambio del tier; los datos y configuración persisten. Para tiers self-host, el upgrade activa features Pro adicionales en tu instalación; para SaaS gestionado, ajustamos el plan en la próxima factura prorrateada.',
    faq_q2: '¿Hay descuento anual?',
    faq_a2: 'Tiers self-host (1, 2) ya están facturados anualmente — no hay versión mensual. Tiers SaaS (3, 4) facturan mensual por defecto; commit anual con prepago da 15% de descuento. Tier 5 (white-label/OEM) negocia caso a caso.',
    faq_q3: '¿Ofrecen descuento académico o non-profit?',
    faq_a3: 'Sí. Organizaciones non-profit registradas y universidades acreditadas obtienen 50% de descuento en cualquier tier comercial. Manda licencia + comprobante a licensing@verbara.io.',
  },
  developer_license: {
    title: 'Licencia gratuita de Pro Developer',
    subtitle:
      'Evalúa todas las funciones de Verbara Pro sin contactar a ventas. Renovación gratuita cada 60 días.',
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
    what_you_get_duration: 'Licencia de 60 días, renovación gratuita',
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
  home: {
    hero_eyebrow: 'MIT SDK · Apache Platform · 0 vulns',
    hero_h1_pre: 'The AI-ready contact center you can',
    hero_h1_accent: 'audit, self-host, own.',
    hero_sub: 'Open-core, Asterisk-native CCaaS for operators tired of vendor lock-in. Run it in your data center, your cloud, or our managed plane — your call.',
    hero_cta_primary: 'Run the stack →',
    hero_cta_secondary: 'Talk to sales',
    hero_cta_dev_license: 'or get a developer license — free, signed, valid 60 days →',
    hero_trust_packages: '27 SDK packages',
    hero_trust_tests: '2,893 unit tests',
    hero_trust_vulns: '0 vulnerable packages',
    hero_trust_oss: 'Open source on GitHub',

    ap_eyebrow: 'What you replace',
    ap_h2_pre: 'Stop renting your contact center.',
    ap_h2_accent: 'Start running it.',
    ap_sub: 'Verbara is built where the trade-offs of incumbents become non-negotiable: code, sovereignty, total cost.',
    ap_col_verbara: 'Verbara',
    ap_col_genesys: 'Genesys / Five9',
    ap_col_asterisk: 'Asterisk + scripts',
    ap_col_vicidial: 'VICIdial / FreePBX',
    ap_row_source: 'Source available',
    ap_row_selfhost: 'Self-host option',
    ap_row_modern_ui: 'Modern operator UI',
    ap_row_ai: 'AI agent pipeline',
    ap_row_multitenant: 'Multi-tenant + clustering',
    ap_row_latam: 'LATAM-default (ES/PT)',

    hiw_eyebrow: 'How it works',
    hiw_h2: 'Five components, one stack, every layer auditable.',
    hiw_caption: "SDK and Platform are open. Pro adds licensed enterprise overlays. Web is your operators' UI.",
    hiw_box_asterisk: 'Asterisk PBX',
    hiw_box_asterisk_label: 'upstream',
    hiw_box_sdk: 'Verbara.Sdk',
    hiw_box_pro: 'Verbara.Sdk.Pro',
    hiw_box_platform: 'Verbara.Platform',
    hiw_box_web: 'Verbara.Platform.Web',

    cp_eyebrow: 'Read the source',
    cp_h2_pre: 'Real code. Real tests.',
    cp_h2_accent: 'No vaporware.',
    cp_filename: 'Program.cs',
    cp_caption: 'Uses Verbara.Sdk 2.1.0 — dotnet add package Verbara.Sdk →',
    cp_card_packages_value: '27',
    cp_card_packages_label: 'SDK packages',
    cp_card_tests_value: '2,893',
    cp_card_tests_label: 'unit tests passing',
    cp_card_vulns_value: '0',
    cp_card_vulns_label: 'vulnerable packages',
    cp_card_aot_value: '.NET 10 AOT',
    cp_card_aot_label: 'native ahead-of-time',

    pt_eyebrow: 'Pricing',
    pt_h2: 'Free to evaluate. Self-host or managed when you scale.',
    pt_card_free_title: 'Free / Dev',
    pt_card_free_tagline: 'Tier 0 + Tier 0.5',
    pt_card_free_price: '$0',
    pt_card_free_cta: 'See OSS license →',
    pt_card_self_title: 'Self-Serve',
    pt_card_self_tagline: 'Tier 1 + Tier 2',
    pt_card_self_price: 'from $5k/year',
    pt_card_self_cta: 'See self-host plans →',
    pt_card_self_badge: 'Recommended',
    pt_card_ent_title: 'Enterprise',
    pt_card_ent_tagline: 'Tier 3 + Tier 4 + Tier 5',
    pt_card_ent_price: 'from $99/agent/mo',
    pt_card_ent_cta: 'Talk to sales →',

    faq_eyebrow: 'FAQ',
    faq_h2: 'Direct answers.',
    faq_q1: 'Do I need an Asterisk install before adopting Verbara?',
    faq_a1: "Yes. Verbara is built on Asterisk PBX as its telephony substrate — we don't replace it, we modernize the operator UX, AI pipeline, and Pro overlays around it. If you don't have Asterisk yet, you deploy it alongside Verbara's stack (one-time setup, well-documented). If you already run Asterisk, Verbara plugs into your existing dialplan and config.",
    faq_q2: 'Does this run on Kubernetes?',
    faq_a2: "Yes. The Platform is K8s-native — multi-tenant, multi-cluster ready in Tier 2 and up. Helm charts ship in Verbara.Sdk.Pro. You can also run it on a single VM with Docker Compose if your scale doesn't justify K8s yet — the stack is portable, no hidden cloud-only dependencies.",
    faq_q3: 'What happens to my deployment if I stop paying for Pro?',
    faq_a3: "The OSS engine (SDK MIT + Platform Apache) keeps running indefinitely — no kill switch, no cloud check. You lose access to Pro features (multi-tenant, predictive dialer, agent assist, clustering, analytics overlays) when your license expires. Data and audit logs stay yours. We can't and won't disable an installation you stopped paying for; we just stop shipping new Pro releases to it.",
    faq_q4: 'Is there an SLA on the OSS edition?',
    faq_a4: "No. The OSS edition (Tier 0) is community-supported via GitHub issues and the public Discord. Response time is best-effort. SLAs start at Tier 3 (Managed SaaS, 99.5% uptime) and Tier 4 (99.9% with 24/7 support + dedicated CSM). For self-hosted commercial tiers (1, 2), support is email or email+Slack — fast but not SLA-backed.",
    faq_q5: 'Is LATAM (ES, PT) a first-class citizen or a translated afterthought?',
    faq_a5: 'First-class. The default locale is es-419 (Spanish for LATAM) — verbara.io/ serves Spanish, the English version lives at /en-US/. Documentation, support, and product UI are authored in three locales (es-419, en-US, pt-BR) with parity enforced in CI. Examples in pricing, case material, and tier names lean toward LATAM contexts (BPOs, telcos). Verbara is built by people who think in Spanish.',
    faq_q6: 'How do I evaluate Pro features without committing?',
    faq_a6: 'Get a Pro Developer license (Tier 0.5, free, self-issued at /developer-license/). It activates every Pro feature in WarnOnly mode for 60 days — you can run multi-tenant, clustering, predictive dialer, the works, with a "license expired" warning in logs. After 60 days you decide: buy a paid tier, drop back to OSS, or extend the dev license for another evaluation cycle.',

    final_h2_pre: 'Stop renting your contact center.',
    final_h2_accent: 'Start running it.',
    final_sub: '60-day developer license, signed, free. No credit card.',
    final_cta: 'Get a developer license →',
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
    tier_05_f3: '60-day rolling, free renewal',
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
    hero_h1: 'Pick the tier that matches how you operate.',
    hero_sub: 'Free to evaluate. Self-host with a license when you ship. Managed when you would rather not run it.',

    group_free_label: 'Free · evaluators · OSS users',
    group_self_label: 'Self-host · pay-once-per-year',
    group_managed_label: 'Managed SaaS · contact sales',

    matrix_eyebrow: 'Compare features',
    matrix_h2: 'Every feature, every tier — no asterisks.',

    matrix_feat_oss_source: 'SDK + Platform open-source',
    matrix_feat_pro_features: 'Pro feature set',
    matrix_feat_multitenant: 'Multi-tenant',
    matrix_feat_clustering: 'Clustering / multi-cluster',
    matrix_feat_hosted: 'Hosted by Verbara',
    matrix_feat_sla: 'SLA',
    matrix_feat_support: 'Support',
    matrix_feat_max_agents: 'Maximum agents',
    matrix_feat_audit_retention: 'Audit log retention',
    matrix_feat_whitelabel: 'White-label / OEM rights',

    matrix_support_community: 'community',
    matrix_support_dedicated: 'dedicated',

    faq_q1: 'Can I upgrade or downgrade tiers?',
    faq_a1: 'Yes, anytime. Features adjust to match the tier change; data and config persist. For self-host tiers, an upgrade enables additional Pro features in your installation; for managed SaaS, we prorate the next invoice.',
    faq_q2: 'Is there an annual discount?',
    faq_a2: 'Self-host tiers (1, 2) are already billed annually — there is no monthly version. Managed SaaS tiers (3, 4) bill monthly by default; an annual commit with prepayment gets 15% off. Tier 5 (white-label/OEM) is case-by-case.',
    faq_q3: 'Do you offer a non-profit or academic discount?',
    faq_a3: 'Yes. Registered non-profits and accredited universities get 50% off any commercial tier. Send your license proof + organization paperwork to licensing@verbara.io.',
  },
  developer_license: {
    title: 'Free Pro Developer license',
    subtitle:
      'Evaluate the full Verbara Pro feature set with no sales contact. 60-day rolling renewal.',
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
    what_you_get_duration: '60-day license, free renewal',
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
  home: {
    hero_eyebrow: 'MIT SDK · Apache Platform · 0 vulns',
    hero_h1_pre: 'O contact center pronto para IA que você pode',
    hero_h1_accent: 'auditar, executar, possuir.',
    hero_sub: 'Open-core, CCaaS Asterisk-native para operadores cansados de vendor lock-in. Rode no seu data center, sua nuvem, ou no nosso plano gerenciado — você decide.',
    hero_cta_primary: 'Rode o stack →',
    hero_cta_secondary: 'Falar com vendas',
    hero_cta_dev_license: 'ou pegue uma licença developer — grátis, assinada, válida 60 dias →',
    hero_trust_packages: '27 pacotes SDK',
    hero_trust_tests: '2.893 testes unitários',
    hero_trust_vulns: '0 pacotes vulneráveis',
    hero_trust_oss: 'Open source no GitHub',

    ap_eyebrow: 'O que você substitui',
    ap_h2_pre: 'Pare de alugar seu contact center.',
    ap_h2_accent: 'Comece a rodá-lo.',
    ap_sub: 'Verbara é construído onde os trade-offs dos incumbentes ficam inaceitáveis: código, soberania, custo total.',
    ap_col_verbara: 'Verbara',
    ap_col_genesys: 'Genesys / Five9',
    ap_col_asterisk: 'Asterisk + scripts',
    ap_col_vicidial: 'VICIdial / FreePBX',
    ap_row_source: 'Código disponível',
    ap_row_selfhost: 'Self-host',
    ap_row_modern_ui: 'UI de operação moderna',
    ap_row_ai: 'Pipeline IA nativo',
    ap_row_multitenant: 'Multi-tenant + clustering',
    ap_row_latam: 'LATAM padrão (ES/PT)',

    hiw_eyebrow: 'Como funciona',
    hiw_h2: 'Cinco componentes, um stack, cada camada auditável.',
    hiw_caption: 'SDK e Platform são open-source. Pro adiciona overlays empresariais licenciados. Web é a UI dos seus operadores.',
    hiw_box_asterisk: 'Asterisk PBX',
    hiw_box_asterisk_label: 'upstream',
    hiw_box_sdk: 'Verbara.Sdk',
    hiw_box_pro: 'Verbara.Sdk.Pro',
    hiw_box_platform: 'Verbara.Platform',
    hiw_box_web: 'Verbara.Platform.Web',

    cp_eyebrow: 'Leia o código',
    cp_h2_pre: 'Código real. Testes reais.',
    cp_h2_accent: 'Zero vaporware.',
    cp_filename: 'Program.cs',
    cp_caption: 'Usa Verbara.Sdk 2.1.0 — dotnet add package Verbara.Sdk →',
    cp_card_packages_value: '27',
    cp_card_packages_label: 'pacotes SDK',
    cp_card_tests_value: '2.893',
    cp_card_tests_label: 'testes unitários passando',
    cp_card_vulns_value: '0',
    cp_card_vulns_label: 'pacotes vulneráveis',
    cp_card_aot_value: '.NET 10 AOT',
    cp_card_aot_label: 'compilação nativa antecipada',

    pt_eyebrow: 'Preços',
    pt_h2: 'Grátis para avaliar. Self-host ou gerenciado quando escalar.',
    pt_card_free_title: 'Grátis / Dev',
    pt_card_free_tagline: 'Tier 0 + Tier 0.5',
    pt_card_free_price: '$0',
    pt_card_free_cta: 'Ver licença OSS →',
    pt_card_self_title: 'Self-Serve',
    pt_card_self_tagline: 'Tier 1 + Tier 2',
    pt_card_self_price: 'a partir de $5k/ano',
    pt_card_self_cta: 'Ver planos self-host →',
    pt_card_self_badge: 'Recomendado',
    pt_card_ent_title: 'Enterprise',
    pt_card_ent_tagline: 'Tier 3 + Tier 4 + Tier 5',
    pt_card_ent_price: 'a partir de $99/agente/mês',
    pt_card_ent_cta: 'Falar com vendas →',

    faq_eyebrow: 'FAQ',
    faq_h2: 'Respostas diretas.',
    faq_q1: 'Preciso ter Asterisk instalado antes de adotar Verbara?',
    faq_a1: 'Sim. Verbara é construído sobre Asterisk PBX como seu substrato de telefonia — não o substituímos, modernizamos a UX do operador, o pipeline de IA e os overlays Pro ao redor dele. Se você não tem Asterisk ainda, vai implantá-lo junto com Verbara (setup único, bem documentado). Se já roda Asterisk, Verbara se conecta ao seu dialplan e configuração existentes.',
    faq_q2: 'Roda em Kubernetes?',
    faq_a2: 'Sim. A Platform é K8s-native — multi-tenant e multi-cluster a partir do Tier 2. Os Helm charts vêm no Verbara.Sdk.Pro. Também dá pra rodar em uma única VM com Docker Compose se sua escala ainda não justifica K8s — o stack é portátil, sem dependências ocultas de cloud.',
    faq_q3: 'O que acontece com meu deployment se eu parar de pagar Pro?',
    faq_a3: 'O motor OSS (SDK MIT + Platform Apache) continua rodando indefinidamente — sem kill switch, sem verificação cloud. Você perde acesso às features Pro (multi-tenant, dialer preditivo, agent assist, clustering, overlays de analytics) quando sua licença expira. Dados e audit logs continuam seus. Não podemos nem vamos desativar uma instalação que você parou de pagar; simplesmente paramos de enviar releases novos de Pro.',
    faq_q4: 'Tem SLA na edição OSS?',
    faq_a4: 'Não. A edição OSS (Tier 0) tem suporte community via GitHub issues e Discord público. Tempo de resposta best-effort. SLAs começam no Tier 3 (SaaS gerenciado, 99.5% uptime) e Tier 4 (99.9% com suporte 24/7 + CSM dedicado). Para tiers comerciais self-host (1, 2), suporte é e-mail ou e-mail+Slack — rápido mas sem SLA.',
    faq_q5: 'LATAM (ES, PT) é cidadão de primeira ou tradução tardia?',
    faq_a5: 'Primeira classe. O locale padrão é es-419 (espanhol LATAM neutro) — verbara.io/ serve espanhol, a versão inglesa vive em /en-US/. Documentação, suporte e UI do produto são autorados em três locales (es-419, en-US, pt-BR) com paridade enforced em CI. Exemplos em preços, casos e nomes de tier se inclinam a contextos LATAM (BPOs, telcos). Verbara é construído por gente que pensa em espanhol.',
    faq_q6: 'Como avalio features Pro sem me comprometer?',
    faq_a6: 'Pegue uma licença Pro Developer (Tier 0.5, grátis, auto-emitida em /developer-license/). Ativa cada feature Pro em modo WarnOnly por 60 dias — você roda multi-tenant, clustering, dialer preditivo, tudo, com um warning "license expired" nos logs. Depois de 60 dias você decide: comprar um tier pago, voltar pra OSS, ou renovar a licença developer pra outro ciclo de avaliação.',

    final_h2_pre: 'Pare de alugar seu contact center.',
    final_h2_accent: 'Comece a rodá-lo.',
    final_sub: 'Licença developer 60 dias, assinada, grátis. Sem cartão de crédito.',
    final_cta: 'Pegue uma licença developer →',
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
    tier_05_f3: '60 dias renováveis grátis',
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
    hero_h1: 'Escolha o tier que combina com como você opera.',
    hero_sub: 'Grátis para avaliar. Self-host com licença quando shipar. Gerenciado quando preferir não rodar você.',

    group_free_label: 'Grátis · avaliadores · usuários OSS',
    group_self_label: 'Self-host · pagamento anual',
    group_managed_label: 'SaaS gerenciado · contact sales',

    matrix_eyebrow: 'Comparar features',
    matrix_h2: 'Cada feature, cada tier — sem asteriscos.',

    matrix_feat_oss_source: 'SDK + Platform open-source',
    matrix_feat_pro_features: 'Features Pro',
    matrix_feat_multitenant: 'Multi-tenant',
    matrix_feat_clustering: 'Clustering / multi-cluster',
    matrix_feat_hosted: 'Hospedado pela Verbara',
    matrix_feat_sla: 'SLA',
    matrix_feat_support: 'Suporte',
    matrix_feat_max_agents: 'Agentes máximos',
    matrix_feat_audit_retention: 'Retenção de audit log',
    matrix_feat_whitelabel: 'White-label / OEM',

    matrix_support_community: 'community',
    matrix_support_dedicated: 'dedicado',

    faq_q1: 'Posso subir ou descer de tier?',
    faq_a1: 'Sim, a qualquer momento. As features se ajustam à mudança de tier; dados e configuração persistem. Para tiers self-host, o upgrade ativa features Pro adicionais na sua instalação; para SaaS gerenciado, ajustamos o plano no próximo faturamento prorrateado.',
    faq_q2: 'Tem desconto anual?',
    faq_a2: 'Tiers self-host (1, 2) já são faturados anualmente — não tem versão mensal. Tiers SaaS (3, 4) faturam mensal por padrão; commit anual com pré-pagamento ganha 15% de desconto. Tier 5 (white-label/OEM) é negociado caso a caso.',
    faq_q3: 'Oferecem desconto acadêmico ou non-profit?',
    faq_a3: 'Sim. Organizações non-profit registradas e universidades credenciadas têm 50% de desconto em qualquer tier comercial. Envie comprovante da licença + documentação da organização para licensing@verbara.io.',
  },
  developer_license: {
    title: 'Licença gratuita de Pro Developer',
    subtitle:
      'Avalie todas as funcionalidades do Verbara Pro sem contato com vendas. Renovação gratuita a cada 60 dias.',
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
    what_you_get_duration: 'Licença de 60 dias, renovação gratuita',
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

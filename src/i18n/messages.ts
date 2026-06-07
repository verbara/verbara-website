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
    pricing: string;
    developer_license: string;
    github: string;
    solutions: string;
    solutions_cc: string;
    solutions_voiceai: string;
    solutions_omnichannel: string;
    solutions_cpaas: string;
    solutions_all: string;
  };
  footer: {
    tagline: string;
    column_resources: string;
    column_legal: string;
    legal_eula: string;
    legal_privacy: string;
    legal_terms: string;
    copyright: string;
    trademark: string;
    column_solutions: string;
    column_stack: string;        // replaces column_product semantically (renamed in F.3)
    solutions_cc: string;
    solutions_voiceai: string;
    solutions_omnichannel: string;
    solutions_cpaas: string;
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
    hero_trust_signed: string;
    solutions_eyebrow: string;
    solutions_h2: string;
    solutions_card_cc_eyebrow: string;
    solutions_card_cc_title: string;
    solutions_card_cc_sub: string;
    solutions_card_cc_cta: string;
    solutions_card_voiceai_eyebrow: string;
    solutions_card_voiceai_title: string;
    solutions_card_voiceai_sub: string;
    solutions_card_voiceai_cta: string;
    solutions_card_omnichannel_eyebrow: string;
    solutions_card_omnichannel_title: string;
    solutions_card_omnichannel_sub: string;
    solutions_card_omnichannel_cta: string;
    solutions_card_cpaas_eyebrow: string;
    solutions_card_cpaas_title: string;
    solutions_card_cpaas_sub: string;
    solutions_card_cpaas_cta: string;

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
    faq_q7: string;
    faq_a7: string;

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
    matrix_feat_supply_chain: string;

    matrix_support_community: string;
    matrix_support_dedicated: string;

    faq_q1: string;
    faq_a1: string;
    faq_q2: string;
    faq_a2: string;
    faq_q3: string;
    faq_a3: string;
    best_for_label: string;             // column header / line label
    best_for_t0: string;                // Tier 0 → use-cases
    best_for_t0_5: string;
    best_for_t1: string;
    best_for_t2: string;
    best_for_t3: string;
    best_for_t4: string;
    best_for_t5: string;
    subtitle_2: string;                 // new line under hero subtitle
  };
  usecases: {
    // Index page
    index_eyebrow: string;
    index_h1_pre: string;
    index_h1_accent: string;
    index_sub: string;

    // Per-spoke metadata used on the index AND on each spoke's hero
    cc_index_eyebrow: string;
    cc_index_title: string;
    cc_index_sub: string;
    cc_index_cap1: string;
    cc_index_cap2: string;
    cc_index_cap3: string;
    cc_index_cta: string;

    voiceai_index_eyebrow: string;
    voiceai_index_title: string;
    voiceai_index_sub: string;
    voiceai_index_cap1: string;
    voiceai_index_cap2: string;
    voiceai_index_cap3: string;
    voiceai_index_cta: string;

    omnichannel_index_eyebrow: string;
    omnichannel_index_title: string;
    omnichannel_index_sub: string;
    omnichannel_index_cap1: string;
    omnichannel_index_cap2: string;
    omnichannel_index_cap3: string;
    omnichannel_index_cta: string;

    cpaas_index_eyebrow: string;
    cpaas_index_title: string;
    cpaas_index_sub: string;
    cpaas_index_cap1: string;
    cpaas_index_cap2: string;
    cpaas_index_cap3: string;
    cpaas_index_cta: string;

    // (per-spoke detail blocks — added in F.1.6 through F.1.9)
    cc_hero_eyebrow: string;
    cc_hero_h1_pre: string;
    cc_hero_h1_accent: string;
    cc_hero_sub: string;
    cc_hero_cta_primary: string;
    cc_hero_cta_secondary: string;
    cc_ap_eyebrow: string;
    cc_ap_h2: string;
    cc_ap_sub: string;
    cc_ap_col_verbara: string;
    cc_ap_col_a: string;
    cc_ap_col_b: string;
    cc_ap_col_c: string;
    cc_ap_row_1: string;
    cc_ap_row_2: string;
    cc_ap_row_3: string;
    cc_ap_row_4: string;
    cc_ap_row_5: string;
    cc_ap_row_6: string;
    cc_ap_row_7: string;
    cc_ap_row_8: string;
    cc_ap_row_9: string;
    cc_cp_eyebrow: string;
    cc_cp_h2: string;
    cc_cp_filename: string;
    cc_cp_caption: string;
    cc_faq_eyebrow: string;
    cc_faq_h2: string;
    cc_faq_q1: string;
    cc_faq_a1: string;
    cc_faq_q2: string;
    cc_faq_a2: string;
    cc_faq_q3: string;
    cc_faq_a3: string;
    cc_faq_q4: string;
    cc_faq_a4: string;
    cc_faq_q5: string;
    cc_faq_a5: string;
    cc_faq_q6: string;
    cc_faq_a6: string;
    cc_pp_eyebrow: string;
    cc_pp_h2: string;
    cc_pp_body: string;
    cc_pp_cta: string;
    cc_final_h2_pre: string;
    cc_final_h2_accent: string;
    cc_final_sub: string;

    voiceai_hero_eyebrow: string;
    voiceai_hero_h1_pre: string;
    voiceai_hero_h1_accent: string;
    voiceai_hero_sub: string;
    voiceai_hero_cta_primary: string;
    voiceai_hero_cta_secondary: string;
    voiceai_ap_eyebrow: string;
    voiceai_ap_h2: string;
    voiceai_ap_sub: string;
    voiceai_ap_col_verbara: string;
    voiceai_ap_col_a: string;
    voiceai_ap_col_b: string;
    voiceai_ap_col_c: string;
    voiceai_ap_row_1: string;
    voiceai_ap_row_2: string;
    voiceai_ap_row_3: string;
    voiceai_ap_row_4: string;
    voiceai_ap_row_5: string;
    voiceai_ap_row_6: string;
    voiceai_ap_row_7: string;
    voiceai_cp_eyebrow: string;
    voiceai_cp_h2: string;
    voiceai_cp_filename: string;
    voiceai_cp_caption: string;
    voiceai_faq_eyebrow: string;
    voiceai_faq_h2: string;
    voiceai_faq_q1: string;
    voiceai_faq_a1: string;
    voiceai_faq_q2: string;
    voiceai_faq_a2: string;
    voiceai_faq_q3: string;
    voiceai_faq_a3: string;
    voiceai_faq_q4: string;
    voiceai_faq_a4: string;
    voiceai_pp_eyebrow: string;
    voiceai_pp_h2: string;
    voiceai_pp_body: string;
    voiceai_pp_cta: string;
    voiceai_final_h2_pre: string;
    voiceai_final_h2_accent: string;
    voiceai_final_sub: string;

    omnichannel_hero_eyebrow: string;
    omnichannel_hero_h1_pre: string;
    omnichannel_hero_h1_accent: string;
    omnichannel_hero_sub: string;
    omnichannel_hero_cta_primary: string;
    omnichannel_hero_cta_secondary: string;
    omnichannel_ap_eyebrow: string;
    omnichannel_ap_h2: string;
    omnichannel_ap_sub: string;
    omnichannel_ap_col_verbara: string;
    omnichannel_ap_col_a: string;
    omnichannel_ap_col_b: string;
    omnichannel_ap_col_c: string;
    omnichannel_ap_row_1: string;
    omnichannel_ap_row_2: string;
    omnichannel_ap_row_3: string;
    omnichannel_ap_row_4: string;
    omnichannel_ap_row_5: string;
    omnichannel_ap_row_6: string;
    omnichannel_ap_row_7: string;
    omnichannel_cp_eyebrow: string;
    omnichannel_cp_h2: string;
    omnichannel_cp_filename: string;
    omnichannel_cp_caption: string;
    omnichannel_faq_eyebrow: string;
    omnichannel_faq_h2: string;
    omnichannel_faq_q1: string;
    omnichannel_faq_a1: string;
    omnichannel_faq_q2: string;
    omnichannel_faq_a2: string;
    omnichannel_faq_q3: string;
    omnichannel_faq_a3: string;
    omnichannel_faq_q4: string;
    omnichannel_faq_a4: string;
    omnichannel_pp_eyebrow: string;
    omnichannel_pp_h2: string;
    omnichannel_pp_body: string;
    omnichannel_pp_cta: string;
    omnichannel_final_h2_pre: string;
    omnichannel_final_h2_accent: string;
    omnichannel_final_sub: string;

    cpaas_hero_eyebrow: string;
    cpaas_hero_h1_pre: string;
    cpaas_hero_h1_accent: string;
    cpaas_hero_sub: string;
    cpaas_hero_cta_primary: string;
    cpaas_hero_cta_secondary: string;
    cpaas_ap_eyebrow: string;
    cpaas_ap_h2: string;
    cpaas_ap_sub: string;
    cpaas_ap_col_verbara: string;
    cpaas_ap_col_a: string;
    cpaas_ap_col_b: string;
    cpaas_ap_col_c: string;
    cpaas_ap_row_1: string;
    cpaas_ap_row_2: string;
    cpaas_ap_row_3: string;
    cpaas_ap_row_4: string;
    cpaas_ap_row_5: string;
    cpaas_ap_row_6: string;
    cpaas_ap_row_7: string;
    cpaas_cp_eyebrow: string;
    cpaas_cp_h2: string;
    cpaas_cp_filename: string;
    cpaas_cp_caption: string;
    cpaas_faq_eyebrow: string;
    cpaas_faq_h2: string;
    cpaas_faq_q1: string;
    cpaas_faq_a1: string;
    cpaas_faq_q2: string;
    cpaas_faq_a2: string;
    cpaas_faq_q3: string;
    cpaas_faq_a3: string;
    cpaas_faq_q4: string;
    cpaas_faq_a4: string;
    cpaas_pp_eyebrow: string;
    cpaas_pp_h2: string;
    cpaas_pp_body: string;
    cpaas_pp_cta: string;
    cpaas_final_h2_pre: string;
    cpaas_final_h2_accent: string;
    cpaas_final_sub: string;
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
    pricing: 'Precios',
    developer_license: 'Licencia gratuita',
    github: 'GitHub',
    solutions: 'Soluciones',
    solutions_cc: 'Contact Center',
    solutions_voiceai: 'Voice AI',
    solutions_omnichannel: 'Omnichannel',
    solutions_cpaas: 'CPaaS',
    solutions_all: 'Ver todas las soluciones →',
  },
  footer: {
    tagline: 'Open-core honesto para contact center.',
    column_resources: 'Recursos',
    column_legal: 'Legal',
    legal_eula: 'EULA',
    legal_privacy: 'Privacidad',
    legal_terms: 'Términos',
    copyright: '© 2026 Harol A. Reina H. y contribuidores de Verbara.',
    trademark:
      'Verbara™. "Asterisk" es marca registrada de Sangoma Technologies / Digium; Verbara es un proyecto independiente.',
    column_solutions: 'Soluciones',
    column_stack: 'Stack',
    solutions_cc: 'Contact Center',
    solutions_voiceai: 'Voice AI',
    solutions_omnichannel: 'Omnichannel',
    solutions_cpaas: 'CPaaS',
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
    hero_h1_pre: 'El runtime open-core de comunicaciones que puedes',
    hero_h1_accent: 'auditar, ejecutar, poseer.',
    hero_sub: 'Open-core, Asterisk-native. Corre tu contact center, voice AI, omnichannel y más sobre un solo stack auditable. En tu data center, tu nube, o nuestro plano gestionado.',
    hero_cta_primary: 'Corre el stack →',
    hero_cta_secondary: 'Ver soluciones →',
    hero_cta_dev_license: 'o consigue una licencia developer — gratis, firmada, válida 30 días →',
    hero_trust_packages: '27 paquetes SDK',
    hero_trust_tests: '2.893 tests unitarios',
    hero_trust_vulns: '0 paquetes vulnerables',
    hero_trust_oss: 'Open source en GitHub',
    hero_trust_signed: 'Imágenes firmadas (cosign)',
    solutions_eyebrow: 'Soluciones',
    solutions_h2: 'Cuatro formas del mismo runtime.',
    solutions_card_cc_eyebrow: 'Voz humana',
    solutions_card_cc_title: 'Contact Center',
    solutions_card_cc_sub: 'Operación omnichannel completa con AI nativa, dialer y agent assist.',
    solutions_card_cc_cta: 'Ver solución →',
    solutions_card_voiceai_eyebrow: 'Voz IA',
    solutions_card_voiceai_title: 'Voice AI',
    solutions_card_voiceai_sub: 'Voicebots y agentes IA inbound sobre tu Asterisk PBX.',
    solutions_card_voiceai_cta: 'Ver solución →',
    solutions_card_omnichannel_eyebrow: 'Mensajería',
    solutions_card_omnichannel_title: 'Omnichannel',
    solutions_card_omnichannel_sub: 'WhatsApp, SMS, email, web — once canales en un inbox.',
    solutions_card_omnichannel_cta: 'Ver solución →',
    solutions_card_cpaas_eyebrow: 'Telefonía',
    solutions_card_cpaas_title: 'CPaaS',
    solutions_card_cpaas_sub: 'API programable sobre Asterisk. Sin tarifas por minuto.',
    solutions_card_cpaas_cta: 'Ver solución →',

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
    faq_a1: 'Sí. Verbara está construido sobre Asterisk PBX como su substrato de telefonía — no lo reemplazamos, modernizamos la UX del operador, el pipeline de AI y los overlays Pro alrededor de él. Si no tienes Asterisk, lo despliegas junto con Verbara (setup único, bien documentado). Si ya corres Asterisk, Verbara se conecta a tu dialplan y configuración existentes. Esto aplica para cualquier use-case: contact center, voice AI, omnichannel o CPaaS.',
    faq_q2: '¿Corre en Kubernetes?',
    faq_a2: 'Sí. La Platform es K8s-native — multi-tenant y multi-clúster desde Tier 2. Los Helm charts vienen en Verbara.Sdk.Pro. También puedes correrlo en una sola VM con Docker Compose si tu escala no justifica K8s todavía — el stack es portable, sin dependencias ocultas de cloud.',
    faq_q3: '¿Qué pasa con mi deployment si dejo de pagar Pro?',
    faq_a3: 'El motor OSS (SDK MIT + Platform Apache) sigue corriendo indefinidamente — sin kill switch, sin verificación cloud. Pierdes acceso a las features Pro (multi-tenant, dialer predictivo, agent assist, clustering, overlays de analytics) cuando expira tu licencia. Datos y audit logs siguen siendo tuyos. No podemos ni vamos a desactivar una instalación que dejaste de pagar; simplemente dejamos de enviar releases nuevos de Pro.',
    faq_q4: '¿Hay SLA en la edición OSS?',
    faq_a4: 'No. La edición OSS (Tier 0) tiene soporte community vía GitHub issues y Discord público. Tiempo de respuesta best-effort. Los SLA arrancan en Tier 3 (SaaS gestionado, 99.5% uptime) y Tier 4 (99.9% con soporte 24/7 + CSM dedicado). Para tiers comerciales self-host (1, 2), soporte es email o email+Slack — rápido pero no respaldado por SLA.',
    faq_q5: '¿LATAM (ES, PT) es ciudadano de primera o traducción tardía?',
    faq_a5: 'Primera clase. El locale por defecto es es-419 (español LATAM neutro) — verbara.io/ sirve español, la versión inglesa vive en /en-US/. Documentación, soporte y UI del producto se autoran en tres locales (es-419, en-US, pt-BR) con paridad enforced en CI. Ejemplos en pricing, casos y nombres de tier se inclinan a contextos LATAM (BPO, telcos). Verbara está construido por gente que piensa en español.',
    faq_q6: '¿Por dónde empiezo según mi use-case?',
    faq_a6: 'Cada solución tiene su propia página con código, anti-positioning y FAQ específicos: contact-center para BPO/telco, voice-ai para voicebots inbound, omnichannel para WhatsApp/SMS/email, cpaas para telefonía programable embebida. Saca una licencia Pro Developer (Tier 0.5, gratis, 30 días) que desbloquea todas las features Pro en modo WarnOnly — evalúa el use-case que más te encaje sin compromiso.',
    faq_q7: '¿Cómo verifico que la imagen que despliego es la real?',
    faq_a7: 'Cada imagen de Verbara Platform (api, realtime, renderer, mail, web) está firmada con cosign y se ancla por digest de manifest-list — el mismo valor que cosign firma. Verificas cualquier imagen con la llave pública que publicamos en verbara.io/keys/cosign.pub: `cosign verify --key https://verbara.io/keys/cosign.pub --insecure-ignore-tlog ghcr.io/verbara/platform/api:vX.Y.Z`. Y va más allá del pull: tu licencia Pro (.lic) embebe los digests autorizados (hoy api + realtime), así que las features Pro quedan atadas a imágenes firmadas por digest. Un cron diario re-verifica los digests contra el registry y avisa si alguno mutó.',

    final_h2_pre: 'Deja de rentar tu stack de comunicaciones.',
    final_h2_accent: 'Empieza a correrlo.',
    final_sub: 'Licencia developer 30 días, firmada, gratis. Sin tarjeta de crédito.',
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
    matrix_feat_supply_chain: 'Verificación de cadena de suministro',

    matrix_support_community: 'community',
    matrix_support_dedicated: 'dedicado',

    faq_q1: '¿Puedo subir o bajar de tier?',
    faq_a1: 'Sí, en cualquier momento. Las features se ajustan al cambio del tier; los datos y configuración persisten. Para tiers self-host, el upgrade activa features Pro adicionales en tu instalación; para SaaS gestionado, ajustamos el plan en la próxima factura prorrateada.',
    faq_q2: '¿Hay descuento anual?',
    faq_a2: 'Tiers self-host (1, 2) ya están facturados anualmente — no hay versión mensual. Tiers SaaS (3, 4) facturan mensual por defecto; commit anual con prepago da 15% de descuento. Tier 5 (white-label/OEM) negocia caso a caso.',
    faq_q3: '¿Ofrecen descuento académico o non-profit?',
    faq_a3: 'Sí. Organizaciones non-profit registradas y universidades acreditadas obtienen 50% de descuento en cualquier tier comercial. Manda licencia + comprobante a licensing@verbara.io.',
    best_for_label: 'Mejor para',
    best_for_t0: 'Voice AI · CPaaS · CC (≤5 agentes evaluación)',
    best_for_t0_5: 'Cualquier use-case en evaluación de 30 días',
    best_for_t1: 'CC · CPaaS pequeño',
    best_for_t2: 'CC multi-tenant · Omnichannel · Voice AI productivo',
    best_for_t3: 'CC hospedado · Voice AI hospedado',
    best_for_t4: 'CC enterprise · Compliance-grade voice',
    best_for_t5: 'CPaaS white-label · Vertical resellers',
    subtitle_2: 'Cualquier tier sirve cualquier use-case — la diferencia es escala, multi-tenant y SLA.',
  },
  usecases: {
    index_eyebrow: 'Soluciones',
    index_h1_pre: 'Un runtime,',
    index_h1_accent: 'cuatro formas.',
    index_sub: 'El mismo motor open-core sirve cuatro use-cases distintos. Elige el que coincide con cómo operas.',

    cc_index_eyebrow: 'Voz humana',
    cc_index_title: 'Contact Center',
    cc_index_sub: 'Operación omnichannel completa con AI nativa, dialer predictivo y agent assist en tiempo real.',
    cc_index_cap1: 'Multi-tenant + clustering',
    cc_index_cap2: 'Speech analytics post-llamada',
    cc_index_cap3: 'Wallboard + SLA tracking',
    cc_index_cta: 'Ver solución →',

    voiceai_index_eyebrow: 'Voz IA',
    voiceai_index_title: 'Voice AI',
    voiceai_index_sub: 'Voicebots y agentes IA inbound sobre tu Asterisk PBX. Sin SIP gymnastics.',
    voiceai_index_cap1: '6 STT · 6 TTS · OpenAI Realtime bridge',
    voiceai_index_cap2: 'Smart Turn detection + barge-in',
    voiceai_index_cap3: 'Self-host o hospedado',
    voiceai_index_cta: 'Ver solución →',

    omnichannel_index_eyebrow: 'Mensajería',
    omnichannel_index_title: 'Omnichannel',
    omnichannel_index_sub: 'Once canales en un solo inbox. WhatsApp Meta directo, sin intermediarios.',
    omnichannel_index_cap1: '11 conectores · WhatsApp 24h window',
    omnichannel_index_cap2: 'Flows DAG con nodos LLM',
    omnichannel_index_cap3: 'Multi-tenant white-label',
    omnichannel_index_cta: 'Ver solución →',

    cpaas_index_eyebrow: 'Telefonía',
    cpaas_index_title: 'CPaaS',
    cpaas_index_sub: 'AMI · AGI · ARI · Live API. La telefonía como librería, no como servicio rentado.',
    cpaas_index_cap1: 'Sin tarifas por minuto',
    cpaas_index_cap2: 'Federación multi-servidor',
    cpaas_index_cap3: 'Activities state-machines',
    cpaas_index_cta: 'Ver solución →',

    cc_hero_eyebrow: 'Solución · Contact Center',
    cc_hero_h1_pre: 'El contact center que tu equipo de seguridad',
    cc_hero_h1_accent: 'puede leer.',
    cc_hero_sub: 'Para BPO ops leads, telco product owners y MSP/integradores que operan tráfico real. Open-core de extremo a extremo, sin tarifas por minuto, multi-tenant nativo y softphone WebRTC en el navegador.',
    cc_hero_cta_primary: 'Licencia developer →',
    cc_hero_cta_secondary: 'Ver pricing CC',
    cc_ap_eyebrow: 'Lo que reemplazas',
    cc_ap_h2: 'Deja de rentar tu contact center.',
    cc_ap_sub: 'Cuatro categorías de incumbentes — y dónde Verbara cierra cada brecha.',
    cc_ap_col_verbara: 'Verbara',
    cc_ap_col_a: 'Genesys / Five9',
    cc_ap_col_b: 'Asterisk + scripts',
    cc_ap_col_c: 'VICIdial / FreePBX',
    cc_ap_row_1: 'Código disponible',
    cc_ap_row_2: 'Self-host',
    cc_ap_row_3: 'UI moderna',
    cc_ap_row_4: 'Pipeline AI nativo',
    cc_ap_row_5: 'Multi-tenant + clustering',
    cc_ap_row_6: 'Speech analytics',
    cc_ap_row_7: 'LATAM por defecto (ES/PT)',
    cc_ap_row_8: 'Softphone WebRTC en el navegador',
    cc_ap_row_9: 'Config de troncales/DID por UI',
    cc_cp_eyebrow: 'Lee el código',
    cc_cp_h2: 'Operación CC en código real.',
    cc_cp_filename: 'CallCenterHost.cs',
    cc_cp_caption: 'Verbara.Platform — bootstrap del API CC con multi-tenant + Pro features →',
    cc_faq_eyebrow: 'FAQ · Contact Center',
    cc_faq_h2: 'Preguntas de operadores.',
    cc_faq_q1: '¿Cuántos agentes simultáneos soporta?',
    cc_faq_a1: 'Tier 1 self-host está limitado a 25 agentes; Tier 2 sube a 500 con multi-clúster; SaaS Business (Tier 3) y Enterprise (Tier 4) escalan según contrato. La cuota es por licencia, no técnica — el motor escala horizontalmente con clustering Pro.',
    cc_faq_q2: '¿Multi-tenant para BPOs?',
    cc_faq_a2: 'Sí, desde Tier 2 self-host. Aislamiento estricto por tenant, routing por skill por tenant, impersonation cross-tenant para administración. Cada cliente del BPO ve solo su data y sus agentes.',
    cc_faq_q3: '¿Compatibilidad con mi PBX existente?',
    cc_faq_a3: 'Si tu PBX es Asterisk (cualquier versión 16+), Verbara conecta a tu dialplan vía AMI/ARI. Si tu PBX es Cisco/Avaya, necesitas un gateway SIP a Asterisk; soportamos los más comunes en docs.',
    cc_faq_q4: '¿Mis agentes necesitan un teléfono físico o un softphone instalado?',
    cc_faq_a4: 'No. Verbara trae un softphone WebRTC dentro del workspace del agente: toman y hacen llamadas directo desde el navegador, sin teléfono de escritorio ni software de softphone que instalar y mantener. El agente entra a la URL, registra su extensión y ya está en línea — ideal para equipos remotos y BPOs que no quieren administrar hardware ni perfiles de softphone por puesto.',
    cc_faq_q5: '¿Tengo que editar el dialplan de Asterisk para conectar troncales y números?',
    cc_faq_a5: 'No. Las troncales SIP y los DID se configuran desde la UI de administración con un asistente guiado, incluido un test de conectividad que valida el registro de la troncal antes de poner tráfico en producción. Sin editar archivos de dialplan a mano ni reiniciar Asterisk para cada cambio. Si prefieres dialplan crudo, sigue siendo tu Asterisk — pero la mayoría de la operación diaria ya no lo requiere.',
    cc_faq_q6: '¿Qué pasa si a un agente se le cae el internet o cierra la pestaña a mitad de turno?',
    cc_faq_a6: 'Verbara lo detecta. Un heartbeat de liveness identifica al agente desconectado o "zombie" y reacciona: el trabajo digital huérfano (chats, WhatsApp, email) se re-encola automáticamente al frente de su cola para el siguiente agente vivo, y si una llamada de voz se cae con el cliente en línea, el cliente recibe un callback prioritario al siguiente agente disponible de su cola de origen. Además, defines límites de capacidad concurrente por canal y un MaxTotal entre canales asíncronos, con default por tenant y override por agente — para que nadie quede sobre-asignado.',
    cc_pp_eyebrow: 'Precios CC',
    cc_pp_h2: '¿Qué tier necesitas?',
    cc_pp_body: 'Tier 1 ($5k/año) para arrancar single-tenant ≤25 agentes. Tier 2 ($30-50k/año) para multi-tenant + multi-clúster. Tier 3 ($99/agente/mes) si prefieres hospedado. Tier 4 ($249/agente/mes) para SOC2/HIPAA + 24/7.',
    cc_pp_cta: 'Ver pricing completo →',
    cc_final_h2_pre: 'El CC que',
    cc_final_h2_accent: 'puedes auditar.',
    cc_final_sub: 'Licencia developer 30 días, firmada, gratis. Evalúa todo Pro sin compromiso.',

    voiceai_hero_eyebrow: 'Solución · Voice AI',
    voiceai_hero_h1_pre: 'Voicebots inbound',
    voiceai_hero_h1_accent: 'sobre tu PBX.',
    voiceai_hero_sub: 'STT, TTS y turn-taking nativos sobre Asterisk. Sin SIP gymnastics, sin per-minute, sin lock-in al proveedor de voz.',
    voiceai_hero_cta_primary: 'Licencia developer →',
    voiceai_hero_cta_secondary: 'Ver código',
    voiceai_ap_eyebrow: 'Lo que reemplazas',
    voiceai_ap_h2: 'Voicebots sin alquilar la voz.',
    voiceai_ap_sub: 'Las plataformas SaaS de voicebot te cobran por minuto y te lockean al stack de un proveedor. Verbara hace lo opuesto.',
    voiceai_ap_col_verbara: 'Verbara',
    voiceai_ap_col_a: 'Vapi',
    voiceai_ap_col_b: 'Bland.ai · Retell',
    voiceai_ap_col_c: 'Pipecat (OSS)',
    voiceai_ap_row_1: 'Open-core',
    voiceai_ap_row_2: 'Self-host completo',
    voiceai_ap_row_3: 'Asterisk-native (sin SIP gymnastics)',
    voiceai_ap_row_4: 'Multi-tenant',
    voiceai_ap_row_5: '6 STT + 6 TTS swappables',
    voiceai_ap_row_6: 'OpenAI Realtime bridge',
    voiceai_ap_row_7: 'Smart Turn + barge-in',
    voiceai_cp_eyebrow: 'Lee el código',
    voiceai_cp_h2: 'Un voicebot en 30 líneas.',
    voiceai_cp_filename: 'VoiceAgent.cs',
    voiceai_cp_caption: 'Verbara.Sdk.VoiceAI — agente Deepgram + ElevenLabs respondiendo a llamada Asterisk →',
    voiceai_faq_eyebrow: 'FAQ · Voice AI',
    voiceai_faq_h2: 'Preguntas de builders.',
    voiceai_faq_q1: '¿Qué proveedores de STT/TTS soporta?',
    voiceai_faq_a1: 'STT: Deepgram, Google, Whisper, Azure, Cartesia, AssemblyAI, Speechmatics. TTS: ElevenLabs Flash 2.5, Deepgram Aura 2, LMNT, Azure, Cartesia, Speechmatics. Plus bridge directo al OpenAI Realtime API. Swappables vía configuración, no recompilación.',
    voiceai_faq_q2: '¿Cuál es la latencia end-to-end?',
    voiceai_faq_a2: 'Con Smart Turn detection + Deepgram Nova + ElevenLabs Flash 2.5 + barge-in: ~600ms p95 desde fin-de-frase del humano hasta primer phoneme TTS, midiendo en infra propia con VU 100. Latencia exacta depende de tu infra y el LLM upstream.',
    voiceai_faq_q3: '¿Self-host sin telefonía propia?',
    voiceai_faq_a3: 'Necesitas un PBX Asterisk para que el SDK reciba audio (puede ser tuyo, de un cliente, o desplegado junto con Verbara). Si quieres voicebots sin operar telefonía, Tier 3+ SaaS hospedado incluye PBX gestionado.',
    voiceai_faq_q4: '¿Cómo escalo a agentes humanos cuando el voicebot transfiere?',
    voiceai_faq_a4: 'El voicebot vive sobre el mismo runtime que el contact center, así que un escalamiento a humano aterriza en un agente real con softphone WebRTC en el navegador — sin teléfono de escritorio ni instalación. Y si a ese agente se le cae la conexión a mitad de la llamada transferida, el liveness de presencia lo detecta y dispara un callback prioritario al cliente hacia el siguiente agente vivo. La voz IA y la humana comparten cola, no son dos productos pegados con cinta.',
    voiceai_pp_eyebrow: 'Precios Voice AI',
    voiceai_pp_h2: '¿Por dónde empiezas?',
    voiceai_pp_body: 'Tier 0 community gratis para evaluación con SDK MIT directo. Tier 0.5 (Pro Developer, gratis 30 días) para todas las features Pro. Tier 1+ cuando shipees a producción single-tenant.',
    voiceai_pp_cta: 'Ver pricing completo →',
    voiceai_final_h2_pre: 'Voicebots',
    voiceai_final_h2_accent: 'sin renta.',
    voiceai_final_sub: 'Licencia developer 30 días, firmada, gratis. SDK MIT — léelo entero antes de adoptar.',

    omnichannel_hero_eyebrow: 'Solución · Omnichannel',
    omnichannel_hero_h1_pre: 'Once canales,',
    omnichannel_hero_h1_accent: 'un inbox.',
    omnichannel_hero_sub: 'WhatsApp Meta directo (sin BSP intermedio), SMS, email, WebChat, Telegram, IG, Messenger y más. Multi-tenant, con Flows DAG y nodos LLM.',
    omnichannel_hero_cta_primary: 'Licencia developer →',
    omnichannel_hero_cta_secondary: 'Ver código',
    omnichannel_ap_eyebrow: 'Lo que reemplazas',
    omnichannel_ap_h2: 'Once canales sin per-message.',
    omnichannel_ap_sub: 'Los CPaaS de mensajería cobran por mensaje + por proveedor + por canal. Verbara los unifica.',
    omnichannel_ap_col_verbara: 'Verbara',
    omnichannel_ap_col_a: 'Twilio Conv.',
    omnichannel_ap_col_b: 'Sinch · MessageBird',
    omnichannel_ap_col_c: 'Chatwoot (OSS)',
    omnichannel_ap_row_1: 'Open-core',
    omnichannel_ap_row_2: 'Self-host',
    omnichannel_ap_row_3: '11 conectores out-of-box',
    omnichannel_ap_row_4: 'WhatsApp Meta directo',
    omnichannel_ap_row_5: 'Flows DAG con nodos LLM',
    omnichannel_ap_row_6: 'Multi-tenant white-label',
    omnichannel_ap_row_7: 'Voz nativa integrada',
    omnichannel_cp_eyebrow: 'Lee el código',
    omnichannel_cp_h2: 'Una sola cola para todo.',
    omnichannel_cp_filename: 'OmnichannelRouter.cs',
    omnichannel_cp_caption: 'Verbara.Platform — WhatsApp + SMS + WebChat en un Flow DAG con 1 nodo LLM →',
    omnichannel_faq_eyebrow: 'FAQ · Omnichannel',
    omnichannel_faq_h2: 'Preguntas de mensajería.',
    omnichannel_faq_q1: '¿WhatsApp Business API directo o vía BSP?',
    omnichannel_faq_a1: 'Directo a Meta. Verbara implementa el WhatsApp Business Cloud API con HMAC verification y manejo de la ventana de 24h. Tú obtienes tu propio Business Account, sin BSP entre tú y Meta. Templates approved se gestionan vía Flows.',
    omnichannel_faq_q2: '¿Soporta SMS bulk con providers regionales?',
    omnichannel_faq_a2: 'Sí. El conector SMS es provider-agnostic con un provider Twilio incluido por defecto, plus segment calculation. Para LATAM, providers regionales (Infobip, Movile, etc.) se conectan implementando un IProvider — un par de horas de trabajo.',
    omnichannel_faq_q3: '¿Cómo se enrutan conversaciones cross-canal?',
    omnichannel_faq_a3: 'El módulo Conversations correlaciona por contacto: si un cliente escribe por WhatsApp y luego por email, ambos hits aterrizan en la misma conversación con timeline unificada. Routing es por skill/queue/team, no por canal — el operador ve toda la historia.',
    omnichannel_faq_q4: '¿Cuántas conversaciones simultáneas puede manejar un agente?',
    omnichannel_faq_a4: 'Tú lo defines. La capacidad concurrente es configurable por canal (chat, email, SMS, voz) más un MaxTotal entre canales asíncronos, con un default por tenant y override por agente — un senior puede llevar más chats que un junior sin tocar a nadie más. Y si un agente se desconecta, su trabajo digital en curso se re-encola al frente de su cola para el siguiente agente vivo, así que la carga no se queda atascada en una pestaña muerta.',
    omnichannel_pp_eyebrow: 'Precios Omnichannel',
    omnichannel_pp_h2: '¿Qué tier necesitas?',
    omnichannel_pp_body: 'Tier 0 community para evaluación self-host. Tier 2 ($30-50k/año) para multi-tenant en SaaS propio. Tier 3+ ($99/agente/mes) si prefieres hospedado con SLA.',
    omnichannel_pp_cta: 'Ver pricing completo →',
    omnichannel_final_h2_pre: 'Once canales,',
    omnichannel_final_h2_accent: 'sin per-message.',
    omnichannel_final_sub: 'Licencia developer 30 días, firmada, gratis. WhatsApp Meta directo, sin intermediarios.',

    cpaas_hero_eyebrow: 'Solución · CPaaS',
    cpaas_hero_h1_pre: 'Telefonía como librería,',
    cpaas_hero_h1_accent: 'no como renta.',
    cpaas_hero_sub: 'AMI · AGI · ARI · Live API · Activities. SDK MIT con federación multi-servidor, sin tarifas por minuto. Tu Asterisk, tu telco, tu código.',
    cpaas_hero_cta_primary: 'dotnet add package Verbara.Sdk',
    cpaas_hero_cta_secondary: 'Ver código',
    cpaas_ap_eyebrow: 'Lo que reemplazas',
    cpaas_ap_h2: 'CPaaS sin per-minute.',
    cpaas_ap_sub: 'Los CPaaS cobran $0.014–0.045 por minuto y te encierran en su SIP. Verbara conecta directo a tu telco.',
    cpaas_ap_col_verbara: 'Verbara',
    cpaas_ap_col_a: 'Twilio',
    cpaas_ap_col_b: 'Vonage · Plivo',
    cpaas_ap_col_c: 'Jambonz (OSS)',
    cpaas_ap_row_1: 'Open-core MIT',
    cpaas_ap_row_2: 'Sin tarifas por minuto',
    cpaas_ap_row_3: 'Asterisk-native',
    cpaas_ap_row_4: 'Federación multi-servidor',
    cpaas_ap_row_5: 'Activities state-machines',
    cpaas_ap_row_6: 'Barge-in + turn-taking',
    cpaas_ap_row_7: 'Multi-tenant licensing',
    cpaas_cp_eyebrow: 'Lee el código',
    cpaas_cp_h2: 'Outbound call + bridge + record.',
    cpaas_cp_filename: 'OutboundCallExample.cs',
    cpaas_cp_caption: 'Verbara.Sdk.Ari — coloca llamada outbound, hace bridge entre dos canales, graba el resultado →',
    cpaas_faq_eyebrow: 'FAQ · CPaaS',
    cpaas_faq_h2: 'Preguntas de telefonía.',
    cpaas_faq_q1: '¿Necesito operar mi propio Asterisk?',
    cpaas_faq_a1: 'Sí. Verbara es una librería sobre Asterisk; opera el PBX (tuyo, on-prem o en cloud) y conecta el SDK vía AMI/ARI. Si quieres CPaaS sin operar telefonía, mira Tier 3+ SaaS hospedado donde el PBX viene gestionado.',
    cpaas_faq_q2: '¿Qué codecs soporta?',
    cpaas_faq_a2: 'El SDK pasa el audio que Asterisk te entrega — soporta los codecs que tu Asterisk soporte (G.711, G.722, Opus, PCM, etc.). El pipeline VoiceAI hace resampling interno entre formatos cuando el LLM/TTS necesita 16kHz PCM.',
    cpaas_faq_q3: '¿Federación multi-servidor de qué escala?',
    cpaas_faq_a3: 'VerbaraServerPool soporta arbitrarios servidores Asterisk con failover y routing por canal/tenant. Hemos validado pools de hasta 8 nodos en R5.5 production validation; más allá depende de tu infra de PBX.',
    cpaas_faq_q4: '¿Cómo embebo voz para humanos, no solo APIs?',
    cpaas_faq_a4: 'Además de AMI/AGI/ARI/Live API para tu telefonía programable, la Platform incluye un softphone WebRTC dentro del workspace completo del agente — un puesto de operador en el navegador, no solo audio WebRTC suelto. Toman y hacen llamadas sin teléfono de escritorio ni softphone que instalar. Y conectas tus troncales SIP y DID desde la UI con un asistente guiado y test de conectividad, sin editar dialplan a mano. Las primitivas crudas siguen ahí cuando quieras construir; el puesto humano viene listo cuando lo necesitas.',
    cpaas_pp_eyebrow: 'Precios CPaaS',
    cpaas_pp_h2: '¿Qué necesitas licenciar?',
    cpaas_pp_body: 'Tier 0 community gratis con SDK MIT directo (community + community telephony primitives). Tier 1+ desbloquea features Pro: clustering, multi-tenant, dialer, agent assist. Tier 5 white-label para resellers.',
    cpaas_pp_cta: 'Ver pricing completo →',
    cpaas_final_h2_pre: 'Telefonía',
    cpaas_final_h2_accent: 'que sí posees.',
    cpaas_final_sub: 'Licencia developer 30 días, firmada, gratis. SDK MIT — la base es tuya para siempre.',
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
    pricing: 'Pricing',
    developer_license: 'Free license',
    github: 'GitHub',
    solutions: 'Solutions',
    solutions_cc: 'Contact Center',
    solutions_voiceai: 'Voice AI',
    solutions_omnichannel: 'Omnichannel',
    solutions_cpaas: 'CPaaS',
    solutions_all: 'See all solutions →',
  },
  footer: {
    tagline: 'Open-core honest contact-center platform.',
    column_resources: 'Resources',
    column_legal: 'Legal',
    legal_eula: 'EULA',
    legal_privacy: 'Privacy',
    legal_terms: 'Terms',
    copyright: '© 2026 Harol A. Reina H. and Verbara Contributors.',
    trademark:
      'Verbara™. "Asterisk" is a registered trademark of Sangoma Technologies / Digium; Verbara is an independent project.',
    column_solutions: 'Solutions',
    column_stack: 'Stack',
    solutions_cc: 'Contact Center',
    solutions_voiceai: 'Voice AI',
    solutions_omnichannel: 'Omnichannel',
    solutions_cpaas: 'CPaaS',
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
    hero_h1_pre: 'The open-core comms runtime you can',
    hero_h1_accent: 'audit, self-host, own.',
    hero_sub: 'Open-core, Asterisk-native. Run your contact center, voice AI, omnichannel, and more on one auditable stack. In your data center, your cloud, or our managed plane.',
    hero_cta_primary: 'Run the stack →',
    hero_cta_secondary: 'See solutions →',
    hero_cta_dev_license: 'or get a developer license — free, signed, valid 30 days →',
    hero_trust_packages: '27 SDK packages',
    hero_trust_tests: '2,893 unit tests',
    hero_trust_vulns: '0 vulnerable packages',
    hero_trust_oss: 'Open source on GitHub',
    hero_trust_signed: 'Cosign-signed images',
    solutions_eyebrow: 'Solutions',
    solutions_h2: 'Four shapes of the same runtime.',
    solutions_card_cc_eyebrow: 'Human voice',
    solutions_card_cc_title: 'Contact Center',
    solutions_card_cc_sub: 'Full omnichannel operation with native AI, dialer, and agent assist.',
    solutions_card_cc_cta: 'See solution →',
    solutions_card_voiceai_eyebrow: 'AI voice',
    solutions_card_voiceai_title: 'Voice AI',
    solutions_card_voiceai_sub: 'Voicebots and inbound AI agents on top of your Asterisk PBX.',
    solutions_card_voiceai_cta: 'See solution →',
    solutions_card_omnichannel_eyebrow: 'Messaging',
    solutions_card_omnichannel_title: 'Omnichannel',
    solutions_card_omnichannel_sub: 'WhatsApp, SMS, email, web — eleven channels in one inbox.',
    solutions_card_omnichannel_cta: 'See solution →',
    solutions_card_cpaas_eyebrow: 'Telephony',
    solutions_card_cpaas_title: 'CPaaS',
    solutions_card_cpaas_sub: 'Programmable API on top of Asterisk. No per-minute fees.',
    solutions_card_cpaas_cta: 'See solution →',

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
    faq_a1: "Yes. Verbara is built on Asterisk PBX as its telephony substrate — we don't replace it, we modernize the operator UX, the AI pipeline, and the Pro overlays around it. If you don't have Asterisk, you deploy it alongside Verbara (one-time, well-documented setup). If you already run Asterisk, Verbara connects to your existing dialplan and config. This applies for any use-case: contact center, voice AI, omnichannel, or CPaaS.",
    faq_q2: 'Does this run on Kubernetes?',
    faq_a2: "Yes. The Platform is K8s-native — multi-tenant, multi-cluster ready in Tier 2 and up. Helm charts ship in Verbara.Sdk.Pro. You can also run it on a single VM with Docker Compose if your scale doesn't justify K8s yet — the stack is portable, no hidden cloud-only dependencies.",
    faq_q3: 'What happens to my deployment if I stop paying for Pro?',
    faq_a3: "The OSS engine (SDK MIT + Platform Apache) keeps running indefinitely — no kill switch, no cloud check. You lose access to Pro features (multi-tenant, predictive dialer, agent assist, clustering, analytics overlays) when your license expires. Data and audit logs stay yours. We can't and won't disable an installation you stopped paying for; we just stop shipping new Pro releases to it.",
    faq_q4: 'Is there an SLA on the OSS edition?',
    faq_a4: "No. The OSS edition (Tier 0) is community-supported via GitHub issues and the public Discord. Response time is best-effort. SLAs start at Tier 3 (Managed SaaS, 99.5% uptime) and Tier 4 (99.9% with 24/7 support + dedicated CSM). For self-hosted commercial tiers (1, 2), support is email or email+Slack — fast but not SLA-backed.",
    faq_q5: 'Is LATAM (ES, PT) a first-class citizen or a translated afterthought?',
    faq_a5: 'First-class. The default locale is es-419 (Spanish for LATAM) — verbara.io/ serves Spanish, the English version lives at /en-US/. Documentation, support, and product UI are authored in three locales (es-419, en-US, pt-BR) with parity enforced in CI. Examples in pricing, case material, and tier names lean toward LATAM contexts (BPOs, telcos). Verbara is built by people who think in Spanish.',
    faq_q6: 'Where do I start based on my use-case?',
    faq_a6: "Each solution has its own page with code, anti-positioning, and use-case-specific FAQ: contact-center for BPO/telco, voice-ai for inbound voicebots, omnichannel for WhatsApp/SMS/email, cpaas for embedded programmable telephony. Grab a Pro Developer license (Tier 0.5, free, 30 days) that unlocks every Pro feature in WarnOnly mode — evaluate the use-case that fits without commitment.",
    faq_q7: 'How do I verify the image I deploy is the real one?',
    faq_a7: 'Every Verbara Platform image (api, realtime, renderer, mail, web) is cosign-signed and pinned by manifest-list digest — the exact value cosign signs. Verify any image with the public key we publish at verbara.io/keys/cosign.pub: `cosign verify --key https://verbara.io/keys/cosign.pub --insecure-ignore-tlog ghcr.io/verbara/platform/api:vX.Y.Z`. And it goes beyond the pull: your Pro license (.lic) embeds the authorized image digests (today api + realtime), so Pro features are bound to signed images by digest. A daily cron re-verifies those digests against the registry and alerts us if any one mutates.',

    final_h2_pre: 'Stop renting your comms stack.',
    final_h2_accent: 'Start running it.',
    final_sub: '30-day developer license, signed, free. No credit card.',
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
    matrix_feat_supply_chain: 'Supply-chain verification',

    matrix_support_community: 'community',
    matrix_support_dedicated: 'dedicated',

    faq_q1: 'Can I upgrade or downgrade tiers?',
    faq_a1: 'Yes, anytime. Features adjust to match the tier change; data and config persist. For self-host tiers, an upgrade enables additional Pro features in your installation; for managed SaaS, we prorate the next invoice.',
    faq_q2: 'Is there an annual discount?',
    faq_a2: 'Self-host tiers (1, 2) are already billed annually — there is no monthly version. Managed SaaS tiers (3, 4) bill monthly by default; an annual commit with prepayment gets 15% off. Tier 5 (white-label/OEM) is case-by-case.',
    faq_q3: 'Do you offer a non-profit or academic discount?',
    faq_a3: 'Yes. Registered non-profits and accredited universities get 50% off any commercial tier. Send your license proof + organization paperwork to licensing@verbara.io.',
    best_for_label: 'Best for',
    best_for_t0: 'Voice AI · CPaaS · CC (≤5 agents eval)',
    best_for_t0_5: 'Any use-case under 30-day evaluation',
    best_for_t1: 'CC · small CPaaS',
    best_for_t2: 'Multi-tenant CC · Omnichannel · Production Voice AI',
    best_for_t3: 'Hosted CC · Hosted Voice AI',
    best_for_t4: 'Enterprise CC · Compliance-grade voice',
    best_for_t5: 'White-label CPaaS · Vertical resellers',
    subtitle_2: 'Any tier serves any use-case — the difference is scale, multi-tenant, and SLA.',
  },
  usecases: {
    index_eyebrow: 'Solutions',
    index_h1_pre: 'One runtime,',
    index_h1_accent: 'four shapes.',
    index_sub: 'The same open-core engine serves four distinct use-cases. Pick the one that matches how you operate.',

    cc_index_eyebrow: 'Human voice',
    cc_index_title: 'Contact Center',
    cc_index_sub: 'Full omnichannel operation with native AI, predictive dialer, and real-time agent assist.',
    cc_index_cap1: 'Multi-tenant + clustering',
    cc_index_cap2: 'Post-call speech analytics',
    cc_index_cap3: 'Wallboard + SLA tracking',
    cc_index_cta: 'See solution →',

    voiceai_index_eyebrow: 'AI voice',
    voiceai_index_title: 'Voice AI',
    voiceai_index_sub: 'Voicebots and inbound AI agents on your Asterisk PBX. No SIP gymnastics.',
    voiceai_index_cap1: '6 STT · 6 TTS · OpenAI Realtime bridge',
    voiceai_index_cap2: 'Smart Turn detection + barge-in',
    voiceai_index_cap3: 'Self-host or hosted',
    voiceai_index_cta: 'See solution →',

    omnichannel_index_eyebrow: 'Messaging',
    omnichannel_index_title: 'Omnichannel',
    omnichannel_index_sub: 'Eleven channels in one inbox. WhatsApp Meta direct, no middlemen.',
    omnichannel_index_cap1: '11 connectors · WhatsApp 24h window',
    omnichannel_index_cap2: 'Flows DAG with LLM nodes',
    omnichannel_index_cap3: 'Multi-tenant white-label',
    omnichannel_index_cta: 'See solution →',

    cpaas_index_eyebrow: 'Telephony',
    cpaas_index_title: 'CPaaS',
    cpaas_index_sub: 'AMI · AGI · ARI · Live API. Telephony as a library, not a rented service.',
    cpaas_index_cap1: 'No per-minute fees',
    cpaas_index_cap2: 'Multi-server federation',
    cpaas_index_cap3: 'Activities state-machines',
    cpaas_index_cta: 'See solution →',

    cc_hero_eyebrow: 'Solution · Contact Center',
    cc_hero_h1_pre: 'The contact center your security team',
    cc_hero_h1_accent: 'can actually read.',
    cc_hero_sub: 'For BPO ops leads, telco product owners, and MSP/integrators running real traffic. Open-core end-to-end, no per-minute fees, multi-tenant from day one, with an in-browser WebRTC softphone.',
    cc_hero_cta_primary: 'Developer license →',
    cc_hero_cta_secondary: 'See CC pricing',
    cc_ap_eyebrow: 'What you replace',
    cc_ap_h2: 'Stop renting your contact center.',
    cc_ap_sub: 'Four incumbent categories — where Verbara closes each gap.',
    cc_ap_col_verbara: 'Verbara',
    cc_ap_col_a: 'Genesys / Five9',
    cc_ap_col_b: 'Asterisk + scripts',
    cc_ap_col_c: 'VICIdial / FreePBX',
    cc_ap_row_1: 'Source available',
    cc_ap_row_2: 'Self-host',
    cc_ap_row_3: 'Modern UI',
    cc_ap_row_4: 'Native AI pipeline',
    cc_ap_row_5: 'Multi-tenant + clustering',
    cc_ap_row_6: 'Speech analytics',
    cc_ap_row_7: 'LATAM-default (ES/PT)',
    cc_ap_row_8: 'In-browser WebRTC softphone',
    cc_ap_row_9: 'Trunk/DID config from the UI',
    cc_cp_eyebrow: 'Read the code',
    cc_cp_h2: 'CC operation as real code.',
    cc_cp_filename: 'CallCenterHost.cs',
    cc_cp_caption: 'Verbara.Platform — CC API bootstrap with multi-tenant + Pro features →',
    cc_faq_eyebrow: 'FAQ · Contact Center',
    cc_faq_h2: 'Operator questions.',
    cc_faq_q1: 'How many concurrent agents does it support?',
    cc_faq_a1: 'Tier 1 self-host caps at 25 agents; Tier 2 goes to 500 with multi-cluster; SaaS Business (Tier 3) and Enterprise (Tier 4) scale per contract. The cap is licensing, not technical — the engine scales horizontally with Pro clustering.',
    cc_faq_q2: 'Multi-tenant for BPOs?',
    cc_faq_a2: 'Yes, from Tier 2 self-host. Strict per-tenant isolation, per-tenant skill routing, cross-tenant admin impersonation. Each BPO client sees only their data and their agents.',
    cc_faq_q3: 'Compatibility with my existing PBX?',
    cc_faq_a3: 'If your PBX is Asterisk (any version 16+), Verbara connects to your dialplan via AMI/ARI. If your PBX is Cisco/Avaya, you need a SIP gateway to Asterisk; the most common ones are documented.',
    cc_faq_q4: 'Do my agents need a desk phone or an installed softphone?',
    cc_faq_a4: 'No. Verbara ships a WebRTC softphone inside the agent workspace: they take and make calls straight from the browser, with no desk phone and no softphone software to install and maintain. The agent opens the URL, registers their extension, and they are on the line — ideal for remote teams and BPOs that would rather not manage hardware or per-seat softphone profiles.',
    cc_faq_q5: 'Do I have to edit the Asterisk dialplan to connect trunks and numbers?',
    cc_faq_a5: 'No. SIP trunks and DIDs are configured from the admin UI with a guided wizard, including a connectivity test that validates trunk registration before you put production traffic on it. No hand-editing dialplan files, no Asterisk restart for each change. If you prefer raw dialplan, it is still your Asterisk — but most day-to-day operation no longer requires it.',
    cc_faq_q6: 'What happens if an agent loses internet or closes the tab mid-shift?',
    cc_faq_a6: "Verbara detects it. A liveness heartbeat identifies the disconnected or \"zombie\" agent and reacts: orphaned digital work (chats, WhatsApp, email) is automatically re-queued to the front of its queue for the next live agent, and if a voice call drops with the customer still on the line, the customer gets a priority callback to the next available agent in their origin queue. On top of that, you set concurrent capacity limits per channel plus a MaxTotal across async channels, with a per-tenant default and per-agent override — so no one gets over-assigned.",
    cc_pp_eyebrow: 'CC pricing',
    cc_pp_h2: 'Which tier do you need?',
    cc_pp_body: 'Tier 1 ($5k/yr) to start single-tenant ≤25 agents. Tier 2 ($30-50k/yr) for multi-tenant + multi-cluster. Tier 3 ($99/agent/mo) if you prefer hosted. Tier 4 ($249/agent/mo) for SOC2/HIPAA + 24/7.',
    cc_pp_cta: 'See full pricing →',
    cc_final_h2_pre: 'The CC',
    cc_final_h2_accent: 'you can audit.',
    cc_final_sub: '30-day signed developer license, free. Evaluate every Pro feature with no commitment.',

    voiceai_hero_eyebrow: 'Solution · Voice AI',
    voiceai_hero_h1_pre: 'Inbound voicebots',
    voiceai_hero_h1_accent: 'on your PBX.',
    voiceai_hero_sub: 'Native STT, TTS, and turn-taking on top of Asterisk. No SIP gymnastics, no per-minute, no voice-vendor lock-in.',
    voiceai_hero_cta_primary: 'Developer license →',
    voiceai_hero_cta_secondary: 'See the code',
    voiceai_ap_eyebrow: 'What you replace',
    voiceai_ap_h2: 'Voicebots without renting the voice.',
    voiceai_ap_sub: 'Voicebot SaaS charges per minute and locks you into one vendor stack. Verbara does the opposite.',
    voiceai_ap_col_verbara: 'Verbara',
    voiceai_ap_col_a: 'Vapi',
    voiceai_ap_col_b: 'Bland.ai · Retell',
    voiceai_ap_col_c: 'Pipecat (OSS)',
    voiceai_ap_row_1: 'Open-core',
    voiceai_ap_row_2: 'Full self-host',
    voiceai_ap_row_3: 'Asterisk-native (no SIP gymnastics)',
    voiceai_ap_row_4: 'Multi-tenant',
    voiceai_ap_row_5: '6 STT + 6 TTS swappables',
    voiceai_ap_row_6: 'OpenAI Realtime bridge',
    voiceai_ap_row_7: 'Smart Turn + barge-in',
    voiceai_cp_eyebrow: 'Read the code',
    voiceai_cp_h2: 'A voicebot in 30 lines.',
    voiceai_cp_filename: 'VoiceAgent.cs',
    voiceai_cp_caption: 'Verbara.Sdk.VoiceAI — Deepgram + ElevenLabs agent answering an Asterisk call →',
    voiceai_faq_eyebrow: 'FAQ · Voice AI',
    voiceai_faq_h2: 'Builder questions.',
    voiceai_faq_q1: 'Which STT/TTS providers does it support?',
    voiceai_faq_a1: 'STT: Deepgram, Google, Whisper, Azure, Cartesia, AssemblyAI, Speechmatics. TTS: ElevenLabs Flash 2.5, Deepgram Aura 2, LMNT, Azure, Cartesia, Speechmatics. Plus a direct bridge to the OpenAI Realtime API. Swappable via configuration, no recompile.',
    voiceai_faq_q2: 'What is the end-to-end latency?',
    voiceai_faq_a2: 'With Smart Turn detection + Deepgram Nova + ElevenLabs Flash 2.5 + barge-in: ~600ms p95 from human end-of-utterance to first TTS phoneme, measured on dedicated infra at VU 100. Exact latency depends on your infra and upstream LLM.',
    voiceai_faq_q3: 'Self-host without my own telephony?',
    voiceai_faq_a3: "You need an Asterisk PBX so the SDK can receive audio (yours, a customer's, or deployed alongside Verbara). If you want voicebots without operating telephony, Tier 3+ SaaS hosted includes managed PBX.",
    voiceai_faq_q4: 'How do I escalate to human agents when the voicebot transfers?',
    voiceai_faq_a4: 'The voicebot runs on the same runtime as the contact center, so an escalation to a human lands on a real agent using the in-browser WebRTC softphone — no desk phone, no install. And if that agent loses connectivity mid-transfer, presence liveness detects it and fires a priority callback to the customer toward the next live agent. AI voice and human voice share one queue; they are not two products taped together.',
    voiceai_pp_eyebrow: 'Voice AI pricing',
    voiceai_pp_h2: 'Where do you start?',
    voiceai_pp_body: 'Tier 0 community is free for evaluation with the MIT SDK directly. Tier 0.5 (Pro Developer, free 30 days) for every Pro feature. Tier 1+ when you ship to single-tenant production.',
    voiceai_pp_cta: 'See full pricing →',
    voiceai_final_h2_pre: 'Voicebots',
    voiceai_final_h2_accent: 'without rent.',
    voiceai_final_sub: '30-day signed developer license, free. MIT SDK — read it end-to-end before adopting.',

    omnichannel_hero_eyebrow: 'Solution · Omnichannel',
    omnichannel_hero_h1_pre: 'Eleven channels,',
    omnichannel_hero_h1_accent: 'one inbox.',
    omnichannel_hero_sub: 'WhatsApp Meta direct (no intermediate BSP), SMS, email, WebChat, Telegram, IG, Messenger, and more. Multi-tenant, with Flows DAG and LLM nodes.',
    omnichannel_hero_cta_primary: 'Developer license →',
    omnichannel_hero_cta_secondary: 'See the code',
    omnichannel_ap_eyebrow: 'What you replace',
    omnichannel_ap_h2: 'Eleven channels without per-message fees.',
    omnichannel_ap_sub: 'Messaging CPaaS platforms charge per message + per provider + per channel. Verbara unifies them.',
    omnichannel_ap_col_verbara: 'Verbara',
    omnichannel_ap_col_a: 'Twilio Conv.',
    omnichannel_ap_col_b: 'Sinch · MessageBird',
    omnichannel_ap_col_c: 'Chatwoot (OSS)',
    omnichannel_ap_row_1: 'Open-core',
    omnichannel_ap_row_2: 'Self-host',
    omnichannel_ap_row_3: '11 out-of-box connectors',
    omnichannel_ap_row_4: 'WhatsApp Meta direct',
    omnichannel_ap_row_5: 'Flows DAG with LLM nodes',
    omnichannel_ap_row_6: 'Multi-tenant white-label',
    omnichannel_ap_row_7: 'Native voice integrated',
    omnichannel_cp_eyebrow: 'Read the code',
    omnichannel_cp_h2: 'One queue for everything.',
    omnichannel_cp_filename: 'OmnichannelRouter.cs',
    omnichannel_cp_caption: 'Verbara.Platform — WhatsApp + SMS + WebChat in a Flow DAG with 1 LLM node →',
    omnichannel_faq_eyebrow: 'FAQ · Omnichannel',
    omnichannel_faq_h2: 'Messaging questions.',
    omnichannel_faq_q1: 'WhatsApp Business API direct or via BSP?',
    omnichannel_faq_a1: 'Direct to Meta. Verbara implements the WhatsApp Business Cloud API with HMAC verification and 24h window handling. You get your own Business Account, no BSP between you and Meta. Approved templates are managed via Flows.',
    omnichannel_faq_q2: 'Does it support SMS bulk with regional providers?',
    omnichannel_faq_a2: 'Yes. The SMS connector is provider-agnostic with a Twilio provider included by default, plus segment calculation. For LATAM, regional providers (Infobip, Movile, etc.) connect by implementing an IProvider — a few hours of work.',
    omnichannel_faq_q3: 'How are cross-channel conversations routed?',
    omnichannel_faq_a3: 'The Conversations module correlates by contact: if a customer writes via WhatsApp and then via email, both hits land in the same conversation with a unified timeline. Routing is by skill/queue/team, not by channel — the operator sees the full history.',
    omnichannel_faq_q4: 'How many concurrent conversations can one agent handle?',
    omnichannel_faq_a4: 'You decide. Concurrent capacity is configurable per channel (chat, email, SMS, voice) plus a MaxTotal across async channels, with a per-tenant default and per-agent override — a senior can carry more chats than a junior without touching anyone else. And if an agent disconnects, their in-flight digital work is re-queued to the front of its queue for the next live agent, so load does not get stuck in a dead tab.',
    omnichannel_pp_eyebrow: 'Omnichannel pricing',
    omnichannel_pp_h2: 'Which tier do you need?',
    omnichannel_pp_body: 'Tier 0 community for self-host evaluation. Tier 2 ($30-50k/yr) for multi-tenant in your own SaaS. Tier 3+ ($99/agent/mo) if you prefer hosted with SLA.',
    omnichannel_pp_cta: 'See full pricing →',
    omnichannel_final_h2_pre: 'Eleven channels,',
    omnichannel_final_h2_accent: 'no per-message fees.',
    omnichannel_final_sub: '30-day signed developer license, free. WhatsApp Meta direct, no middlemen.',

    cpaas_hero_eyebrow: 'Solution · CPaaS',
    cpaas_hero_h1_pre: 'Telephony as a library,',
    cpaas_hero_h1_accent: 'not as a rental.',
    cpaas_hero_sub: 'AMI · AGI · ARI · Live API · Activities. MIT SDK with multi-server federation, no per-minute fees. Your Asterisk, your telco, your code.',
    cpaas_hero_cta_primary: 'dotnet add package Verbara.Sdk',
    cpaas_hero_cta_secondary: 'See the code',
    cpaas_ap_eyebrow: 'What you replace',
    cpaas_ap_h2: 'CPaaS without per-minute fees.',
    cpaas_ap_sub: 'CPaaS platforms charge $0.014–0.045 per minute and lock you into their SIP. Verbara connects direct to your telco.',
    cpaas_ap_col_verbara: 'Verbara',
    cpaas_ap_col_a: 'Twilio',
    cpaas_ap_col_b: 'Vonage · Plivo',
    cpaas_ap_col_c: 'Jambonz (OSS)',
    cpaas_ap_row_1: 'Open-core MIT',
    cpaas_ap_row_2: 'No per-minute fees',
    cpaas_ap_row_3: 'Asterisk-native',
    cpaas_ap_row_4: 'Multi-server federation',
    cpaas_ap_row_5: 'Activities state-machines',
    cpaas_ap_row_6: 'Barge-in + turn-taking',
    cpaas_ap_row_7: 'Multi-tenant licensing',
    cpaas_cp_eyebrow: 'Read the code',
    cpaas_cp_h2: 'Outbound call + bridge + record.',
    cpaas_cp_filename: 'OutboundCallExample.cs',
    cpaas_cp_caption: 'Verbara.Sdk.Ari — places outbound call, bridges two channels, records the result →',
    cpaas_faq_eyebrow: 'FAQ · CPaaS',
    cpaas_faq_h2: 'Telephony questions.',
    cpaas_faq_q1: 'Do I need to run my own Asterisk?',
    cpaas_faq_a1: 'Yes. Verbara is a library on top of Asterisk; you run the PBX (yours, on-prem or in cloud) and connect the SDK via AMI/ARI. If you want CPaaS without operating telephony, check Tier 3+ SaaS hosted where the PBX comes managed.',
    cpaas_faq_q2: 'Which codecs does it support?',
    cpaas_faq_a2: 'The SDK passes the audio Asterisk delivers — it supports whatever codecs your Asterisk supports (G.711, G.722, Opus, PCM, etc.). The VoiceAI pipeline does internal resampling between formats when the LLM/TTS needs 16kHz PCM.',
    cpaas_faq_q3: 'What scale of multi-server federation?',
    cpaas_faq_a3: 'VerbaraServerPool supports arbitrary Asterisk servers with failover and routing by channel/tenant. We have validated pools of up to 8 nodes in R5.5 production validation; beyond that depends on your PBX infrastructure.',
    cpaas_faq_q4: 'How do I embed voice for humans, not just APIs?',
    cpaas_faq_a4: 'Beyond AMI/AGI/ARI/Live API for your programmable telephony, the Platform ships a WebRTC softphone inside the full agent workspace — an operator seat in the browser, not just loose WebRTC audio. Agents take and make calls with no desk phone and no softphone to install. And you wire SIP trunks and DIDs from the UI with a guided wizard and connectivity test, no hand-edited dialplan. The raw primitives stay there when you want to build; the human seat is ready when you need it.',
    cpaas_pp_eyebrow: 'CPaaS pricing',
    cpaas_pp_h2: 'What do you need to license?',
    cpaas_pp_body: 'Tier 0 community free with the MIT SDK directly (community telephony primitives included). Tier 1+ unlocks Pro features: clustering, multi-tenant, dialer, agent assist. Tier 5 white-label for resellers.',
    cpaas_pp_cta: 'See full pricing →',
    cpaas_final_h2_pre: 'Telephony',
    cpaas_final_h2_accent: 'you actually own.',
    cpaas_final_sub: '30-day signed developer license, free. MIT SDK — the foundation is yours forever.',
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
    pricing: 'Preços',
    developer_license: 'Licença gratuita',
    github: 'GitHub',
    solutions: 'Soluções',
    solutions_cc: 'Contact Center',
    solutions_voiceai: 'Voice AI',
    solutions_omnichannel: 'Omnichannel',
    solutions_cpaas: 'CPaaS',
    solutions_all: 'Ver todas as soluções →',
  },
  footer: {
    tagline: 'Open-core honesto para contact center.',
    column_resources: 'Recursos',
    column_legal: 'Legal',
    legal_eula: 'EULA',
    legal_privacy: 'Privacidade',
    legal_terms: 'Termos',
    copyright: '© 2026 Harol A. Reina H. e contribuidores da Verbara.',
    trademark:
      'Verbara™. "Asterisk" é marca registrada de Sangoma Technologies / Digium; Verbara é um projeto independente.',
    column_solutions: 'Soluções',
    column_stack: 'Stack',
    solutions_cc: 'Contact Center',
    solutions_voiceai: 'Voice AI',
    solutions_omnichannel: 'Omnichannel',
    solutions_cpaas: 'CPaaS',
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
    hero_h1_pre: 'O runtime open-core de comunicações que você pode',
    hero_h1_accent: 'auditar, executar, possuir.',
    hero_sub: 'Open-core, nativo no Asterisk. Rode seu contact center, voice AI, omnichannel e mais sobre um único stack auditável. No seu data center, na sua nuvem, ou no nosso plano gerenciado.',
    hero_cta_primary: 'Rode o stack →',
    hero_cta_secondary: 'Ver soluções →',
    hero_cta_dev_license: 'ou pegue uma licença developer — grátis, assinada, válida 30 dias →',
    hero_trust_packages: '27 pacotes SDK',
    hero_trust_tests: '2.893 testes unitários',
    hero_trust_vulns: '0 pacotes vulneráveis',
    hero_trust_oss: 'Open source no GitHub',
    hero_trust_signed: 'Imagens assinadas (cosign)',
    solutions_eyebrow: 'Soluções',
    solutions_h2: 'Quatro formas do mesmo runtime.',
    solutions_card_cc_eyebrow: 'Voz humana',
    solutions_card_cc_title: 'Contact Center',
    solutions_card_cc_sub: 'Operação omnichannel completa com IA nativa, dialer e agent assist.',
    solutions_card_cc_cta: 'Ver solução →',
    solutions_card_voiceai_eyebrow: 'Voz IA',
    solutions_card_voiceai_title: 'Voice AI',
    solutions_card_voiceai_sub: 'Voicebots e agentes IA inbound sobre seu Asterisk PBX.',
    solutions_card_voiceai_cta: 'Ver solução →',
    solutions_card_omnichannel_eyebrow: 'Mensageria',
    solutions_card_omnichannel_title: 'Omnichannel',
    solutions_card_omnichannel_sub: 'WhatsApp, SMS, email, web — onze canais em um inbox.',
    solutions_card_omnichannel_cta: 'Ver solução →',
    solutions_card_cpaas_eyebrow: 'Telefonia',
    solutions_card_cpaas_title: 'CPaaS',
    solutions_card_cpaas_sub: 'API programável sobre Asterisk. Sem tarifas por minuto.',
    solutions_card_cpaas_cta: 'Ver solução →',

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
    faq_a1: 'Sim. O Verbara é construído sobre o Asterisk PBX como seu substrato de telefonia — não o substituímos, modernizamos a UX do operador, o pipeline de IA e os overlays Pro ao redor dele. Se você não tem Asterisk, ele é implantado junto com o Verbara (setup único, bem documentado). Se você já roda Asterisk, o Verbara conecta ao seu dialplan e configuração existentes. Isso vale para qualquer use-case: contact center, voice AI, omnichannel ou CPaaS.',
    faq_q2: 'Roda em Kubernetes?',
    faq_a2: 'Sim. A Platform é K8s-native — multi-tenant e multi-cluster a partir do Tier 2. Os Helm charts vêm no Verbara.Sdk.Pro. Também dá pra rodar em uma única VM com Docker Compose se sua escala ainda não justifica K8s — o stack é portátil, sem dependências ocultas de cloud.',
    faq_q3: 'O que acontece com meu deployment se eu parar de pagar Pro?',
    faq_a3: 'O motor OSS (SDK MIT + Platform Apache) continua rodando indefinidamente — sem kill switch, sem verificação cloud. Você perde acesso às features Pro (multi-tenant, dialer preditivo, agent assist, clustering, overlays de analytics) quando sua licença expira. Dados e audit logs continuam seus. Não podemos nem vamos desativar uma instalação que você parou de pagar; simplesmente paramos de enviar releases novos de Pro.',
    faq_q4: 'Tem SLA na edição OSS?',
    faq_a4: 'Não. A edição OSS (Tier 0) tem suporte community via GitHub issues e Discord público. Tempo de resposta best-effort. SLAs começam no Tier 3 (SaaS gerenciado, 99.5% uptime) e Tier 4 (99.9% com suporte 24/7 + CSM dedicado). Para tiers comerciais self-host (1, 2), suporte é e-mail ou e-mail+Slack — rápido mas sem SLA.',
    faq_q5: 'LATAM (ES, PT) é cidadão de primeira ou tradução tardia?',
    faq_a5: 'Primeira classe. O locale padrão é es-419 (espanhol LATAM neutro) — verbara.io/ serve espanhol, a versão inglesa vive em /en-US/. Documentação, suporte e UI do produto são autorados em três locales (es-419, en-US, pt-BR) com paridade enforced em CI. Exemplos em preços, casos e nomes de tier se inclinam a contextos LATAM (BPOs, telcos). Verbara é construído por gente que pensa em espanhol.',
    faq_q6: 'Por onde começo de acordo com meu use-case?',
    faq_a6: 'Cada solução tem sua própria página com código, anti-positioning e FAQ específicos: contact-center para BPO/telco, voice-ai para voicebots inbound, omnichannel para WhatsApp/SMS/email, cpaas para telefonia programável embarcada. Gere uma licença Pro Developer (Tier 0.5, gratuita, 30 dias) que desbloqueia toda feature Pro em modo WarnOnly — avalie o use-case que se encaixa sem compromisso.',
    faq_q7: 'Como verifico que a imagem que eu faço deploy é a real?',
    faq_a7: 'Cada imagem do Verbara Platform (api, realtime, renderer, mail, web) é assinada com cosign e ancorada por digest de manifest-list — o mesmo valor que o cosign assina. Você verifica qualquer imagem com a chave pública que publicamos em verbara.io/keys/cosign.pub: `cosign verify --key https://verbara.io/keys/cosign.pub --insecure-ignore-tlog ghcr.io/verbara/platform/api:vX.Y.Z`. E vai além do pull: sua licença Pro (.lic) embute os digests autorizados (hoje api + realtime), então as features Pro ficam atreladas a imagens assinadas por digest. Um cron diário re-verifica esses digests contra o registry e nos alerta se algum sofrer mutação.',

    final_h2_pre: 'Pare de alugar seu stack de comunicações.',
    final_h2_accent: 'Comece a rodá-lo.',
    final_sub: 'Licença developer 30 dias, assinada, grátis. Sem cartão de crédito.',
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
    matrix_feat_supply_chain: 'Verificação de supply-chain',

    matrix_support_community: 'community',
    matrix_support_dedicated: 'dedicado',

    faq_q1: 'Posso subir ou descer de tier?',
    faq_a1: 'Sim, a qualquer momento. As features se ajustam à mudança de tier; dados e configuração persistem. Para tiers self-host, o upgrade ativa features Pro adicionais na sua instalação; para SaaS gerenciado, ajustamos o plano no próximo faturamento prorrateado.',
    faq_q2: 'Tem desconto anual?',
    faq_a2: 'Tiers self-host (1, 2) já são faturados anualmente — não tem versão mensal. Tiers SaaS (3, 4) faturam mensal por padrão; commit anual com pré-pagamento ganha 15% de desconto. Tier 5 (white-label/OEM) é negociado caso a caso.',
    faq_q3: 'Oferecem desconto acadêmico ou non-profit?',
    faq_a3: 'Sim. Organizações non-profit registradas e universidades credenciadas têm 50% de desconto em qualquer tier comercial. Envie comprovante da licença + documentação da organização para licensing@verbara.io.',
    best_for_label: 'Melhor para',
    best_for_t0: 'Voice AI · CPaaS · CC (≤5 agentes avaliação)',
    best_for_t0_5: 'Qualquer use-case em avaliação de 30 dias',
    best_for_t1: 'CC · CPaaS pequeno',
    best_for_t2: 'CC multi-tenant · Omnichannel · Voice AI produtivo',
    best_for_t3: 'CC hospedado · Voice AI hospedado',
    best_for_t4: 'CC enterprise · Compliance-grade voice',
    best_for_t5: 'CPaaS white-label · Revendedores verticais',
    subtitle_2: 'Qualquer tier serve qualquer use-case — a diferença é escala, multi-tenant e SLA.',
  },
  usecases: {
    index_eyebrow: 'Soluções',
    index_h1_pre: 'Um runtime,',
    index_h1_accent: 'quatro formas.',
    index_sub: 'O mesmo motor open-core serve quatro use-cases distintos. Escolha o que combina com como você opera.',

    cc_index_eyebrow: 'Voz humana',
    cc_index_title: 'Contact Center',
    cc_index_sub: 'Operação omnichannel completa com IA nativa, dialer preditivo e agent assist em tempo real.',
    cc_index_cap1: 'Multi-tenant + clustering',
    cc_index_cap2: 'Speech analytics pós-chamada',
    cc_index_cap3: 'Wallboard + SLA tracking',
    cc_index_cta: 'Ver solução →',

    voiceai_index_eyebrow: 'Voz IA',
    voiceai_index_title: 'Voice AI',
    voiceai_index_sub: 'Voicebots e agentes IA inbound sobre seu Asterisk PBX. Sem SIP gymnastics.',
    voiceai_index_cap1: '6 STT · 6 TTS · OpenAI Realtime bridge',
    voiceai_index_cap2: 'Smart Turn detection + barge-in',
    voiceai_index_cap3: 'Self-host ou hospedado',
    voiceai_index_cta: 'Ver solução →',

    omnichannel_index_eyebrow: 'Mensageria',
    omnichannel_index_title: 'Omnichannel',
    omnichannel_index_sub: 'Onze canais em um único inbox. WhatsApp Meta direto, sem intermediários.',
    omnichannel_index_cap1: '11 conectores · WhatsApp 24h window',
    omnichannel_index_cap2: 'Flows DAG com nós LLM',
    omnichannel_index_cap3: 'Multi-tenant white-label',
    omnichannel_index_cta: 'Ver solução →',

    cpaas_index_eyebrow: 'Telefonia',
    cpaas_index_title: 'CPaaS',
    cpaas_index_sub: 'AMI · AGI · ARI · Live API. Telefonia como biblioteca, não como serviço alugado.',
    cpaas_index_cap1: 'Sem tarifas por minuto',
    cpaas_index_cap2: 'Federação multi-servidor',
    cpaas_index_cap3: 'Activities state-machines',
    cpaas_index_cta: 'Ver solução →',

    cc_hero_eyebrow: 'Solução · Contact Center',
    cc_hero_h1_pre: 'O contact center que sua equipe de segurança',
    cc_hero_h1_accent: 'consegue ler.',
    cc_hero_sub: 'Para BPO ops leads, telco product owners e MSP/integradores rodando tráfego real. Open-core ponta-a-ponta, sem tarifas por minuto, multi-tenant nativo e softphone WebRTC no navegador.',
    cc_hero_cta_primary: 'Licença developer →',
    cc_hero_cta_secondary: 'Ver pricing CC',
    cc_ap_eyebrow: 'O que você substitui',
    cc_ap_h2: 'Pare de alugar seu contact center.',
    cc_ap_sub: 'Quatro categorias de incumbentes — onde o Verbara fecha cada gap.',
    cc_ap_col_verbara: 'Verbara',
    cc_ap_col_a: 'Genesys / Five9',
    cc_ap_col_b: 'Asterisk + scripts',
    cc_ap_col_c: 'VICIdial / FreePBX',
    cc_ap_row_1: 'Código disponível',
    cc_ap_row_2: 'Self-host',
    cc_ap_row_3: 'UI moderna',
    cc_ap_row_4: 'Pipeline AI nativo',
    cc_ap_row_5: 'Multi-tenant + clustering',
    cc_ap_row_6: 'Speech analytics',
    cc_ap_row_7: 'LATAM por padrão (ES/PT)',
    cc_ap_row_8: 'Softphone WebRTC no navegador',
    cc_ap_row_9: 'Config de troncos/DID pela UI',
    cc_cp_eyebrow: 'Leia o código',
    cc_cp_h2: 'Operação CC em código real.',
    cc_cp_filename: 'CallCenterHost.cs',
    cc_cp_caption: 'Verbara.Platform — bootstrap do API CC com multi-tenant + features Pro →',
    cc_faq_eyebrow: 'FAQ · Contact Center',
    cc_faq_h2: 'Perguntas de operadores.',
    cc_faq_q1: 'Quantos agentes simultâneos suporta?',
    cc_faq_a1: 'Tier 1 self-host limita a 25 agentes; Tier 2 chega a 500 com multi-cluster; SaaS Business (Tier 3) e Enterprise (Tier 4) escalam por contrato. O limite é de licença, não técnico — o motor escala horizontalmente com clustering Pro.',
    cc_faq_q2: 'Multi-tenant para BPOs?',
    cc_faq_a2: 'Sim, a partir do Tier 2 self-host. Isolamento estrito por tenant, roteamento por skill por tenant, impersonation cross-tenant para administração. Cada cliente do BPO vê apenas seus dados e seus agentes.',
    cc_faq_q3: 'Compatibilidade com meu PBX existente?',
    cc_faq_a3: 'Se seu PBX é Asterisk (qualquer versão 16+), o Verbara conecta no seu dialplan via AMI/ARI. Se seu PBX é Cisco/Avaya, você precisa de um gateway SIP para o Asterisk; os mais comuns estão documentados.',
    cc_faq_q4: 'Meus agentes precisam de telefone físico ou softphone instalado?',
    cc_faq_a4: 'Não. O Verbara traz um softphone WebRTC dentro do workspace do agente: eles atendem e fazem chamadas direto do navegador, sem telefone de mesa e sem software de softphone para instalar e manter. O agente abre a URL, registra o ramal e já está em linha — ideal para times remotos e BPOs que não querem administrar hardware nem perfis de softphone por posição.',
    cc_faq_q5: 'Preciso editar o dialplan do Asterisk para conectar troncos e números?',
    cc_faq_a5: 'Não. Os troncos SIP e os DIDs são configurados pela UI de administração com um assistente guiado, incluindo um teste de conectividade que valida o registro do tronco antes de colocar tráfego em produção. Sem editar arquivos de dialplan na mão nem reiniciar o Asterisk a cada mudança. Se você prefere dialplan cru, ele continua sendo o seu Asterisk — mas a maior parte da operação diária já não precisa dele.',
    cc_faq_q6: 'O que acontece se um agente perde a internet ou fecha a aba no meio do turno?',
    cc_faq_a6: 'O Verbara detecta. Um heartbeat de liveness identifica o agente desconectado ou "zombie" e reage: o trabalho digital órfão (chats, WhatsApp, e-mail) é re-enfileirado automaticamente para a frente da fila para o próximo agente vivo, e se uma chamada de voz cai com o cliente ainda na linha, o cliente recebe um callback prioritário para o próximo agente disponível da fila de origem. Além disso, você define limites de capacidade concorrente por canal mais um MaxTotal entre canais assíncronos, com default por tenant e override por agente — para que ninguém fique sobre-alocado.',
    cc_pp_eyebrow: 'Pricing CC',
    cc_pp_h2: 'Qual tier você precisa?',
    cc_pp_body: 'Tier 1 ($5k/ano) para começar single-tenant ≤25 agentes. Tier 2 ($30-50k/ano) para multi-tenant + multi-cluster. Tier 3 ($99/agente/mês) se preferir hospedado. Tier 4 ($249/agente/mês) para SOC2/HIPAA + 24/7.',
    cc_pp_cta: 'Ver pricing completo →',
    cc_final_h2_pre: 'O CC',
    cc_final_h2_accent: 'que você pode auditar.',
    cc_final_sub: 'Licença developer 30 dias, assinada, gratuita. Avalie todo Pro sem compromisso.',

    voiceai_hero_eyebrow: 'Solução · Voice AI',
    voiceai_hero_h1_pre: 'Voicebots inbound',
    voiceai_hero_h1_accent: 'no seu PBX.',
    voiceai_hero_sub: 'STT, TTS e turn-taking nativos sobre Asterisk. Sem SIP gymnastics, sem per-minute, sem lock-in no provedor de voz.',
    voiceai_hero_cta_primary: 'Licença developer →',
    voiceai_hero_cta_secondary: 'Ver código',
    voiceai_ap_eyebrow: 'O que você substitui',
    voiceai_ap_h2: 'Voicebots sem alugar a voz.',
    voiceai_ap_sub: 'As plataformas SaaS de voicebot cobram por minuto e te lockam num único stack de provedor. Verbara faz o oposto.',
    voiceai_ap_col_verbara: 'Verbara',
    voiceai_ap_col_a: 'Vapi',
    voiceai_ap_col_b: 'Bland.ai · Retell',
    voiceai_ap_col_c: 'Pipecat (OSS)',
    voiceai_ap_row_1: 'Open-core',
    voiceai_ap_row_2: 'Self-host completo',
    voiceai_ap_row_3: 'Asterisk-native (sem SIP gymnastics)',
    voiceai_ap_row_4: 'Multi-tenant',
    voiceai_ap_row_5: '6 STT + 6 TTS swappables',
    voiceai_ap_row_6: 'OpenAI Realtime bridge',
    voiceai_ap_row_7: 'Smart Turn + barge-in',
    voiceai_cp_eyebrow: 'Leia o código',
    voiceai_cp_h2: 'Um voicebot em 30 linhas.',
    voiceai_cp_filename: 'VoiceAgent.cs',
    voiceai_cp_caption: 'Verbara.Sdk.VoiceAI — agente Deepgram + ElevenLabs respondendo chamada Asterisk →',
    voiceai_faq_eyebrow: 'FAQ · Voice AI',
    voiceai_faq_h2: 'Perguntas de builders.',
    voiceai_faq_q1: 'Quais provedores de STT/TTS suporta?',
    voiceai_faq_a1: 'STT: Deepgram, Google, Whisper, Azure, Cartesia, AssemblyAI, Speechmatics. TTS: ElevenLabs Flash 2.5, Deepgram Aura 2, LMNT, Azure, Cartesia, Speechmatics. Mais bridge direto para a OpenAI Realtime API. Swappables via configuração, sem recompilação.',
    voiceai_faq_q2: 'Qual a latência end-to-end?',
    voiceai_faq_a2: 'Com Smart Turn detection + Deepgram Nova + ElevenLabs Flash 2.5 + barge-in: ~600ms p95 do fim-de-frase humano até o primeiro phoneme TTS, medido em infra própria com VU 100. Latência exata depende da sua infra e do LLM upstream.',
    voiceai_faq_q3: 'Self-host sem telefonia própria?',
    voiceai_faq_a3: 'Você precisa de um PBX Asterisk para o SDK receber áudio (seu, do cliente, ou implantado junto com Verbara). Se quer voicebots sem operar telefonia, Tier 3+ SaaS hospedado inclui PBX gerenciado.',
    voiceai_faq_q4: 'Como escalo para agentes humanos quando o voicebot transfere?',
    voiceai_faq_a4: 'O voicebot roda sobre o mesmo runtime do contact center, então um escalonamento para humano cai em um agente real usando o softphone WebRTC no navegador — sem telefone de mesa, sem instalação. E se esse agente perde a conexão no meio da chamada transferida, o liveness de presença detecta e dispara um callback prioritário ao cliente para o próximo agente vivo. A voz IA e a humana compartilham a mesma fila; não são dois produtos colados com fita.',
    voiceai_pp_eyebrow: 'Pricing Voice AI',
    voiceai_pp_h2: 'Por onde você começa?',
    voiceai_pp_body: 'Tier 0 community gratuito para avaliação com SDK MIT direto. Tier 0.5 (Pro Developer, grátis 30 dias) para toda feature Pro. Tier 1+ quando shippa para produção single-tenant.',
    voiceai_pp_cta: 'Ver pricing completo →',
    voiceai_final_h2_pre: 'Voicebots',
    voiceai_final_h2_accent: 'sem aluguel.',
    voiceai_final_sub: 'Licença developer 30 dias, assinada, gratuita. SDK MIT — leia inteiro antes de adotar.',

    omnichannel_hero_eyebrow: 'Solução · Omnichannel',
    omnichannel_hero_h1_pre: 'Onze canais,',
    omnichannel_hero_h1_accent: 'um inbox.',
    omnichannel_hero_sub: 'WhatsApp Meta direto (sem BSP intermediário), SMS, email, WebChat, Telegram, IG, Messenger e mais. Multi-tenant, com Flows DAG e nós LLM.',
    omnichannel_hero_cta_primary: 'Licença developer →',
    omnichannel_hero_cta_secondary: 'Ver código',
    omnichannel_ap_eyebrow: 'O que você substitui',
    omnichannel_ap_h2: 'Onze canais sem per-message.',
    omnichannel_ap_sub: 'Os CPaaS de mensageria cobram por mensagem + por provedor + por canal. Verbara os unifica.',
    omnichannel_ap_col_verbara: 'Verbara',
    omnichannel_ap_col_a: 'Twilio Conv.',
    omnichannel_ap_col_b: 'Sinch · MessageBird',
    omnichannel_ap_col_c: 'Chatwoot (OSS)',
    omnichannel_ap_row_1: 'Open-core',
    omnichannel_ap_row_2: 'Self-host',
    omnichannel_ap_row_3: '11 conectores out-of-box',
    omnichannel_ap_row_4: 'WhatsApp Meta direto',
    omnichannel_ap_row_5: 'Flows DAG com nós LLM',
    omnichannel_ap_row_6: 'Multi-tenant white-label',
    omnichannel_ap_row_7: 'Voz nativa integrada',
    omnichannel_cp_eyebrow: 'Leia o código',
    omnichannel_cp_h2: 'Uma única fila para tudo.',
    omnichannel_cp_filename: 'OmnichannelRouter.cs',
    omnichannel_cp_caption: 'Verbara.Platform — WhatsApp + SMS + WebChat em um Flow DAG com 1 nó LLM →',
    omnichannel_faq_eyebrow: 'FAQ · Omnichannel',
    omnichannel_faq_h2: 'Perguntas de mensageria.',
    omnichannel_faq_q1: 'WhatsApp Business API direto ou via BSP?',
    omnichannel_faq_a1: 'Direto ao Meta. O Verbara implementa o WhatsApp Business Cloud API com HMAC verification e gerenciamento da janela de 24h. Você obtém sua própria Business Account, sem BSP entre você e o Meta. Templates aprovados são gerenciados via Flows.',
    omnichannel_faq_q2: 'Suporta SMS bulk com provedores regionais?',
    omnichannel_faq_a2: 'Sim. O conector SMS é provider-agnostic com um provider Twilio incluído por padrão, mais cálculo de segmentos. Para LATAM, provedores regionais (Infobip, Movile, etc.) conectam implementando um IProvider — algumas horas de trabalho.',
    omnichannel_faq_q3: 'Como são roteadas conversas cross-canal?',
    omnichannel_faq_a3: 'O módulo Conversations correlaciona por contato: se um cliente escreve pelo WhatsApp e depois por e-mail, ambos os hits chegam na mesma conversa com timeline unificada. O roteamento é por skill/queue/team, não por canal — o operador vê todo o histórico.',
    omnichannel_faq_q4: 'Quantas conversas simultâneas um agente consegue atender?',
    omnichannel_faq_a4: 'Você decide. A capacidade concorrente é configurável por canal (chat, e-mail, SMS, voz) mais um MaxTotal entre canais assíncronos, com default por tenant e override por agente — um sênior pode levar mais chats que um júnior sem mexer em mais ninguém. E se um agente desconecta, o trabalho digital em andamento dele é re-enfileirado para a frente da fila para o próximo agente vivo, então a carga não fica presa numa aba morta.',
    omnichannel_pp_eyebrow: 'Pricing Omnichannel',
    omnichannel_pp_h2: 'Qual tier você precisa?',
    omnichannel_pp_body: 'Tier 0 community para avaliação self-host. Tier 2 ($30-50k/ano) para multi-tenant no seu próprio SaaS. Tier 3+ ($99/agente/mês) se preferir hospedado com SLA.',
    omnichannel_pp_cta: 'Ver pricing completo →',
    omnichannel_final_h2_pre: 'Onze canais,',
    omnichannel_final_h2_accent: 'sem per-message.',
    omnichannel_final_sub: 'Licença developer 30 dias, assinada, gratuita. WhatsApp Meta direto, sem intermediários.',

    cpaas_hero_eyebrow: 'Solução · CPaaS',
    cpaas_hero_h1_pre: 'Telefonia como biblioteca,',
    cpaas_hero_h1_accent: 'não como aluguel.',
    cpaas_hero_sub: 'AMI · AGI · ARI · Live API · Activities. SDK MIT com federação multi-servidor, sem tarifas por minuto. Seu Asterisk, sua telco, seu código.',
    cpaas_hero_cta_primary: 'dotnet add package Verbara.Sdk',
    cpaas_hero_cta_secondary: 'Ver código',
    cpaas_ap_eyebrow: 'O que você substitui',
    cpaas_ap_h2: 'CPaaS sem per-minute.',
    cpaas_ap_sub: 'Os CPaaS cobram $0.014–0.045 por minuto e te prendem no SIP deles. Verbara conecta direto à sua telco.',
    cpaas_ap_col_verbara: 'Verbara',
    cpaas_ap_col_a: 'Twilio',
    cpaas_ap_col_b: 'Vonage · Plivo',
    cpaas_ap_col_c: 'Jambonz (OSS)',
    cpaas_ap_row_1: 'Open-core MIT',
    cpaas_ap_row_2: 'Sem tarifas por minuto',
    cpaas_ap_row_3: 'Asterisk-native',
    cpaas_ap_row_4: 'Federação multi-servidor',
    cpaas_ap_row_5: 'Activities state-machines',
    cpaas_ap_row_6: 'Barge-in + turn-taking',
    cpaas_ap_row_7: 'Multi-tenant licensing',
    cpaas_cp_eyebrow: 'Leia o código',
    cpaas_cp_h2: 'Outbound call + bridge + record.',
    cpaas_cp_filename: 'OutboundCallExample.cs',
    cpaas_cp_caption: 'Verbara.Sdk.Ari — faz chamada outbound, bridge entre dois canais, grava o resultado →',
    cpaas_faq_eyebrow: 'FAQ · CPaaS',
    cpaas_faq_h2: 'Perguntas de telefonia.',
    cpaas_faq_q1: 'Preciso operar meu próprio Asterisk?',
    cpaas_faq_a1: 'Sim. Verbara é uma biblioteca sobre o Asterisk; você opera o PBX (seu, on-prem ou em nuvem) e conecta o SDK via AMI/ARI. Se quiser CPaaS sem operar telefonia, veja Tier 3+ SaaS hospedado onde o PBX vem gerenciado.',
    cpaas_faq_q2: 'Quais codecs suporta?',
    cpaas_faq_a2: 'O SDK passa o áudio que o Asterisk entrega — suporta os codecs que seu Asterisk suportar (G.711, G.722, Opus, PCM, etc.). O pipeline VoiceAI faz resampling interno entre formatos quando o LLM/TTS precisa de 16kHz PCM.',
    cpaas_faq_q3: 'Federação multi-servidor de qual escala?',
    cpaas_faq_a3: 'VerbaraServerPool suporta servidores Asterisk arbitrários com failover e roteamento por canal/tenant. Validamos pools de até 8 nós na validação de produção R5.5; além disso depende da sua infra de PBX.',
    cpaas_faq_q4: 'Como embarco voz para humanos, não só APIs?',
    cpaas_faq_a4: 'Além de AMI/AGI/ARI/Live API para sua telefonia programável, a Platform inclui um softphone WebRTC dentro do workspace completo do agente — um posto de operador no navegador, não só áudio WebRTC solto. Os agentes atendem e fazem chamadas sem telefone de mesa e sem softphone para instalar. E você conecta seus troncos SIP e DIDs pela UI com um assistente guiado e teste de conectividade, sem dialplan editado na mão. As primitivas cruas continuam ali quando você quiser construir; o posto humano vem pronto quando você precisa.',
    cpaas_pp_eyebrow: 'Pricing CPaaS',
    cpaas_pp_h2: 'O que você precisa licenciar?',
    cpaas_pp_body: 'Tier 0 community gratuito com SDK MIT direto (primitivas de telefonia community incluídas). Tier 1+ desbloqueia features Pro: clustering, multi-tenant, dialer, agent assist. Tier 5 white-label para revendedores.',
    cpaas_pp_cta: 'Ver pricing completo →',
    cpaas_final_h2_pre: 'Telefonia',
    cpaas_final_h2_accent: 'que você de fato possui.',
    cpaas_final_sub: 'Licença developer 30 dias, assinada, gratuita. SDK MIT — a base é sua para sempre.',
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

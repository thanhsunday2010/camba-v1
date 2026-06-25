export type LandingFeatureIcon =
  | "globe"
  | "bookOpen"
  | "sparkles"
  | "fileText"
  | "trophy"
  | "gift";

export interface LandingFeature {
  icon: LandingFeatureIcon;
  title: string;
  description: string;
}

export interface LandingProgram {
  key: string;
  title: string;
  description: string;
  badge: string;
}

export interface LandingPageLabels {
  appName: string;
  appTagline: string;
  login: string;
  register: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadgeFree: string;
  heroBadgeAi: string;
  heroBadgePrograms: string;
  getStarted: string;
  loginCta: string;
  programsTitle: string;
  programsSubtitle: string;
  featuresTitle: string;
  featuresSubtitle: string;
  highlight1: string;
  highlight2: string;
  highlight3: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaRegister: string;
  ctaLogin: string;
}

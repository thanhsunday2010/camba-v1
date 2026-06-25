export type LandingFeatureIcon =
  | "bookOpen"
  | "sparkles"
  | "fileText"
  | "map"
  | "trophy"
  | "gift";

export interface LandingFeature {
  icon: LandingFeatureIcon;
  title: string;
  description: string;
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
  heroBadgeCambridge: string;
  getStarted: string;
  loginCta: string;
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

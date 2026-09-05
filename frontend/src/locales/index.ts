// Auto-generated 9-Language Locale Registry
import common_en from './en/common.json';
import common_hi from './hi/common.json';
import common_kn from './kn/common.json';
import common_te from './te/common.json';
import common_ta from './ta/common.json';
import common_ml from './ml/common.json';
import common_bn from './bn/common.json';
import common_mr from './mr/common.json';
import common_gu from './gu/common.json';
import auth_en from './en/auth.json';
import auth_hi from './hi/auth.json';
import auth_kn from './kn/auth.json';
import auth_te from './te/auth.json';
import auth_ta from './ta/auth.json';
import auth_ml from './ml/auth.json';
import auth_bn from './bn/auth.json';
import auth_mr from './mr/auth.json';
import auth_gu from './gu/auth.json';
import howItWorks_en from './en/howItWorks.json';
import howItWorks_hi from './hi/howItWorks.json';
import howItWorks_kn from './kn/howItWorks.json';
import howItWorks_te from './te/howItWorks.json';
import howItWorks_ta from './ta/howItWorks.json';
import howItWorks_ml from './ml/howItWorks.json';
import howItWorks_bn from './bn/howItWorks.json';
import howItWorks_mr from './mr/howItWorks.json';
import howItWorks_gu from './gu/howItWorks.json';
import home_en from './en/home.json';
import home_hi from './hi/home.json';
import home_kn from './kn/home.json';
import home_te from './te/home.json';
import home_ta from './ta/home.json';
import home_ml from './ml/home.json';
import home_bn from './bn/home.json';
import home_mr from './mr/home.json';
import home_gu from './gu/home.json';
import schemes_en from './en/schemes.json';
import schemes_hi from './hi/schemes.json';
import schemes_kn from './kn/schemes.json';
import schemes_te from './te/schemes.json';
import schemes_ta from './ta/schemes.json';
import schemes_ml from './ml/schemes.json';
import schemes_bn from './bn/schemes.json';
import schemes_mr from './mr/schemes.json';
import schemes_gu from './gu/schemes.json';
import security_en from './en/security.json';
import security_hi from './hi/security.json';
import security_kn from './kn/security.json';
import security_te from './te/security.json';
import security_ta from './ta/security.json';
import security_ml from './ml/security.json';
import security_bn from './bn/security.json';
import security_mr from './mr/security.json';
import security_gu from './gu/security.json';
import dpdp_en from './en/dpdp.json';
import dpdp_hi from './hi/dpdp.json';
import dpdp_kn from './kn/dpdp.json';
import dpdp_te from './te/dpdp.json';
import dpdp_ta from './ta/dpdp.json';
import dpdp_ml from './ml/dpdp.json';
import dpdp_bn from './bn/dpdp.json';
import dpdp_mr from './mr/dpdp.json';
import dpdp_gu from './gu/dpdp.json';

export const LOCALES: Record<string, Record<string, any>> = {
  en: {
    common: common_en,
    auth: auth_en,
    howItWorks: howItWorks_en,
    home: home_en,
    schemes: schemes_en,
    security: security_en,
    dpdp: dpdp_en,
  },
  hi: {
    common: common_hi,
    auth: auth_hi,
    howItWorks: howItWorks_hi,
    home: home_hi,
    schemes: schemes_hi,
    security: security_hi,
    dpdp: dpdp_hi,
  },
  kn: {
    common: common_kn,
    auth: auth_kn,
    howItWorks: howItWorks_kn,
    home: home_kn,
    schemes: schemes_kn,
    security: security_kn,
    dpdp: dpdp_kn,
  },
  te: {
    common: common_te,
    auth: auth_te,
    howItWorks: howItWorks_te,
    home: home_te,
    schemes: schemes_te,
    security: security_te,
    dpdp: dpdp_te,
  },
  ta: {
    common: common_ta,
    auth: auth_ta,
    howItWorks: howItWorks_ta,
    home: home_ta,
    schemes: schemes_ta,
    security: security_ta,
    dpdp: dpdp_ta,
  },
  ml: {
    common: common_ml,
    auth: auth_ml,
    howItWorks: howItWorks_ml,
    home: home_ml,
    schemes: schemes_ml,
    security: security_ml,
    dpdp: dpdp_ml,
  },
  bn: {
    common: common_bn,
    auth: auth_bn,
    howItWorks: howItWorks_bn,
    home: home_bn,
    schemes: schemes_bn,
    security: security_bn,
    dpdp: dpdp_bn,
  },
  mr: {
    common: common_mr,
    auth: auth_mr,
    howItWorks: howItWorks_mr,
    home: home_mr,
    schemes: schemes_mr,
    security: security_mr,
    dpdp: dpdp_mr,
  },
  gu: {
    common: common_gu,
    auth: auth_gu,
    howItWorks: howItWorks_gu,
    home: home_gu,
    schemes: schemes_gu,
    security: security_gu,
    dpdp: dpdp_gu,
  },
};

export function getNamespacedLocale<T = any>(language: string, namespace: string): T {
  const lang = LOCALES[language] ? language : 'en';
  return (LOCALES[lang]?.[namespace] || LOCALES.en[namespace]) as T;
}

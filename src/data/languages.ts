import { Language } from '../types/captioning';

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    enabled: true,
    simplificationAvailable: true
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    enabled: true,
    simplificationAvailable: true
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    enabled: true,
    simplificationAvailable: true
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    enabled: true,
    simplificationAvailable: true
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    enabled: true,
    simplificationAvailable: true
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    enabled: true,
    simplificationAvailable: true
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    enabled: true,
    simplificationAvailable: true
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    enabled: true,
    simplificationAvailable: true
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    enabled: true,
    simplificationAvailable: true
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    enabled: true,
    simplificationAvailable: true
  }
];

export const DEFAULT_LANGUAGE = 'en';

export const getLanguageByCode = (code: string): Language | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
};

export const getLanguageName = (code: string): string => {
  const language = getLanguageByCode(code);
  return language ? language.name : code;
};

export const getLanguageNativeName = (code: string): string => {
  const language = getLanguageByCode(code);
  return language ? language.nativeName : code;
};

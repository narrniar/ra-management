import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import ruTranslations from './locales/ru.json';
import kkTranslations from './locales/kk.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      ru: {
        translation: ruTranslations,
      },
      kk: {
        translation: kkTranslations,
      },
    },
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 
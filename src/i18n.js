import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 
import en from './assets/translations/en.json';
import fr from './assets/translations/fr.json';

i18n
    .use(initReactI18next)
    .init({
        // init data
        resources: {
            fr: {
                translation: fr
            },
            en: {
                translation: en
            },
        },
        fallbackLng: 'en',
        debug: true,

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
    });

export default i18n;
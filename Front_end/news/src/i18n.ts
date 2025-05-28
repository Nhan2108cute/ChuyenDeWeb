import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationVI from './locales/vi.json';
import translationEN from './locales/en.json';

const resources = {
    vi: { translation: translationVI },
    en: { translation: translationEN },
};

const savedLang = localStorage.getItem('lang') || 'vi'; // 📝 lấy từ localStorage

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: savedLang, // 👉 thiết lập ngôn ngữ khởi tạo từ localStorage
        fallbackLng: 'vi',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;

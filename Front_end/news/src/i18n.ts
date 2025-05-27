import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import vi from "./locales/vi.json";
import en from "./locales/en.json";

i18n.use(initReactI18next).init({
    resources: {
        vi: { translation: vi },
        en: { translation: en },
    },
    lng: "vi", // Ngôn ngữ mặc định
    fallbackLng: "en", // Dự phòng nếu thiếu key
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;

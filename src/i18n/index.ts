import * as en from "./locale/en.json";

const NAMESPACE = "plugin-sample-plugin";

// export const resources = {
// 	en: { translation: en },
// } as const;

// await i18next.init({
// 	lng: window.i18next?.language || window.moment?.locale(),
// 	fallbackLng: "en",
// 	resources,
// 	returnNull: false,
// });

i18next.addResourceBundle("en", NAMESPACE, en);

export const t = i18next.getFixedT(null, NAMESPACE);

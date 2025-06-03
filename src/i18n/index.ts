import * as en from "./locale/en.json";

export const NAMESPACE = "plugin-timestampy";

window.i18next.addResourceBundle("en", NAMESPACE, en);

export const t = window.i18next.getFixedT(null, NAMESPACE);

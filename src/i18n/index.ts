import * as en from "./locale/en.json";

const NAMESPACE = "plugin-timestampy";

i18next.addResourceBundle("en", NAMESPACE, en);

export const t = i18next.getFixedT(null, NAMESPACE);

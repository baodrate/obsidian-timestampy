import type * as en from "../i18n/locale/en.json";
import "i18next";
import { NAMESPACE } from "../i18n";

declare module "i18next" {
	interface CustomTypeOptions {
		resources: {
			[NAMESPACE]: typeof en;
		};
	}
}

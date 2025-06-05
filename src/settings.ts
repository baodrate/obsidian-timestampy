import {
	type App,
	PluginSettingTab,
	Setting, TextComponent,
} from "obsidian";
import { t } from "./i18n";
import type TimestampyPlugin from "./timestampy";
import {TFunction} from "i18next";

export type Nullable<T> = {
	[K in keyof T]: T[K] | null;
};

type ValuesOf<T> = T[keyof T];

// to workaround unimplemented feature: https://github.com/microsoft/TypeScript/issues/48992
type KeysMatching<T, V> = {
	[K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
type ExpandRecursively<T> = T extends object ? T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]>}: never : T;

export interface TimestampySettings {
	timestampFormat: string;
	createdProperty: string;
	modifiedProperty: string;
	num: number;
	updateOnWrite: boolean;
}

const GLOBAL_SETTINGS: Readonly<TimestampySettings> = {
	timestampFormat: "YYYY-MM-DD HH:mm:ss",
	createdProperty: "created",
	modifiedProperty: "updated",
	num: 2384,
	updateOnWrite: true,
};

function Nulled<T extends Record<string, any>>(obj: T): Nullable<T> {
	return Object.fromEntries(
		Object.entries(obj).map(([key, _value]) => [key, null]),
	) as Nullable<T>;
}

export const DEFAULT_SETTINGS: Readonly<Nullable<TimestampySettings>> = {
	...Nulled(GLOBAL_SETTINGS),
	num: 88,
};

export const SettingsProxyHandler: ProxyHandler<TimestampySettings> = {
	get: (target, prop) => {
		return (
			target[prop as keyof TimestampySettings] ??
			GLOBAL_SETTINGS[prop as keyof TimestampySettings]
		);
	},
	set: (
		target: TimestampySettings,
		prop: keyof typeof target,
		value: (typeof target)[typeof prop] | null,
		_receiver,
	) => {
		console.log("setting", prop, value);
		if (value == null) {
			(target as Nullable<typeof target>)[prop] = value;
			return true;
		}
		if (typeof GLOBAL_SETTINGS[prop] === "string") {
			const k = prop as KeysMatching<typeof target, string>;
			const v = value as string | null;
			// convert empty string to null
			(target as Nullable<typeof target>)[k] = v?.trim() ? v : null;
			console.log("target", target);
			return true;
		}
		const v = value as Exclude<typeof value, string>;
		const k = prop as KeysMatching<typeof target, typeof v>;
		target[k] = v;
		return true;
	},
	getOwnPropertyDescriptor(target, prop) {
		return (
			Object.getOwnPropertyDescriptor(target, prop) ??
			Object.getOwnPropertyDescriptor(GLOBAL_SETTINGS, prop)
		);
	},
	ownKeys(target) {
		return [
			...new Set([...Object.keys(GLOBAL_SETTINGS), ...Object.keys(target)]),
		];
	},
	has(target, prop) {
		return prop in target || prop in GLOBAL_SETTINGS;
	},
};

export class TimestampySettingTab extends PluginSettingTab {
	declare plugin: TimestampyPlugin;

	constructor(app: App, plugin: TimestampyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	private setPlaceholderAndValue<T extends TextComponent>(component: T, k: KeysMatching<TimestampySettings, string>): T {
		component.setPlaceholder(GLOBAL_SETTINGS[k]);
		if (this.plugin.userSettings[k] !== null) {
			component.setValue(this.plugin.userSettings[k]);
		}
		component
			.onChange(async (value) => {
				this.plugin.settings[k] = value;
				await this.plugin.saveSettings();
			});
		return component;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName(t("setting.timestamp-format.name"))
			.then((setting) => {
				setting.addMomentFormat((mf) => {
					setting.descEl.appendChild(
						createFragment((frag) => {
							frag.appendText(t("setting.timestamp-format.desc"));
							frag.createEl("br");
							frag.appendText(
								// @ts-ignore
								window.i18next.t("plugins.daily-notes.label-refer-to-syntax"),
							);
							frag.createEl("a", {
								// @ts-ignore
								text: window.i18next.t("plugins.daily-notes.label-syntax-link"),
								attr: {
									href: "https://momentjs.com/docs/#/displaying/format/",
									target: "_blank",
									rel: "noopener",
								},
							});
							frag.createEl("br");
							frag.appendText(
								window.i18next.t(
									// @ts-ignore
									"plugins.daily-notes.label-syntax-live-preview",
								),
							);
							mf.setSampleEl(frag.createEl("b", { cls: "u-pop" }));
							frag.createEl("br");
						}),
					);

					this.setPlaceholderAndValue(mf, "timestampFormat")
						.setDefaultFormat(GLOBAL_SETTINGS.timestampFormat);
				});
			});

		new Setting(containerEl)
			.setName(t("setting.created-property.name"))
			.setDesc(t("setting.created-property.desc"))
			.addText((text) => this.setPlaceholderAndValue(text, "createdProperty"));

		new Setting(containerEl)
			.setName(t("setting.modified-property.name"))
			.setDesc(t("setting.modified-property.desc"))
			.addText((text) => this.setPlaceholderAndValue(text, "modifiedProperty"));
	}
}

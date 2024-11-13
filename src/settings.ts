import { type App, PluginSettingTab, Setting } from "obsidian";
import { t } from "./i18n";
import type Timestampy from "./timestampy";

export interface TimestampySettings {
	timestampFormat: string;
	createdProperty: string;
	modifiedProperty: string;
}

export const GLOBAL_SETTINGS: TimestampySettings = {
	timestampFormat: "YYYY-MM-DD HH:mm:ss",
	createdProperty: "created",
	modifiedProperty: "updated",
};

export const DEFAULT_SETTINGS: TimestampySettings = {
	timestampFormat: GLOBAL_SETTINGS.timestampFormat,
	createdProperty: "",
	modifiedProperty: "",
};

export class TimestampySettingTab extends PluginSettingTab {
	plugin: Timestampy;

	constructor(app: App, plugin: Timestampy) {
		super(app, plugin);
		this.plugin = plugin;
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
								i18next.t("plugins.daily-notes.label-refer-to-syntax"),
							);
							frag.createEl("a", {
								text: i18next.t("plugins.daily-notes.label-syntax-link"),
								attr: {
									href: "https://momentjs.com/docs/#/displaying/format/",
									target: "_blank",
									rel: "noopener",
								},
							});
							frag.createEl("br");
							frag.appendText(
								i18next.t("plugins.daily-notes.label-syntax-live-preview"),
							);
							mf.setSampleEl(frag.createEl("b", { cls: "u-pop" }));
							frag.createEl("br");
						}),
					);

					// mf.setPlaceholder(GLOBAL_SETTINGS.timestampFormat);
					mf.setDefaultFormat(GLOBAL_SETTINGS.timestampFormat);

					if (this.plugin.settings.timestampFormat) {
						mf.setValue(this.plugin.settings.timestampFormat);
					}

					mf.onChange(async (value) => {
						this.plugin.settings.timestampFormat = value;
						await this.plugin.saveSettings();
					});
				});
			});

		new Setting(containerEl)
			.setName(t("setting.created-property.name"))
			.setDesc(t("setting.created-property.desc"))
			.addText((text) =>
				text
					.setPlaceholder(GLOBAL_SETTINGS.createdProperty)
					.setValue(this.plugin.settings.createdProperty)
					.onChange(async (value) => {
						this.plugin.settings.createdProperty = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t("setting.modified-property.name"))
			.setDesc(t("setting.modified-property.desc"))
			.addText((text) =>
				text
					.setPlaceholder(GLOBAL_SETTINGS.modifiedProperty)
					.setValue(this.plugin.settings.modifiedProperty)
					.onChange(async (value) => {
						this.plugin.settings.modifiedProperty = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}

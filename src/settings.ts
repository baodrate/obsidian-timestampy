import { type App, PluginSettingTab, Setting } from "obsidian";
import { t } from "./i18n";
import type Timestampy from "./timestampy";

export interface TimestampySettings {
	mySetting: string;
}

export const DEFAULT_SETTINGS: TimestampySettings = {
	mySetting: "default",
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
			.setName(t("setting.option-setting1"))
			.setDesc(t("setting.option-setting1-desc"))
			.addText((text) =>
				text
					.setPlaceholder(t("setting.option-setting1-placeholder"))
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}

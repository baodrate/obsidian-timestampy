import { type App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { t } from "./i18n";

// Remember to rename these classes and interfaces!

interface TimestampySettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: TimestampySettings = {
	mySetting: "default",
};

export default class Timestampy extends Plugin {
	settings: TimestampySettings;

	async onload() {
		console.debug("loading Timestampy plugin");
		await this.loadSettings();
		this.addSettingTab(new TimestampySettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class TimestampySettingTab extends PluginSettingTab {
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
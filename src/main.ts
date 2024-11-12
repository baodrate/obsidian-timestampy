import { Plugin } from "obsidian";
import {
	DEFAULT_SETTINGS,
	type TimestampySettings,
	TimestampySettingTab,
} from "./settings";

export default class Timestampy extends Plugin {
	settings: TimestampySettings;

	async onload() {
		console.debug("loading Timestampy plugin");
		await this.loadSettings();
		this.addSettingTab(new TimestampySettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) };
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

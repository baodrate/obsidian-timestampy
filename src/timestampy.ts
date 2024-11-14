import { Plugin } from "obsidian";
import {
	DEFAULT_SETTINGS,
	TimestampySettingTab,
	type TimestampySettings,
} from "./settings";

export default class Timestampy extends Plugin {
	settings: TimestampySettings;

	async onload() {
		console.log("loading Timestampy plugin");
		await this.loadSettings();
		this.addSettingTab(new TimestampySettingTab(this.app, this));
	}

	async loadSettings() {
		console.debug("loading Timestampy settings");
		this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) };
	}

	async saveSettings() {
		console.debug("saving Timestampy settings");
		await this.saveData(this.settings);
	}
}
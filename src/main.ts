import { Plugin } from "obsidian";
import {
	DEFAULT_SETTINGS,
	type MyPluginSettings,
	SampleSettingTab,
} from "./settings";

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		console.debug("loading Sample Plugin");
		await this.loadSettings();
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) };
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

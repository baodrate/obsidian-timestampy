import { Plugin } from "obsidian";
import {
	DEFAULT_SETTINGS,
	SettingsProxyHandler,
	type TimestampySettings,
	type Nullable,
	TimestampySettingTab,
} from "./settings";

export default class TimestampyPlugin extends Plugin {
	declare settings: TimestampySettings;
	declare userSettings: Nullable<TimestampySettings>;

	async onload() {
		console.debug("=============");
		console.debug("loading Timestampy plugin");
		await this.loadSettings();
		this.addSettingTab(new TimestampySettingTab(this.app, this));
	}

	async onunload() {
		console.debug("unloading Timestampy plugin");
	}

	async loadSettings() {
		console.log("loading Timestampy settings");
		const loadedSettings = await this.loadData();
		this.userSettings = Object.assign({}, DEFAULT_SETTINGS, loadedSettings);
		// @ts-ignore: can't use different getter/setter types with Proxy; see: https://github.com/microsoft/TypeScript/issues/43826
		this.settings = new Proxy<TimestampySettings>( this.userSettings, SettingsProxyHandler);
		console.log("load this.settings", this.settings);
		console.log("load json.settings", JSON.stringify(this.settings));
		console.log("load this._settings", JSON.stringify(this.userSettings));
		// console.log("setting getOwnPropertyNames:", Object.getOwnPropertyNames(this.settings));
	}

	async saveSettings() {
		console.log("save this.settings", this.settings);
		console.log("save json.settings", JSON.stringify(this.settings));
		console.log("save this._settings", JSON.stringify(this.userSettings));
		await this.saveData(this.userSettings);
	}
}

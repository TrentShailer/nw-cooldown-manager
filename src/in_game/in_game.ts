import { OWGames } from "@overwolf/overwolf-api-ts";

import { AppWindow } from "../AppWindow";
import { kWindowNames, kGamesFeatures } from "../consts";

import { POI, POIManager } from "./poi";

class InGame extends AppWindow {
	private static _instance: InGame;
	private POIManager: POIManager;
	private settingsButton: HTMLElement;
	private closeButton: HTMLElement;
	private container: HTMLElement;
	private settingsMenu: HTMLElement;
	private serverCheckbox: HTMLElement;

	private constructor() {
		super(kWindowNames.inGame);
	}

	public openSettings() {
		// No access to class members
		let container = document.getElementById("container");
		let settingsMenu = document.getElementById("settingsMenu");
		let settingsButton = document.getElementById("settingsButton");
		let closeButton = document.getElementById("closeButton");

		container.style.visibility = "hidden";
		settingsButton.style.visibility = "hidden";
		settingsMenu.style.visibility = "visible";
		closeButton.style.visibility = "visible";
	}

	public closeSettings() {
		// No access to class members
		let container = document.getElementById("container");
		let settingsMenu = document.getElementById("settingsMenu");
		let settingsButton = document.getElementById("settingsButton");
		let closeButton = document.getElementById("closeButton");

		container.style.visibility = "visible";
		settingsButton.style.visibility = "visible";
		settingsMenu.style.visibility = "hidden";
		closeButton.style.visibility = "hidden";
	}

	public serverChange(event) {
		let newState = event.target.checked;
		localStorage.setItem("server", newState);
		if (newState === false) {
			overwolf.windows.sendMessage("background", "disableServer", "", () => {});
		} else {
			overwolf.windows.sendMessage("background", "enableServer", "", () => {});
		}
	}

	public static instance() {
		if (!this._instance) {
			this._instance = new InGame();
		}

		return this._instance;
	}

	public async run() {
		const gameClassId = await this.getCurrentGameClassId();

		const gameFeatures = kGamesFeatures.get(gameClassId);

		this.container = document.getElementById("container");
		this.settingsMenu = document.getElementById("settingsMenu");
		this.settingsButton = document.getElementById("settingsButton");
		this.closeButton = document.getElementById("closeButton");
		this.serverCheckbox = document.getElementById("serverCheckbox");

		let shouldBeChecked = localStorage.getItem("server");
		if (shouldBeChecked === "false" || shouldBeChecked === null) {
			this.serverCheckbox.removeAttribute("checked");
		} else {
			this.serverCheckbox.setAttribute("checked", "true");
		}

		this.serverCheckbox.removeEventListener("change", this.serverChange);
		this.serverCheckbox.addEventListener("change", this.serverChange);

		this.settingsButton.removeEventListener("click", this.openSettings);
		this.settingsButton.addEventListener("click", this.openSettings);

		this.closeButton.removeEventListener("click", this.closeSettings);
		this.closeButton.addEventListener("click", this.closeSettings);

		if (gameFeatures && gameFeatures.length) {
			this.POIManager = new POIManager();
			setInterval(() => {
				this.POIManager.UpdateTimers();
			}, 1000 * 60);
		}
	}

	private async getCurrentGameClassId(): Promise<number | null> {
		const info = await OWGames.getRunningGameInfo();
		return info && info.isRunning && info.classId ? info.classId : null;
	}
}

InGame.instance().run();

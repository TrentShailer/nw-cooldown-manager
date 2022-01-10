import { OWGames, OWHotkeys } from "@overwolf/overwolf-api-ts";

import { AppWindow } from "../AppWindow";
import { kWindowNames, kGamesFeatures, kHotkeys } from "../consts";

class Prompts extends AppWindow {
	private static _instance: Prompts;
	private container: HTMLElement;
	private title: HTMLElement;
	private timer: HTMLElement;
	private confirm: HTMLElement;
	private acceptK: HTMLElement;
	private denyK: HTMLElement;
	private ready: boolean = true;
	private currentPrompt: string;
	private messageListener;
	private denied: Array<string> = new Array<string>();
	private currentLocation: ResetObject = new ResetObject("", "");

	private constructor() {
		super(kWindowNames.prompts);
		this.container = document.getElementById("container");
		this.title = document.getElementById("title");
		this.timer = document.getElementById("timer");
		this.confirm = document.getElementById("confirm");
		this.acceptK = document.getElementById("acceptK");
		this.denyK = document.getElementById("denyK");

		this.setToggleHotkeyBehavior();
	}

	public static instance() {
		if (!this._instance) {
			this._instance = new Prompts();
		}

		return this._instance;
	}

	private Timeout(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	public async run() {
		const gameClassId = await this.getCurrentGameClassId();
		const gameFeatures = kGamesFeatures.get(gameClassId);

		if (gameFeatures && gameFeatures.length) {
			overwolf.windows.onMessageReceived.removeListener(this.messageListener);
			this.messageListener = overwolf.windows.onMessageReceived.addListener(
				async (message) => {
					if (this.currentPrompt === message.id) return;
					while (!this.ready) {
						await this.Timeout(5000);
					}
					if (message.id === "gameLaunch") {
						this.currentPrompt = "gameLaunch";
						this.ready = false;
						console.log("Received show/hide prompt");
						this.ShowHidePrompt();
					}
					if (message.id === "reset") {
						this.currentPrompt = "reset";
						this.ready = false;
						console.log("Received reset prompt");
						this.ResetPrompt(message.content);
					}
					if (message.id === "webError") {
						this.currentPrompt = "webError";
						this.ready = false;
						console.log("Received web error prompt");
						this.WebErrorPrompt(message.content);
					}
				}
			);
		}
	}

	private WebErrorPrompt(message: string) {
		this.title.innerHTML = message;
		this.timer.style.width = "0px";
		this.container.style.opacity = "1";

		this.Close();
	}

	private Close() {
		setTimeout(() => {
			this.currentPrompt = "";
			this.container.style.opacity = "0";
			this.timer.style.transition = "";
			setTimeout(() => {
				this.confirm.style.visibility = "hidden";
				this.timer.style.width = "540px";
				setTimeout(() => {
					this.timer.style.transition = "width 20000ms linear";
					this.ready = true;
				}, 500);
			}, 500);
		}, 20000);
	}

	private InstantClose() {
		this.currentPrompt = "";
		this.container.style.opacity = "0";
		this.timer.style.transition = "";
		setTimeout(() => {
			this.confirm.style.visibility = "hidden";
			this.timer.style.width = "540px";
			setTimeout(() => {
				this.timer.style.transition = "width 20000ms linear";
				this.ready = true;
			}, 500);
		}, 500);
	}

	private ShowHidePrompt() {
		overwolf.settings.hotkeys.get((result) => {
			let hotkey = result.games[21816][0].binding;
			this.title.innerHTML = `Use <span style="font-family: Roboto Mono; color: #4caf50;">[${hotkey}]</span> to show/hide the in-game window.`;
			this.timer.style.width = "0px";
			this.container.style.opacity = "1";

			this.Close();
		});
	}

	private ResetPrompt(content: ResetObject) {
		if (this.denied.includes(content.id)) return;
		this.currentLocation = content;

		overwolf.settings.hotkeys.get((result) => {
			this.title.innerHTML = `Attempting to reset cooldown for ${this.currentLocation.name}`;
			this.confirm.style.visibility = "visible";
			this.timer.style.width = "0px";
			this.container.style.opacity = "1";

			let hotkeys = result.games[21816];

			this.acceptK.textContent = `[${hotkeys[1].binding}]`;
			this.denyK.textContent = `[${hotkeys[2].binding}]`;
			this.Close();
		});
	}

	private async getCurrentGameClassId(): Promise<number | null> {
		const info = await OWGames.getRunningGameInfo();
		return info && info.isRunning && info.classId ? info.classId : null;
	}

	private async setToggleHotkeyBehavior() {
		const accept = async (
			hotkeyResult: overwolf.settings.hotkeys.OnPressedEvent
		): Promise<void> => {
			console.log(`pressed hotkey for ${hotkeyResult.name}`);
			if (
				!this.ready &&
				this.currentLocation.id !== "" &&
				!this.denied.includes(this.currentLocation.id)
			) {
				// Reset
				overwolf.windows.sendMessage(
					"background",
					"resetAccept",
					this.currentLocation,
					() => {}
				);
				console.log("Accepted");
				this.currentLocation.id = "";
				this.InstantClose();
			}
		};

		const deny = async (
			hotkeyResult: overwolf.settings.hotkeys.OnPressedEvent
		): Promise<void> => {
			console.log(`pressed hotkey for ${hotkeyResult.name}`);
			if (!this.ready && this.currentLocation.id !== "") {
				console.log("Denied");
				this.denied.push(this.currentLocation.id);

				setTimeout(() => {
					this.denied.shift();
				}, 1000 * 60 * 30);

				this.currentLocation.id = "";
				this.InstantClose();
			}
		};

		OWHotkeys.onHotkeyDown(kHotkeys.accept, accept);
		OWHotkeys.onHotkeyDown(kHotkeys.deny, deny);
	}
}

class ResetObject {
	public id: string;
	public name: string;

	constructor(id: string, name: string) {
		this.id = id;
		this.name = name;
	}
}

Prompts.instance().run();

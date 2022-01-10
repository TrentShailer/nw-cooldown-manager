import { OWGameListener, OWWindow, OWHotkeys } from "@overwolf/overwolf-api-ts";

import { kWindowNames, kGameClassIds, kHotkeys } from "../consts";

import RunningGameInfo = overwolf.games.RunningGameInfo;

import { CoreLogic } from "./coreLogic";

import WindowState = overwolf.windows.WindowStateEx;

class BackgroundController {
	private static _instance: BackgroundController;
	private _windows: Record<string, OWWindow> = {};
	private _gameListener: OWGameListener;
	private coreLogic: CoreLogic;

	private constructor() {
		this._windows[kWindowNames.inGame] = new OWWindow(kWindowNames.inGame);
		this._windows[kWindowNames.prompts] = new OWWindow(kWindowNames.prompts);

		this._gameListener = new OWGameListener({
			onGameStarted: this.toggleWindows.bind(this),
			onGameEnded: this.toggleWindows.bind(this),
		});

		this.coreLogic = new CoreLogic();

		this.setToggleHotkeyBehavior();
	}

	public static instance(): BackgroundController {
		if (!BackgroundController._instance) {
			BackgroundController._instance = new BackgroundController();
		}

		return BackgroundController._instance;
	}

	public async run() {
		this._gameListener.start();
	}

	private toggleWindows(info: RunningGameInfo) {
		if (!info || !this.isSupportedGame(info)) {
			return;
		}

		if (!info.isRunning) {
			this._windows[kWindowNames.inGame].close();
			this._windows[kWindowNames.prompts].close();
			this.coreLogic.OnGameClose();
		} else {
			this._windows[kWindowNames.prompts].restore().then(() => {
				setTimeout(() => {
					console.log("Sent show/hide prompt");
					overwolf.windows.sendMessage(kWindowNames.prompts, "gameLaunch", "", () => {});
				}, 2000);
			});

			this.coreLogic.OnGameStart();
		}
	}

	private isSupportedGame(info: RunningGameInfo) {
		return kGameClassIds.includes(info.classId);
	}

	private async setToggleHotkeyBehavior() {
		const toggleInGameWindow = async (
			hotkeyResult: overwolf.settings.hotkeys.OnPressedEvent
		): Promise<void> => {
			console.log(`pressed hotkey for ${hotkeyResult.name}`);
			const inGameState = await this._windows[kWindowNames.inGame].getWindowState();

			if (
				inGameState.window_state === WindowState.NORMAL ||
				inGameState.window_state === WindowState.MAXIMIZED
			) {
				this._windows[kWindowNames.inGame].minimize();
			} else if (
				inGameState.window_state === WindowState.MINIMIZED ||
				inGameState.window_state === WindowState.CLOSED
			) {
				this._windows[kWindowNames.inGame].restore();
			}
		};

		const interact = async (
			hotkeyResult: overwolf.settings.hotkeys.OnPressedEvent
		): Promise<void> => {
			console.log(`pressed hotkey for ${hotkeyResult.name}`);
			if (this.coreLogic.gameOpen) {
				this.coreLogic.OnInteract();
			}
		};
		OWHotkeys.onHotkeyDown(kHotkeys.interact, interact);
		OWHotkeys.onHotkeyDown(kHotkeys.toggle, toggleInGameWindow);
	}
}

BackgroundController.instance().run();

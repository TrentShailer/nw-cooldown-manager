import React, { useEffect, useState } from "react";
import ActionPrompt from "./ActionPrompt";
import InfoPrompt from "./InfoPrompt";

import { OWHotkeys } from "@overwolf/overwolf-api-ts";

let listener: any;
let timeout: any;

function App() {
	const [message, setMessage] = useState<string>("");
	const [occupied, setOccupied] = useState<boolean>(false);
	const [prompt, setPrompt] = useState<any>("");

	const [acceptHotkeys, setAcceptHotkeys] = useState<boolean>(false);

	const [acceptID, setAcceptID] = useState<string>("");
	const [acceptContent, setAcceptContent] = useState<object>({});
	const [denyID, setDenyID] = useState<string>("");
	const [denyContent, setDenyContent] = useState<object>({});

	const Timeout = (ms: number): Promise<void> => {
		return new Promise((resolve) => setTimeout(resolve, ms));
	};

	const GetState = (setter: any): Promise<any> => {
		return new Promise((resolve) => {
			setter((value: any) => {
				resolve(value);
				return value;
			});
		});
	};

	const accept = async (
		hotKeyResult: overwolf.settings.hotkeys.OnPressedEvent
	): Promise<void> => {
		console.log("Pressed accept hotkey");
		if (!(await GetState(setAcceptHotkeys))) return;
		console.log("Allowed");
		overwolf.windows.sendMessage(
			"background",
			await GetState(setAcceptID),
			await GetState(setAcceptContent),
			() => {}
		);
		setOccupied(false);
		setMessage("");
		setPrompt("");
		setAcceptHotkeys(false);
		clearTimeout(timeout);
	};

	const deny = async (hotKeyResult: overwolf.settings.hotkeys.OnPressedEvent): Promise<void> => {
		console.log("Pressed deny hotkey");
		if (!(await GetState(setAcceptHotkeys))) return;
		console.log("Allowed");
		overwolf.windows.sendMessage(
			"background",
			await GetState(setDenyID),
			await GetState(setDenyContent),
			() => {}
		);
		setOccupied(false);
		setMessage("");
		setPrompt("");
		setAcceptHotkeys(false);
		clearTimeout(timeout);
	};

	useEffect(() => {
		OWHotkeys.onHotkeyDown("nw_cooldown_manager_accept", accept);
		OWHotkeys.onHotkeyDown("nw_cooldown_manager_deny", deny);

		setTimeout(() => {
			// Make it adjustable?
			overwolf.games.getRunningGameInfo((gInfo) => {
				if (gInfo.success) {
					let handle = gInfo.monitorHandle.value;

					overwolf.utils.getMonitorsList((mInfo) => {
						if (mInfo.success) {
							let monitor = mInfo.displays.filter(
								(m) => m.handle.value === handle
							)[0];
							let factor = monitor.dpiX / 96;

							overwolf.windows.changePosition(
								"prompts",
								Math.ceil((gInfo.logicalWidth - 540) / factor),
								Math.ceil(100 / factor)
							);
						}
					});
				}
			});
		}, 2000);
	}, []);

	useEffect(() => {
		overwolf.windows.onMessageReceived.removeListener(listener);
		listener = overwolf.windows.onMessageReceived.addListener(async (m) => {
			while (await GetState(setOccupied)) {
				console.log("occupied");
				if (m.content.message === (await GetState(setMessage))) return;
				await Timeout(1000);
			}

			console.log("Showing Prompt");

			setOccupied(true);
			setMessage(m.content.message);

			if (m.id === "info") {
				setPrompt(<InfoPrompt message={m.content.message} />);
			}
			if (m.id === "action") {
				setAcceptID(m.content.acceptID);
				setDenyID(m.content.denyID);
				setAcceptContent(m.content.acceptContent);
				setDenyContent(m.content.denyContent);
				setAcceptHotkeys(true);
				setPrompt(<ActionPrompt message={m.content.message} />);
			}

			clearTimeout(timeout);

			timeout = setTimeout(() => {
				console.log("Timeout");
				setOccupied(false);
				setMessage("");
				setPrompt("");
				setAcceptHotkeys(false);
			}, 22500);
		});
	}, []);

	return <div>{prompt}</div>;
}

export default App;

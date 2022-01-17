import React, { useEffect, useState } from "react";
import Cooldowns from "./Cooldowns";
import ManualReset from "./ManualReset";
import { POI } from "./POIs";
import Settings from "./Settings";

let listener: any;

function App() {
	const [POIs, setPOIs] = useState<Array<POI>>([]);
	const [curWindow, setCurWindow] = useState<number>(0);

	const ShowSettings = () => {
		setCurWindow(2);
	};

	const ShowManualReset = () => {
		setCurWindow(1);
	};

	const ShowCooldowns = () => {
		setCurWindow(0);
	};

	const initPOIs = () => {
		let pois: Array<POI> = new Array<POI>();
		pois.push(new POI("scorched", "Scorched Mines"));
		pois.push(new POI("myrkguard", "Myrkguard"));
		pois.push(new POI("forecastle", "Forecastle"));
		pois.push(new POI("eternal", "Eternal Pools"));
		pois.push(new POI("imperial", "Imperial Palace"));
		pois.push(new POI("malevolence", "Malevolence"));
		pois.push(new POI("mangled", "Mangled Heights"));
		pois.push(new POI("caminus", "Caminus"));

		setPOIs(pois);
	};

	useEffect(() => {
		initPOIs();

		setTimeout(() => {
			overwolf.games.getRunningGameInfo((result) => {
				if (result.success) {
					overwolf.windows.changePosition("in_game", result.width - 296, 260);
				}
			});
		}, 2000);
	}, []);

	return (
		<div
			style={{
				width: 296,
				height: 500,
			}}>
			<Cooldowns
				style={{
					visibility: curWindow !== 0 ? "hidden" : "visible",
				}}
				ShowSettings={ShowSettings}
				ShowManualReset={ShowManualReset}
			/>

			<ManualReset
				style={{
					visibility: curWindow !== 1 ? "hidden" : "visible",
				}}
				POIs={POIs}
				ShowCooldowns={ShowCooldowns}
			/>
			<Settings
				style={{
					visibility: curWindow !== 2 ? "hidden" : "visible",
				}}
				ShowCooldowns={ShowCooldowns}
			/>
			<div style={{ color: "#616161", position: "absolute", right: 5, bottom: 0 }}>0.2.4</div>
		</div>
	);
}

export default App;
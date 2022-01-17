import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { POI } from "./POIs";
import POIComponent from "./POIComponent";

let listener: any;

function Cooldowns(props: any) {
	const [POIs, setPOIs] = useState<Array<POI>>([]);

	useEffect(() => {
		overwolf.windows.onMessageReceived.removeListener(listener);
		listener = overwolf.windows.onMessageReceived.addListener((message) => {
			if (message.id === "refresh") {
				load();
			}
		});
	}, []);

	useEffect(() => {
		load();
	}, []);

	const load = () => {
		setPOIs((val: Array<POI>) => {
			let pois: Array<POI> = new Array<POI>();
			pois.push(new POI("scorched", "Scorched Mines"));
			pois.push(new POI("myrkguard", "Myrkguard"));
			pois.push(new POI("forecastle", "Forecastle"));
			pois.push(new POI("eternal", "Eternal Pools"));
			pois.push(new POI("imperial", "Imperial Palace"));
			pois.push(new POI("malevolence", "Malevolence"));
			pois.push(new POI("mangled", "Mangled Heights"));
			pois.push(new POI("caminus", "Caminus"));

			console.log(`Loading ${pois.length} POIs`);

			for (let i = 0; i < pois.length; i++) {
				pois[i].LoadTimestamp();
			}

			pois.sort((poiA: POI, poiB: POI) => {
				return poiA.timestamp - poiB.timestamp;
			});

			console.log("Sorted");

			return pois;
		});
	};

	return (
		<div
			style={{
				paddingLeft: 80,
				paddingRight: 20,
				paddingTop: 20,
				paddingBottom: 20,
				...props.style,
			}}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-around",
					position: "absolute",
					height: 460,
				}}>
				{POIs.map((poi: POI) => (
					// Timestamp is one change behind??
					<POIComponent key={poi.id} name={poi.name} timestamp={poi.timestamp} />
				))}
			</div>
			<div style={{ position: "absolute", right: 10, top: 10 }}>
				<img
					onClick={props.ShowSettings}
					style={{ width: 24, height: 24, cursor: "pointer" }}
					src="../icons/Settings_Button.png"
					alt=""
				/>
			</div>
			<div style={{ position: "absolute", right: 40, top: 10 }}>
				<img
					onClick={props.ShowManualReset}
					style={{ width: 24, height: 24, cursor: "pointer" }}
					src="../icons/Reset_Button.png"
					alt=""
					title="Manual Reset"
				/>
			</div>
		</div>
	);
}

Cooldowns.propTypes = {
	ShowSettings: PropTypes.func,
	ShowManualReset: PropTypes.func,
	style: PropTypes.object,
};

export default Cooldowns;

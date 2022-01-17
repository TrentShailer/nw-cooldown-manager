import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

let updateLoop: any;

function POIComponent(props: any) {
	const [timeText, setTimeText] = useState<string>("");
	const [textColor, setTextColor] = useState<string>("");

	const UpdateText = () => {
		let timestamp: number = props.timestamp;
		let diff: number = timestamp - Date.now();

		if (diff < 0) {
			setTimeText("Ready");
			setTextColor("#2DCF9A");
		} else {
			let hours: number = Math.floor(diff / 3600000);
			let minutes: number = Math.floor((diff - hours * 3600000) / 60000);

			let timeMessage = `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m` : ""}`;

			if (hours <= 0 && minutes <= 0) {
				timeMessage = "<1m";
			}

			setTextColor("#85CDF4");
			setTimeText(timeMessage);
		}
	};

	const StartLoop = () => {
		UpdateText();
		clearInterval(updateLoop);
		updateLoop = setInterval(() => {
			UpdateText();
		}, 1000 * 60);
	};

	useEffect(() => {
		StartLoop();

		return () => {
			clearInterval(updateLoop);
		};
	}, [props.timestamp]);

	return (
		<div>
			<div>
				<div style={{ color: textColor }}>{props.name}</div>
				<div style={{ color: "#fff", marginLeft: 20 }}>{timeText}</div>
			</div>
		</div>
	);
}

POIComponent.propTypes = {
	name: PropTypes.string,
	timestamp: PropTypes.number,
};

export default POIComponent;

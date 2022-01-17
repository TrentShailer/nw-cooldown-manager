import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Timer from "./Timer";

function ActionPrompt(props: any) {
	const [opacity, setOpacity] = useState(0);

	const [acceptKey, setAcceptKey] = useState("");
	const [denyKey, setDenyKey] = useState("");

	useEffect(() => {
		setOpacity(1);

		overwolf.settings.hotkeys.get((result: any) => {
			setAcceptKey(result.games[21816][1].binding);
			setDenyKey(result.games[21816][2].binding);
		});

		setTimeout(() => {
			setOpacity(0);
		}, 20000);
	}, []);

	return (
		<div
			style={{
				width: 540,
				height: 100,
				background: "rgba(0, 0, 0, 0.75)",
				transition: "opacity 500ms ease",
				opacity: opacity,
			}}>
			<Timer />
			<div
				style={{ width: 500, height: 60, padding: 20 }}
				dangerouslySetInnerHTML={{ __html: props.message }}></div>
			<div style={{ position: "absolute", bottom: 10 }}>
				<div
					style={{
						display: "flex",
						width: 540,
						justifyContent: "space-around",
						flexDirection: "row",
						fontFamily: "Roboto Mono",
					}}>
					<div style={{ color: "#f44336" }}>[{denyKey}] Deny</div>
					<div style={{ color: "#8bc34a" }}>[{acceptKey}] Accept</div>
				</div>
			</div>
		</div>
	);
}

ActionPrompt.propTypes = {
	message: PropTypes.string,
};

export default ActionPrompt;

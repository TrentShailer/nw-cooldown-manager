import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

function Settings(props: any) {
	const [serverValue, setServerValue] = useState<boolean>(false);

	useEffect(() => {
		let setting = localStorage.getItem("serverSetting");

		if (setting === null || setting === "false") setServerValue(false);
		else setServerValue(true);
	}, []);

	const handleChange = (e: any) => {
		let newState = e.target.checked;
		setServerValue(newState);

		overwolf.windows.sendMessage(
			"background",
			"serverSettingChange",
			{ state: newState },
			() => {}
		);
	};

	return (
		<div style={{ ...props.style }}>
			<div style={{ position: "absolute", right: 10, top: 10 }}>
				<img
					onClick={props.ShowCooldowns}
					style={{ width: 24, height: 24, cursor: "pointer" }}
					src="../icons/Close_Button.png"
					alt=""
				/>
			</div>
			<div
				style={{
					paddingLeft: 20,
					paddingRight: 20,
					paddingTop: 20,
					paddingBottom: 20,
					position: "absolute",
				}}>
				<div>
					<div style={{ fontWeight: 600, fontSize: 18, marginBottom: 5 }}>
						Send data to server{" "}
						<input checked={serverValue} onChange={handleChange} type="checkbox" />
					</div>
					<div style={{ lineHeight: "1.15rem", fontSize: 14, marginTop: 5 }}>
						This will send your
						<span style={{ fontWeight: 600 }}>Player Name and POI cooldowns</span> to a
						web server.
					</div>
					<div style={{ lineHeight: "1.15rem", fontSize: 14, marginTop: 5 }}>
						This data can be pulled by <span style={{ fontWeight: 600 }}>anyone</span>.
					</div>
					<div style={{ lineHeight: "1.15rem", fontSize: 14, marginTop: 5 }}>
						The purpose of this is to allow 3rd party devs to display their company
						member's cooldowns through a discord bot for example.
					</div>
					<div style={{ lineHeight: "1.15rem", fontSize: 14, marginTop: 5 }}>
						Turning this off will also wipe any of your data from the server.
					</div>
				</div>
			</div>
		</div>
	);
}

Settings.propTypes = {
	ShowCooldowns: PropTypes.func,
	style: PropTypes.object,
};

export default Settings;

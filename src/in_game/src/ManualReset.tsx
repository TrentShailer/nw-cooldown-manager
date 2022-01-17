import React, { useState } from "react";
import PropTypes from "prop-types";
import { POI } from "./POIs";

function ManualReset(props: any) {
	const [selectedPOI, setSelectedPOI] = useState<string>("scorched");
	const [hours, setHours] = useState<string>("");
	const [minutes, setMinutes] = useState<string>("");
	const [errorText, setErrorText] = useState<string>("");

	const reset = () => {
		setHours("");
		setMinutes("");
		setErrorText("");
		props.ShowCooldowns();
	};

	const handleSelectedPOIChange = (e: any) => {
		setSelectedPOI(e.target.value);
	};

	const handleHoursChange = (e: any) => {
		setHours(e.target.value);
	};

	const handleMinutesChange = (e: any) => {
		setMinutes(e.target.value);
	};

	const handleConfirm = (e: any) => {
		if (parseFloat(hours) > 48) {
			setErrorText("Hours cannot be larger than 48");
			return;
		} else if (parseFloat(hours) < -1) {
			setErrorText("Hours cannot be less than -1");
			return;
		} else if (parseFloat(minutes) > 59) {
			setErrorText("Minutes cannot be larger than 59");
			return;
		} else if (parseFloat(minutes) < -1) {
			setErrorText("Minutes cannot be less than -1");
			return;
		} else if (minutes === "" || hours === "" || selectedPOI === "") {
			setErrorText("One or more fields are empty");
			return;
		} else {
			setErrorText("");
		}
		overwolf.windows.sendMessage(
			"background",
			"manualReset",
			{
				id: selectedPOI,
				timestamp: Date.now() + parseFloat(hours) * 3600000 + parseFloat(minutes) * 60000,
			},
			() => {
				reset();
			}
		);
	};

	return (
		<div style={{ ...props.style }}>
			<div style={{ position: "absolute", right: 10, top: 10 }}>
				<img
					onClick={reset}
					style={{ width: 24, height: 24, cursor: "pointer" }}
					src="../icons/Close_Button.png"
					alt=""
				/>
			</div>
			<div style={{ padding: 20, position: "absolute" }}>
				<div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Manual Reset</div>
				<div style={{ display: "flex", flexDirection: "column" }}>
					<select
						style={{ outline: "none", padding: 3, margin: 5 }}
						value={selectedPOI}
						onChange={handleSelectedPOIChange}>
						{props.POIs.map((poi: POI) => {
							return <option value={poi.id}>{poi.name}</option>;
						})}
					</select>
					<input
						style={{ outline: "none", padding: 3, margin: 5 }}
						value={hours}
						min={-1}
						max={48}
						placeholder="Hours"
						onChange={handleHoursChange}
						type="number"
					/>
					<input
						style={{ outline: "none", padding: 3, margin: 5 }}
						value={minutes}
						min={-1}
						max={59}
						placeholder="Minutes"
						onChange={handleMinutesChange}
						type="number"
					/>
					<div>Set Hours and Minutes to -1 to make the POI ready</div>
					<button
						onClick={handleConfirm}
						style={{ outline: "none", padding: 3, margin: 5 }}>
						Confirm
					</button>
					<div style={{ color: "#f44336", fontWeight: 600 }}>{errorText}</div>
				</div>
			</div>
		</div>
	);
}

ManualReset.propTypes = {
	ShowCooldowns: PropTypes.func,
	POIs: PropTypes.array,
	style: PropTypes.object,
};

export default ManualReset;

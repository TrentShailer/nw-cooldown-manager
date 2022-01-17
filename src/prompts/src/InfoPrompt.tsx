import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Timer from "./Timer";

function InfoPrompt(props: any) {
	const [opacity, setOpacity] = useState(0);

	useEffect(() => {
		setOpacity(1);
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
		</div>
	);
}

InfoPrompt.propTypes = {
	message: PropTypes.string,
};

export default InfoPrompt;

import React, { useEffect, useState } from "react";

export default function Timer() {
	const [width, setWidth] = useState(540);

	useEffect(() => {
		setTimeout(() => {
			setWidth(0);
		}, 100);
	}, []);

	return (
		<div
			style={{
				width: width,
				height: 2,
				background: "#ffc107",
				transition: "width 20s linear",
			}}
		/>
	);
}

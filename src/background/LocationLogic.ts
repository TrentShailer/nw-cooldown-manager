import { POI } from "./POI";
import { Polygon, Vector2 } from "./shapes";

function LocationLogic(POIs: Array<POI>) {
	overwolf.games.events.getInfo((info) => {
		if (info.res && info.res.game_info && info.res.game_info.location) {
			// Ensure location data is initialized
			if (info.res.game_info.location.includes("0.00")) {
				return;
			}
			let location: Vector2 = ConvertLocation(info.res.game_info.location);

			for (let i = 0; i < POIs.length; i++) {
				let isInside: boolean = POIs[i].shape.isPointInside(location);
				if (isInside) {
					console.log("Inside " + POIs[i].id);
					if (Date.now() > POIs[i].timestamp && Date.now() > POIs[i].denyTimestamp) {
						console.log("Prompting for reset of " + POIs[i].id);
						overwolf.windows.sendMessage(
							"prompts",
							"action",
							{
								message: `Attempting to reset cooldown for ${POIs[i].name}`,
								acceptID: "resetAccept",
								denyID: "resetDeny",
								acceptContent: { id: POIs[i].id },
								denyContent: { id: POIs[i].id },
							},
							() => {}
						);
					}
				}
			}
		}
	});
}

function ConvertLocation(locationString: string): Vector2 {
	let splitString = locationString.split(",");

	let location = new Vector2(parseFloat(splitString[1]), parseFloat(splitString[3]));
	console.log("Location: " + location.x + ", " + location.y);
	return location;
}

export { LocationLogic };

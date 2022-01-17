import axios from "axios";
import { CoreLogic } from "./coreLogic";
import { Polygon } from "./Shapes";

class POI {
	public id: string;
	public name: string;
	public timestamp: number;
	public denyTimestamp: number = -1;
	public shape: Polygon;
	public creator: CoreLogic;

	public constructor(_id: string, _name: string, _shape: Polygon, _creator: CoreLogic) {
		this.id = _id;
		this.name = _name;
		this.shape = _shape;
		this.creator = _creator;

		this.LoadTimestamp();
	}

	public LoadTimestamp() {
		let storage: string = window.localStorage.getItem(this.id);
		this.timestamp = storage === null ? -1 : parseFloat(storage);
	}

	public async SaveTimestamp() {
		window.localStorage.setItem(this.id, this.timestamp.toString());

		let serverSetting: string = localStorage.getItem("serverSetting");
		if (serverSetting === "true") {
			let player_name = localStorage.getItem("player_name");
			if (player_name === null) {
				player_name = (await this.creator.GetInfo("player_name")).player_name;
			}
			axios
				.post(
					`https://cooldowns.trentshailer.com/update/${player_name}/${this.id}/${this.timestamp}`
				)
				.catch((error) => {
					let response = error.response;
					switch (response.status) {
						case 404:
							overwolf.windows.sendMessage(
								"prompts",
								"info",
								{
									message: `Your player isn't currently on the server, try toggling the setting off and on again, if that doesn't work contact me at @Fantus-Alt#7417`,
								},
								() => {}
							);
							break;

						default:
							overwolf.windows.sendMessage(
								"prompts",
								"info",
								{
									message: `The server may have failed to update your data; code: ${response.status}_3, send this code to @Fantus-Alt#7417`,
								},
								() => {}
							);
							break;
					}
				});
		}
	}

	public SetTimestamp(timestamp: number) {
		this.timestamp = timestamp;
		this.SaveTimestamp();
	}
}

export { POI };

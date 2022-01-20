import { POI } from "./POI";
import { LocationLogic } from "./LocationLogic";
import { Polygon, Vector2 } from "./shapes";
import axios from "axios";
import { kWindowNames } from "../consts";

class CoreLogic {
	public POIs: Array<POI> = new Array<POI>();
	public gameOpen: boolean = false;
	private messageListener;

	private InitializePOIs() {
		let scorched = new Polygon(
			[
				new Vector2(9102.52, 9336.73),
				new Vector2(9170.28, 9258.52),
				new Vector2(9024.71, 9094.4),
				new Vector2(8964.21, 9067.37),
				new Vector2(8849.64, 9083.41),
				new Vector2(8700.07, 9160.82),
				new Vector2(8662.27, 9272.76),
				new Vector2(8809.94, 9380.31),
				new Vector2(8859.94, 9375.31),
				new Vector2(9033.57, 9338.68),
			],
			new Vector2(8926.05, 9221.44)
		);
		this.POIs.push(new POI("scorched", "Scorched Mines", scorched, this));

		let myrkguard = new Polygon(
			[
				new Vector2(9407.13, 9542.41),
				new Vector2(9500.15, 9630.36),
				new Vector2(9646.47, 9705.72),
				new Vector2(9797.99, 9682.24),
				new Vector2(10022.32, 9552.3),
				new Vector2(9961.41, 9458.75),
				new Vector2(9890.7, 9422.07),
				new Vector2(9862.7, 9381.59),
				new Vector2(9883.2, 9337.61),
				new Vector2(9802.69, 9296.63),
				new Vector2(9654.27, 9447.36),
				new Vector2(9550.15, 9392.58),
				new Vector2(9449.44, 9387.19),
			],
			new Vector2(9736.37, 9531.77)
		);
		this.POIs.push(new POI("myrkguard", "Myrkguard", myrkguard, this));

		let forecastle = new Polygon(
			[
				new Vector2(11468.43, 3073.85),
				new Vector2(11324.16, 3005.64),
				new Vector2(11323.61, 2781.6),
				new Vector2(11439.85, 2451.98),
				new Vector2(11661.48, 2473.57),
				new Vector2(11695.48, 2669.77),
				new Vector2(11615.17, 2956.22),
			],
			new Vector2(11487.3, 2789.36)
		);
		this.POIs.push(new POI("forecastle", "Forecastle", forecastle, this));

		let eternal = new Polygon(
			[
				new Vector2(10898.76, 3750.06),
				new Vector2(11023.83, 3757.31),
				new Vector2(11070.84, 3824.78),
				new Vector2(11057.84, 3884.65),
				new Vector2(10974.82, 3930.62),
				new Vector2(10850.41, 3869.26),
				new Vector2(10847.41, 3815.28),
			],
			new Vector2(10975.92, 3833.77)
		);
		this.POIs.push(new POI("eternal", "Eternal Pools", eternal, this));

		let imperial = new Polygon(
			[
				new Vector2(5997.12, 5117.94),
				new Vector2(5884.25, 4036.67),
				new Vector2(5201.36, 4652.73),
				new Vector2(5524.16, 5286.2),
			],
			new Vector2(5704.19, 4734.48)
		);
		this.POIs.push(new POI("imperial", "Imperial Palace", imperial, this));

		let malevolence = new Polygon(
			[
				new Vector2(11302.77, 7963.76),
				new Vector2(11439.79, 7980.25),
				new Vector2(11449.79, 7884.3),
				new Vector2(11393.78, 7841.32),
				new Vector2(11319.77, 7867.3),
			],
			new Vector2(11393.78, 7921.28)
		);
		this.POIs.push(new POI("malevolence", "Malevolence", malevolence, this));

		let mangled = new Polygon(
			[
				new Vector2(8445.11, 8304.1),
				new Vector2(8768.16, 7976.93),
				new Vector2(8817.14, 7481.24),
				new Vector2(8553.71, 7305.73),
				new Vector2(7988.43, 7396.08),
				new Vector2(7824.81, 7776.69),
			],
			new Vector2(8442.13, 7794.53)
		);
		this.POIs.push(new POI("mangled", "Mangled Heights", mangled, this));

		let caminus = new Polygon(
			[
				new Vector2(9509.55, 8825.37),
				new Vector2(9643.57, 8713.92),
				new Vector2(9588.16, 8488.04),
				new Vector2(9416.14, 8464.05),
				new Vector2(9347.93, 8743.91),
			],
			new Vector2(9498.1, 8669.83)
		);
		this.POIs.push(new POI("caminus", "Caminus", caminus, this));
	}

	constructor() {
		this.InitializePOIs();

		overwolf.windows.onMessageReceived.removeListener(this.messageListener);

		let onMessageReceived = this.OnMessageReceived.bind(this);

		this.messageListener = overwolf.windows.onMessageReceived.addListener(onMessageReceived);
	}

	public async OnMessageReceived(message: overwolf.windows.MessageReceivedEvent) {
		const ResetAccept = (content: any) => {
			Reset({ id: content.id, timestamp: Date.now() + 1000 * 60 * 60 * 23 });
		};

		const ResetDeny = (content: any) => {
			let id: string = content.id;
			for (let i = 0; i < this.POIs.length; i++) {
				let poi: POI = this.POIs[i];
				if (poi.id === id) {
					this.POIs[i].denyTimestamp = Date.now() + 1000 * 60 * 30;
				}
			}
		};

		const ServerSettingChange = async (content: any) => {
			let state: boolean = content.state;
			console.log(state.toString());
			localStorage.setItem("serverSetting", state.toString());

			let player_name = localStorage.getItem("player_name");
			if (player_name === null) {
				player_name = (await this.GetInfo("player_name")).player_name;
			}

			if (state === true) {
				let data: Array<{ id: string; timestamp: number }> = new Array();
				for (let i = 0; i < this.POIs.length; i++) {
					data.push({ id: this.POIs[i].id, timestamp: this.POIs[i].timestamp });
				}
				console.log(data);
				console.log(JSON.stringify(data));
				axios
					.post(`https://cooldowns.trentshailer.com/add/${player_name}`, data)
					.catch((error) => {
						let response = error.response;
						switch (response.status) {
							default:
								overwolf.windows.sendMessage(
									"prompts",
									"info",
									{
										message: `The server may have failed to get your data; code: ${response.status}_1, send this code to @Fantus-Alt#7417`,
									},
									() => {}
								);
								break;
						}
					});
			} else {
				axios
					.delete(`https://cooldowns.trentshailer.com/delete/${player_name}`)
					.catch((error) => {
						let response = error.response;
						switch (response.status) {
							case 404:
								// No data to begin with
								break;
							default:
								// Other
								overwolf.windows.sendMessage(
									"prompts",
									"info",
									{
										message: `The server may have failed to delete your data; code: ${response.status}_2, send this code to @Fantus-Alt#7417`,
									},
									() => {}
								);
								break;
						}
					});
			}
		};

		const Reset = (content: any) => {
			let id: string = content.id;
			let timestamp: number = content.timestamp;

			for (let i = 0; i < this.POIs.length; i++) {
				let poi: POI = this.POIs[i];
				if (poi.id === id) {
					this.POIs[i].SetTimestamp(timestamp);
					console.log("Sent refresh message");
					overwolf.windows.sendMessage("in_game", "refresh", "", () => {});
				}
			}
		};

		switch (message.id) {
			case "manualReset":
				Reset(message.content);
				break;
			case "serverSettingChange":
				ServerSettingChange(message.content);
				break;
			case "resetAccept":
				ResetAccept(message.content);
				break;
			case "resetDeny":
				ResetDeny(message.content);
				break;
		}
	}

	public async GetInfo(infoWanted: string): Promise<InfoType> {
		let promise: Promise<InfoType> = new Promise<InfoType>((resolve, reject) => {
			let interval = setInterval(() => {
				// Reject the promise if the game isn't open to prevent
				// useless polling
				if (!this.gameOpen) reject();
				overwolf.games.events.getInfo((info) => {
					if (info.res && info.res.game_info && info.res.game_info[infoWanted]) {
						// Ensure location data is initialized
						if (
							infoWanted === "location" &&
							info.res.game_info[infoWanted].includes("0.00")
						) {
							return;
						}
						clearInterval(interval);
						resolve(info.res.game_info);
					}
				});
			}, 5000);
		});
		return await promise;
	}

	public async SaveData() {
		this.POIs.forEach((poi) => {
			poi.SaveTimestamp();
		});
	}

	public async OnInteract() {
		LocationLogic(this.POIs);
	}

	public async OnGameStart() {
		this.gameOpen = true;
		console.log("Game Launched");
		this.GetInfo("player_name").then((info) => {
			localStorage.setItem("player_name", info.player_name);
		});
	}

	public OnGameClose() {
		this.gameOpen = false;
		console.log("Game Closed");
		this.SaveData();
	}
}

class InfoType {
	public player_name: string;
	public location: string;
	public map: string;
	public world_name: string;
}

export { CoreLogic };

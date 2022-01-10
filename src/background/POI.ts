import { Polygon } from "./shapes";

class POI {
	public id: string;
	public name: string;
	public timestamp: number;
	public shape: Polygon;

	public constructor(_id: string, _name: string, _shape: Polygon) {
		this.id = _id;
		this.name = _name;
		this.shape = _shape;
	}

	public resetTime() {
		let now: number = Date.now();
		this.timestamp = now + 1000 * 60 * 60 * 23;
		localStorage.setItem(this.id, this.timestamp.toString());
		overwolf.windows.sendMessage("in_game", "updateEvent", "", () => {});
	}
}

export { POI };

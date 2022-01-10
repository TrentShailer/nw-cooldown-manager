class POI {
	public name: string;
	public id: string;
	public timestamp: number;
	private _textElement: HTMLElement;

	public constructor(_name: string, _id: string) {
		this.name = _name;
		this.id = _id;
	}

	public updateText() {
		this._textElement = document.getElementById(this.id + "_timeText");
		let now: number = Date.now();
		let diff: number = this.timestamp - now;

		if (diff < 0) {
			document.getElementById(this.id + "_title").style.color = "#2DCF9A";
			this._textElement.textContent = "Ready";
			return;
		}
		let hours: number = Math.floor(diff / 3600000);
		let minutes: number = Math.floor((diff - hours * 3600000) / 60000);
		document.getElementById(this.id + "_title").style.color = "#85CDF4";
		let timeMessage = `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m` : ""}`;
		if (hours <= 0 && minutes <= 0) {
			timeMessage = `<1m`;
		}
		this._textElement.textContent = timeMessage;
	}
}

class POIManager {
	public POIs: Array<POI> = new Array<POI>();
	private MessageListener;

	public constructor() {
		this.POIs.push(new POI("Scorched Mines", "scorched"));
		this.POIs.push(new POI("Myrkguard", "myrkguard"));
		this.POIs.push(new POI("Forecastle", "forecastle"));
		this.POIs.push(new POI("Eternal Pools", "eternal"));
		this.POIs.push(new POI("Imperial Palace", "imperial"));
		this.POIs.push(new POI("Malevolence", "malevolence"));
		this.POIs.push(new POI("Mangled Heights", "mangled"));
		this.POIs.push(new POI("Caminus", "caminus"));
		this.LoadPOIData();

		overwolf.windows.onMessageReceived.removeListener(this.MessageListener);
		this.MessageListener = overwolf.windows.onMessageReceived.addListener((message) => {
			if (message.id === "updateEvent") {
				this.LoadPOIData();
			}
		});
	}

	public GetPOIIndex(id: string): number | null {
		let index: number = this.POIs.findIndex((poi) => poi.id === id);
		if (index === -1) {
			return null;
		}
		return index;
	}

	public PostReset() {
		this.POIs.sort((a, b) => a.timestamp - b.timestamp);

		let container: HTMLElement = document.getElementById("container");

		// Clear the container
		while (container.hasChildNodes()) {
			container.removeChild(container.firstChild);
		}

		for (let i = 0; i < this.POIs.length; i++) {
			let POI: POI = this.POIs[i];
			let item: HTMLElement = document.createElement("div");
			item.style.position = "relative";
			item.style.width = "150px";
			item.style.height = "40px";

			let title: HTMLElement = document.createElement("div");
			title.setAttribute("class", "title");
			title.setAttribute("id", POI.id + "_title");

			title.textContent = POI.name;

			let time: HTMLElement = document.createElement("div");
			time.setAttribute("class", "time");
			time.id = `${POI.id}_timeText`;

			let reset: HTMLElement = document.createElement("img");
			reset.setAttribute("class", "reset");
			reset.setAttribute("src", "../icons/Reset_Button.png");
			reset.setAttribute("title", "Manual Reset");
			reset.setAttribute(
				"onclick",
				`overwolf.windows.sendMessage("background", "resetAccept", { id: "${this.POIs[i].id}" }, () => {});`
			);

			item.appendChild(title);
			item.appendChild(reset);
			item.appendChild(time);

			container.appendChild(item);
		}

		this.UpdateTimers();
	}

	public UpdateTimers() {
		for (let i = 0; i < this.POIs.length; i++) {
			this.POIs[i].updateText();
		}
	}

	public LoadPOIData() {
		for (let i = 0; i < this.POIs.length; i++) {
			let timestamp: string = localStorage.getItem(this.POIs[i].id);
			this.POIs[i].timestamp = parseFloat(timestamp === null ? "-1" : timestamp);
		}
		this.PostReset();
	}
}

export { POI, POIManager };

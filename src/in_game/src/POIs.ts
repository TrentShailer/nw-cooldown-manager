class POI {
	public name: string;
	public id: string;
	public timestamp: number = -1;

	constructor(id: string, name: string) {
		this.name = name;
		this.id = id;

		this.LoadTimestamp();
	}

	public LoadTimestamp(): void {
		let timestamp = localStorage.getItem(this.id);
		this.timestamp = timestamp === null ? -1 : parseFloat(timestamp);
	}
}

export { POI };

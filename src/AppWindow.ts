import { OWWindow } from "@overwolf/overwolf-api-ts";

export class AppWindow {
	protected currWindow: OWWindow;
	protected mainWindow: OWWindow;
	protected maximized: boolean = false;

	constructor(windowName: string) {
		this.mainWindow = new OWWindow("background");
		this.currWindow = new OWWindow(windowName);
	}

	public async getWindowState() {
		return await this.currWindow.getWindowState();
	}
}

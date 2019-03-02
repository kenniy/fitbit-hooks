import document from "document";
import { peerSocket } from "messaging";
import { vibration } from "haptics";
import helper from "./helper";


const VIRTUALTILES = document.getElementById("hooks");
renderUI();

peerSocket.onmessage = function({ data }) {
	const { settingsData, key } = data;

	if (key === "posted") {
		vibration.start("bump");
		return;
	}

	vibration.start("confirmation");

	if (settingsData) {
		toggleSpinner(true);
		helper.writeToDeviceStorage(settingsData);
		toggleSpinner(false);
	} else {
		helper.updateDeviceStorage(data);
	}
	renderUI();
};

function renderUI() {
	resetButtons(); //needed to ensure all is clear inbetween updates
	const storedData = helper.loadDeviceData();

	const { ifttt, custom, doubleRow, color, makeRainbow } = storedData;

	const iftttEvents = helper.getIftttEvents(ifttt) || [];
	const customEvents = helper.getCustomEvents(custom) || [];
	const events = [...iftttEvents, ...customEvents].filter((n) => n);

	events.length ?
		renderVirtualTiles({
			events,
			doubleRow: doubleRow === "true"
		}) : toggleNoHook(true);

	VIRTUALTILES.length = events.length;

	updateButtonColors({
		color, makeRainbow: makeRainbow === "true"});
}

function toggleNoHook(state) {
	const noHook = document.getElementById("no-hook");
	noHook.style.display = state ? "inline" : "none";
}

function toggleSpinner(state) {
	let spinner = document.getElementById("spinner");
	spinner.state = state ? "enabled" : "disabled";
}

function resetButtons() {
	document
		.getElementsByClassName("hook")
		.forEach((button) => button.style.display = "none");
}

function updateButtonColors(colorProps) {
	const hookButtons = document
		.getElementsByClassName("hook")
		.filter((button) => button.style.display !== "none");
	helper.colorizeButtons(hookButtons, colorProps);
}

function renderVirtualTiles({ events, doubleRow}) {
	toggleNoHook(false);

	VIRTUALTILES.delegate = {
		getTileInfo: (index) => helper.getRowInfo(index, events, doubleRow),
		configureTile: (tile, info) => {
			const { type, data } = info;

			if (type == "pool") {
				const { button, buttonL, buttonR } = helper.getTileButtons(tile);

				if ( doubleRow ) {
					//for double rows, data comes in set of 2s..
					//these few lines ensure data is appropriately asigned
					(data.length === 1 || data.length === 2) &&
						helper.configureButton({ button:buttonL, data:data[0] });
					data.length > 1 &&
						helper.configureButton({ button:buttonR, data:data[1] });
				} else {
					helper.configureButton({ button, data:data[0] });
				}
			}
		}
	};
}
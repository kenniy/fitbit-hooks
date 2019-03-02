import { peerSocket } from "messaging";
import { colors } from "../settings/helper";
import * as fs from "fs";

const sendEventIfReady = (msg) => {
	if (peerSocket.readyState === peerSocket.OPEN) {
		peerSocket.send(msg);
	} else {
		console.log("No peerSocket?");
	}
};

const addClickEventListener = (el, msg) => {
	el.addEventListener("click",
		() => sendEventIfReady(msg)
	);
};

const getIftttEvents = (iftttEvents) => (
	iftttEvents && JSON.parse(iftttEvents).map((event) => {
		const [name, trigger] = event.name.split(":");
		if (name && trigger) {
			return {
				name,
				type: "ifttt",
				trigger: trigger.replace(/\s/g, "")
			};
		}
	})
);

const getCustomEvents = (customEvents) => (
	customEvents && JSON.parse(customEvents).map((event) => {
		const [ name ] = event.name.split(":");
		return {
			name,
			type: "custom",
			url: event.name.replace(`${name}:`, "").replace(/\s/g, "")
		};
	})
);

const getRowData = (index, events, doubleRow) => {
	const indexCollector = [];
	if (doubleRow && events.length > 1) {
		if (index === 0) {
			indexCollector.push(0,1);
		} else {
			const [a, b] = [index*2, index*2+1];
			a < events.length && indexCollector.push(a);
			b < events.length && indexCollector.push(b);
		}
	} else {
		indexCollector.push(index);
	}
	return indexCollector.map((i) => getEventByIndex(events, i));
};

const getEventByIndex = (events, index) => events[index];

const getTileButtons = (tile) => ({
	button: tile.getElementById("button"),
	buttonL: tile.getElementById("button-l"),
	buttonR: tile.getElementById("button-r")
});

const getRowInfo = (index, events, doubleRow) => ({
	type: "pool",
	data: getRowData(index, events, doubleRow)
});

const configureButton = ({ button, data }) => {
	button.getElementById("text").text = data.name;
	button.style.display = "inherit";
	addClickEventListener(button, data);
};

const colorizeButtons = (buttons, {color, makeRainbow}) => {
	color = color ? color.replace(/"/g, "") : colors[1];
	buttons.forEach((button, index) => {
		button.style.fill = makeRainbow ? colors[index % colors.length]: color;
	});
};

const loadDeviceData = () => {
	try {
		return fs.readFileSync("data.cbor", "cbor");
	} catch (e) {
		return {};
	}
};

const writeToDeviceStorage = (data) => {
	fs.writeFileSync("data.cbor", data, "cbor");
};

const updateDeviceStorage = ({ key, value }) => {
	if (key === "reset") {
		fs.unlinkSync("data.cbor");
	} else {
		writeToDeviceStorage({
			...loadDeviceData(),
			[key]: value
		});
	}
};

export default {
	getIftttEvents,
	getCustomEvents,
	getRowInfo,
	getTileButtons,
	colorizeButtons,
	configureButton,
	loadDeviceData,
	updateDeviceStorage,
	writeToDeviceStorage
};
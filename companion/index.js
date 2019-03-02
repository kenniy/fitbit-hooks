import { peerSocket } from "messaging";
import { settingsStorage } from "settings";

const postUrl = (url) => {
	let fetchCount = 0;
	fetch(url, { method: "POST", mode: "no-cors" })
		.then(() => {
			fetchCount++; //helps with wierd behaviour when sdk sends update more than once;
			(fetchCount === 1) && sendUpdate("posted", true);
		});
};

settingsStorage.onchange = ({
	oldValue,
	newValue,
	key
}) => {
	if (key === "resync") return sendSettingData();
	if (oldValue !== newValue) return sendUpdate(key, newValue);
};

const postIftttHook = ({
	trigger
}) => {
	const iftttApiKeyStore = settingsStorage.getItem("iftttApiKey");
	if (iftttApiKeyStore) {
		const iftttApiKey = JSON.parse(iftttApiKeyStore).name;
		const url = `https://maker.ifttt.com/trigger/${trigger}/with/key/${iftttApiKey}`;
		postUrl(url);
	} else {
		console.log("You must configure the API key in Settings.");
	}
};

const postCustomHook = ({
	url
}) => postUrl(url);

peerSocket.onmessage = ({
	data
}) => {
	if (data) {
		switch (data.type) {
		case "ifttt":
			postIftttHook(data);
			break;
		case "custom":
			postCustomHook(data);
			break;
		case "default":
			break;
		}
	}
};

const getFullSettingsData = () => {
	const settingsKeys = [
		"ifttt",
		"custom",
		"doubleRow",
		"color",
		"makeRainbow"
	];
	return settingsKeys.reduce((accumulator, key) => ({
		...accumulator,
		[key]: settingsStorage.getItem(key)
	}), {});
};

function sendSettingData() {
	const settingsData = getFullSettingsData();
	sendData({
		settingsData
	});
}

function sendData(data) {
	(peerSocket.readyState === peerSocket.OPEN) ?
		peerSocket.send(data):
		console.log("No peerSocket connection");
}

function sendUpdate(key, value) {
	value && sendData({ key, value });
}
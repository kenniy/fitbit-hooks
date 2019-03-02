export const colors = [
	"#FF0000", //red
	"#FF7000", //orange
	"#FFFF00", //yellow
	"#00FF00", //green
	"#0000FF", //blue
	"#4B0082", //indigo
	"#9400D3" //violet
];

const colorSet = colors.map((color) => ({ color }));

const renderTextInput = ({ settingsKey, label, placeholder }) => (
	<TextInput
		settingsKey={settingsKey}
		label={label}
		placeholder={placeholder}
	/>
);

const renderTextImageRow = ({ label, sublabel }) => (
	<TextImageRow
		label={label}
		sublabel={sublabel}
	/>
);

const renderIftttAddAction = () => (
	renderTextInput({
		label:"Add IFTTT event",
		placeholder: "study:toggle_study_light"
	})
);

const renderCustomAddAction = () => (
	renderTextInput({
		label: "Add custom webhook",
		placeholder: "study:https://custom.com/event_id/api_key"
	})
);

const renderHookRow = (entry) => {
	const labels = {};
	if (!entry || !entry.trim(" ")) return;
	const [label, ...rest] = entry.split(":");
	labels.label = label;
	labels.sublabel = rest.join(":");
	return (renderTextImageRow(labels) );
};

const onMakeRainBowChange = (props) => {
	const { settingsStorage } = props;
	//gets the current value (before the toggle change)
	settingsStorage.getItem("makeRainbow") === "true" ?
		settingsStorage.setItem("color", colorSet[1].color) :
		settingsStorage.setItem("color", "");
};

const resetDefaults = (props) => {
	const { settingsStorage } = props;
	settingsStorage.clear();
	settingsStorage.setItem("color", colorSet[1].color);
	settingsStorage.setItem("reset", "true");
};

export default {
	colorSet,
	renderTextInput,
	renderIftttAddAction,
	renderCustomAddAction,
	renderHookRow,
	onMakeRainBowChange,
	resetDefaults
};
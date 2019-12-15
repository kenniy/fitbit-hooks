import helper from "./helper";

function mySettings(props) {
	return (
		<Page>
			<Section
				title={<Text>API key</Text>}
			>
				<TextInput
					settingsKey="iftttApiKey"
					label="ifttt api key"
					placeholder="boHIDNR4PJDSsd3KdrsLDF"
				/>
			</Section>

			<Section
				title={<Text>IFTTT events</Text>}
				description={<Text italic>make sure the event is already created in ifttt. a colon (:) separates the button name from the ifttt event and is mandatory i.e. button name:ifttt_event</Text>}
			>
				<AdditiveList
					settingsKey="ifttt"
					renderItem={({ name }) => helper.renderHookRow(name)}
					addAction={helper.renderIftttAddAction()}
				/>
			</Section>

			<Section
				title={<Text>Custom webhooks</Text>}
				description={<Text italic> add a full webhook url with any require authentication. colon (:) separates the button name from the webhook url and is mandatory i.e. button name:webhook url</Text>}
			>
				<AdditiveList
					settingsKey="custom"
					renderItem={({ name }) => helper.renderHookRow(name)}
					addAction={helper.renderCustomAddAction()}
				/>
			</Section>

			<Section title={<Text>Buttons config</Text>}>
				<ColorSelect
					settingsKey="color"
					colors={helper.colorSet}
					onSelection={() => props.settingsStorage.setItem("makeRainbow", "false")}
				/>
				<Toggle
					settingsKey="makeRainbow"
					label="Make a rainbow!"
					onChange={() => helper.onMakeRainBowChange(props)}
				/>
				<Toggle
					settingsKey="doubleRow"
					label="Show 2 buttons per row?"
				/>
			</Section>

			<Section
				title={<Text>Sync</Text>}
				description={<Text italic>useful if settings was changed while device app isn't running</Text>}
			>
				<Button
					label="Sync setting to device"
					onClick={() => props.settingsStorage.setItem("resync", "true")}
				/>
			</Section>

			<Section
				title={<Text>Reset</Text>}
				description={<Text italic>wIll clear all configured settings and revert to default</Text>}
			>
				<Button
					label="Reset to default"
					onClick={() => helper.resetDefaults(props)}
				/>
			</Section>
		</Page>
	);
}

registerSettingsPage(mySettings);
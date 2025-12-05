import { inserterTypes, inserterTypesHuman } from "../../constants/constants"
import type { iInserterTypes, iSectionsProps } from "../../constants/interfaces"
import TOOLTIPS from "../../constants/tooltips"
import { CLASSES } from "../../css/classes"

export default function InserterSettings(props: iSectionsProps): JSX.Element {
	// All inserter types
	const inserterSelect = (
		<select
			id={"inserterType"}
			className={CLASSES.selectElement}
			value={props.userSettings.inserterType}
			onChange={(e) => {
				props.setUserSettings({
					...props.userSettings,
					inserterType: e.target.value as iInserterTypes,
				})
			}}
		>
			{inserterTypes.map((inserterType) => {
				return (
					<option className={CLASSES.optionElement} key={inserterType} value={inserterType}>
						{inserterTypesHuman[inserterType]}
					</option>
				)
			})}
		</select>
	)

	const setValueAtIndex = (oldArray: string[], newValue: string, index: number) => {
		props.setUserSettings({
			...props.userSettings,
			// Replace the value at the fieldIndex using spread operator
			filterFields: [
				...props.userSettings.filterFields.slice(0, index),
				newValue,
				...props.userSettings.filterFields.slice(index + 1),
			],
		})
	}

	const isFilterInserter = props.userSettings.enableFilterInserters

	const newFilterInputField = (index: number) => {
		return (
			<input
				key={`${index}`}
				className={CLASSES.inputTextElement}
				hidden={!isFilterInserter}
				list={"itemlist"}
				value={props.userSettings.filterFields[index]}
				placeholder={index === 0 ? "Filter 1 - e.g. 'iron-ore'" : `Filter ${index + 1} item type`}
				onChange={(e) => {
					setValueAtIndex(props.userSettings.filterFields, e.target.value, index)
				}}
			/>
		)
	}

	// let filterInserterInputFields = []
	let previousIsEmpty = -1
	const filterInserterInputFields = new Array(5).fill(0).map((_, index) => {
		if (previousIsEmpty !== -1 && previousIsEmpty < index) {
			return undefined
		}
		if (props.userSettings.filterFields[index] === "") {
			previousIsEmpty = index
		}
		return newFilterInputField(index)
	})

	return (
		<div className={CLASSES.section}>
			<div className={CLASSES.gridSection}>
				{inserterSelect}
				<label className={CLASSES.labelElement} htmlFor={"inserterType"}>
					Inserter Type
				</label>
				<input
					className={CLASSES.checkboxElement}
					id={"filterInserterEnabled"}
					type={"checkbox"}
					data-tooltip-id="my-tooltip"
					data-tooltip-content={TOOLTIPS.enableFilterInserters}
					checked={props.userSettings.enableFilterInserters}
					onChange={(e) => {
						props.setUserSettings({
							...props.userSettings,
							enableFilterInserters: e.target.checked,
						})
					}}
				/>
				<label className={CLASSES.labelElement} htmlFor={"filterInserterEnabled"}>
					Enabled Filter Inserters
				</label>
				{filterInserterInputFields}
			</div>
		</div>
	)
}

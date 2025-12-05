import { enabledConditionOperators, enabledConditionOperatorsHuman } from "../../constants/constants"
import type { iEnabledConditionOperators, iSectionsProps } from "../../constants/interfaces"
import TOOLTIPS from "../../constants/tooltips"
import { CLASSES } from "../../css/classes"

export default function EnabledConditionSettings(props: iSectionsProps): JSX.Element {
	const hideIfCheckboxDisabled = !props.userSettings.trainStopUsesEnabledCondition

	const enabledConditionOperatorHtml = (
		<select
			className={CLASSES.selectElement}
			hidden={hideIfCheckboxDisabled}
			value={props.userSettings.enabledConditionOperator}
			onChange={(e) => {
				props.setUserSettings({
					...props.userSettings,
					enabledConditionOperator: e.target.value as iEnabledConditionOperators,
				})
			}}
		>
			{enabledConditionOperators.map((operator) => {
				return (
					<option className={CLASSES.optionElement} key={operator} value={operator}>
						{enabledConditionOperatorsHuman[operator]}
					</option>
				)
			})}
		</select>
	)

	return (
		<div className={CLASSES.section}>
			<div className={CLASSES.gridSection}>
				<input
					className={CLASSES.checkboxElement}
					type={"checkbox"}
					id={"trainStopUsesEnabledCondition"}
					checked={props.userSettings.trainStopUsesEnabledCondition}
					data-tooltip-id="my-tooltip"
					data-tooltip-content={TOOLTIPS.trainStopUsesEnabledCondition}
					onChange={(e) => {
						props.setUserSettings({
							...props.userSettings,
							trainStopUsesEnabledCondition: e.target.checked,
						})
					}}
				/>
				<label className={CLASSES.labelElement} htmlFor={"trainStopUsesEnabledCondition"}>
					{"Train stop uses 'enabled-condition'?"}
				</label>
				{enabledConditionOperatorHtml}
				<input
					type={"number"}
					className={CLASSES.selectElement}
					hidden={hideIfCheckboxDisabled}
					placeholder={"Amount of items"}
					value={props.userSettings.enabledConditionAmount}
					onChange={(e) => {
						props.setUserSettings({
							...props.userSettings,
							enabledConditionAmount: e.target.value,
						})
					}}
				/>
			</div>
		</div>
	)
}

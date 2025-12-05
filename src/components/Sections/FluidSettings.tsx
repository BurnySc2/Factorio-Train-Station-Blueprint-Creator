import { pumpSides } from "../../constants/constants"
import type { iPumpSides, iSectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"

export default function FluidSettings(props: iSectionsProps): JSX.Element {
	const pumpSideHtml = (
		<select
			id={"sidesUsed"}
			className={CLASSES.selectElement}
			value={props.userSettings.pumpSidesToBeUsed}
			onChange={(e) => {
				props.setUserSettings({
					...props.userSettings,
					pumpSidesToBeUsed: e.target.value as iPumpSides,
				})
			}}
		>
			{pumpSides.map((pumpSide) => {
				return (
					<option className={CLASSES.optionElement} key={pumpSide} value={pumpSide}>
						{pumpSide}
					</option>
				)
			})}
		</select>
	)

	return (
		<div className={CLASSES.section}>
			<div className={CLASSES.gridSection}>
				{pumpSideHtml}
				<label className={CLASSES.labelElement} htmlFor={"sidesUsed"}>
					Sides to be used
				</label>
				<input
					className={CLASSES.inputTextElement}
					type={"number"}
					min={"1"}
					id={"storageTanksColumn"}
					value={props.userSettings.pumpStorageTankColumns}
					onChange={(e) => {
						props.setUserSettings({
							...props.userSettings,
							pumpStorageTankColumns: e.target.value,
						})
					}}
				/>
				<label className={CLASSES.labelElement} htmlFor={"storageTanksColumn"}>
					Amount of storage tank columns
				</label>
				<input
					className={CLASSES.checkboxElement}
					type={"checkbox"}
					id={"connectTanks"}
					checked={props.userSettings.pumpConnectWithPipe}
					onChange={(e) => {
						props.setUserSettings({
							...props.userSettings,
							pumpConnectWithPipe: e.target.checked,
						})
					}}
				/>
				<label className={CLASSES.labelElement} htmlFor={"connectTanks"}>
					Connect tanks with pipe?
				</label>
			</div>
		</div>
	)
}

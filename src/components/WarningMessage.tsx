import type { defaultSettings } from "../constants/constants"
import { CLASSES } from "../css/classes"

interface MyProps {
	warningMessage: string
	userSettings: typeof defaultSettings
}
export default function WarningMessage(props: MyProps): JSX.Element | null {
	if (props.warningMessage === "") {
		return null
	}
	return <div className={CLASSES.warningMessageElement}>Hint: {props.warningMessage}</div>
}

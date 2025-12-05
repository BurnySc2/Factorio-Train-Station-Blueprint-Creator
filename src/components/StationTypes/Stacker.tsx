import type { iSectionsProps } from "../../constants/interfaces"
import StackerSettings from "../Sections/StackerSettings"
import TrainTypeSettings from "../Sections/TrainTypeSettings"

export default function Stacker(props: iSectionsProps): JSX.Element {
	return (
		<div className={"flex flex-col"}>
			<TrainTypeSettings userSettings={props.userSettings} setUserSettings={props.setUserSettings} />
			<StackerSettings userSettings={props.userSettings} setUserSettings={props.setUserSettings} />
		</div>
	)
}

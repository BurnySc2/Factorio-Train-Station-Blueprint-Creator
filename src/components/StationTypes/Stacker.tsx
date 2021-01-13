import React from "react"
import TrainTypeSettings from "../Sections/TrainTypeSettings"
import { iSectionsProps } from "../../constants/interfaces"
import StackerSettings from "../Sections/StackerSettings"

export default function Stacker(props: iSectionsProps) {
    return (
        <div className={"flex flex-col"}>
            <TrainTypeSettings
                userSettings={props.userSettings}
                setUserSettings={props.setUserSettings}
            />
            <StackerSettings
                userSettings={props.userSettings}
                setUserSettings={props.setUserSettings}
            />
        </div>
    )
}

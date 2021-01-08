import React from "react"
import TrainTypeSettings from "../Sections/TrainTypeSettings"
import { SectionsProps } from "../../constants/interfaces"
import SequentialStation from "../SequentialStation/SequentialStation"
import StackerSettings from "../Sections/StackerSettings"

export default function Stacker(props: SectionsProps) {
    return (
        <div className={"flex flex-col"}>
            <SequentialStation
                userSettings={props.userSettings}
                setUserSettings={props.setUserSettings}
            />
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

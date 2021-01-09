import React from "react"
import TrainTypeSettings from "../Sections/TrainTypeSettings"
import { iSectionsProps } from "../../constants/interfaces"
import SequentialStation from "../SequentialStation/SequentialStation"
import RefillSettings from "../Sections/RefillSettings"
import WireSettings from "../Sections/WireSettings"
import EnabledConditionSettings from "../Sections/EnabledConditionSettings"
import LampsSettings from "../Sections/LampsSettings"
import StationNameSettings from "../Sections/StationNameSettings"

export default function FluidStation(props: iSectionsProps) {
    return (
        <div className={"flex flex-col"}>
            <StationNameSettings
                userSettings={props.userSettings}
                setUserSettings={props.setUserSettings}
            />
            <SequentialStation
                userSettings={props.userSettings}
                setUserSettings={props.setUserSettings}
            />
            <TrainTypeSettings
                userSettings={props.userSettings}
                setUserSettings={props.setUserSettings}
            />
            <RefillSettings
                userSettings={props.userSettings}
                setUserSettings={props.setUserSettings}
            />
            <WireSettings
                userSettings={props.userSettings}
                setUserSettings={props.setUserSettings}
            />
            <EnabledConditionSettings
                userSettings={props.userSettings}
                setUserSettings={props.setUserSettings}
            />
            <LampsSettings
                userSettings={props.userSettings}
                setUserSettings={props.setUserSettings}
            />
        </div>
    )
}

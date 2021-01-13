import React from "react"
import TrainTypeSettings from "../Sections/TrainTypeSettings"
import { iSectionsProps } from "../../constants/interfaces"
import RefillSettings from "../Sections/RefillSettings"
import WireSettings from "../Sections/WireSettings"
import EnabledConditionSettings from "../Sections/EnabledConditionSettings"
import LampsSettings from "../Sections/LampsSettings"
import StationNameSettings from "../Sections/StationNameSettings"
import FluidSettings from "../Sections/FluidSettings"

export default function FluidStation(props: iSectionsProps) {
    return (
        <div className={"flex flex-col"}>
            <div className={"grid gap-x-4 grid-cols-1 lg:grid-cols-2"}>
                <div>
                    <StationNameSettings
                        userSettings={props.userSettings}
                        setUserSettings={props.setUserSettings}
                    />
                    <TrainTypeSettings
                        userSettings={props.userSettings}
                        setUserSettings={props.setUserSettings}
                    />
                    <FluidSettings
                        userSettings={props.userSettings}
                        setUserSettings={props.setUserSettings}
                    />
                    <RefillSettings
                        userSettings={props.userSettings}
                        setUserSettings={props.setUserSettings}
                    />
                </div>
                <div>
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
            </div>
        </div>
    )
}

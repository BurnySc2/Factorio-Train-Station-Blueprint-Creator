import React from "react"
import TrainTypeSettings from "../Sections/TrainTypeSettings"
import { iSectionsProps } from "../../constants/interfaces"
import InserterSettings from "../Sections/InserterSettings"
import ChestTypeSettings from "../Sections/ChestTypeSettings"
import BeltTypeSettings from "../Sections/BeltTypeSettings"
import RefillSettings from "../Sections/RefillSettings"
import WireSettings from "../Sections/WireSettings"
import EnabledConditionSettings from "../Sections/EnabledConditionSettings"
import LampsSettings from "../Sections/LampsSettings"
import StationNameSettings from "../Sections/StationNameSettings"
import StationSettings from "../Sections/StationSettings"

export default function NormalStation(props: iSectionsProps): JSX.Element {
    return (
        <div className={"flex flex-col"}>
            <div className={"grid gap-x-4 grid-cols-1 lg:grid-cols-2"}>
                <div>
                    <StationNameSettings
                        userSettings={props.userSettings}
                        setUserSettings={props.setUserSettings}
                    />
                    <StationSettings
                        userSettings={props.userSettings}
                        setUserSettings={props.setUserSettings}
                    />
                    <TrainTypeSettings
                        userSettings={props.userSettings}
                        setUserSettings={props.setUserSettings}
                    />
                    <BeltTypeSettings
                        userSettings={props.userSettings}
                        setUserSettings={props.setUserSettings}
                    />
                </div>
                <div>
                    <InserterSettings
                        userSettings={props.userSettings}
                        setUserSettings={props.setUserSettings}
                    />
                    <ChestTypeSettings
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
            </div>
        </div>
    )
}

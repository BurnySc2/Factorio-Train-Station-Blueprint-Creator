import React from "react"
import { iSectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"

export default function StationNameSettings(props: iSectionsProps) {
    return (
        <div>
            <div className={CLASSES.section}>
                <input
                    className={CLASSES.inputTextElement}
                    type={"text"}
                    placeholder={"Station Name"}
                    value={props.userSettings.stationName}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            stationName: e.target.value,
                        })
                    }}
                />
                <input
                    className={CLASSES.inputTextElement}
                    type={"number"}
                    placeholder={"Train limit"}
                    value={props.userSettings.trainLimit}
                    min={"-1"}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            trainLimit: e.target.value,
                        })
                    }}
                />
            </div>
        </div>
    )
}

import React from "react"
import { SectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"

export default function StationNameSettings(props: SectionsProps) {
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
            </div>
        </div>
    )
}

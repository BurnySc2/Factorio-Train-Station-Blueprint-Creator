import React from "react"
import { iSectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"

export default function LampsSettings(props: iSectionsProps) {
    return (
        <div className={CLASSES.section}>
            <div className={CLASSES.gridSection}>
                <input
                    className={CLASSES.checkboxElement}
                    type={"checkbox"}
                    id={"placeLampsNearPoles"}
                    checked={props.userSettings.placeLampsNearPoles}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            placeLampsNearPoles: e.target.checked,
                        })
                    }}
                />
                <label className={CLASSES.labelElement} htmlFor={"placeLampsNearPoles"}>
                    Place lamps near poles?
                </label>
            </div>
        </div>
    )
}

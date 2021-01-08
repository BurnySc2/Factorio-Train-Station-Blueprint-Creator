import React from "react"
import { SectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"

export default function LampsSettings(props: SectionsProps) {
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
                <label htmlFor={"placeLampsNearPoles"}>Place lamps near poles?</label>
            </div>
        </div>
    )
}

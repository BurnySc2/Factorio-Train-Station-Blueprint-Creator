import React from "react"
import { iSectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"

export default function WireSettings(props: iSectionsProps) {
    let myCheckbox = (
        keyName:
            | "connectChestsWithGreenWire"
            | "connectBothSideWithGreenWire"
            | "connectChestsWithRedWire"
            | "connectBothSideWithRedWire"
    ) => {
        return (
            <input
                className={CLASSES.checkboxElement}
                key={keyName}
                type={"checkbox"}
                id={keyName}
                checked={props.userSettings[keyName]}
                onChange={(e) => {
                    props.setUserSettings({
                        ...props.userSettings,
                        [keyName]: e.target.checked,
                    })
                }}
            />
        )
    }

    return (
        <div className={CLASSES.section}>
            <div className={CLASSES.gridSection}>
                {myCheckbox("connectChestsWithGreenWire")}
                <label className={CLASSES.labelElement} htmlFor={"connectChestsWithGreenWire"}>
                    Connect chests with green wire?
                </label>
                {myCheckbox("connectBothSideWithGreenWire")}
                <label className={CLASSES.labelElement} htmlFor={"connectBothSideWithGreenWire"}>
                    Connect left and right side with green wire?
                </label>
                {myCheckbox("connectChestsWithRedWire")}
                <label className={CLASSES.labelElement} htmlFor={"connectChestsWithRedWire"}>
                    Connect chests with red wire?
                </label>
                {myCheckbox("connectBothSideWithRedWire")}
                <label className={CLASSES.labelElement} htmlFor={"connectBothSideWithRedWire"}>
                    Connect left and right side with red wire?
                </label>
            </div>
        </div>
    )
}

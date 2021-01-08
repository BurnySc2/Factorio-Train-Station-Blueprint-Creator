import React from "react"
import { SectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"

export default function WireSettings(props: SectionsProps) {
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
                        [keyName]: e.target.value,
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
                    Connect left and right side?
                </label>
                {myCheckbox("connectChestsWithRedWire")}
                <label className={CLASSES.labelElement} htmlFor={"connectChestsWithRedWire"}>
                    Connecet chests with red wire?
                </label>
                {myCheckbox("connectBothSideWithRedWire")}
                <label className={CLASSES.labelElement} htmlFor={"connectBothSideWithRedWire"}>
                    Connect left and right side?
                </label>
            </div>
        </div>
    )
}

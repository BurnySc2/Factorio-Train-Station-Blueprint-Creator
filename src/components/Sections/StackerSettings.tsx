import React from "react"
import { SectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"

export default function StackerSettings(props: SectionsProps) {
    let myCheckbox = (keyName: "diagonalStacker" | "leftRightStacker") => {
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
                <input
                    className={CLASSES.inputTextElement}
                    id={"stackerNumberParallelLanes"}
                    value={props.userSettings.stackerNumberParallelLanes}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            stackerNumberParallelLanes: e.target.value,
                        })
                    }}
                />
                <label className={CLASSES.labelElement} htmlFor={"stackerNumberParallelLanes"}>
                    Connect chests with green wire?
                </label>
                {myCheckbox("diagonalStacker")}
                <label className={CLASSES.labelElement} htmlFor={"diagonalStacker"}>
                    Diagonal Stacker?
                </label>
                {myCheckbox("leftRightStacker")}
                <label className={CLASSES.labelElement} htmlFor={"leftRightStacker"}>
                    Left-Right Stacker?
                </label>
            </div>
        </div>
    )
}

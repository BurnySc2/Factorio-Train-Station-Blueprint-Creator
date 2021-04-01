import React, { useEffect } from "react"
import { iSectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"
import { stackerDiagonalTypes, stackerTypes } from "../../constants/constants"
import TOOLTIPS from "../../constants/tooltips"
import ReactTooltip from "react-tooltip"

export default function StackerSettings(props: iSectionsProps): JSX.Element {
    useEffect(() => {
        // Rebuild tooltips on dynamic changes
        ReactTooltip.rebuild()
    })

    const myCheckbox = (keyName: "diagonalStacker") => {
        return (
            <input
                className={CLASSES.checkboxElement}
                key={keyName}
                type={"checkbox"}
                id={keyName}
                checked={props.userSettings[keyName]}
                data-tip={TOOLTIPS[keyName]}
                onChange={(e) => {
                    props.setUserSettings({
                        ...props.userSettings,
                        [keyName]: e.target.checked,
                    })
                }}
            />
        )
    }

    const stackerTypesHtml = (
        <select
            className={CLASSES.selectElement}
            value={props.userSettings.stackerType}
            onChange={(e) => {
                props.setUserSettings({
                    ...props.userSettings,
                    stackerType: e.target.value,
                })
            }}
        >
            {stackerTypes.map((type) => {
                if (props.userSettings.diagonalStacker) return undefined
                return (
                    <option key={type} value={type}>
                        {type}
                    </option>
                )
            })}
            {stackerDiagonalTypes.map((type) => {
                if (!props.userSettings.diagonalStacker) return undefined
                return (
                    <option key={type} value={type}>
                        {type}
                    </option>
                )
            })}
        </select>
    )

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
                    # of parallel lanes
                </label>
                {myCheckbox("diagonalStacker")}
                <label className={CLASSES.labelElement} htmlFor={"diagonalStacker"}>
                    Diagonal Stacker?
                </label>
                {stackerTypesHtml}
                <label className={CLASSES.labelElement} htmlFor={"leftRightStacker"}>
                    Stacker Type
                </label>
            </div>
        </div>
    )
}

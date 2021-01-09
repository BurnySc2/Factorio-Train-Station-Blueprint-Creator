import React from "react"
import { iSectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"
import { beltFlowDirections, beltSides, beltTypes } from "../../constants/constants"

export default function BeltTypeSettings(props: iSectionsProps) {
    let beltTypesHtml = (
        <select
            id={"beltType"}
            className={CLASSES.selectElement}
            value={props.userSettings.beltType}
            onChange={(e) => {
                props.setUserSettings({ ...props.userSettings, beltType: e.target.value })
            }}
        >
            {beltTypes.map((beltType) => {
                return (
                    <option className={CLASSES.optionElement} key={beltType} value={beltType}>
                        {beltType}
                    </option>
                )
            })}
        </select>
    )

    let beltSideHtml = (
        <select
            id={"sidesUsed"}
            className={CLASSES.selectElement}
            value={props.userSettings.beltSidesUsed}
            onChange={(e) => {
                props.setUserSettings({ ...props.userSettings, beltSidesUsed: e.target.value })
            }}
        >
            {beltSides.map((beltSide) => {
                return (
                    <option className={CLASSES.optionElement} key={beltSide} value={beltSide}>
                        {beltSide}
                    </option>
                )
            })}
        </select>
    )
    let beltFlowHtml = (
        <select
            id={"beltFlow"}
            className={CLASSES.selectElement}
            value={props.userSettings.beltFlowDirection}
            onChange={(e) => {
                props.setUserSettings({ ...props.userSettings, beltFlowDirection: e.target.value })
            }}
        >
            {beltFlowDirections.map((beltFlow) => {
                return (
                    <option className={CLASSES.optionElement} key={beltFlow} value={beltFlow}>
                        {beltFlow}
                    </option>
                )
            })}
        </select>
    )

    return (
        <div className={CLASSES.section}>
            <div className={CLASSES.gridSection}>
                <input
                    className={CLASSES.checkboxElement}
                    type={"checkbox"}
                    id={"enableBelts"}
                    checked={props.userSettings.beltsEnabled}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            beltsEnabled: e.target.checked,
                        })
                    }}
                />
                <label className={CLASSES.labelElement} htmlFor={"enableBelts"}>
                    Enable Belts
                </label>
                {beltTypesHtml}
                <label className={CLASSES.labelElement} htmlFor={"beltType"}>
                    Belt Type
                </label>
                {beltSideHtml}
                <label className={CLASSES.labelElement} htmlFor={"sidesUsed"}>
                    Sides to be used
                </label>
                {beltFlowHtml}
                <label className={CLASSES.labelElement} htmlFor={"beltFlow"}>
                    Belt Flow
                </label>
            </div>
        </div>
    )
}

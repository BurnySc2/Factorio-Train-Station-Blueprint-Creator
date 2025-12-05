import React from "react"
import { iBeltSides, iBeltTypes, iSectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"
import {
    beltFlowDirections,
    beltSides,
    beltTypes,
    beltTypesHuman,
    botChestTypes,
} from "../../constants/constants"
import TOOLTIPS from "../../constants/tooltips"

export default function BeltTypeSettings(props: iSectionsProps): JSX.Element {
    const hideIfBotChests = botChestTypes.includes(props.userSettings.chestType)

    const beltTypesHtml = (
        <select
            id={"beltType"}
            className={CLASSES.selectElement}
            value={props.userSettings.beltType}
            onChange={(e) => {
                props.setUserSettings({
                    ...props.userSettings,
                    beltType: e.target.value as iBeltTypes,
                })
            }}
        >
            {beltTypes.map((beltType) => {
                return (
                    <option className={CLASSES.optionElement} key={beltType} value={beltType}>
                        {beltTypesHuman[beltType]}
                    </option>
                )
            })}
        </select>
    )

    const beltSideHtml = (
        <select
            id={"sidesUsed"}
            className={CLASSES.selectElement}
            value={props.userSettings.beltSidesUsed}
            onChange={(e) => {
                props.setUserSettings({
                    ...props.userSettings,
                    beltSidesUsed: e.target.value as iBeltSides,
                })
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
    const beltFlowHtml = (
        <select
            id={"beltFlow"}
            className={CLASSES.selectElement}
            value={props.userSettings.beltFlowDirection}
            data-tooltip-id="my-tooltip"
            data-tooltip-content={TOOLTIPS.beltFlow}
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
        <div className={CLASSES.section} hidden={hideIfBotChests}>
            <div className={CLASSES.gridSection}>
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

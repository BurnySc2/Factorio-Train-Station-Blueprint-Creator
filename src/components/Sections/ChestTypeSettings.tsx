import React, { useState } from "react"
import { iSectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"
import { chestTypes } from "../../constants/constants"

export default function ChestTypeSettings(props: iSectionsProps) {
    let chestTypesHtml = (
        <select
            id={"chestTypes"}
            className={CLASSES.selectElement}
            value={props.userSettings.chestType}
            onChange={(e) => {
                props.setUserSettings({ ...props.userSettings, chestType: e.target.value })
            }}
        >
            {chestTypes.map((chestType) => {
                return (
                    <option className={CLASSES.optionElement} key={chestType} value={chestType}>
                        {chestType}
                    </option>
                )
            })}
        </select>
    )

    return (
        <div className={CLASSES.section}>
            <div className={CLASSES.gridSection}>
                {chestTypesHtml}
                <label className={CLASSES.labelElement} htmlFor={"chestTypes"}>
                    Chest Type
                </label>
                <input
                    className={CLASSES.inputTextElement}
                    type={"number"}
                    value={props.userSettings.chestLimit}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            chestLimit: e.target.value,
                        })
                    }}
                />
                <label className={CLASSES.labelElement} htmlFor={"chestTypes"}>
                    Chest limit
                </label>
            </div>
        </div>
    )
}

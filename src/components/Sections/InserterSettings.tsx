import React from "react"
import { inserterTypes } from "../../constants/constants"
import { iSectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"
import TOOLTIPS from "../../constants/tooltips"

export default function InserterSettings(props: iSectionsProps) {
    // All inserter types
    let inserterSelect = (
        <select
            id={"inserterType"}
            className={CLASSES.selectElement}
            value={props.userSettings.inserterType}
            onChange={(e) => {
                // @ts-ignore
                props.setUserSettings({ ...props.userSettings, inserterType: e.target.value })
            }}
        >
            {inserterTypes.map((inserterType) => {
                return (
                    <option
                        className={CLASSES.optionElement}
                        key={inserterType}
                        value={inserterType}
                    >
                        {inserterType}
                    </option>
                )
            })}
        </select>
    )

    let setValueAtIndex = (oldArray: string[], newValue: string, index: number) => {
        props.setUserSettings({
            ...props.userSettings,
            // Replace the value at the fieldIndex using spread operator
            filterFields: [
                ...props.userSettings.filterFields.slice(0, index),
                newValue,
                ...props.userSettings.filterFields.slice(index + 1),
            ],
        })
    }

    let isFilterInserter = props.userSettings.enableFilterInserters

    let newFilterInputField = (index: number) => {
        return (
            <input
                key={`${index}`}
                className={CLASSES.inputTextElement}
                hidden={!isFilterInserter}
                list={"itemlist"}
                value={props.userSettings.filterFields[index]}
                placeholder={
                    index === 0 ? "Filter 1 - e.g. 'iron-ore'" : `Filter ${index + 1} item type`
                }
                onChange={(e) => {
                    setValueAtIndex(props.userSettings.filterFields, e.target.value, index)
                }}
            />
        )
    }

    // let filterInserterInputFields = []
    let previousIsEmpty = -1
    let filterInserterInputFields = new Array(5).fill(0).map((_, index) => {
        if (previousIsEmpty !== -1 && previousIsEmpty < index) {
            return undefined
        }
        if (props.userSettings.filterFields[index] === "") {
            previousIsEmpty = index
        }
        return newFilterInputField(index)
    })

    return (
        <div className={CLASSES.section}>
            <div className={CLASSES.gridSection}>
                {inserterSelect}
                <label className={CLASSES.labelElement} htmlFor={"inserterType"}>
                    Inserter Type
                </label>
                <input
                    className={CLASSES.checkboxElement}
                    id={"filterInserterEnabled"}
                    type={"checkbox"}
                    data-tip={TOOLTIPS.enableFilterInserters}
                    checked={props.userSettings.enableFilterInserters}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            enableFilterInserters: e.target.checked,
                        })
                    }}
                />
                <label className={CLASSES.labelElement} htmlFor={"filterInserterEnabled"}>
                    Enabled Filter Inserters
                </label>
                {filterInserterInputFields}
            </div>
        </div>
    )
}

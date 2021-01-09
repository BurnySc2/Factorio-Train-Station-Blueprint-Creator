import React from "react"
import { inserterTypes } from "../../constants/constants"
import { iSectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"

export default function InserterSettings(props: iSectionsProps) {
    // All inserter types
    let inserterSelect = (
        <select
            id={"inserterType"}
            className={CLASSES.selectElement}
            value={props.userSettings.inserterType}
            onChange={(e) => {
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

    let newFilterInputField = (value: string, index: number) => {
        return (
            <input
                key={`${index}`}
                className={CLASSES.inputTextElement}
                value={value}
                placeholder={index === 0 ? "Filter 1 - e.g. 'iron-ore'" : `Filter ${index + 1}`}
                onChange={(e) => {
                    setValueAtIndex(props.userSettings.filterFields, e.target.value, index)
                }}
            />
        )
    }

    let filterInserterInputFields = []
    if (props.userSettings.enableFilterInserters) {
        // Insert up to 5 filter input fields that are gonna be used in each filter-inserter
        for (let index = 0; index < 5; index++) {
            if (
                props.userSettings.filterFields[index] !== undefined &&
                props.userSettings.filterFields[index] !== ""
            ) {
                // lastFilledFieldIndex++
                let field = props.userSettings.filterFields[index]
                filterInserterInputFields.push(newFilterInputField(field, index))
            } else {
                break
            }
        }

        // Insert the last input field if it is less than 5
        if (filterInserterInputFields.length < 5) {
            filterInserterInputFields.push(
                newFilterInputField("", filterInserterInputFields.length)
            )
        }
    }

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

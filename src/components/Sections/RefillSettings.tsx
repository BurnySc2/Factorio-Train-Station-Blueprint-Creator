import React from "react"
import { iSectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"
import { refillFuelTypes } from "../../constants/constants"

export default function RefillSettings(props: iSectionsProps) {
    let fuelTypesHtml = (
        <select
            className={CLASSES.selectElement}
            value={props.userSettings.refillFuelType}
            onChange={(e) => {
                props.setUserSettings({
                    ...props.userSettings,
                    refillFuelType: e.target.value,
                })
            }}
        >
            {refillFuelTypes.map((fuelType) => {
                return (
                    <option className={CLASSES.optionElement} key={fuelType} value={fuelType}>
                        {fuelType}
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
                    id={"refillEnabled"}
                    checked={props.userSettings.refillEnabled}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            refillEnabled: e.target.checked,
                        })
                    }}
                />
                <label className={CLASSES.labelElement} htmlFor={"refillEnabled"}>
                    Refill at this Station?
                </label>
                {fuelTypesHtml}
                <label className={CLASSES.labelElement} htmlFor={"fuelTypes"}>
                    Fuel Type
                </label>
                <input
                    type={"number"}
                    className={CLASSES.inputTextElement}
                    value={props.userSettings.refillFuelAmount}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            refillFuelAmount: e.target.value,
                        })
                    }}
                />
                <label className={CLASSES.labelElement} htmlFor={"fuelAmount"}>
                    Amount
                </label>
            </div>
        </div>
    )
}

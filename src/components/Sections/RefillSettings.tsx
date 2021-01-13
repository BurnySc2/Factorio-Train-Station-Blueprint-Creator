import React from "react"
import { iRefillFuelTypes, iSectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"
import { refillFuelTypes, refillFuelTypesHuman } from "../../constants/constants"
import TOOLTIPS from "../../constants/tooltips"

export default function RefillSettings(props: iSectionsProps): JSX.Element {
    const fuelTypesHtml = (
        <select
            className={CLASSES.selectElement}
            hidden={!props.userSettings.refillEnabled}
            value={props.userSettings.refillFuelType}
            onChange={(e) => {
                props.setUserSettings({
                    ...props.userSettings,
                    refillFuelType: e.target.value as iRefillFuelTypes,
                })
            }}
        >
            {refillFuelTypes.map((fuelType) => {
                return (
                    <option className={CLASSES.optionElement} key={fuelType} value={fuelType}>
                        {refillFuelTypesHuman[fuelType]}
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
                    data-tip={TOOLTIPS.refillEnabled}
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
                <label
                    className={CLASSES.labelElement}
                    hidden={!props.userSettings.refillEnabled}
                    htmlFor={"fuelTypes"}
                >
                    Fuel Type
                </label>
                <input
                    type={"number"}
                    className={CLASSES.inputTextElement}
                    hidden={!props.userSettings.refillEnabled}
                    value={props.userSettings.refillFuelAmount}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            refillFuelAmount: e.target.value,
                        })
                    }}
                />
                <label
                    className={CLASSES.labelElement}
                    hidden={!props.userSettings.refillEnabled}
                    htmlFor={"fuelAmount"}
                >
                    Amount
                </label>
            </div>
        </div>
    )
}

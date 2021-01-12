import React from "react"
import { iSectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"
import {
    enabledConditionOperators,
    enabledConditionOperatorsHuman,
} from "../../constants/constants"

export default function EnabledConditionSettings(props: iSectionsProps) {
    let enabledConditionOperatorHtml = (
        <select
            className={CLASSES.selectElement}
            value={props.userSettings.enabledConditionOperator}
            onChange={(e) => {
                props.setUserSettings({
                    ...props.userSettings,
                    // @ts-ignore
                    enabledConditionOperator: e.target.value,
                })
            }}
        >
            {enabledConditionOperators.map((operator) => {
                return (
                    <option className={CLASSES.optionElement} key={operator} value={operator}>
                        {enabledConditionOperatorsHuman[operator]}
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
                    id={"trainStopUsesEnabledCondition"}
                    checked={props.userSettings.trainStopUsesEnabledCondition}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            trainStopUsesEnabledCondition: e.target.checked,
                        })
                    }}
                />
                <label className={CLASSES.labelElement} htmlFor={"trainStopUsesEnabledCondition"}>
                    Train stop uses 'enabled-condition'?
                </label>
                {enabledConditionOperatorHtml}
                {/*<input type={"text"} value={props.userSettings.enabledConditionOperator} onChange={} />*/}
                <input
                    type={"number"}
                    className={CLASSES.selectElement}
                    placeholder={"Amount of items"}
                    value={props.userSettings.enabledConditionAmount}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            enabledConditionAmount: e.target.value,
                        })
                    }}
                />
            </div>
        </div>
    )
}

import React from "react"
import { iSectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"
import { pumpSides } from "../../constants/constants"

export default function FluidSettings(props: iSectionsProps) {
    let pumpSideHtml = (
        <select
            id={"sidesUsed"}
            className={CLASSES.selectElement}
            value={props.userSettings.pumpSidesToBeUsed}
            onChange={(e) => {
                // @ts-ignore
                props.setUserSettings({ ...props.userSettings, pumpSidesToBeUsed: e.target.value })
            }}
        >
            {pumpSides.map((pumpSide) => {
                return (
                    <option className={CLASSES.optionElement} key={pumpSide} value={pumpSide}>
                        {pumpSide}
                    </option>
                )
            })}
        </select>
    )

    return (
        <div className={CLASSES.section}>
            <div className={CLASSES.gridSection}>
                {pumpSideHtml}
                <label className={CLASSES.labelElement} htmlFor={"sidesUsed"}>
                    Sides to be used
                </label>
                <input
                    className={CLASSES.checkboxElement}
                    type={"checkbox"}
                    id={"connectTanks"}
                    checked={props.userSettings.pumpConnectWithPipe}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            pumpConnectWithPipe: e.target.checked,
                        })
                    }}
                />
                <label className={CLASSES.labelElement} htmlFor={"connectTanks"}>
                    Connect tank with pipe?
                </label>
            </div>
        </div>
    )
}

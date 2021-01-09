import React from "react"
import { iSectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"

export default function TrainTypeSettings(props: iSectionsProps) {
    return (
        <div className={CLASSES.section}>
            <div className={CLASSES.gridSection}>
                <input
                    className={CLASSES.checkboxElement}
                    type={"checkbox"}
                    id={"doubleHeaded"}
                    checked={props.userSettings.doubleHeaded}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            doubleHeaded: e.target.checked,
                        })
                    }}
                />
                <label className={CLASSES.labelElement} htmlFor={"doubleHeaded"}>
                    Double Headed
                </label>
                <input
                    className={CLASSES.inputTextElement}
                    type={"number"}
                    id={"locomotivesPerEnd"}
                    value={props.userSettings.locomotivesPerEnd}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            locomotivesPerEnd: e.target.value,
                        })
                    }}
                />
                <label className={CLASSES.labelElement} htmlFor={"locomotivesPerEnd"}>
                    # locomotives per end
                </label>
                <input
                    className={CLASSES.inputTextElement}
                    type={"number"}
                    id={"cargoWagon"}
                    value={props.userSettings.cargoWagon}
                    onChange={(e) => {
                        props.setUserSettings({ ...props.userSettings, cargoWagon: e.target.value })
                    }}
                />
                <label className={CLASSES.labelElement} htmlFor={"cargoWagon"}>
                    # cargo wagons
                </label>
            </div>
        </div>
    )
}

import React from "react"
import { CLASSES } from "../../css/classes"
import { iSectionsProps } from "../../constants/interfaces"

export default function SequentialStation(props: iSectionsProps) {
    return (
        <div className={CLASSES.section}>
            <div className={CLASSES.gridSection}>
                <input
                    className={CLASSES.checkboxElement}
                    type={"checkbox"}
                    id={"sequentialStation"}
                    checked={props.userSettings.sequentialStation}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            sequentialStation: e.target.checked,
                        })
                    }}
                />
                {/*TODO Add tooltips explaining the option*/}
                <label className={CLASSES.labelElement} htmlFor={"sequentialStation"}>
                    Sequential Station?
                </label>
                <input
                    className={CLASSES.inputTextElement}
                    type={"number"}
                    id={"sequentialStationsAmount"}
                    value={props.userSettings.sequentialStationsAmount}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            sequentialStationsAmount: e.target.value,
                        })
                    }}
                />
                <label className={CLASSES.labelElement} htmlFor={"sequentialStationsAmount"}>
                    # sequential stations in a row
                </label>
                <input
                    className={CLASSES.checkboxElement}
                    type={"checkbox"}
                    id={"sequantialStationBeltsGoAllTheWay"}
                    checked={props.userSettings.sequantialStationBeltsGoAllTheWay}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            sequantialStationBeltsGoAllTheWay: e.target.checked,
                        })
                    }}
                />
                <label
                    className={CLASSES.labelElement}
                    htmlFor={"sequantialStationBeltsGoAllTheWay"}
                >
                    Belts go all the way
                </label>
            </div>
        </div>
    )
}

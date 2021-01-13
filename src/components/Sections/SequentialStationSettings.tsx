import React from "react"
import { CLASSES } from "../../css/classes"
import { iSectionsProps } from "../../constants/interfaces"
import TOOLTIPS from "../../constants/tooltips"

export default function SequentialStationSettings(props: iSectionsProps) {
    return (
        <div className={CLASSES.section}>
            <div className={CLASSES.gridSection}>
                <input
                    className={CLASSES.checkboxElement}
                    type={"checkbox"}
                    id={"sequentialStation"}
                    data-tip={TOOLTIPS.sequentialStation}
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
                    hidden={!props.userSettings.sequentialStation}
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
                <label
                    className={CLASSES.labelElement}
                    hidden={!props.userSettings.sequentialStation}
                    htmlFor={"sequentialStationsAmount"}
                >
                    # sequential stations in a row
                </label>
                <input
                    className={CLASSES.checkboxElement}
                    hidden={!props.userSettings.sequentialStation}
                    type={"checkbox"}
                    id={"sequantialStationBeltsGoAllTheWay"}
                    data-tip={TOOLTIPS.sequantialStationBeltsGoAllTheWay}
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
                    hidden={!props.userSettings.sequentialStation}
                    htmlFor={"sequantialStationBeltsGoAllTheWay"}
                >
                    Belts go all the way
                </label>
            </div>
        </div>
    )
}

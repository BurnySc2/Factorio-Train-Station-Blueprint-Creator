import React from "react"
import { iSectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"
import TOOLTIPS from "../../constants/tooltips"

export default function TrainTypeSettings(props: iSectionsProps) {
    let hideIfDiagonalStacker =
        props.userSettings.stationType === "Stacker" && props.userSettings.diagonalStacker
    return (
        <div className={CLASSES.section}>
            <div className={CLASSES.gridSection}>
                <input
                    className={CLASSES.checkboxElement}
                    type={"checkbox"}
                    min={"0"}
                    id={"doubleHeaded"}
                    data-tip={TOOLTIPS.doubleHeaded}
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
                    min={"0"}
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
                <input
                    className={CLASSES.checkboxElement}
                    hidden={hideIfDiagonalStacker}
                    type={"checkbox"}
                    id={"includeTrainInBlueprint"}
                    data-tip={TOOLTIPS.includeTrainInBlueprint}
                    checked={props.userSettings.includeTrainInBlueprint}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            includeTrainInBlueprint: e.target.checked,
                        })
                    }}
                />
                <label
                    className={CLASSES.labelElement}
                    hidden={hideIfDiagonalStacker}
                    htmlFor={"includeTrainInBlueprint"}
                >
                    Include Train in Blueprint
                </label>
            </div>
        </div>
    )
}

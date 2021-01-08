import React from "react"
import { CLASSES } from "../../css/classes"
import { SectionsProps } from "../../constants/interfaces"

export default function SequentialStation(props: SectionsProps) {
    return (
        <div className={CLASSES.section}>
            <div className={CLASSES.gridSection}>
                <input
                    className={CLASSES.checkboxElement}
                    type={"checkbox"}
                    id={"sequentialStation"}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            sequentialStation: true,
                        })
                    }}
                />
                {/*TODO Add tooltips explaining the option*/}
                <label className={CLASSES.labelElement} htmlFor={"sequentialStation"}>
                    Sequential Station?
                </label>
            </div>
        </div>
    )
}

import React from "react"
import { iSectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"
import TOOLTIPS from "../../constants/tooltips"

export default function WireSettings(props: iSectionsProps): JSX.Element {
    const normalTypes = ["Loading Station", "Unloading Station"]
    const fluidTypes = ["Fluid Loading Station", "Fluid Unloading Station"]
    const hiddenWhenNormalStation = normalTypes.includes(props.userSettings.stationType)
    const hiddenWhenFluidStation = fluidTypes.includes(props.userSettings.stationType)
    const hiddenWhenNotBothSides = props.userSettings.beltSidesUsed !== "Both"

    const myCheckbox = (
        keyName:
            | "connectChestsWithGreenWire"
            | "connectBothSideWithGreenWire"
            | "connectChestsWithRedWire"
            | "connectBothSideWithRedWire",
        hidden = false
    ) => {
        return (
            <input
                className={CLASSES.checkboxElement}
                hidden={hidden}
                key={keyName}
                type={"checkbox"}
                id={keyName}
                checked={props.userSettings[keyName]}
                data-tip={TOOLTIPS[keyName]}
                onChange={(e) => {
                    props.setUserSettings({
                        ...props.userSettings,
                        [keyName]: e.target.checked,
                    })
                }}
            />
        )
    }

    return (
        <div className={CLASSES.section}>
            <div className={CLASSES.gridSection}>
                {myCheckbox("connectChestsWithGreenWire")}
                <label
                    className={CLASSES.labelElement}
                    hidden={hiddenWhenFluidStation}
                    htmlFor={"connectChestsWithGreenWire"}
                >
                    Connect chests with green wire?
                </label>
                <label
                    className={CLASSES.labelElement}
                    hidden={hiddenWhenNormalStation}
                    htmlFor={"connectChestsWithGreenWire"}
                >
                    Connect storage tanks with green wire?
                </label>
                {myCheckbox(
                    "connectBothSideWithGreenWire",
                    hiddenWhenFluidStation || hiddenWhenNotBothSides
                )}
                <label
                    className={CLASSES.labelElement}
                    hidden={hiddenWhenFluidStation || hiddenWhenNotBothSides}
                    htmlFor={"connectBothSideWithGreenWire"}
                >
                    Connect both sides with green wire?
                </label>
                {myCheckbox("connectChestsWithRedWire")}
                <label
                    className={CLASSES.labelElement}
                    hidden={hiddenWhenFluidStation}
                    htmlFor={"connectChestsWithRedWire"}
                >
                    Connect chests with red wire?
                </label>
                <label
                    className={CLASSES.labelElement}
                    hidden={hiddenWhenNormalStation}
                    htmlFor={"connectChestsWithGreenWire"}
                >
                    Connect storage tanks with red wire?
                </label>
                {myCheckbox(
                    "connectBothSideWithRedWire",
                    hiddenWhenFluidStation || hiddenWhenNotBothSides
                )}
                <label
                    className={CLASSES.labelElement}
                    hidden={hiddenWhenFluidStation || hiddenWhenNotBothSides}
                    htmlFor={"connectBothSideWithRedWire"}
                >
                    Connect both sides with red wire?
                </label>
            </div>
        </div>
    )
}

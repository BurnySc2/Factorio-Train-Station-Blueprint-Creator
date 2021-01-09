import React, { useState } from "react"
import NormalStation from "./StationTypes/NormalStation"
import FluidStation from "./StationTypes/FluidStation"
import Title from "./Title"
import { defaultSettings, stationTypes } from "../constants/constants"
import { CLASSES } from "../css/classes"
import Footer from "./Footer"
import Stacker from "./StationTypes/Stacker"
import copy from "copy-to-clipboard"
import { createBlueprint, createBlueprintString } from "../BlueprintCreation/CreateBlueprint"
const cloneDeep = require("clone-deep")

export default function Website(props: any) {
    let [userSettings, setUserSettings] = useState(cloneDeep(defaultSettings))
    let [blueprintString, setBlueprintString] = useState("")

    let stationTypeSelect = (
        <select
            className={CLASSES.selectElement}
            value={userSettings.stationType}
            onChange={(e) => {
                setUserSettings({ ...userSettings, stationType: e.target.value })
            }}
        >
            {stationTypes.map((stationType) => {
                return (
                    <option className={CLASSES.optionElement} key={stationType} value={stationType}>
                        {stationType}
                    </option>
                )
            })}
        </select>
    )

    // Select which sub-station settings are available
    let stationTypeHtml: JSX.Element = <div>ERROR LOADING CORRECT STATION TYPE</div>
    if (["Loading Station", "Unloading Station"].includes(userSettings.stationType)) {
        stationTypeHtml = (
            <NormalStation userSettings={userSettings} setUserSettings={setUserSettings} />
        )
    } else if (
        ["Fluid Loading Station", "Fluid Unloading Station"].includes(userSettings.stationType)
    ) {
        stationTypeHtml = (
            <FluidStation userSettings={userSettings} setUserSettings={setUserSettings} />
        )
    } else if (userSettings.stationType === "Stacker") {
        stationTypeHtml = <Stacker userSettings={userSettings} setUserSettings={setUserSettings} />
    }

    return (
        <div className={CLASSES.background}>
            <div className={CLASSES.background2}>
                <Title />
                <div className={"grid grid-cols-1 justify-items-center m-auto bg-blue-800"}>
                    <div className={CLASSES.section}>{stationTypeSelect}</div>
                    {stationTypeHtml}
                    <button
                        className={CLASSES.buttonElement}
                        onClick={(e) => {
                            setBlueprintString(createBlueprintString(createBlueprint(userSettings)))
                        }}
                    >
                        Generate Blueprint
                    </button>
                    <input
                        className={CLASSES.inputTextElement}
                        placeholder={"Blueprint string will be generated here."}
                        value={blueprintString}
                        readOnly
                    />
                    <button
                        className={CLASSES.buttonElement}
                        onClick={(e) => {
                            // Copy to clipboard
                            copy(blueprintString, {
                                debug: true,
                                message: "asd",
                            })
                        }}
                    >
                        Copy to Clipboard
                    </button>
                    <Footer />
                </div>
            </div>
        </div>
    )
}

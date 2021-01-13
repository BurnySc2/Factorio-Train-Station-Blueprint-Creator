import React, { useEffect, useState } from "react"
import NormalStation from "./StationTypes/NormalStation"
import FluidStation from "./StationTypes/FluidStation"
import Title from "./Title"
import { defaultSettings, stationTypes } from "../constants/constants"
import { CLASSES } from "../css/classes"
import Footer from "./Footer"
import Stacker from "./StationTypes/Stacker"
import copy from "copy-to-clipboard"
import { createBlueprint, createBlueprintString } from "../BlueprintCreation/CreateBlueprint"
import WarningMessage from "./WarningMessage"
import ErrorMessage from "./ErrorMessage"
import { checkForHintsBlueprintSettings, validateBlueprintSettings } from "../constants/helper"
import ReactTooltip from "react-tooltip"
import itemlist from "../constants/itemlist.json"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloneDeep = require("clone-deep")

export default function Website(): JSX.Element {
    const [userSettings, setUserSettings] = useState(cloneDeep(defaultSettings))
    const [blueprintString, setBlueprintString] = useState("")
    const [warningMessage, setWarningMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        const newWarningMessage = checkForHintsBlueprintSettings(userSettings)
        setWarningMessage(newWarningMessage)
        const newErrorMessage = validateBlueprintSettings(userSettings)
        setErrorMessage(newErrorMessage)
    }, [userSettings])

    const stationTypeSelect = (
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

    // Creates the datalist item names to make it easier for autocomplete
    // Source: https://github.com/kevinta893/factorio-recipes-json recipes.json
    const itemdatalist = (
        <datalist id={"itemlist"}>
            {itemlist.map((itemInfo) => {
                return <option key={itemInfo.id} value={itemInfo.id} />
            })}
        </datalist>
    )

    return (
        <div className={CLASSES.background}>
            <div className={CLASSES.background2}>
                <Title />
                <div className={"grid grid-cols-1 justify-items-center m-auto bg-blue-800"}>
                    <div className={CLASSES.section}>{stationTypeSelect}</div>
                    {stationTypeHtml}
                    {/*Blueprint generation will not work with the current settings, give the user hints how to fix the configuration*/}
                    <ErrorMessage errorMessage={errorMessage} />
                    {/*Figure out if some combinations do not work properly and give the user hints how to fix it*/}
                    <WarningMessage warningMessage={warningMessage} userSettings={userSettings} />
                    <button
                        className={CLASSES.buttonElement}
                        onClick={() => {
                            if (errorMessage === "") {
                                setBlueprintString(
                                    createBlueprintString(createBlueprint(userSettings))
                                )
                            }
                        }}
                    >
                        Generate Blueprint
                    </button>
                    <input
                        className={`${CLASSES.inputTextElement} my-1`}
                        hidden={blueprintString.length === 0}
                        value={`Blueprint length: ${blueprintString.length}`}
                        readOnly
                    />
                    <input
                        className={`${CLASSES.inputTextElement} my-1`}
                        placeholder={"Blueprint string will be generated here."}
                        value={blueprintString}
                        readOnly
                    />
                    <button
                        className={CLASSES.buttonElement}
                        onClick={() => {
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
                    <ReactTooltip place={"bottom"} multiline />
                    {itemdatalist}
                </div>
            </div>
        </div>
    )
}

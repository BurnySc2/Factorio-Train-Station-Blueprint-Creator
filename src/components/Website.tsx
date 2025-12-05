import React, { useEffect, useState, useMemo } from "react"
import NormalStation from "./StationTypes/NormalStation"
import FluidStation from "./StationTypes/FluidStation"
import Title from "./Title"
import {
    defaultSettings,
    normalStation,
    stationTypes,
    fluidStation,
    websiteUrl,
} from "../constants/constants"
import { CLASSES } from "../css/classes"
import Footer from "./Footer"
import Stacker from "./StationTypes/Stacker"
import copy from "copy-to-clipboard"
import { createBlueprint, createBlueprintString } from "../BlueprintCreation/CreateBlueprint"
import WarningMessage from "./WarningMessage"
import ErrorMessage from "./ErrorMessage"
import {
    checkForHintsBlueprintSettings,
    decodeSettings,
    encodeSettings,
    validateBlueprintSettings,
} from "../constants/helper"
import { Tooltip } from "react-tooltip"
import itemlist from "../constants/itemlist.json"
import { useLocation, useNavigate } from "react-router-dom"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloneDeep = require("clone-deep")
// eslint-disable-next-line @typescript-eslint/no-var-requires
const isEqual = require("lodash.isequal")
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pick = require("lodash.pick")

export default function Website(): JSX.Element {
    const [userSettings, setUserSettings] = useState(cloneDeep(defaultSettings))
    const [blueprintString, setBlueprintString] = useState("")
    const [warningMessage, setWarningMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const navigate = useNavigate()
    const location = useLocation()
    const params = useMemo(() => {
        try {
            return new URLSearchParams(location.search)
        } catch (error) {
            console.error("Error parsing URL search params:", error)
            return new URLSearchParams()
        }
    }, [location.search])

    // Only run once on site load: parse params and set settings from url params, if given
    useEffect(() => {
        // Use params.get("key") to get the value
        const settingsFromUrl = params.get("settings")
        // Read url params and set settings
        if (settingsFromUrl) {
            let decodedSettings
            try {
                decodedSettings = decodeSettings(settingsFromUrl)
            } catch {
                console.log("Could not decode settings from url")
                return
            }
            const currentSettings = cloneDeep(userSettings)

            // Current settings differ from the ones in the url
            if (!isEqual(decodedSettings, currentSettings)) {
                setUserSettings({
                    ...defaultSettings,
                    ...decodedSettings,
                })
            }
        }
    }, [])

    useEffect(() => {
        const newWarningMessage = checkForHintsBlueprintSettings(userSettings)
        setWarningMessage(newWarningMessage)
        const newErrorMessage = validateBlueprintSettings(userSettings)
        setErrorMessage(newErrorMessage)
    }, [userSettings])

    const getUrlParams = (bpSettings: typeof defaultSettings) => {
        const keysToKeep = Object.keys(defaultSettings)
        const bpSettingsPick = pick(bpSettings, keysToKeep)
        const urlString = encodeSettings(bpSettingsPick)
        const params = new URLSearchParams({ settings: urlString })
        return "?" + params.toString()
    }
    const assignSettingsToUrlParams = (bpSettings: typeof defaultSettings) => {
        const newUrl = getUrlParams(bpSettings)
        // Add history entry
        navigate(newUrl, { replace: false })
        // Change current url
        navigate(newUrl, { replace: true })
    }

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
    if (normalStation.includes(userSettings.stationType)) {
        stationTypeHtml = (
            <NormalStation userSettings={userSettings} setUserSettings={setUserSettings} />
        )
    } else if (fluidStation.includes(userSettings.stationType)) {
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
                                assignSettingsToUrlParams(userSettings)
                            }
                        }}
                    >
                        Generate Blueprint
                    </button>
                    <input
                        className={`${CLASSES.blueprintStringTextElement}`}
                        hidden={blueprintString === ""}
                        value={`Blueprint length: ${blueprintString.length}`}
                        readOnly
                    />
                    <input
                        className={`${CLASSES.blueprintStringTextElement}`}
                        placeholder={"Blueprint string will be generated here."}
                        value={blueprintString}
                        readOnly
                    />
                    <button
                        className={CLASSES.buttonElement}
                        hidden={blueprintString === ""}
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
                    <button
                        className={CLASSES.buttonElement}
                        hidden={blueprintString === ""}
                        onClick={() => {
                            // Copy to website url to clipboard
                            copy(websiteUrl + getUrlParams(userSettings), {
                                debug: true,
                                message: "asd",
                            })
                        }}
                    >
                        Copy shareable link
                    </button>
                    <Footer />
                    <Tooltip id="my-tooltip" place="bottom" />
                    {itemdatalist}
                </div>
            </div>
        </div>
    )
}

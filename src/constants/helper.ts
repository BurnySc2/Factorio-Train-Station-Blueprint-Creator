import { defaultSettings } from "./constants"

const verifyNumberInput = (myInput: string) => {
    return !isNaN(parseInt(myInput))
}

export const checkForHintsBlueprintSettings = (bpSettings: typeof defaultSettings) => {
    if (parseInt(bpSettings.locomotivesPerEnd) + parseInt(bpSettings.cargoWagon) > 1000) {
        return "Your amount of locomotives and cargo wagons is extremely high and might crash your browser!"
    }
    if (
        (bpSettings.stationType === "Loading Station" ||
            bpSettings.stationType === "Unloading Station") &&
        bpSettings.sequentialStation &&
        parseInt(bpSettings.sequentialStationsAmount) > 20
    ) {
        return "Your amount of sequential stations is extremely high and might crash your browser!"
    }
    if (bpSettings.stationType !== "Stacker") {
        if (bpSettings.trainStopUsesEnabledCondition && !bpSettings.connectChestsWithGreenWire) {
            return "If 'train stop uses-enabled condition' is enabled, you should also enable 'connect chests/storage tanks with green wire'."
        }
        if (
            ["Loading Station", "Unloading Station"].includes(bpSettings.stationType) &&
            bpSettings.sequentialStation &&
            !bpSettings.trainStopUsesEnabledCondition
        ) {
            return "If 'sequential stations' is enabled, you should enable 'train stop uses enabled-condition' for full capacity."
        }
    }
    // No hint could be found
    return ""
}

export const validateBlueprintSettings = (bpSettings: typeof defaultSettings) => {
    if (!verifyNumberInput(bpSettings.locomotivesPerEnd)) {
        return "The given locomotive count is not a number."
    }
    if (!verifyNumberInput(bpSettings.cargoWagon)) {
        return "The given cargo count is not a number."
    }
    if (
        bpSettings.stationType === "Loading Station" ||
        bpSettings.stationType === "Unloading Station"
    ) {
        for (let i = 0; i < 12; i++) {
            let itemType = bpSettings.chestRequestItemsType[i]
            let numberAsString = bpSettings.chestRequestItemsAmount[i]

            if (itemType !== "" && !verifyNumberInput(numberAsString)) {
                return `Chest request at position ${i + 1} is not a number.`
            }
        }
    }
    if (bpSettings.stationType !== "Stacker") {
        if (bpSettings.trainLimit !== "" && !verifyNumberInput(bpSettings.trainLimit)) {
            return "The given 'Train limit' is not a number."
        }
        if (!verifyNumberInput(bpSettings.chestLimit)) {
            return "The given chest limit is not a number."
        }
        if (bpSettings.refillEnabled && !verifyNumberInput(bpSettings.refillFuelAmount)) {
            return "The given refill amount is not a number."
        }
        if (
            bpSettings.trainStopUsesEnabledCondition &&
            !verifyNumberInput(bpSettings.enabledConditionAmount)
        ) {
            return "The given 'enabled-condition' amount is not a number."
        }
    }
    // No error was found
    return ""
}

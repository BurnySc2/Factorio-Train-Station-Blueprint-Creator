import { defaultSettings } from "./constants"

const verifyNumberInput = (myInput: string) => {
    return !isNaN(parseInt(myInput))
}

export const checkForHintsBlueprintSettings = (bpSettings: typeof defaultSettings): string => {
    if (parseInt(bpSettings.locomotivesPerEnd) + parseInt(bpSettings.cargoWagon) > 200) {
        return "Your amount of locomotives and cargo wagons is extremely high and might crash your browser!"
    }
    if (
        (bpSettings.stationType === "Loading Station" ||
            bpSettings.stationType === "Unloading Station") &&
        bpSettings.sequentialStation &&
        parseInt(bpSettings.sequentialStationsAmount) > 20
    ) {
        return "Your amount of sequential stations is extremely high and may crash your browser!"
    }
    if (bpSettings.stationType === "Stacker") {
        if (parseInt(bpSettings.stackerNumberParallelLanes) > 100) {
            return "Your amount of parallel stacker lanes is extremely high and may crash your browser!"
        }
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

export const validateBlueprintSettings = (bpSettings: typeof defaultSettings): string => {
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
            const itemType = bpSettings.chestRequestItemsType[i]
            const numberAsString = bpSettings.chestRequestItemsAmount[i]

            if (itemType !== "" && !verifyNumberInput(numberAsString)) {
                return `Chest request at position ${i + 1} is not a number.`
            }
        }
    }
    if (bpSettings.stationType !== "Stacker") {
        if (bpSettings.sequentialStation && parseInt(bpSettings.sequentialStationsAmount) < 0) {
            return "The given sequential stations amount is invalid."
        }
        if (parseInt(bpSettings.locomotivesPerEnd) < 0) {
            return "The given locomotives amount is invalid."
        }
        if (parseInt(bpSettings.cargoWagon) < 0) {
            return "The given cargo wagon amount is invalid."
        }
        if (parseInt(bpSettings.chestLimit) < 0) {
            return "The given chest limit is invalid."
        }
        if (bpSettings.refillEnabled && parseInt(bpSettings.refillFuelAmount) < 0) {
            return "The given fuel amount is invalid."
        }
        if (bpSettings.trainLimit !== "" && !verifyNumberInput(bpSettings.trainLimit)) {
            return "The given 'Train limit' is not a number."
        }
        if (bpSettings.chestLimit != "" && !verifyNumberInput(bpSettings.chestLimit)) {
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

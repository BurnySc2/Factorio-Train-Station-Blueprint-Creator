import { allowedCharacters, defaultSettings, iOperator, normalStation } from "./constants"

const verifyNumberInput = (myInput: string) => {
    // Return true if it is a parseable number
    return !isNaN(parseInt(myInput))
}

export const checkForHintsBlueprintSettings = (bpSettings: typeof defaultSettings): string => {
    if (parseInt(bpSettings.locomotivesPerEnd) + parseInt(bpSettings.cargoWagon) > 200) {
        return "Your amount of locomotives and cargo wagons is extremely high and might crash your browser!"
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
    if (parseInt(bpSettings.locomotivesPerEnd) < 0) {
        return "The given locomotives amount is invalid."
    }
    if (parseInt(bpSettings.cargoWagon) < 0) {
        return "The given cargo wagon amount is invalid."
    }
    if (bpSettings.stationType === "Stacker") {
        if (parseInt(bpSettings.stackerNumberParallelLanes) < 0) {
            return "Invalid number of parallel stacker lanes."
        }
    }
    if (normalStation.includes(bpSettings.stationType) && bpSettings.trainLimit === "Dynamic") {
        if (
            !verifyNumberInput(bpSettings.trainLimitArithmetic1Constant1) &&
            !allowedCharacters.includes(bpSettings.trainLimitArithmetic1Constant1) &&
            bpSettings.trainLimitArithmetic1Constant1 !== "each"
        ) {
            return "First input in the first arithmetic combinator is invalid."
        }
        if (
            !verifyNumberInput(bpSettings.trainLimitArithmetic1Constant2) &&
            !allowedCharacters.includes(bpSettings.trainLimitArithmetic1Constant2) &&
            bpSettings.trainLimitArithmetic1Constant2 !== "each"
        ) {
            return "Last input in the first arithmetic combinator is invalid."
        }
        if (
            !verifyNumberInput(bpSettings.trainLimitArithmetic2Constant1) &&
            !allowedCharacters.includes(bpSettings.trainLimitArithmetic2Constant1) &&
            bpSettings.trainLimitArithmetic2Constant1 !== "each"
        ) {
            return "First input in the second arithmetic combinator is invalid."
        }
        if (
            !verifyNumberInput(bpSettings.trainLimitArithmetic2Constant2) &&
            !allowedCharacters.includes(bpSettings.trainLimitArithmetic2Constant2) &&
            bpSettings.trainLimitArithmetic2Constant2 !== "each"
        ) {
            return "Last input in the second arithmetic combinator is invalid."
        }
    }
    if (bpSettings.stationType !== "Stacker") {
        if (parseInt(bpSettings.chestLimit) < 0) {
            return "The given chest limit is invalid."
        }
        if (bpSettings.refillEnabled && parseInt(bpSettings.refillFuelAmount) < 0) {
            return "The given fuel amount is invalid."
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

export const calcCombinatorSettings = (
    bpSettings: typeof defaultSettings,
    stackSize = 50
): [string, iOperator, string, string, iOperator, string] => {
    const cargoCount = parseInt(bpSettings.cargoWagon)

    // Calculate how many items the green-wire connected chests can contain
    const chestLimit = parseInt(bpSettings.chestLimit)
    let connectedChestCount = 1
    let cargoWagonsConnectedToChest = 1 / 6
    if (bpSettings.connectChestsWithGreenWire) {
        connectedChestCount *= 6 * cargoCount
        cargoWagonsConnectedToChest *= 6 * cargoCount
    }
    if (bpSettings.connectBothSideWithGreenWire && bpSettings.beltSidesUsed === "Both") {
        connectedChestCount *= 2
        cargoWagonsConnectedToChest *= 2
    }
    const chestType = bpSettings.chestType
    let chestSlotsCount = chestType === "wooden-chest" ? 16 : chestType === "iron-chest" ? 32 : 48
    chestSlotsCount = Math.min(chestLimit, chestSlotsCount)
    const chestTotalItemCount = stackSize * chestSlotsCount * connectedChestCount

    // Calculate how many items the cargo wagons can contain
    const trainSlotsCount = 40
    const trainTotalItemCount = cargoWagonsConnectedToChest * trainSlotsCount * stackSize

    if (bpSettings.stationType === "Loading Station") {
        return ["each", "/", Math.round(trainTotalItemCount).toString(), "each", "+", "0"]
    }

    if (bpSettings.stationType === "Unloading Station") {
        return [
            "each",
            "/",
            Math.round(trainTotalItemCount).toString(),
            Math.floor(chestTotalItemCount / trainTotalItemCount).toString(),
            "-",
            "A",
        ]
    }

    return ["0", "+", "0", "0", "+", "0"]
}

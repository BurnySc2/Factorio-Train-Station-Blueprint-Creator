import {
    allowedCharacters,
    defaultSettings,
    fluidStation,
    iOperator,
    normalStation,
} from "./constants"

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
    if (fluidStation.includes(bpSettings.stationType)) {
        if (parseInt(bpSettings.pumpStorageTankColumns) > 500) {
            return "Your amount of storage tanks is extremely high and might crash your browser!"
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
    if (fluidStation.includes(bpSettings.stationType)) {
        if (!verifyNumberInput(bpSettings.pumpStorageTankColumns)) {
            return "Input for amount of storage tank columns is invalid."
        }
        if (parseInt(bpSettings.pumpStorageTankColumns) < 1) {
            return "Amount of storage tank columns has to be at least 1."
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

    // Calculate total number of chests
    const sidesFactor = bpSettings.beltSidesUsed === "Both" ? 2 : 1
    let totalChestCount = 0
    if (normalStation.includes(bpSettings.stationType)) {
        totalChestCount = sidesFactor * 6 * cargoCount
    } else {
        // Fluid stations only use one side, and there is 2 tanks per cargo wagon
        totalChestCount = 2 * cargoCount
    }

    // Calculate how many items the green-wire connected chests can contain
    const chestLimit = bpSettings.chestLimit === "" ? 999999 : parseInt(bpSettings.chestLimit)
    let connectedChestCount = 1
    if (bpSettings.connectChestsWithGreenWire) {
        if (normalStation.includes(bpSettings.stationType)) {
            // For normal stations, there is 6 chests per cargo wagon per side
            connectedChestCount *= 6 * cargoCount
        } else {
            // For fluid stations, there is 2 storage tanks per cargo wagon
            connectedChestCount *= 2 * cargoCount
        }
    }
    if (
        bpSettings.connectBothSideWithGreenWire &&
        bpSettings.beltSidesUsed === "Both" &&
        normalStation.includes(bpSettings.stationType)
    ) {
        // If both sides are used, double the amount of chests (only one side is used for fluid stations
        connectedChestCount *= 2
    }
    const chestType = bpSettings.chestType
    let chestSlotsCount = chestType === "wooden-chest" ? 16 : chestType === "iron-chest" ? 32 : 48
    chestSlotsCount = Math.min(chestLimit, chestSlotsCount)
    let chestTotalItemCount = 0
    // Calculate how many items the cargo wagons can contain
    const trainSlotsCount = 40
    let trainTotalItemCount = 0
    if (normalStation.includes(bpSettings.stationType)) {
        chestTotalItemCount = stackSize * chestSlotsCount * connectedChestCount
        trainTotalItemCount =
            cargoCount * trainSlotsCount * stackSize * (connectedChestCount / totalChestCount)
    } else {
        // All fluid wagons have room for 25k fluids
        stackSize = 25000
        chestTotalItemCount =
            stackSize * connectedChestCount * parseInt(bpSettings.pumpStorageTankColumns)
        trainTotalItemCount = cargoCount * stackSize * (connectedChestCount / totalChestCount)
    }

    if (
        bpSettings.stationType === "Loading Station" ||
        bpSettings.stationType === "Fluid Loading Station"
    ) {
        return ["each", "/", Math.round(trainTotalItemCount).toString(), "L", "+", "0"]
    }

    if (
        bpSettings.stationType === "Unloading Station" ||
        bpSettings.stationType === "Fluid Unloading Station"
    ) {
        return [
            "each",
            "/",
            Math.round(trainTotalItemCount).toString(),
            Math.floor(chestTotalItemCount / trainTotalItemCount).toString(),
            "-",
            "L",
        ]
    }

    return ["0", "+", "0", "0", "+", "0"]
}

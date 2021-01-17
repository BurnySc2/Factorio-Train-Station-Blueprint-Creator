import { defaultSettings } from "../constants/constants"
import { iBlueprintItem, iBlueprintItemWithoutNumber } from "../constants/interfaces"
import {
    getTrainArray,
    placeTrainTracks,
    placeSignals,
    changeItemsCoordinates,
    placeTrain,
    resetEntityNumber,
    assignEntityNumberToItems,
    copyPasteItems,
    newItem,
} from "./CreateItems"
import {
    backLeftCurve,
    backRightCurve,
    frontLeftCurve,
    frontRightCurve,
} from "../constants/verticalStackerCurves"
import {
    diagonalBackLeftCurve,
    diagonalBackRightCurve,
    diagonalFrontLeftCurve,
    diagonalFrontRightCurve,
} from "../constants/diagonalStackerCurves"

export const createStacker = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    resetEntityNumber()
    if (bpSettings.diagonalStacker) {
        return createDiagonalStacker(bpSettings)
    } else {
        return createVerticalStacker(bpSettings)
    }
}

export const createVerticalStacker = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    const trainLength = Math.floor(getTrainArray(bpSettings).length / 2) * 2
    const parallelTracks = parseInt(bpSettings.stackerNumberParallelLanes)

    let frontCurve: iBlueprintItem[]
    let backCurve: iBlueprintItem[]
    let entranceChainSignal: iBlueprintItem
    if (bpSettings.stackerType === "Left-Left" || bpSettings.stackerType === "Right-Left") {
        frontCurve = assignEntityNumberToItems(frontLeftCurve, -2, -8)
    } else {
        frontCurve = assignEntityNumberToItems(frontRightCurve, -2, -8)
    }

    if (bpSettings.stackerType === "Left-Left" || bpSettings.stackerType === "Left-Right") {
        backCurve = assignEntityNumberToItems(backLeftCurve, -2, trainLength - 2)
        entranceChainSignal = newItem("rail-chain-signal", 15.5 - 28, 11.5 + trainLength, {
            direction: 6,
        })
    } else {
        backCurve = assignEntityNumberToItems(backRightCurve, -2, trainLength - 2)
        entranceChainSignal = newItem(
            "rail-chain-signal",
            13.5 - 9 + 4 * parallelTracks,
            8.5 + trainLength,
            { direction: 2 }
        )
    }

    let copyPasteBlueprint = [
        ...placeTrainTracks(bpSettings),
        ...placeSignals(bpSettings),
        ...frontCurve,
        ...backCurve,
    ]
    if (bpSettings.includeTrainInBlueprint)
        copyPasteBlueprint = [...copyPasteBlueprint, ...placeTrain(bpSettings)]
    changeItemsCoordinates(copyPasteBlueprint, -0.5)

    let allItems: iBlueprintItem[] = []
    for (let i = 0; i < parallelTracks; i++) {
        allItems = [...allItems, ...copyPasteItems(copyPasteBlueprint, i * 4)]
    }
    allItems = [...allItems, entranceChainSignal]

    return allItems
}

export const createDiagonalStacker = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    const doubleHeadedFactor = bpSettings.doubleHeaded ? 2 : 1
    const diagonalLength =
        Math.round(
            (2.5 *
                (doubleHeadedFactor * parseInt(bpSettings.locomotivesPerEnd) +
                    parseInt(bpSettings.cargoWagon))) /
                2
        ) *
            2 +
        1
    const parallelTracks = parseInt(bpSettings.stackerNumberParallelLanes)

    const validTypes = ["Left-Right", "Right-Left"]
    const stackerType = validTypes.includes(bpSettings.stackerType)
        ? bpSettings.stackerType
        : validTypes[0]

    let frontCurve: iBlueprintItem[]
    let backCurve: iBlueprintItem[]
    let entranceChainSignal: iBlueprintItem
    if (stackerType === "Left-Right") {
        frontCurve = assignEntityNumberToItems(diagonalFrontRightCurve, 8)
        backCurve = assignEntityNumberToItems(
            diagonalBackLeftCurve,
            8 - diagonalLength * 2,
            diagonalLength * 2
        )
        entranceChainSignal = newItem(
            "rail-chain-signal",
            -2.5 - diagonalLength * 2,
            7.5 + diagonalLength * 2,
            { direction: 6 }
        )
    } else {
        frontCurve = assignEntityNumberToItems(diagonalFrontLeftCurve, 8)
        backCurve = assignEntityNumberToItems(
            diagonalBackRightCurve,
            8 - diagonalLength * 2,
            diagonalLength * 2
        )
        entranceChainSignal = newItem(
            "rail-chain-signal",
            3.5 - diagonalLength * 2,
            4.5 + diagonalLength * 2 + 4 * parallelTracks,
            { direction: 4 }
        )
    }

    const diagonals: iBlueprintItemWithoutNumber[] = [
        {
            name: "straight-rail",
            position: { x: 3, y: 3 },
            direction: 7,
        },
        {
            name: "straight-rail",
            position: { x: 3, y: 1 },
            direction: 3,
        },
    ]

    let copyPasteBlueprint: iBlueprintItem[] = []
    for (let i = 0; i < diagonalLength; i++) {
        const newDiagonals = assignEntityNumberToItems(diagonals, -i * 2, i * 2)
        copyPasteBlueprint = [...copyPasteBlueprint, ...newDiagonals]
    }
    copyPasteBlueprint = [...copyPasteBlueprint, ...frontCurve, ...backCurve]

    let allItems: iBlueprintItem[] = []

    for (let i = 0; i < parallelTracks; i++) {
        if (bpSettings.stackerType === "Left-Right") {
            allItems = [...allItems, ...copyPasteItems(copyPasteBlueprint, i * 4, 0)]
        } else {
            allItems = [...allItems, ...copyPasteItems(copyPasteBlueprint, 0, i * 4)]
        }
    }
    allItems = [...allItems, entranceChainSignal]

    return allItems
}

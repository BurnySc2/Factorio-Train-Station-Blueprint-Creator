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

    let frontCurve: iBlueprintItem[]
    let backCurve: iBlueprintItem[]
    if (bpSettings.stackerType === "Left-Left" || bpSettings.stackerType === "Right-Left") {
        frontCurve = assignEntityNumberToItems(frontLeftCurve, -2, -8)
    } else {
        frontCurve = assignEntityNumberToItems(frontRightCurve, -2, -8)
    }

    if (bpSettings.stackerType === "Left-Left" || bpSettings.stackerType === "Left-Right") {
        backCurve = assignEntityNumberToItems(backLeftCurve, -2, trainLength - 2)
    } else {
        backCurve = assignEntityNumberToItems(backRightCurve, -2, trainLength - 2)
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
    for (let i = 0; i < parseInt(bpSettings.stackerNumberParallelLanes); i++) {
        allItems = [...allItems, ...copyPasteItems(copyPasteBlueprint, i * 4)]
    }

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

    let frontCurve: iBlueprintItem[]
    let backCurve: iBlueprintItem[]
    if (bpSettings.stackerType === "Left-Right") {
        frontCurve = assignEntityNumberToItems(diagonalFrontRightCurve, 8)
        backCurve = assignEntityNumberToItems(
            diagonalBackLeftCurve,
            8 - diagonalLength * 2,
            diagonalLength * 2
        )
    } else {
        frontCurve = assignEntityNumberToItems(diagonalFrontLeftCurve, 8)
        backCurve = assignEntityNumberToItems(
            diagonalBackRightCurve,
            8 - diagonalLength * 2,
            diagonalLength * 2
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

    for (let i = 0; i < parseInt(bpSettings.stackerNumberParallelLanes); i++) {
        if (bpSettings.stackerType === "Left-Right") {
            allItems = [...allItems, ...copyPasteItems(copyPasteBlueprint, i * 4, 0)]
        } else {
            allItems = [...allItems, ...copyPasteItems(copyPasteBlueprint, 0, i * 4)]
        }
    }
    return allItems
}

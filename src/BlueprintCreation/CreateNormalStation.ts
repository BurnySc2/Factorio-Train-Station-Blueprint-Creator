import { botChestTypes, defaultSettings } from "../constants/constants"
import { iBlueprintItem } from "../constants/interfaces"
import {
    placeChests,
    mirrorItemsHorizontal,
    mixSides,
    sortByYPosition,
    connectItemsWithWire,
    connectTwoEntitiesWithWire,
    placeInserters,
    placeLoadingBelts,
    placeUnloadingBelts,
    placePoles,
    placeTrainTracks,
    placeSignals,
    placeTrainStop,
    placeRefuelChestsAndInserters,
    placeTopRefuelPoles,
    placeBottomRefuelPoles,
    placeEnabledConditionDecider,
    placeLamps,
    placeSplitters,
    changeItemsCoordinates,
    placeTrain,
    placeVerticalBelts,
    resetEntityNumber,
    placeDynamicTrainLimitCombinators,
} from "./CreateItems"

export const createNormalStation = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    resetEntityNumber()
    let allItems: iBlueprintItem[] = []
    let rightSplitters: iBlueprintItem[] = []

    // For each station, create all items, then shift them down
    let stationItems: iBlueprintItem[] = []
    // Create chests and connect them with wire
    const rightChests = placeChests(bpSettings)
    const leftChests = mirrorItemsHorizontal(rightChests)
    const chests = mixSides(bpSettings.beltSidesUsed, leftChests, rightChests)
    // Sorting not required?
    sortByYPosition(rightChests)
    sortByYPosition(leftChests)
    if (bpSettings.connectChestsWithGreenWire) {
        connectItemsWithWire(leftChests, "green")
        connectItemsWithWire(rightChests, "green")
        if (bpSettings.connectBothSideWithGreenWire && bpSettings.beltSidesUsed === "Both") {
            connectTwoEntitiesWithWire(rightChests[0], leftChests[0], "green")
        }
    }
    if (bpSettings.connectChestsWithRedWire) {
        connectItemsWithWire(leftChests, "red")
        connectItemsWithWire(rightChests, "red")
        if (bpSettings.connectBothSideWithRedWire && bpSettings.beltSidesUsed === "Both") {
            connectTwoEntitiesWithWire(rightChests[0], leftChests[0], "red")
        }
    }

    // Mirrorable items
    let rightSideItems: iBlueprintItem[] = []
    // Exclude belts and splitters (and without splitters: no vertical belts) if chest type uses bots
    if (!botChestTypes.includes(bpSettings.chestType)) {
        const newSplitters = placeSplitters(bpSettings)
        rightSplitters = [...rightSplitters, ...newSplitters]
        if (bpSettings.stationType === "Loading Station") {
            rightSideItems = [...rightSideItems, ...placeLoadingBelts(bpSettings)]
        } else {
            // Unloading station
            rightSideItems = [...rightSideItems, ...placeUnloadingBelts(bpSettings)]
        }
    }
    rightSideItems = [...rightSideItems, ...placeInserters(bpSettings)]

    const rightPoles = placePoles(bpSettings)
    const leftPoles = mirrorItemsHorizontal(rightPoles)
    const poles = mixSides(bpSettings.beltSidesUsed, leftPoles, rightPoles)
    let leftSideItems: iBlueprintItem[] = mirrorItemsHorizontal(rightSideItems)

    // Combine remaining items which were already mirrored and offset-ed
    rightSideItems = [...rightSideItems, ...rightPoles, ...rightChests]
    leftSideItems = [...leftSideItems, ...leftPoles, ...leftChests]
    if (bpSettings.placeLampsNearPoles) {
        const rightLamps = placeLamps(bpSettings)
        const leftLamps = mirrorItemsHorizontal(rightLamps)
        rightSideItems = [...rightSideItems, ...rightLamps]
        leftSideItems = [...leftSideItems, ...leftLamps]
    }

    // All items that need no mirroring (tracks, signals, train stops, refuel chests and inserter, poles for those, decider combinator)
    stationItems = [...stationItems, ...placeTrainTracks(bpSettings)]
    stationItems = [...stationItems, ...placeSignals(bpSettings)]
    const trainStop = placeTrainStop(bpSettings)[0]
    stationItems = [...stationItems, trainStop]
    if (bpSettings.refillEnabled) {
        // Place inserters, chests, and bottom poles
        stationItems = [...stationItems, ...placeRefuelChestsAndInserters(bpSettings)]
        stationItems = [...stationItems, ...placeBottomRefuelPoles(bpSettings)]
    }
    if (
        bpSettings.refillEnabled ||
        bpSettings.trainStopUsesEnabledCondition ||
        bpSettings.trainLimit === "Dynamic"
    ) {
        // Place top poles if refil enabled
        const topPoles = placeTopRefuelPoles(bpSettings)
        stationItems = [...stationItems, ...topPoles]

        // Connect top chest with top pole, and top pole with the top-refill-poles
        sortByYPosition(poles)
        // In enabled-condition: place decider
        if (bpSettings.trainStopUsesEnabledCondition) {
            stationItems = [
                ...stationItems,
                placeEnabledConditionDecider(bpSettings, poles[0], trainStop)[0],
            ]
        }
        // If dynamic train limit: place decider and arithmetic (2 arithmetic for unloading)
        if (bpSettings.trainLimit === "Dynamic") {
            const combinators = placeDynamicTrainLimitCombinators(bpSettings, poles[0], trainStop)
            stationItems = [...stationItems, ...combinators]
        }
        // Connect top refill poles if enabled-condition or trainLimit=dynamic
        if (bpSettings.trainStopUsesEnabledCondition || bpSettings.trainLimit === "Dynamic") {
            sortByYPosition(chests)
            const combineArray = [chests[0], poles[0], ...topPoles]
            sortByYPosition(combineArray)
            connectItemsWithWire(combineArray, "green")
        }
    }
    if (bpSettings.includeTrainInBlueprint) {
        stationItems = [...stationItems, ...placeTrain(bpSettings)]
    }

    // Combine left and right side items
    stationItems = [
        ...stationItems,
        ...mixSides(bpSettings.beltSidesUsed, leftSideItems, rightSideItems),
    ]

    allItems = [...allItems, ...stationItems]

    if (bpSettings.beltFlowDirection !== "None") {
        const rightVerticalBelts = placeVerticalBelts(bpSettings, rightSplitters)
        const leftVerticalBelts = mirrorItemsHorizontal(rightVerticalBelts)
        allItems = [
            ...allItems,
            ...mixSides(bpSettings.beltSidesUsed, leftVerticalBelts, rightVerticalBelts),
        ]
    }
    // Add splitters which were previously globally collected to create vertical belts
    const leftSplitters = mirrorItemsHorizontal(rightSplitters)
    allItems = [...allItems, ...mixSides(bpSettings.beltSidesUsed, leftSplitters, rightSplitters)]

    const trainStops = allItems.filter((item) => {
        return item.name === "train-stop"
    })
    const railSignals = allItems.filter((item) => {
        return item.name === "rail-signal"
    })
    sortByYPosition(trainStops)
    sortByYPosition(railSignals)
    trainStops.slice(1).forEach((stop, i) => {
        const signal = railSignals[i]
        connectTwoEntitiesWithWire(stop, signal, "green")
    })

    // All items are off by 0.5, fix here
    changeItemsCoordinates(allItems, -0.5)
    return allItems
}

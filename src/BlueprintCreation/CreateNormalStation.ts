import { botChestTypes, defaultSettings } from "../constants/constants"
import { iBlueprintItem } from "../constants/interfaces"
import {
    getTrainArray,
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
    placeDecider,
    placeLamps,
    placeSplitters,
    changeItemsCoordinates,
    placeTrain,
    placeVerticalBelts,
    resetEntityNumber,
} from "./CreateItems"

export const createNormalStation = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    resetEntityNumber()
    let allItems: iBlueprintItem[] = []
    let rightSplitters: iBlueprintItem[] = []

    const stationsTarget = bpSettings.sequentialStation ? bpSettings.sequentialStationsAmount : 1
    // For each station, create all items, then shift them down
    for (let stationNumber = 0; stationNumber < stationsTarget; stationNumber++) {
        const stationYOffset = (getTrainArray(bpSettings).length + 2) * stationNumber

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
            changeItemsCoordinates(newSplitters, 0, stationYOffset)
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
        stationItems = [...stationItems, ...placeSignals(bpSettings, stationNumber)]
        const trainStop = placeTrainStop(bpSettings)[0]
        stationItems = [...stationItems, trainStop]
        if (bpSettings.refillEnabled)
            stationItems = [...stationItems, ...placeRefuelChestsAndInserters(bpSettings)]
        if (bpSettings.refillEnabled || bpSettings.trainStopUsesEnabledCondition) {
            const topPoles = placeTopRefuelPoles(bpSettings)
            const bottomPoles = placeBottomRefuelPoles(bpSettings)
            stationItems = [...stationItems, ...topPoles, ...bottomPoles]
            if (bpSettings.trainStopUsesEnabledCondition) {
                const decider = placeDecider(bpSettings)[0]
                // Combine decider and trainstop with green wire
                connectTwoEntitiesWithWire(decider, trainStop, "green", "2", "1")
                // Combine decider and poles with green wire
                sortByYPosition(chests)
                sortByYPosition(poles)
                const combineArray = [decider, chests[0], poles[0], ...topPoles]
                sortByYPosition(combineArray)
                connectItemsWithWire(combineArray, "green")
                stationItems = [...stationItems, decider]
            }
        }
        if (bpSettings.includeTrainInBlueprint) {
            stationItems = [...stationItems, ...placeTrain(bpSettings)]
        }

        /*
        TODO
        liquid load/unload
        stacker
         */

        // Combine left and right side items
        stationItems = [
            ...stationItems,
            ...mixSides(bpSettings.beltSidesUsed, leftSideItems, rightSideItems),
        ]

        // Move all items by sequential station offset
        changeItemsCoordinates(stationItems, 0, stationYOffset)
        allItems = [...allItems, ...stationItems]
    }

    // If sequential and not lay all the way: go in splitter groups
    if (bpSettings.sequentialStation && !bpSettings.sequantialStationBeltsGoAllTheWay) {
        sortByYPosition(rightSplitters)
        for (
            let i = 0;
            i < parseInt(bpSettings.cargoWagon) * parseInt(bpSettings.sequentialStationsAmount);
            i += parseInt(bpSettings.cargoWagon)
        ) {
            const splitterSlice = rightSplitters.slice(i, i + parseInt(bpSettings.cargoWagon))
            const rightVerticalBelts = placeVerticalBelts(bpSettings, splitterSlice)
            const leftVerticalBelts = mirrorItemsHorizontal(rightVerticalBelts)
            allItems = [
                ...allItems,
                ...mixSides(bpSettings.beltSidesUsed, leftVerticalBelts, rightVerticalBelts),
            ]
        }
    }
    // If sequential: lay all-the-way belts
    else if (bpSettings.beltFlowDirection !== "None") {
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

    // If sequential: connect train stop with next rail signal (green wire)
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

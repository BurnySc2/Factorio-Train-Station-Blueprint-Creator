import { defaultSettings } from "../constants/constants"
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

    let stationsTarget = bpSettings.sequentialStation ? bpSettings.sequentialStationsAmount : 1
    // For each station, create all items, then shift them down
    for (let stationNumber = 0; stationNumber < stationsTarget; stationNumber++) {
        const stationYOffset = (getTrainArray(bpSettings).length + 2) * stationNumber

        let stationItems: iBlueprintItem[] = []
        // Create chests and connect them with wire
        let rightChests = placeChests(bpSettings)
        let leftChests = mirrorItemsHorizontal(rightChests)
        let chests = mixSides(bpSettings.beltSidesUsed, leftChests, rightChests)
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
        if (bpSettings.stationType === "Loading Station") {
            rightSideItems = [...rightSideItems, ...placeLoadingBelts(bpSettings)]
        } else {
            // Unloading station
            rightSideItems = [...rightSideItems, ...placeUnloadingBelts(bpSettings)]
        }
        rightSideItems = [...rightSideItems, ...placeInserters(bpSettings)]

        let rightPoles = placePoles(bpSettings)
        let leftPoles = mirrorItemsHorizontal(rightPoles)
        let poles = mixSides(bpSettings.beltSidesUsed, leftPoles, rightPoles)
        let leftSideItems: iBlueprintItem[] = mirrorItemsHorizontal(rightSideItems)

        // Combine remaining items which were already mirrored and offset-ed
        rightSideItems = [...rightSideItems, ...rightPoles, ...rightChests]
        leftSideItems = [...leftSideItems, ...leftPoles, ...leftChests]
        if (bpSettings.placeLampsNearPoles) {
            let rightLamps = placeLamps(bpSettings)
            let leftLamps = mirrorItemsHorizontal(rightLamps)
            rightSideItems = [...rightSideItems, ...rightLamps]
            leftSideItems = [...leftSideItems, ...leftLamps]
        }

        // All items that need no mirroring (tracks, signals, train stops, refuel chests and inserter, poles for those, decider combinator)
        stationItems = [...stationItems, ...placeTrainTracks(bpSettings)]
        stationItems = [...stationItems, ...placeSignals(bpSettings, stationNumber)]
        let trainStop = placeTrainStop(bpSettings)[0]
        stationItems = [...stationItems, trainStop]
        if (bpSettings.refillEnabled)
            stationItems = [...stationItems, ...placeRefuelChestsAndInserters(bpSettings)]
        if (bpSettings.refillEnabled || bpSettings.trainStopUsesEnabledCondition) {
            let topPoles = placeTopRefuelPoles(bpSettings)
            let bottomPoles = placeBottomRefuelPoles(bpSettings)
            stationItems = [...stationItems, ...topPoles, ...bottomPoles]
            if (bpSettings.trainStopUsesEnabledCondition) {
                let decider = placeDecider(bpSettings)[0]
                // Combine decider and trainstop with green wire
                connectTwoEntitiesWithWire(decider, trainStop, "green", "2", "1")
                // Combine decider and poles with green wire
                sortByYPosition(chests)
                sortByYPosition(poles)
                let combineArray = [decider, chests[0], poles[0], ...topPoles]
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

        let newSplitters = placeSplitters(bpSettings)
        changeItemsCoordinates(newSplitters, 0, stationYOffset)
        rightSplitters = [...rightSplitters, ...newSplitters]

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
            let splitterSlice = rightSplitters.slice(i, i + parseInt(bpSettings.cargoWagon))
            let rightVerticalBelts = placeVerticalBelts(bpSettings, splitterSlice)
            let leftVerticalBelts = mirrorItemsHorizontal(rightVerticalBelts)
            allItems = [
                ...allItems,
                ...mixSides(bpSettings.beltSidesUsed, leftVerticalBelts, rightVerticalBelts),
            ]
        }
    }
    // If sequential: lay all-the-way belts
    else if (bpSettings.beltFlowDirection !== "None") {
        let rightVerticalBelts = placeVerticalBelts(bpSettings, rightSplitters)
        let leftVerticalBelts = mirrorItemsHorizontal(rightVerticalBelts)
        allItems = [
            ...allItems,
            ...mixSides(bpSettings.beltSidesUsed, leftVerticalBelts, rightVerticalBelts),
        ]
    }
    // Add splitters which were previously globally collected to create vertical belts
    let leftSplitters = mirrorItemsHorizontal(rightSplitters)
    allItems = [...allItems, ...mixSides(bpSettings.beltSidesUsed, leftSplitters, rightSplitters)]

    // If sequential: connect train stop with next rail signal (green wire)
    let trainStops = allItems.filter((item) => {
        return item.name === "train-stop"
    })
    let railSignals = allItems.filter((item) => {
        return item.name === "rail-signal"
    })
    sortByYPosition(trainStops)
    sortByYPosition(railSignals)
    trainStops.slice(1).forEach((stop, i) => {
        let signal = railSignals[i]
        connectTwoEntitiesWithWire(stop, signal, "green")
    })

    // All items are off by 0.5, fix here
    changeItemsCoordinates(allItems, -0.5)
    return allItems
}

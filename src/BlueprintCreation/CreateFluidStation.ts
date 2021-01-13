import { defaultSettings } from "../constants/constants"
import { iBlueprintItem } from "../constants/interfaces"
import {
    getTrainArray,
    mirrorItemsHorizontal,
    mixSides,
    sortByYPosition,
    connectItemsWithWire,
    connectTwoEntitiesWithWire,
    placePoles,
    placeTrainTracks,
    placeSignals,
    placeTrainStop,
    placeRefuelChestsAndInserters,
    placeTopRefuelPoles,
    placeBottomRefuelPoles,
    placeDecider,
    placeLamps,
    changeItemsCoordinates,
    placeTrain,
    resetEntityNumber,
    placeStorageTanks,
    placePumps,
    placePipes,
} from "./CreateItems"

export const createFluidStation = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    resetEntityNumber()
    let allItems: iBlueprintItem[] = []

    const stationsTarget = bpSettings.sequentialStation ? bpSettings.sequentialStationsAmount : 1
    // For each station, create all items, then shift them down
    for (let stationNumber = 0; stationNumber < stationsTarget; stationNumber++) {
        const stationYOffset = (getTrainArray(bpSettings).length + 2) * stationNumber

        let stationItems: iBlueprintItem[] = []
        // TODO place storage tanks and connect them with wire
        // Sorting not required?
        const rightStorageTanks: iBlueprintItem[] = placeStorageTanks(bpSettings)
        const leftStorageTanks: iBlueprintItem[] = mirrorItemsHorizontal(rightStorageTanks)
        sortByYPosition(rightStorageTanks)
        sortByYPosition(leftStorageTanks)
        if (bpSettings.connectChestsWithGreenWire) {
            connectItemsWithWire(leftStorageTanks, "green")
            connectItemsWithWire(rightStorageTanks, "green")
        }
        if (bpSettings.connectChestsWithRedWire) {
            connectItemsWithWire(leftStorageTanks, "red")
            connectItemsWithWire(rightStorageTanks, "red")
        }

        // Mirrorable items
        let rightSideItems: iBlueprintItem[] = []

        const rightPoles = placePoles(bpSettings)
        const leftPoles = mirrorItemsHorizontal(rightPoles)
        const poles = mixSides(bpSettings.pumpSidesToBeUsed, leftPoles, rightPoles)
        let leftSideItems: iBlueprintItem[] = mirrorItemsHorizontal(rightSideItems)
        const rightPumps = placePumps(bpSettings)
        const leftPumps = mirrorItemsHorizontal(rightPumps)
        const rightPipes = placePipes(bpSettings)
        const leftPipes = mirrorItemsHorizontal(rightPipes)

        // Combine remaining items which were already mirrored and offset-ed
        // TODO Add storage tanks here
        if (bpSettings.placeLampsNearPoles) {
            const rightLamps = placeLamps(bpSettings)
            const leftLamps = mirrorItemsHorizontal(rightLamps)
            rightSideItems = [...rightSideItems, ...rightLamps]
            leftSideItems = [...leftSideItems, ...leftLamps]
        }
        rightSideItems = [...rightSideItems, ...rightPoles, ...rightPumps, ...rightPipes]
        leftSideItems = [...leftSideItems, ...leftPoles, ...leftPumps, ...leftPipes]

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
                // TODO Connect storage tank with pole
                const storageTanks = mixSides(
                    bpSettings.pumpSidesToBeUsed,
                    leftStorageTanks,
                    rightStorageTanks
                )
                sortByYPosition(storageTanks)
                sortByYPosition(poles)
                const combineArray = [decider, storageTanks[0], poles[0], ...topPoles]
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
            ...mixSides(bpSettings.pumpSidesToBeUsed, leftSideItems, rightSideItems),
            ...mixSides(bpSettings.pumpSidesToBeUsed, leftStorageTanks, rightStorageTanks),
        ]

        // Move all items by sequential station offset
        changeItemsCoordinates(stationItems, 0, stationYOffset)
        allItems = [...allItems, ...stationItems]
    }

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

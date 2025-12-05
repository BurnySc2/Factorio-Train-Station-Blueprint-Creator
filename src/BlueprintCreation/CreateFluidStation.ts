import type { defaultSettings } from "../constants/constants"
import type { iBlueprintItem } from "../constants/interfaces"
import {
	changeItemsCoordinates,
	connectItemsWithWire,
	connectTwoEntitiesWithWire,
	mirrorItemsHorizontal,
	mixSides,
	placeBottomRefuelPoles,
	placeDynamicTrainLimitCombinators,
	placeEnabledConditionDecider,
	placeLamps,
	placePipes,
	placePoles,
	placePumps,
	placeRefuelChestsAndInserters,
	placeSignals,
	placeStorageTanks,
	placeTopRefuelPoles,
	placeTrain,
	placeTrainStop,
	placeTrainTracks,
	resetEntityNumber,
	sortByYPosition,
	sortStorageTanks,
} from "./CreateItems"

export const createFluidStation = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
	resetEntityNumber()
	let allItems: iBlueprintItem[] = []

	// For each station, create all items, then shift them down
	let stationItems: iBlueprintItem[] = []
	// Sorting not required?
	let rightStorageTanks: iBlueprintItem[] = placeStorageTanks(bpSettings)
	let leftStorageTanks: iBlueprintItem[] = mirrorItemsHorizontal(rightStorageTanks)
	rightStorageTanks = sortStorageTanks(rightStorageTanks)
	leftStorageTanks = sortStorageTanks(leftStorageTanks, 1)
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
	stationItems = [...stationItems, ...placeSignals(bpSettings)]
	const trainStop = placeTrainStop(bpSettings)[0]
	stationItems = [...stationItems, trainStop]
	if (bpSettings.refillEnabled) {
		stationItems = [...stationItems, ...placeRefuelChestsAndInserters(bpSettings)]
		const bottomPoles = placeBottomRefuelPoles(bpSettings)
		stationItems = [...stationItems, ...bottomPoles]
	}
	if (bpSettings.refillEnabled || bpSettings.trainStopUsesEnabledCondition || bpSettings.trainLimit === "Dynamic") {
		const topPoles = placeTopRefuelPoles(bpSettings)
		stationItems = [...stationItems, ...topPoles]
		sortByYPosition(poles)

		// In enabled-condition: place decider
		if (bpSettings.trainStopUsesEnabledCondition) {
			stationItems = [...stationItems, ...placeEnabledConditionDecider(bpSettings, poles[0], trainStop)]
		}

		// If dynamic train limit: place decider and arithmetic (2 arithmetic for unloading)
		if (bpSettings.trainLimit === "Dynamic") {
			const combinators = placeDynamicTrainLimitCombinators(bpSettings, poles[0], trainStop)
			stationItems = [...stationItems, ...combinators]
		}

		// Connect top refill poles if enabled-condition or trainLimit=dynamic
		if (bpSettings.trainStopUsesEnabledCondition || bpSettings.trainLimit === "Dynamic") {
			// Connect top chest with top pole, and top pole with the top-refill-poles
			const storageTanks = mixSides(bpSettings.pumpSidesToBeUsed, leftStorageTanks, rightStorageTanks)
			const combineArray = [storageTanks[0], poles[0], ...topPoles]
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
		...mixSides(bpSettings.pumpSidesToBeUsed, leftSideItems, rightSideItems),
		...mixSides(bpSettings.pumpSidesToBeUsed, leftStorageTanks, rightStorageTanks),
	]

	allItems = [...allItems, ...stationItems]

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

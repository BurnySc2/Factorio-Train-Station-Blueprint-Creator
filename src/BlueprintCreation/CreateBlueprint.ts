import {
    defaultSettings,
    DIRECTION,
    filterInserters,
    mirrorXOffset,
    splitterTypes,
} from "../constants/constants"
import { iBlueprint, iBlueprintItem, iWireColor } from "../constants/interfaces"
const cloneDeep = require("clone-deep")
const zlib = require("zlib")

let entityNumber = 1

export const createBlueprint = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    /*
    TODO
    liquid:
    create pumps
    create storage tanks

    stacker:
    create stacker

    warnings / errors:
    invalid number (not able to parseint, entry missing)
    sequential should be used together with "train enabled condition"
    "train enabled condition" should be used with at least "connect chests with green wire
     */

    entityNumber = 1
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
            rightSideItems = [...rightSideItems, ...placeLoadingInserters(bpSettings)]
            rightSideItems = [...rightSideItems, ...placeLoadingBelts(bpSettings)]
        } else {
            // Unloading station
            rightSideItems = [...rightSideItems, ...placeUnloadingInserters(bpSettings)]
            rightSideItems = [...rightSideItems, ...placeUnloadingBelts(bpSettings)]
        }

        let rightPoles = placePoles(bpSettings)
        let leftPoles = mirrorItemsHorizontal(rightPoles)
        let poles = mixSides(bpSettings.beltSidesUsed, leftPoles, rightPoles)
        let leftSideItems: iBlueprintItem[] = mirrorItemsHorizontal(rightSideItems)

        // Combine remaining items which were already mirrored and offset-ed
        rightSideItems = [...rightSideItems, ...rightPoles, ...rightChests]
        leftSideItems = [...leftSideItems, ...leftPoles, ...leftChests]

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
        if (bpSettings.placeLampsNearPoles)
            stationItems = [...stationItems, ...placeLamps(bpSettings)]
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const decode = (blueprintString: string) => {
    // UNTESTED stolen from https://github.com/demipixel/factorio-blueprint/blob/c21309e9023ee3740a5c3c647d87cb828ab3ecc4/src/util.ts#L20
    return JSON.parse(
        zlib.inflateSync(Buffer.from(blueprintString.slice(1), "base64")).toString("utf8")
    )
}

const encode = (items: any[]) => {
    let blueprint = {
        blueprint: {
            icons: [
                {
                    signal: {
                        type: "item",
                        name: "transport-belt",
                    },
                    index: 1,
                },
            ],
            entities: items,
            item: "blueprint",
            version: "0",
            label: "Blueprint",
        },
    }
    return "0" + zlib.deflateSync(JSON.stringify(blueprint), { level: 9 }).toString("base64")
}

export const createBlueprintString = (blueprint: iBlueprint): string => {
    // Stolen from https://github.com/demipixel/factorio-blueprint/blob/c21309e9023ee3740a5c3c647d87cb828ab3ecc4/src/util.ts#L41
    return encode(blueprint)
}

const newItem = (
    itemName: string,
    x: number,
    y: number,
    options: {
        direction?: number
        orientation?: number
        bar?: number
        filters?: Array<{
            index: number
            name: string
        }>
        request_filters?: Array<{
            index: number
            name: string
            count: number
        }>
        request_from_buffers?: boolean
        station?: string
        manual_trains_limit?: string
        control_behavior?: {
            decider_conditions?: {
                first_signal: {
                    type: string
                    name: string
                }
                constant: number
                comparator: string
                output_signal: {
                    type: string
                    name: string
                }
                copy_count_from_input: boolean
            }
            circuit_condition?: {
                first_signal: {
                    type: string
                    name: string
                }
                constant: number
                comparator: string
            }
            circuit_enable_disable?: boolean
        }
    } = {}
): iBlueprintItem => {
    let item: iBlueprintItem = {
        entity_number: entityNumber,
        name: itemName,
        position: {
            x: x,
            y: y,
        },
    }
    if (options.direction) {
        item.direction = options.direction
    }
    if (options.orientation) {
        item.orientation = options.orientation
    }
    if (options.bar) {
        item.bar = options.bar
    }
    if (options.filters) {
        item.filters = options.filters
    }
    if (options.request_filters) {
        item.request_filters = options.request_filters
    }
    if (options.request_from_buffers) {
        item.request_from_buffers = options.request_from_buffers
    }
    if (options.control_behavior) {
        item.control_behavior = options.control_behavior
    }
    if (options.station) {
        item.station = options.station
    }
    if (options.manual_trains_limit) {
        item.manual_trains_limit = options.manual_trains_limit
    }
    entityNumber += 1
    return item
}

const getTrainArray = (bpSettings: typeof defaultSettings, startOffset = 0, bottomOffset = 0) => {
    let returnArray: number[] = []
    let doubleHeaded = bpSettings.doubleHeaded ? 2 : 1
    for (
        let i = startOffset;
        i <
        (doubleHeaded * parseInt(bpSettings.locomotivesPerEnd) + parseInt(bpSettings.cargoWagon)) *
            7 +
            bottomOffset;
        i++
    ) {
        returnArray.push(i)
    }
    return returnArray
}

const getFrontLocomotivesArray = (
    bpSettings: typeof defaultSettings,
    startOffset = -3,
    bottomOffset = -3
) => {
    let returnArray: number[] = []
    for (let i = startOffset; i < parseInt(bpSettings.locomotivesPerEnd) * 7 + bottomOffset; i++) {
        returnArray.push(i)
    }
    return returnArray
}

const getBackLocomotivesArray = (
    bpSettings: typeof defaultSettings,
    startOffset = -3,
    bottomOffset = -3
) => {
    if (!bpSettings.doubleHeaded) return []
    let returnArray: number[] = []
    for (
        let i =
            (parseInt(bpSettings.locomotivesPerEnd) + parseInt(bpSettings.cargoWagon)) * 7 +
            startOffset;
        i <
        (2 * parseInt(bpSettings.locomotivesPerEnd) + parseInt(bpSettings.cargoWagon)) * 7 +
            bottomOffset;
        i++
    ) {
        returnArray.push(i)
    }
    return returnArray
}

const getCargoArray = (bpSettings: typeof defaultSettings, startOffset = -3) => {
    let returnArray: number[] = []
    let bottomOffset = 1
    for (
        let i = parseInt(bpSettings.locomotivesPerEnd) * 7 + startOffset;
        i <
        (parseInt(bpSettings.locomotivesPerEnd) + parseInt(bpSettings.cargoWagon)) * 7 +
            startOffset +
            bottomOffset;
        i++
    ) {
        returnArray.push(i)
    }
    return returnArray
}

const placeTrainTracks = (bpSettings: typeof defaultSettings) => {
    let returnArray: iBlueprintItem[] = []
    getTrainArray(bpSettings, -4).forEach((i) => {
        if (i % 2 === 1) return
        returnArray.push(newItem("straight-rail", -1.5, i))
    })
    return returnArray
}

const placeSignals = (bpSettings: typeof defaultSettings, stationNumber: number) => {
    // Size is 1x1, so coordinate ends in 0.5
    let returnArray: iBlueprintItem[] = []
    let start = 0
    let doubleHeaded = bpSettings.doubleHeaded ? 2 : 1
    let singleHeadedOffset = bpSettings.doubleHeaded ? 0 : 1
    let end =
        (doubleHeaded * parseInt(bpSettings.locomotivesPerEnd) + parseInt(bpSettings.cargoWagon)) *
            7 +
        singleHeadedOffset
    // If sequential station: place chain signal at front, rail signal between, rail signal at the back
    if (bpSettings.sequentialStation) {
        if (stationNumber === 0) {
            returnArray.push(
                newItem("rail-chain-signal", 0, start - 3.5, { direction: DIRECTION.DOWN })
            )
        }
        if (stationNumber === parseInt(bpSettings.sequentialStationsAmount) - 1) {
            returnArray.push(newItem("rail-signal", 0, end - 2.5, { direction: DIRECTION.DOWN }))
        }
        if (stationNumber > 0) {
            returnArray.push(newItem("rail-signal", 0, start - 3.5, { direction: DIRECTION.DOWN }))
        }
    } else {
        if (bpSettings.doubleHeaded) {
            // Chain signal at the back if double headed, because I assume double headed trains exit the same way they went in
            returnArray.push(
                newItem("rail-chain-signal", -3, end - 2.5, { direction: DIRECTION.UP })
            )
        } else {
            // Chain signal at the front if not double headed
            returnArray.push(
                newItem("rail-chain-signal", 0, start - 3.5, { direction: DIRECTION.DOWN })
            )
        }
        // Rail signal at the back
        returnArray.push(newItem("rail-signal", 0, end - 2.5, { direction: DIRECTION.DOWN }))
    }

    return returnArray
}

const placeTrainStop = (bpSettings: typeof defaultSettings) => {
    // Size is 2x2, so coordinate ends in .0
    let returnArray: iBlueprintItem[] = []
    let controlBehavior = bpSettings.trainStopUsesEnabledCondition
        ? {
              circuit_condition: {
                  first_signal: {
                      type: "virtual",
                      name: "signal-red",
                  },
                  constant: 0,
                  comparator: ">",
              },
              circuit_enable_disable: true,
          }
        : undefined
    let options = {
        station: bpSettings.stationName !== "" ? bpSettings.stationName : undefined,
        manual_trains_limit:
            parseInt(bpSettings.trainLimit) >= 0 ? bpSettings.trainLimit : undefined,
        control_behavior: controlBehavior,
    }
    returnArray.push(newItem("train-stop", 0.5, -2, options))
    return returnArray
}

const placeTrain = (bpSettings: typeof defaultSettings) => {
    let returnArray: iBlueprintItem[] = []
    let count = 0
    let doubleHeaded = bpSettings.doubleHeaded ? 2 : 1
    let locoCount = parseInt(bpSettings.locomotivesPerEnd)
    let cargoCount = parseInt(bpSettings.cargoWagon)
    parseInt(bpSettings.cargoWagon)
    // TODO Check if user wants train to be placed
    getTrainArray(bpSettings).forEach((y, i) => {
        if (i % 7 !== 0) return
        if (count < locoCount) {
            returnArray.push(newItem("locomotive", -1.5, y + 1))
        } else if (count < locoCount + cargoCount) {
            returnArray.push(newItem("cargo-wagon", -1.5, y + 1))
        } else if (count < locoCount * doubleHeaded + cargoCount) {
            returnArray.push(newItem("locomotive", -1.5, y + 1, { orientation: 0.5 }))
        }
        count += 1
    })
    return returnArray
}

const placeLoadingInserters = (bpSettings: typeof defaultSettings) => {
    // Size is 1x1, so coordinate ends in 0.5
    // Inserter direction = direction it grabs from
    let returnArray: iBlueprintItem[] = []
    let inserterType = bpSettings.enableFilterInserters
        ? filterInserters[bpSettings.inserterType]
        : bpSettings.inserterType

    let filterArray:
        | undefined
        | Array<{
              index: number
              name: string
          }>
    if (bpSettings.enableFilterInserters) {
        filterArray = []
        for (let i = 0; i < 5; i++) {
            filterArray.push({
                index: i + 1,
                name: bpSettings.filterFields[i],
            })
        }
    }
    getCargoArray(bpSettings).forEach((y, i) => {
        if (i % 7 === 0) return
        returnArray.push(
            newItem(inserterType, 0, y + 0.5, { direction: DIRECTION.RIGHT, filters: filterArray })
        )
        returnArray.push(
            newItem(inserterType, 2, y + 0.5, { direction: DIRECTION.RIGHT, filters: filterArray })
        )
    })
    return returnArray
}
const placeUnloadingInserters = (bpSettings: typeof defaultSettings) => {
    // Size is 1x1, so coordinate ends in 0.5
    // Inserter direction = direction it grabs from
    let returnArray: iBlueprintItem[] = []
    let inserterType = bpSettings.enableFilterInserters
        ? filterInserters[bpSettings.inserterType]
        : bpSettings.inserterType
    let filterArray:
        | undefined
        | Array<{
              index: number
              name: string
          }>
    if (bpSettings.enableFilterInserters) {
        filterArray = []
        for (let i = 0; i < 5; i++) {
            if (!bpSettings.filterFields[i] || bpSettings.filterFields[i] === "") break
            filterArray.push({
                index: i + 1,
                name: bpSettings.filterFields[i],
            })
        }
    }
    getCargoArray(bpSettings).forEach((y, i) => {
        if (i % 7 === 0) return
        returnArray.push(
            newItem(inserterType, 0, y + 0.5, { direction: DIRECTION.LEFT, filters: filterArray })
        )
        returnArray.push(
            newItem(inserterType, 2, y + 0.5, { direction: DIRECTION.LEFT, filters: filterArray })
        )
    })
    return returnArray
}
const placeChests = (bpSettings: typeof defaultSettings) => {
    // Size is 1x1, so coordinate ends in 0.5
    let returnArray: iBlueprintItem[] = []

    // For requester and buffer chests, add the requests
    let isRequesterChest = ["logistic-chest-requester", "logistic-chest-buffer"].includes(
        bpSettings.chestType
    )
    let requests: Array<{
        index: number
        name: string
        count: number
    }> = []
    if (isRequesterChest) {
        bpSettings.chestRequestItemsType.forEach((itemType, index) => {
            let itemAmount = bpSettings.chestRequestItemsAmount[index]
            requests.push({
                index: index + 1,
                name: itemType,
                count: itemAmount,
            })
        })
    }

    let requestFromBuffers =
        bpSettings.chestRequestFromBuffers && bpSettings.chestType === "logistic-chest-requester"
            ? true
            : undefined
    getCargoArray(bpSettings).forEach((y, i) => {
        if (i % 7 === 0) return
        returnArray.push(
            newItem(bpSettings.chestType, 1, y + 0.5, {
                bar: parseInt(bpSettings.chestLimit),
                request_filters: requests,
                request_from_buffers: requestFromBuffers,
            })
        )
    })
    return returnArray
}
const placeLoadingBelts = (bpSettings: typeof defaultSettings) => {
    // Size is 1x1, so coordinate ends in 0.5
    let returnArray: iBlueprintItem[] = []
    getCargoArray(bpSettings).forEach((y, i) => {
        if (i % 7 === 1) {
            returnArray.push(
                newItem(bpSettings.beltType, 3, y + 0.5, { direction: DIRECTION.LEFT })
            )
        } else if (i % 7 === 2) {
            returnArray.push(newItem(bpSettings.beltType, 3, y + 0.5, { direction: DIRECTION.UP }))
        } else if (i % 7 === 3) {
            returnArray.push(newItem(bpSettings.beltType, 3, y + 0.5, { direction: DIRECTION.UP }))
        } else if (i % 7 === 4) {
            returnArray.push(
                newItem(bpSettings.beltType, 3, y + 0.5, { direction: DIRECTION.DOWN })
            )
        } else if (i % 7 === 5) {
            returnArray.push(
                newItem(bpSettings.beltType, 3, y + 0.5, { direction: DIRECTION.DOWN })
            )
        } else if (i % 7 === 6) {
            returnArray.push(
                newItem(bpSettings.beltType, 3, y + 0.5, { direction: DIRECTION.LEFT })
            )
        }
    })
    return returnArray
}
const placeUnloadingBelts = (bpSettings: typeof defaultSettings) => {
    // Size is 1x1, so coordinate ends in 0.5
    let returnArray: iBlueprintItem[] = []
    getCargoArray(bpSettings).forEach((y, i) => {
        if (i % 7 === 1) {
            returnArray.push(
                newItem(bpSettings.beltType, 3, y + 0.5, { direction: DIRECTION.DOWN })
            )
        } else if (i % 7 === 2) {
            returnArray.push(
                newItem(bpSettings.beltType, 3, y + 0.5, { direction: DIRECTION.DOWN })
            )
        } else if (i % 7 === 3) {
            returnArray.push(
                newItem(bpSettings.beltType, 3, y + 0.5, { direction: DIRECTION.RIGHT })
            )
        } else if (i % 7 === 4) {
            returnArray.push(
                newItem(bpSettings.beltType, 3, y + 0.5, { direction: DIRECTION.RIGHT })
            )
        } else if (i % 7 === 5) {
            returnArray.push(newItem(bpSettings.beltType, 3, y + 0.5, { direction: DIRECTION.UP }))
        } else if (i % 7 === 6) {
            returnArray.push(newItem(bpSettings.beltType, 3, y + 0.5, { direction: DIRECTION.UP }))
        }
    })
    return returnArray
}
const placeVerticalBelts = (
    bpSettings: typeof defaultSettings,
    splitters: Array<iBlueprintItem>
) => {
    let returnArray: iBlueprintItem[] = []
    let mode = bpSettings.stationType === "Loading Station" ? "load" : "unload"
    let beltEnd = bpSettings.beltFlowDirection
    sortByYPosition(splitters)
    let x = 5
    // Unloading to front, splitters[0] is the front splitter
    if (mode === "unload" && beltEnd === "Front") {
        splitters.forEach((splitter) => {
            for (let y = splitters[0].position.y; y <= splitter.position.y; y++) {
                returnArray.push(
                    newItem(bpSettings.beltType, x, y - 0.5, { direction: DIRECTION.UP })
                )
            }
            for (let i = splitter.position.x + 1; i < x; i++) {
                returnArray.push(
                    newItem(bpSettings.beltType, i, splitter.position.y - 0.5, {
                        direction: DIRECTION.RIGHT,
                    })
                )
            }
            x += 1
        })
    }
    // Unloading to back, splitters[0] is the back splitter
    if (mode === "unload" && beltEnd === "Back") {
        splitters.reverse()
        splitters.forEach((splitter) => {
            for (let y = splitters[0].position.y; y >= splitter.position.y; y--) {
                returnArray.push(
                    newItem(bpSettings.beltType, x, y + 0.5, { direction: DIRECTION.DOWN })
                )
            }
            for (let i = splitter.position.x + 1; i < x; i++) {
                returnArray.push(
                    newItem(bpSettings.beltType, i, splitter.position.y + 0.5, {
                        direction: DIRECTION.RIGHT,
                    })
                )
            }
            x += 1
        })
    }
    // Loading from front, splitters[0] is the front splitter
    if (mode === "load" && beltEnd === "Front") {
        splitters.forEach((splitter) => {
            for (let y = splitters[0].position.y; y < splitter.position.y; y++) {
                returnArray.push(
                    newItem(bpSettings.beltType, x, y - 0.5, { direction: DIRECTION.DOWN })
                )
            }
            for (let i = splitter.position.x + 1; i <= x; i++) {
                returnArray.push(
                    newItem(bpSettings.beltType, i, splitter.position.y - 0.5, {
                        direction: DIRECTION.LEFT,
                    })
                )
            }
            x += 1
        })
    }
    // Loading from back, splitters[0] is the back splitter
    if (mode === "load" && beltEnd === "Back") {
        splitters.reverse()
        splitters.forEach((splitter) => {
            for (let y = splitters[0].position.y; y > splitter.position.y; y--) {
                returnArray.push(
                    newItem(bpSettings.beltType, x, y + 0.5, { direction: DIRECTION.UP })
                )
            }
            for (let i = splitter.position.x + 1; i <= x; i++) {
                returnArray.push(
                    newItem(bpSettings.beltType, i, splitter.position.y + 0.5, {
                        direction: DIRECTION.LEFT,
                    })
                )
            }
            x += 1
        })
    }
    return returnArray
}
const placeSplitters = (bpSettings: typeof defaultSettings) => {
    let returnArray: iBlueprintItem[] = []
    let splitterType = splitterTypes[bpSettings.beltType]
    let splitterDirection =
        bpSettings.stationType === "Loading Station" ? DIRECTION.LEFT : DIRECTION.RIGHT
    getCargoArray(bpSettings).forEach((y, i) => {
        if (i % 7 !== 4) return
        returnArray.push(newItem(splitterType, 4, y, { direction: splitterDirection }))
    })
    return returnArray
}
const placePoles = (bpSettings: typeof defaultSettings) => {
    // Size is 1x1, so coordinate ends in 0.5
    let returnArray: iBlueprintItem[] = []
    getCargoArray(bpSettings).forEach((y, i) => {
        if (i % 7 !== 0) return
        returnArray.push(newItem("medium-electric-pole", 0, y + 0.5))
    })
    return returnArray
}
const placeLamps = (bpSettings: typeof defaultSettings) => {
    // Size is 1x1, so coordinate ends in 0.5
    let returnArray: iBlueprintItem[] = []
    getCargoArray(bpSettings).forEach((y, i) => {
        if (i % 7 !== 0) return
        returnArray.push(newItem("small-lamp", 1, y + 0.5))
    })
    return returnArray
}
const placeDecider = (bpSettings: typeof defaultSettings) => {
    let returnArray: iBlueprintItem[] = []
    returnArray.push(
        newItem("decider-combinator", 0, 0, {
            control_behavior: {
                decider_conditions: {
                    first_signal: {
                        type: "virtual",
                        name: "signal-anything",
                    },
                    constant: parseInt(bpSettings.enabledConditionAmount),
                    comparator: bpSettings.enabledConditionOperator,
                    output_signal: {
                        type: "virtual",
                        name: "signal-red",
                    },
                    copy_count_from_input: false,
                },
            },
        })
    )
    return returnArray
}
const placeTopRefuelPoles = (bpSettings: typeof defaultSettings) => {
    let returnArray: iBlueprintItem[] = []
    getFrontLocomotivesArray(bpSettings).forEach((y, i, array) => {
        if (i % 7 !== 0 || array.length === i - 1 || i === 0) return
        returnArray.push(newItem("medium-electric-pole", 0, y + 0.5))
    })
    return returnArray
}
const placeBottomRefuelPoles = (bpSettings: typeof defaultSettings) => {
    let returnArray: iBlueprintItem[] = []
    getBackLocomotivesArray(bpSettings).forEach((y, i, array) => {
        if (i % 7 !== 0 || array.length === i - 1 || i === 0) return
        returnArray.push(newItem("medium-electric-pole", 0, y + 0.5))
    })
    return returnArray
}
const placeRefuelChestsAndInserters = (bpSettings: typeof defaultSettings) => {
    // Size is 1x1, so coordinate ends in 0.5
    let returnArray: iBlueprintItem[] = []
    getFrontLocomotivesArray(bpSettings).forEach((y, i) => {
        if (i % 7 !== 6) return
        returnArray.push(newItem("inserter", 0, y + 0.5, { direction: DIRECTION.RIGHT }))
        returnArray.push(
            newItem("logistic-chest-requester", 1, y + 0.5, {
                request_filters: [
                    {
                        index: 1,
                        name: bpSettings.refillFuelType,
                        count: parseInt(bpSettings.refillFuelAmount),
                    },
                ],
            })
        )
    })
    getBackLocomotivesArray(bpSettings).forEach((y, i) => {
        if (i % 7 !== 1) return
        returnArray.push(newItem("inserter", 0, y + 0.5, { direction: DIRECTION.RIGHT }))
        returnArray.push(
            newItem("logistic-chest-requester", 1, y + 0.5, {
                request_filters: [
                    {
                        index: 1,
                        name: bpSettings.refillFuelType,
                        count: parseInt(bpSettings.refillFuelAmount),
                    },
                ],
            })
        )
    })
    return returnArray
}

const connectTwoEntitiesWithWire = (
    entity1: iBlueprintItem,
    entity2: iBlueprintItem,
    color: iWireColor,
    entity1ConNumber: "1" | "2" = "1",
    entity2ConNumber: "1" | "2" = "1"
) => {
    let entity1Number = entity1.entity_number
    let entity2Number = entity2.entity_number

    let createWirePath = (entity: iBlueprintItem, conNumber: "1" | "2") => {
        if (!entity.connections) {
            entity.connections = {}
        }
        if (!entity.connections[conNumber]) {
            entity.connections[conNumber] = {}
        }
        // @ts-ignore - no clue why this is still giving me a warning that it could be undefined
        if (!entity.connections[conNumber][color]) {
            // @ts-ignore
            entity.connections[conNumber][color] = []
        }
    }

    createWirePath(entity1, entity1ConNumber)
    createWirePath(entity2, entity2ConNumber)
    // @ts-ignore
    entity1.connections[entity1ConNumber][color].push({ entity_id: entity2Number })
    // @ts-ignore
    entity2.connections[entity2ConNumber][color].push({ entity_id: entity1Number })
}
const connectItemsWithWire = (items: iBlueprintItem[], color: iWireColor) => {
    items.forEach((item1, index) => {
        if (index === 0) return
        let item2 = items[index - 1]
        connectTwoEntitiesWithWire(item1, item2, color)
    })
}
const mirrorItemsHorizontal = (items: iBlueprintItem[]) => {
    // Returns a new array with clones of items
    return items.map((item) => {
        let copy = cloneDeep(item) as iBlueprintItem
        copy.entity_number = entityNumber
        entityNumber += 1
        copy.position.x = -copy.position.x + mirrorXOffset
        if (copy.direction === DIRECTION.LEFT) copy.direction = DIRECTION.RIGHT
        else if (copy.direction === DIRECTION.RIGHT) copy.direction = DIRECTION.LEFT
        return copy
    })
}
const changeItemsCoordinates = (items: iBlueprintItem[], x = 0, y = 0) => {
    // Changes the items directly
    items.forEach((item) => {
        item.position = {
            x: item.position.x + x,
            y: item.position.y + y,
        }
    })
}
const mixSides = (
    sidesUsed: "Both" | "Right" | "Left",
    leftArray: iBlueprintItem[],
    rightArray: iBlueprintItem[]
) => {
    if (sidesUsed === "Both") {
        return [...leftArray, ...rightArray]
    } else if (sidesUsed === "Left") {
        return leftArray
    } else if (sidesUsed === "Right") {
        return rightArray
    }
    console.assert("Error returning empty array")
    return []
}
const sortByYPosition = (items: iBlueprintItem[]) => {
    items.sort((a, b) => {
        // Smaller y first
        if (a.position.y < b.position.y) {
            return -1
        } else if (a.position.y > b.position.y) {
            return 1
        }
        // If equal, sort by x (right side first)
        if (a.position.x < b.position.x) {
            return 1
        } else if (a.position.x > b.position.x) {
            return -1
        }
        return 0
    })
}

import {
    iArithmeticCondition,
    iBlueprintItem,
    iBlueprintItemWithoutNumber,
    iCircuitConnection,
    iOptions,
    iTrainStopControlBehavior,
    iWireColor,
} from "../constants/interfaces"
import {
    allowedCharacters,
    botChestTypes,
    defaultSettings,
    DIRECTION,
    filterInserters,
    fluidStation,
    mirrorXOffset,
    requestChestTypes,
    splitterTypes,
} from "../constants/constants"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloneDeep = require("clone-deep")

export let entityNumber = 1
export let circuitNumber = 1
export const resetEntityNumber = (): void => {
    entityNumber = 1
    circuitNumber = 1
}

export const newItem = (
    itemName: string,
    x: number,
    y: number,
    options: iOptions = {}
): iBlueprintItem => {
    const item: iBlueprintItem = {
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
    if (options.trains_limit_signal) {
        item.trains_limit_signal = options.trains_limit_signal
    }
    entityNumber += 1
    return item
}
export const assignEntityNumberToItems = (
    items: iBlueprintItemWithoutNumber[],
    xOffset = 0,
    yOffset = 0
): iBlueprintItem[] => {
    return items.map((item) => {
        return newItem(item.name, item.position.x + xOffset, item.position.y + yOffset, {
            direction: item.direction,
        })
    })
}
// Get total train length but as array so I can loop over it
export const getTrainArray = (
    bpSettings: typeof defaultSettings,
    startOffset = 0,
    bottomOffset = 0
): number[] => {
    const returnArray: number[] = []
    const doubleHeaded = bpSettings.doubleHeaded ? 2 : 1
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
// Only front locomotives as array
export const getFrontLocomotivesArray = (
    bpSettings: typeof defaultSettings,
    startOffset = -3,
    bottomOffset = -3
): number[] => {
    const returnArray: number[] = []
    for (let i = startOffset; i < parseInt(bpSettings.locomotivesPerEnd) * 7 + bottomOffset; i++) {
        returnArray.push(i)
    }
    return returnArray
}
// Only back locomotives as array (or empty array if single headed)
export const getBackLocomotivesArray = (
    bpSettings: typeof defaultSettings,
    startOffset = -3,
    bottomOffset = -3
): number[] => {
    if (!bpSettings.doubleHeaded) return []
    const returnArray: number[] = []
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
// Returns an array of y-offsets where the cargo is
export const getCargoArray = (bpSettings: typeof defaultSettings, startOffset = -3): number[] => {
    const returnArray: number[] = []
    const bottomOffset = 1
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

export const placeTrainTracks = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    const returnArray: iBlueprintItem[] = []
    getTrainArray(bpSettings, -4).forEach((i) => {
        if (i % 2 === 1) return
        returnArray.push(newItem("straight-rail", -1.5, i))
    })
    return returnArray
}

export const placeSignals = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    // Size is 1x1, so coordinate ends in 0.5
    const returnArray: iBlueprintItem[] = []
    const start = 0
    const doubleHeaded = bpSettings.doubleHeaded ? 2 : 1
    const singleHeadedOffset = bpSettings.doubleHeaded ? 0 : 1
    const end =
        (doubleHeaded * parseInt(bpSettings.locomotivesPerEnd) + parseInt(bpSettings.cargoWagon)) *
            7 +
        singleHeadedOffset
    // Stacker
    if (bpSettings.stationType === "Stacker") {
        returnArray.push(
            newItem("rail-chain-signal", 0, start - 3.5, { direction: DIRECTION.DOWN })
        )
        returnArray.push(newItem("rail-signal", 0, end - 2.5, { direction: DIRECTION.DOWN }))
    }
    // Normal station
    else {
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

export const placeTrainStop = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    // Size is 2x2, so coordinate ends in .0
    const returnArray: iBlueprintItem[] = []
    const options: iOptions = {
        station: bpSettings.stationName !== "" ? bpSettings.stationName : undefined,
    }
    const controlBehavior: iTrainStopControlBehavior = {}
    if (bpSettings.trainStopUsesEnabledCondition) {
        controlBehavior.circuit_enable_disable = true
        controlBehavior.circuit_condition = {
            first_signal: {
                type: "virtual",
                name: "signal-red",
            },
            constant: 0,
            comparator: ">",
        }
    }
    if (bpSettings.trainLimit === "Dynamic") {
        controlBehavior.set_trains_limit = bpSettings.trainLimit === "Dynamic"
        controlBehavior.trains_limit_signal = {
            type: "virtual",
            name: "signal-L",
        }
    } else {
        options.manual_trains_limit = parseInt(bpSettings.trainLimit)
    }
    options.control_behavior = controlBehavior
    returnArray.push(newItem("train-stop", 0.5, -2, options))
    return returnArray
}

export const placeTrain = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    const returnArray: iBlueprintItem[] = []
    let count = 0
    const doubleHeaded = bpSettings.doubleHeaded ? 2 : 1
    const locoCount = parseInt(bpSettings.locomotivesPerEnd)
    const cargoCount = parseInt(bpSettings.cargoWagon)
    parseInt(bpSettings.cargoWagon)
    getTrainArray(bpSettings).forEach((y, i) => {
        if (i % 7 !== 0) return
        if (count < locoCount) {
            returnArray.push(newItem("locomotive", -1.5, y + 1))
        } else if (count < locoCount + cargoCount) {
            if (!fluidStation.includes(bpSettings.stationType))
                returnArray.push(newItem("cargo-wagon", -1.5, y + 1))
            else returnArray.push(newItem("fluid-wagon", -1.5, y + 1))
        } else if (count < locoCount * doubleHeaded + cargoCount) {
            returnArray.push(newItem("locomotive", -1.5, y + 1, { orientation: 0.5 }))
        }
        count += 1
    })
    return returnArray
}

export const placeInserters = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    // Size is 1x1, so coordinate ends in 0.5
    // Inserter direction = direction it grabs from
    const returnArray: iBlueprintItem[] = []
    const inserterType = bpSettings.enableFilterInserters
        ? filterInserters[bpSettings.inserterType]
        : bpSettings.inserterType
    const inserterDirection =
        bpSettings.stationType === "Loading Station" ? DIRECTION.RIGHT : DIRECTION.LEFT
    let filterArray:
        | undefined
        | Array<{
              index: number
              name: string
          }>
    if (bpSettings.enableFilterInserters) {
        filterArray = []
        for (let i = 0; i < 5; i++) {
            if (bpSettings.filterFields[i] === "") break
            filterArray.push({
                index: i + 1,
                name: bpSettings.filterFields[i],
            })
        }
    }
    getCargoArray(bpSettings).forEach((y, i) => {
        if (i % 7 === 0) return
        returnArray.push(
            newItem(inserterType, 0, y + 0.5, {
                direction: inserterDirection,
                filters: filterArray,
            })
        )

        if (!botChestTypes.includes(bpSettings.chestType)) {
            returnArray.push(
                newItem(inserterType, 2, y + 0.5, {
                    direction: inserterDirection,
                    filters: filterArray,
                })
            )
        }
    })
    return returnArray
}
export const placeChests = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    // Size is 1x1, so coordinate ends in 0.5
    const returnArray: iBlueprintItem[] = []

    // For requester and buffer chests, add the requests
    const isRequesterChest = requestChestTypes.includes(bpSettings.chestType)
    const requests: Array<{
        index: number
        name: string
        count: number
    }> = []
    if (isRequesterChest) {
        for (let i = 0; i < 12; i++) {
            const itemType = bpSettings.chestRequestItemsType[i]
            if (itemType === "") break
            const itemAmount = bpSettings.chestRequestItemsAmount[i]
            requests.push({
                index: i + 1,
                name: itemType,
                count: parseInt(itemAmount),
            })
        }
    }

    const requestFromBuffers =
        bpSettings.chestRequestFromBuffers && bpSettings.chestType === "logistic-chest-requester"
            ? true
            : undefined
    getCargoArray(bpSettings).forEach((y, i) => {
        if (i % 7 === 0) return
        returnArray.push(
            newItem(bpSettings.chestType, 1, y + 0.5, {
                bar: parseInt(bpSettings.chestLimit),
                request_filters: requests.length === 0 ? undefined : requests,
                request_from_buffers: requestFromBuffers,
            })
        )
    })
    return returnArray
}
// Belts between inserter and splitter
export const placeLoadingBelts = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    // Size is 1x1, so coordinate ends in 0.5
    const returnArray: iBlueprintItem[] = []
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
export const placeUnloadingBelts = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    // Size is 1x1, so coordinate ends in 0.5
    const returnArray: iBlueprintItem[] = []
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
export const placePumps = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    const returnArray: iBlueprintItem[] = []
    const pumpDirection =
        bpSettings.stationType === "Fluid Loading Station" ? DIRECTION.LEFT : DIRECTION.RIGHT
    getCargoArray(bpSettings).forEach((y, i) => {
        if (i % 7 === 1) {
            returnArray.push(newItem("pump", 0.5, y + 0.5, { direction: pumpDirection }))
        }
        if (i % 7 === 6) {
            returnArray.push(newItem("pump", 0.5, y + 0.5, { direction: pumpDirection }))
        }
    })
    return returnArray
}
export const placeStorageTanks = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    // Size is 3x3, so coordinate ends in 0.5
    // Storage tank facing UP has connection topleft and bottomright
    // Storage tank facing RIGHT has connection topright and bottomleft
    const returnArray: iBlueprintItem[] = []
    getCargoArray(bpSettings).forEach((y, i) => {
        if (i % 7 === 2) {
            for (
                let xOffset = 0;
                xOffset < parseInt(bpSettings.pumpStorageTankColumns);
                xOffset++
            ) {
                const tankDirection = xOffset % 2 === 0 ? DIRECTION.UP : DIRECTION.RIGHT
                returnArray.push(
                    newItem("storage-tank", (1 + xOffset) * 3, y + 0.5, {
                        direction: tankDirection,
                    })
                )
            }
        }
        if (i % 7 === 5) {
            for (
                let xOffset = 0;
                xOffset < parseInt(bpSettings.pumpStorageTankColumns);
                xOffset++
            ) {
                const tankDirection = xOffset % 2 === 0 ? DIRECTION.RIGHT : DIRECTION.UP
                returnArray.push(
                    newItem("storage-tank", (1 + xOffset) * 3, y + 0.5, {
                        direction: tankDirection,
                    })
                )
            }
        }
    })
    return returnArray
}
export const placePipes = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    // Size is 1x1, so coordinate ends in 0.5
    const returnArray: iBlueprintItem[] = []
    getCargoArray(bpSettings).forEach((y, i, array) => {
        if (i !== 0 && i !== array.length - 1 && i % 7 === 0) {
            for (let j = 0; j < parseInt(bpSettings.pumpStorageTankColumns); j++) {
                const xOffset = j % 2 === 0 ? Math.floor(j / 2) * 6 : Math.floor(j / 2) * 6 + 5
                returnArray.push(newItem("pipe", 2 + xOffset, y + 0.5))
            }
        }
    })
    return returnArray
}
// Belts that go from splitter to front/back
export const placeVerticalBelts = (
    bpSettings: typeof defaultSettings,
    splitters: Array<iBlueprintItem>
): iBlueprintItem[] => {
    const returnArray: iBlueprintItem[] = []
    const mode = bpSettings.stationType === "Loading Station" ? "load" : "unload"
    const beltEnd = bpSettings.beltFlowDirection
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
export const placeSplitters = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    const returnArray: iBlueprintItem[] = []
    const splitterType = splitterTypes[bpSettings.beltType]
    const splitterDirection =
        bpSettings.stationType === "Loading Station" ? DIRECTION.LEFT : DIRECTION.RIGHT
    getCargoArray(bpSettings).forEach((y, i) => {
        if (i % 7 !== 4) return
        returnArray.push(newItem(splitterType, 4, y, { direction: splitterDirection }))
    })
    return returnArray
}
export const placePoles = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    // Size is 1x1, so coordinate ends in 0.5
    const returnArray: iBlueprintItem[] = []
    getCargoArray(bpSettings).forEach((y, i) => {
        if (i % 7 !== 0) return
        returnArray.push(newItem("medium-electric-pole", 0, y + 0.5))
    })
    return returnArray
}
export const placeLamps = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    // Size is 1x1, so coordinate ends in 0.5
    const returnArray: iBlueprintItem[] = []
    getCargoArray(bpSettings).forEach((y, i) => {
        if (i % 7 !== 0) return
        returnArray.push(newItem("small-lamp", 1, y + 0.5))
    })
    // TODO Fix lamps for refill inserters/chests?
    // if (
    //     bpSettings.refillEnabled ||
    //     bpSettings.trainStopUsesEnabledCondition ||
    //     (bpSettings.trainLimit === "Dynamic" && normalStation.includes(bpSettings.stationType))
    // ) {
    //     getFrontLocomotivesArray(bpSettings).forEach((y, i, array) => {
    //         if (i % 7 !== 0 || array.length === i - 1 || i === 0) return
    //         returnArray.push(newItem("small-lamp", 1, y + 0.5))
    //     })
    // }
    // if (bpSettings.refillEnabled) {
    //     getBackLocomotivesArray(bpSettings).forEach((y, i, array) => {
    //         if (i % 7 !== 0 || array.length === i - 1 || i === 0) return
    //         returnArray.push(newItem("small-lamp", 1, y + 0.5))
    //     })
    // }
    return returnArray
}
// Decider for enabled-condition
export const placeEnabledConditionDecider = (
    bpSettings: typeof defaultSettings,
    topPole: iBlueprintItem,
    trainStop: iBlueprintItem
): iBlueprintItem[] => {
    const decider = newItem("decider-combinator", 0, 1, {
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
    // Combine decider output with trainstop with green wire
    connectTwoEntitiesWithWire(decider, trainStop, "green", "2", "1")
    // Combine decider input with pole with green wire
    connectTwoEntitiesWithWire(decider, topPole, "green")
    return [decider]
}
// Combinators for set train limit dynamically
export const placeDynamicTrainLimitCombinators = (
    bpSettings: typeof defaultSettings,
    topPole: iBlueprintItem,
    trainStop: iBlueprintItem
): iBlueprintItem[] => {
    const arithmeticXOffset = bpSettings.placeLampsNearPoles ? 1 : 0
    // Set settings of the first arithmetic combinator
    const arithmetic1Condition: iArithmeticCondition = {
        operation: bpSettings.trainLimitArithmetic1Operator,
        output_signal: {
            type: "virtual",
            name: "signal-L",
        },
    }
    if (
        bpSettings.trainLimitArithmetic1Constant1 === "each" ||
        allowedCharacters.includes(bpSettings.trainLimitArithmetic1Constant1)
    )
        arithmetic1Condition["first_signal"] = {
            type: "virtual",
            name:
                bpSettings.trainLimitArithmetic1Constant1 === "each"
                    ? "signal-each"
                    : `signal-${bpSettings.trainLimitArithmetic1Constant1}`,
        }
    else
        arithmetic1Condition["first_constant"] = parseInt(bpSettings.trainLimitArithmetic1Constant1)
    if (
        bpSettings.trainLimitArithmetic1Constant2 === "each" ||
        allowedCharacters.includes(bpSettings.trainLimitArithmetic1Constant2)
    )
        arithmetic1Condition["second_signal"] = {
            type: "virtual",
            name:
                bpSettings.trainLimitArithmetic1Constant2 === "each"
                    ? "signal-each"
                    : `signal-${bpSettings.trainLimitArithmetic1Constant2}`,
        }
    else
        arithmetic1Condition["second_constant"] = parseInt(
            bpSettings.trainLimitArithmetic1Constant2
        )
    const arithmetic1 = newItem("arithmetic-combinator", 1 + arithmeticXOffset, 4, {
        control_behavior: {
            arithmetic_conditions: arithmetic1Condition,
        },
    })
    ////////////////////////////////////////////////////////
    // Set settings of the second arithmetic combinator
    const arithmetic2Condition: iArithmeticCondition = {
        operation: bpSettings.trainLimitArithmetic2Operator,
        output_signal: {
            type: "virtual",
            name: "signal-L",
        },
    }
    if (
        bpSettings.trainLimitArithmetic2Constant1 === "each" ||
        allowedCharacters.includes(bpSettings.trainLimitArithmetic2Constant1)
    )
        arithmetic2Condition["first_signal"] = {
            type: "virtual",
            name:
                bpSettings.trainLimitArithmetic2Constant1 === "each"
                    ? "signal-each"
                    : `signal-${bpSettings.trainLimitArithmetic2Constant1}`,
        }
    else
        arithmetic2Condition["first_constant"] = parseInt(bpSettings.trainLimitArithmetic2Constant1)
    if (
        bpSettings.trainLimitArithmetic2Constant2 === "each" ||
        allowedCharacters.includes(bpSettings.trainLimitArithmetic2Constant2)
    )
        arithmetic2Condition["second_signal"] = {
            type: "virtual",
            name:
                bpSettings.trainLimitArithmetic2Constant2 === "each"
                    ? "signal-each"
                    : `signal-${bpSettings.trainLimitArithmetic2Constant2}`,
        }
    else
        arithmetic2Condition["second_constant"] = parseInt(
            bpSettings.trainLimitArithmetic2Constant2
        )
    const arithmetic2 = newItem("arithmetic-combinator", 2 + arithmeticXOffset, 4, {
        control_behavior: {
            arithmetic_conditions: arithmetic2Condition,
        },
    })
    // arithmentic gets: "2"(output) green connection with circuit number 1 to decider which gets "1"(input) green connection with circuit number 2
    connectTwoEntitiesWithWire(arithmetic2, trainStop, "green", "2", "1", 1, 2)
    connectTwoEntitiesWithWire(arithmetic1, arithmetic2, "green", "2", "1", 1, 2)
    // Combine decider input with pole with green wire
    connectTwoEntitiesWithWire(arithmetic1, topPole, "green")
    return [arithmetic1, arithmetic2]
}
// Refuel
export const placeTopRefuelPoles = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    const returnArray: iBlueprintItem[] = []
    getFrontLocomotivesArray(bpSettings).forEach((y, i, array) => {
        if (i % 7 !== 0 || array.length === i - 1 || i === 0) return
        returnArray.push(newItem("medium-electric-pole", 0, y + 0.5))
    })
    return returnArray
}
export const placeBottomRefuelPoles = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    const returnArray: iBlueprintItem[] = []
    getBackLocomotivesArray(bpSettings).forEach((y, i, array) => {
        if (i % 7 !== 0 || array.length === i - 1 || i === 0) return
        returnArray.push(newItem("medium-electric-pole", 0, y + 0.5))
    })
    return returnArray
}
export const placeRefuelChestsAndInserters = (
    bpSettings: typeof defaultSettings
): iBlueprintItem[] => {
    // Size is 1x1, so coordinate ends in 0.5
    const returnArray: iBlueprintItem[] = []
    getFrontLocomotivesArray(bpSettings).forEach((y, i) => {
        if (i % 7 !== 5) return
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
        if (i % 7 !== 2) return
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
// Wire functions
export const connectTwoEntitiesWithWire = (
    entity1: iBlueprintItem,
    entity2: iBlueprintItem,
    color: iWireColor,
    entity1ConNumber: "1" | "2" = "1",
    entity2ConNumber: "1" | "2" = "1",
    circuit1Number: 1 | 2 | undefined = undefined,
    circuit2Number: 1 | 2 | undefined = undefined
): void => {
    const entity1Number = entity1.entity_number
    const entity2Number = entity2.entity_number

    const createWirePath = (entity: iBlueprintItem, conNumber: "1" | "2") => {
        if (!entity.connections) {
            entity.connections = {}
        }
        if (!entity.connections[conNumber]) {
            entity.connections[conNumber] = {}
        }
        const entityColor = entity.connections[conNumber] as {
            red?: iCircuitConnection[]
            green?: iCircuitConnection[]
        }
        if (!entityColor[color]) {
            entityColor[color] = []
        }
        // Or in short but typescript doesnt let me:
        // if (!entity.connections[conNumber][color]) {
        //     entity.connections[conNumber][color] = []
        // }
    }

    createWirePath(entity1, entity1ConNumber)
    createWirePath(entity2, entity2ConNumber)

    const conn1: iCircuitConnection = {
        entity_id: entity2Number,
    }
    const conn2: iCircuitConnection = {
        entity_id: entity1Number,
    }
    // Add circuit_id if both items are of type combinator (decider, arithmetic etc)
    if (circuit1Number) {
        conn1.circuit_id = circuit1Number
    }
    if (circuit2Number) {
        conn2.circuit_id = circuit2Number
    }
    // Let me know if you come up with a readable solution for this:
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    entity1.connections[entity1ConNumber][color].push(conn1)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    entity2.connections[entity2ConNumber][color].push(conn2)
}
export const connectItemsWithWire = (items: iBlueprintItem[], color: iWireColor): void => {
    items.forEach((item1, index) => {
        if (index === 0) return
        const item2 = items[index - 1]
        connectTwoEntitiesWithWire(item1, item2, color)
    })
}
// Helper functions
export const mirrorItemsHorizontal = (items: iBlueprintItem[]): iBlueprintItem[] => {
    // Returns a new array with clones of items
    return items.map((item) => {
        const copy = cloneDeep(item) as iBlueprintItem
        copy.entity_number = entityNumber
        entityNumber += 1
        copy.position.x = -copy.position.x + mirrorXOffset
        if (copy.name === "storage-tank") {
            if (!copy.direction) copy.direction = 2
            else copy.direction = undefined
        } else {
            if (copy.direction === DIRECTION.LEFT) copy.direction = DIRECTION.RIGHT
            else if (copy.direction === DIRECTION.RIGHT) copy.direction = DIRECTION.LEFT
        }
        return copy
    })
}
export const changeItemsCoordinates = (items: iBlueprintItem[], x = 0, y = 0): void => {
    // Changes the items directly
    items.forEach((item) => {
        item.position = {
            x: item.position.x + x,
            y: item.position.y + y,
        }
    })
}
export const copyPasteItems = (items: iBlueprintItem[], x = 0, y = 0): iBlueprintItem[] => {
    // Changes the items directly
    return items.map((item) => {
        const clone: iBlueprintItem = cloneDeep(item)
        clone.entity_number = entityNumber
        entityNumber += 1
        clone.position = {
            x: clone.position.x + x,
            y: clone.position.y + y,
        }
        return clone
    })
}
export const mixSides = (
    sidesUsed: "Both" | "Right" | "Left",
    leftArray: iBlueprintItem[],
    rightArray: iBlueprintItem[]
): iBlueprintItem[] => {
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
export const sortByYPosition = (items: iBlueprintItem[]): void => {
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
export const sortStorageTanks = (items: iBlueprintItem[], rowCount = 0): iBlueprintItem[] => {
    if (items.length === 0) {
        return []
    }
    sortByYPosition(items)
    let returnArray: iBlueprintItem[] = []
    let y = items[0].position.y
    let rowItems: iBlueprintItem[] = []
    items.forEach((item, i) => {
        if (item.position.y !== y) {
            y = item.position.y
            if (rowCount % 2 == 0) {
                rowItems.reverse()
            }
            rowCount += 1
            returnArray = [...returnArray, ...rowItems]
            rowItems = []
        }
        rowItems.push(item)
    })
    rowItems.reverse()
    returnArray = [...returnArray, ...rowItems]

    return returnArray
}

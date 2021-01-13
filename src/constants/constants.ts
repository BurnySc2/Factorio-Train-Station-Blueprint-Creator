import {
    iBeltSides,
    iBeltTypes,
    iChestTypes,
    iEnabledConditionOperators,
    iInserterTypes,
    iPumpSides,
    iRefillFuelTypes,
} from "./interfaces"

export const mirrorXOffset = -3

export const stationTypes = [
    "Loading Station",
    "Unloading Station",
    "Fluid Loading Station",
    "Fluid Unloading Station",
    "Stacker",
]

export const inserterTypes: iInserterTypes[] = ["inserter", "fast-inserter", "stack-inserter"]
export const filterInserters = {
    inserter: "filter-inserter",
    "fast-inserter": "filter-inserter",
    "stack-inserter": "filter-inserter",
}
export const basicChestTypes: iChestTypes[] = ["wooden-chest", "iron-chest", "steel-chest"]
export const botChestTypes: iChestTypes[] = [
    "logistic-chest-requester",
    "logistic-chest-buffer",
    "logistic-chest-passive-provider",
    "logistic-chest-active-provider",
    "logistic-chest-storage",
]
export const chestTypes: iChestTypes[] = [...basicChestTypes, ...botChestTypes]
export const chestTypesHuman = {
    "wooden-chest": "Wooden Chest",
    "iron-chest": "Iron Chest",
    "steel-chest": "Steel Chest",
    "logistic-chest-requester": "Requester Chest",
    "logistic-chest-buffer": "Buffer Chest",
    "logistic-chest-passive-provider": "Passive Provider Chest",
    "logistic-chest-active-provider": "Active Provider Chest",
    "logistic-chest-storage": "Storage Chest",
}
export const beltTypes: iBeltTypes[] = [
    "transport-belt",
    "fast-transport-belt",
    "express-transport-belt",
]
export const beltTypesHuman = {
    "transport-belt": "Yellow Belt",
    "fast-transport-belt": "Red Belt",
    "express-transport-belt": "Blue Belt",
}
export const splitterTypes = {
    "transport-belt": "splitter",
    "fast-transport-belt": "fast-splitter",
    "express-transport-belt": "express-splitter",
}
export const beltSides: iBeltSides[] = ["Both", "Right", "Left"]
export const pumpSides: iPumpSides[] = ["Right", "Left"]
export const beltFlowDirections = ["Front", "Back", "None"]
export const refillFuelTypes: iRefillFuelTypes[] = [
    "wood",
    "coal",
    "solid-fuel",
    "rocket-fuel",
    "nuclear-fuel",
]
export const refillFuelTypesHuman = {
    wood: "Wood",
    coal: "Coal",
    "solid-fuel": "Solid Fuel",
    "rocket-fuel": "Rocket Fuel",
    "nuclear-fuel": "Nuclear Fuel",
}

export const stackerDiagonalTypes = ["Left-Right", "Right-Left"]
export const stackerTypes = ["Left-Left", "Right-Right", ...stackerDiagonalTypes]

export enum DIRECTION {
    UP = 0,
    RIGHT = 2,
    DOWN = 4,
    LEFT = 6,
}

export const enabledConditionOperators: iEnabledConditionOperators[] = [">", "<"]
export const enabledConditionOperatorsHuman = { ">": "> (more than)", "<": "< (less than)" }

export const defaultSettings = {
    // Global tooltip text
    tooltipText: "",

    // Station type
    stationType: [...stationTypes][0],
    stationName: "",
    trainLimit: "",

    // Sequential Station
    sequentialStation: false,
    sequentialStationsAmount: "3",
    sequantialStationBeltsGoAllTheWay: true,

    // Train type
    doubleHeaded: true,
    locomotivesPerEnd: "1",
    cargoWagon: "2",
    includeTrainInBlueprint: true,

    // Pump Settings
    pumpSidesToBeUsed: [...pumpSides][0],
    pumpConnectWithPipe: true,

    // Inserter types
    inserterType: [...inserterTypes][0],
    enableFilterInserters: false,
    // Items that need to be filtered, max array length: 5
    filterFields: Array(5).fill(""),

    // Chest types and settings
    chestType: [...chestTypes][1],
    // How many slots in the chest are enabled
    chestLimit: "7",
    // For requester and buffer chests
    chestRequestFromBuffers: true,
    chestRequestItemsType: Array(12).fill(""),
    chestRequestItemsAmount: Array(12).fill(""),

    // Belt settings
    beltType: [...beltTypes][1],
    beltSidesUsed: [...beltSides][0],
    beltFlowDirection: [...beltFlowDirections][0],

    // Refill at station?
    refillEnabled: true,
    refillFuelType: [...refillFuelTypes][2],
    refillFuelAmount: "20",

    // Wire settings
    connectChestsWithGreenWire: false,
    connectBothSideWithGreenWire: false,
    connectChestsWithRedWire: false,
    connectBothSideWithRedWire: false,

    // Enabled condition:
    trainStopUsesEnabledCondition: false,
    enabledConditionOperator: [...enabledConditionOperators][0],
    enabledConditionAmount: "4000",

    // Lights
    placeLampsNearPoles: false,

    // Stacker settings
    stackerNumberParallelLanes: "3",
    diagonalStacker: true,
    stackerType: [...stackerTypes][0],
}

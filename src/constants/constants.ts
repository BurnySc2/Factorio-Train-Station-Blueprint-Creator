export const mirrorXOffset = -3

export let stationTypes = [
    "Loading Station",
    "Unloading Station",
    "Fluid Loading Station",
    "Fluid Unloading Station",
    "Stacker",
] as const

export let inserterTypes = ["inserter", "fast-inserter", "stack-inserter"] as const
export let filterInserters = {
    inserter: "filter-inserter",
    "fast-inserter": "filter-inserter",
    "stack-inserter": "filter-inserter",
} as const
export let basicChestTypes = ["wooden-chest", "iron-chest", "steel-chest"] as const
export let botChestTypes = [
    "logistic-chest-requester",
    "logistic-chest-buffer",
    "logistic-chest-passive-provider",
    "logistic-chest-active-provider",
    "logistic-chest-storage",
] as const
export let chestTypes = [...basicChestTypes, ...botChestTypes] as const
export let chestTypesHuman = {
    "wooden-chest": "Wooden Chest",
    "iron-chest": "Iron Chest",
    "steel-chest": "Steel Chest",
    "logistic-chest-requester": "Requester Chest",
    "logistic-chest-buffer": "Buffer Chest",
    "logistic-chest-passive-provider": "Passive Provider Chest",
    "logistic-chest-active-provider": "Active Provider Chest",
    "logistic-chest-storage": "Storage Chest",
} as const
export const beltTypes = [
    "transport-belt",
    "fast-transport-belt",
    "express-transport-belt",
] as const
export let beltTypesHuman = {
    "transport-belt": "Yellow Belt",
    "fast-transport-belt": "Red Belt",
    "express-transport-belt": "Blue Belt",
} as const
export let splitterTypes = {
    "transport-belt": "splitter",
    "fast-transport-belt": "fast-splitter",
    "express-transport-belt": "express-splitter",
} as const
export let beltSides = ["Both", "Right", "Left"] as const
export let pumpSides = ["Right", "Left"] as const
export let beltFlowDirections = ["Front", "Back", "None"] as const
export let refillFuelTypes = ["wood", "coal", "solid-fuel", "rocket-fuel", "nuclear-fuel"] as const
export let refillFuelTypesHuman = {
    wood: "Wood",
    coal: "Coal",
    "solid-fuel": "Solid Fuel",
    "rocket-fuel": "Rocket Fuel",
    "nuclear-fuel": "Nuclear Fuel",
} as const

export let stackerDiagonalTypes = ["Left-Right", "Right-Left"] as const
export let stackerTypes = ["Left-Left", "Right-Right", ...stackerDiagonalTypes] as const

export enum DIRECTION {
    UP = 0,
    RIGHT = 2,
    DOWN = 4,
    LEFT = 6,
}

export let enabledConditionOperators = [">", "<"] as const
export let enabledConditionOperatorsHuman = { ">": "> (more than)", "<": "< (less than)" } as const

export let defaultSettings = {
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
    beltsEnabled: true,
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

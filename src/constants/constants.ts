export let stationTypes = [
    "Loading Station",
    "Unloading Station",
    "Fluid Loading Station",
    "Fluid Unloading Station",
    "Stacker",
]

export let inserterTypes = ["Inserter", "Fast Inserter", "Stack Inserter"]
export let basicChestTypes = ["Wooden Chest", "Iron Chest", "Steel Chest"]
export let botChestTypes = [
    "Requester Chest",
    "Buffer Chest",
    "Passive Provider Chest",
    "Active Provider Chest",
    "Storage Chest",
]
export let chestTypes = [...basicChestTypes, ...botChestTypes]
export let beltTypes = ["Yellow Belt", "Red Belt", "Blue Belt"]
export let beltSides = ["Both", "Right", "Left"]
export let beltFlowDirections = ["Front", "Back", "None"]
export let refillFuelTypes = ["Raw Wood", "Coal", "Solid Fuel", "Rocket Fuel", "Nuclear Fuel"]

export let enabledConditionOperators = ["> (more than)", "< (less than)"]

let filterFields: string[] = []

export let defaultSettings = {
    // Station type
    stationType: stationTypes[0],
    stationName: "",
    sequentialStation: false,

    // Train type
    doubleHeaded: true,
    locomotivesPerEnd: "1",
    cargoWagon: "2",

    // Inserter types
    inserterType: inserterTypes[0],
    enableFilterInserters: false,
    // Items that need to be filtered, max array length: 5
    filterFields: [...filterFields],

    // Chest types and settings
    chestType: chestTypes[1],
    // How many slots in the chest are enabled
    chestLimit: "7",

    // Belt settings
    beltsEnabled: true,
    beltType: beltTypes[1],
    beltSidesUsed: beltSides[0],
    beltFlowDirection: beltFlowDirections[0],

    // Refill at station?
    refillEnabled: true,
    refillFuelType: refillFuelTypes[2],
    refillFuelAmount: "20",

    // Wire settings
    connectChestsWithGreenWire: false,
    connectBothSideWithGreenWire: false,
    connectChestsWithRedWire: false,
    connectBothSideWithRedWire: false,

    // Enabled condition:
    trainStopUsesEnabledCondition: false,
    enabledConditionOperator: enabledConditionOperators[0],
    enabledConditionAmount: "4000",

    // Lights
    placeLampsNearPoles: false,

    // Stacker settings
    stackerNumberParallelLanes: "3",
    diagonalStacker: true,
    leftRightStacker: false,
}

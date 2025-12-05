import type {
	iBeltSides,
	iBeltTypes,
	iChestTypes,
	iEnabledConditionOperators,
	iInserterTypes,
	iPumpSides,
	iRefillFuelTypes,
} from "./interfaces"

export const mirrorXOffset = -3

export const websiteUrl = "https://burnysc2.github.io/Factorio-Train-Station-Blueprint-Creator"

export type iStationType =
	| "Loading Station"
	| "Unloading Station"
	| "Fluid Loading Station"
	| "Fluid Unloading Station"
	| "Stacker"
export const stationTypes: iStationType[] = [
	"Loading Station",
	"Unloading Station",
	"Fluid Loading Station",
	"Fluid Unloading Station",
	"Stacker",
]
export const normalStation: iStationType[] = ["Loading Station", "Unloading Station"]
export const fluidStation: iStationType[] = ["Fluid Loading Station", "Fluid Unloading Station"]
export const trainLimit = ["Disabled", "Dynamic", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

export const inserterTypes: iInserterTypes[] = ["inserter", "fast-inserter", "stack-inserter"]
export const inserterTypesHuman = {
	inserter: "Inserter",
	"fast-inserter": "Fast Inserter",
	"stack-inserter": "Stack Inserter",
}
export const filterInserters = {
	inserter: "filter-inserter",
	"fast-inserter": "filter-inserter",
	"stack-inserter": "filter-inserter",
}
export const inserterStackSize = {
	inserter: 3,
	"fast-inserter": 3,
	"stack-inserter": 12,
}
export const basicChestTypes: iChestTypes[] = ["wooden-chest", "iron-chest", "steel-chest"]
export const botChestTypes: iChestTypes[] = [
	"requester-chest",
	"buffer-chest",
	"passive-provider-chest",
	"active-provider-chest",
	"storage-chest",
]
export const chestTypes: iChestTypes[] = [...basicChestTypes, ...botChestTypes]
export const requestChestTypes: iChestTypes[] = ["requester-chest", "buffer-chest"]
export const chestTypesHuman = {
	"wooden-chest": "Wooden Chest",
	"iron-chest": "Iron Chest",
	"steel-chest": "Steel Chest",
	"requester-chest": "Requester Chest",
	"buffer-chest": "Buffer Chest",
	"passive-provider-chest": "Passive Provider Chest",
	"active-provider-chest": "Active Provider Chest",
	"storage-chest": "Storage Chest",
}
export const beltTypes: iBeltTypes[] = ["transport-belt", "fast-transport-belt", "express-transport-belt"]
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
export const refillFuelTypes: iRefillFuelTypes[] = ["wood", "coal", "solid-fuel", "rocket-fuel", "nuclear-fuel"]
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

export type iCombinator = "arithmetic-combinator" | "decider-combinator"
export const combinatorTypes: iCombinator[] = ["arithmetic-combinator", "decider-combinator"]
export type iOperator = "+" | "-" | "*" | "/" | "^" | "%" | "<<" | ">>" | "AND" | "OR" | "XOR"
export const operatorTypes: iOperator[] = ["+", "-", "*", "/", "^", "%", "<<", ">>", "AND", "OR", "XOR"]
export const allowedCharacters = [
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
]

export const defaultSettings = {
	// Global tooltip text
	tooltipText: "",

	// Station type
	stationType: [...stationTypes][0],
	stationName: "",

	// Train limit and combinator settings
	trainLimit: trainLimit[1],

	trainLimitArithmetic1Constant1: "each",
	trainLimitArithmetic1Constant2: "333",
	trainLimitArithmetic1Operator: "/",

	trainLimitArithmetic2Constant1: "L",
	trainLimitArithmetic2Constant2: "0",
	trainLimitArithmetic2Operator: "+",

	trainLimitToAtMostOneTrain: true,
	trainLimitStackSize: 50,

	// Train type
	doubleHeaded: true,
	locomotivesPerEnd: "1",
	cargoWagon: "2",
	includeTrainInBlueprint: true,

	// Pump Settings
	pumpSidesToBeUsed: [...pumpSides][0],
	pumpConnectWithPipe: true,
	pumpStorageTankColumns: "1",

	// Inserter types
	inserterType: [...inserterTypes][1],
	enableFilterInserters: false,
	// Items that need to be filtered, max array length: 5
	filterFields: Array(5).fill(""),

	// Chest types and settings
	chestType: [...chestTypes][1],
	// How many slots in the chest are enabled
	chestLimit: "",
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
	connectChestsWithGreenWire: true,
	connectBothSideWithGreenWire: true,
	connectChestsWithRedWire: false,
	connectBothSideWithRedWire: false,
	madzuriEvenLoadUnload: true,

	// Enabled condition:
	trainStopUsesEnabledCondition: false,
	enabledConditionOperator: [...enabledConditionOperators][0],
	enabledConditionAmount: "4000",

	// Lights
	placeLampsNearPoles: false,

	// Stacker settings
	stackerNumberParallelLanes: "3",
	diagonalStacker: true,
	stackerType: [...stackerDiagonalTypes][0],
}

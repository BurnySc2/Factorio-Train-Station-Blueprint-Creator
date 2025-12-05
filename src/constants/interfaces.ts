import type { defaultSettings } from "./constants"

export interface iSectionsProps {
	userSettings: typeof defaultSettings
	setUserSettings: (newSettings: typeof defaultSettings) => void
}

export type iBlueprint = iBlueprintItem[]
export type iWireColor = "green" | "red"

export type iCircuitConnection = { entity_id: number; circuit_id?: number }

export interface iBlueprintItemWithoutNumber {
	name: string
	position: {
		x: number
		y: number
	}
	direction?: number
}

export type iOptions = {
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
	manual_trains_limit?: number
	trains_limit_signal?: {
		type: string
		name: string
	}
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

		arithmetic_conditions?: iArithmeticCondition
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
}

export type iTrainStopControlBehavior = {
	train_stopped_signal?: {
		type: string
		name: string
	}
	set_trains_limit?: boolean
	trains_limit_signal?: {
		type: string
		name: string
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

export type iArithmeticCondition = {
	first_signal?: {
		type: string
		name: string
	}
	second_signal?: {
		type: string
		name: string
	}
	first_constant?: number
	second_constant?: number
	operation: string
	output_signal: {
		type: string
		name: string
	}
}

export interface iBlueprintItem {
	entity_number: number
	name: string
	position: {
		x: number
		y: number
	}
	// Item orientation
	direction?: number
	// Train orientation
	orientation?: number
	// Chest limit
	bar?: number
	type?: string
	// Filter inserter filter
	filters?: Array<{
		index: number
		name: string
	}>
	// Requester and buffer chest requests
	request_filters?: Array<{
		index: number
		name: string
		count: number
	}>
	request_from_buffers?: boolean
	// Wire connections with another item in the blueprint
	connections?: {
		"1"?: {
			red?: iCircuitConnection[]
			green?: iCircuitConnection[]
		}
		"2"?: {
			red?: iCircuitConnection[]
			green?: iCircuitConnection[]
		}
	}
	// Train stop, decider combinator logic
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
		arithmetic_conditions?: iArithmeticCondition
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
	// station name
	station?: string
	// Train limit at this station - how many trains may go to this station
	manual_trains_limit?: number
	trains_limit_signal?: {
		type: string
		name: string
	}
}

export type iBeltTypes = "transport-belt" | "fast-transport-belt" | "express-transport-belt" | "turbo-transport-belt"
export type iInserterTypes = "inserter" | "fast-inserter" | "bulk-inserter" | "stack-inserter"
export type iRefillFuelTypes = "wood" | "coal" | "solid-fuel" | "rocket-fuel" | "nuclear-fuel"
export type iChestTypes =
	| "wooden-chest"
	| "iron-chest"
	| "steel-chest"
	| "requester-chest"
	| "buffer-chest"
	| "passive-provider-chest"
	| "active-provider-chest"
	| "storage-chest"
export type iBeltSides = "Right" | "Left" | "Both"
export type iPumpSides = "Right" | "Left"
export type iEnabledConditionOperators = "<" | ">"

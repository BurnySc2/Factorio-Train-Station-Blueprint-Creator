import { defaultSettings } from "./constants"

export interface iSectionsProps {
    userSettings: typeof defaultSettings
    setUserSettings: (newSettings: typeof defaultSettings) => void
}

export type iBlueprint = iBlueprintItem[]
export type iWireColor = "green" | "red"

type iEntityId = { entity_id: number }

export interface iBlueprintItemWithoutNumber {
    name: string
    position: {
        x: number
        y: number
    }
    direction?: number
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
            red?: iEntityId[]
            green?: iEntityId[]
        }
        "2"?: {
            red?: iEntityId[]
            green?: iEntityId[]
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
}

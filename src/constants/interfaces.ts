import { defaultSettings } from "./constants"

export interface iSectionsProps {
    userSettings: typeof defaultSettings
    setUserSettings: (newSettings: typeof defaultSettings) => void
}

export type iBlueprint = iBlueprintItem[]

export interface iBlueprintItem {
    entity_number: number
    name: string
    position: {
        x: number
        y: number
    }
    direction?: number
    type?: string
    connections?: object
    control_behavior?: object
}

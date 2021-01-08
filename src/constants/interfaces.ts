import { defaultSettings } from "./constants"

export interface SectionsProps {
    userSettings: typeof defaultSettings
    setUserSettings: (newSettings: typeof defaultSettings) => void
}

export interface Blueprint {}

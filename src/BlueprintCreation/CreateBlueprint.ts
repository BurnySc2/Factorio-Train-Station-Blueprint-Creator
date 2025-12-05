import { defaultSettings, normalStation, fluidStation } from "../constants/constants"
import { iBlueprint, iBlueprintItem } from "../constants/interfaces"
import { createNormalStation } from "./CreateNormalStation"
import { createFluidStation } from "./CreateFluidStation"
import { createStacker } from "./CreateStacker"
import pako from "pako"

export const createBlueprint = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    if (normalStation.includes(bpSettings.stationType)) {
        return createNormalStation(bpSettings)
    }
    if (fluidStation.includes(bpSettings.stationType)) {
        return createFluidStation(bpSettings)
    } else if (bpSettings.stationType === "Stacker") {
        return createStacker(bpSettings)
    }
    return []
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const decode = (blueprintString: string): iBlueprint => {
    // UNTESTED stolen from https://github.com/demipixel/factorio-blueprint/blob/c21309e9023ee3740a5c3c647d87cb828ab3ecc4/src/util.ts#L20
    return JSON.parse(
        pako.inflate(
            Uint8Array.from(atob(blueprintString.slice(1)), (c) => c.charCodeAt(0)),
            { to: "string" }
        )
    )
}

const encode = (items: iBlueprintItem[]): string => {
    const blueprint = {
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
    return "0" + btoa(
        String.fromCharCode(...pako.deflate(JSON.stringify(blueprint), { level: 9 }))
    )
}

export const createBlueprintString = (blueprint: iBlueprint): string => {
    // Stolen from https://github.com/demipixel/factorio-blueprint/blob/c21309e9023ee3740a5c3c647d87cb828ab3ecc4/src/util.ts#L41
    return encode(blueprint)
}

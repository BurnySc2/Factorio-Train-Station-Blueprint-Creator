import { defaultSettings } from "../constants/constants"
import { iBlueprint, iBlueprintItem } from "../constants/interfaces"
import { createNormalStation } from "./CreateNormalStation"
import { createFluidStation } from "./CreateFluidStation"
import { createStacker } from "./CreateStacker"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const zlib = require("zlib")

export const createBlueprint = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    /*
    TODO
    Add template for github:
    new feature or issue description
    in what circumstances the feature would be used (explain why your feature is useful)
    issue: which setting creates the bug and what is the bug (explain your bug)

     */

    if (["Loading Station", "Unloading Station"].includes(bpSettings.stationType)) {
        return createNormalStation(bpSettings)
    }
    if (["Fluid Loading Station", "Fluid Unloading Station"].includes(bpSettings.stationType)) {
        return createFluidStation(bpSettings)
    } else if (bpSettings.stationType === "Stacker") {
        return createStacker(bpSettings)
    }
    return []
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const decode = (blueprintString: string) => {
    // UNTESTED stolen from https://github.com/demipixel/factorio-blueprint/blob/c21309e9023ee3740a5c3c647d87cb828ab3ecc4/src/util.ts#L20
    return JSON.parse(
        zlib.inflateSync(Buffer.from(blueprintString.slice(1), "base64")).toString("utf8")
    )
}

const encode = (items: iBlueprintItem[]) => {
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
    return "0" + zlib.deflateSync(JSON.stringify(blueprint), { level: 9 }).toString("base64")
}

export const createBlueprintString = (blueprint: iBlueprint): string => {
    // Stolen from https://github.com/demipixel/factorio-blueprint/blob/c21309e9023ee3740a5c3c647d87cb828ab3ecc4/src/util.ts#L41
    return encode(blueprint)
}

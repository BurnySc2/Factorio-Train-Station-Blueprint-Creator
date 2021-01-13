import { defaultSettings } from "../constants/constants"
import { iBlueprint, iBlueprintItem } from "../constants/interfaces"
import { createNormalStation } from "./CreateNormalStation"
import { createFluidStation } from "./CreateFluidStation"
import { createStacker } from "./CreateStacker"
const zlib = require("zlib")

export const createBlueprint = (bpSettings: typeof defaultSettings): iBlueprintItem[] => {
    /*
    TODO
    liquid:
    create pumps
    create storage tanks
    connect tanks with pipe

    stacker:
    create stacker

    warnings / errors:
    invalid number (not able to parseint, entry missing)
    sequential should be used together with "train enabled condition"
    "train enabled condition" should be used with at least "connect chests with green wire

    tooltips
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

const encode = (items: any[]) => {
    let blueprint = {
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

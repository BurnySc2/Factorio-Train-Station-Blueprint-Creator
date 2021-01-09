import { defaultSettings } from "../constants/constants"
import { iBlueprint, iBlueprintItem } from "../constants/interfaces"
const zlib = require("zlib")

// Blueprint entries
let bpEntries = []

let trainStops = []
let trainTracks: iBlueprintItem[] = []

let poles = []
let splitters = []
let inserters = []
let chests = []

let refillChests = []
let refillInserters = []

let belts = []

let pumps = []
let storageTanks = []

let trainSignals = []

export const createBlueprint = (bpSettings: typeof defaultSettings): iBlueprint => {
    // place train stop, name, enable condition etc
    // place rail tracks
    /*
    create refuel chests for locomotives

    place inserters
    place chests, limit, requester chests: request
    place splitters
    place belts
    place belts toward forward / back end


    liquid:
    create pumps
    create storage tanks

    stacker:
    create stacker

     */

    // place decider for it there are enough resources to complete enable condition
    // connect wires

    placeTrainTracks(bpSettings)

    let test = [newItem("transport-belt", 0, 0, 0)]
    return test
    // return myBlueprint
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

let entityNumber = 1
const newItem = (
    itemName: string,
    x: number,
    y: number,
    direction: number = -1
): iBlueprintItem => {
    let item: iBlueprintItem = {
        entity_number: entityNumber,
        name: itemName,
        position: {
            x: x,
            y: y,
        },
        // type: "input",
        // connections: {},
        // control_behavior: {}
    }
    if (direction >= 0) {
        item.direction = direction
    }
    entityNumber += 1
    return item
}

const placeTrainTracks = (bpSettings: typeof defaultSettings) => {
    let locomotivesAmount = bpSettings.doubleHeaded
        ? 2 * parseInt(bpSettings.locomotivesPerEnd)
        : parseInt(bpSettings.locomotivesPerEnd)
    let cargoAmount = parseInt(bpSettings.cargoWagon)
    let stationAmount = bpSettings.sequentialStation
        ? parseInt(bpSettings.sequentialStationsAmount)
        : 1
    let limit = (locomotivesAmount + cargoAmount) * stationAmount * 7
    for (let i = 0; i < limit; i += 2) {
        trainTracks.push(newItem("straight-rail", -0.5, i))
    }
}
const placeTrainStop = () => {}

const TOOLTIPS = {
    trainLimit:
        "Limits the amount of trains that will be at going to this station.<br>If set to dynamic, will automatically set the max amount based on used (loading station) / free (unloading station) space in your chests.",
    trainLimitNumberInput: "Valid: numbers, 'each', alphabetical characters (A, B, ...)",
    doubleHeaded: "Does your train have locomotives at each end (facing both ways)?",
    includeTrainInBlueprint:
        "If enabled, adds the train with the expected layout to the blueprint.",
    enableFilterInserters:
        "If enabled, turns all inserters to filters inserters of equivalent level.",
    chestType:
        "If chest type is a logistic chest, it is expected that bots will deliver/grab items from the chest. No belts will be placed.",
    chestLimit:
        "Limits the amount of free slots in the chests.<br>A cargo wagon has 40 slots, so 6 chests with 7 slots have enough capacity to fill one wagon, or 12 chests with 4.",
    beltFlow: "If enabled, adds belt flow to the top/bottom of the station.",
    refillEnabled:
        "If enabled, places an inserter and a requester chest next to each locomotive with the desired fuel type and amount.",
    connectChestsWithGreenWire:
        "If enabled, connects all chests on the left and all chests / storage tanks on the right together with green wire.",
    connectBothSideWithGreenWire:
        "If enabled, connects the top left and top right chest / storage tank with green wire.",
    connectChestsWithRedWire:
        "If enabled, connects all chests on the left and all chests / storage tanks on the right together with green wire.",
    connectBothSideWithRedWire:
        "If enabled, connects the top left and top right chest / storage tank with red wire.",
    trainStopUsesEnabledCondition:
        "If enabled, adds a decider combinator.<br>Then it creates a green wire connection with trainStop-deciderCombinator-poles-topChest.<br>The train stop will be enabled if the condition (e.g. sum of items in chests > 4000) is met.",
}
export default TOOLTIPS

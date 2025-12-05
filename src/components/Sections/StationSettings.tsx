import React, { useEffect } from "react"
import { iSectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"
import TOOLTIPS from "../../constants/tooltips"
import { fluidStation, iOperator, operatorTypes, trainLimit } from "../../constants/constants"
import { calcCombinatorSettings } from "../../constants/helper"

const applyArray = (
    combinatorArray: [string, iOperator, string, string, iOperator, string],
    props: iSectionsProps
) => {
    props.setUserSettings({
        ...props.userSettings,
        trainLimitArithmetic1Constant1: combinatorArray[0],
        trainLimitArithmetic1Operator: combinatorArray[1],
        trainLimitArithmetic1Constant2: combinatorArray[2],
        trainLimitArithmetic2Constant1: combinatorArray[3],
        trainLimitArithmetic2Operator: combinatorArray[4],
        trainLimitArithmetic2Constant2: combinatorArray[5],
    })
}

export default function StationSettings(props: iSectionsProps): JSX.Element {

    const hideWhenTrainLimitIsNotDynamic = props.userSettings.trainLimit !== "Dynamic"
    const hideWhenFluidStation = fluidStation.includes(props.userSettings.stationType)
    const hideWhenNotUnloadingStation =
        props.userSettings.stationType !== "Unloading Station" &&
        props.userSettings.stationType !== "Fluid Unloading Station"

    useEffect(() => {
        applyArray(calcCombinatorSettings(props.userSettings), props)
    }, [
        props.userSettings.stationType,
        props.userSettings.trainLimitToAtMostOneTrain,
        props.userSettings.trainLimitStackSize,
        props.userSettings.cargoWagon,
        props.userSettings.chestLimit,
        props.userSettings.chestType,
        props.userSettings.beltSidesUsed,
        props.userSettings.connectChestsWithGreenWire,
        props.userSettings.connectBothSideWithGreenWire,
        props.setUserSettings,
    ])

    const myInput = (
        key:
            | "trainLimitArithmetic1Constant1"
            | "trainLimitArithmetic1Constant2"
            | "trainLimitArithmetic2Constant1"
            | "trainLimitArithmetic2Constant2"
    ) => {
        return (
            <input
                type={"text"}
                className={`${CLASSES.inputTextElement} col-span-2`}
                data-tooltip-id="my-tooltip"
                data-tooltip-content={TOOLTIPS.trainLimitNumberInput}
                hidden={hideWhenTrainLimitIsNotDynamic}
                value={props.userSettings[key]}
                onChange={(e) => {
                    props.setUserSettings({
                        ...props.userSettings,
                        [key]: e.target.value,
                    })
                }}
            />
        )
    }

    const mySelectOperator = (
        key: "trainLimitArithmetic1Operator" | "trainLimitArithmetic2Operator"
    ) => {
        return (
            <select
                className={`${CLASSES.selectElement} col-span-1`}
                hidden={hideWhenTrainLimitIsNotDynamic}
                value={props.userSettings[key]}
                onChange={(e) => {
                    props.setUserSettings({
                        ...props.userSettings,
                        [key]: e.target.value,
                    })
                }}
            >
                {operatorTypes.map((operator) => {
                    return (
                        <option key={operator} value={operator}>
                            {operator}
                        </option>
                    )
                })}
            </select>
        )
    }

    const trainLimitHtml = (
        <select
            className={`${CLASSES.selectElement} col-span-5`}
            data-tooltip-id="my-tooltip"
            data-tooltip-content={TOOLTIPS.trainLimit}
            value={props.userSettings.trainLimit}
            onChange={(e) => {
                props.setUserSettings({
                    ...props.userSettings,
                    trainLimit: e.target.value,
                })
            }}
        >
            {trainLimit.map((optionStr) => {
                return (
                    <option key={optionStr} value={optionStr}>
                        {optionStr}
                    </option>
                )
            })}
        </select>
    )

    return (
        <div>
            <div className={CLASSES.section}>
                <div className={CLASSES.gridSection12cols}>
                    {trainLimitHtml}
                    <label className={`${CLASSES.labelElement} col-span-7`}>Train Limit</label>
                    <input
                        className={`${CLASSES.checkboxElement} col-span-5`}
                        hidden={hideWhenNotUnloadingStation || hideWhenTrainLimitIsNotDynamic}
                        type={"checkbox"}
                        id={"trainLimitToAtMostOneTrain"}
                        checked={props.userSettings.trainLimitToAtMostOneTrain}
                        onChange={(e) => {
                            props.setUserSettings({
                                ...props.userSettings,
                                trainLimitToAtMostOneTrain: e.target.checked,
                            })
                        }}
                    />
                    <label
                        className={`${CLASSES.labelElement} col-span-7`}
                        hidden={hideWhenNotUnloadingStation || hideWhenTrainLimitIsNotDynamic}
                        htmlFor={"trainLimitToAtMostOneTrain"}
                    >
                        Limit station to at most 1 train
                    </label>
                    {myInput("trainLimitArithmetic1Constant1")}
                    {mySelectOperator("trainLimitArithmetic1Operator")}
                    {myInput("trainLimitArithmetic1Constant2")}
                    <label
                        className={`${CLASSES.labelElement} col-span-7`}
                        hidden={hideWhenTrainLimitIsNotDynamic}
                    >
                        First arithmetic combinator settings
                    </label>

                    {myInput("trainLimitArithmetic2Constant1")}
                    {mySelectOperator("trainLimitArithmetic2Operator")}
                    {myInput("trainLimitArithmetic2Constant2")}
                    <label
                        className={`${CLASSES.labelElement} col-span-7`}
                        hidden={hideWhenTrainLimitIsNotDynamic}
                    >
                        Second arithmetic combinator settings
                    </label>
                    {/*<div className={""}></div>*/}
                    <input
                        id={"trainLimitStackSize50"}
                        className={`${CLASSES.radioButtonElement} col-span-5`}
                        hidden={hideWhenTrainLimitIsNotDynamic || hideWhenFluidStation}
                        type={"radio"}
                        value={50}
                        checked={props.userSettings.trainLimitStackSize === 50}
                        onChange={() => {
                            props.setUserSettings({
                                ...props.userSettings,
                                trainLimitStackSize: 50,
                            })
                        }}
                    />
                    <label
                        className={`${CLASSES.labelElement} col-span-7`}
                        hidden={hideWhenTrainLimitIsNotDynamic || hideWhenFluidStation}
                    >
                        Item stack size 50
                    </label>
                    <input
                        id={"trainLimitStackSize100"}
                        className={`${CLASSES.radioButtonElement} col-span-5`}
                        hidden={hideWhenTrainLimitIsNotDynamic || hideWhenFluidStation}
                        type={"radio"}
                        value={100}
                        checked={props.userSettings.trainLimitStackSize === 100}
                        onChange={() => {
                            props.setUserSettings({
                                ...props.userSettings,
                                trainLimitStackSize: 100,
                            })
                        }}
                    />
                    <label
                        className={`${CLASSES.labelElement} col-span-7`}
                        hidden={hideWhenTrainLimitIsNotDynamic || hideWhenFluidStation}
                    >
                        Item stack size 100
                    </label>
                    <input
                        id={"trainLimitStackSize200"}
                        className={`${CLASSES.radioButtonElement} col-span-5`}
                        hidden={hideWhenTrainLimitIsNotDynamic || hideWhenFluidStation}
                        type={"radio"}
                        value={200}
                        checked={props.userSettings.trainLimitStackSize === 200}
                        onChange={() => {
                            props.setUserSettings({
                                ...props.userSettings,
                                trainLimitStackSize: 200,
                            })
                        }}
                    />
                    <label
                        className={`${CLASSES.labelElement} col-span-7`}
                        hidden={hideWhenTrainLimitIsNotDynamic || hideWhenFluidStation}
                    >
                        Item stack size 200
                    </label>
                </div>
            </div>
        </div>
    )
}

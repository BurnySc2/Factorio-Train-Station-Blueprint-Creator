import React from "react"
import { iSectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"
import TOOLTIPS from "../../constants/tooltips"
import {
    fluidStation,
    iOperator,
    normalStation,
    operatorTypes,
    trainLimit,
} from "../../constants/constants"
import { calcCombinatorSettings } from "../../constants/helper"

export default function StationSettings(props: iSectionsProps): JSX.Element {
    const hideWhenTrainLimitIsNotDynamic = props.userSettings.trainLimit !== "Dynamic"
    const hideWhenNormalStation = normalStation.includes(props.userSettings.stationType)
    const hideWhenFluidStation = fluidStation.includes(props.userSettings.stationType)

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
                data-tip={TOOLTIPS.trainLimitNumberInput}
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
            data-tip={TOOLTIPS.trainLimit}
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

    const applyArray = (
        combinatorArray: [string, iOperator, string, string, iOperator, string]
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

    return (
        <div>
            <div className={CLASSES.section}>
                <div className={CLASSES.gridSection12cols}>
                    {trainLimitHtml}
                    <label className={`${CLASSES.labelElement} col-span-7`}>Train Limit</label>
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
                    <button
                        className={`${CLASSES.buttonElement} w-full my-1 col-span-4`}
                        hidden={hideWhenTrainLimitIsNotDynamic || hideWhenFluidStation}
                        onClick={() => {
                            applyArray(calcCombinatorSettings(props.userSettings, 50))
                        }}
                    >
                        Calculate for item stack size 50
                    </button>
                    <button
                        className={`${CLASSES.buttonElement} w-full my-1 col-span-4`}
                        hidden={hideWhenTrainLimitIsNotDynamic || hideWhenFluidStation}
                        onClick={() => {
                            applyArray(calcCombinatorSettings(props.userSettings, 100))
                        }}
                    >
                        Calculate for item stack size 100
                    </button>
                    <button
                        className={`${CLASSES.buttonElement} w-full my-1 col-span-4`}
                        hidden={hideWhenTrainLimitIsNotDynamic || hideWhenFluidStation}
                        onClick={() => {
                            applyArray(calcCombinatorSettings(props.userSettings, 200))
                        }}
                    >
                        Calculate for item stack size 200
                    </button>
                    <button
                        className={`${CLASSES.buttonElement} w-full my-1 col-span-12`}
                        hidden={hideWhenTrainLimitIsNotDynamic || hideWhenNormalStation}
                        onClick={() => {
                            applyArray(calcCombinatorSettings(props.userSettings, 200))
                        }}
                    >
                        Calculate combinator settings
                    </button>
                </div>
            </div>
        </div>
    )
}

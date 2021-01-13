import React from "react"
import { iChestTypes, iSectionsProps } from "../../constants/interfaces"
import { CLASSES } from "../../css/classes"
import { chestTypes, chestTypesHuman } from "../../constants/constants"
import TOOLTIPS from "../../constants/tooltips"

export default function ChestTypeSettings(props: iSectionsProps): JSX.Element {
    const chestTypesHtml = (
        <select
            id={"chestTypes"}
            className={CLASSES.selectElement}
            value={props.userSettings.chestType}
            data-tip={TOOLTIPS.chestType}
            onChange={(e) => {
                props.setUserSettings({
                    ...props.userSettings,
                    chestType: e.target.value as iChestTypes,
                })
            }}
        >
            {chestTypes.map((chestType) => {
                return (
                    <option className={CLASSES.optionElement} key={chestType} value={chestType}>
                        {chestTypesHuman[chestType]}
                    </option>
                )
            })}
        </select>
    )

    const isRequesterChest = ["logistic-chest-requester", "logistic-chest-buffer"].includes(
        props.userSettings.chestType
    )
    const canRequestFromBufferChests = props.userSettings.chestType === "logistic-chest-requester"

    let previousIsEmpty = -1
    const chestRequests = new Array(24).fill(0).map((_, i) => {
        const index = Math.floor(i / 2)
        if (previousIsEmpty !== -1 && previousIsEmpty < index) {
            return undefined
        }
        if (props.userSettings.chestRequestItemsType[index] === "") {
            previousIsEmpty = index
        }
        if (i % 2 === 0) {
            return (
                <input
                    className={CLASSES.inputTextElement}
                    hidden={!isRequesterChest}
                    list={"itemlist"}
                    key={`${index} chestRequestItemsType`}
                    type={"text"}
                    value={props.userSettings.chestRequestItemsType[index]}
                    placeholder={`Request ${index + 1} item type`}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            chestRequestItemsType: [
                                ...props.userSettings.chestRequestItemsType.slice(0, index),
                                e.target.value,
                                ...props.userSettings.chestRequestItemsType.slice(index + 1),
                            ],
                        })
                    }}
                />
            )
        } else {
            return (
                <input
                    className={CLASSES.inputTextElement}
                    hidden={!isRequesterChest}
                    key={`${index} chestRequestItemsAmount`}
                    type={"number"}
                    min={"0"}
                    value={props.userSettings.chestRequestItemsAmount[index]}
                    placeholder={`Request ${index + 1} amount`}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            chestRequestItemsAmount: [
                                ...props.userSettings.chestRequestItemsAmount.slice(0, index),
                                e.target.value,
                                ...props.userSettings.chestRequestItemsAmount.slice(index + 1),
                            ],
                        })
                    }}
                />
            )
        }
    })

    return (
        <div className={CLASSES.section}>
            <div className={CLASSES.gridSection}>
                {chestTypesHtml}
                <label className={CLASSES.labelElement} htmlFor={"chestTypes"}>
                    Chest Type
                </label>
                <input
                    className={CLASSES.inputTextElement}
                    type={"number"}
                    value={props.userSettings.chestLimit}
                    data-tip={TOOLTIPS.chestLimit}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            chestLimit: e.target.value,
                        })
                    }}
                />
                <label className={CLASSES.labelElement} htmlFor={"chestTypes"}>
                    Chest limit
                </label>
                <input
                    className={CLASSES.checkboxElement}
                    hidden={!canRequestFromBufferChests}
                    id={"requestFromBuffers"}
                    type={"checkbox"}
                    checked={props.userSettings.chestRequestFromBuffers}
                    onChange={(e) => {
                        props.setUserSettings({
                            ...props.userSettings,
                            chestRequestFromBuffers: e.target.checked,
                        })
                    }}
                />
                <label
                    className={CLASSES.labelElement}
                    hidden={!canRequestFromBufferChests}
                    htmlFor={"requestFromBuffers"}
                >
                    Request from Buffers
                </label>
                {chestRequests}
            </div>
        </div>
    )
}

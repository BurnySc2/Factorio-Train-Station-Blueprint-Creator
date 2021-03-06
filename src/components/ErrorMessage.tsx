import React from "react"
import { CLASSES } from "../css/classes"

interface MyProps {
    errorMessage: string
}

export default function ErrorMessage(props: MyProps): JSX.Element | null {
    if (props.errorMessage === "") {
        return null
    }
    return <div className={CLASSES.errorMessageElement}>{props.errorMessage}</div>
}

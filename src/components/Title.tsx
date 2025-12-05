import React from "react"
import { CLASSES } from "../css/classes"

export default function Title(): JSX.Element {
    return (
        <a
            className={CLASSES.title}
            target="_blank"
            rel="noreferrer noopener"
            href="https://burnysc2.github.io/Factorio-Train-Station-Blueprint-Creator/"
        >
            {"Burny's Train Station Blueprint Creator"}
        </a>
    )
}

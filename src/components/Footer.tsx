import React from "react"
import { CLASSES } from "../css/classes"

export default function Footer(): JSX.Element {
    return (
        <div className={`flex flex-col my-2`}>
            <a
                className={CLASSES.footerElements}
                target="_blank"
                rel="noreferrer"
                href="https://github.com/BurnySc2/Factorio-Train-Station-Blueprint-Creator"
            >
                Contribute
            </a>
            <a
                className={CLASSES.footerElements}
                target="_blank"
                rel="noreferrer"
                href="https://github.com/BurnySc2/Factorio-Train-Station-Blueprint-Creator/issues/new"
            >
                Suggestions / Report Bugs
            </a>
            <a
                className={CLASSES.footerElements}
                target="_blank"
                rel="noreferrer"
                href="https://www.reddit.com/message/compose/?to=BurnySc2"
            >
                Contact (Reddit)
            </a>
        </div>
    )
}

import React from "react"
import { CLASSES } from "../css/classes"

export default function Footer(props: any) {
    return (
        <div className={`${CLASSES.footerElements} flex flex-col`}>
            <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/BurnySc2/Factorio-Train-Station-Blueprint-Creator"
            >
                Contribute
            </a>
            <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/BurnySc2/Factorio-Train-Station-Blueprint-Creator/issues/new"
            >
                Suggestions / Report Bugs
            </a>
            <a
                target="_blank"
                rel="noreferrer"
                href="https://www.reddit.com/message/compose/?to=BurnySc2"
            >
                Contact (Reddit)
            </a>
        </div>
    )
}

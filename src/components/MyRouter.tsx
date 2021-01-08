import React from "react"
import { Route, Router } from "react-router-dom"
import Website from "./Website"

export default function MyRouter(props: any) {
    return (
        <Website />
        // @ts-ignore
        // <Router history={() => {}}>
        //     <Route path="/" component={Website}/>
        // </Router>
    )
}

import React from "react"
import Website from "./Website"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

export default function MyRouter(props: any) {
    return (
        // TODO use path to be able to link a setting to a friend

        <Router>
            <Switch>
                <Route exact path="/">
                    <Website />
                </Route>
            </Switch>
        </Router>
    )
}

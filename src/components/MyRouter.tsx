import React from "react"
import Website from "./Website"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

export default function MyRouter(): JSX.Element {
    return (
        // TODO use path (params) to be able to link a setting to a friend
        <Router>
            <Routes>
                <Route path="/" element={<Website />} />
            </Routes>
        </Router>
    )
}

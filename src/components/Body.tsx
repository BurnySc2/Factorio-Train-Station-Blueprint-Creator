import React, { Component } from "react"
import data_json from "../data.json"

interface Props {}
interface State {}

class Body extends Component<Props, State> {
    state = {}

    render() {
        return <div className="text-center">My data from json: {data_json["test"]}</div>
    }
}

export default Body

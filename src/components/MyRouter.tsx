import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Website from "./Website"

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

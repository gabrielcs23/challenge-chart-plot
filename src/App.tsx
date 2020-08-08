import React, { FunctionComponent } from 'react'
import './App.css'
import { Button } from './components/UI/Button/Button'

const App: FunctionComponent = () => {

	const handleGenChartClick = () => {
		console.log('clicked')
	}

	return (
		<>
			<header className="title">
				<h1>Gabriel's Challenge</h1>
			</header>

			{/* TODO: code section goes here */}

			{/* TODO: chart section goes here */}

			<footer>
				<Button
					content={"GENERATE CHART"}
					onClick={handleGenChartClick}
				/>
			</footer>
		</>
	)
}
export default App;

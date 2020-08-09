import './App.css'
import React, { FunctionComponent } from 'react'
import { Button } from './components/UI/Button/Button'
import { InputSection } from './components/InputSection/InputSection'

const App: FunctionComponent = () => {

	const handleGenChartClick = () => {
		console.log('clicked')
	}

	return (
		<>
			<div className="title">
				<h1>Gabriel's Challenge</h1>
			</div>

			<div className="input-section">
				<InputSection />
			</div>			

			<div className="chart-section">
				<div> </div>
			</div>

			<div className="footer">
				<Button
					content={"GENERATE CHART"}
					onClick={handleGenChartClick}
				/>
			</div>
		</>
	)
}
export default App;

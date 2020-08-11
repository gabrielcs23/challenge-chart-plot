import './App.css'
import React, { Component } from 'react'
import { Button } from './components/UI/Button/Button'
import { InputSection } from './components/InputSection/InputSection'

type AppState = {
	rawInput: string;
	genChartDisabled: boolean
}

export default class App extends Component<{}, AppState>  {

	constructor(props: {}) {
		super(props);
		this.state = {
			rawInput: '',
			genChartDisabled: false
		}
	}

	onChangeRawInput(rawInput: string) {
		this.setState({rawInput: rawInput});
	}

	handleGenChartClick() {
		this.setState({genChartDisabled: true})
	}

	render() {
		return (
			<>
				<div className="title">
					<h1>Gabriel's Challenge</h1>
				</div>
	
				<div className="input-section">
					<InputSection onChange={(value: string) => this.onChangeRawInput(value)} />
				</div>			
	
				<div className="chart-section">
					<div> </div>
				</div>
	
				<div className="footer">
					<Button
						content={"GENERATE CHART"}
						disabled={this.state.genChartDisabled}
						onClick={() => this.handleGenChartClick()}
					/>
				</div>
			</>
		)
	}
	
}

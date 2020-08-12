import './App.css'
import React, { Component } from 'react'
import { Button } from './components/UI/Button/Button'
import { InputSection } from './components/InputSection/InputSection'
import { InputParser } from './utils/InputParser'
import { EventsProcessor } from './utils/EventsProcessor'

type AppState = {
	rawInput: string;
	genChartDisabled: boolean
}

export default class App extends Component<{}, AppState>  {

	private eventsProcessor: EventsProcessor

	constructor(props: {}) {
		super(props);
		this.state = {
			rawInput: '',
			genChartDisabled: false
		}
		this.eventsProcessor = new EventsProcessor();
	}

	onChangeRawInput(rawInput: string) {
		this.setState({rawInput: rawInput});
	}

	handleGenChartClick() {
		if (this.state.rawInput === '') {
			console.warn('Enter input first');
			return;
		}
		this.setState({genChartDisabled: true});
		const events = InputParser.parse(this.state.rawInput);
		if (events.length > 0) {
			this.eventsProcessor.processMultipleEvents(events);
		}
		// after data is processed
		this.setState({genChartDisabled: false});
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

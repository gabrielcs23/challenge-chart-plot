import './App.css'
import React, { Component } from 'react'
import { Button } from './components/UI/Button/Button'
import { InputSection } from './components/InputSection/InputSection'
import { InputParser } from './utils/InputParser'
import { EventsProcessor } from './utils/EventsProcessor'
import { ChartSection } from './components/ChartSection/ChartSection'

type AppState = {
	rawInput: string;
	chartSeries: Highcharts.LineChartSeriesOptions[];
	genChartDisabled: boolean;
}

export default class App extends Component<{}, AppState>  {

	private eventsProcessor: EventsProcessor

	constructor(props: {}) {
		super(props);
		this.state = {
			rawInput: '',
			chartSeries: [],
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
		const chartSeries = this.eventsProcessor.getChartSeries();
		// after data is processed
		this.setState({chartSeries, genChartDisabled: false});
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
					<ChartSection chartSeries={this.state.chartSeries} />
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

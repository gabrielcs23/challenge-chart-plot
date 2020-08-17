import { ProcessableEvent } from '../model/ProcessableEvent';
import { EventsProcessorException as Exception } from '../model/exception/EventsProcessorException';

/**
 * Responsible for processing events and generate chart series
 * @method processMultipleEvents: process events in batch mode
 * @method processEvent: process a single event; useful for live data
 * @method getChartSeries: convert processed data into chart series
 */
export class EventsProcessor {

    /**
     * Processor status
     */
    private status: 'idle' | 'started' | 'fetching';
    /**
     * Chart range start value
     */
    private begin: number;
    /**
     * Chart range end value
     */
    private end: number;
    private selectOptions: string[];
    private groupOptions: string[];
    /**
     * Processed data.
     * 
     * Value is an array of *\[timestamp, value]*.
     * 
     * Map key is a composition of every *groupOption* event value combined with each *selectOption*.
     * 
     * So if *groupOptions=["os","browser"]* and *selectOptions=["min_response_time","max_response_time"]*, 
     * one possible set of keys is:
     * 
     * *\['Linux Chrome Min Response Time', 'Linux Chrome Max Response Time']*
     */
    private dataMap: Map<string, Array<[number, number]>>;

    constructor() {
        this.status = 'idle';
        this.begin = 0;
        this.end = 0;
        this.selectOptions = [];
        this.groupOptions = [];
        this.dataMap = new Map();
    }

    private get isStatusIdle(): boolean {
        return this.status === 'idle';
    }

    private get isStatusStarted(): boolean {
        return this.status === 'started';
    }

    private get isStatusFetching(): boolean {
        return this.status === 'fetching';
    }

    /**
     * Process a single event
     * @param event
     */
    public processEvent(event: ProcessableEvent) {
        const { type } = event;
        switch (type) {
            case 'start':
                this.processStart(event);
                break;
            case 'span':
                this.processSpan(event);
                break;
            case 'data':
                this.processData(event);
                break;
            case 'stop':
                this.processStop();
                break;
            default:
                throw new Exception(`Unknown event`, `Ignoring '${type}'`);
        }
    }

    /**
     * Process multiple events. If real time process is needed use processEvent
     * @param events array of events
     */
    public processMultipleEvents(events: ProcessableEvent[]) {
        events.forEach((event: ProcessableEvent) => this.processEvent(event));
    }

    private processStart(event: ProcessableEvent) {
        this.status = 'started';
        this.selectOptions = event.select;
        this.groupOptions = event.group;
        // makes sure that start will process only new data
        if (this.dataMap.size > 0) {
            this.dataMap = new Map();
        }
    }

    private processSpan(event: ProcessableEvent) {
        if (this.isStatusIdle) {
            throw new Exception('Error', `Can't process 'span' before 'start' event`);
        }
        this.begin = event.begin;
        this.end = event.end;
        this.status = 'fetching';
    }

    private processData(event: ProcessableEvent) {
        if (this.isStatusIdle) {
            throw new Exception('Error', `Can't process 'data' before 'start' event`);
        }
        if (this.isStatusStarted) {
            throw new Exception('Error', `Can't process 'data' before 'span' event`);
        }
        // check range
        if (event.timestamp < this.begin || event.timestamp > this.end) {
            return;
        }
        // groupKey is the composition of every event group value
        const groupKey = this.getAndComposeGroupKey(event);
        this.selectOptions.forEach(s => {
            // groupKey + selectOption = dataMap key
            const tagKey = groupKey + this.formatSelectOption(s);
            const data = this.dataMap.get(tagKey);
            if (data) {
                data.push([event.timestamp,event[s]]);
            } else {
                this.dataMap.set(tagKey, [[event.timestamp, event[s]]]);
            }
        });
    }

    private processStop() {
        this.status = 'idle';
    }

    /**
     * Gets event group values and compose group key
     * @see this.dataMap definition
     * @param event
     * @returns composed group key
     */
    private getAndComposeGroupKey(event: ProcessableEvent): string {
        let groupKey = '';
        this.groupOptions.forEach(g => {
            if (groupKey !== '') {
                groupKey += ' ';
            }
            groupKey += this.capitalize(event[g]);
        });
        return groupKey;
    }

    /**
     * Format *selectOption* to make a key in *this.dataMap*
     * 
     * e.g. 'min_response_time' -> ' Min Response Time'
     * @param source single selectOption
     */
    private formatSelectOption(source: string): string {
        const words = source.split('_');
        let r = '';
        words.forEach(w => r += ` ${this.capitalize(w)}`);
        return r;
    }

    private capitalize(target: string): string {
        return target[0].toUpperCase() + target.slice(1, target.length);
    }

    public getChartSeries(): Highcharts.LineChartSeriesOptions[] {
        if (this.dataMap.size > 1) {
            const chartSeries: Highcharts.LineChartSeriesOptions[] = [];
            for (const entry of this.dataMap) {
                let lineSeries: Highcharts.LineChartSeriesOptions = {};
                lineSeries.name = entry[0];
                lineSeries.data = entry[1];
                chartSeries.push(lineSeries);
            }
            return chartSeries;
        }
        return [];
    }

}
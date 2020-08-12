import { ProcessableEvent } from '../model/ProcessableEvent';
import { EventData } from '../model/EventData';

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
     * The outter most Map keys are a combination of given groupOptions data values.
     * 
     * So if *groupOptions=["os","browser"]*, possibles keys are *\"linux_chrome\"*,
     * *\"linux_firefox\"* and *\"mac_chrome\"*
     * 
     * Every selectOptions element make a key in the inner Map.
     * 
     * So if *selectOptions=["min_response_time","max_response_time"]*, both
     * *\"min_response_time\"* and *\"max_response_time\"* are keys
     */
    private data: Map<string, Map<string, EventData[]>>;

    constructor() {
        this.status = 'idle';
        this.begin = 0;
        this.end = 0;
        this.selectOptions = [];
        this.groupOptions = [];
        this.data = new Map();
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
                this.processStop(event);
                break;
            default:
                console.warn('Unknown event. Ignoring')
                break;
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
        if (!this.isStatusIdle) {
            console.error(`New 'start' before 'stop' event`);
            return;
        }
        this.status = 'started';
        this.selectOptions = event.select;
        this.groupOptions = event.group;
        // makes sure that start will process only new data
        if (this.data.size > 0) {
            this.data = new Map();
        }
    }

    private processSpan(event: ProcessableEvent) {
        if (this.isStatusIdle) {
            console.error(`Can't process 'span' before 'start' event`);
            return;
        }
        this.begin = event.begin;
        this.end = event.end;
        if (this.isStatusFetching) {
            console.warn(`Updated boundaries`);
        }
        this.status = 'fetching';
    }

    private processData(event: ProcessableEvent) {
        if (this.isStatusIdle) {
            console.error(`Can't process 'data' before 'start' event`);
            return;
        }
        if (this.isStatusStarted) {
            console.error(`Can't process 'data' before 'span' event`);
            return;
        }
        // check range
        if (event.timestamp < this.begin || event.timestamp > this.end) {
            return;
        }
        const groupKey = this.getAndComposeGroupKey(event);

        // navigate by group
        let selectMap = this.data.get(groupKey);
        if (!selectMap) {
            selectMap = new Map();
            this.data.set(groupKey, selectMap);
        }

        for (const select of this.selectOptions) {
            let eventSelectValue: EventData = {timestamp: event.timestamp, value: event[select]};
            // navigate by select
            const selectData = selectMap.get(select);
            if (!selectData) {
                selectMap.set(select, [eventSelectValue]);
            } else {
                selectData.push(eventSelectValue)
            }
        }
    }

    /**
     * Gets event group values and compose group key
     * @see this.data definition
     * @param event
     * @returns composed group key
     */
    private getAndComposeGroupKey(event: ProcessableEvent): string {
        let groupKey = '';
        this.groupOptions.forEach(g => {
            if (groupKey !== '') {
                groupKey += '_';
            }
            groupKey += event[g];
        });
        return groupKey;
    }

    private processStop(event: ProcessableEvent) {
        this.status = 'idle';
    }

    private formatKeyString(target: string, source: string): string {
        if (target !== '') {
            target += ' ';
        }
        return target + this.capitalizeString(source);
    }

    private capitalizeString(target: string): string {
        return target[0].toUpperCase() + target.slice(1, target.length);
    }

    /**
     * TODO
     */
    public getChartSeries() {

    }

}
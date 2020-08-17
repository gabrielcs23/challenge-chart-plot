import { EventsProcessor } from './EventsProcessor';
import { ProcessableEvent } from '../model/ProcessableEvent';
import { EventsProcessorException } from '../model/exception/EventsProcessorException';

const events: ProcessableEvent[] = [
    {type: 'start', timestamp: 1519862400000, select: ['min_response_time', 'max_response_time'], group: ['os', 'browser']},
    {type: 'span', timestamp: 1519862400000, begin: 1519862400000, end: 1519862460000},
    {type: 'data', timestamp: 1519862400000, os: 'linux', browser: 'chrome', min_response_time: 0.1, max_response_time: 1.3},
    {type: 'data', timestamp: 1519862400000, os: 'mac', browser: 'chrome', min_response_time: 0.2, max_response_time: 1.2},
    {type: 'data', timestamp: 1519862400000, os: 'mac', browser: 'firefox', min_response_time: 0.3, max_response_time: 1.2},
    {type: 'data', timestamp: 1519862400000, os: 'linux', browser: 'firefox', min_response_time: 0.1, max_response_time: 1.0},
    {type: 'data', timestamp: 1519862460000, os: 'linux', browser: 'chrome', min_response_time: 0.2, max_response_time: 0.9},
    {type: 'data', timestamp: 1519862460000, os: 'mac', browser: 'chrome', min_response_time: 0.1, max_response_time: 1.0},
    {type: 'data', timestamp: 1519862460000, os: 'mac', browser: 'firefox', min_response_time: 0.2, max_response_time: 1.1},
    {type: 'data', timestamp: 1519862460000, os: 'linux', browser: 'firefox', min_response_time: 0.3, max_response_time: 1.4},
    {type: 'stop', timestamp: 1519862460000}
];

it('can process an entire sequence', () => {
    const processor = new EventsProcessor();
    processor.processMultipleEvents(events);
    const series = processor.getChartSeries();
    expect(series.length).toBe(8);
});

it('can process an entire sequence without stop event', () => {
    const processor = new EventsProcessor();
    processor.processMultipleEvents(events.slice(0, events.length-1));
    const series = processor.getChartSeries();
    expect(series.length).toBe(8);
});

it('can not process an unknow event', () => {
    const processor = new EventsProcessor();
    const event = JSON.parse(`{"type": "test", "timestamp": 0}`);
    let exception;
    try {
        expect(processor.processEvent(event)).toThrow(EventsProcessorException);
    } catch(error) {
        exception = error;
    }
    expect(exception.title).toBe('Unknown event');
});

it('can not process span before start event', () => {
    const processor = new EventsProcessor();
    let exception;
    try {
        //                          span event
        expect(processor.processEvent(events[1])).toThrow(EventsProcessorException);
    } catch(error) {
        exception = error;
    }
    expect(exception.body).toBe(`Can't process 'span' before 'start' event`);
});

it('can not process data before start event', () => {
    const processor = new EventsProcessor();
    let exception;
    try {
        //                          data event
        expect(processor.processEvent(events[2])).toThrow(EventsProcessorException);
    } catch(error) {
        exception = error;
    }
    expect(exception.body).toBe(`Can't process 'data' before 'start' event`);
});

it('can not process data before span event', () => {
    const processor = new EventsProcessor();
    processor.processEvent(events[0]); // start
    let exception;
    try {
        //                          data event
        expect(processor.processEvent(events[2])).toThrow(EventsProcessorException);
    } catch(error) {
        exception = error;
    }
    expect(exception.body).toBe(`Can't process 'data' before 'span' event`);
});

it('will start a new process on a start event', () => {
    const processor = new EventsProcessor();
    processor.processMultipleEvents(events);
    processor.processEvent(new ProcessableEvent('start', 0));
    expect(processor.getChartSeries().length).toBe(0);
});

it('will update range on a span event', () => {
    const processor = new EventsProcessor();
    processor.processMultipleEvents([events[0], events[1], events[2]]);
    const event = new ProcessableEvent('span', 1519862400000);
    event['begin'] = 1519862400000;
    event['end'] = 1519862520000;
    processor.processEvent(event);
    expect(processor.getRange()).toMatchObject({begin: 1519862400000, end: 1519862520000});
});

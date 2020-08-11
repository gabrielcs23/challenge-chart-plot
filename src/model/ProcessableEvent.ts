export class ProcessableEvent {
    type: 'start' | 'span' | 'data' | 'stop';
    timestamp: number;
    [key: string]: any;

    constructor(type: 'start' | 'span' | 'data' | 'stop', timestamp: number) {
        this.type = type;
        this.timestamp = timestamp
    }
}
export class EventsProcessorException extends Error {

    public title: string;
    public body: string;

    constructor(title: string, body: string) {
        super(title+body);

        this.title = title;
        this.body = body;
        Object.setPrototypeOf(this, EventsProcessorException.prototype);
    }

}
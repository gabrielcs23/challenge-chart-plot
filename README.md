# Gabriel's Chart Plot solution

This is my solution to the [Intelie's challenge-chart-plot](https://github.com/intelie/challenge-chart-plot)

## Getting Started

```
npm install
npm start
```

### Example Input

Input given on the prototype image

```javascript
{type: 'start', timestamp: 1519862400000, select: ['min_response_time', 'max_response_time'], group: ['os', 'browser']}
{type: 'span', timestamp: 1519862400000, begin: 1519862400000, end: 1519862460000}
{type: 'data', timestamp: 1519862400000, os: 'linux', browser: 'chrome', min_response_time: 0.1, max_response_time: 1.3}
{type: 'data', timestamp: 1519862400000, os: 'mac', browser: 'chrome', min_response_time: 0.2, max_response_time: 1.2}
{type: 'data', timestamp: 1519862400000, os: 'mac', browser: 'firefox', min_response_time: 0.3, max_response_time: 1.2}
{type: 'data', timestamp: 1519862400000, os: 'linux', browser: 'firefox', min_response_time: 0.1, max_response_time: 1.0}
{type: 'data', timestamp: 1519862460000, os: 'linux', browser: 'chrome', min_response_time: 0.2, max_response_time: 0.9}
{type: 'data', timestamp: 1519862460000, os: 'mac', browser: 'chrome', min_response_time: 0.1, max_response_time: 1.0}
{type: 'data', timestamp: 1519862460000, os: 'mac', browser: 'firefox', min_response_time: 0.2, max_response_time: 1.1}
{type: 'data', timestamp: 1519862460000, os: 'linux', browser: 'firefox', min_response_time: 0.3, max_response_time: 1.4}
{type: 'stop', timestamp: 1519862460000}
```

## Notes

### Input parse

As described in challenge's definition, input data is not strict JSON. So the manually inputed data has to go through `InputParser.parse()` so its properly parsed into a `ProcessableEvent`.

If the data were to be fetched by other means than manual input (e.g. HTTP), probably they would already be a JS Object, in that case no parse would be needed. The `InputParser` can also handle if data is a JSON string.

### Whole Sequence vs Live Data

The challenge aims at processing all the input data before plotting the chart. Because of this, `EventsProcessor` has the `processMultipleEvents` method that will process every single line of input data.

If the chart would consume live data, `EventsProcessor` has the `processEvent` method to handle a single event.

The behavior using this approach can be simulated if the user input a single event, click in 'GENERATE CHART' button and then remove the line from the text area before the next input.

That way the chart would be re rendered as data is queried.

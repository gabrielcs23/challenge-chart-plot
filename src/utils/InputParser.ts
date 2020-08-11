/**
 * As input are not strictly JSON, this utility attempts to parse data from the input text area
 * @method parse
 */
export class InputParser {

    /**
     * Parses both JSON and definition's format
     * @param rawInput input string that may or may not be in JSON format
     * @returns array of events
     */
    static parse(rawInput: string): Object[] {
        // break input in lines
        const rawLines = rawInput.split('\n');
        // map each line to event Object as result of JSON parse
        return rawLines
            .map((rawLine: string, index: number) => {
                try {
                    // As input may be in JSON format, tries to parse it right away
                    const jsonLine: Object = JSON.parse(rawLine);
                    return jsonLine;
                } catch {
                    // If not a JSON string, then needs to parse into one
                    // First replaces every single quote into a doublequote
                    let jsonString = rawLine.replace(/(')/g, '"');
                    // Then doublequotes every single property
                    // e.g. `type:` -> `"type":`
                    jsonString = jsonString.replace(/(\w+:)/g, (s) => {
                        return `"${s.substring(0, s.length-1)}":`;
                    });
                    try {
                        const jsonLine: Object = JSON.parse(jsonString);
                        return jsonLine;
                    } catch {
                        // If input still can't be parsed to JSON then ignores line
                        console.error(`Input line ${index} is not correctly formatted. Ignoring`);
                        return ''
                    }
                }
            })
            .filter((line) => line !== ''); // remove ignored lines
    }

}
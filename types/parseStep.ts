import { parseScript } from "./Script";
import { parseJob } from "./Job";
import Step from "./Step";

export function parseStep (value: any): Step | undefined {
    return (
        parseScript(value)
        ?? parseJob(value)
    );
}

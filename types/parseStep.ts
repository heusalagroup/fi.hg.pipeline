import { parseScript } from "./Script";
import { parseJob } from "./Job";
import Step from "./Step";
import { parseJsonStep } from "./JsonStep";

export function parseStep (value: any): Step | undefined {
    return (
        parseScript(value)
        ?? parseJsonStep(value)
        ?? parseJob(value)
    );
}

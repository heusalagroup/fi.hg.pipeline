import { parseScript } from "./Script";
import { parseJob } from "./Job";
import Step from "./Step";
import { parseJsonStep } from "./JsonStep";
import { parseCsvStep } from "./CsvStep";

export function parseStep (value: any): Step | undefined {
    return (
        parseScript(value)
        ?? parseCsvStep(value)
        ?? parseJsonStep(value)
        ?? parseJob(value)
    );
}

// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Script, { isScript, parseScript, stringifyScript } from "./Script";
import Task, { isTask, stringifyTask } from "./Task";
import { parseJob } from "./Job";


export interface Step {

    readonly name : string;

}


export function isStep (value: any): value is Step {

    if ( isScript(value) ) {
        return true;
    }

    return !!isTask(value);

}

export function stringifyStep (value: Step): string {

    if ( !isStep(value) ) throw new TypeError(`Not Step: ${value}`);

    if ( isScript(value) ) {
        return stringifyScript(value);
    }

    if ( isTask(value) ) {
        return stringifyTask(value);
    }

    throw new TypeError(`Unknown step: ${value}`);

}

export function parseStep (value: any): Step | undefined {
    return (
        parseScript(value)
        ?? parseJob(value)
    );
}

// eslint-disable-next-line
export namespace Step {

    export function test (value: any): value is Step {
        return isStep(value);
    }

    export function stringify (value: Step): string {
        return stringifyStep(value);
    }

    export function parse (value: any): Step | undefined {
        return parseStep(value);
    }

    export function copy (value : Step) : Step {

        if ( isScript(value) ) {
            return Script.copy(value);
        }

        if ( isTask(value) ) {
            return Task.copy(value);
        }

        throw new TypeError(`Cannot copy unknown step: ${value}`);

    }

}

export default Step;

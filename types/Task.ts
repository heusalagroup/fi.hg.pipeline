// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Step from "./Step";
import { isRegularObject } from "../../ts/modules/lodash";
import { isName } from "./Name";

export interface Task extends Step {

    readonly name     : string;

}

export function isTask (value: any): value is Task {
    return (
        isRegularObject(value)
        && isName(value?.name)
    );
}

export function stringifyTask (value: Task): string {
    if ( !isTask(value) ) throw new TypeError(`Not Task: ${value}`);
    return `Task#${value.name}`;
}

export function parseTask (value: any): Task | undefined {
    if ( isTask(value) ) return value;
    return undefined;
}

// eslint-disable-next-line
export namespace Task {

    export function test (value: any): value is Task {
        return isTask(value);
    }

    export function stringify (value: Task): string {
        return stringifyTask(value);
    }

    export function parse (value: any): Task | undefined {
        return parseTask(value);
    }

    export function copy (value : Task) : Task {
        return {...value};
    }

}

export default Task;

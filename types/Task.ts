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

export function copyTask (value : Task) : Task {
    return {...value};
}

export default Task;

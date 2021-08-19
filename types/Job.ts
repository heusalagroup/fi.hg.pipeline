// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Step, { isStep } from "./Step";
import { hasNoOtherKeys, isArrayOf, isRegularObject } from "../../ts/modules/lodash";
import { isName } from "./Name";


export interface Job {

    readonly name  : string;
    readonly steps : readonly Step[];

}


export function isJob (value: any): value is Job {
    return (
        isRegularObject(value)
        && isName(value?.name)
        && isArrayOf(value?.steps, isStep, 1)
        && hasNoOtherKeys(value, ['name', 'steps'])
    );
}

export function stringifyJob (value: Job): string {

    if ( !isJob(value) ) throw new TypeError(`Not Job: ${value}`);

    return `Job#${ value.name }`;

}

export function parseJob (value: any): Job | undefined {
    if ( isJob(value) ) return value;
    return undefined;
}

export default Job;

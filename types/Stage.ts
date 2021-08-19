// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Job, { isJob } from "./Job";
import { hasNoOtherKeys, isArrayOf, isRegularObject } from "../../ts/modules/lodash";
import Name, { isName } from "./Name";

export interface Stage {

    readonly name : Name;
    readonly jobs : readonly Job[];

}

export function isStage (value: any): value is Stage {
    return (
        isRegularObject(value)
        && isName(value?.name)
        && isArrayOf(value?.jobs, isJob, 1)
        && hasNoOtherKeys(value, ['name', 'jobs'])
    );
}

export function stringifyStage (value: Stage): string {
    if ( !isStage(value) ) throw new TypeError(`Not Stage: ${value}`);
    return `Stage#${value.name}`;
}

export function parseStage (value: any): Stage | undefined {
    if ( isStage(value) ) return value;
    return undefined;
}

export default Stage;

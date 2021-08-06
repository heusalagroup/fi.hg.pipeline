// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Job, { isJob } from "./Job";
import { hasNoOtherKeys, isArray, isArrayOf, isRegularObject, map } from "../../ts/modules/lodash";
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

// eslint-disable-next-line
export namespace Stage {

    export function test (value: any): value is Stage {
        return isStage(value);
    }

    export function stringify (value: Stage): string {
        return stringifyStage(value);
    }

    export function parse (value: any): Stage | undefined {
        return parseStage(value);
    }

    export function copy (value : Stage) : Stage {
        return {
            name: value.name,
            jobs: map(value.jobs, Job.copy)
        };
    }

}

export default Stage;

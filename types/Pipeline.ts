// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Stage, { isStage } from "./Stage";
import { hasNoOtherKeys, isArray, isRegularObject, map } from "../../ts/modules/lodash";
import { isName } from "./Name";


export interface Pipeline {

    readonly name   : string;
    readonly stages : readonly Stage[];

}


export function isPipeline (value: any): value is Pipeline {
    return (
        isRegularObject(value)
        && isName(value?.name)
        && isArray(value?.stages, isStage, 1)
        && hasNoOtherKeys(value, ['name', 'stages'])
    );
}

export function stringifyPipeline (value: Pipeline): string {

    if ( !isPipeline(value) ) throw new TypeError(`Not Pipeline: ${value}`);

    return `Pipeline#${value.name}`;

}

export function parsePipeline (value: any): Pipeline | undefined {
    if ( isPipeline(value) ) return value;
    return undefined;
}

// eslint-disable-next-line
export namespace Pipeline {

    export function test (value: any): value is Pipeline {
        return isPipeline(value);
    }

    export function stringify (value: Pipeline): string {
        return stringifyPipeline(value);
    }

    export function parse (value: any): Pipeline | undefined {
        return parsePipeline(value);
    }

    export function copy (value : Pipeline) : Pipeline {
        return {
            name: value.name,
            stages: map(value.stages, Stage.copy)
        };
    }

}

export default Pipeline;

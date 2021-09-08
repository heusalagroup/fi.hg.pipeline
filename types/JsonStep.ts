// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Step from "./Step";
import {
    concat,
    hasNoOtherKeys,
    isStringOrUndefined
} from "../../ts/modules/lodash";
import Name, { isName } from "./Name";
import { BASE_PIPELINE_KEYS, isBasePipelineModel } from "./BasePipelineModel";
import { isReadonlyJsonAny, ReadonlyJsonAny } from "../../ts/Json";

export const SCRIPT_STEP_KEYS = concat(BASE_PIPELINE_KEYS, [
    'name',
    'json',
    'action',
    'output'
]);

export interface JsonStep extends Step {

    readonly name     : Name;
    readonly json     : ReadonlyJsonAny;
    readonly action  ?: string;
    readonly output  ?: string;

}

export function isJsonStep (value: any): value is JsonStep {
    return (
        isBasePipelineModel(value)
        && isName(value?.name)
        && isReadonlyJsonAny(value?.json)
        && isStringOrUndefined(value?.action)
        && isStringOrUndefined(value?.output)
        && hasNoOtherKeys(value, SCRIPT_STEP_KEYS)
    );
}

export function stringifyJsonStep (value: JsonStep): string {
    if ( !isJsonStep(value) ) throw new TypeError(`Not JsonStep: ${value}`);
    return `JsonStep#${value.name}`;
}

export function parseJsonStep (value: any): JsonStep | undefined {

    if ( isJsonStep(value) ) return value;

    return undefined;

}

export default JsonStep;

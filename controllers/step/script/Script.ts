// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Step from "../../../types/Step";
import {
    concat,
    hasNoOtherKeys,
    isArrayOrUndefinedOf,
    isRegularObjectOrUndefinedOf,
    isString
} from "../../../../ts/modules/lodash";
import Name, { isName } from "../../../types/Name";
import { BASE_PIPELINE_KEYS, isBasePipelineModel } from "../../../types/BasePipelineModel";

export const SCRIPT_STEP_KEYS = concat(BASE_PIPELINE_KEYS, [
    'name',
    'command',
    'args',
    'env'
]);

export interface Script extends Step {

    readonly name     : Name;
    readonly command  : string;
    readonly args    ?: string[];
    readonly env     ?: {readonly [key: string]: string};

}

export function isScript (value: any): value is Script {
    return (
        isBasePipelineModel(value)
        && isName(value?.name)
        && isString(value?.command)
        && isArrayOrUndefinedOf(value?.args, isString)
        && isRegularObjectOrUndefinedOf<string, string>(value?.env, isString, isString)
        && hasNoOtherKeys(value, SCRIPT_STEP_KEYS)
    );
}

export function stringifyScript (value: Script): string {
    if ( !isScript(value) ) throw new TypeError(`Not Script: ${value}`);
    return `Script#${value.name}`;
}

export function parseScript (value: any): Script | undefined {

    if ( isScript(value) ) return value;

    return undefined;

}

export default Script;

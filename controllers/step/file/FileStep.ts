// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Step from "../../../types/Step";
import {
    concat,
    hasNoOtherKeys,
    isStringOrUndefined
} from "../../../../ts/modules/lodash";
import Name, { isName } from "../../../types/Name";
import { BASE_PIPELINE_KEYS, isBasePipelineModel } from "../../../types/BasePipelineModel";
import { isReadonlyJsonAny, ReadonlyJsonAny } from "../../../../ts/Json";

export const SCRIPT_STEP_KEYS = concat(BASE_PIPELINE_KEYS, [
    'name',
    'file',
    'target',
    'output'
]);

export interface FileStep extends Step {

    readonly name     : Name;
    readonly file     : ReadonlyJsonAny;
    readonly target  ?: string;
    readonly output  ?: string;

}

export function isFileStep (value: any): value is FileStep {
    return (
        isBasePipelineModel(value)
        && isName(value?.name)
        && isReadonlyJsonAny(value?.file)
        && isStringOrUndefined(value?.target)
        && isStringOrUndefined(value?.output)
        && hasNoOtherKeys(value, SCRIPT_STEP_KEYS)
    );
}

export function stringifyFileStep (value: FileStep): string {
    if ( !isFileStep(value) ) throw new TypeError(`Not FileStep: ${value}`);
    return `FileStep#${value.name}`;
}

export function parseFileStep (value: any): FileStep | undefined {

    if ( isFileStep(value) ) return value;

    return undefined;

}

export default FileStep;

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
    'csv',
    'action',
    'output'
]);

export interface CsvStep extends Step {

    readonly name     : Name;
    readonly csv      : ReadonlyJsonAny;
    readonly action  ?: string;
    readonly output  ?: string;

}

export function isCsvStep (value: any): value is CsvStep {
    return (
        isBasePipelineModel(value)
        && isName(value?.name)
        && isReadonlyJsonAny(value?.csv)
        && isStringOrUndefined(value?.action)
        && isStringOrUndefined(value?.output)
        && hasNoOtherKeys(value, SCRIPT_STEP_KEYS)
    );
}

export function stringifyCsvStep (value: CsvStep): string {
    if ( !isCsvStep(value) ) throw new TypeError(`Not csv: ${value}`);
    return `csv#${value.name}`;
}

export function parseCsvStep (value: any): CsvStep | undefined {
    if ( isCsvStep(value) ) return value;
    return undefined;
}

export default CsvStep;

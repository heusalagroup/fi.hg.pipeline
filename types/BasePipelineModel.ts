// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isRegularObject, isString, isUndefined } from "../../core/modules/lodash";
import PipelineParameterArray, { isPipelineParameterArray } from "./PipelineParameterArray";
import VariablesModel, { isVariablesModel } from "./VariablesModel";
import { ReadonlyJsonAny } from "../../core/Json";

export interface BasePipelineModel {

    readonly name        : string;
    readonly parameters ?: PipelineParameterArray | undefined;
    readonly variables  ?: VariablesModel | undefined;

    readonly [key: string]: ReadonlyJsonAny | undefined;

}

export const BASE_PIPELINE_KEYS = [
    'name',
    'parameters',
    'variables'
];

export function isBasePipelineModel (value: any): value is BasePipelineModel {
    return (
        isRegularObject(value)
        && ( isString(value?.name) )
        && ( isUndefined(value?.parameters) || isPipelineParameterArray(value?.parameters) )
        && ( isUndefined(value?.variables)  || isVariablesModel(value?.variables)   )
    );
}

export default BasePipelineModel;

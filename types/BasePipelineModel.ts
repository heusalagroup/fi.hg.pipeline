// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isRegularObject, isUndefined } from "../../ts/modules/lodash";
import PipelineParametersModel, { isPipelineParametersModel } from "./PipelineParametersModel";
import VariablesModel, { isVariablesModel } from "./VariablesModel";
import { ReadonlyJsonAny } from "../../ts/Json";

export interface BasePipelineModel {

    readonly parameters ?: PipelineParametersModel | undefined;
    readonly variables  ?: VariablesModel | undefined;

    readonly [key: string]: ReadonlyJsonAny | undefined;

}

export const BASE_PIPELINE_KEYS = [
    'parameters',
    'variables'
];

export function isBasePipelineModel (value: any): value is BasePipelineModel {
    return (
        isRegularObject(value)
        && ( isUndefined(value?.parameters) || isPipelineParametersModel(value?.parameters) )
        && ( isUndefined(value?.variables)  || isVariablesModel(value?.variables)   )
    );
}

export default BasePipelineModel;

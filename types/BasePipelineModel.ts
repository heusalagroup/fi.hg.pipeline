// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isRegularObject, isUndefined } from "../../ts/modules/lodash";
import ParametersModel, { isParametersModel } from "./ParametersModel";
import VariablesModel, { isVariablesModel } from "./VariablesModel";
import { ReadonlyJsonAny } from "../../ts/Json";

export interface BasePipelineModel {

    readonly parameters ?: ParametersModel | undefined;
    readonly variables  ?: VariablesModel | undefined;

    readonly [key: string]: ReadonlyJsonAny | undefined;

}

export function isBasePipelineModel (value: any): value is BasePipelineModel {
    return (
        isRegularObject(value)
        && ( isUndefined(value?.parameters) || isParametersModel(value?.parameters) )
        && ( isUndefined(value?.variables)  || isVariablesModel(value?.variables)   )
    );
}

export default BasePipelineModel;

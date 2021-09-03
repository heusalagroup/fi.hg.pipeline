// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    isRegularObjectOf,
    isString
} from "../../ts/modules/lodash";

import { ReadonlyJsonObject } from "../../ts/Json";
import ParameterModel, { isParameterModel } from "../parameters/ParameterModel";

export interface PipelineParametersModel extends ReadonlyJsonObject {
    readonly [key: string]: ParameterModel;
}

export function isPipelineParametersModel (value: any): value is PipelineParametersModel {
    return (
        isRegularObjectOf<string, ParameterModel>(value, isString, isParameterModel)
    );
}

export function stringifyPipelineParametersModel (value: PipelineParametersModel): string {
    return `ParametersModel(${value})`;
}

export function parsePipelineParametersModel (value: any): PipelineParametersModel | undefined {
    if ( isPipelineParametersModel(value) ) return value;
    return undefined;
}

export default PipelineParametersModel;

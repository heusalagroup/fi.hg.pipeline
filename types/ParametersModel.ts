// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    isRegularObjectOf,
    isString
} from "../../ts/modules/lodash";

import ParameterPropertyModel, { isParameterPropertyModel } from "./ParameterPropertyModel";
import { ReadonlyJsonObject } from "../../ts/Json";

export interface ParametersModel extends ReadonlyJsonObject {
    readonly [key: string]: ParameterPropertyModel;
}

export function isParametersModel (value: any): value is ParametersModel {
    return (
        isRegularObjectOf<string, ParameterPropertyModel>(value, isString, isParameterPropertyModel)
    );
}

export function stringifyParametersModel (value: ParametersModel): string {
    return `ParametersModel(${value})`;
}

export function parseParametersModel (value: any): ParametersModel | undefined {
    if ( isParametersModel(value) ) return value;
    return undefined;
}

export default ParametersModel;

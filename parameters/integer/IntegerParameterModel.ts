// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import ParameterType from "../types/ParameterType";
import {
    hasNoOtherKeys,
    isNumberOrUndefined,
    isRegularObject,
    isString,
    isStringOrUndefined
} from "../../../core/modules/lodash";
import { parseJson } from "../../../core/Json";
import BaseParameterModel from "../types/BaseParameterModel";

export interface IntegerParameterModel extends BaseParameterModel {

    readonly type         : ParameterType.INTEGER;
    readonly name         : string;
    readonly displayName ?: string;
    readonly default     ?: number;

}

export function isIntegerParameterModel (value: any): value is IntegerParameterModel {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'type',
            'name',
            'displayName',
            'default'
        ])
        && value?.type === ParameterType.INTEGER
        && isString(value?.name)
        && isStringOrUndefined(value?.displayName)
        && isNumberOrUndefined(value?.default)
    );
}

export function stringifyIntegerParameterModel (value: IntegerParameterModel): string {
    return `IntegerParameterModel(${value})`;
}

export function parseIntegerParameterModel (value: any): IntegerParameterModel | undefined {
    if (value === undefined) return undefined;
    if (isString(value)) {
        value = parseJson(value);
    }
    if ( isIntegerParameterModel(value) ) return value;
    return undefined;
}

export default IntegerParameterModel;

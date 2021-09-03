// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import ParameterType from "../types/ParameterType";
import {
    hasNoOtherKeys,
    isRegularObject,
    isString,
    isStringOrUndefined,
    isUndefined
} from "../../../ts/modules/lodash";
import { isReadonlyJsonAny, parseJson, ReadonlyJsonAny } from "../../../ts/Json";
import BaseParameterModel from "../types/BaseParameterModel";

export interface JsonParameterModel extends BaseParameterModel {

    readonly type          : ParameterType.JSON;
    readonly name          : string;
    readonly displayName  ?: string;
    readonly default      ?: ReadonlyJsonAny;

}

export function isJsonParameterModel (value: any): value is JsonParameterModel {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'type',
            'name',
            'displayName',
            'default'
        ])
        && value?.type === ParameterType.JSON
        && isString(value?.name)
        && isStringOrUndefined(value?.displayName)
        && ( isUndefined(value?.default) || isReadonlyJsonAny(value?.default) )
    );
}

export function stringifyJsonParameterModel (value: JsonParameterModel): string {
    return `JsonParameterModel(${value})`;
}

export function parseJsonParameterModel (value: any): JsonParameterModel | undefined {
    if (value === undefined) return undefined;
    if (isString(value)) {
        value = parseJson(value);
    }
    if ( isJsonParameterModel(value) ) return value;
    return undefined;
}

export default JsonParameterModel;

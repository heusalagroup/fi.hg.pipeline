// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import ParameterType from "./ParameterType";
import {
    hasNoOtherKeys,
    isRegularObject,
    isString
} from "../../ts/modules/lodash";
import { ReadonlyJsonObject } from "../../ts/Json";

export interface StringStringParameterPropertyModel extends ReadonlyJsonObject {

    readonly type  : ParameterType.STRING;
    readonly value : string;

}

export function isStringParameterPropertyModel (value: any): value is StringStringParameterPropertyModel {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'type',
            'value'
        ])
        && value?.type === ParameterType.STRING
        && isString(value?.value)
    );
}

export function stringifyStringParameterPropertyModel (value: StringStringParameterPropertyModel): string {
    return `StringParameterPropertyModel(${value})`;
}

export function parseStringParameterPropertyModel (value: any): StringStringParameterPropertyModel | undefined {
    if ( isStringParameterPropertyModel(value) ) return value;
    return undefined;
}

export default StringStringParameterPropertyModel;

// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import ParameterType, { isParameterType } from "./ParameterType";
import { isReadonlyJsonAny, ReadonlyJsonAny, ReadonlyJsonObject } from "../../../core/Json";
import {
    isRegularObject,
    isString,
    isStringOrUndefined,
    isUndefined
} from "../../../core/modules/lodash";

export interface BaseParameterModel extends ReadonlyJsonObject {

    readonly type         : ParameterType;
    readonly name         : string;
    readonly displayName ?: string;
    readonly default     ?: ReadonlyJsonAny | undefined;

}

export function isBaseParameterModel (value: any): value is BaseParameterModel {
    return (
        isRegularObject(value)
        && isParameterType(value?.type)
        && isString(value?.name)
        && isStringOrUndefined(value?.displayName)
        && ( isUndefined(value?.default) || isReadonlyJsonAny(value?.default) )
    );
}

export default BaseParameterModel;

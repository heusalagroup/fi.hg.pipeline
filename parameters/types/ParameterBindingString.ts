// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    isString, trim
} from "../../../core/modules/lodash";
import { parseJson } from "../../../core/Json";

/**
 * Binding configuration for a resource outside of the Pipeline model.
 *
 * The value may be one of:
 *
 *   - Path to a variable or form field, eg. `@order.id`.
 *
 *   - The single `@` may be used to map to the root resource, if applicable for the use case.
 *
 *   - Static JSON value, eg. `="..."`, `=false`, `=true`, `=123`, `=-123`, `={...}`, `=[...]`
 *
 */
export type ParameterBindingString = string;


export function isParameterBindingString (value: any): value is ParameterBindingString {

    if ( !value || !isString(value) ) return false;

    const typeChar = value[0];
    const isJson = typeChar === '=';

    if ( !isJson && typeChar !== '@' ) return false;

    if (isJson) {
        const jsonString = trim(value.substr(1));
        if (jsonString === '') return false;
        return parseJson(jsonString) !== undefined;
    }

    return true;

}

export function stringifyParameterBindingString (value: ParameterBindingString): string {
    return `ParameterBindingString(${value})`;
}

export function parseParameterBindingString (value: any): ParameterBindingString | undefined {
    if ( isParameterBindingString(value) ) return value;
    return undefined;
}

export default ParameterBindingString;

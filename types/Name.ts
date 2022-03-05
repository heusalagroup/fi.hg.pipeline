// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isString, isStringOf, trim } from "../../core/modules/lodash";


export type Name = string;


export function isName (value: any): value is Name {
    return isStringOf(value, 1) && value.indexOf(' ') < 0;
}

export function stringifyName (value: Name): string {
    if ( !isName(value) ) throw new TypeError(`Not Name: ${value}`);
    return value;
}

export function parseName (value: any): Name | undefined {
    if (!isString(value)) return undefined;
    value = trim(value);
    if ( isName(value) ) return value;
    return undefined;
}

export default Name;

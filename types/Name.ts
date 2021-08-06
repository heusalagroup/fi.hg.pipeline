// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isString, trim } from "../../ts/modules/lodash";


export type Name = string;


export function isName (value: any): value is Name {
    return isString(value, 1) && value.indexOf(' ') < 0;
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

// eslint-disable-next-line
export namespace Name {

    export function test (value: any): value is Name {
        return isName(value);
    }

    export function stringify (value: Name): string {
        return stringifyName(value);
    }

    export function parse (value: any): Name | undefined {
        return parseName(value);
    }

}

export default Name;

// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Step from "./Step";
import {
    everyProperty,
    hasNoOtherKeys,
    isArrayOrUndefined,
    isRegularObject, isRegularObjectOrUndefined,
    isString, isUndefined
} from "../../ts/modules/lodash";
import { isName } from "./Name";

export interface Script extends Step {

    readonly name     : string;
    readonly command  : string;
    readonly args    ?: string[];
    readonly env     ?: {[key: string]: string};

}

export function isScript (value: any): value is Script {
    return (
        isRegularObject(value)
        && isName(value?.name)
        && isString(value?.command)
        && isArrayOrUndefined(value?.args, isString)
        && isRegularObjectOrUndefined<string, string>(value?.env, isString, isString)
        && hasNoOtherKeys(value, ['name', 'command', 'args', 'env'])
    );
}

export function stringifyScript (value: Script): string {
    if ( !isScript(value) ) throw new TypeError(`Not Script: ${value}`);
    return `Script#${value.name}`;
}

export function parseScript (value: any): Script | undefined {

    if ( isScript(value) ) return value;

    return undefined;

}

// eslint-disable-next-line
export namespace Script {

    export function test (value: any): value is Script {
        return isScript(value);
    }

    export function stringify (value: Script): string {
        return stringifyScript(value);
    }

    export function parse (value: any): Script | undefined {
        return parseScript(value);
    }

}

export default Script;

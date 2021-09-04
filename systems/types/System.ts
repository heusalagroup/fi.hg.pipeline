// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    isArrayOf,
    isRegularObject,
    isRegularObjectOf,
    isString
} from "../../../ts/modules/lodash";
import SystemProcess from "./SystemProcess";

export type SystemArgumentList = readonly string[];
export type SystemEnvironment  = {readonly [key: string]: string};

export function isSystemArgumentList (value : any) : value is SystemArgumentList {
    return isArrayOf(value, isString, 0);
}

export function isSystemEnvironment (value : any) : value is SystemEnvironment {
    return isRegularObjectOf<string, string>(value, isString, isString);
}

export interface System {

    createProcess(
        command : string,
        args    : SystemArgumentList | undefined,
        env     : SystemEnvironment  | undefined
    ) : SystemProcess;

}

export function isSystem (value: any): value is System {
    return (
        isRegularObject(value)
        //&& isString(value?.foo)
    );
}

export function stringifySystem (value: System): string {
    return `System(${value})`;
}

export function parseSystem (value: any): System | undefined {
    if ( isSystem(value) ) return value;
    return undefined;
}

export default System;

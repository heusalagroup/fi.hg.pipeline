// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isRegularObject,
    isString,
    startsWith,
    trim
} from "../../../ts/modules/lodash";
import RunnerResource from "./RunnerResource";
import RunnerResourceType from "./RunnerResourceType";

export interface LocalRunnerResource extends RunnerResource {

    readonly type : RunnerResourceType.LOCAL;
    readonly path : string;

}

export function isLocalRunnerResource (value: any): value is LocalRunnerResource {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'type',
            'path'
        ])
        && value?.type === RunnerResourceType.LOCAL
        && isString(value?.path)
    );
}

export function stringifyLocalRunnerResource (value: LocalRunnerResource): string {
    return `LocalRunnerResource(${value})`;
}

export function parseLocalRunnerResource (value: any): LocalRunnerResource | undefined {

    if ( !value ) return undefined;
    if ( isLocalRunnerResource(value) ) return value;

    value = trim(`${value}`);

    if (startsWith(value.toLowerCase(), 'file://')) {
        value = value.substr('file://'.length);
    }

    if (!value) return undefined;

    return {
        type: RunnerResourceType.LOCAL,
        path: value
    } as LocalRunnerResource;

}

export default LocalRunnerResource;

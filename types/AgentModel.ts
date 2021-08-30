// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isRegularObject,
    isString,
    isStringOrUndefined
} from "../../ts/modules/lodash";

export interface AgentModel {

    readonly name : string;

}

export function isAgentModel (value: any): value is AgentModel {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'name'
        ])
        && isString(value?.name)
    );
}

export function isPartialAgentModel (value: any): value is Partial<AgentModel> {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'name'
        ])
        && isStringOrUndefined(value?.name)
    );
}

export function stringifyAgentModel (value: AgentModel): string {
    return `AgentModel(${value})`;
}

export function parseAgentModel (value: any): AgentModel | undefined {
    const name = `${value?.name}`;
    return {name};
}

export default AgentModel;

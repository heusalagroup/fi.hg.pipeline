// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isRegularObject,
    isString,
    isStringOrUndefined
} from "../../ts/modules/lodash";

export interface AgentPoolModel {

    readonly name : string;

}

export function isAgentPoolModel (value: any): value is AgentPoolModel {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'name'
        ])
        && isString(value?.name)
    );
}

export function isPartialAgentPoolModel (value: any): value is Partial<AgentPoolModel> {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'name'
        ])
        && isStringOrUndefined(value?.name)
    );
}

export function stringifyAgentPoolModel (value: AgentPoolModel): string {
    return `AgentModel(${value})`;
}

export function parseAgentPoolModel (value: any): AgentPoolModel | undefined {
    const name = `${value?.name}`;
    return {name};
}

export default AgentPoolModel;

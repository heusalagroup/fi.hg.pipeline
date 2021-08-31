// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isRegularObject,
    isString,
    isStringOrUndefined
} from "../../ts/modules/lodash";

export interface AgentAccountModel {

    readonly username  : string;

}

export function isAgentAccountModel (value: any): value is AgentAccountModel {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'username'
        ])
        && isString(value?.username)
    );
}

export function isPartialAgentAccountModel (value: any): value is Partial<AgentAccountModel> {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'username'
        ])
        && isStringOrUndefined(value?.username)
    );
}

export function stringifyAgentAccountModel (value: AgentAccountModel): string {
    return `AgentModel(${value})`;
}

export function parseAgentAccountModel (value: any): AgentAccountModel | undefined {
    const username = value?.username ? `${value?.username}` : undefined;
    if (!username) return undefined;
    return {
        username: username
    };
}

export default AgentAccountModel;

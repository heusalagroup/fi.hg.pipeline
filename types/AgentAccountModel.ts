// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isRegularObject,
    isString,
    isStringOrUndefined
} from "../../ts/modules/lodash";

export interface AgentAccountModel {

    readonly username     : string;
    readonly displayName ?: string;

}

export function isAgentAccountModel (value: any): value is AgentAccountModel {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'username',
            'displayName'
        ])
        && isString(value?.username)
        && isStringOrUndefined(value?.displayName)
    );
}

export function isPartialAgentAccountModel (value: any): value is Partial<AgentAccountModel> {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'username',
            'displayName'
        ])
        && isStringOrUndefined(value?.username)
        && isStringOrUndefined(value?.displayName)
    );
}

export function stringifyAgentAccountModel (value: AgentAccountModel): string {
    return `AgentModel(${value})`;
}

export function parseAgentAccountModel (value: any): AgentAccountModel | undefined {
    const username = value?.username ? `${value?.username}` : undefined;
    if (!username) return undefined;
    const displayName = value?.displayName ? `${value?.displayName}` : undefined;
    return {
        username: username,
        displayName: displayName
    };
}

export default AgentAccountModel;

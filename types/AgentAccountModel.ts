// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isRegularObject,
    isString,
    isStringOrUndefined
} from "../../ts/modules/lodash";

export interface AgentAccountModel {

    readonly name : string;

}

export function isAgentAccountModel (value: any): value is AgentAccountModel {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'name'
        ])
        && isString(value?.name)
    );
}

export function isPartialAgentAccountModel (value: any): value is Partial<AgentAccountModel> {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'name'
        ])
        && isStringOrUndefined(value?.name)
    );
}

export function stringifyAgentAccountModel (value: AgentAccountModel): string {
    return `AgentModel(${value})`;
}

export function parseAgentAccountModel (value: any): AgentAccountModel | undefined {
    const name = `${value?.name}`;
    return {name};
}

export default AgentAccountModel;

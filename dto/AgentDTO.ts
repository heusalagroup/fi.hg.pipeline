// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isRegularObject,
    isString,
    isStringOrUndefined
} from "../../ts/modules/lodash";

export interface AgentDTO {

    readonly name : string;

}

export function isAgentDTO (value: any): value is AgentDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'name'
        ])
        && isString(value?.name)
    );
}

export function isPartialAgentDTO (value: any): value is Partial<AgentDTO> {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'name'
        ])
        && isStringOrUndefined(value?.name)
    );
}

export function stringifyAgentDTO (value: AgentDTO): string {
    return `AgentDTO(${value})`;
}

export function parseAgentDTO (value: any): AgentDTO | undefined {
    const name = `${value?.name}`;
    return {name};
}

export default AgentDTO;

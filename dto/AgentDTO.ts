// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isRegularObject,
    isUndefined
} from "../../ts/modules/lodash";

import AgentModel, { isAgentModel, parseAgentModel } from "../types/AgentModel";

export interface AgentDTO {

    readonly model : AgentModel;

}

export function isAgentDTO (value: any): value is AgentDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'model'
        ])
        && isAgentModel(value?.model)
    );
}

export function isPartialAgentDTO (value: any): value is Partial<AgentDTO> {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'model'
        ])
        && ( isUndefined(value?.model) || isAgentModel(value?.model) )
    );
}

export function stringifyAgentDTO (value: AgentDTO): string {
    return `AgentDTO(${value})`;
}

export function parseAgentDTO (value: any): AgentDTO | undefined {
    const model : AgentModel | undefined = parseAgentModel(value?.model);
    if (model === undefined) return undefined;
    return {model};
}

export default AgentDTO;

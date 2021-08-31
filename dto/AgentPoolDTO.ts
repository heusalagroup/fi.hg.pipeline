// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isRegularObject,
    isUndefined
} from "../../ts/modules/lodash";

import AgentModel, { isAgentModel, parseAgentModel } from "../types/AgentModel";

export interface AgentPoolDTO {

    readonly model : AgentModel;

}

export function isAgentPoolDTO (value: any): value is AgentPoolDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'model'
        ])
        && isAgentModel(value?.model)
    );
}

export function isPartialAgentPoolDTO (value: any): value is Partial<AgentPoolDTO> {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'model'
        ])
        && ( isUndefined(value?.model) || isAgentModel(value?.model) )
    );
}

export function stringifyAgentPoolDTO (value: AgentPoolDTO): string {
    return `AgentDTO(${value})`;
}

export function parseAgentPoolDTO (value: any): AgentPoolDTO | undefined {
    const model : AgentModel | undefined = parseAgentModel(value?.model);
    if (model === undefined) return undefined;
    return {model};
}

export default AgentPoolDTO;

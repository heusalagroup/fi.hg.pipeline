// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isRegularObject,
    isUndefined
} from "../../ts/modules/lodash";

import AgentPoolModel, { isAgentPoolModel, parseAgentPoolModel } from "../types/AgentPoolModel";

export interface AgentAccountDTO {

    readonly model : AgentPoolModel;

}

export function isAgentAccountDTO (value: any): value is AgentAccountDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'model'
        ])
        && isAgentPoolModel(value?.model)
    );
}

export function isPartialAgentAccountDTO (value: any): value is Partial<AgentAccountDTO> {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'model'
        ])
        && ( isUndefined(value?.model) || isAgentPoolModel(value?.model) )
    );
}

export function stringifyAgentAccountDTO (value: AgentAccountDTO): string {
    return `AgentDTO(${value})`;
}

export function parseAgentAccountDTO (value: any): AgentAccountDTO | undefined {
    const model : AgentPoolModel | undefined = parseAgentPoolModel(value?.model);
    if (model === undefined) return undefined;
    return {model};
}

export default AgentAccountDTO;

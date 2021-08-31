// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isRegularObject,
    isStringOrUndefined,
    isUndefined,
    parseString
} from "../../ts/modules/lodash";

import AgentAccountModel, { isAgentAccountModel, parseAgentAccountModel } from "../types/AgentAccountModel";

export interface AgentAccountDTO {

    readonly id    ?: string;
    readonly model  : AgentAccountModel;

}

export function isAgentAccountDTO (value: any): value is AgentAccountDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'id',
            'model'
        ])
        && isStringOrUndefined(value?.id)
        && isAgentAccountModel(value?.model)
    );
}

export function isPartialAgentAccountDTO (value: any): value is Partial<AgentAccountDTO> {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'id',
            'model'
        ])
        && isStringOrUndefined(value?.id)
        && ( isUndefined(value?.model) || isAgentAccountModel(value?.model) )
    );
}

export function stringifyAgentAccountDTO (value: AgentAccountDTO): string {
    return `AgentDTO(${value})`;
}

export function parseAgentAccountDTO (value: any): AgentAccountDTO | undefined {

    const id = parseString(value?.id);

    const model : AgentAccountModel | undefined = parseAgentAccountModel(value?.model);
    if (model === undefined) return undefined;

    return {id, model};

}

export default AgentAccountDTO;

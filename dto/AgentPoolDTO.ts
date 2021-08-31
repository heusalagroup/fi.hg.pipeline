// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    filter,
    hasNoOtherKeys,
    isArray,
    isArrayOrUndefinedOf,
    isRegularObject,
    isStringOrUndefined,
    isUndefined,
    map,
    parseString
} from "../../ts/modules/lodash";

import AgentPoolModel, { isAgentPoolModel, parseAgentPoolModel } from "../types/AgentPoolModel";
import AgentAccountDTO, { isAgentAccountDTO, parseAgentAccountDTO } from "./AgentAccountDTO";

export interface AgentPoolDTO {

    readonly id       ?: string;
    readonly model     : AgentPoolModel;
    readonly accounts ?: AgentAccountDTO[];

}

export function isAgentPoolDTO (value: any): value is AgentPoolDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'id',
            'model',
            'accounts'
        ])
        && isStringOrUndefined(value?.id)
        && isAgentPoolModel(value?.model)
        && isArrayOrUndefinedOf<AgentAccountDTO>(value?.accounts, isAgentAccountDTO)
    );
}

export function isPartialAgentPoolDTO (value: any): value is Partial<AgentPoolDTO> {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'id',
            'model',
            'accounts'
        ])
        && isStringOrUndefined(value?.id)
        && ( isUndefined(value?.model) || isAgentPoolModel(value?.model) )
        && isArrayOrUndefinedOf<AgentAccountDTO>(value?.accounts, isAgentAccountDTO)
    );
}

export function stringifyAgentPoolDTO (value: AgentPoolDTO): string {
    return `AgentDTO(${value})`;
}

export function parseAgentPoolDTO (value: any): AgentPoolDTO | undefined {

    const id = parseString(value?.id);

    const model : AgentPoolModel | undefined = parseAgentPoolModel(value?.model);
    if (model === undefined) return undefined;

    let accounts : any = value?.accounts;

    if (isArray(accounts)) {
        accounts = filter(map(accounts, item => parseAgentAccountDTO(item)), item => !!item);
        if (accounts.length === 0) {
            accounts = undefined;
        }
    } else {
        accounts = undefined;
    }

    return {id, model, accounts};

}

export default AgentPoolDTO;

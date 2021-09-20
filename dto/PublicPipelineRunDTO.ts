// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import {
    hasNoOtherKeys,
    isNumber,
    isRegularObject,
    isString,
    isStringOrUndefined,
    isUndefined,
    parseInteger,
    parseString
} from "../../ts/modules/lodash";
import ControllerStateDTO, { isControllerStateDTO } from "../controllers/types/ControllerStateDTO";

export interface PublicPipelineRunDTO {
    readonly id           : string;
    readonly version      : number;
    readonly accessToken ?: string;
    readonly state       ?: ControllerStateDTO;
}

export function isPublicPipelineRunDTO (value: any): value is PublicPipelineRunDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'id',
            'version',
            'accessToken',
            'state'
        ])
        && isString(value?.id)
        && isNumber(value?.version)
        && isStringOrUndefined(value?.accessToken)
        && ( isUndefined(value?.state) || isControllerStateDTO(value?.state) )
    );
}

export function stringifyPublicPipelineRunDTO (value: PublicPipelineRunDTO): string {
    return `PublicPipelineRunDTO(${value})`;
}

export function parsePublicPipelineRunDTO (value: any): PublicPipelineRunDTO | undefined {

    const id          = parseString(value?.id);
    if (!id) return undefined;

    const version     = parseInteger(value?.version);
    if (!version) return undefined;

    const accessToken = parseString(value?.accessToken);
    const state       = isControllerStateDTO(value?.model) ? value?.model : undefined;

    return {
        id,
        version,
        accessToken,
        state
    };

}

export default PublicPipelineRunDTO;

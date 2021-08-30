// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import ControllerType from "../types/ControllerType";
import ControllerState from "../types/ControllerState";
import { hasNoOtherKeys, isRegularObject } from "../../../ts/modules/lodash";
import ControllerStateDTO from "../types/ControllerStateDTO";
import JobControllerStateDTO from "../job/JobControllerStateDTO";

export interface StageControllerStateDTO extends ControllerStateDTO {

    readonly type  : ControllerType;
    readonly state : ControllerState;
    readonly name  : string;
    readonly jobs  : JobControllerStateDTO[];

}

export function isStageControllerStateDTO (value: any): value is StageControllerStateDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'type',
            'state',
            'name'
        ])
    );
}

export function stringifyStageControllerStateDTO (value: StageControllerStateDTO): string {
    return `StageStateDTO(${value})`;
}

export function parseStageControllerStateDTO (value: any): StageControllerStateDTO | undefined {
    return isStageControllerStateDTO(value) ? value : undefined;
}

export default StageControllerStateDTO;

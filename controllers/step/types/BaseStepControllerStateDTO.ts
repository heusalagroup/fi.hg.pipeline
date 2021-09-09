// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import ControllerType from "../../types/ControllerType";
import ControllerState from "../../types/ControllerState";
import { hasNoOtherKeys, isRegularObject } from "../../../../ts/modules/lodash";
import StepControllerStateDTO from "../types/StepControllerStateDTO";

export interface BaseStepControllerStateDTO extends StepControllerStateDTO {

    readonly type  : ControllerType;
    readonly state : ControllerState;
    readonly name  : string;

}

export function isBaseStepControllerStateDTO (value: any): value is BaseStepControllerStateDTO {
    return (
        isRegularObject(value)
        && hasNoOtherKeys(value, [
            'type',
            'state',
            'name'
        ])
    );
}

export function stringifyBaseStepControllerStateDTO (value: BaseStepControllerStateDTO): string {
    return `BaseStepStepStateDTO(${value})`;
}

export function parseBaseStepControllerStateDTO (value: any): BaseStepControllerStateDTO | undefined {
    return isBaseStepControllerStateDTO(value) ? value : undefined;
}

export default BaseStepControllerStateDTO;
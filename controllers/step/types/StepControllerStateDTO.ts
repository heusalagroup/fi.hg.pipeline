// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import ControllerType from "../../types/ControllerType";
import ControllerState from "../../types/ControllerState";
import { isRegularObject } from "../../../../core/modules/lodash";
import ControllerStateDTO from "../../types/ControllerStateDTO";

export interface StepControllerStateDTO extends ControllerStateDTO {

    readonly type  : ControllerType;
    readonly state : ControllerState;
    readonly name  : string;

}

export function isStepControllerStateDTO (value: any): value is StepControllerStateDTO {
    return (
        isRegularObject(value)
        // && hasNoOtherKeys(value, [
        //     'type',
        //     'state',
        //     'name'
        // ])
    );
}

export function stringifyStepControllerStateDTO (value: StepControllerStateDTO): string {
    return `StepStateDTO(${value})`;
}

export default StepControllerStateDTO;

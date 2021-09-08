// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import { isScript, stringifyScript } from "./Script";
import { isTask, stringifyTask } from "./Task";
import BasePipelineModel, { isBasePipelineModel } from "./BasePipelineModel";
import { isJsonStep, stringifyJsonStep } from "./JsonStep";

export interface Step extends BasePipelineModel {

    readonly name : string;

}

export function isStep (value: any): value is Step {
    if (!isBasePipelineModel(value)) return false;
    if ( isScript(value) ) return true;
    return !!isTask(value);
}

export function stringifyStep (value: Step): string {

    if ( !isStep(value) ) throw new TypeError(`Not Step: ${value}`);

    if ( isScript(value) ) {
        return stringifyScript(value);
    }

    if ( isJsonStep(value) ) {
        return stringifyJsonStep(value);
    }

    if ( isTask(value) ) {
        return stringifyTask(value);
    }

    throw new TypeError(`Unknown step: ${value}`);

}

export default Step;

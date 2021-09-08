// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

export enum ControllerType {
    PIPELINE      = 'fi.nor.pipeline',
    JOB           = 'fi.nor.pipeline.job',
    STAGE         = 'fi.nor.pipeline.stage',
    TASK          = 'fi.nor.pipeline.task',
    STEP          = 'fi.nor.pipeline.step',
    SCRIPT_STEP   = 'fi.nor.pipeline.step.script',
    JSON_STEP     = 'fi.nor.pipeline.step.json'
}

export function isControllerType (value: any): value is ControllerType {
    switch (value) {

        case ControllerType.PIPELINE:
        case ControllerType.JOB:
        case ControllerType.STAGE:
        case ControllerType.TASK:
        case ControllerType.STEP:
        case ControllerType.SCRIPT_STEP:
        case ControllerType.JSON_STEP:
            return true;

        default:
            return false;

    }
}

export function stringifyControllerType (value: ControllerType): string {
    switch (value) {
        case ControllerType.PIPELINE    : return 'PIPELINE';
        case ControllerType.JOB         : return 'JOB';
        case ControllerType.STAGE       : return 'STAGE';
        case ControllerType.TASK        : return 'TASK';
        case ControllerType.STEP        : return 'STEP';
        case ControllerType.SCRIPT_STEP : return 'SCRIPT_STEP';
        case ControllerType.JSON_STEP   : return 'JSON_STEP';
    }
    throw new TypeError(`Unsupported ControllerType value: ${value}`);
}

export function parseControllerType (value: any): ControllerType | undefined {

    if (value === undefined) return undefined;

    switch (`${value}`.toUpperCase()) {

        case 'PIPELINE'    : return ControllerType.PIPELINE;
        case 'JOB'         : return ControllerType.JOB;
        case 'STAGE'       : return ControllerType.STAGE;
        case 'TASK'        : return ControllerType.TASK;
        case 'STEP'        : return ControllerType.STEP;
        case 'SCRIPT_STEP' : return ControllerType.SCRIPT_STEP;
        case 'JSON_STEP'   : return ControllerType.JSON_STEP;

        default:
            return undefined;

    }

}

export default ControllerType;

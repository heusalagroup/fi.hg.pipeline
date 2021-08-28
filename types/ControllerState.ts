// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

export enum ControllerState {
    CONSTRUCTED,
    STARTED,
    PAUSED,
    CANCELLED,
    FINISHED,
    FAILED
}

export function isControllerState (value: any): value is ControllerState {
    switch (value) {
        case ControllerState.CONSTRUCTED:
        case ControllerState.STARTED:
        case ControllerState.PAUSED:
        case ControllerState.CANCELLED:
        case ControllerState.FINISHED:
        case ControllerState.FAILED:
            return true;

        default:
            return false;

    }
}

export function stringifyControllerState (value: ControllerState): string {
    switch (value) {
        case ControllerState.CONSTRUCTED  : return 'CONSTRUCTED';
        case ControllerState.STARTED  : return 'STARTED';
        case ControllerState.PAUSED  : return 'PAUSED';
        case ControllerState.CANCELLED  : return 'CANCELLED';
        case ControllerState.FINISHED  : return 'FINISHED';
        case ControllerState.FAILED  : return 'FAILED';
    }
    throw new TypeError(`Unsupported ControllerState value: ${value}`);
}

export function parseControllerState (value: any): ControllerState | undefined {

    switch (value) {

        case 'CONSTRUCTED' : return ControllerState.CONSTRUCTED;
        case 'STARTED' : return ControllerState.STARTED;
        case 'PAUSED' : return ControllerState.PAUSED;
        case 'CANCELLED' : return ControllerState.CANCELLED;
        case 'FINISHED' : return ControllerState.FINISHED;
        case 'FAILED' : return ControllerState.FAILED;

        default    : return undefined;

    }

}

export default ControllerState;

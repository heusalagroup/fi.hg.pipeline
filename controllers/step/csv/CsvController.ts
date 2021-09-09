// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Observer, { ObserverCallback, ObserverDestructor } from "../../../../ts/Observer";
import Json from "../../../../ts/Json";
import JsonAny, { isReadonlyJsonAny, ReadonlyJsonAny } from "../../../../ts/Json";
import Name, { isName } from "../../../types/Name";
import StepController from "../types/StepController";
import { isString, isUndefined } from "../../../../ts/modules/lodash";
import LogService from "../../../../ts/LogService";
import ControllerState from "../../types/ControllerState";
import CsvControllerStateDTO from "./CsvControllerStateDTO";
import ControllerType from "../../types/ControllerType";
import PipelineContext from "../../../PipelineContext";
import StringUtils from "../../../../ts/StringUtils";
import { isCsvControllerAction, CsvControllerAction } from "./CsvControllerAction";
import { isCsv, parseCsv, stringifyCsv } from "../../../../ts/Csv";

const LOG = LogService.createLogger('CsvController');

export enum CsvControllerEvent {

    CSV_STARTED   = "CsvController:scriptStarted",
    CSV_PAUSED    = "CsvController:scriptPaused",
    CSV_RESUMED   = "CsvController:scriptResumed",
    CSV_CANCELLED = "CsvController:scriptCancelled",
    CSV_FAILED    = "CsvController:scriptFailed",
    CSV_FINISHED  = "CsvController:scriptFinished",
    CSV_CHANGED   = "CsvController:scriptChanged"

}


export type CsvControllerEventCallback = ObserverCallback<CsvControllerEvent, [CsvController]>;

export type CsvControllerDestructor = ObserverDestructor;

export class CsvController implements StepController {

    private readonly _context        : PipelineContext;
    private readonly _observer       : Observer<CsvControllerEvent>;
    private readonly _name           : Name;
    private readonly _action         : string;
    private readonly _input          : ReadonlyJsonAny;
    private readonly _output         : string | undefined;

    private _state                   : ControllerState;
    private _compiledAction          : CsvControllerAction | undefined;
    private _compiledInput           : ReadonlyJsonAny      | undefined;
    private _compiledOutput          : string               | undefined;
    private _errorString             : string               | undefined;

    public constructor (
        context        : PipelineContext,
        name           : Name,
        input          : ReadonlyJsonAny,
        action         : string = CsvControllerAction.STRINGIFY,
        outputVariable : string | undefined = undefined
    ) {

        if ( !isName(name) ) throw new TypeError(`CSV name invalid: ${name}`);
        if ( !isString(action) ) throw new TypeError(`CSV#${name} must have a valid string: ${action}`);
        if ( !isReadonlyJsonAny(input) ) throw new TypeError(`CSV#${name} must have a valid input property: ${JSON.stringify(input)}`);
        if ( !isString(outputVariable) ) throw new TypeError(`CSV#${name} must have a valid output property: ${JSON.stringify(outputVariable)}`);

        this._context         = context;
        this._state           = ControllerState.CONSTRUCTED;
        this._name            = name;
        this._input           = input;
        this._action          = action ?? CsvControllerAction.STRINGIFY;
        this._output          = outputVariable;
        this._observer        = new Observer<CsvControllerEvent>(`CsvController#${name}`);
        this._compiledAction  = undefined;
        this._compiledInput   = undefined;
        this._compiledOutput  = undefined;

    }

    public destroy () {

        this._observer.destroy();

        if (this.isPaused()) {
            this.resume().stop();
        } else if (this.isRunning()) {
            this.stop();
        }

    }

    public getContext () : PipelineContext {
        return this._context;
    }

    public getState () : ControllerState {
        return this._state;
    }

    public getName () : Name {
        return this._name;
    }

    public on (name : CsvControllerEvent, callback: CsvControllerEventCallback) : CsvControllerDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public toString (): string {
        return `CsvController#${this._name}`;
    }

    public getStateDTO (): CsvControllerStateDTO {
        return {
            type: ControllerType.CSV_STEP,
            state : this._state,
            name: this._name
        };
    }

    public toJSON (): Json {
        return this.getStateDTO() as unknown as Json;
    }

    public isRunning () : boolean {
        switch (this._state) {

            case ControllerState.STARTED:
                return true;

            case ControllerState.PAUSED:
            case ControllerState.CONSTRUCTED:
            case ControllerState.CANCELLED:
            case ControllerState.FINISHED:
            case ControllerState.FAILED:
                return false;

        }
    }

    public isStarted () : boolean {
        switch (this._state) {

            case ControllerState.STARTED:
            case ControllerState.PAUSED:
                return true;

            case ControllerState.CONSTRUCTED:
            case ControllerState.CANCELLED:
            case ControllerState.FINISHED:
            case ControllerState.FAILED:
                return false;

        }
    }

    public isPaused () : boolean {
        switch (this._state) {

            case ControllerState.PAUSED:
                return true;

            case ControllerState.CONSTRUCTED:
            case ControllerState.STARTED:
            case ControllerState.CANCELLED:
            case ControllerState.FINISHED:
            case ControllerState.FAILED:
                return false;

        }
    }

    public isFinished () : boolean {
        switch (this._state) {

            case ControllerState.CANCELLED:
            case ControllerState.FINISHED:
            case ControllerState.FAILED:
                return true;

            case ControllerState.CONSTRUCTED:
            case ControllerState.STARTED:
            case ControllerState.PAUSED:
                return false;

        }
    }

    public isSuccessful () : boolean {
        switch (this._state) {

            case ControllerState.FINISHED:
                return true;

            case ControllerState.FAILED:
            case ControllerState.CANCELLED:
            case ControllerState.CONSTRUCTED:
            case ControllerState.STARTED:
            case ControllerState.PAUSED:
                return false;

        }
    }

    public isCancelled () : boolean {
        switch (this._state) {

            case ControllerState.CANCELLED:
                return true;

            case ControllerState.FINISHED:
            case ControllerState.FAILED:
            case ControllerState.CONSTRUCTED:
            case ControllerState.STARTED:
            case ControllerState.PAUSED:
                return false;

        }
    }

    public isFailed () : boolean {
        switch (this._state) {

            case ControllerState.FAILED:
                return true;

            case ControllerState.CANCELLED:
            case ControllerState.FINISHED:
            case ControllerState.CONSTRUCTED:
            case ControllerState.STARTED:
            case ControllerState.PAUSED:
                return false;

        }
    }

    public start () : CsvController {

        try {

            if (this._state !== ControllerState.CONSTRUCTED) {
                throw new Error(`CSV#${this._name} was already started`);
            }

            this._state = ControllerState.STARTED;

            const compiledAction = this._context.compileModel(this._action);
            if (!isCsvControllerAction(compiledAction)) {
                throw new Error(`CSV#${this._name} failed to compile the action property: ${StringUtils.toString(this._action)}`);
            }
            this._compiledAction = compiledAction;

            const compiledInput : ReadonlyJsonAny | undefined = this._context.compileModel(this._input);

            if (compiledAction === CsvControllerAction.STRINGIFY) {

                if (!isCsv(compiledInput)) {
                    throw new Error(`CSV#${this._name} failed to compile the input property as CSV: ${StringUtils.toString(this._input)}`);
                }
                this._compiledInput = compiledInput;

            } else {

                if (!isString(compiledInput)) {
                    throw new Error(`CSV#${this._name} failed to compile the input property as string: ${StringUtils.toString(this._input)}`);
                }
                this._compiledInput = compiledInput;

            }

            const compiledOutput : ReadonlyJsonAny | undefined = this._output ? this._context.compileModel(this._output) : undefined;
            if (!( isString(compiledOutput) || isUndefined(compiledOutput) )) {
                throw new Error(`CSV#${this._name} failed to compile the output property: ${StringUtils.toString(this._output)}`);
            }
            this._compiledOutput = compiledOutput;

            LOG.info(`Starting CSV action "${this._compiledAction}" for `, this._compiledInput);

            if (this._observer.hasCallbacks(CsvControllerEvent.CSV_STARTED)) {
                this._observer.triggerEvent(CsvControllerEvent.CSV_STARTED, this);
            }

            if (this._observer.hasCallbacks(CsvControllerEvent.CSV_CHANGED)) {
                this._observer.triggerEvent(CsvControllerEvent.CSV_CHANGED, this);
            }

            let result : ReadonlyJsonAny | JsonAny | undefined = undefined;
            switch (this._compiledAction) {

                case CsvControllerAction.STRINGIFY:
                    if (!isCsv(compiledInput)) throw new TypeError(`Value was not csv`);
                    result = stringifyCsv(compiledInput);
                    if (!isString(result)) {
                        throw new TypeError(`Failed to stringify CSV: ${result}`);
                    }
                    break;

                case CsvControllerAction.PARSE:
                    if (!isString(compiledInput)) throw new TypeError(`Value was not string`);
                    result = parseCsv(compiledInput);
                    if (!isCsv(result)) throw new TypeError(`Result was not csv: ${result}`);
                    break;

                default:
                    throw new TypeError(`Unknown action: ${this._compiledAction}`)

            }

            if (this._compiledOutput !== undefined) {
                LOG.info(`Saving output as variable "${this._compiledOutput}": `, result)
                this._context.setVariable(this._compiledOutput, result);
            } else {
                LOG.info(`No output target configured for result: `, result);
            }

            this._closeAction(undefined);

        } catch (err) {
            LOG.error(`Error: `, err);
            this._errorString = `${err}`;
            this._closeAction(err);
        }

        return this;

    }

    public pause () : CsvController {
        throw new Error(`CSV#${this._name} was not running`);
    }

    public resume () : CsvController {
        throw new Error(`CSV#${this._name} was not paused`);
    }

    public stop () : CsvController {
        throw new Error(`CSV#${this._name} was not started`);
    }

    public onStarted (callback: ObserverCallback<string, [CsvController]>) : CsvControllerDestructor {
        return this.on(CsvControllerEvent.CSV_STARTED, callback);
    }

    public onPaused (callback: ObserverCallback<string, [CsvController]>) : CsvControllerDestructor {
        return this.on(CsvControllerEvent.CSV_PAUSED, callback);
    }

    public onResumed (callback: ObserverCallback<string, [CsvController]>) : CsvControllerDestructor {
        return this.on(CsvControllerEvent.CSV_RESUMED, callback);
    }

    public onCancelled (callback: ObserverCallback<string, [CsvController]>) : CsvControllerDestructor {
        return this.on(CsvControllerEvent.CSV_CANCELLED, callback);
    }

    public onFailed (callback: ObserverCallback<string, [CsvController]>) : CsvControllerDestructor {
        return this.on(CsvControllerEvent.CSV_FAILED, callback);
    }

    public onFinished (callback: ObserverCallback<string, [CsvController]>) : CsvControllerDestructor {
        return this.on(CsvControllerEvent.CSV_FINISHED, callback);
    }

    public onChanged (callback: ObserverCallback<string, [CsvController]>) : CsvControllerDestructor {
        return this.on(CsvControllerEvent.CSV_CHANGED, callback);
    }

    public getErrorString () : string {
        return this._errorString ?? "";
    }

    public getOutputString () : string {
        return "";
    }

    public static Event = CsvControllerEvent;
    public static State = ControllerState;


    private _closeAction (err: any | undefined) {

        if (err === undefined) {

            this._state = ControllerState.FINISHED;
            if (this._observer.hasCallbacks(CsvControllerEvent.CSV_FINISHED)) {
                this._observer.triggerEvent(CsvControllerEvent.CSV_FINISHED, this);
            }

        } else {

            LOG.error(`Action failed: `, err);

            this._state = ControllerState.FAILED;
            if (this._observer.hasCallbacks(CsvControllerEvent.CSV_FAILED)) {
                this._observer.triggerEvent(CsvControllerEvent.CSV_FAILED, this);
            }

        }

        if (this._observer.hasCallbacks(CsvControllerEvent.CSV_CHANGED)) {
            this._observer.triggerEvent(CsvControllerEvent.CSV_CHANGED, this);
        }

    }

}

export function isCsvController (value: any) : value is CsvController {
    return value instanceof CsvController;
}

export default CsvController;

// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Observer, { ObserverCallback, ObserverDestructor } from "../../../../ts/Observer";
import Json, { ReadonlyJsonAny } from "../../../../ts/Json";
import Name, { isName } from "../../../types/Name";
import StepController from "../types/StepController";
import {
    isArrayOf,
    isRegularObjectOf,
    isString
} from "../../../../ts/modules/lodash";
import LogService from "../../../../ts/LogService";
import ControllerState from "../../types/ControllerState";
import ScriptControllerStateDTO from "./ScriptControllerStateDTO";
import ControllerType from "../../types/ControllerType";
import PipelineContext from "../../../PipelineContext";
import SystemProcess, {
    SystemProcessEvent,
    SystemProcessEventCallback
} from "../../../systems/types/SystemProcess";
import System, {
    isSystemArgumentList, isSystemEnvironment,
    SystemArgumentList,
    SystemEnvironment
} from "../../../systems/types/System";

const LOG = LogService.createLogger('ScriptController');

export enum ScriptControllerEvent {

    SCRIPT_STARTED   = "ScriptController:scriptStarted",
    SCRIPT_PAUSED    = "ScriptController:scriptPaused",
    SCRIPT_RESUMED   = "ScriptController:scriptResumed",
    SCRIPT_CANCELLED = "ScriptController:scriptCancelled",
    SCRIPT_FAILED    = "ScriptController:scriptFailed",
    SCRIPT_FINISHED  = "ScriptController:scriptFinished",
    SCRIPT_CHANGED   = "ScriptController:scriptChanged"

}

export type ScriptControllerEventCallback = ObserverCallback<ScriptControllerEvent, [ScriptController]>;

export type ScriptControllerDestructor = ObserverDestructor;

export class ScriptController implements StepController {

    private readonly _context        : PipelineContext;
    private readonly _observer       : Observer<ScriptControllerEvent>;
    private readonly _name           : Name;
    private readonly _command        : string;
    private readonly _args           : SystemArgumentList;
    private readonly _env            : SystemEnvironment;
    private readonly _closeCallback  : SystemProcessEventCallback;

    private _compiledCommand        : string             | undefined;
    private _compiledArgs           : SystemArgumentList | undefined;
    private _compiledEnv            : SystemEnvironment  | undefined;
    private _systemProcess          : SystemProcess      | undefined;
    private _state                  : ControllerState;

    public constructor (
        context  : PipelineContext,
        name     : Name,
        command  : string,
        args     : SystemArgumentList = [],
        env      : SystemEnvironment  = {}
    ) {

        if ( !isName(name) ) throw new TypeError(`Script name invalid: ${name}`);
        if ( !isString(command) ) throw new TypeError(`Script#${name} must have a valid command: ${command}`);
        if ( !isSystemArgumentList(args) ) throw new TypeError(`Script#${name} must have a valid args: ${JSON.stringify(args)}`);
        if ( !isSystemEnvironment(env) ) throw new TypeError(`Script#${name} must have a valid env: ${JSON.stringify(env)}`);

        this._context         = context;
        this._state           = ControllerState.CONSTRUCTED;
        this._name            = name;
        this._command         = command;
        this._args            = args;
        this._env             = env;
        this._observer        = new Observer<ScriptControllerEvent>(`ScriptController#${name}`);
        this._closeCallback   = this._onClose.bind(this);
        this._compiledCommand = undefined;
        this._compiledArgs    = undefined;
        this._compiledEnv     = undefined;
        this._systemProcess   = undefined;

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

    public on (name : ScriptControllerEvent, callback: ScriptControllerEventCallback) : ScriptControllerDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public toString (): string {
        return `ScriptController#${this._name}`;
    }

    public getStateDTO (): ScriptControllerStateDTO {
        return {
            type: ControllerType.SCRIPT_STEP,
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

    public start () : ScriptController {

        if (this._state !== ControllerState.CONSTRUCTED) {
            throw new Error(`Script#${this._name} was already started`);
        }

        LOG.info(`Starting command "${this._command} ${this._args.join(' ')}"`);

        this._state = ControllerState.STARTED;

        const compiledCommand = this._context.compileModel(this._command);
        if (!isString(compiledCommand)) {
            throw new Error(`Script#${this._name} failed to compile the command: ${this._command}`);
        }
        this._compiledCommand = compiledCommand;

        const compiledArgs : ReadonlyJsonAny | undefined = this._context.compileModel(this._args);
        if (!isArrayOf<string>(compiledArgs, isString)) {
            throw new Error(`Script#${this._name} failed to compile args: ${this._args.join(' ')}`);
        }
        this._compiledArgs = compiledArgs;

        const compiledEnv : ReadonlyJsonAny | undefined = this._context.compileModel(this._env);
        if (!isRegularObjectOf<string, string>(compiledEnv, isString, isString)) {
            throw new Error(`Script#${this._name} failed to compile environment: ${JSON.stringify(this._env, null, 2)}`);
        }
        this._compiledEnv = compiledEnv;

        const system : System = this._context.getSystem();

        this._systemProcess = system.createProcess(
            compiledCommand,
            compiledArgs,
            this._compiledEnv
        );

        this._systemProcess.on(
            SystemProcessEvent.ON_EXIT,
            this._closeCallback
        )

        this._systemProcess.start();

        if (this._observer.hasCallbacks(ScriptControllerEvent.SCRIPT_STARTED)) {
            this._observer.triggerEvent(ScriptControllerEvent.SCRIPT_STARTED, this);
        }

        if (this._observer.hasCallbacks(ScriptControllerEvent.SCRIPT_CHANGED)) {
            this._observer.triggerEvent(ScriptControllerEvent.SCRIPT_CHANGED, this);
        }

        return this;

    }

    public pause () : ScriptController {

        if ( !this.isRunning() ) {
            throw new Error(`Script#${this._name} was not running`);
        }

        if ( !this._systemProcess ) throw new Error(`No process initialized`);

        LOG.info(`Pausing command "${this._command} ${this._args.join(' ')}"`);

        this._state = ControllerState.PAUSED;

        this._systemProcess.pause();

        if (this._observer.hasCallbacks(ScriptControllerEvent.SCRIPT_PAUSED)) {
            this._observer.triggerEvent(ScriptControllerEvent.SCRIPT_PAUSED, this);
        }
        if (this._observer.hasCallbacks(ScriptControllerEvent.SCRIPT_CHANGED)) {
            this._observer.triggerEvent(ScriptControllerEvent.SCRIPT_CHANGED, this);
        }

        return this;

    }

    public resume () : ScriptController {

        if ( !this.isPaused() ) {
            throw new Error(`Script#${this._name} was not paused`);
        }

        if ( !this._systemProcess ) {
            throw new Error(`No process initialized`);
        }

        LOG.info(`Resuming command "${this._command} ${this._args.join(' ')}"`);

        this._state = ControllerState.STARTED;

        this._systemProcess.resume();

        if (this._observer.hasCallbacks(ScriptControllerEvent.SCRIPT_RESUMED)) {
            this._observer.triggerEvent(ScriptControllerEvent.SCRIPT_RESUMED, this);
        }
        if (this._observer.hasCallbacks(ScriptControllerEvent.SCRIPT_CHANGED)) {
            this._observer.triggerEvent(ScriptControllerEvent.SCRIPT_CHANGED, this);
        }

        return this;

    }

    public stop () : ScriptController {

        if ( this._state !== ControllerState.STARTED ) {
            throw new Error(`Script#${this._name} was not started`);
        }

        if ( !this._systemProcess ) throw new Error(`No process initialized`);

        LOG.debug(`Cancelling command "${this._command} ${this._args.join(' ')}"`);

        this._state = ControllerState.CANCELLED;

        this._systemProcess.stop();

        if (this._observer.hasCallbacks(ScriptControllerEvent.SCRIPT_CANCELLED)) {
            this._observer.triggerEvent(ScriptControllerEvent.SCRIPT_CANCELLED, this);
        }

        if (this._observer.hasCallbacks(ScriptControllerEvent.SCRIPT_CHANGED)) {
            this._observer.triggerEvent(ScriptControllerEvent.SCRIPT_CHANGED, this);
        }

        return this;

    }

    public onStarted (callback: ObserverCallback<string, [ScriptController]>) : ScriptControllerDestructor {
        return this.on(ScriptControllerEvent.SCRIPT_STARTED, callback);
    }

    public onPaused (callback: ObserverCallback<string, [ScriptController]>) : ScriptControllerDestructor {
        return this.on(ScriptControllerEvent.SCRIPT_PAUSED, callback);
    }

    public onResumed (callback: ObserverCallback<string, [ScriptController]>) : ScriptControllerDestructor {
        return this.on(ScriptControllerEvent.SCRIPT_RESUMED, callback);
    }

    public onCancelled (callback: ObserverCallback<string, [ScriptController]>) : ScriptControllerDestructor {
        return this.on(ScriptControllerEvent.SCRIPT_CANCELLED, callback);
    }

    public onFailed (callback: ObserverCallback<string, [ScriptController]>) : ScriptControllerDestructor {
        return this.on(ScriptControllerEvent.SCRIPT_FAILED, callback);
    }

    public onFinished (callback: ObserverCallback<string, [ScriptController]>) : ScriptControllerDestructor {
        return this.on(ScriptControllerEvent.SCRIPT_FINISHED, callback);
    }

    public onChanged (callback: ObserverCallback<string, [ScriptController]>) : ScriptControllerDestructor {
        return this.on(ScriptControllerEvent.SCRIPT_CHANGED, callback);
    }

    public getErrorString () : string {
        return this._systemProcess ? this._systemProcess.getErrorString() : "";
    }

    public getOutputString () : string {
        return this._systemProcess ? this._systemProcess.getOutputString() : "";
    }

    public static Event = ScriptControllerEvent;
    public static State = ControllerState;


    private _onClose (event: SystemProcessEvent, child: SystemProcess) {

        const code = child.getExitStatus();

        LOG.debug(`Child process stopped with exit status ${code}`);

        if (code === 0) {

            this._state = ControllerState.FINISHED;
            if (this._observer.hasCallbacks(ScriptControllerEvent.SCRIPT_FINISHED)) {
                this._observer.triggerEvent(ScriptControllerEvent.SCRIPT_FINISHED, this);
            }

        } else {

            this._state = ControllerState.FAILED;
            if (this._observer.hasCallbacks(ScriptControllerEvent.SCRIPT_FAILED)) {
                this._observer.triggerEvent(ScriptControllerEvent.SCRIPT_FAILED, this);
            }

        }

        if (this._observer.hasCallbacks(ScriptControllerEvent.SCRIPT_CHANGED)) {
            this._observer.triggerEvent(ScriptControllerEvent.SCRIPT_CHANGED, this);
        }

    }

}

export function isScriptController (value: any) : value is ScriptController {
    return value instanceof ScriptController;
}

export default ScriptController;

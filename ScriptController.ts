// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Observer, { ObserverCallback, ObserverDestructor } from "../ts/Observer";
import Json from "../ts/Json";
import Name, { isName } from "./types/Name";
import StepController from "./types/StepController";
import {
    isArray,
    isArrayOf,
    isRegularObject,
    isRegularObjectOf,
    isString
} from "../ts/modules/lodash";
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import LogService from "../ts/LogService";

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

export enum ScriptControllerState {
    CONSTRUCTED,
    STARTED,
    PAUSED,
    CANCELLED,
    FINISHED,
    FAILED
}

export class ScriptController implements StepController {

    private readonly _observer       : Observer<ScriptControllerEvent>;
    private readonly _name           : Name;
    private readonly _command        : string;
    private readonly _args           : string[];
    private readonly _env            : {[key: string]: string};
    private readonly _closeCallback  : ((close: number) => void);
    private readonly _stdoutCallback : ((data: Buffer) => void);
    private readonly _stderrCallback : ((data: Buffer) => void);

    private _state   : ScriptControllerState;
    private _process : ChildProcessWithoutNullStreams | undefined;
    private _stdoutChunks : Buffer[];
    private _stderrChunks : Buffer[];

    public constructor (
        name     : Name,
        command  : string,
        args     : string[] = [],
        env      : {[key: string]: string} = {}
    ) {

        if ( !isName(name) ) throw new TypeError(`Script name invalid: ${name}`);
        if ( !isString(command) ) throw new TypeError(`Script#${name} must have a valid command: ${command}`);
        if ( !isArrayOf(args, isString, 0) ) throw new TypeError(`Script#${name} must have a valid args: ${JSON.stringify(args)}`);
        if ( !isRegularObjectOf<string, string>(env, isString, isString) ) throw new TypeError(`Script#${name} must have a valid env: ${JSON.stringify(env)}`);

        this._state          = ScriptControllerState.CONSTRUCTED;
        this._name           = name;
        this._command        = command;
        this._args           = args;
        this._env            = env;
        this._observer       = new Observer<ScriptControllerEvent>(`ScriptController#${name}`);
        this._closeCallback  = this._onClose.bind(this);
        this._stdoutCallback = this._onStdOut.bind(this);
        this._stderrCallback = this._onStdErr.bind(this);
        this._stdoutChunks   = [];
        this._stderrChunks   = [];

    }

    public destroy () {

        this._observer.destroy();

        if (this.isPaused()) {
            this.resume().stop();
        } else if (this.isRunning()) {
            this.stop();
        }

    }

    public getName () : Name {
        return this._name;
    }

    public getState () : ScriptControllerState {
        return this._state;
    }

    public on (name : ScriptControllerEvent, callback: ScriptControllerEventCallback) : ScriptControllerDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public toString (): string {
        return `ScriptController#${this._name}`;
    }

    public toJSON (): Json {
        return {
            type: 'ScriptController',
            name: this._name,
            args: this._args,
            env: this._env
        };
    }

    public isRunning () : boolean {
        switch (this._state) {

            case ScriptControllerState.STARTED:
                return true;

            case ScriptControllerState.PAUSED:
            case ScriptControllerState.CONSTRUCTED:
            case ScriptControllerState.CANCELLED:
            case ScriptControllerState.FINISHED:
            case ScriptControllerState.FAILED:
                return false;

        }
    }

    public isStarted () : boolean {
        switch (this._state) {

            case ScriptControllerState.STARTED:
            case ScriptControllerState.PAUSED:
                return true;

            case ScriptControllerState.CONSTRUCTED:
            case ScriptControllerState.CANCELLED:
            case ScriptControllerState.FINISHED:
            case ScriptControllerState.FAILED:
                return false;

        }
    }

    public isPaused () : boolean {
        switch (this._state) {

            case ScriptControllerState.PAUSED:
                return true;

            case ScriptControllerState.CONSTRUCTED:
            case ScriptControllerState.STARTED:
            case ScriptControllerState.CANCELLED:
            case ScriptControllerState.FINISHED:
            case ScriptControllerState.FAILED:
                return false;

        }
    }

    public isFinished () : boolean {
        switch (this._state) {

            case ScriptControllerState.CANCELLED:
            case ScriptControllerState.FINISHED:
            case ScriptControllerState.FAILED:
                return true;

            case ScriptControllerState.CONSTRUCTED:
            case ScriptControllerState.STARTED:
            case ScriptControllerState.PAUSED:
                return false;

        }
    }

    public isSuccessful () : boolean {
        switch (this._state) {

            case ScriptControllerState.FINISHED:
                return true;

            case ScriptControllerState.FAILED:
            case ScriptControllerState.CANCELLED:
            case ScriptControllerState.CONSTRUCTED:
            case ScriptControllerState.STARTED:
            case ScriptControllerState.PAUSED:
                return false;

        }
    }

    public isCancelled () : boolean {
        switch (this._state) {

            case ScriptControllerState.CANCELLED:
                return true;

            case ScriptControllerState.FINISHED:
            case ScriptControllerState.FAILED:
            case ScriptControllerState.CONSTRUCTED:
            case ScriptControllerState.STARTED:
            case ScriptControllerState.PAUSED:
                return false;

        }
    }

    public isFailed () : boolean {
        switch (this._state) {

            case ScriptControllerState.FAILED:
                return true;

            case ScriptControllerState.CANCELLED:
            case ScriptControllerState.FINISHED:
            case ScriptControllerState.CONSTRUCTED:
            case ScriptControllerState.STARTED:
            case ScriptControllerState.PAUSED:
                return false;

        }
    }

    public start () : ScriptController {

        if (this._state !== ScriptControllerState.CONSTRUCTED) {
            throw new Error(`Script#${this._name} was already started`);
        }

        LOG.info(`Starting command "${this._command} ${this._args.join(' ')}"`);

        this._state = ScriptControllerState.STARTED;

        this._process = spawn(this._command, this._args);
        this._process.stdout.on('data', this._stdoutCallback);
        this._process.stderr.on('data', this._stderrCallback);
        this._process.on('close', this._closeCallback);

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

        if ( !this._process ) throw new Error(`No process initialized`);

        LOG.info(`Pausing command "${this._command} ${this._args.join(' ')}"`);

        this._state = ScriptControllerState.PAUSED;

        this._process.kill('SIGSTOP');

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

        if ( !this._process ) {
            throw new Error(`No process initialized`);
        }

        LOG.info(`Resuming command "${this._command} ${this._args.join(' ')}"`);

        this._state = ScriptControllerState.STARTED;

        this._process.kill('SIGCONT');

        if (this._observer.hasCallbacks(ScriptControllerEvent.SCRIPT_RESUMED)) {
            this._observer.triggerEvent(ScriptControllerEvent.SCRIPT_RESUMED, this);
        }
        if (this._observer.hasCallbacks(ScriptControllerEvent.SCRIPT_CHANGED)) {
            this._observer.triggerEvent(ScriptControllerEvent.SCRIPT_CHANGED, this);
        }

        return this;

    }

    public stop () : ScriptController {

        if ( this._state !== ScriptControllerState.STARTED ) {
            throw new Error(`Script#${this._name} was not started`);
        }

        if ( !this._process ) throw new Error(`No process initialized`);

        LOG.debug(`Cancelling command "${this._command} ${this._args.join(' ')}"`);

        this._state = ScriptControllerState.CANCELLED;

        this._process.kill('SIGTERM');

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
        return Buffer.concat(this._stderrChunks).toString('utf8');
    }

    public getOutputString () : string {
        return Buffer.concat(this._stdoutChunks).toString('utf8');
    }

    public static Event = ScriptControllerEvent;
    public static State = ScriptControllerState;


    private _onClose (code: number) {

        LOG.debug(`Child process stopped with exit status ${code}`);

        if (code === 0) {

            this._state = ScriptControllerState.FINISHED;
            if (this._observer.hasCallbacks(ScriptControllerEvent.SCRIPT_FINISHED)) {
                this._observer.triggerEvent(ScriptControllerEvent.SCRIPT_FINISHED, this);
            }

        } else {

            this._state = ScriptControllerState.FAILED;
            if (this._observer.hasCallbacks(ScriptControllerEvent.SCRIPT_FAILED)) {
                this._observer.triggerEvent(ScriptControllerEvent.SCRIPT_FAILED, this);
            }

        }

        if (this._observer.hasCallbacks(ScriptControllerEvent.SCRIPT_CHANGED)) {
            this._observer.triggerEvent(ScriptControllerEvent.SCRIPT_CHANGED, this);
        }

    }

    private _onStdOut (chunk: Buffer) {
        this._stdoutChunks.push(chunk);
        process.stdout.write(chunk);
    }

    private _onStdErr (chunk: Buffer) {
        this._stderrChunks.push(chunk);
        process.stderr.write(chunk);
    }

}

export function isScriptController (value: any) : value is ScriptController {
    return value instanceof ScriptController;
}

export default ScriptController;

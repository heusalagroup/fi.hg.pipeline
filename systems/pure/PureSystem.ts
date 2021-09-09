// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import System from "../types/System";
import PureSystemProcess from "./PureSystemProcess";

export class PureSystem implements System {

    private _tempFileCounter : number = 0;

    public destroy () {}

    getWorkingDirectory () : string {
        return "/tmp";
    }

    createTemporaryFile () : string {
        this._tempFileCounter += 1;
        return `/tmp/tempfile.${this._tempFileCounter}.tmp`;
    }

    /**
     *
     * @param command
     * @param args
     * @param env
     */
    public createProcess (
        command: string,
        args: readonly string[] | undefined,
        env: {[p: string]: string} | undefined
    ): PureSystemProcess {
        return new PureSystemProcess(command, args, env);
    }

    public createDirectory (
        target : string
    ) : System {
        this._notImplementedYet();
        return this;
    }

    private _notImplementedYet () {
        throw new Error(`No pure JavaScript implementation to run scripts exists yet`);
    }

}

export function isPureSystem (value: any): value is PureSystem {
    return value instanceof PureSystem;
}

export default PureSystem;

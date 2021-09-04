// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import System from "../types/System";
import PureSystemProcess from "./PureSystemProcess";

export class PureSystem implements System {

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

}

export function isPureSystem (value: any): value is PureSystem {
    return value instanceof PureSystem;
}

export default PureSystem;

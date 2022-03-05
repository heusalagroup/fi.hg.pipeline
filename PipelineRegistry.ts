// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Step from "./types/Step";
import ControllerFactory from "./controllers/types/ControllerFactory";
import { find, reduce } from "../core/modules/lodash";

export class PipelineRegistry {

    private static _stepControllers : ControllerFactory[] = [];

    public static registerController (controller : ControllerFactory) {
        this._stepControllers.push(controller);
    }

    public static findController (model : Step) : ControllerFactory | undefined {
        return find(this._stepControllers, (item) => item.isControllerModel(model));
    }

    public static parseControllerModel (model : any) : Step | undefined {

        return reduce(
            this._stepControllers,
            (prevResult: any, item: ControllerFactory) => {

                if (prevResult !== undefined) {
                    return prevResult;
                }

                return item.parseControllerModel(model);

            },
            undefined
        );

    }

}

export default PipelineRegistry;

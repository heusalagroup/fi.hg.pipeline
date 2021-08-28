// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import Json from "../ts/Json";
import Pipeline, { isPipeline } from "./types/Pipeline";
import Stage, { isStage } from "./types/Stage";
import Step from "./types/Step";
import Job, { isJob } from "./types/Job";
import LogService from "../ts/LogService";
import PipelineController from "./PipelineController";
import { map } from "../ts/modules/lodash";
import StageController from "./StageController";
import JobController from "./JobController";
import StepController from "./types/StepController";
import { isScript } from "./types/Script";
import ScriptController from "./ScriptController";
import Controller from "./types/Controller";
import { ObserverDestructor } from "../ts/Observer";
import { PipelineModel } from "./types/PipelineModel";

const LOG = LogService.createLogger('PipelineRunner');

export class PipelineRunner {

    public static createStepController (step: Step) : StepController {

        if (isScript(step)) {
            return new ScriptController(
                step.name,
                step.command,
                step.args,
                step.env
            );
        }

        throw new TypeError(`Unknown step type: ${step.name}`);

    }

    public static createJobController (job: Job) : JobController {

        return new JobController(
            job.name,
            map(job.steps, (step: Step) : StepController => this.createStepController(step))
        );

    }

    public static createStageController (stage: Stage) : StageController {

        return new StageController(
            stage.name,
            map(stage.jobs, (job : Job) : JobController => this.createJobController(job))
        );

    }

    public static createPipelineController (model: Pipeline) : PipelineController {

        return new PipelineController(
            model.name,
            map(model.stages, (stage : Stage) : StageController => this.createStageController(stage))
        );

    }

    public static createController (model: PipelineModel) : Controller {

        if ( isPipeline(model) ) {

            LOG.debug(`Starting pipeline ${model.name}`);
            return this.createPipelineController(model);

        } else if ( isStage(model) ) {

            LOG.debug(`Starting stage ${model.name}`);
            return this.createStageController(model);

        } else if ( isJob(model) ) {

            LOG.debug(`Starting job ${model.name}`);
            return this.createJobController(model);

        }

        LOG.debug(`Starting step ${model.name}`);
        return this.createStepController(model);

    }

    public static async startAndWaitUntilFinished (controller : Controller) : Promise<void> {

        return await new Promise((resolve, reject) => {

            let listener : ObserverDestructor | undefined;

            try {

                listener = controller.onChanged(() => {
                    try {

                        if (controller.isFinished()) {

                            LOG.debug(`Controller ${controller.toString()} finished`);

                            if (listener) {
                                listener();
                                listener = undefined;
                            }

                            resolve();

                        } else {
                            LOG.debug(`Controller ${controller.toString()} state changed`);
                        }

                    } catch (err) {

                        if (listener) {
                            listener();
                            listener = undefined;
                        }

                        reject(err);

                    }
                });

                controller.start();

                LOG.debug(`Controller ${controller.toString()} started`);

            } catch (err) {

                if (listener) {
                    listener();
                    listener = undefined;
                }

                reject(err);

            }

        });

    }

}

export default PipelineRunner;

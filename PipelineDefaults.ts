// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import PipelineRunner from "./PipelineRunner";
import JsonController from "./controllers/step/json/JsonController";
import CsvController from "./controllers/step/csv/CsvController";
import ScriptController from "./controllers/step/script/ScriptController";
import FileController from "./controllers/step/file/FileController";

export class PipelineDefaults {

    public static registerControllers () {
        PipelineRunner.registerController(FileController);
        PipelineRunner.registerController(JsonController);
        PipelineRunner.registerController(CsvController);
        PipelineRunner.registerController(ScriptController);
    }

}

export default PipelineDefaults;

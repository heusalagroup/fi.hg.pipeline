// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

export enum FileControllerAction {
    MKDIR = "mkdir"
}

export function isFileControllerAction (value: any): value is FileControllerAction {
    switch (value) {
        case FileControllerAction.MKDIR:
            return true;
    }
    return false;
}

export default FileControllerAction;

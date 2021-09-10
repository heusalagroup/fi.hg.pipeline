// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

export enum GitControllerAction {
    CLONE  = "clone",
    COMMIT = "commit",
    ADD    = "add"
}

export function isGitControllerAction (value: any): value is GitControllerAction {
    switch (value) {
        case GitControllerAction.CLONE:
        case GitControllerAction.COMMIT:
        case GitControllerAction.ADD:
            return true;
    }
    return false;
}

export default GitControllerAction;

// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

export enum GitControllerAction {
    CLONE = "clone"
}

export function isGitControllerAction (value: any): value is GitControllerAction {
    switch (value) {
        case GitControllerAction.CLONE:
            return true;
    }
    return false;
}

export default GitControllerAction;

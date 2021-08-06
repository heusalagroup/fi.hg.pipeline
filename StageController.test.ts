// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import StageController, { isStageController } from "./StageController";

describe('isStageController', () => {

    test('can detect StageControllers', () => {

        expect(isStageController(new StageController())).toBe(true);

    });

    test('can detect invalid values', () => {

        expect(isStageController(undefined)).toBe(false);
        expect(isStageController(null)).toBe(false);
        expect(isStageController(false)).toBe(false);
        expect(isStageController(true)).toBe(false);
        expect(isStageController(NaN)).toBe(false);
        expect(isStageController(() => {
        })).toBe(false);
        expect(isStageController(0)).toBe(false);
        expect(isStageController(Symbol())).toBe(false);
        expect(isStageController(1628078651664)).toBe(false);
        expect(isStageController(new Date('2021-08-04T12:04:00.844Z'))).toBe(false);
        expect(isStageController(1)).toBe(false);
        expect(isStageController(12)).toBe(false);
        expect(isStageController(-12)).toBe(false);
        expect(isStageController(123)).toBe(false);
        expect(isStageController(123.99999)).toBe(false);
        expect(isStageController(-123.99999)).toBe(false);
        expect(isStageController("123")).toBe(false);
        expect(isStageController("hello")).toBe(false);
        expect(isStageController("")).toBe(false);
        expect(isStageController([])).toBe(false);
        expect(isStageController([ 123 ])).toBe(false);
        expect(isStageController([ "123" ])).toBe(false);
        expect(isStageController([ "Hello world", "foo" ])).toBe(false);
        expect(isStageController({})).toBe(false);
        expect(isStageController({"foo": "bar"})).toBe(false);
        expect(isStageController({"foo": 1234})).toBe(false);

    });

});

describe('StageController', () => {

    describe('#constructor', () => {

        test('can create objects', () => {
            expect(() => new StageController()).not.toThrow();
        });

    });

    describe('#toJSON', () => {

        test('can turn class to JSON', () => {
            expect((new StageController()).toJSON()).toStrictEqual({type: 'StageController'});
        });

    });

    describe('#toString', () => {

        test('can turn class to string', () => {
            expect((new StageController()).toString()).toBe('StageController');
        });

    });

});

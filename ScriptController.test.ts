// Copyright (c) 2021. Sendanor <info@sendanor.fi>. All rights reserved.

import ScriptController, { isScriptController } from "./ScriptController";

describe('isScriptController', () => {

    test('can detect ScriptControllers', () => {

        expect(isScriptController(new ScriptController())).toBe(true);

    });

    test('can detect invalid values', () => {

        expect(isScriptController(undefined)).toBe(false);
        expect(isScriptController(null)).toBe(false);
        expect(isScriptController(false)).toBe(false);
        expect(isScriptController(true)).toBe(false);
        expect(isScriptController(NaN)).toBe(false);
        expect(isScriptController(() => {})).toBe(false);
        expect(isScriptController(0)).toBe(false);
        expect(isScriptController(Symbol())).toBe(false);
        expect(isScriptController(1628078651664)).toBe(false);
        expect(isScriptController(new Date('2021-08-04T12:04:00.844Z'))).toBe(false);
        expect(isScriptController(1)).toBe(false);
        expect(isScriptController(12)).toBe(false);
        expect(isScriptController(-12)).toBe(false);
        expect(isScriptController(123)).toBe(false);
        expect(isScriptController(123.99999)).toBe(false);
        expect(isScriptController(-123.99999)).toBe(false);
        expect(isScriptController("123")).toBe(false);
        expect(isScriptController("hello")).toBe(false);
        expect(isScriptController("")).toBe(false);
        expect(isScriptController([])).toBe(false);
        expect(isScriptController([ 123 ])).toBe(false);
        expect(isScriptController([ "123" ])).toBe(false);
        expect(isScriptController([ "Hello world", "foo" ])).toBe(false);
        expect(isScriptController({})).toBe(false);
        expect(isScriptController({"foo": "bar"})).toBe(false);
        expect(isScriptController({"foo": 1234})).toBe(false);

    });

});

describe('ScriptController', () => {

    describe('#constructor', () => {

        test('can create objects', () => {
            expect(() => new ScriptController()).not.toThrow();
        });

    });

    describe('#toJSON', () => {

        test('can turn class to JSON', () => {
            expect((new ScriptController()).toJSON()).toStrictEqual({type: 'ScriptController'});
        });

    });

    describe('#toString', () => {

        test('can turn class to string', () => {
            expect((new ScriptController()).toString()).toBe('ScriptController');
        });

    });

});

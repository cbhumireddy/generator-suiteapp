/**
 *    Copyright (c) 2019, Oracle and/or its affiliates. All rights reserved.
 *
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */

import { EntryPoints } from 'N/types';
import * as log from "N/log";
import * as N_search from 'N/search';
import ObjectReference = EntryPoints.MapReduce.ObjectReference;

const handleErrors = (ctx: EntryPoints.MapReduce.summarizeContext) => {
    let error = false;
    if (ctx.inputSummary.error) {
        log.error('Input error', ctx.inputSummary.error);
        error = true;
    }

    if (ctx.mapSummary.errors) {
        ctx.mapSummary.errors.iterator().each((key, err, execNo) => {
            log.error(`Map error for ${key}, execution no ${execNo}`, err);
            error = true;
            return true;
        });
    }
    return error;
};

export let getInputData: EntryPoints.MapReduce.getInputData = (ctx: EntryPoints.MapReduce.getInputDataContext): N_search.Search | any | any[] | ObjectReference => {

};

export let map: EntryPoints.MapReduce.map = (ctx: EntryPoints.MapReduce.mapContext): void => {

};

export let reduce: EntryPoints.MapReduce.reduce = (ctx: EntryPoints.MapReduce.reduceContext) => {

};

export let summarize: EntryPoints.MapReduce.summarize = (ctx: EntryPoints.MapReduce.summarizeContext) => {

    const hasErrors = handleErrors(ctx);
    if (hasErrors) return;

};

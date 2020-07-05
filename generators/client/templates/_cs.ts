/**
 *    Copyright (c) 2019, Oracle and/or its affiliates. All rights reserved.
 *
 * @NAPIVersion <%= scriptversion %>
 * @NScriptType ClientScript
 * @NModulescope SameAccount
 */

import {EntryPoints} from 'N/types';
import { <%= usecasename %> } from '../usecase/<%= usecasename %>';
import { <%= gatewayname %> } from '../gateway/<%= gatewayname %>';

let useCase: <%= usecasename %>;

function getUseCase() {
if (useCase === null) {
    useCase = new <%= usecasename %>({
        dependencies: {
            OrderGuideCSPopUpGateway: _createGateway(),
        },
    });
}
return useCase;
}

function _createGateway() {
return new <%= gatewayname %>({
    dependencies: {},
});
}
/**
 * pageInit
 * @param ctx
 */
export const pageInit: EntryPoints.Client.pageInit = (ctx: EntryPoints.Client.pageInitContext): void => {
    alert('hi');
};

/**
 * validateField
 * @param ctx
 */
export const validateField: EntryPoints.Client.validateField = (ctx: EntryPoints.Client.validateFieldContext): boolean =>  {
return true;
};

/**
 * filedChanged
 * @param ctx
 */
export const fieldChanged: EntryPoints.Client.fieldChanged = (ctx: EntryPoints.Client.fieldChangedContext): void =>  {
};

/**
 * lineInit
 * @param ctx
 */
export const lineInit: EntryPoints.Client.lineInit = (ctx: EntryPoints.Client.lineInitContext): void => {

};

/**
 * saveRecord
 * @param ctx
 */
export const saveRecord: EntryPoints.Client.saveRecord = (ctx: EntryPoints.Client.saveRecordContext): boolean => {

    return true;
};

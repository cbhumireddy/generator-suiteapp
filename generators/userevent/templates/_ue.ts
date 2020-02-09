/**
 * @NAPIVersion <%= scriptversion %>
 * @NScriptType UserEventScript
 * @NModulescope SameAccount
 */

import {EntryPoints} from 'N/types'
import * as log from 'N/log'
import { <%= usecasename %> } from '../usecase/<%= usecasename %>';
import { <%= gatewayname %> } from '../gateway/<%= gatewayname %>';

var useCase: <%= usecasename %>;

function getUseCase() {
if (useCase === null) {
    useCase = new <%= usecasename %>({
        dependencies: {
            OrderGuideCSPopUpGateway: _createGateway()
        }
    });
}
return useCase;
}

function _createGateway() {
return new <%= gatewayname %>({
    dependencies: {
        
    }        
});
}

export function beforeSubmit(ctx: EntryPoints.UserEvent.beforeSubmitContext) {

    let x = ctx.newRecord.getValue({fieldId: 'companyname'})

    log.audit('value', `companyname is: ${x}`)
}

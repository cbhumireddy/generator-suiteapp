/**
 * @NAPIVersion <%= scriptversion %>
 * @NScriptType ClientScript
 * @NModulescope SameAccount
 */

import {EntryPoints} from 'N/types'
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
/**
 * pageInit
 * @param pageInitContext 
 */
export function pageInit(ctx: EntryPoints.Client.pageInitContext) {

}

/**
 * filedChanged
 * @param ctx 
 */
export function filedChanged(ctx: EntryPoints.Client.fieldChangedContext){
    
}

/**
 * lineInit
 * @param ctx 
 */
export function lineInit(ctx: EntryPoints.Client.lineInitContext){

}

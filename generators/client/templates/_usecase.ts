import { <%=gatewayname %> } from '../gateway/<%=gatewayname %>';

export class <%= usecasename %> {

    public static _throwErrorWhenInvalidParameter(options: any) {
        if (!options) throw new Error('constants.ERROR_CONST.OPTIONS');
        if (!options.dependencies) throw new Error('constants.ERROR_CONST.DEPENDENCIES');
        if (!options.dependencies['<%= gatewayname %>'])
            throw new Error('_errors.TRUCK_MR_GATEWAY_IS_REQUIRED');
    }

    public dependencies: any;
    public gateway: <%= gatewayname %>;

    constructor(options: any) {
        this.dependencies = options.dependencies;
        this.gateway =  options.dependencies['<%= gatewayname %>'];
        <%= usecasename %>._throwErrorWhenInvalidParameter(options);
    }
}

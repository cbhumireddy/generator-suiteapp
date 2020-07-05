/**
 * Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved.
 *
 * @NModuleScope Public
 */
define(function() {
    return {
        Sort: {
            ASC: ''
        },
        load: function() {
            return {
                runPaged: function() {
                    return {
                        pageRanges: [],
                        fetch: function() {
                            return {
                                data: []
                            };
                        }
                    };
                }
            };
        }
    };
});

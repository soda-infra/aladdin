import deepFreeze from 'deep-freeze';
var jaegerQueryConfig = {
    path: '/search',
    embed: {
        uiEmbed: 'uiEmbed',
        version: 'v0'
    }
};
export var jaegerQuery = function () {
    return deepFreeze(jaegerQueryConfig);
};
//# sourceMappingURL=JaegerQuery.js.map
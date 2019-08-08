export var namespaceFromString = function (namespace) { return ({ name: namespace }); };
export var namespacesFromString = function (namespaces) {
    return namespaces.split(',').map(function (name) { return namespaceFromString(name); });
};
export var namespacesToString = function (namespaces) { return namespaces.map(function (namespace) { return namespace.name; }).join(','); };
//# sourceMappingURL=Namespace.js.map
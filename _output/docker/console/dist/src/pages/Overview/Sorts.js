export var sortFields = [
    {
        id: 'namespace',
        title: 'Name',
        isNumeric: false,
        param: 'ns',
        compare: function (a, b) { return a.name.localeCompare(b.name); }
    },
    {
        id: 'health',
        title: 'Status',
        isNumeric: false,
        param: 'h',
        compare: function (a, b) {
            if (a.status && b.status) {
                var diff = b.status.inError.length - a.status.inError.length;
                if (diff !== 0) {
                    return diff;
                }
                diff = b.status.inWarning.length - a.status.inWarning.length;
                if (diff !== 0) {
                    return diff;
                }
            }
            else if (a.status) {
                return -1;
            }
            else if (b.status) {
                return 1;
            }
            // default comparison fallback
            return a.name.localeCompare(b.name);
        }
    },
    {
        id: 'mtls',
        title: 'mTLS',
        isNumeric: false,
        param: 'm',
        compare: function (a, b) {
            if (a.tlsStatus && b.tlsStatus) {
                return a.tlsStatus.status.localeCompare(b.tlsStatus.status);
            }
            else if (a.tlsStatus) {
                return -1;
            }
            else if (b.tlsStatus) {
                return 1;
            }
            // default comparison fallback
            return a.name.localeCompare(b.name);
        }
    }
];
export var sortFunc = function (allNamespaces, sortField, isAscending) {
    return allNamespaces.sort(isAscending ? sortField.compare : function (a, b) { return sortField.compare(b, a); });
};
//# sourceMappingURL=Sorts.js.map
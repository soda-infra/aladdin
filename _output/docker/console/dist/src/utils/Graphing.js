export default {
    toC3Columns: function (matrix, title) {
        if (!matrix || matrix.length === 0) {
            return [['x'], [title || '']];
        }
        // xseries are timestamps. Timestamps are taken from the first series and assumed
        // that all series have the same timestamps.
        var xseries = ['x'];
        xseries = xseries.concat(matrix[0].values.map(function (dp) { return dp[0] * 1000; }));
        // yseries are the values of each serie.
        var yseries = matrix.map(function (mat) {
            var serie = [title || mat.name];
            return serie.concat(mat.values.map(function (dp) { return dp[1]; }));
        });
        // timestamps + data is the format required by C3 (all concatenated: an array with arrays)
        return [xseries].concat(yseries);
    }
};
//# sourceMappingURL=Graphing.js.map
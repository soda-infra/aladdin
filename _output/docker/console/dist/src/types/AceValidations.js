export var jsYaml = require('js-yaml');
var numRows = function (yaml) {
    var rows = 0;
    for (var i = 0; i < yaml.length; i++) {
        if (yaml.charAt(i) === '\n') {
            rows++;
        }
    }
    return rows;
};
var posToRowCol = function (yaml, pos) {
    var rowCol = {
        position: pos,
        row: 0,
        col: 0
    };
    var lastNL = -1;
    for (var i = 0; i < pos; i++) {
        if (yaml.charAt(i) === '\n') {
            rowCol.row++;
            lastNL = i;
        }
    }
    rowCol.col = lastNL > -1 ? pos - (lastNL + 1) : pos;
    return rowCol;
};
var rowColToPos = function (yaml, row, col) {
    var currentRow = 0;
    var currentCol = 0;
    var pos = -1;
    for (var i = 0; i < yaml.length; i++) {
        if (yaml.charAt(i) === '\n') {
            currentRow++;
            currentCol = -1;
        }
        else {
            currentCol++;
        }
        if (currentRow === row && currentCol === col) {
            // If col == 0, pos is NL char, so returned pos should be first char after NL
            return col === 0 ? i + 1 : i;
        }
    }
    return pos;
};
/*
  Find a token inside a yaml based string.
  Returns the row/col coordinates of the token.
  It manages special cases where a token is an array.
 */
var parseMarker = function (yaml, startsFrom, token, isArray, arrayIndex) {
    var aceMarker = {
        startRow: 0,
        startCol: 0,
        endRow: 0,
        endCol: 0,
        position: -1
    };
    var tokenPos = startsFrom;
    // Find start of the spec part first, this should skip the whole metadata part
    if (startsFrom < 0) {
        tokenPos = yaml.indexOf('spec:', tokenPos);
    }
    // Find initial token position
    tokenPos = yaml.indexOf(token, tokenPos);
    if (tokenPos < 0) {
        return aceMarker;
    }
    var maxRows = numRows(yaml);
    // Array should find first '-' token to situate pos
    if (isArray && arrayIndex !== undefined) {
        tokenPos = yaml.indexOf('-', tokenPos);
        // We should find the right '-' under the same col of the yaml
        var firstArrayRowCol = posToRowCol(yaml, tokenPos);
        var row = firstArrayRowCol.row;
        var col = firstArrayRowCol.col;
        var arrayIndexPos = tokenPos;
        var indexRow = 0;
        // Iterate to find next '-' token according arrayIndex
        while (row < maxRows && indexRow < arrayIndex) {
            row++;
            var checkPos = rowColToPos(yaml, row, col);
            if (yaml.charAt(checkPos) === '-') {
                arrayIndexPos = checkPos;
                indexRow++;
            }
        }
        var arrayRowCol = posToRowCol(yaml, arrayIndexPos);
        aceMarker.position = arrayIndexPos + 1; // Increase the index to not repeat same finding on next iteration
        aceMarker.startRow = arrayRowCol.row;
        aceMarker.startCol = arrayRowCol.col;
    }
    else {
        var tokenRowCol = posToRowCol(yaml, tokenPos);
        aceMarker.position = tokenPos + token.length; // Increase the index to not repeat same finding on next iteration
        aceMarker.startRow = tokenRowCol.row;
        aceMarker.startCol = tokenRowCol.col;
    }
    // Once start is calculated, we should calculate the end of the element iterating by rows
    for (var row = aceMarker.startRow + 1; row < maxRows + 1; row++) {
        // It searches by row and column, starting from the beginning of the line
        for (var col = 0; col <= aceMarker.startCol; col++) {
            var endTokenPos = rowColToPos(yaml, row, col);
            // We need to differentiate if token is an array or not to mark the end of the mark
            if (yaml.charAt(endTokenPos) !== ' ' && (isArray || yaml.charAt(endTokenPos) !== '-')) {
                aceMarker.endRow = row;
                aceMarker.endCol = 0;
                return aceMarker;
            }
        }
    }
    return aceMarker;
};
var parseCheck = function (yaml, check) {
    var severity = check.severity === 'error' || check.severity === 'warning' ? check.severity : 'info';
    var marker = {
        startRow: 0,
        startCol: 0,
        endRow: 0,
        endCol: 0,
        className: 'istio-validation-' + severity,
        type: severity
    };
    var annotation = {
        row: 0,
        column: 0,
        type: severity,
        text: check.message
    };
    var aceMarker = {
        startRow: 0,
        startCol: 0,
        endRow: 0,
        endCol: 0,
        position: -1
    };
    /*
      Potential paths:
        - <empty, no path>
        - spec/hosts
        - spec/host
        - spec/<protocol: http|tcp>[<nRoute>]/route
        - spec/<protocol: http|tcp>[<nRoute>]/route[nDestination]
        - spec/<protocol: http|tcp>[<nRoute>]/route[<nDestination>]/weight/<value>
        - spec/<protocol: http|tcp>[nRoute]/route[nDestination]/destination
     */
    if (check.path.length > 0) {
        var tokens = check.path.split('/');
        // It skips the first 'spec' token
        if (tokens.length > 1) {
            for (var i = 1; i < tokens.length; i++) {
                var token = tokens[i];
                // Check if token has an array or not
                if (token.indexOf('[') > -1 && token.indexOf(']') > -1) {
                    var startPos = token.indexOf('[');
                    var endPos = token.indexOf(']');
                    var arrayIndex = +token.substr(startPos + 1, endPos - startPos - 1);
                    var subtoken = token.substr(0, startPos);
                    aceMarker = parseMarker(yaml, aceMarker.position, subtoken, true, arrayIndex);
                }
                else {
                    aceMarker = parseMarker(yaml, aceMarker.position, token, false);
                }
            }
        }
    }
    marker.startRow = aceMarker.startRow;
    marker.startCol = aceMarker.startCol;
    marker.endRow = aceMarker.endRow;
    marker.endCol = aceMarker.endCol;
    annotation.row = marker.startRow;
    return { marker: marker, annotation: annotation };
};
export var parseKialiValidations = function (yamlInput, kialiValidations) {
    var aceValidations = {
        markers: [],
        annotations: []
    };
    if (!kialiValidations || yamlInput.length === 0 || Object.keys(kialiValidations).length === 0) {
        return aceValidations;
    }
    kialiValidations.checks.forEach(function (check) {
        var aceCheck = parseCheck(yamlInput, check);
        aceValidations.markers.push(aceCheck.marker);
        aceValidations.annotations.push(aceCheck.annotation);
    });
    return aceValidations;
};
export var parseYamlValidations = function (yamlInput) {
    var parsedValidations = {
        markers: [],
        annotations: []
    };
    try {
        jsYaml.safeLoadAll(yamlInput);
    }
    catch (e) {
        var row = e.mark && e.mark.line ? e.mark.line : 0;
        var col = e.mark && e.mark.column ? e.mark.column : 0;
        var message = e.message ? e.message : '';
        parsedValidations.markers.push({
            startRow: row,
            startCol: 0,
            endRow: row + 1,
            endCol: 0,
            className: 'istio-validation-error',
            type: 'error'
        });
        parsedValidations.annotations.push({
            row: row,
            column: col,
            type: 'error',
            text: message
        });
    }
    return parsedValidations;
};
//# sourceMappingURL=AceValidations.js.map
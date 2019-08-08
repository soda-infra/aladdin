import React from 'react';
import { connect } from 'react-redux';
import { Spinner } from 'patternfly-react';
import { style } from 'typestyle';
var spinnerStyle = style({
    position: 'absolute',
    left: 240,
    top: 25
});
var mapStateToProps = function (state) { return ({
    isLoading: state.globalState.loadingCounter > 0
}); };
export var PfSpinner = function (props) {
    var isLoading = props.isLoading;
    // It is more than likely it won't have any children; but it could.
    // @todo: Patternfly Spinner is not working here
    return React.createElement(Spinner, { className: spinnerStyle, loading: isLoading, inverse: true });
};
// hook up to Redux for our State to be mapped to props
var PfSpinnerContainer = connect(mapStateToProps, null)(PfSpinner);
export default PfSpinnerContainer;
//# sourceMappingURL=PfSpinner.js.map
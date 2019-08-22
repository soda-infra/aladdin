var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import { ExpandCollapse } from 'patternfly-react';
import { Form, FormGroup, Grid, GridItem, InputGroup, TextInput } from '@patternfly/react-core';
import ServiceDropdown from './ServiceDropdown';
import LookBack from './LookBack';
import RightToolbar from './RightToolbar';
import TagsControl from './TagsControl';
import { getUnixTimeStampInMSFromForm, logfmtTagsConv, getFormFromUnixTimeStamp } from './RouteHelper';
import { HistoryManager, URLParam } from '../../app/History';
import { style } from 'typestyle';
var lookbackForm = style({ marginLeft: '-80px;' });
var separator = style({ borderBottom: '1px solid #d1d1d1;', marginBottom: '10px', marginTop: '20px' });
var durationInput = style({ marginLeft: '-75px;' });
var JaegerToolbar = /** @class */ (function (_super) {
    __extends(JaegerToolbar, _super);
    function JaegerToolbar(props) {
        var _this = _super.call(this, props) || this;
        _this.defaultLookback = 3600;
        _this.onChangeLookBackCustom = function (step, dateField, timeField) {
            var current = _this.state.dateTimes;
            if (dateField) {
                current[step].date = dateField;
            }
            if (timeField) {
                current[step].time = timeField;
            }
            _this.setState({ dateTimes: current });
        };
        _this.onRequestTraces = function () {
            var toTimestamp = getUnixTimeStampInMSFromForm(_this.state.dateTimes.start.date, _this.state.dateTimes.start.time, _this.state.dateTimes.end.date, _this.state.dateTimes.end.time);
            var options = {
                start: toTimestamp.start,
                end: toTimestamp.end,
                serviceSelected: _this.state.serviceSelected,
                limit: _this.state.limit,
                lookback: _this.state.lookback,
                minDuration: _this.state.minDuration,
                maxDuration: _this.state.maxDuration,
                tags: _this.state.tags
            };
            _this.props.updateURL(options);
        };
        var start = HistoryManager.getParam(URLParam.JAEGER_START_TIME);
        var end = HistoryManager.getParam(URLParam.JAEGER_END_TIME);
        var lookback = HistoryManager.getParam(URLParam.JAEGER_LOOKBACK);
        var startDateTime = start && lookback === 'custom'
            ? getFormFromUnixTimeStamp(Number(start) / 1000)
            : getFormFromUnixTimeStamp(0, -60 * 60 * 1000);
        var endDateTime = end && lookback === 'custom' ? getFormFromUnixTimeStamp(Number(end) / 1000) : getFormFromUnixTimeStamp(0);
        _this.state = {
            tags: logfmtTagsConv(HistoryManager.getParam(URLParam.JAEGER_TAGS)) || _this.props.tagsValue || '',
            limit: Number(HistoryManager.getParam(URLParam.JAEGER_LIMIT_TRACES) || '20'),
            minDuration: HistoryManager.getParam(URLParam.JAEGER_MIN_DURATION) || '',
            maxDuration: HistoryManager.getParam(URLParam.JAEGER_MAX_DURATION) || '',
            lookback: HistoryManager.getParam(URLParam.JAEGER_LOOKBACK) || String(_this.defaultLookback),
            serviceSelected: HistoryManager.getParam(URLParam.JAEGER_SERVICE_SELECTOR) || _this.props.serviceSelected || '',
            dateTimes: { start: startDateTime, end: endDateTime }
        };
        if (HistoryManager.getParam(URLParam.JAEGER_SERVICE_SELECTOR) || _this.props.serviceSelected) {
            _this.onRequestTraces();
        }
        return _this;
    }
    JaegerToolbar.prototype.render = function () {
        var _this = this;
        var disableSelectorNs = this.props.disableSelectorNs;
        var _a = this.state, dateTimes = _a.dateTimes, lookback = _a.lookback;
        var tz = lookback === '0' ? new Date().toTimeString().replace(/^.*?GMT/, 'UTC') : null;
        var helperCustomDates = React.createElement("div", { style: { marginLeft: '-90px' } },
            "Times are expressed in ",
            tz);
        return (React.createElement("div", { id: 'jaeger_toolbar' },
            React.createElement(Grid, null,
                !disableSelectorNs && (React.createElement(React.Fragment, null,
                    React.createElement(GridItem, { span: 2 },
                        React.createElement(Form, { isHorizontal: true },
                            React.createElement(FormGroup, { label: 'Service', isRequired: true, fieldId: 'service_jaeger_form' },
                                React.createElement(ServiceDropdown, { service: this.state.serviceSelected, setService: function (service) { return _this.setState({ serviceSelected: service }); } })))))),
                React.createElement(GridItem, { span: 2 },
                    React.createElement(Form, { isHorizontal: true, className: disableSelectorNs ? '' : lookbackForm },
                        React.createElement(FormGroup, { label: 'Lookback', isRequired: true, fieldId: 'lookback_jaeger_form' },
                            React.createElement(LookBack, { lookback: this.state.lookback !== 'custom' ? Number(this.state.lookback) : 0, setLookback: function (value, _event) {
                                    _this.setState({ lookback: value });
                                } })))),
                React.createElement(GridItem, { span: disableSelectorNs ? 9 : 7 }),
                React.createElement(GridItem, { span: 1 },
                    React.createElement(RightToolbar, { disabled: this.state.serviceSelected === '', onSubmit: this.onRequestTraces })),
                tz && (React.createElement(React.Fragment, null,
                    React.createElement(GridItem, { span: 12, className: separator }, "Custom Lookback"),
                    React.createElement(GridItem, { span: 4 },
                        React.createElement(Form, { isHorizontal: true },
                            React.createElement(FormGroup, { label: 'Start Time', fieldId: 'dateTimeStartJaegerTraces', helperText: helperCustomDates },
                                React.createElement(InputGroup, { style: { marginLeft: '-90px' } },
                                    React.createElement(TextInput, { value: dateTimes.start.date, type: "date", onChange: function (value) { return _this.onChangeLookBackCustom('start', value, ''); }, "aria-label": "datestartJaegerTraces" }),
                                    React.createElement(TextInput, { value: dateTimes.start.time, type: "time", onChange: function (value) { return _this.onChangeLookBackCustom('start', '', value); }, "aria-label": "timestartJaegerTraces" }))))),
                    React.createElement(GridItem, { span: 4, style: { marginLeft: '-40px' } },
                        React.createElement(Form, { isHorizontal: true },
                            React.createElement(FormGroup, { label: 'End Time', fieldId: 'dateTimeEndJaegerTraces', helperText: helperCustomDates },
                                React.createElement(InputGroup, { style: { marginLeft: '-90px' } },
                                    React.createElement(TextInput, { value: dateTimes.end.date, type: "date", onChange: function (value) { return _this.onChangeLookBackCustom('end', value, ''); }, "aria-label": "dateendJaegerTraces" }),
                                    React.createElement(TextInput, { value: dateTimes.end.time, type: "time", onChange: function (value) { return _this.onChangeLookBackCustom('end', '', value); }, "aria-label": "timeendJaegerTraces" }))))),
                    React.createElement(GridItem, { span: 3 }),
                    React.createElement(GridItem, { span: 12, className: separator })))),
            React.createElement(ExpandCollapse, { textCollapsed: "Show Advanced Options", textExpanded: "Hide Advanced Options" },
                React.createElement(Grid, null,
                    React.createElement(GridItem, { span: 7 },
                        React.createElement(TagsControl, { tags: this.state.tags, onChange: function (value) { return _this.setState({ tags: value }); } })),
                    React.createElement(GridItem, { span: 3, style: { marginLeft: '-60px' } },
                        React.createElement(Form, { isHorizontal: true },
                            React.createElement(FormGroup, { label: "Limit Results", isRequired: true, fieldId: "horizontal-form-name" },
                                React.createElement(TextInput, { value: this.state.limit, type: "number", onChange: function (value) { return _this.setState({ limit: Number(value) }); }, "aria-label": "tagsJaegerTraces", style: { marginLeft: '-60px' } })))),
                    React.createElement(GridItem, { span: 1 }),
                    React.createElement(GridItem, { span: 12, className: separator }, "Span Configuration"),
                    React.createElement(GridItem, { span: 2 },
                        React.createElement(Form, { isHorizontal: true },
                            React.createElement(FormGroup, { label: "Min Duration", fieldId: "form-minDurationSpanJaegerTraces", helperText: "e.g. 1.2s, 100ms, 500us" },
                                React.createElement(TextInput, { value: this.state.minDuration, type: "text", onChange: function (value) { return _this.setState({ minDuration: value }); }, "aria-label": "minDurationSpanJaegerTraces", className: durationInput })))),
                    React.createElement(GridItem, { span: 2, style: { marginLeft: '-60px' } },
                        React.createElement(Form, { isHorizontal: true },
                            React.createElement(FormGroup, { label: "Max Duration", fieldId: "form-maxDurationSpanJaegerTraces", helperText: "e.g. 1.1s" },
                                React.createElement(TextInput, { value: this.state.minDuration, type: "text", onChange: function (value) { return _this.setState({ maxDuration: value }); }, "aria-label": "maxDurationSpanJaegerTraces", className: durationInput })))),
                    React.createElement(GridItem, { span: 1 })))));
    };
    return JaegerToolbar;
}(React.Component));
export { JaegerToolbar };
//# sourceMappingURL=JaegerToolbar.js.map
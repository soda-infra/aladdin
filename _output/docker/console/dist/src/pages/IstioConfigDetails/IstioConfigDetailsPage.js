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
import { Col, Nav, NavItem, Row, TabContainer, TabContent, TabPane } from 'patternfly-react';
import { Prompt } from 'react-router-dom';
import { aceOptions, safeDumpOptions } from '../../types/IstioConfigDetails';
import * as MessageCenter from '../../utils/MessageCenter';
import * as API from '../../services/Api';
import AceEditor from 'react-ace';
import 'brace/mode/yaml';
import 'brace/theme/eclipse';
import { jsYaml, parseKialiValidations, parseYamlValidations } from '../../types/AceValidations';
import IstioActionDropdown from '../../components/IstioActions/IstioActionsDropdown';
import './IstioConfigDetailsPage.css';
import { default as IstioActionButtonsContainer } from '../../components/IstioActions/IstioActionsButtons';
import BreadcrumbView from '../../components/BreadcrumbView/BreadcrumbView';
import VirtualServiceDetail from './IstioObjectDetails/VirtualServiceDetail';
import DestinationRuleDetail from './IstioObjectDetails/DestinationRuleDetail';
import history from '../../app/History';
import { Paths } from '../../config';
import { MessageType } from '../../types/MessageCenter';
import { getIstioObject, mergeJsonPatch } from '../../utils/IstioConfigUtils';
import { style } from 'typestyle';
var rightToolbarStyle = style({ float: 'right', marginTop: '8px' });
var navStyle = style({ paddingTop: '8px' });
var IstioConfigDetailsPage = /** @class */ (function (_super) {
    __extends(IstioConfigDetailsPage, _super);
    function IstioConfigDetailsPage(props) {
        var _this = _super.call(this, props) || this;
        _this.fetchIstioObjectDetails = function () {
            _this.fetchIstioObjectDetailsFromProps(_this.props.match.params);
        };
        _this.fetchIstioObjectDetailsFromProps = function (props) {
            var promiseConfigDetails = props.objectSubtype
                ? API.getIstioConfigDetailSubtype(props.namespace, props.objectType, props.objectSubtype, props.object)
                : API.getIstioConfigDetail(props.namespace, props.objectType, props.object, true);
            // Note that adapters/templates are not supported yet for validations
            promiseConfigDetails
                .then(function (resultConfigDetails) {
                _this.setState({
                    istioObjectDetails: resultConfigDetails.data,
                    istioValidations: resultConfigDetails.data.validation,
                    isModified: false,
                    yamlModified: ''
                });
            })
                .catch(function (error) {
                MessageCenter.add(API.getErrorMsg('Could not fetch IstioConfig details', error));
            });
        };
        _this.backToList = function () {
            // Back to list page
            history.push("/" + Paths.ISTIO + "?namespaces=" + _this.props.match.params.namespace);
        };
        _this.canDelete = function () {
            return _this.state.istioObjectDetails !== undefined && _this.state.istioObjectDetails.permissions.delete;
        };
        _this.canUpdate = function () {
            return _this.state.istioObjectDetails !== undefined && _this.state.istioObjectDetails.permissions.update;
        };
        _this.onCancel = function () {
            if (_this.hasOverview()) {
                _this.props.history.push(_this.props.location.pathname + '?list=overview');
            }
            else {
                _this.backToList();
            }
        };
        _this.onDelete = function () {
            var deletePromise = _this.props.match.params.objectSubtype
                ? API.deleteIstioConfigDetailSubtype(_this.props.match.params.namespace, _this.props.match.params.objectType, _this.props.match.params.objectSubtype, _this.props.match.params.object)
                : API.deleteIstioConfigDetail(_this.props.match.params.namespace, _this.props.match.params.objectType, _this.props.match.params.object);
            deletePromise
                .then(function (_r) { return _this.backToList(); })
                .catch(function (error) {
                MessageCenter.add(API.getErrorMsg('Could not delete IstioConfig details.', error));
            });
        };
        _this.onUpdate = function () {
            jsYaml.safeLoadAll(_this.state.yamlModified, function (objectModified) {
                var jsonPatch = JSON.stringify(mergeJsonPatch(objectModified, getIstioObject(_this.state.istioObjectDetails)));
                var updatePromise = _this.props.match.params.objectSubtype
                    ? API.updateIstioConfigDetailSubtype(_this.props.match.params.namespace, _this.props.match.params.objectType, _this.props.match.params.objectSubtype, _this.props.match.params.object, jsonPatch)
                    : API.updateIstioConfigDetail(_this.props.match.params.namespace, _this.props.match.params.objectType, _this.props.match.params.object, jsonPatch);
                updatePromise
                    .then(function (_r) {
                    var targetMessage = _this.props.match.params.namespace +
                        ' / ' +
                        (_this.props.match.params.objectSubtype
                            ? _this.props.match.params.objectSubtype
                            : _this.props.match.params.objectType) +
                        ' / ' +
                        _this.props.match.params.object;
                    MessageCenter.add('Changes applied on ' + targetMessage, 'default', MessageType.SUCCESS);
                    _this.fetchIstioObjectDetails();
                })
                    .catch(function (error) {
                    MessageCenter.add(API.getErrorMsg('Could not update IstioConfig details.', error));
                });
            });
        };
        _this.onEditorChange = function (value) {
            _this.setState({
                isModified: true,
                yamlModified: value,
                istioValidations: {},
                yamlValidations: parseYamlValidations(value)
            });
        };
        _this.onRefresh = function () {
            var refresh = true;
            if (_this.state.isModified) {
                refresh = window.confirm('You have unsaved changes, are you sure you want to refresh ?');
            }
            if (refresh) {
                _this.fetchIstioObjectDetails();
            }
        };
        _this.fetchYaml = function () {
            if (_this.state.isModified) {
                return _this.state.yamlModified;
            }
            var istioObject = getIstioObject(_this.state.istioObjectDetails);
            return istioObject ? jsYaml.safeDump(istioObject, safeDumpOptions) : '';
        };
        _this.renderEditor = function () {
            var yamlSource = _this.fetchYaml();
            var editorValidations = {
                markers: [],
                annotations: []
            };
            if (!_this.state.isModified) {
                editorValidations = parseKialiValidations(yamlSource, _this.state.istioValidations);
            }
            else {
                if (_this.state.yamlValidations) {
                    editorValidations.markers = _this.state.yamlValidations.markers;
                    editorValidations.annotations = _this.state.yamlValidations.annotations;
                }
            }
            return (React.createElement("div", { className: "container-fluid container-cards-pf" },
                React.createElement(Row, { className: "row-cards-pf" },
                    React.createElement(Col, null,
                        _this.state.istioObjectDetails ? (React.createElement(AceEditor, { ref: _this.aceEditorRef, mode: "yaml", theme: "eclipse", onChange: _this.onEditorChange, width: '100%', height: 'var(--kiali-yaml-editor-height)', className: 'istio-ace-editor', readOnly: !_this.canUpdate(), setOptions: aceOptions, value: _this.state.istioObjectDetails ? yamlSource : undefined, annotations: editorValidations.annotations, markers: editorValidations.markers })) : null,
                        _this.renderActionButtons()))));
        };
        _this.renderActionButtons = function () {
            // User won't save if file has yaml errors
            var yamlErrors = _this.state.yamlValidations && _this.state.yamlValidations.markers.length > 0 ? true : false;
            return (React.createElement(IstioActionButtonsContainer, { objectName: _this.props.match.params.object, readOnly: !_this.canUpdate(), canUpdate: _this.canUpdate() && _this.state.isModified && !yamlErrors, onCancel: _this.onCancel, onUpdate: _this.onUpdate, onRefresh: _this.onRefresh }));
        };
        _this.renderRightToolbar = function () {
            var canDelete = _this.state.istioObjectDetails !== undefined && _this.state.istioObjectDetails.permissions.delete;
            var istioObject = getIstioObject(_this.state.istioObjectDetails);
            return (React.createElement("span", { className: rightToolbarStyle },
                React.createElement(IstioActionDropdown, { objectKind: istioObject ? istioObject.kind : undefined, objectName: _this.props.match.params.object, canDelete: canDelete, onDelete: _this.onDelete })));
        };
        // Not all Istio types have components to render an overview tab
        _this.hasOverview = function () {
            return (_this.props.match.params.objectType === 'virtualservices' ||
                _this.props.match.params.objectType === 'destinationrules');
        };
        _this.renderOverview = function () {
            if (_this.state.istioObjectDetails) {
                if (_this.state.istioObjectDetails.virtualService) {
                    return (React.createElement(VirtualServiceDetail, { virtualService: _this.state.istioObjectDetails.virtualService, validation: _this.state.istioValidations, namespace: _this.state.istioObjectDetails.namespace.name }));
                }
                if (_this.state.istioObjectDetails.destinationRule) {
                    return (React.createElement(DestinationRuleDetail, { destinationRule: _this.state.istioObjectDetails.destinationRule, validation: _this.state.istioValidations, namespace: _this.state.istioObjectDetails.namespace.name }));
                }
            }
            else {
                // In theory it shouldn't enter here
                return React.createElement("div", null,
                    _this.props.match.params.object,
                    " has not been loaded");
            }
        };
        _this.renderTabs = function () {
            return (React.createElement(TabContainer, { id: "basic-tabs", activeKey: _this.activeTab('list', _this.hasOverview() ? 'overview' : 'yaml'), onSelect: _this.tabSelectHandler('list') },
                React.createElement("div", null,
                    React.createElement(Nav, { bsClass: "nav nav-tabs nav-tabs-pf " + navStyle },
                        _this.hasOverview() ? (React.createElement(NavItem, { eventKey: "overview" },
                            React.createElement("div", null, "Overview"))) : null,
                        React.createElement(NavItem, { eventKey: "yaml" },
                            React.createElement("div", null,
                                "YAML ",
                                _this.state.isModified ? ' * ' : undefined))),
                    React.createElement(TabContent, null,
                        _this.hasOverview() ? (React.createElement(TabPane, { eventKey: "overview", mountOnEnter: true, unmountOnExit: true }, _this.renderOverview())) : null,
                        React.createElement(TabPane, { eventKey: "yaml" }, _this.renderEditor())))));
        };
        _this.activeTab = function (tabNameParam, whenEmpty) {
            return new URLSearchParams(_this.props.location.search).get(tabNameParam) || whenEmpty;
        };
        // Helper method to extract search urls with format
        // ?list=overview or ?list=yaml
        _this.parseSearch = function () {
            var parsed = {};
            if (_this.props.location.search) {
                var firstParams = _this.props.location.search
                    .split('&')[0]
                    .replace('?', '')
                    .split('=');
                parsed.type = firstParams[0];
                parsed.name = firstParams[1];
            }
            return {};
        };
        _this.tabSelectHandler = function (tabNameParam) {
            return function (tabKey) {
                if (!tabKey) {
                    return;
                }
                var urlParams = new URLSearchParams('');
                var parsedSearch = _this.parseSearch();
                if (parsedSearch.type && parsedSearch.name) {
                    urlParams.set(parsedSearch.type, parsedSearch.name);
                }
                urlParams.set(tabNameParam, tabKey);
                _this.props.history.push(_this.props.location.pathname + '?' + urlParams.toString());
            };
        };
        _this.state = { isModified: false };
        _this.aceEditorRef = React.createRef();
        _this.promptTo = '';
        return _this;
    }
    IstioConfigDetailsPage.prototype.componentDidMount = function () {
        this.fetchIstioObjectDetails();
    };
    IstioConfigDetailsPage.prototype.componentDidUpdate = function (prevProps) {
        // This will ask confirmation if we want to leave page on pending changes without save
        if (this.state.isModified) {
            window.onbeforeunload = function () { return true; };
        }
        else {
            window.onbeforeunload = null;
        }
        // This will reset the flag to prevent ask multiple times the confirmation to leave with unsaved changed
        this.promptTo = '';
        // Hack to force redisplay of annotations after update
        // See https://github.com/securingsincity/react-ace/issues/300
        if (this.aceEditorRef.current) {
            // tslint:disable-next-line
            this.aceEditorRef.current['editor'].onChangeAnnotation();
        }
        if (!this.propsMatch(prevProps)) {
            this.fetchIstioObjectDetailsFromProps(this.props.match.params);
        }
    };
    IstioConfigDetailsPage.prototype.propsMatch = function (prevProps) {
        return (this.props.match.params.namespace === prevProps.match.params.namespace &&
            this.props.match.params.object === prevProps.match.params.object &&
            this.props.match.params.objectType === prevProps.match.params.objectType &&
            this.props.match.params.objectSubtype === prevProps.match.params.objectSubtype);
    };
    IstioConfigDetailsPage.prototype.componentWillUnmount = function () {
        // Reset ask confirmation flag
        window.onbeforeunload = null;
    };
    IstioConfigDetailsPage.prototype.render = function () {
        var _this = this;
        return (React.createElement(React.Fragment, null,
            React.createElement(BreadcrumbView, { location: this.props.location }),
            this.renderRightToolbar(),
            this.renderTabs(),
            React.createElement(Prompt, { message: function (location) {
                    if (_this.state.isModified) {
                        // Check if Prompt is invoked multiple times
                        if (_this.promptTo === location.pathname) {
                            return true;
                        }
                        _this.promptTo = location.pathname;
                        return 'You have unsaved changes, are you sure you want to leave?';
                    }
                    return true;
                } })));
    };
    return IstioConfigDetailsPage;
}(React.Component));
export default IstioConfigDetailsPage;
//# sourceMappingURL=IstioConfigDetailsPage.js.map
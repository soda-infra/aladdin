import { ColaGraph } from './ColaGraph';
import { CoseGraph } from './CoseGraph';
import { DagreGraph } from './DagreGraph';
var LayoutMap = {
    cola: ColaGraph.getLayout(),
    dagre: DagreGraph.getLayout(),
    'cose-bilkent': CoseGraph.getLayout()
};
var getLayout = function (layout) {
    return LayoutMap.hasOwnProperty(layout.name) ? LayoutMap[layout.name] : LayoutMap.dagre;
};
var getLayoutByName = function (layoutName) {
    return LayoutMap.hasOwnProperty(layoutName) ? LayoutMap[layoutName] : LayoutMap.dagre;
};
export { getLayout, getLayoutByName };
//# sourceMappingURL=LayoutDictionary.js.map
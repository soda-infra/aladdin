import { GraphFilterActions } from '../GraphFilterActions';
import { EdgeLabelMode } from '../../types/GraphFilter';
// Test our ActionCreators for proper message format
describe('GraphFilterActions', function () {
    it('should toggle an edge label ', function () {
        var action = GraphFilterActions.setEdgelLabelMode(EdgeLabelMode.RESPONSE_TIME_95TH_PERCENTILE);
        expect(action.payload).toEqual(EdgeLabelMode.RESPONSE_TIME_95TH_PERCENTILE);
    });
    it('should enable graph filters toggles', function () {
        var action = GraphFilterActions.showGraphFilters(true);
        expect(action.payload).toBeTruthy();
    });
    it('should disable graph filters toggles', function () {
        var action = GraphFilterActions.showGraphFilters(false);
        expect(action.payload).toBeFalsy();
    });
});
//# sourceMappingURL=GraphFilterAction.test.js.map
## How to use material-ui

### Installation

```bash
// npm install
$ npm install @material-ui/core

// yarn install
$ yarn add @material-ui/core
```

### Upgrade react & react-dom

```bash
// npm upgrade
$ npm install --save react@16.8.1
$ npm install --save react-dom@16.8.1
// yarn upgrade
$ yarn upgrade react@^16.8.1
$ yarn upgrade react-dom@^16.8.1
```

### Check upgrade

```bash
$ npm ls react
```

### Example

```tsx
// kiali-ui/src/components/CytoscapeGraph/CytoscapeGraph.tsx

// add material-ui functions
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
...

// add source code to 108 line or where you want
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '20%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];
...

// about 230 or 240 line, add "<SimpleTable />"
render() {
    return (
      <div id="cytoscape-container" className={this.props.containerClassName}>
        <ReactResizeDetector handleWidth={true} handleHeight={true} skipOnMount={false} onResize={this.onResize} />
        <EmptyGraphLayoutContainer
          elements={this.props.elements}
          namespaces={this.props.activeNamespaces}
          action={this.props.refresh}
          isLoading={this.props.isLoading}
          isError={this.props.isError}
        >
          
          <CytoscapeContextMenuWrapper
            ref={this.contextMenuRef}
            edgeContextMenuContent={this.props.contextMenuEdgeComponent}
            nodeContextMenuContent={this.props.contextMenuNodeComponent}
            groupContextMenuContent={this.props.contextMenuGroupComponent}
          />
          <SimpleTable />  
          <CytoscapeReactWrapper ref={e => this.setCytoscapeReactWrapperRef(e)} />
        </EmptyGraphLayoutContainer>
      </div>
    );
  }
...

// about 800 line, add SimpleTable function
function SimpleTable() {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
```

* If you run `kiali` again, you can see the table.


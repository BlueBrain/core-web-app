import Plot from 'react-plotly.js';
import connectivityMatrix from 'src/connectivity-dummy.json';
// import styles from './connectome-definition.module.css';

export default function MacroConnectome() {
  return (
    <div style={{ gridArea: 'matrix-container', position: 'relative' }}>
      <Plot
        data={[
          {
            z: connectivityMatrix.densities,
            x: connectivityMatrix.parcellation,
            y: connectivityMatrix.parcellation,
            type: 'heatmap',
          },
        ]}
        layout={{}}
      />
    </div>
  );
}

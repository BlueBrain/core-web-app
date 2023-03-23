import Plot from 'react-plotly.js';
import connectivityMatrix from './connectivity-dummy.json';

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
            colorscale: 'Hot',
          },
        ]}
        layout={{
          width: 500,
          height: 500,
          paper_bgcolor: '#000',
          xaxis: {
            color: '#DCDCDC',
            tickfont: {
              size: 7,
            },
          },
          yaxis: {
            color: '#DCDCDC',
            tickfont: {
              size: 7,
            },
          },
        }}
      />
    </div>
  );
}

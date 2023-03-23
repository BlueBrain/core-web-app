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
          width: 900,
          height: 600,
          paper_bgcolor: '#000',
          xaxis: {
            automargin: true,
            color: '#DCDCDC',
            tickfont: {
              size: 7,
            },
          },
          yaxis: {
            automargin: true,
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

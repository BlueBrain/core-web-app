import './styles/morpho-legend.css';

function MorphoLegend({
  isInterneuron,
  hasApproximatedSoma,
}: {
  isInterneuron: boolean;
  hasApproximatedSoma: boolean;
}) {
  return (
    <div className="morpho-legend">
      <ul>
        <li className="soma">Soma {hasApproximatedSoma && '(Approximated)'}</li>
        <li className="axon">Axon</li>

        {
          // Interneurons don't have a distinction between Basal / Apical Dendrites
          isInterneuron ? (
            <li className="basal-dendrites">Dendrites</li>
          ) : (
            <>
              <li className="basal-dendrites">Basal Dendrites</li>
              <li className="apical-dendrites">Apical Dendrites</li>
            </>
          )
        }
      </ul>
    </div>
  );
}

export default MorphoLegend;

import { ReactNode } from 'react';
import DiscoverLinks from './DiscoverLinks';
import DiscoverObpItem from './DiscoverObpItem';
import { basePath } from '@/config';

const items: {
  image: string;
  title: string;
  bulletPoints: string[];
  bottomElement: ReactNode;
}[] = [
  {
    image: `${basePath}/images/virtual-lab/obp_full_brain_blue.png`,
    title: 'Explore',
    bulletPoints: [
      'Select the mouse brain region of interest to explore the types and densities of neurons known to exist in this region.',
      'Investigate experimental data such as neuron reconstructions and electrical recordings of neurons catalogued in these regions.',
      'Investigate models of neurons catalogued in these regions.',
      'Investigate literature in related to the selected regions.',
      'Explore the datasets and trigger measurements in natural language.',
    ],
    bottomElement: (
      <DiscoverLinks
        topLink="/virtual-lab/tutorials/explore"
        topText="How do I explore?"
        bottomLink="explore"
        bottomText="Start exploring"
      />
    ),
  },
  {
    image: `${basePath}/images/virtual-lab/obp_vl_build.png`,
    title: 'Build',
    bulletPoints: [
      'Determine the specific cell type and properties to build a single-cell neuron model of interest.',
      'View and select a reconstructed or synthesized morphology and choose a detailed electrical compartmental model.',
      'Build the model and validate it following a set of standard protocols.',
    ],
    bottomElement: (
      <DiscoverLinks
        topLink="/virtual-lab/tutorials/build"
        topText="How can I build models?"
        bottomLink="build"
        bottomText="View models"
      />
    ),
  },
  {
    image: `${basePath}/images/virtual-lab/obp_vl_simulate.png`,
    title: 'Simulate',
    bulletPoints: [
      'Select an existing single-cell model.',
      'Define which protocol to use to stimulate the cell and configure it.',
      'Define your recording location.',
      'Visualize the membrane potential at the recording location to understand the electrical behavior.',
    ],
    bottomElement: (
      <DiscoverLinks
        topLink="/virtual-lab/tutorials/simulate"
        topText="How can I launch simulations?"
        bottomLink="simulate"
        bottomText="View simulations"
      />
    ),
  },
];

export default function DiscoverObpPanel() {
  return (
    <div className="mt-10 flex flex-col gap-5">
      <div className="font-bold uppercase">Discover BBOP</div>
      <div className="flex w-full flex-row gap-3">
        {items.map((obpItem) => (
          <DiscoverObpItem
            key={obpItem.title}
            imagePath={obpItem.image}
            title={obpItem.title}
            body={
              <ul className="list-inside list-square">
                {obpItem.bulletPoints.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            }
            bottomElement={obpItem.bottomElement}
          />
        ))}
      </div>
    </div>
  );
}

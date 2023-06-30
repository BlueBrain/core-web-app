export const typeToColumns: { [id: string]: string[] } = {
  'https://neuroshapes.org/BoutonDensity': [
    'brainRegion',
    'mType',
    'meanstd',
    'sem',
    'numberOfCells',
    'subjectSpecies',
    'contributors',
    'createdAt',
  ],
  'https://neuroshapes.org/NeuronDensity': [
    'brainRegion',
    'mType',
    'eType',
    'neuronDensity',
    'name',
    'subjectSpecies',
    'contributors',
    'createdAt',
  ],

  'https://neuroshapes.org/Trace': [
    'brainRegion',
    'eType',
    'name',
    'subjectSpecies',
    'contributors',
    'createdAt',
  ],
  'https://neuroshapes.org/LayerThickness': [
    'brainRegion',
    'layer',
    'layerThickness',
    'subjectSpecies',
    'contributors',
    'createdAt',
  ],
  'https://neuroshapes.org/NeuronMorphology': [
    'brainRegion',
    'mType',
    'name',
    'subjectSpecies',
    'contributors',
    'createdAt',
  ],
  'https://neuroshapes.org/SynapsePerConnection': [
    'brainRegion',
    'mType',
    'name',
    'subjectSpecies',
    'contributors',
    'createdAt',
  ],
};

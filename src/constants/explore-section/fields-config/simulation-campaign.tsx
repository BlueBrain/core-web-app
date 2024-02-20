import { IndexColContent } from '@/components/ListTable';
import { selectorFnStatistic } from '@/util/explore-section/listing-selectors';
import ListField from '@/components/explore-section/Fields/ListField';
import SimulationCampaignStatus from '@/components/explore-section/SimulationCampaignStatus';
import timeElapsedFromToday from '@/util/date';
import { ExploreFieldsConfigProps } from '@/constants/explore-section/fields-config/types';
import { FilterTypeEnum } from '@/types/explore-section/filters';
import { Simulation, SimulationCampaign } from '@/types/explore-section/delta-simulation-campaigns';
import { Field } from '@/constants/explore-section/fields-config/enums';

export const SIMULATION_CAMPAIGN_FIELDS_CONFIG: ExploreFieldsConfigProps<SimulationCampaign> = {
  [Field.SimulationCampaignName]: {
    esTerms: {
      flat: {
        filter: 'name.keyword',
        sort: 'name.keyword',
      },
    },
    title: 'Name',
    filter: null,
    render: {
      esResourceViewFn: (_t, r) =>
        IndexColContent({
          id: r._source['@id'],
          project: r._source?.project.label,
          text: r._source?.name,
        }),
    },
    vocabulary: {
      plural: 'Names',
      singular: 'Name',
    },
  },
  [Field.BrainConfiguration]: {
    esTerms: {
      flat: {
        filter: 'nValue',
        sort: 'nValue',
      },
    },
    title: 'Brain Configuration',
    filter: null,
    render: {
      esResourceViewFn: (_t, r) => selectorFnStatistic(r._source, 'N'),
      deltaResourceViewFn: (resource) => resource?.brainConfiguration,
    },
    vocabulary: {
      plural: 'Brain Configurations',
      singular: 'Brain Configuration',
    },
  },
  [Field.Dimensions]: {
    title: 'Dimensions',
    filter: FilterTypeEnum.CheckList,
    render: {
      deltaResourceViewFn: (resource) => (
        <ListField
          items={
            resource.parameter?.coords &&
            Object.entries(resource.parameter?.coords).map(([k]) => ({
              id: k,
              label: k,
            }))
          }
        />
      ),
    },
    vocabulary: {
      plural: 'Dimensions',
      singular: 'Dimension',
    },
  },
  [Field.Attributes]: {
    title: 'Attributes',
    filter: FilterTypeEnum.CheckList,
    render: {
      deltaResourceViewFn: (resource) => (
        <ListField
          items={
            resource.parameter?.attrs &&
            Object.entries(resource.parameter?.attrs ?? {}).map(([k]) => ({
              id: k,
              label: k,
            }))
          }
        />
      ),
    },
    vocabulary: {
      plural: 'Attributes',
      singular: 'Attribute',
    },
  },
  [Field.SimulationCampaignStatus]: {
    title: 'Status',
    filter: FilterTypeEnum.CheckList,
    render: {
      deltaResourceViewFn: () => <SimulationCampaignStatus />,
    },
    vocabulary: {
      plural: 'Status',
      singular: 'Status',
    },
  },
  [Field.SimulationStatus]: {
    title: 'Status',
    filter: FilterTypeEnum.CheckList,
    render: {
      deltaResourceViewFn: (resource) => (resource as any as Simulation)?.status,
    },
    vocabulary: {
      plural: 'Status',
      singular: 'Status',
    },
  },
  [Field.Campaign]: {
    title: 'Campaign',
    filter: FilterTypeEnum.CheckList,
    render: {
      deltaResourceViewFn: (resource) => resource?.wasGeneratedBy?.['@id'],
    },
    vocabulary: {
      plural: 'Campaigns',
      singular: 'Campaign',
    },
  },
  [Field.Tags]: {
    title: 'Tags',
    filter: FilterTypeEnum.CheckList,
    render: {
      deltaResourceViewFn: () => undefined,
    },
    vocabulary: {
      plural: 'Tags',
      singular: 'Tag',
    },
  },
  [Field.StartedAt]: {
    title: 'started at',
    filter: null,
    render: {
      deltaResourceViewFn: (resource) =>
        resource && timeElapsedFromToday((resource as any as Simulation).startedAtTime),
    },
    vocabulary: {
      plural: 'Dates',
      singular: 'Date',
    },
  },
  [Field.CompletedAt]: {
    title: 'completed at',
    filter: null,
    render: {
      deltaResourceViewFn: (resource) =>
        resource && timeElapsedFromToday((resource as any as Simulation).endedAtTime),
    },
    vocabulary: {
      plural: 'Dates',
      singular: 'Date',
    },
  },
};

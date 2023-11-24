import { IndexColContent } from '@/components/ListTable';
import { selectorFnStatistic } from '@/state/explore-section/listing-selectors';
import ListField from '@/components/explore-section/Fields/ListField';
import SimulationCampaignStatus from '@/components/explore-section/SimulationCampaignStatus';
import timeElapsedFromToday from '@/util/date';
import { ExploreFieldsConfigProps } from '@/constants/explore-section/fields-config/types';

export const SIMULATION_CAMPAIGN_FIELDS_CONFIG: ExploreFieldsConfigProps = {
  simCampName: {
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
  brainConfiguration: {
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
  dimensions: {
    title: 'Dimensions',
    filter: 'checkList',
    render: {
      deltaResourceViewFn: (resource) => (
        <ListField
          items={
            resource.parameter?.coords &&
            Object.entries(resource.parameter?.coords).map(([k]) => ({ id: k, label: k }))
          }
        />
      ),
    },
    vocabulary: {
      plural: 'Dimensions',
      singular: 'Dimension',
    },
  },
  attributes: {
    title: 'Attributes',
    filter: 'checkList',
    render: {
      deltaResourceViewFn: (resource) => (
        <ListField
          items={
            resource.parameter?.attrs &&
            Object.entries(resource.parameter?.attrs).map(([k]) => ({ id: k, label: k }))
          }
        />
      ),
    },
    vocabulary: {
      plural: 'Attributes',
      singular: 'Attribute',
    },
  },
  simulationCampaignStatus: {
    title: 'Status',
    filter: 'checkList',
    render: {
      deltaResourceViewFn: () => <SimulationCampaignStatus />,
    },
    vocabulary: {
      plural: 'Status',
      singular: 'Status',
    },
  },
  simulationStatus: {
    title: 'Status',
    filter: 'checkList',
    render: {
      deltaResourceViewFn: (resource) => resource?.status,
    },
    vocabulary: {
      plural: 'Status',
      singular: 'Status',
    },
  },
  campaign: {
    title: 'Campaign',
    filter: 'checkList',
    render: {
      deltaResourceViewFn: (resource) => resource?.wasGeneratedBy?.['@id'],
    },
    vocabulary: {
      plural: 'Campaigns',
      singular: 'Campaign',
    },
  },
  tags: {
    title: 'Tags',
    filter: 'checkList',
    render: {
      deltaResourceViewFn: () => undefined,
    },
    vocabulary: {
      plural: 'Tags',
      singular: 'Tag',
    },
  },
  startedAt: {
    title: 'started at',
    filter: null,
    render: {
      deltaResourceViewFn: (resource) => resource && timeElapsedFromToday(resource.startedAtTime),
    },
    vocabulary: {
      plural: 'Dates',
      singular: 'Date',
    },
  },
  completedAt: {
    title: 'completed at',
    filter: null,
    render: {
      deltaResourceViewFn: (resource) => resource && timeElapsedFromToday(resource.endedAtTime),
    },
    vocabulary: {
      plural: 'Dates',
      singular: 'Date',
    },
  },
};

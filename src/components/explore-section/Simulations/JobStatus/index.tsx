import { Checkbox, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ClockCircleFilled } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import intersection from 'lodash/intersection';
import { DeltaResource, Simulation, SimulationStatus } from '@/types/explore-section';
import timeElapsedFromToday from '@/util/date';
import InlineDimension from '@/components/explore-section/Simulations/JobStatus/InlineDimension';
import EllipseIcon from '@/components/icons/Ellipse';
import './styles.css';

type JobStatusProps = {
  resource: DeltaResource;
};

export default function JobStatus({ resource }: JobStatusProps) {
  const [showDimensions, setShowDimensions] = useState<string[]>(
    resource.dimensions?.map((dim) => dim.id) || []
  );
  const [showOnly, setShowOnly] = useState<SimulationStatus[]>(['running', 'successful', 'failed']);

  const dimensionOptions = resource.dimensions?.map((dim) => ({ label: dim.label, value: dim.id }));
  const showOnlyOptions: {
    label: string;
    value: SimulationStatus;
  }[] = [
    { label: 'Running simulations', value: 'running' },
    { label: 'Successful simulations', value: 'successful' },
    { label: 'Failed Simulations', value: 'failed' },
  ];

  const filteredResults = useMemo(
    () =>
      resource.simulations
        ?.filter((sim) => intersection(sim.dimensions, showDimensions).length > 0)
        .filter((sim) => showOnly.includes(sim.status))
        .map((obj, idx) => ({ ...obj, key: idx })) || [],
    [resource.simulations, showDimensions, showOnly]
  );

  const renderRowClassName = (record: Simulation) => {
    switch (record.status) {
      case 'running':
        return 'text-primary-9';
      case 'successful':
        return 'text-secondary-3';
      case 'failed':
        return 'text-error';
      default:
        return '';
    }
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case 'successful':
        return (
          <>
            <EllipseIcon />
            <span>Done</span>
          </>
        );
      case 'running':
        return (
          <>
            <ClockCircleFilled />
            <span>Running</span>
          </>
        );
      case 'failed':
        return (
          <>
            <EllipseIcon />
            <span>Failed</span>
          </>
        );
      default:
        return <div />;
    }
  };

  // enrich table rows with the values of the dimensions
  const tableRows = useMemo(
    () =>
      filteredResults.map((simulation) => {
        const dimensions: { [key: string]: number[] | undefined } = {};
        resource.dimensions?.forEach((dim) => {
          if (simulation.dimensions.includes(dim.id)) {
            dimensions[dim.label] = dim.value;
          } else {
            dimensions[dim.label] = undefined;
          }
        });
        return { ...dimensions, ...simulation };
      }),
    [filteredResults, resource.dimensions]
  );

  // build extra dimension columns
  const dimensionColumns: ColumnsType<Simulation> = useMemo(
    () =>
      resource.dimensions?.map((dim) => ({
        title: dim.label,
        dataIndex: dim.label,
        key: dim.label,
        className: 'text-sm',
        render: (value: number[], simulation: Simulation) =>
          value && <InlineDimension value={value} status={simulation.status} />,
      })) || [],
    [resource.dimensions]
  );

  const columns: ColumnsType<Simulation> = [
    ...dimensionColumns,
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      className: 'text-sm',
      render: (status: string, simulation: Simulation) => (
        <div className="flex flex-row gap-2 items-center justify-center">
          {renderStatus(simulation.status)}
        </div>
      ),
      width: 100,
    },
    {
      title: 'STARTED',
      dataIndex: 'startedAt',
      key: 'startedAt',
      className: 'text-sm',
      render: (startedAt: string) => timeElapsedFromToday(startedAt),
      width: 100,
    },
    {
      title: 'COMPLETED AT',
      dataIndex: 'completedAt',
      key: 'completedAt',
      className: 'text-sm',
      render: (completedAt: string) => (completedAt ? timeElapsedFromToday(completedAt) : '-'),
      width: 100,
    },
  ];

  return (
    <div>
      <div>
        <div>
          <div className="text-neutral-4 font-semibold text-xs mb-3">Show dimensions:</div>
          {dimensionOptions && (
            <Checkbox.Group
              className="job-status-filters"
              options={dimensionOptions}
              defaultValue={showDimensions}
              onChange={(checked: CheckboxValueType[]) => setShowDimensions(checked as string[])}
            />
          )}
        </div>
        <div className="mt-6">
          <div className="text-neutral-4 font-semibold text-xs mb-3">Show only:</div>
          {showOnlyOptions && (
            <Checkbox.Group
              className="job-status-filters"
              options={showOnlyOptions}
              defaultValue={['running', 'successful', 'failed']}
              onChange={(checked: CheckboxValueType[]) =>
                setShowOnly(checked as SimulationStatus[])
              }
            />
          )}
        </div>
      </div>
      <hr className="mt-7" />
      <Table
        id="simulation-job-status-table"
        rowClassName={renderRowClassName}
        dataSource={tableRows}
        columns={columns}
      />
    </div>
  );
}

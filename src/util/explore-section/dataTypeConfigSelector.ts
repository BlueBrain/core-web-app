import { ExperimentDataTypeName } from '@/constants/explore-section/list-views';
import {
  EXPERIMENT_DATA_TYPES,
  SIMULATION_DATA_TYPES,
  ExperimentConfig,
} from '@/constants/explore-section/experiment-types';

/**
 * Returns a ExperimentConfig based on experimentTypeName.
 * @param {ExperimentDataTypeName} experimentTypeName - A experiment type name string.
 *
 */
export default function dataTypeConfigSelector(
  experimentTypeName: ExperimentDataTypeName
): ExperimentConfig {
  return experimentTypeName in SIMULATION_DATA_TYPES
    ? SIMULATION_DATA_TYPES[experimentTypeName]
    : EXPERIMENT_DATA_TYPES[experimentTypeName];
}

import JsonRpc from '@brayns/json-rpc';
import { assertType } from '@/util/type-guards';

export default class BackendService {
  private readonly service: JsonRpc;

  constructor(hostname: string) {
    this.service = new JsonRpc(hostname, { secure: true, trace: false });
  }

  async getInfo(path: string): Promise<{
    populations: CircuitPopulation[];
    reports: SimulationReport[];
  }> {
    const data = await this.service.exec('sonata-list-populations', {
      path,
    });
    assertListPopulationResult(data);
    return data;
  }

  async getVersion(): Promise<string> {
    const data = await this.service.exec('version');
    assertType<{ version: string }>(data, { version: 'string' });
    return data.version;
  }
}

export interface CircuitPopulation {
  name: string;
  type: string;
  size: number;
}

export interface SimulationReport {
  name: string;
  type: string;
  start: number;
  end: number;
  delta: number;
  unit: string;
  cells: string;
}

interface ListPopulationResult {
  populations: CircuitPopulation[];
  reports: SimulationReport[];
}

function assertListPopulationResult(data: unknown): asserts data is ListPopulationResult {
  assertType(data, {
    populations: ['array', { name: 'string', type: 'string' }],
    reports: [
      'array',
      {
        name: 'string',
        type: 'string',
        start: 'number',
        end: 'number',
        delta: 'number',
        unit: 'string',
        cells: 'string',
      },
    ],
  });
}

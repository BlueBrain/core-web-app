import ImageStream from '../../common/image-stream';
import JsonRpc from '../../common/json-rpc';
import Settings from '../../common/settings';
import { Vector3 } from '../../common/utils/calc';
import { BraynsSimulationOptions } from '../types';
import BackendService from './backend-service';
import { findSimulationProperties } from './find-simulation-properties';
import { CampaignSimulation } from './types';
import { logError } from '@/util/logger';
import { assertType } from '@/util/type-guards';

/**
 * Brayns will throw an error of we try to set a viewport
 * smaller than this.
 */
const MINIMAL_VIEWPORT_SIZE = 64;

/**
 * This class is responsible of the communication with an instance of Brayns.
 */
export default class BraynsService {
  private readonly stream: ImageStream;

  private readonly service: JsonRpc;

  private readonly backend: BackendService;

  constructor(hostname: string, onNewImage: (image: HTMLImageElement) => void) {
    this.service = new JsonRpc(hostname, { secure: true, trace: false });
    this.backend = new BackendService(figureOutBackendServiceFromBraynsHostname(hostname));
    this.stream = new ImageStream(this.service);
    this.stream.eventNewImage.addListener((stream) => {
      onNewImage(stream.image);
    });
  }

  askNextFrame(): Promise<void> {
    return this.stream.askForNextFrame();
  }

  async getRendererVersion(): Promise<string> {
    const version = await this.service.exec('get-version');
    assertType<{ major: number; minor: number; patch: number; revision: string }>(version, {
      major: 'number',
      minor: 'number',
      patch: 'number',
      revision: 'string',
    });
    return `${version.major}.${version.minor}.${version.patch} (${version.revision})`;
  }

  async getBackendVersion(): Promise<string> {
    return this.backend.getVersion();
  }

  async setViewport(width: number, height: number) {
    const { service } = this;
    const w = Math.max(MINIMAL_VIEWPORT_SIZE, Math.ceil(width));
    const h = Math.max(MINIMAL_VIEWPORT_SIZE, Math.ceil(height));
    await service.exec('set-application-parameters', {
      viewport: [w, h],
    });
  }

  async loadCircuit(simulation: CampaignSimulation) {
    const { service } = this;
    const options: BraynsSimulationOptions = findSimulationProperties(simulation);
    await service.exec('set-camera-orthographic', { height: 15000 });
    await service.exec('set-camera-view', {
      position: [6587, 3849, 18837],
      target: [6587, 3849, 5687],
      up: [0, 1, 0],
    });
    await service.exec('set-renderer-interactive', {
      ao_samples: 2,
      enable_shadows: false,
      max_ray_bounces: 1,
      samples_per_pixel: 4,
      background_color: [0.002, 0.008, 0.051, 0],
    });
    try {
      await service.exec('set-framebuffer-progressive', { scale: 8 });
    } catch (ex) {
      logError('Progressive FrameBuffer setting failed!', ex);
    }
    await service.exec('clear-models');
    await service.exec('clear-lights');
    await service.exec('add-light-ambient', { intensity: 1 });
    const models = await service.exec(
      'add-model',
      await this.getSonataLoderProperties(options.circuitPath)
    );
    assertType<{ model_id: number }[]>(models, ['array', { model_id: 'number' }]);
    const [model] = models;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { model_id } = model; // Brayns uses snake-case.
    await service.exec('enable-simulation', { enabled: true, model_id });
    const params = await service.exec('get-simulation-parameters');
    assertType<{
      current?: number;
      dt: number;
      end_frame: number;
      start_frame: number;
      unit: string;
    }>(params, {
      current: ['?', 'number'],
      dt: 'number',
      end_frame: 'number',
      start_frame: 'number',
      unit: 'string',
    });
  }

  async setFrameIndex(frameIndex: number) {
    const { service } = this;
    await service.exec('set-simulation-parameters', {
      current: frameIndex,
    });
  }

  private async getSonataLoderProperties(circuitPath: string) {
    const info = await this.backend.getInfo(circuitPath);
    const report = info.reports.find((item) => item.type === 'compartment');
    if (!report) {
      throw Error(`There is no compartment report in this circuit: "${circuitPath}"!`);
    }
    return {
      loader_name: 'SONATA loader',
      loader_properties: {
        node_population_settings: info.populations.map((population) => ({
          node_population: population.name,
          node_count_limit: Settings.NODE_COUNT_LIMIT,
          report_type: report.type,
          neuron_morphology_parameters: {
            load_axon: false,
            load_dendrites: true,
            load_soma: true,
            radius_multiplier: 2,
          },
          report_name: report.name,
          spike_transition_time: 0.5,
        })),
      },
      path: circuitPath,
    };
  }

  async setCameraView({ height }: { height: number }) {
    const { service } = this;
    await service.exec('set-camera-orthographic', { height });
  }

  async setCameraOrthographic({
    position,
    target,
    up,
  }: {
    position: Vector3;
    target: Vector3;
    up: Vector3;
  }) {
    const { service } = this;
    await service.exec('set-camera-view', {
      position,
      target,
      up,
    });
  }
}

/**
 * The proxy address for brayns end with "/renderer",
 * whereas for the backend we have "/backend".
 */
function figureOutBackendServiceFromBraynsHostname(hostname: string): string {
  const index = hostname.lastIndexOf('/renderer');
  return `${hostname.substring(0, index)}/backend`;
}

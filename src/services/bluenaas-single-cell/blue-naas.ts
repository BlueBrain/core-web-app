import omit from 'lodash/omit';

import Renderer, { ClickData, HoverData } from './renderer';
import Ws, { BlueNaasCmd, WSResponses } from './websocket';
import type { Morphology, PlotData, SecMarkerConfig, TraceData } from './types';
import { SimConfig } from '@/types/simulate/single-neuron';
import { blueNaas } from '@/config';

type BlueNaasInitData = {
  secNames: string[];
  segNames: string[];
};

interface BlueNaasConfig {
  onClick?: (data: ClickData) => void;
  onHover?: (data: HoverData) => void;
  onHoverEnd?: (data: HoverData) => void;
  onMorphLoaded?: (morphology: Morphology) => void;
  onInit?: (data: BlueNaasInitData) => void;
  onTraceData?: (traceData: TraceData) => void;
  onSimulationDone?: () => void;
  onStimuliPreviewData?: (data: PlotData) => void;
}

interface InitialCurrents {
  thresholdCurrent: number;
  holdingCurrent: number;
}

export default class BlueNaas {
  private config: BlueNaasConfig;

  private simConfig: SimConfig;

  private renderer: Renderer;

  private ws: Ws;

  private segNames: string[] = [];

  private traceData: TraceData | null = null;

  private assembleTempMap = new Map();

  private assembleMorphTempStr = '';

  private thresholdCurrent = 1;

  private stimulusProtocol = 'iv';

  constructor(
    container: HTMLDivElement,
    modelId: string,
    simConfig: SimConfig,
    initialCurrents: InitialCurrents,
    config: BlueNaasConfig = {}
  ) {
    this.simConfig = simConfig;
    this.config = config;

    this.renderer = new Renderer(container, config);
    this.ws = new Ws(blueNaas.wsUrl, this.onMessage);
    this.thresholdCurrent = initialCurrents.thresholdCurrent;
    this.ws.send(BlueNaasCmd.SET_MODEL, {
      model_id: modelId,
      threshold_current: initialCurrents.thresholdCurrent,
      holding_current: initialCurrents.holdingCurrent,
    });
  }

  private ensureSecMarkers() {
    this.renderer.ensureSecMarkers([
      { type: 'stimulus', secName: this.simConfig.injectTo },
      ...this.simConfig.recordFrom.map<SecMarkerConfig>((segName) => ({
        type: 'recording',
        secName: segName.replace(/_.*/, ''),
        segIdx: parseInt(segName.match(/_(\d+)$/)?.[1] ?? '0', 10),
      })),
    ]);
  }

  setConfig(simConfig: SimConfig) {
    this.simConfig = simConfig;
  }

  runSim() {
    this.traceData = null;

    this.ws.send(BlueNaasCmd.SET_INJECTION_LOCATION, this.simConfig?.injectTo);
  }

  private onMorphologyLoaded(morphology: Morphology) {
    const secNames = Object.keys(morphology);
    const segNames = secNames.reduce<string[]>(
      (names, sectionName) => [
        ...names,
        ...morphology[sectionName].diam.map(
          (_: number, segIdx: number) => `${sectionName}_${segIdx}`
        ),
      ],
      []
    );

    this.segNames = segNames;

    this.config.onInit?.({ secNames, segNames });
  }

  private showPartialData = () => {
    if (!this.simConfig) {
      throw new Error('No sim config found');
    }

    const plotData = [...this.assembleTempMap.entries()].map(([key, value]) => {
      return {
        t: value.t,
        v: value.v,
        label: key,
      };
    });

    this.config.onTraceData?.(plotData);
  };

  private assembleTempSimulationData(data: any) {
    /*
      data input {"name":"IV", "offset":2 ,"v":[...] ,"t":[...]}
    */

    if (this.assembleTempMap.has(data.name)) {
      const storedData = this.assembleTempMap.get(data.name);
      if (storedData.offset + 1 !== data.offset) {
        throw new Error('offset mismatch');
      }
      storedData.offset = data.offset;
      storedData.v = storedData.v.concat(data.v);
      storedData.t = storedData.t.concat(data.t);
    } else {
      if (data.offset !== 0) {
        throw new Error('first item should be offset 0');
      }
      this.assembleTempMap.set(data.name, {
        offset: 0,
        v: data.v,
        t: data.t,
      });
    }

    this.showPartialData();
  }

  setCallbackStimuliPreview(cb: BlueNaasConfig['onStimuliPreviewData']) {
    this.config.onStimuliPreviewData = cb;
  }

  updateStimuliPreview(amplitudes: number[]) {
    this.ws.send(BlueNaasCmd.GET_STIMULI_PLOT_DATA, {
      stimulus: {
        stimulusProtocol: this.stimulusProtocol,
        amplitudes,
        thresholdCurrent: this.thresholdCurrent,
      },
    });
  }

  setStimulusProtocol(protocol: string) {
    this.stimulusProtocol = protocol;
  }

  private onMessage = (cmd: WSResponses, data: any) => {
    switch (cmd) {
      case 'set_model_done':
        this.ws.send(BlueNaasCmd.GET_UI_DATA, {});
        break;
      case 'get_ui_data_done': {
        const morphology = JSON.parse(this.assembleMorphTempStr);
        const prunedMorph = this.renderer.removeNoDiameterSection(morphology);
        this.renderer.addMorphology(prunedMorph);
        this.onMorphologyLoaded(prunedMorph);
        this.ensureSecMarkers();
        break;
      }
      case 'partial_simulation_data':
        this.assembleTempSimulationData(data);
        break;
      case 'partial_morphology_data':
        this.assembleMorphTempStr = `${this.assembleMorphTempStr}${String(data)}`;
        break;
      case 'start_simulation_done':
        this.config?.onSimulationDone?.();
        this.showPartialData();
        break;
      case 'set_injection_location_done': {
        const simParameters = omit(this.simConfig, [
          'stimulus.paramInfo',
          'stimulus.stimulusProtocolOptions',
          'stimulus.stimulusProtocolInfo',
        ]);
        this.ws.send(BlueNaasCmd.START_SIMULATION, simParameters);
        break;
      }
      case 'get_stimuli_plot_data_done': {
        this.config?.onStimuliPreviewData?.(data);
        break;
      }
      default:
        break;
    }
  };

  destroy() {
    this.ws.destroy();
    this.renderer.destroy();
  }
}

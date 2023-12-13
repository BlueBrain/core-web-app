import Renderer, { ClickData, HoverData } from './renderer';
import Ws from './websocket';

import type { Morphology, SecMarkerConfig, SimConfig, TraceData } from './types';
import { blueNaas } from '@/config';

const BlueNaasCmd = {
  // Cmd target: backend
  SET_MODEL: 'set_model',
  GET_UI_DATA: 'get_ui_data',
  SET_ICLAMP: 'set_iclamp',
  START_SIM: 'start_simulation',
  // Cmd target: client
  MORPHOLOGY: 'morphology',
  SIM_VOLTAGE: 'sim_voltage',
};

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
}

export default class BlueNaas {
  private config: BlueNaasConfig;

  private simConfig: SimConfig;

  private renderer: Renderer;

  private ws: Ws;

  private segNames: string[] = [];

  private traceData: TraceData | null = null;

  constructor(
    container: HTMLDivElement,
    modelId: string,
    simConfig: SimConfig,
    config: BlueNaasConfig = {}
  ) {
    this.simConfig = simConfig;
    this.config = config;

    this.renderer = new Renderer(container, config);
    this.ws = new Ws(blueNaas.wsUrl, this.onMessage);

    this.ws.send(BlueNaasCmd.SET_MODEL, modelId);
    this.ws.send(BlueNaasCmd.GET_UI_DATA);
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

    this.ensureSecMarkers();
  }

  runSim() {
    this.traceData = null;

    this.ws.send(BlueNaasCmd.SET_ICLAMP, this.simConfig?.injectTo);
    this.ws.send(BlueNaasCmd.START_SIM, this.simConfig);
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

  private onTraceStepData = (traceStepData: number[]) => {
    if (!this.simConfig) {
      throw new Error('No sim config found');
    }

    this.traceData = this.simConfig.recordFrom
      .map((segName) => ({ segName, segIdx: this.segNames.indexOf(segName) }))
      .map(({ segName, segIdx }, idx) => ({
        segName,
        t: this.traceData ? this.traceData[idx].t.concat(traceStepData[0]) : [traceStepData[0]],
        v: this.traceData
          ? this.traceData[idx].v.concat(traceStepData[(segIdx as number) + 1])
          : [traceStepData[(segIdx as number) + 1]],
      }));

    this.config.onTraceData?.(this.traceData);
  };

  private onMessage = (cmd: string, data: any) => {
    switch (cmd) {
      case BlueNaasCmd.MORPHOLOGY:
        this.renderer.addMorphology(data);
        this.onMorphologyLoaded(data);
        this.ensureSecMarkers();
        break;
      case BlueNaasCmd.SIM_VOLTAGE:
        this.onTraceStepData(data);
        break;
      default:
        break;
    }
  };

  destroy() {
    this.ws.destroy();
    this.renderer.destroy();
  }
}

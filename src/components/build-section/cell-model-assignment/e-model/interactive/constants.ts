import { SimConfig } from './types';

export const BLUE_NAAS_DEPLOYMENT_URL = 'https://blue-naas-single-cell.sbo.kcp.bbp.epfl.ch';
export const BLUE_NAAS_WS_URL = 'wss://blue-naas-single-cell.sbo.kcp.bbp.epfl.ch/ws';

export const DEFAULT_SIM_CONFIG: SimConfig = {
  isFixedDt: false,
  celsius: 34,
  variableDt: true,
  dt: null,
  tstop: 1000,
  delay: 100,
  dur: 800,
  amp: 0.7,
  hypamp: 0,
  vinit: -73,
  injectTo: 'soma[0]',
  recordFrom: ['soma[0]_0'],
};

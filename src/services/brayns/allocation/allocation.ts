/* eslint-disable @typescript-eslint/no-use-before-define */
import BackendAllocatorService from './backend-allocator-service';
import Persistence from './persistence';
import Events from '@/services/brayns/utils/events';
import JsonRpcService from '@/services/brayns/json-rpc/json-rpc';
import Settings from '@/services/brayns/settings';
import BraynsWrapper from '@/services/brayns/wrapper/wrapper';
import { assertType } from '@/util/type-guards';

/**
 * Set this to `null` to get the renderer address from the service.
 * Or set a specific address if you need to debug a specific feature
 * in Brayns Renderer.
 */
const DEBUG_BRAYNS_ADDRESS = null; // '128.178.97.151:5000';

const Allocate = {
  async allocate(token: string): Promise<BraynsWrapper> {
    const promisedService = await getPromisedService(token);
    const wrapper = await promisedService;
    wrapper.repaint();
    return wrapper;
  },
};

export default Allocate;

function assertRendererPort(data: unknown): asserts data is { port: number } {
  assertType(data, { port: 'number' });
}

const cacheForPromisedServices = new Map<string, Promise<BraynsWrapper>>();

/**
 * This function prevents the user from starting several allocation processes
 * in parallel.
 */
function getPromisedService(token: string): Promise<BraynsWrapper> {
  const cachedPromisedService = cacheForPromisedServices.get(token);
  if (cachedPromisedService) return cachedPromisedService;

  const promisedService = new Promise<BraynsWrapper>((resolve, reject) => {
    const getServiceAddress = async () => {
      Events.allocationProgress.dispatch('Allocating a node on BB5...');
      const currentAllocation = Persistence.getAllocatedServiceAddress();
      if (currentAllocation) return currentAllocation;

      const allocator = new BackendAllocatorService(token);
      const serviceAddress = await allocator.allocate();
      if (!serviceAddress) {
        Persistence.clearAllocatedServiceAddress();
        throw Error('Unable to allocate!');
      }

      Persistence.setAllocatedServiceAddress(serviceAddress);
      return serviceAddress;
    };
    const action = async () => {
      const serviceAddress = await getServiceAddress();
      const serviceAddressAsString = `${serviceAddress.host}:${serviceAddress.port}`;
      Events.allocationProgress.dispatch(`Connecting the Service on ${serviceAddressAsString}...`);
      const service = new JsonRpcService(serviceAddressAsString, true);
      await service.connect();
      Events.allocationProgress.dispatch('Starting the Renderer...');
      const rendererAddress = await service.exec('brayns-address', {
        version: Settings.RENDERER_VERSION,
      });
      assertRendererPort(rendererAddress);
      const rendererAddressAsString =
        DEBUG_BRAYNS_ADDRESS ?? `${serviceAddress.host}:${rendererAddress.port}`;
      Events.allocationProgress.dispatch(
        `Connecting the Renderer on ${rendererAddressAsString}...`
      );
      const renderer = new JsonRpcService(rendererAddressAsString, true);
      await renderer.connect();
      const wrapper = new BraynsWrapper(service, renderer);
      Events.allocationProgress.dispatch('Initializing renderer...');
      await wrapper.initialize();
      return wrapper;
    };
    action().then(resolve).catch(reject);
  });
  cacheForPromisedServices.set(token, promisedService);
  return promisedService;
}

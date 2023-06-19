/* eslint-disable @typescript-eslint/no-use-before-define */
import State from '../state';
import JsonRpcService from '../json-rpc/json-rpc';
import BraynsWrapper from '../wrapper/wrapper';
import JsonRpcSerializerService from '../json-rpc/json-rpc-serializer';
import BackendAllocatorService from './backend-allocator-service';
import Persistence from './persistence';
import { logError } from '@/util/logger';

const Allocate = {
  async allocate(token: string): Promise<BraynsWrapper> {
    try {
      const promisedService = await getPromisedService(token);
      const wrapper = await promisedService;
      wrapper.repaint();
      return wrapper;
    } catch (ex) {
      logError('Unable to allocate:', ex);
      throw ex;
    }
  },
};

export default Allocate;

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
      State.progress.allocation.value = 'Allocating a node...';
      const currentAllocation = Persistence.getAllocatedServiceAddress();
      const allocator = new BackendAllocatorService(token);
      if (currentAllocation) return currentAllocation;

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
      const backendAddressAsString = serviceAddress.backendHost;
      State.progress.allocation.value = `Connecting Brayns Backend...`;
      const backend = new JsonRpcService(backendAddressAsString);
      await backend.connect();
      const rendererAddressAsString = serviceAddress.rendererHost;
      State.progress.allocation.value = `Connecting Brayns Renderer...`;
      const renderer = new JsonRpcService(rendererAddressAsString, { trace: false });
      await renderer.connect();
      renderer.recording = true;
      const wrapper = new BraynsWrapper(backend, new JsonRpcSerializerService(renderer));
      State.progress.allocation.value = 'Initializing Brayns...';
      await wrapper.initialize();
      return wrapper;
    };
    action().then(resolve).catch(reject);
  });
  cacheForPromisedServices.set(token, promisedService);
  return promisedService;
}

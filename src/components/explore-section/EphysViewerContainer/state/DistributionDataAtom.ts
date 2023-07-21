import { Session } from 'next-auth';
import { atom, Atom } from 'jotai';
import { Distribution, Entity } from '@/types/nexus';
import { DataSets, RABIndex } from '@/types/explore-section/fields';
import RandomAccessBuffer from '@/util/explore-section/random-access-buffer';
import useLazyCache from '@/components/explore-section/EphysViewerContainer/hooks/useLazyCache';
import { fetchFileByUrl, fetchResourceById, listResourceLinksById } from '@/api/nexus';
import sessionAtom from '@/state/session';

/**
 *
 * @param RABDistro
 * @param orgLabel
 * @param projectLabel
 *
 * Process RAB blob Data. Parse and set Index and Data Sets.
 * @param session
 */
function processRABDistro(
  RABDistro: Distribution,
  session: Session
): Promise<{
  RABIndex: RABIndex;
  datasets: DataSets;
}> {
  return new Promise((resolve) => {
    const { contentUrl } = RABDistro;
    const fileReader = new FileReader();

    function parseRABData() {
      const randomAccessBuffer = new RandomAccessBuffer();
      randomAccessBuffer.parse(fileReader.result as ArrayBuffer);
      const dataSets = randomAccessBuffer.listDatasets();
      const index = randomAccessBuffer.getDataset('index') as RABIndex;
      const nameToDataSetMap: DataSets = {};
      let i = 0;
      // Last item is the 'index' Object.
      // In order to ignore it, use < length -1
      while (i < dataSets.length - 1) {
        const dataSet = randomAccessBuffer.getDataset(dataSets[i]) as RABIndex;
        const y = dataSet.data.numericalData;
        const label: string = dataSets[i].trim();
        nameToDataSetMap[label] = {
          y,
          name: label.slice(0, label.length - 2).trim(),
        };
        i += 1;
      }
      return { nameToDataSetMap, index };
    }

    const [cacheAdd, cacheGet] = useLazyCache<{
      RABIndex: RABIndex;
      datasets: DataSets;
    }>();
    const cacheMatch = cacheGet(contentUrl);

    if (cacheMatch) {
      resolve(cacheMatch);
      return;
    }

    fileReader.onload = () => {
      const { nameToDataSetMap, index }: { nameToDataSetMap: DataSets; index: RABIndex } =
        parseRABData();
      cacheAdd(contentUrl, {
        RABIndex: index,
        datasets: nameToDataSetMap,
      });

      resolve({
        RABIndex: index,
        datasets: nameToDataSetMap,
      });
    };

    fetchFileByUrl(contentUrl, session)
      .then((res) => res.blob())
      .then((value) => fileReader.readAsArrayBuffer(value as Blob));
  });
}

type RABResponse = { RABIndex: RABIndex; datasets: DataSets };

export default function createDistributionDataAtom(
  resourceID: string,
  org: string,
  project: string
): Atom<Promise<RABResponse | { RABIndex: any; datasets: any }> | null> {
  return atom((get) => {
    const session = get(sessionAtom);
    if (!session) return null;
    return listResourceLinksById(resourceID, session, 'incoming', {
      org,
      project,
    })
      .then((response: any) => {
        const results = response._results;
        const traces = results.filter((link: Entity) =>
          link['@type']?.includes('https://bbp.epfl.ch/ontologies/core/bmo/TraceWebDataContainer')
        );
        const promises = traces.map((trace: Entity) =>
          fetchResourceById(trace['@id'], session, { org, project })
        );
        return Promise.all(promises);
      })
      .then((traceResources) => {
        const rabTrace: any = traceResources.find((trace: any) => {
          if (trace.distribution) {
            return /^.*\.(rab)$/.test(trace.distribution.name);
          }
          return false;
        });
        if (rabTrace) {
          return processRABDistro(rabTrace.distribution, session);
        }
        return rabTrace;
      })
      .then((linksData) => {
        const { RABIndex: linksRABIndex, datasets } = linksData;
        return {
          RABIndex: linksRABIndex,
          datasets,
        };
      });
  });
}

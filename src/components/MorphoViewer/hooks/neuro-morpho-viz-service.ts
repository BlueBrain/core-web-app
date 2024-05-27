import { useEffect } from 'react';
import { MorphologyCanvas } from '@bbp/morphoviewer';

import {
  EnhancedSomaLoaderEvent,
  useEventHandler,
  useEventValue,
} from './neuro-morpho-viz-service-event';

import useNotification from '@/hooks/notifications';
import { thumbnailGenerationBaseUrl } from '@/config';
import { logError } from '@/util/logger';
import { createHeaders } from '@/util/utils';
import { useAccessToken } from '@/hooks/useAccessToken';

interface NeuroMorphoVizQuery {
  contentUrl: string;
  accessToken: string;
}

class EnhancedSomaLoader {
  public readonly eventSomaGlbReceived = new EnhancedSomaLoaderEvent<ArrayBuffer | null>();

  public readonly eventErrorOccured = new EnhancedSomaLoaderEvent<Error | null>();

  public readonly eventFetchingInProgress = new EnhancedSomaLoaderEvent<boolean>();

  private nextQuery: NeuroMorphoVizQuery | null = null;

  private lastContentUrl: string | null = null;

  private lastSomaGlb: ArrayBuffer | null = null;

  private _fetchingInProgress = false;

  async fetch(query: NeuroMorphoVizQuery) {
    if (this.fetchingInProgress) {
      this.nextQuery = query;
      return;
    }

    this.nextQuery = query;
    do {
      const { accessToken, contentUrl } = this.nextQuery;
      this.nextQuery = null;
      this.fetchingInProgress = true;
      try {
        if (contentUrl === this.lastContentUrl) {
          this.eventSomaGlbReceived.dispatch(this.lastSomaGlb);
          continue;
        }
        const data = await fetchSomaFromNeuroMorphoViz(contentUrl, accessToken);
        this.eventSomaGlbReceived.dispatch(data);
        this.lastContentUrl = contentUrl;
        this.lastSomaGlb = data;
      } catch (ex) {
        if (ex instanceof Error) this.eventErrorOccured.dispatch(ex);
        else if (typeof ex === 'string') this.eventErrorOccured.dispatch(new Error(ex));
        else this.eventErrorOccured.dispatch(new Error(JSON.stringify(ex)));
      } finally {
        this.fetchingInProgress = false;
      }
    } while (this.nextQuery);
  }

  private get fetchingInProgress() {
    return this._fetchingInProgress;
  }

  private set fetchingInProgress(value: boolean) {
    this._fetchingInProgress = value;
    this.eventFetchingInProgress.dispatch(value);
  }
}

async function fetchSomaFromNeuroMorphoViz(
  contentUrl: string,
  accessToken: string | undefined
): Promise<ArrayBuffer | null> {
  if (!accessToken) return null;

  const url = `${thumbnailGenerationBaseUrl}/soma/process-nexus-swc?content_url=${encodeURIComponent(contentUrl)}`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: createHeaders(accessToken, {
      Accept: 'application/json',
    }),
  });
  const data = await resp.arrayBuffer();
  return data;
}

const enhancedSomaService = new EnhancedSomaLoader();

export function useEnhancedSomaService(
  morphoCanvasManager: MorphologyCanvas,
  contentUrl: string | undefined
) {
  const accessToken = useAccessToken();
  const notification = useNotification();

  useEventHandler(enhancedSomaService.eventErrorOccured, (err) => {
    if (!err) return;

    logError('Error while fetching enhanced soma!', err);
    notification.error(err.message);
  });

  useEventHandler(enhancedSomaService.eventSomaGlbReceived, (glb) => {
    if (!glb) return;

    // eslint-disable-next-line no-param-reassign
    morphoCanvasManager.somaGLB = glb;
    morphoCanvasManager.paint();
  });

  const fetchingInProgress = useEventValue(enhancedSomaService.eventFetchingInProgress, false);

  useEffect(() => {
    if (!contentUrl || !accessToken) return;

    enhancedSomaService.fetch({ contentUrl, accessToken });
  }, [contentUrl, accessToken]);

  return fetchingInProgress;
}

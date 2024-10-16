/* eslint-disable no-console */
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
import authFetch from '@/authFetch';

interface NeuroMorphoVizQuery {
  contentUrl: string;
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
      const { contentUrl } = this.nextQuery;
      console.log('Fetching enhanced soma:', this.nextQuery);
      this.nextQuery = null;
      this.fetchingInProgress = true;
      try {
        if (contentUrl === this.lastContentUrl) {
          console.log('Same contentURL, we use the case.');
          this.eventSomaGlbReceived.dispatch(this.lastSomaGlb);
          continue;
        }
        const data = await fetchSomaFromNeuroMorphoViz(contentUrl);
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

async function fetchSomaFromNeuroMorphoViz(contentUrl: string): Promise<ArrayBuffer | null> {
  const url = `${thumbnailGenerationBaseUrl}/soma/process-nexus-swc?content_url=${encodeURIComponent(contentUrl)}`;
  console.log('Actual fetch:', url);
  console.log(
    '🚀 [neuro-morpho-viz-service] thumbnailGenerationBaseUrl = ',
    thumbnailGenerationBaseUrl
  ); // @FIXME: Remove this line written on 2024-06-04 at 09:49
  console.log('🚀 [neuro-morpho-viz-service] contentUrl = ', contentUrl); // @FIXME: Remove this line written on 2024-06-04 at 09:49
  const time = Date.now();
  try {
    const resp = await authFetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    console.log('🚀 [neuro-morpho-viz-service] resp = ', resp); // @FIXME: Remove this line written on 2024-06-04 at 09:47
    if (!resp.ok) {
      let message = 'Unable to get enhanced soma!';
      try {
        message = await resp.text();
      } catch (ex) {
        console.error('Unable to get error message from Thumbnail service!');
      }
      console.error(`Error #${resp.status}: ${resp.statusText}:`, message);
      throw Error(message);
    }
    const data = await resp.arrayBuffer();
    return data;
  } finally {
    console.log('Thumbnail service response time:', (Date.now() - time) * 1e-3, 'seconds');
  }
}

const enhancedSomaService = new EnhancedSomaLoader();

export function useEnhancedSomaService(
  morphoCanvasManager: MorphologyCanvas,
  contentUrl: string | undefined
) {
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
    if (!contentUrl) return;

    enhancedSomaService.fetch({ contentUrl });
  }, [contentUrl]);

  return fetchingInProgress;
}

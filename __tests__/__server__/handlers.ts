import { http, HttpResponse } from 'msw';
import morphologiesResponse from './mocks/es-response-morphologies.json';

import { API_SEARCH } from '@/constants/explore-section/queries';

export const mockMorphologyResponse = http.post(API_SEARCH, () =>
  HttpResponse.json(morphologiesResponse)
);

export const mockEmptyESResponse = http.post(API_SEARCH, () =>
  HttpResponse.json({
    hits: {
      hits: [],
      total: {
        relation: 'eq',
        value: 0,
      },
    },
  })
);

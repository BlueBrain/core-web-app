import { atlasESView } from '@/config';
import { composeUrl } from '@/util/nexus';

export const ATLAS_SEARCH_URL = composeUrl('view', atlasESView.id, {
  org: atlasESView.org,
  project: atlasESView.project,
});

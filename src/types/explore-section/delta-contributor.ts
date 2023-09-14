import { EntityResource } from '@/types/nexus/common';

export type Contributor = EntityResource & {
  familyName?: string;
  givenName?: string;
  name: string;
};

import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  isServer: typeof window === 'undefined',
  // Validating environment variables only in runtime.
  // TODO Add validation of client env vars during the build,
  // requires: https://github.com/t3-oss/t3-env/issues/85.
  skipValidation: ['lint', 'test', 'test:ci', 'build'].includes(process.env.npm_lifecycle_event),

  server: {
    KEYCLOAK_CLIENT_ID: z.string().min(3),
    KEYCLOAK_CLIENT_SECRET: z.string().min(5),
    KEYCLOAK_ISSUER: z.string().url(),

    NEXTAUTH_SECRET: z.string().min(5),

    CI_COMMIT_SHORT_SHA: z.string().optional(),
    npm_package_version: z.string().optional(),
  },

  client: {
    NEXT_PUBLIC_BASE_PATH: z.preprocess((basePath) => basePath ?? '', z.string()),

    // When run on non-protected branch in Gitlab CI the value of env var will be an empty string.
    // This transforms an empty string value to undefined in order to pass the .optional validation.
    NEXT_PUBLIC_SENTRY_DSN: z.preprocess(
      (sentryDsn) => sentryDsn || undefined,
      z.string().url().optional()
    ),

    NEXT_PUBLIC_NEXUS_URL: z.string().url(),

    NEXT_PUBLIC_NEXUS_DEFAULT_ORG: z.string().min(1),
    NEXT_PUBLIC_NEXUS_DEFAULT_PROJECT: z.string().min(1),

    NEXT_PUBLIC_BBS_ML_BASE_URL: z.string().url(),
    NEXT_PUBLIC_BLUE_NAAS_WS_URL: z.string().url(),
    NEXT_PUBLIC_CELL_SVC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_FEEDBACK_URL: z.string().url(),
    NEXT_PUBLIC_KG_INFERENCE_BASE_URL: z.string().url(),
    NEXT_PUBLIC_THUMBNAIL_GENERATION_BASE_URL: z.string().url(),
    NEXT_PUBLIC_SYNTHESIS_URL: z.string().url(),

    NEXT_PUBLIC_DEFAULT_MODEL_RELEASE_NAME: z.string().min(1),
    NEXT_PUBLIC_DEFAULT_MODEL_RELEASE_DESCRIPTION: z.string().min(1),
    NEXT_PUBLIC_DEFAULT_MODEL_RELEASE_ID: z.string().url(),

    NEXT_PUBLIC_ONTOLOGY_BASE_URL: z.string().url(),

    NEXT_PUBLIC_NEUROSHAPES_BASE_URL: z.string().url(),

    NEXT_PUBLIC_BRAIN_REGION_ONTOLOGY_RESOURCE_ORG: z.string().min(1),
    NEXT_PUBLIC_BRAIN_REGION_ONTOLOGY_RESOURCE_PROJECT: z.string().min(1),
    NEXT_PUBLIC_BRAIN_REGION_ONTOLOGY_RESOURCE_ID: z.string().url(),

    NEXT_PUBLIC_ATLAS_RELEASE_RESOURCE_ID: z.string().url(),

    NEXT_PUBLIC_ATLAS_ES_VIEW_ORG: z.string().min(1),
    NEXT_PUBLIC_ATLAS_ES_VIEW_PROJECT: z.string().min(1),
    NEXT_PUBLIC_ATLAS_ES_VIEW_ID: z.string().url(),

    NEXT_PUBLIC_INFERENCE_SIMILARITY_MODEL_ID: z.string().url(),
    NEXT_PUBLIC_INFERENCE_SIMILARITY_MODEL_TITLE: z.string().min(1),

    NEXT_PUBLIC_INFERENCE_MORPH_RELEVANT_RULE_ID: z.string().url(),

    NEXT_PUBLIC_CELL_COMPOSITION_FILE_ORG: z.string().min(1),
    NEXT_PUBLIC_CELL_COMPOSITION_FILE_PROJECT: z.string().min(1),
    NEXT_PUBLIC_CELL_COMPOSITION_FILE_ID: z.string().url(),

    NEXT_PUBLIC_SYN_PARAM_ASSIGNMENT_RESOURCE_ID: z.string().url(),

    NEXT_PUBLIC_SYN_PARAM_RESOURCE_ID: z.string().url(),

    NEXT_PUBLIC_ETYPE_MECHANISM_MAP_ID: z.string().url(),

    NEXT_PUBLIC_CONN_INITIAL_RULES_FILE_ID: z.string().url(),

    NEXT_PUBLIC_CONN_INITIAL_PARAMS_FILE_ID: z.string().url(),

    NEXT_PUBLIC_LICENSE_ES_VIEW_ORG: z.string().min(1),
    NEXT_PUBLIC_LICENSE_ES_VIEW_PROJECT: z.string().min(1),
    NEXT_PUBLIC_LICENSE_ES_VIEW_ID: z.string().url(),

    NEXT_PUBLIC_VIRTUAL_LAB_API_URL: z.string().url(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_")
  },

  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,

    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,

    NEXT_PUBLIC_NEXUS_URL: process.env.NEXT_PUBLIC_NEXUS_URL,

    NEXT_PUBLIC_NEXUS_DEFAULT_ORG: process.env.NEXT_PUBLIC_NEXUS_DEFAULT_ORG,
    NEXT_PUBLIC_NEXUS_DEFAULT_PROJECT: process.env.NEXT_PUBLIC_NEXUS_DEFAULT_PROJECT,

    NEXT_PUBLIC_BBS_ML_BASE_URL: process.env.NEXT_PUBLIC_BBS_ML_BASE_URL,
    NEXT_PUBLIC_BLUE_NAAS_WS_URL: process.env.NEXT_PUBLIC_BLUE_NAAS_WS_URL,
    NEXT_PUBLIC_CELL_SVC_BASE_URL: process.env.NEXT_PUBLIC_CELL_SVC_BASE_URL,
    NEXT_PUBLIC_FEEDBACK_URL: process.env.NEXT_PUBLIC_FEEDBACK_URL,
    NEXT_PUBLIC_KG_INFERENCE_BASE_URL: process.env.NEXT_PUBLIC_KG_INFERENCE_BASE_URL,
    NEXT_PUBLIC_THUMBNAIL_GENERATION_BASE_URL: process.env.NEXT_PUBLIC_THUMBNAIL_GENERATION_BASE_URL,
    NEXT_PUBLIC_SYNTHESIS_URL: process.env.NEXT_PUBLIC_SYNTHESIS_URL,

    NEXT_PUBLIC_DEFAULT_MODEL_RELEASE_NAME: process.env.NEXT_PUBLIC_DEFAULT_MODEL_RELEASE_NAME,
    NEXT_PUBLIC_DEFAULT_MODEL_RELEASE_DESCRIPTION:
      process.env.NEXT_PUBLIC_DEFAULT_MODEL_RELEASE_DESCRIPTION,
    NEXT_PUBLIC_DEFAULT_MODEL_RELEASE_ID: process.env.NEXT_PUBLIC_DEFAULT_MODEL_RELEASE_ID,

    NEXT_PUBLIC_ONTOLOGY_BASE_URL: process.env.NEXT_PUBLIC_ONTOLOGY_BASE_URL,

    NEXT_PUBLIC_NEUROSHAPES_BASE_URL: process.env.NEXT_PUBLIC_NEUROSHAPES_BASE_URL,

    NEXT_PUBLIC_BRAIN_REGION_ONTOLOGY_RESOURCE_ORG:
      process.env.NEXT_PUBLIC_BRAIN_REGION_ONTOLOGY_RESOURCE_ORG,
    NEXT_PUBLIC_BRAIN_REGION_ONTOLOGY_RESOURCE_PROJECT:
      process.env.NEXT_PUBLIC_BRAIN_REGION_ONTOLOGY_RESOURCE_PROJECT,
    NEXT_PUBLIC_BRAIN_REGION_ONTOLOGY_RESOURCE_ID:
      process.env.NEXT_PUBLIC_BRAIN_REGION_ONTOLOGY_RESOURCE_ID,

    NEXT_PUBLIC_ATLAS_RELEASE_RESOURCE_ID: process.env.NEXT_PUBLIC_ATLAS_RELEASE_RESOURCE_ID,

    NEXT_PUBLIC_ATLAS_ES_VIEW_ORG: process.env.NEXT_PUBLIC_ATLAS_ES_VIEW_ORG,
    NEXT_PUBLIC_ATLAS_ES_VIEW_PROJECT: process.env.NEXT_PUBLIC_ATLAS_ES_VIEW_PROJECT,
    NEXT_PUBLIC_ATLAS_ES_VIEW_ID: process.env.NEXT_PUBLIC_ATLAS_ES_VIEW_ID,

    NEXT_PUBLIC_INFERENCE_SIMILARITY_MODEL_ID:
      process.env.NEXT_PUBLIC_INFERENCE_SIMILARITY_MODEL_ID,
    NEXT_PUBLIC_INFERENCE_SIMILARITY_MODEL_TITLE:
      process.env.NEXT_PUBLIC_INFERENCE_SIMILARITY_MODEL_TITLE,

    NEXT_PUBLIC_INFERENCE_MORPH_RELEVANT_RULE_ID:
      process.env.NEXT_PUBLIC_INFERENCE_MORPH_RELEVANT_RULE_ID,

    NEXT_PUBLIC_CELL_COMPOSITION_FILE_ORG: process.env.NEXT_PUBLIC_CELL_COMPOSITION_FILE_ORG,
    NEXT_PUBLIC_CELL_COMPOSITION_FILE_PROJECT:
      process.env.NEXT_PUBLIC_CELL_COMPOSITION_FILE_PROJECT,
    NEXT_PUBLIC_CELL_COMPOSITION_FILE_ID: process.env.NEXT_PUBLIC_CELL_COMPOSITION_FILE_ID,

    NEXT_PUBLIC_SYN_PARAM_ASSIGNMENT_RESOURCE_ID:
      process.env.NEXT_PUBLIC_SYN_PARAM_ASSIGNMENT_RESOURCE_ID,

    NEXT_PUBLIC_SYN_PARAM_RESOURCE_ID: process.env.NEXT_PUBLIC_SYN_PARAM_RESOURCE_ID,

    NEXT_PUBLIC_ETYPE_MECHANISM_MAP_ID: process.env.NEXT_PUBLIC_ETYPE_MECHANISM_MAP_ID,

    NEXT_PUBLIC_CONN_INITIAL_RULES_FILE_ID: process.env.NEXT_PUBLIC_CONN_INITIAL_RULES_FILE_ID,

    NEXT_PUBLIC_CONN_INITIAL_PARAMS_FILE_ID: process.env.NEXT_PUBLIC_CONN_INITIAL_PARAMS_FILE_ID,

    NEXT_PUBLIC_LICENSE_ES_VIEW_ORG: process.env.NEXT_PUBLIC_LICENSE_ES_VIEW_ORG,
    NEXT_PUBLIC_LICENSE_ES_VIEW_PROJECT: process.env.NEXT_PUBLIC_LICENSE_ES_VIEW_PROJECT,
    NEXT_PUBLIC_LICENSE_ES_VIEW_ID: process.env.NEXT_PUBLIC_LICENSE_ES_VIEW_ID,

    NEXT_PUBLIC_VIRTUAL_LAB_API_URL: process.env.NEXT_PUBLIC_VIRTUAL_LAB_API_URL,

    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
});

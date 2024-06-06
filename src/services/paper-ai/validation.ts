import { z } from 'zod';
import { isJSON } from '@/util/utils';

const LocationSchema = z.object({
  virtualLabId: z.string().min(1),
  projectId: z.string().min(1),
});

export const PaperBaseSchema = z.object({
  title: z.string().min(1, 'Please provide a title for your paper.'),
  summary: z.string().min(1, 'Please provide a brief summary of your paper.'),
});

const SourceDataSchema = z
  .string()
  .refine(isJSON)
  .transform((v) => JSON.parse(v))
  .pipe(
    z.array(
      z.object(
        {
          id: z.string(),
          name: z.string(),
          type: z.string().or(z.array(z.string())),
          category: z.string(),
        },
        { message: 'data source is missing required properties.' }
      )
    )
  )
  .optional();

export const PaperSchema = PaperBaseSchema.merge(LocationSchema).extend({
  generateOutline: z
    .string()
    .nullable()
    .transform((value) => value === 'on'),
  sourceData: SourceDataSchema,
});

export type PaperSchemaFieldErrors = z.inferFlattenedErrors<typeof PaperSchema>['fieldErrors'];
export type PaperSchemaType = z.infer<typeof PaperSchema>;
export type PaperSchemaKeys = keyof PaperSchemaType;
export type SourceDataSchemaType = z.infer<typeof SourceDataSchema>;

export type PaperCreationAction =
  | {
      redirect?: string | null;
      validationErrors?: PaperSchemaFieldErrors | null;
      error?: string | null;
    }
  | undefined;

export const PaperUpdateSchema = PaperBaseSchema.extend({
  paper: z.any(),
  sourceData: SourceDataSchema,
});

export type PaperUpdateAction = {
  type: 'success' | 'error' | null;
  validationErrors?: PaperSchemaFieldErrors | null;
  error?: string | null;
};

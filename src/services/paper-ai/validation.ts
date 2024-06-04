import { z } from 'zod';

const LocationSchema = z.object({
  virtualLabId: z.string().min(1),
  projectId: z.string().min(1),
});

export const PaperBaseSchema = z.object({
  title: z.string().min(1, 'Please provide a title for your paper.'),
  summary: z.string().min(1, 'Please provide a brief summary of your paper.'),
  sourceData: z.string({ invalid_type_error: 'Please provide one or more resources.' }).optional(),
});

export const PaperSchema = PaperBaseSchema.merge(LocationSchema).extend({
  generateOutline: z
    .string()
    .nullable()
    .transform((value) => value === 'on'),
});

export type PaperSchemaFieldErrors = z.inferFlattenedErrors<typeof PaperSchema>['fieldErrors'];
export type PaperSchemaType = z.infer<typeof PaperSchema>;
export type PaperSchemaKeys = keyof PaperSchemaType;

export type PaperCreationAction =
  | {
      redirect?: string | null;
      validationErrors?: PaperSchemaFieldErrors | null;
      error?: string | null;
    }
  | undefined;

export const PaperUpdateSchema = PaperBaseSchema.extend({
  paper: z.any(),
});

export type PaperUpdateAction = {
  type: 'success' | 'error' | null;
  validationErrors?: PaperSchemaFieldErrors | null;
  error?: string | null;
};

import { z } from 'zod';

export const PaperSchema = z.object({
  virtualLabId: z.string().min(1),
  projectId: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  sourceData: z.string(), // TODO: to modify to accept an array
  generateOutline: z
    .string()
    .nullable()
    .transform((value) => value === 'on'),
});

export type PaperSchemaFieldErrors = z.inferFlattenedErrors<typeof PaperSchema>['fieldErrors'];
export type PaperSchemaType = z.infer<typeof PaperSchema>;
export type PaperSchemaKeys = keyof PaperSchemaType;

export type PaperCreationAction = {
  redirect?: string | null;
  validationErrors?: PaperSchemaFieldErrors | null;
  error?: string | null;
};

import { z } from 'zod';

export const PaperSchema = z.object({
  virtualLabId: z.string().min(1),
  projectId: z.string().min(1),
  title: z.string().min(1, 'Please provide a title for your paper.'),
  summary: z.string().min(1, 'Please provide a brief summary of your paper.'),
  sourceData: z.string({ invalid_type_error: 'Please provide one or more resources.' }).optional(),
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

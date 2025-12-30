import { z } from 'zod'

export const registrationSchema = z.object({
  teamId: z.coerce.number().int().positive().optional(),
})

/**
 * Used for PATCH status only
 */
export const registrationStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'REJECTED', 'WITHDRAWN'], {
    required_error: 'Le statut est requis',
  }),
})

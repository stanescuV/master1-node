import { z } from 'zod'

export const registrationSchema = z
  .object({
    tournamentId: z.coerce.number().int().positive(),

    playerId: z.coerce.number().int().positive().optional(),

    teamId: z.coerce.number().int().positive().optional(),

    status: z
      .enum(['PENDING', 'CONFIRMED', 'REJECTED', 'WITHDRAWN'])
      .default('PENDING'),
  })
  .refine(
    data => !(data.playerId && data.teamId),
    {
      message: 'Une inscription ne peut pas avoir playerId ET teamId',
      path: ['playerId'],
    }
  )
  .refine(
    data => data.playerId || data.teamId,
    {
      message: 'Une inscription doit avoir soit un playerId soit un teamId',
      path: ['playerId'],
    }
  )

/**
 * Used for PATCH status only
 */
export const registrationStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'REJECTED', 'WITHDRAWN'], {
    required_error: 'Le statut est requis',
  }),
})

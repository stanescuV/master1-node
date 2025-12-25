import { z } from 'zod'

export const tournamentSchema = z
  .object({
    name: z
      .string({ required_error: 'Le nom du tournoi est requis' })
      .min(3, 'Le nom doit contenir au moins 3 caractères'),

    game: z
      .string({ required_error: 'Le jeu est requis' })
      .min(2, 'Le nom du jeu est requis'),

    format: z.enum(['SOLO', 'TEAM'], {
      required_error: 'Le format est requis',
      invalid_type_error: 'Le format doit être SOLO ou TEAM',
    }),

    maxParticipants: z.coerce
      .number({ required_error: 'Le nombre de participants est requis' })
      .int('Le nombre de participants doit être un entier')
      .positive('Le nombre de participants doit être positif'),

    prizePool: z.coerce
      .number()
      .min(0, 'Le prize pool ne peut pas être négatif')
      .optional(),

    startDate: z.coerce.date({
      required_error: 'La date de début est requise',
    }),

    endDate: z.coerce.date().optional(),
  })
  .refine(data => data.startDate > new Date(), {
    message: 'La date de début doit être future',
    path: ['startDate'],
  })
  .refine(
    data => !data.endDate || data.endDate > data.startDate,
    {
      message: 'La date de fin doit être après la date de début',
      path: ['endDate'],
    }
  )

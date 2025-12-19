import { z } from 'zod'

export const bookingSchema = z
  .object({
    userId: z.coerce
      .number({ required_error: "L'utilisateur est requis" })
      .int("L'ID utilisateur doit être un entier")
      .positive("L'ID utilisateur doit être positif"),
    stationId: z.coerce
      .number({ required_error: 'La station est requise' })
      .int("L'ID station doit être un entier")
      .positive("L'ID station doit être positif"),
    startTime: z.coerce.date({
      required_error: "L'heure de début est requise",
      invalid_type_error: "L'heure de début doit être une date valide",
    }),
    endTime: z.coerce.date({
      required_error: "L'heure de fin est requise",
      invalid_type_error: "L'heure de fin doit être une date valide",
    }),
    status: z
      .enum(['confirmed', 'cancelled', 'completed'], {
        invalid_type_error:
          'Le statut doit être: confirmed, cancelled ou completed',
      })
      .default('confirmed'),
  })
  .refine(data => data.endTime > data.startTime, {
    message: "L'heure de fin doit être après l'heure de début",
    path: ['endTime'],
  })

import { z } from 'zod'

// Helper for optional numeric fields from forms (empty string → null)
const optionalNumber = z.preprocess(
  val => (val === '' || val === undefined ? null : Number(val)),
  z.number().int().nullable()
)

export const gameSchema = z
  .object({
    name: z
      .string({ required_error: 'Le nom est requis' })
      .min(1, 'Le nom est requis')
      .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
    genre: z
      .string({ required_error: 'Le genre est requis' })
      .min(1, 'Le genre est requis')
      .max(50, 'Le genre ne peut pas dépasser 50 caractères'),
    releaseYear: optionalNumber
      .refine(val => val === null || val >= 1970, {
        message: "L'année doit être supérieure à 1970",
      })
      .refine(val => val === null || val <= new Date().getFullYear() + 1, {
        message: "L'année ne peut pas être dans le futur",
      }),
    minPlayers: z.coerce
      .number({ required_error: 'Le nombre minimum de joueurs est requis' })
      .int('Le nombre de joueurs doit être un entier')
      .min(1, 'Il faut au moins 1 joueur'),
    maxPlayers: z.coerce
      .number({ required_error: 'Le nombre maximum de joueurs est requis' })
      .int('Le nombre de joueurs doit être un entier')
      .min(1, 'Il faut au moins 1 joueur'),
    description: z
      .string()
      .max(500, 'La description ne peut pas dépasser 500 caractères')
      .optional()
      .nullable()
      .transform(val => (val === '' ? null : val)),
  })
  .refine(data => data.minPlayers <= data.maxPlayers, {
    message: 'Le minimum de joueurs ne peut pas dépasser le maximum',
    path: ['minPlayers'],
  })

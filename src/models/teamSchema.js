import { z } from 'zod'

export const teamSchema = z.object({
  name: z
    .string({ required_error: "Le nom de l'équipe est requis" })
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),

  tag: z
    .string({ required_error: 'Le tag est requis' })
    .min(3, 'Le tag doit contenir entre 3 et 5 caractères')
    .max(5, 'Le tag doit contenir entre 3 et 5 caractères')
    .regex(/^[A-Z0-9]+$/, 'Le tag doit contenir uniquement des majuscules et chiffres'),
})

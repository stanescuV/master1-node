import { z } from 'zod'

export const registerSchema = z.object({
  email: z
    .string({ required_error: "L'email est requis" })
    .email("Format d'email invalide"),

  username: z
    .string({ required_error: "Le nom d'utilisateur est requis" })
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
    .max(20, "Le nom d'utilisateur ne peut pas dépasser 20 caractères")
    .regex(/^[a-zA-Z0-9_]+$/, "Caractères autorisés : lettres, chiffres, underscore"),

  password: z
    .string({ required_error: 'Le mot de passe est requis' })
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir un chiffre'),

  role: z.enum(['PLAYER', 'ORGANIZER', 'ADMIN']).optional(),
})

export const loginSchema = z.object({
  email: z
    .string({ required_error: "L'email est requis" })
    .email("Format d'email invalide"),

  password: z.string({ required_error: 'Le mot de passe est requis' }),
})

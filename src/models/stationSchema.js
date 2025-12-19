import { z } from 'zod'

export const stationSchema = z.object({
  name: z
    .string({ required_error: 'Le nom est requis' })
    .min(1, 'Le nom est requis')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  cpu: z
    .string({ required_error: 'Le CPU est requis' })
    .min(1, 'Le CPU est requis')
    .max(100, 'Le CPU ne peut pas dépasser 100 caractères'),
  gpu: z
    .string({ required_error: 'Le GPU est requis' })
    .min(1, 'Le GPU est requis')
    .max(100, 'Le GPU ne peut pas dépasser 100 caractères'),
  ram: z
    .string({ required_error: 'La RAM est requise' })
    .min(1, 'La RAM est requise')
    .max(50, 'La RAM ne peut pas dépasser 50 caractères'),
  storage: z
    .string({ required_error: 'Le stockage est requis' })
    .min(1, 'Le stockage est requis')
    .max(100, 'Le stockage ne peut pas dépasser 100 caractères'),
  monitor: z
    .string({ required_error: "L'écran est requis" })
    .min(1, "L'écran est requis")
    .max(100, "L'écran ne peut pas dépasser 100 caractères"),
  keyboard: z
    .string({ required_error: 'Le clavier est requis' })
    .min(1, 'Le clavier est requis')
    .max(100, 'Le clavier ne peut pas dépasser 100 caractères'),
  mouse: z
    .string({ required_error: 'La souris est requise' })
    .min(1, 'La souris est requise')
    .max(100, 'La souris ne peut pas dépasser 100 caractères'),
  headset: z
    .string({ required_error: 'Le casque est requis' })
    .min(1, 'Le casque est requis')
    .max(100, 'Le casque ne peut pas dépasser 100 caractères'),
  status: z.enum(['available', 'maintenance', 'booked'], {
    required_error: 'Le statut est requis',
    invalid_type_error: 'Le statut doit être: available, maintenance ou booked',
  }),
})

import { z } from 'zod';

export const vehicleSchema = z.object({
  plate: z.string().min(3),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.number().int().min(1900).max(2100).optional(),
});

export const washCreateSchema = z.object({
  vehicleId: z.string().cuid(),
  washerId: z.string().cuid(),
  stationId: z.string().cuid().optional(),
  washDate: z.string().datetime(),
  idempotencyKey: z.string().min(10),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
export type WashCreateInput = z.infer<typeof washCreateSchema>;

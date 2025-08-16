import { Dexie, type EntityTable } from "dexie";
import { z } from "astro/zod";

export const DateSchema = z.string().date();

export const RatingSchema = z.object({
  date: DateSchema,
  rating: z.coerce.number(),
  notes: z.string().optional(),
});

export type Rating = z.infer<typeof RatingSchema>;

// Cast with an intersection so `db.friends` has proper autocomplete
export const db = new Dexie("Moodle") as Dexie & {
  ratings: EntityTable<Rating, "date">;
};

db.version(1).stores({
  ratings: "date, rating, notes", // primary key "id" (for the runtime!)
});

export type ChartEventDetail = {
  thisPeriod: Rating[];
  previousPeriod: Rating[];
};

-- Migration: date + time → sessions Json
-- On ajoute d'abord la colonne nullable, on migre les données existantes,
-- puis on la passe NOT NULL et on supprime les anciennes colonnes.

-- Étape 1 : ajouter sessions comme nullable
ALTER TABLE "courses" ADD COLUMN "sessions" JSONB;

-- Étape 2 : convertir les lignes existantes (date + time → [{date, time}])
UPDATE "courses"
SET "sessions" = json_build_array(
  json_build_object('date', date, 'time', time)
)::jsonb;

-- Étape 3 : rendre NOT NULL maintenant que toutes les lignes ont une valeur
ALTER TABLE "courses" ALTER COLUMN "sessions" SET NOT NULL;

-- Étape 4 : supprimer les anciennes colonnes
ALTER TABLE "courses" DROP COLUMN "date",
                      DROP COLUMN "time";

-- Migration: type CourseType (singulier) → types CourseType[] (tableau)
-- Cette migration s'exécute sur Railway où la première migration
-- a été baseline'd sans être réellement appliquée.

-- Étape 1 : ajouter la nouvelle colonne types[] (nullable d'abord)
ALTER TABLE "courses" ADD COLUMN "types" "CourseType"[];

-- Étape 2 : copier les valeurs existantes de type → types
UPDATE "courses" SET "types" = ARRAY["type"];

-- Étape 3 : rendre NOT NULL maintenant que toutes les lignes ont une valeur
ALTER TABLE "courses" ALTER COLUMN "types" SET NOT NULL;

-- Étape 4 : supprimer l'ancienne colonne type
ALTER TABLE "courses" DROP COLUMN "type";

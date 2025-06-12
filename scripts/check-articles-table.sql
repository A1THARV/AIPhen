-- Check the structure of the "articles" table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'articles';

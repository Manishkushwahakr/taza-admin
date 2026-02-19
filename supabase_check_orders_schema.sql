-- ==========================================
-- CHECK ORDERS SCHEMA
-- Run this to see what columns actually exist in your 'orders' table
-- ==========================================

SELECT 
    column_name, 
    data_type, 
    udt_name,
    is_nullable
FROM 
    information_schema.columns 
WHERE 
    table_name = 'orders'
ORDER BY 
    column_name;

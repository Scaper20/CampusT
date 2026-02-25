-- Seed University
INSERT INTO universities (name, domain, is_active)
VALUES ('Caleb University', 'calebuniversity.edu.ng', true)
ON CONFLICT (id) DO NOTHING;

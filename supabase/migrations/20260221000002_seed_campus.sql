-- Seed Caleb University campus
INSERT INTO campuses (name, university, is_active)
VALUES ('Caleb Main Campus', 'Caleb University', true)
ON CONFLICT (name) DO NOTHING;

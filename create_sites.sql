-- ========================================
-- CoreGuard SMS - Site Creation SQL
-- ========================================
-- This file contains SQL statements for creating sites
-- with smart scheduling compatible requirements

-- ========================================
-- STEP 1: CREATE ORGANISATION IF NEEDED
-- ========================================

-- First, check if organisation exists and get its UUID
DO $$
DECLARE
    org_uuid UUID;
BEGIN
    -- Try to get existing organisation
    SELECT id INTO org_uuid FROM organisations LIMIT 1;
    
    -- If no organisation exists, create one
    IF org_uuid IS NULL THEN
        INSERT INTO organisations (
            name,
            address,
            contact_email,
            contact_phone,
            created_at,
            updated_at
        ) VALUES (
            'CoreGuard Security Services',
            '123 Security Lane, London, EC1A 1BB',
            'admin@coreguard.com',
            '+44 20 1234 5678',
            NOW(),
            NOW()
        ) RETURNING id INTO org_uuid;
            
        RAISE NOTICE 'Created new organisation with UUID: %', org_uuid;
    ELSE
        RAISE NOTICE 'Using existing organisation with UUID: %', org_uuid;
    END IF;
    
    -- Store the UUID in a temporary table for use in site creation
    CREATE TEMP TABLE IF NOT EXISTS temp_org_uuid (org_id UUID);
    TRUNCATE TABLE temp_org_uuid;
    INSERT INTO temp_org_uuid VALUES (org_uuid);
END $$;

-- Get the organisation UUID to use
DO $$
DECLARE
    org_uuid UUID;
BEGIN
    SELECT id INTO org_uuid FROM temp_org_uuid LIMIT 1;
    RAISE NOTICE 'Organisation UUID to use for sites: %', org_uuid;
END $$;

-- ========================================
-- BASIC SITE CREATION
-- ========================================

-- Example 1: Corporate Office Site
INSERT INTO sites (
    organisation_id,
    name,
    address,
    contact_name,
    contact_phone,
    site_pin,
    requirements
) SELECT 
    org_id,
    'Corporate Headquarters',
    '100 Business Park, London, EC2V 7HH',
    'Sarah Johnson',
    '+44 20 9876 5432',
    '0001',
    '["Basic Security Training", "Fire Safety", "Security Guard License", "First Aid Certification"]'::jsonb
FROM temp_org_uuid;

-- Example 2: Retail Store Site
INSERT INTO sites (
    organisation_id,
    name,
    address,
    contact_name,
    contact_phone,
    site_pin,
    requirements
) SELECT 
    org_id,
    'Westfield Shopping Centre',
    'Unit 45, Westfield Mall, London, W12 7GF',
    'Michael Brown',
    '+44 20 4567 8901',
    '0002',
    '["Basic Security Training", "Customer Service Training"]'::jsonb
FROM temp_org_uuid;

-- Example 3: Healthcare Facility
INSERT INTO sites (
    organisation_id,
    name,
    address,
    contact_name,
    contact_phone,
    site_pin,
    requirements
) SELECT 
    org_id,
    'City General Hospital',
    '1 Hospital Road, London, N1 3NY',
    'Dr. Emily Davis',
    '+44 20 3456 7890',
    '0003',
    '["Basic Security Training", "Fire Safety", "Security Guard License", "Healthcare Safety Training", "Infection Control"]'::jsonb
FROM temp_org_uuid;

-- Example 4: Data Centre Facility
INSERT INTO sites (
    organisation_id,
    name,
    address,
    contact_name,
    contact_phone,
    site_pin,
    requirements
) SELECT 
    org_id,
    'Data Centre Facility',
    '1 Tech Park, Silicon Roundabout, London, EC1Y 8AH',
    'Alex Thompson',
    '+44 20 2345 6789',
    '0004',
    '["Basic Security Training", "Fire Safety", "Security Guard License", "Data Centre Security", "CCTV Monitoring"]'::jsonb
FROM temp_org_uuid;

-- Example 5: Industrial Site
INSERT INTO sites (
    organisation_id,
    name,
    address,
    contact_name,
    contact_phone,
    site_pin,
    requirements
) SELECT 
    org_id,
    'Manufacturing Plant',
    '50 Industrial Estate, Birmingham, B1 1AA',
    'Robert Wilson',
    '+44 121 345 6789',
    '0005',
    '["Basic Security Training", "Fire Safety", "Security Guard License", "Industrial Safety", "Hazard Awareness"]'::jsonb
FROM temp_org_uuid;

-- ========================================
-- EDUCATIONAL INSTITUTIONS
-- ========================================

-- Example 6: University Campus
INSERT INTO sites (
    organisation_id,
    name,
    address,
    contact_name,
    contact_phone,
    site_pin,
    requirements
) SELECT 
    org_id,
    'London University Campus',
    'University Road, London, NW1 4JB',
    'Prof. James Anderson',
    '+44 20 7890 1234',
    '0006',
    '["Basic Security Training", "Fire Safety", "Security Guard License", "Student Safety", "Campus Security"]'::jsonb
FROM temp_org_uuid;

-- Example 7: School Site
INSERT INTO sites (
    organisation_id,
    name,
    address,
    contact_name,
    contact_phone,
    site_pin,
    requirements
) SELECT 
    org_id,
    'St. Marys Primary School',
    '12 School Lane, London, SE1 2AB',
    'Mrs. Patricia Green',
    '+44 20 8901 2345',
    '0007',
    '["Basic Security Training", "Fire Safety", "Security Guard License", "DBS Check", "Child Safety Training"]'::jsonb
FROM temp_org_uuid;

-- ========================================
-- RESIDENTIAL SITES
-- ========================================

-- Example 8: Luxury Apartment Complex
INSERT INTO sites (
    organisation_id,
    name,
    address,
    contact_name,
    contact_phone,
    site_pin,
    requirements
) VALUES (
    (SELECT org_id FROM temp_org_uuid LIMIT 1),
    'Royal Gardens Apartments',
    '1 Royal Gardens, London, SW1A 1AA',
    'Charles Windsor',
    '+44 20 9012 3456',
    '0008',
    '["Basic Security Training", "Fire Safety", "Security Guard License", "Concierge Training"]'::jsonb
);

-- Example 9: Gated Community
INSERT INTO sites (
    organisation_id,
    name,
    address,
    contact_name,
    contact_phone,
    site_pin,
    requirements
) VALUES (
    (SELECT org_id FROM temp_org_uuid LIMIT 1)
    'Sunnyvale Estate',
    '100 Estate Drive, Surrey, KT1 1AB',
    'David Miller',
    '+44 20 0123 4567',
    '0009',
    '["Basic Security Training", "Fire Safety", "Security Guard License", "Patrol Training"]'::jsonb
);

-- ========================================
-- TRANSPORTATION HUBS
-- ========================================

-- Example 10: Train Station
INSERT INTO sites (
    organisation_id,
    name,
    address,
    contact_name,
    contact_phone,
    site_pin,
    requirements
) VALUES (
    (SELECT org_id FROM temp_org_uuid LIMIT 1)
    'Central Railway Station',
    'Station Approach, London, E1 6AN',
    'Thomas Rail',
    '+44 20 1234 5678',
    '0010',
    '["Basic Security Training", "Fire Safety", "Security Guard License", "Crowd Control", "Emergency Procedures"]'::jsonb
);

-- Example 11: Airport Terminal
INSERT INTO sites (
    organisation_id,
    name,
    address,
    contact_name,
    contact_phone,
    site_pin,
    requirements
) VALUES (
    (SELECT org_id FROM temp_org_uuid LIMIT 1)
    'London City Airport Terminal',
    'Airport Way, London, E16 2PX',
    'Captain James Wright',
    '+44 20 2345 6789',
    '0011',
    '["Basic Security Training", "Fire Safety", "Security Guard License", "Aviation Security", "X-ray Screening"]'::jsonb
);

-- ========================================
-- ENTERTAINMENT VENUES
-- ========================================

-- Example 12: Stadium
INSERT INTO sites (
    organisation_id,
    name,
    address,
    contact_name,
    contact_phone,
    site_pin,
    requirements
) VALUES (
    (SELECT org_id FROM temp_org_uuid LIMIT 1)
    'National Sports Stadium',
    'Stadium Road, London, N1C 4AG',
    'Mark Sports',
    '+44 20 3456 7890',
    '0012',
    '["Basic Security Training", "Fire Safety", "Security Guard License", "Crowd Management", "Event Security"]'::jsonb
);

-- Example 13: Concert Hall
INSERT INTO sites (
    organisation_id,
    name,
    address,
    contact_name,
    contact_phone,
    site_pin,
    requirements
) VALUES (
    (SELECT org_id FROM temp_org_uuid LIMIT 1)
    'Royal Albert Hall',
    'Kensington Gore, London, SW7 2AP',
    'Victoria Music',
    '+44 20 4567 8901',
    '0013',
    '["Basic Security Training", "Fire Safety", "Security Guard License", "Venue Security"]'::jsonb
);

-- ========================================
-- GOVERNMENT BUILDINGS
-- ========================================

-- Example 14: Government Office
INSERT INTO sites (
    organisation_id,
    name,
    address,
    contact_name,
    contact_phone,
    site_pin,
    requirements
) VALUES (
    (SELECT org_id FROM temp_org_uuid LIMIT 1)
    'Government Administration Building',
    'Whitehall, London, SW1A 2HQ',
    'Sir John Civil',
    '+44 20 5678 9012',
    '0014',
    '["Basic Security Training", "Fire Safety", "Security Guard License", "Government Security Clearance", "Counter Terrorism"]'::jsonb
);

-- Example 15: Court House
INSERT INTO sites (
    organisation_id,
    name,
    address,
    contact_name,
    contact_phone,
    site_pin,
    requirements
) VALUES (
    (SELECT org_id FROM temp_org_uuid LIMIT 1)
    'Central Court House',
    '10 Justice Square, London, EC4A 1AH',
    'Judge Margaret Law',
    '+44 20 6789 0123',
    '0015',
    '["Basic Security Training", "Fire Safety", "Security Guard License", "Court Security", "Legal Procedures"]'::jsonb
);

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Verify all sites were created
SELECT 
    id,
    name,
    address,
    contact_name,
    contact_phone,
    site_pin,
    jsonb_array_length(requirements) as requirement_count,
    created_at
FROM sites 
ORDER BY created_at;

-- View requirements for each site
SELECT 
    name,
    site_pin,
    requirements,
    jsonb_array_elements_text(requirements) as individual_requirements
FROM sites 
ORDER BY name;

-- Count sites by requirement type
SELECT 
    jsonb_array_elements_text(requirements) as requirement,
    COUNT(*) as site_count
FROM sites 
GROUP BY jsonb_array_elements_text(requirements)
ORDER BY site_count DESC;

-- ========================================
-- CLEANUP
-- ========================================

-- Clean up temporary table
DROP TABLE IF EXISTS temp_org_uuid;

-- ========================================
-- USAGE NOTES
-- ========================================
/*
1. Replace '550e8400-e29b-41d4-a716-446655440000' with your actual organisation UUID
2. Site PINs are sequential from 0001 to 0015
3. Requirements are stored as JSONB arrays for smart scheduling
4. Each site has different requirements based on industry needs
5. All sites include Basic Security Training, Fire Safety, and Security Guard License as base requirements

Smart Scheduling Benefits:
- Automatic employee matching based on certifications
- Compliance tracking per site
- Requirement-based scheduling validation
- Reporting on qualified staff availability
*/

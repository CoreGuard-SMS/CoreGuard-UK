-- ========================================
-- CoreGuard SMS - Fixed Single Statement Site Creation
-- ========================================

-- Create organisation and all sites in one transaction
WITH org_creation AS (
    -- Create organisation if it doesn't exist
    INSERT INTO organisations (
        name,
        industry,
        contact_email,
        organisation_pin,
        created_at,
        updated_at
    ) 
    SELECT 
        'CoreGuard Security Services',
        'Security Services',
        'admin@coreguard.com',
        'CORE001',
        NOW(),
        NOW()
    WHERE NOT EXISTS (SELECT 1 FROM organisations LIMIT 1)
    RETURNING id
),
org_uuid AS (
    -- Get organisation UUID (either existing or newly created)
    SELECT id FROM org_creation
    UNION ALL
    SELECT id FROM organisations LIMIT 1
),
sites_to_create AS (
    -- Define all sites to create with proper jsonb requirements
    SELECT 
        (SELECT id FROM org_uuid LIMIT 1) as organisation_id,
        unnest(ARRAY[
            'Corporate Headquarters',
            'Westfield Shopping Centre',
            'City General Hospital',
            'Data Centre Facility',
            'Manufacturing Plant',
            'London University Campus',
            'St. Marys Primary School',
            'Royal Gardens Apartments',
            'Sunnyvale Estate',
            'Central Railway Station',
            'London City Airport Terminal',
            'National Sports Stadium',
            'Royal Albert Hall',
            'Government Administration Building',
            'Central Court House'
        ]) as name,
        unnest(ARRAY[
            '100 Business Park, London, EC2V 7HH',
            'Unit 45, Westfield Mall, London, W12 7GF',
            '1 Hospital Road, London, N1 3NY',
            '1 Tech Park, Silicon Roundabout, London, EC1Y 8AH',
            '50 Industrial Estate, Birmingham, B1 1AA',
            'University Road, London, NW1 4JB',
            '12 School Lane, London, SE1 2AB',
            '1 Royal Gardens, London, SW1A 1AA',
            '100 Estate Drive, Surrey, KT1 1AB',
            'Station Approach, London, E1 6AN',
            'Airport Way, London, E16 2PX',
            'Stadium Road, London, N1C 4AG',
            'Kensington Gore, London, SW7 2AP',
            'Whitehall, London, SW1A 2HQ',
            '10 Justice Square, London, EC4A 1AH'
        ]) as address,
        unnest(ARRAY[
            'Sarah Johnson',
            'Michael Brown',
            'Dr. Emily Davis',
            'Alex Thompson',
            'Robert Wilson',
            'Prof. James Anderson',
            'Mrs. Patricia Green',
            'Charles Windsor',
            'David Miller',
            'Thomas Rail',
            'Captain James Wright',
            'Mark Sports',
            'Victoria Music',
            'Sir John Civil',
            'Judge Margaret Law'
        ]) as contact_name,
        unnest(ARRAY[
            '+44 20 9876 5432',
            '+44 20 4567 8901',
            '+44 20 3456 7890',
            '+44 20 2345 6789',
            '+44 121 345 6789',
            '+44 20 7890 1234',
            '+44 20 8901 2345',
            '+44 20 9012 3456',
            '+44 20 0123 4567',
            '+44 20 1234 5678',
            '+44 20 2345 6789',
            '+44 20 3456 7890',
            '+44 20 4567 8901',
            '+44 20 5678 9012',
            '+44 20 6789 0123'
        ]) as contact_phone,
        unnest(ARRAY[
            '0001', '0002', '0003', '0004', '0005',
            '0006', '0007', '0008', '0009', '0010',
            '0011', '0012', '0013', '0014', '0015'
        ]) as site_pin,
        unnest(ARRAY[
            '["Basic Security Training", "Fire Safety", "Security Guard License", "First Aid Certification"]',
            '["Basic Security Training", "Customer Service Training"]',
            '["Basic Security Training", "Fire Safety", "Security Guard License", "Healthcare Safety Training", "Infection Control"]',
            '["Basic Security Training", "Fire Safety", "Security Guard License", "Data Centre Security", "CCTV Monitoring"]',
            '["Basic Security Training", "Fire Safety", "Security Guard License", "Industrial Safety", "Hazard Awareness"]',
            '["Basic Security Training", "Fire Safety", "Security Guard License", "Student Safety", "Campus Security"]',
            '["Basic Security Training", "Fire Safety", "Security Guard License", "DBS Check", "Child Safety Training"]',
            '["Basic Security Training", "Fire Safety", "Security Guard License", "Concierge Training"]',
            '["Basic Security Training", "Fire Safety", "Security Guard License", "Patrol Training"]',
            '["Basic Security Training", "Fire Safety", "Security Guard License", "Crowd Control", "Emergency Procedures"]',
            '["Basic Security Training", "Fire Safety", "Security Guard License", "Aviation Security", "X-ray Screening"]',
            '["Basic Security Training", "Fire Safety", "Security Guard License", "Crowd Management", "Event Security"]',
            '["Basic Security Training", "Fire Safety", "Security Guard License", "Venue Security"]',
            '["Basic Security Training", "Fire Safety", "Security Guard License", "Government Security Clearance", "Counter Terrorism"]',
            '["Basic Security Training", "Fire Safety", "Security Guard License", "Court Security", "Legal Procedures"]'
        ])::text as requirements
)
-- Insert all sites
INSERT INTO sites (
    organisation_id,
    name,
    address,
    contact_name,
    contact_phone,
    site_pin,
    requirements,
    created_at,
    updated_at
)
SELECT 
    organisation_id,
    name,
    address,
    contact_name,
    contact_phone,
    site_pin,
    requirements::jsonb,
    NOW(),
    NOW()
FROM sites_to_create;

-- Verification
SELECT 
    'Sites Created Successfully' as status,
    COUNT(*) as total_sites,
    MIN(site_pin) as first_pin,
    MAX(site_pin) as last_pin
FROM sites;

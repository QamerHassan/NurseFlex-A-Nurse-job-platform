export interface Hospital {
    id: string;
    name: string;
    shortName: string;
    city: string;
    state: string;
    stateCode: string;
    type: string;
    logo?: string;
    color?: string;
    openRoles: number;
}

export const ALL_STATES = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
    'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
    'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Washington DC'
];

export const US_HOSPITALS: Hospital[] = [
    { id: 'h1', name: 'Mayo Clinic', shortName: 'MC', city: 'Rochester', state: 'Minnesota', stateCode: 'MN', type: 'Health System', logo: 'https://logo.clearbit.com/mayoclinic.org', color: '#1e3a8a', openRoles: 342 },
    { id: 'h2', name: 'Cleveland Clinic', shortName: 'CC', city: 'Cleveland', state: 'Ohio', stateCode: 'OH', type: 'Health System', logo: 'https://logo.clearbit.com/clevelandclinic.org', color: '#059669', openRoles: 281 },
    { id: 'h3', name: 'Johns Hopkins Hospital', shortName: 'JH', city: 'Baltimore', state: 'Maryland', stateCode: 'MD', type: 'Teaching Hospital', logo: 'https://logo.clearbit.com/hopkinsmedicine.org', color: '#2563eb', openRoles: 195 },
    { id: 'h4', name: 'Massachusetts General Hospital', shortName: 'MG', city: 'Boston', state: 'Massachusetts', stateCode: 'MA', type: 'General Hospital', logo: 'https://logo.clearbit.com/massgeneral.org', color: '#0f172a', openRoles: 156 },
    { id: 'h5', name: 'Cedars-Sinai Medical Center', shortName: 'CS', city: 'Los Angeles', state: 'California', stateCode: 'CA', type: 'Medical Center', logo: 'https://logo.clearbit.com/cedars-sinai.org', color: '#dc2626', openRoles: 212 },
    { id: 'h6', name: 'NYU Langone Health', shortName: 'NY', city: 'New York', state: 'New York', stateCode: 'NY', type: 'University Hospital', logo: 'https://logo.clearbit.com/nyulangone.org', color: '#7c3aed', openRoles: 178 },
    { id: 'h7', name: 'UCSF Medical Center', shortName: 'UC', city: 'San Francisco', state: 'California', stateCode: 'CA', type: 'Teaching Hospital', logo: 'https://logo.clearbit.com/ucsfhealth.org', color: '#0284c7', openRoles: 143 },
    { id: 'h8', name: 'Northwestern Memorial Hospital', shortName: 'NW', city: 'Chicago', state: 'Illinois', stateCode: 'IL', type: 'Academic Center', logo: 'https://logo.clearbit.com/nm.org', color: '#4338ca', openRoles: 124 },
    { id: 'h9', name: 'Stanford Health Care', shortName: 'SH', city: 'Stanford', state: 'California', stateCode: 'CA', type: 'Health System', logo: 'https://logo.clearbit.com/stanfordhealthcare.org', color: '#991b1b', openRoles: 115 },
    { id: 'h10', name: 'Mount Sinai Hospital', shortName: 'MS', city: 'New York', state: 'New York', stateCode: 'NY', type: 'Teaching Hospital', logo: 'https://logo.clearbit.com/mountsinai.org', color: '#2563eb', openRoles: 205 },
    { id: 'h11', name: 'HCA Healthcare', shortName: 'HCA', city: 'Nashville', state: 'Tennessee', stateCode: 'TN', type: 'Health System', logo: 'https://logo.clearbit.com/hcahealthcare.com', color: '#14b8a6', openRoles: 1240 },
    { id: 'h12', name: 'Kaiser Permanente', shortName: 'KP', city: 'Oakland', state: 'California', stateCode: 'CA', type: 'Health System', logo: 'https://logo.clearbit.com/kp.org', color: '#0891b2', openRoles: 856 },
    { id: 'h13', name: 'Ascension', shortName: 'AS', city: 'St. Louis', state: 'Missouri', stateCode: 'MO', type: 'Health System', logo: 'https://logo.clearbit.com/ascension.org', color: '#4f46e5', openRoles: 642 },
    { id: 'h14', name: 'CommonSpirit Health', shortName: 'CS', city: 'Chicago', state: 'Illinois', stateCode: 'IL', type: 'Health System', logo: 'https://logo.clearbit.com/commonspirit.org', color: '#0d9488', openRoles: 532 },
    { id: 'h15', name: 'Providence', shortName: 'PR', city: 'Renton', state: 'Washington', stateCode: 'WA', type: 'Health System', logo: 'https://logo.clearbit.com/providence.org', color: '#2563eb', openRoles: 421 },
    { id: 'h16', name: 'Trinity Health', shortName: 'TH', city: 'Livonia', state: 'Michigan', stateCode: 'MI', type: 'Health System', logo: 'https://logo.clearbit.com/trinity-health.org', color: '#059669', openRoles: 398 },
    { id: 'h17', name: 'Tenet Healthcare', shortName: 'TE', city: 'Dallas', state: 'Texas', stateCode: 'TX', type: 'Health System', logo: 'https://logo.clearbit.com/tenethealth.com', color: '#1e40af', openRoles: 312 },
    { id: 'h18', name: 'Atrium Health', shortName: 'AT', city: 'Charlotte', state: 'North Carolina', stateCode: 'NC', type: 'Health System', logo: 'https://logo.clearbit.com/atriumhealth.org', color: '#0d9488', openRoles: 287 },
    { id: 'h19', name: 'Banner Health', shortName: 'BH', city: 'Phoenix', state: 'Arizona', stateCode: 'AZ', type: 'Health System', logo: 'https://logo.clearbit.com/bannerhealth.com', color: '#0284c7', openRoles: 254 },
    { id: 'h20', name: 'Northwell Health', shortName: 'NH', city: 'New Hyde Park', state: 'New York', stateCode: 'NY', type: 'Health System', logo: 'https://logo.clearbit.com/northwell.edu', color: '#4338ca', openRoles: 512 },
    { id: 'h21', name: 'Intermountain Health', shortName: 'IH', city: 'Salt Lake City', state: 'Utah', stateCode: 'UT', type: 'Health System', logo: 'https://logo.clearbit.com/intermountainhealthcare.org', color: '#0f172a', openRoles: 189 },
    { id: 'h22', name: 'Sutter Health', shortName: 'SH', city: 'Sacramento', state: 'California', stateCode: 'CA', type: 'Health System', logo: 'https://logo.clearbit.com/sutterhealth.org', color: '#b91c1c', openRoles: 167 },
    { id: 'h23', name: 'Geisinger Health', shortName: 'GH', city: 'Danville', state: 'Pennsylvania', stateCode: 'PA', type: 'Health System', logo: 'https://logo.clearbit.com/geisinger.org', color: '#1e3a8a', openRoles: 145 },
    { id: 'h24', name: 'Indiana University Health', shortName: 'IU', city: 'Indianapolis', state: 'Indiana', stateCode: 'IN', type: 'Health System', logo: 'https://logo.clearbit.com/iuhealth.org', color: '#991b1b', openRoles: 201 },
    { id: 'h25', name: 'OhioState Health', shortName: 'OS', city: 'Columbus', state: 'Ohio', stateCode: 'OH', type: 'University Hospital', logo: 'https://logo.clearbit.com/osu.edu', color: '#dc2626', openRoles: 132 },
    { id: 'h26', name: 'University of Michigan Health', shortName: 'UM', city: 'Ann Arbor', state: 'Michigan', stateCode: 'MI', type: 'Teaching Hospital', logo: 'https://logo.clearbit.com/uofmhealth.org', color: '#1e40af', openRoles: 156 },
    { id: 'h27', name: 'Duke University Hospital', shortName: 'DU', city: 'Durham', state: 'North Carolina', stateCode: 'NC', type: 'Teaching Hospital', logo: 'https://logo.clearbit.com/dukehealth.org', color: '#000080', openRoles: 118 },
    { id: 'h28', name: 'Vanderbilt Health', shortName: 'VH', city: 'Nashville', state: 'Tennessee', stateCode: 'TN', type: 'Health System', logo: 'https://logo.clearbit.com/vanderbilthealth.com', color: '#1d4ed8', openRoles: 164 },
    { id: 'h29', name: 'Emory Healthcare', shortName: 'EH', city: 'Atlanta', state: 'Georgia', stateCode: 'GA', type: 'Health System', logo: 'https://logo.clearbit.com/emoryhealthcare.org', color: '#1e3a8a', openRoles: 142 },
    { id: 'h30', name: 'Barnes-Jewish Hospital', shortName: 'BJ', city: 'St. Louis', state: 'Missouri', stateCode: 'MO', type: 'Teaching Hospital', logo: 'https://logo.clearbit.com/barnesjewish.org', color: '#2563eb', openRoles: 129 },
    { id: 'h31', name: 'Houston Methodist', shortName: 'HM', city: 'Houston', state: 'Texas', stateCode: 'TX', type: 'Health System', logo: 'https://logo.clearbit.com/houstonmethodist.org', color: '#065f46', openRoles: 187 },
    { id: 'h32', name: 'Memorial Hermann', shortName: 'MH', city: 'Houston', state: 'Texas', stateCode: 'TX', type: 'Health System', logo: 'https://logo.clearbit.com/memorialhermann.org', color: '#b91c1c', openRoles: 154 },
    { id: 'h33', name: 'BJC HealthCare', shortName: 'BJC', city: 'St. Louis', state: 'Missouri', stateCode: 'MO', type: 'Health System', logo: 'https://logo.clearbit.com/bjc.org', color: '#1e40af', openRoles: 210 },
    { id: 'h34', name: 'Orlando Health', shortName: 'OH', city: 'Orlando', state: 'Florida', stateCode: 'FL', type: 'Health System', logo: 'https://logo.clearbit.com/orlandohealth.com', color: '#dc2626', openRoles: 176 },
    { id: 'h35', name: 'Jackson Health System', shortName: 'JH', city: 'Miami', state: 'Florida', stateCode: 'FL', type: 'Public Hospital', logo: 'https://logo.clearbit.com/jacksonhealth.org', color: '#2563eb', openRoles: 143 },
    { id: 'h36', name: 'Tampa General Hospital', shortName: 'TG', city: 'Tampa', state: 'Florida', stateCode: 'FL', type: 'General Hospital', logo: 'https://logo.clearbit.com/tgh.org', color: '#0d9488', openRoles: 98 },
    { id: 'h37', name: 'Sharp HealthCare', shortName: 'SH', city: 'San Diego', state: 'California', stateCode: 'CA', type: 'Health System', logo: 'https://logo.clearbit.com/sharp.com', color: '#0284c7', openRoles: 112 },
    { id: 'h38', name: 'Scripps Health', shortName: 'SC', city: 'San Diego', state: 'California', stateCode: 'CA', type: 'Health System', logo: 'https://logo.clearbit.com/scripps.org', color: '#1e3a8a', openRoles: 87 },
    { id: 'h39', name: 'Piedmont Healthcare', shortName: 'PH', city: 'Atlanta', state: 'Georgia', stateCode: 'GA', type: 'Health System', logo: 'https://logo.clearbit.com/piedmont.org', color: '#4338ca', openRoles: 134 },
    { id: 'h40', name: 'Yale New Haven Health', shortName: 'YN', city: 'New Haven', state: 'Connecticut', stateCode: 'CT', type: 'Health System', logo: 'https://logo.clearbit.com/ynhh.org', color: '#1e40af', openRoles: 156 },
    { id: 'h41', name: 'Novant Health', shortName: 'NV', city: 'Winston-Salem', state: 'North Carolina', stateCode: 'NC', type: 'Health System', logo: 'https://logo.clearbit.com/novanthealth.org', color: '#7c3aed', openRoles: 121 },
    { id: 'h42', name: 'Inova Health System', shortName: 'IN', city: 'Falls Church', state: 'Virginia', stateCode: 'VA', type: 'Health System', logo: 'https://logo.clearbit.com/inova.org', color: '#0d9488', openRoles: 115 },
    { id: 'h43', name: 'Sentara Healthcare', shortName: 'SN', city: 'Norfolk', state: 'Virginia', stateCode: 'VA', type: 'Health System', logo: 'https://logo.clearbit.com/sentara.com', color: '#2563eb', openRoles: 94 },
    { id: 'h44', name: 'University of Alabama Health', shortName: 'UA', city: 'Birmingham', state: 'Alabama', stateCode: 'AL', type: 'University Hospital', logo: 'https://logo.clearbit.com/uabmedicine.org', color: '#065f46', openRoles: 88 },
    { id: 'h45', name: 'UAB Medicine', shortName: 'UA', city: 'Birmingham', state: 'Alabama', stateCode: 'AL', type: 'Health System', logo: 'https://logo.clearbit.com/uabmedicine.org', color: '#065f46', openRoles: 76 },
    { id: 'h46', name: 'Providence Alaska Medical Center', shortName: 'PA', city: 'Anchorage', state: 'Alaska', stateCode: 'AK', type: 'Medical Center', logo: 'https://logo.clearbit.com/providence.org', color: '#2563eb', openRoles: 43 },
    { id: 'h47', name: 'St. Luke Health System', shortName: 'SL', city: 'Boise', state: 'Idaho', stateCode: 'ID', type: 'Health System', logo: 'https://logo.clearbit.com/stlukesonline.org', color: '#0284c7', openRoles: 67 },
    { id: 'h48', name: 'University of Kansas Health System', shortName: 'KU', city: 'Kansas City', state: 'Kansas', stateCode: 'KS', type: 'Health System', logo: 'https://logo.clearbit.com/kansashealthsystem.com', color: '#1e3a8a', openRoles: 112 },
    { id: 'h49', name: 'Ochsner Health', shortName: 'OC', city: 'New Orleans', state: 'Louisiana', stateCode: 'LA', type: 'Health System', logo: 'https://logo.clearbit.com/ochsner.org', color: '#2563eb', openRoles: 156 },
    { id: 'h50', name: 'MaineHealth', shortName: 'MH', city: 'Portland', state: 'Maine', stateCode: 'ME', type: 'Health System', logo: 'https://logo.clearbit.com/mainehealth.org', color: '#0d9488', openRoles: 84 },
    { id: 'h51', name: 'Avera Health', shortName: 'AV', city: 'Sioux Falls', state: 'South Dakota', stateCode: 'SD', type: 'Health System', logo: 'https://logo.clearbit.com/avera.org', color: '#4338ca', openRoles: 56 },
    { id: 'h52', name: 'Sanford Health', shortName: 'SF', city: 'Sioux Falls', state: 'South Dakota', stateCode: 'SD', type: 'Health System', logo: 'https://logo.clearbit.com/sanfordhealth.org', color: '#0f172a', openRoles: 112 },
    { id: 'h53', name: 'Billings Clinic', shortName: 'BC', city: 'Billings', state: 'Montana', stateCode: 'MT', type: 'Clinic', logo: 'https://logo.clearbit.com/billingsclinic.com', color: '#1e40af', openRoles: 42 },
    { id: 'h54', name: 'Renown Health', shortName: 'RN', city: 'Reno', state: 'Nevada', stateCode: 'NV', type: 'Health System', logo: 'https://logo.clearbit.com/renown.org', color: '#b91c1c', openRoles: 89 },
    { id: 'h55', name: 'WVU Medicine', shortName: 'WV', city: 'Morgantown', state: 'West Virginia', stateCode: 'WV', type: 'Health System', logo: 'https://logo.clearbit.com/wvumedicine.org', color: '#1e3a8a', openRoles: 134 },
    { id: 'h56', name: 'Dartmouth Hitchcock Medical Center', shortName: 'DH', city: 'Lebanon', state: 'New Hampshire', stateCode: 'NH', type: 'Medical Center', logo: 'https://logo.clearbit.com/dartmouth-hitchcock.org', color: '#065f46', openRoles: 76 },
    { id: 'h57', name: 'Fletcher Allen Health Care', shortName: 'FA', city: 'Burlington', state: 'Vermont', stateCode: 'VT', type: 'Health System', logo: 'https://logo.clearbit.com/uvmhealth.org', color: '#0d9488', openRoles: 45 },
    { id: 'h58', name: 'University of Vermont Medical Center', shortName: 'UV', city: 'Burlington', state: 'Vermont', stateCode: 'VT', type: 'Medical Center', logo: 'https://logo.clearbit.com/uvmhealth.org', color: '#0d9488', openRoles: 54 },
    { id: 'h59', name: 'Rhode Island Hospital', shortName: 'RI', city: 'Providence', state: 'Rhode Island', stateCode: 'RI', type: 'General Hospital', logo: 'https://logo.clearbit.com/lifespan.org', color: '#2563eb', openRoles: 67 },
    { id: 'h60', name: 'ChristianaCare', shortName: 'CC', city: 'Wilmington', state: 'Delaware', stateCode: 'DE', type: 'Health System', logo: 'https://logo.clearbit.com/christianacare.org', color: '#059669', openRoles: 112 },
    { id: 'h61', name: 'MedStar Health', shortName: 'MS', city: 'Columbia', state: 'Maryland', stateCode: 'MD', type: 'Health System', logo: 'https://logo.clearbit.com/medstarhealth.org', color: '#1e40af', openRoles: 187 },
    { id: 'h62', name: 'MedStar Washington Hospital Center', shortName: 'WC', city: 'Washington', state: 'Washington DC', stateCode: 'DC', type: 'Medical Center', logo: 'https://logo.clearbit.com/medstarhealth.org', color: '#1e40af', openRoles: 145 },
    { id: 'h63', name: 'The Queen\'s Medical Center', shortName: 'QM', city: 'Honolulu', state: 'Hawaii', stateCode: 'HI', type: 'Medical Center', logo: 'https://logo.clearbit.com/queens.org', color: '#2563eb', openRoles: 64 },
    { id: 'h64', name: 'St. Luke\'s Regional Medical Center', shortName: 'SL', city: 'Boise', state: 'Idaho', stateCode: 'ID', type: 'Medical Center', logo: 'https://logo.clearbit.com/stlukesonline.org', color: '#0284c7', openRoles: 56 },
    { id: 'h65', name: 'University of Mississippi Medical Center', shortName: 'UM', city: 'Jackson', state: 'Mississippi', stateCode: 'MS', type: 'Medical Center', logo: 'https://logo.clearbit.com/umc.edu', color: '#1e3a8a', openRoles: 89 },
    { id: 'h66', name: 'Nebraska Medicine', shortName: 'NM', city: 'Omaha', state: 'Nebraska', stateCode: 'NE', type: 'Health System', logo: 'https://logo.clearbit.com/nebraskamed.com', color: '#dc2626', openRoles: 112 },
    { id: 'h67', name: 'CHI Health', shortName: 'CH', city: 'Omaha', state: 'Nebraska', stateCode: 'NE', type: 'Health System', logo: 'https://logo.clearbit.com/chihealth.com', color: '#0d9488', openRoles: 94 },
    { id: 'h68', name: 'Presbyterian Healthcare Services', shortName: 'PH', city: 'Albuquerque', state: 'New Mexico', stateCode: 'NM', type: 'Health System', logo: 'https://logo.clearbit.com/phs.org', color: '#4338ca', openRoles: 78 },
    { id: 'h69', name: 'Oklahoma University Health', shortName: 'OU', city: 'Oklahoma City', state: 'Oklahoma', stateCode: 'OK', type: 'Health System', logo: 'https://logo.clearbit.com/ouhealth.com', color: '#991b1b', openRoles: 132 },
    { id: 'h70', name: 'Oregon Health & Science University', shortName: 'OH', city: 'Portland', state: 'Oregon', stateCode: 'OR', type: 'Health System', logo: 'https://logo.clearbit.com/ohsu.edu', color: '#0284c7', openRoles: 145 },
    { id: 'h71', name: 'Avera McKennan Hospital', shortName: 'AM', city: 'Sioux Falls', state: 'South Dakota', stateCode: 'SD', type: 'General Hospital', logo: 'https://logo.clearbit.com/avera.org', color: '#4338ca', openRoles: 34 },
    { id: 'h72', name: 'Intermountain LDS Hospital', shortName: 'LD', city: 'Salt Lake City', state: 'Utah', stateCode: 'UT', type: 'General Hospital', logo: 'https://logo.clearbit.com/intermountainhealthcare.org', color: '#0f172a', openRoles: 42 },
];

export const ALL_MOCK_JOBS = US_HOSPITALS.flatMap(h => {
    const roles = [
        { title: 'Registered Nurse (RN) - ICU', dept: 'ICU', salary: '95-120' },
        { title: 'Emergency Room Nurse', dept: 'ER', salary: '88-115' },
        { title: 'Pediatric Care Specialist', dept: 'Pediatrics', salary: '82-105' },
        { title: 'Surgical / OR Nurse', dept: 'Surgery', salary: '100-130' },
        { title: 'Cardiac Care RN', dept: 'Cardiac', salary: '90-125' },
        { title: 'Oncology Nurse Specialist', dept: 'Oncology', salary: '85-118' }
    ];

    // Give each hospital 2-3 random jobs from the list
    return roles.slice(0, 1 + Math.floor(Math.random() * 3)).map((r, i) => ({
        id: `m-${h.id}-${i}`,
        title: r.title,
        hospital: h.name,
        location: `${h.city}, ${h.stateCode}`,
        salary: r.salary.split('-')[1], // Use the higher end for display
        type: Math.random() > 0.3 ? 'Full-Time' : 'Part-Time',
        department: r.dept,
        description: `Join the team at ${h.name} as a ${r.title}. We are looking for a dedicated professional to join our ${r.dept} department.\n\nResponsibilities:\n• Provide high-quality patient care\n• Coordinate with multidisciplinary teams\n• Maintain accurate records\n\nRequirements:\n• Valid RN license\n• BSN preferred\n• 1-2 years experience in ${r.dept}`,
        postedAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString()
    }));
});

// ─── Shared Mock Jobs ─────────────────────────────────────────────────────────
// Used by dashboard/page.tsx (job listing) AND jobs/[id]/page.tsx (job detail).
// IDs follow the format "mock-N" so both pages resolve them consistently.

export interface MockJob {
    id: string;
    title: string;
    hospital: string;
    location: string;
    salary: string;
    type: string;
    description: string;
    department?: string;
    postedAt?: string;
}

export const DASHBOARD_MOCK_JOBS: MockJob[] = [
    // Mayo Clinic
    { id: 'mock-1', title: 'ICU Registered Nurse', hospital: 'Mayo Clinic', location: 'Rochester, MN', salary: '52', type: 'Full-time', department: 'ICU', description: 'Join our world-renowned ICU team. Provide critical care to complex patients in a collaborative environment.' },
    { id: 'mock-2', title: 'ER Nurse', hospital: 'Mayo Clinic', location: 'Rochester, MN', salary: '49', type: 'Full-time', department: 'ER', description: 'Fast-paced emergency department role. Triage, assess, and treat patients across all acuity levels.' },
    { id: 'mock-3', title: 'Surgical Nurse', hospital: 'Mayo Clinic', location: 'Rochester, MN', salary: '55', type: 'Contract', department: 'Surgery', description: 'Assist in complex surgical procedures. Work alongside top surgeons in a leading academic medical center.' },
    // Cleveland Clinic
    { id: 'mock-4', title: 'Cardiac Nurse', hospital: 'Cleveland Clinic', location: 'Cleveland, OH', salary: '54', type: 'Full-time', department: 'Cardiac', description: 'Work in our nationally ranked cardiology unit. Monitor and care for patients with complex cardiac conditions.' },
    { id: 'mock-5', title: 'Oncology Nurse', hospital: 'Cleveland Clinic', location: 'Cleveland, OH', salary: '50', type: 'Part-time', department: 'Oncology', description: 'Provide compassionate care to cancer patients. Administer chemotherapy and manage treatment side effects.' },
    { id: 'mock-6', title: 'Pediatric Nurse', hospital: 'Cleveland Clinic', location: 'Cleveland, OH', salary: '47', type: 'Night Shift', department: 'Pediatrics', description: 'Care for children in our pediatric unit. Work with families to provide exceptional child-centered care.' },
    // Johns Hopkins
    { id: 'mock-7', title: 'Neurology Nurse', hospital: 'Johns Hopkins Hospital', location: 'Baltimore, MD', salary: '58', type: 'Full-time', department: 'Neurology', description: 'Join our neurology team caring for stroke, epilepsy, and neurodegenerative disease patients.' },
    { id: 'mock-8', title: 'Trauma Nurse', hospital: 'Johns Hopkins Hospital', location: 'Baltimore, MD', salary: '60', type: 'Full-time', department: 'ER', description: 'Level 1 trauma center. Handle high-acuity trauma cases with a multidisciplinary team.' },
    { id: 'mock-9', title: 'Research Nurse', hospital: 'Johns Hopkins Hospital', location: 'Baltimore, MD', salary: '53', type: 'Contract', department: 'Research', description: 'Support clinical trials and nursing research. Collect data and coordinate with research teams.' },
    // Massachusetts General
    { id: 'mock-10', title: 'NICU Nurse', hospital: 'Massachusetts General Hospital', location: 'Boston, MA', salary: '56', type: 'Full-time', department: 'NICU', description: 'Provide specialized care for premature and critically ill newborns in our Level IV NICU.' },
    { id: 'mock-11', title: 'Transplant Nurse', hospital: 'Massachusetts General Hospital', location: 'Boston, MA', salary: '61', type: 'Full-time', department: 'Surgery', description: 'Coordinate care for organ transplant patients pre and post-surgery in a leading transplant center.' },
    { id: 'mock-12', title: 'Float Pool Nurse', hospital: 'Massachusetts General Hospital', location: 'Boston, MA', salary: '58', type: 'Per Diem', department: 'General', description: 'Flexible RN position covering multiple units. Great for experienced nurses seeking variety.' },
    // UCSF Medical Center
    { id: 'mock-13', title: 'Bone Marrow Transplant Nurse', hospital: 'UCSF Medical Center', location: 'San Francisco, CA', salary: '72', type: 'Full-time', department: 'Oncology', description: 'Specialize in hematologic malignancies and bone marrow transplant care at a leading cancer center.' },
    { id: 'mock-14', title: 'Psychiatric Nurse', hospital: 'UCSF Medical Center', location: 'San Francisco, CA', salary: '65', type: 'Full-time', department: 'Psychiatry', description: 'Provide mental health nursing care in an inpatient psychiatric setting. Crisis stabilization experience preferred.' },
    { id: 'mock-15', title: 'Ambulatory Care Nurse', hospital: 'UCSF Medical Center', location: 'San Francisco, CA', salary: '68', type: 'Part-time', department: 'Ambulatory', description: 'Support outpatient clinic operations. Triage calls, manage patient education, and assist with procedures.' },
    // NYU Langone
    { id: 'mock-16', title: 'Orthopedic Nurse', hospital: 'NYU Langone Health', location: 'New York, NY', salary: '62', type: 'Full-time', department: 'Orthopedics', description: 'Pre and post-op care for orthopedic patients. Experience with joint replacements and spine surgeries preferred.' },
    { id: 'mock-17', title: 'Infusion Nurse', hospital: 'NYU Langone Health', location: 'New York, NY', salary: '58', type: 'Contract', department: 'Oncology', description: 'Administer IV therapies, biologics, and chemotherapy in our state-of-the-art infusion center.' },
    { id: 'mock-18', title: 'Labor & Delivery Nurse', hospital: 'NYU Langone Health', location: 'New York, NY', salary: '64', type: 'Night Shift', department: 'L&D', description: 'Support mothers through labor, delivery, and immediate postpartum care in a high-volume L&D unit.' },
    // Cedars-Sinai
    { id: 'mock-19', title: 'Cardiovascular ICU Nurse', hospital: 'Cedars-Sinai Medical Center', location: 'Los Angeles, CA', salary: '75', type: 'Full-time', department: 'ICU', description: 'Manage complex cardiac surgery patients in our CVICU. Experienced with hemodynamic monitoring required.' },
    { id: 'mock-20', title: 'Endoscopy Nurse', hospital: 'Cedars-Sinai Medical Center', location: 'Los Angeles, CA', salary: '67', type: 'Full-time', department: 'GI', description: 'Assist with GI procedures in a busy endoscopy suite. Moderate sedation certification preferred.' },
    { id: 'mock-21', title: 'Travel Nurse – Med/Surg', hospital: 'Cedars-Sinai Medical Center', location: 'Los Angeles, CA', salary: '80', type: 'Contract', department: 'Med/Surg', description: '13-week travel contract. Medical-surgical floor with competitive pay, housing stipend included.' },
    // Houston Methodist
    { id: 'mock-22', title: 'Perioperative Nurse', hospital: 'Houston Methodist Hospital', location: 'Houston, TX', salary: '57', type: 'Full-time', department: 'Surgery', description: 'Circulate and scrub in various surgical specialties. Strong teamwork and sterile technique required.' },
    { id: 'mock-23', title: 'Case Management Nurse', hospital: 'Houston Methodist Hospital', location: 'Houston, TX', salary: '60', type: 'Full-time', department: 'Case Management', description: 'Coordinate discharge planning and utilization review. Excellent communication and organization skills needed.' },
    { id: 'mock-24', title: 'Wound Care Nurse', hospital: 'Houston Methodist Hospital', location: 'Houston, TX', salary: '55', type: 'Part-time', department: 'Wound Care', description: 'Assess and treat complex wounds across inpatient units. CWCN certification a plus.' },
    // Seattle Children's
    { id: 'mock-25', title: 'Pediatric ICU Nurse', hospital: "Seattle Children's Hospital", location: 'Seattle, WA', salary: '65', type: 'Full-time', department: 'Pediatrics', description: 'Provide intensive care for critically ill children. Family-centered care model in a leading pediatric hospital.' },
    { id: 'mock-26', title: 'Pediatric Oncology Nurse', hospital: "Seattle Children's Hospital", location: 'Seattle, WA', salary: '63', type: 'Full-time', department: 'Oncology', description: 'Support children and families through cancer treatment. Compassion and resilience are essential.' },
    { id: 'mock-27', title: 'Pediatric ER Nurse', hospital: "Seattle Children's Hospital", location: 'Seattle, WA', salary: '61', type: 'Night Shift', department: 'ER', description: 'High-energy pediatric emergency department. Expertise in pediatric triage and family communication required.' },
    // Northwestern Memorial
    { id: 'mock-28', title: 'Stroke Nurse', hospital: 'Northwestern Memorial Hospital', location: 'Chicago, IL', salary: '59', type: 'Full-time', department: 'Neurology', description: 'Care for acute stroke patients in a certified stroke center. tPA administration experience preferred.' },
    { id: 'mock-29', title: 'Medical ICU Nurse', hospital: 'Northwestern Memorial Hospital', location: 'Chicago, IL', salary: '62', type: 'Full-time', department: 'ICU', description: 'Manage critically ill medical patients including sepsis, respiratory failure, and multi-organ dysfunction.' },
    { id: 'mock-30', title: 'Dialysis Nurse', hospital: 'Northwestern Memorial Hospital', location: 'Chicago, IL', salary: '56', type: 'Per Diem', department: 'Dialysis', description: 'Provide acute hemodialysis for inpatients. CRRT experience strongly preferred.' },
];

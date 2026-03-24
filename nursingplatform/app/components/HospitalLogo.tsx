"use client";
import { useState } from 'react';

export const HOSPITAL_LOGO_MAP: Record<string, string> = {
    'Mayo Clinic': '/logos/mayo.png',
    'Cleveland Clinic': '/logos/cleveland.png',
    'Johns Hopkins Hospital': '/logos/hopkins.png',
    'Johns Hopkins Medicine': '/logos/hopkins.png',
    'Massachusetts General Hospital': '/logos/mass_general.png',
    'UCSF Medical Center': '/logos/ucsf.png',
    'UCSF Health': '/logos/ucsf.png',
    'NYU Langone Health': '/logos/nyu.png',
    'Cedars-Sinai Medical Center': '/logos/cedars.png',
    'Houston Methodist Hospital': '/logos/houston.png',
    'Houston Methodist': '/logos/houston.png',
    "Seattle Children's Hospital": '/logos/seattle.png',
    'Northwestern Memorial Hospital': '/logos/northwestern.png',
    'MD Anderson Cancer Center': 'https://logo.clearbit.com/mdanderson.org',
    'Stanford Health Care': '/logos/stanford.png',
    'UCLA Health': 'https://logo.clearbit.com/uclahealth.org',
    'Penn Medicine': 'https://logo.clearbit.com/pennmedicine.org',
    'Sentara Healthcare': '/logos/sentara.png',
    'Sentara Health': '/logos/sentara.png',
    'Loyola Medicine': '/logos/loyola.png',
    'Vanderbilt University Medical Center': '/logos/vanderbilt.png',
    'Vanderbilt Health': '/logos/vanderbilt.png',
    'Kaiser Permanente': '/logos/kaiser.png',
    'HCA Healthcare': '/logos/hca.png',
    'Ascension Health': '/logos/ascension.png',
    'Ascension': '/logos/ascension.png',
    'AdventHealth': 'https://logo.clearbit.com/adventhealth.com',
    'Banner Health': '/logos/banner.png',
    'CommonSpirit Health': '/logos/commonspirit.png',
    'CommonSpirit': '/logos/commonspirit.png',
    'Providence Health': '/logos/providence.png',
    'Providence': '/logos/providence.png',
    'Tenet Healthcare': '/logos/tenet.png',
    'Tenet Health': '/logos/tenet.png',
    "Boston Children's Hospital": 'https://logo.clearbit.com/childrenshospital.org',
    "Children's Hospital of Philadelphia": 'https://logo.clearbit.com/chop.edu',
    "Cincinnati Children's": 'https://logo.clearbit.com/cincinnatichildrens.org',
    "Texas Children's Hospital": 'https://logo.clearbit.com/texaschildrens.org',
    "Nationwide Children's Hospital": 'https://logo.clearbit.com/nationwidechildrens.org',
    "Children's Hospital Los Angeles": 'https://logo.clearbit.com/chla.org',
    "Children's National Hospital": 'https://logo.clearbit.com/childrensnational.org',
    "Lurie Children's Hospital": 'https://logo.clearbit.com/luriechildrens.org',
    'Memorial Sloan Kettering': 'https://logo.clearbit.com/mskcc.org',
    'Dana-Farber Cancer Institute': 'https://logo.clearbit.com/dana-farber.org',
    'Moffitt Cancer Center': 'https://logo.clearbit.com/moffitt.org',
    'City of Hope': 'https://logo.clearbit.com/cityofhope.org',
    'Duke Health': '/logos/duke.png',
    'Duke University Hospital': '/logos/duke.png',
    'Emory Healthcare': 'https://logo.clearbit.com/emoryhealthcare.org',
    'University of Pittsburgh Medical Center': 'https://logo.clearbit.com/upmc.com',
    'UPMC': 'https://logo.clearbit.com/upmc.com',
    'NewYork-Presbyterian': 'https://logo.clearbit.com/nyp.org',
    'Mount Sinai Health System': '/logos/mount_sinai.png',
    'Mount Sinai Hospital': '/logos/mount_sinai.png',
    'Northwell Health': '/logos/northwell.png',
    'Montefiore Medical Center': 'https://logo.clearbit.com/montefiore.org',
    'Inova Health System': '/logos/inova.png',
    'MedStar Health': '/logos/medstar.png',
    'Atrium Health': '/logos/atrium.png',
    'OhioHealth': 'https://logo.clearbit.com/ohiohealth.com',
    'Rush University Medical Center': 'https://logo.clearbit.com/rush.edu',
    'Henry Ford Health': 'https://logo.clearbit.com/henryford.com',
    'Scripps Health': 'https://logo.clearbit.com/scripps.org',
    'Intermountain Healthcare': '/logos/intermountain.png',
    'Intermountain Health': '/logos/intermountain.png',
    'Avera Health': '/logos/avera.png',
    'Avera': '/logos/avera.png',
    'Oregon Health Authority': '/logos/oregon_health.png',
    'University of Oklahoma Health': '/logos/ou_health.png',
    'OU Health': '/logos/ou_health.png',
    'Sanford Health': 'https://logo.clearbit.com/sanfordhealth.org',
    'Baylor Scott & White Health': 'https://logo.clearbit.com/bswhealth.com',
    'UT Southwestern Medical Center': 'https://logo.clearbit.com/utsouthwestern.edu',
    'Memorial Hermann': 'https://logo.clearbit.com/memorialhermann.org',
    'UAB Medicine': '/logos/uab.png',
    'University of Florida Health': 'https://logo.clearbit.com/ufhealth.org',
    'Jackson Health System': 'https://logo.clearbit.com/jacksonhealth.org',
    'Tampa General Hospital': 'https://logo.clearbit.com/tgh.org',
    'WellStar Health System': 'https://logo.clearbit.com/wellstar.org',
    'Piedmont Healthcare': 'https://logo.clearbit.com/piedmont.org',
    'Prisma Health': 'https://logo.clearbit.com/prismahealth.org',
    'MUSC Health': 'https://logo.clearbit.com/muschealth.org',
    'Novant Health': '/logos/novant.png',
    'UNC Health': 'https://logo.clearbit.com/unchealth.org',
    'UCHealth': 'https://logo.clearbit.com/uchealth.org',
    'University of Michigan Health': 'https://logo.clearbit.com/uofmhealth.org',
    'University of Chicago Medicine': 'https://logo.clearbit.com/uchicagomedicine.org',
    'Beaumont Health': 'https://logo.clearbit.com/beaumont.org',
    'Sharp HealthCare': 'https://logo.clearbit.com/sharp.com',
    'UCSD Health': 'https://logo.clearbit.com/health.ucsd.edu',
    'Advocate Aurora Health': 'https://logo.clearbit.com/advocateaurorahealth.org',
    'Dignity Health': 'https://logo.clearbit.com/dignityhealth.org',
    'CHI Health': '/logos/chi_health.png',
    'Nebraska Medicine': '/logos/nebraska_medicine.png',
    'University of Mississippi Medical Center': '/logos/umc_mississippi.png',
    'UMC Mississippi': '/logos/umc_mississippi.png',
    'St. Luke\'s University Health Network': '/logos/st_lukes.png',
    'St. Luke\'s': '/logos/st_lukes.png',
    'Sutter Health': '/logos/sutter.png',
    'Renown Health': '/logos/renown.png',
    'Ochsner Health': '/logos/ochsner.png',
    'Christus Health': 'https://logo.clearbit.com/christushealth.org',
    'Grady Health System': 'https://logo.clearbit.com/gradyhealth.org',
    'Harris Health System': 'https://logo.clearbit.com/harrishealth.org',
    'Cone Health': 'https://logo.clearbit.com/conehealth.com',
    'Jefferson Health': 'https://logo.clearbit.com/jeffersonhealth.org',
    'Fletcher Allen Health Care': '/logos/fletcher_allen.png',
    'Fletcher Allen': '/logos/fletcher_allen.png',
    'Rhode Island Hospital': '/logos/rhode_island.png',
    'ChristianaCare': '/logos/christianacare.png',
    'Dartmouth-Hitchcock Medical Center': '/logos/dartmouth.png',
    'Dartmouth-Hitchcock': '/logos/dartmouth.png',
    'Presbyterian Healthcare Services': '/logos/presbyterian.png',
    'Presbyterian Healthcare Foundation': '/logos/presbyterian.png',
    'Presbyterian': '/logos/presbyterian_v2.png',
    'Vidant Health': '/logos/vidant.png',
    'Wake Forest Baptist Health': '/logos/wake_forest.png',
    'OSF HealthCare': '/logos/osf.png',
    'Swedish Medical Center': '/logos/swedish.png',
    'Swedish Medical Group': '/logos/swedish.png',
    'Virginia Mason': '/logos/virginia_mason.png',
    'Virginia Mason Franciscan Health': '/logos/virginia_mason.png',
    'PeaceHealth': '/logos/peacehealth.png',
    'MultiCare Health System': '/logos/multicare.png',
    'MultiCare': '/logos/multicare.png',
    'Providence Health & Services': '/logos/providence_hs.png',
    'Spectrum Health': '/logos/spectrum.png',
    'Spectrum Health & Human Services': '/logos/spectrum.png',
    'Overlake Medical Center': '/logos/overlake.png',
    'Trinity Health': '/logos/trinity.png',
    'Geisinger Health': '/logos/geisinger.png',
    'Indiana University Health': '/logos/iu_health.png',
    'I': '/logos/iu_health.png',
    'SCL Health': '/logos/scl_health.png',
    'Barnes-Jewish Hospital': '/logos/barnes_jewish.png',
    'BJC HealthCare': '/logos/bjc.png',
    'Orlando Health': '/logos/orlando.png',
    'Yale New Haven Health': '/logos/yale.png',
    'Yale-New Haven Hospital': '/logos/yale.png',
    'OhioState Health': '/logos/ohio_state.png',
    'Ohio State Wexner Medical Center': '/logos/ohio_state.png',
};

// ─── Smart logo lookup ────────────────────────────────────────────────────────
export function getHospitalLogo(name: string): string | null {
    if (!name) return null;
    // 1. Exact match
    if (HOSPITAL_LOGO_MAP[name]) return HOSPITAL_LOGO_MAP[name];
    // 2. Partial match (case-insensitive)
    const key = Object.keys(HOSPITAL_LOGO_MAP).find(k =>
        name.toLowerCase().includes(k.toLowerCase()) ||
        k.toLowerCase().includes(name.toLowerCase())
    );
    return key ? HOSPITAL_LOGO_MAP[key] : null;
}

// ─── HospitalLogo component ───────────────────────────────────────────────────
// Supports two usage patterns:
//   1. From NurseDashboard  →  <HospitalLogo hospitalName="Mayo Clinic" size="md" />
//   2. From JobDetailPane   →  <HospitalLogo name="Mayo Clinic" logo={job.logo} size={64} />

interface HospitalLogoProps {
    // Pattern 1 (dashboard list cards)
    hospitalName?: string;
    size?: 'sm' | 'md' | 'lg' | number;
    className?: string;
    // Pattern 2 (detail pane — legacy props)
    name?: string;
    logo?: string | null;          // direct logo URL from backend
}

export function HospitalLogo({
    hospitalName,
    name,
    logo,
    size = 'md',
    className = '',
}: HospitalLogoProps) {
    const [imgError, setImgError] = useState(false);

    // Resolve the hospital display name
    const resolvedName = hospitalName || name || '';

    // Priority: backend logo → Clearbit lookup
    const resolvedUrl = (!imgError && logo) ? logo : (!imgError ? getHospitalLogo(resolvedName) : null);

    const letter = resolvedName[0]?.toUpperCase() || '?';

    // Size handling — accept Tailwind size key OR pixel number
    let containerClass = '';
    let pxSize = 0;

    if (typeof size === 'number') {
        pxSize = size;
    } else {
        const map = { sm: 32, md: 44, lg: 64 };
        pxSize = map[size];
    }

    // Inline style used so pixel sizes work correctly
    const style = { width: pxSize, height: pxSize, minWidth: pxSize };

    if (resolvedUrl && !imgError) {
        return (
            <div
                style={style}
                className={`rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden shrink-0 ${className}`}
            >
                <img
                    src={resolvedUrl}
                    alt={resolvedName}
                    className="w-full h-full object-contain p-1.5"
                    onError={() => setImgError(true)}
                />
            </div>
        );
    }

    // Fallback gradient avatar
    return (
        <div
            style={style}
            className={`bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center text-white font-bold shrink-0 ${className}`}
        >
            <span style={{ fontSize: pxSize * 0.38 }}>{letter}</span>
        </div>
    );
}

export default HospitalLogo;
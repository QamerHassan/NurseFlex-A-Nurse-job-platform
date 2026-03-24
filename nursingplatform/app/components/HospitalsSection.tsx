'use client';
import React, { useState, useMemo, useRef } from 'react';
import { Search, MapPin, Building2, ChevronDown, X, ExternalLink, Briefcase } from 'lucide-react';
import { US_HOSPITALS, ALL_STATES, type Hospital } from '@/app/lib/us-hospitals';
import Link from 'next/link';

import { HospitalLogo } from '@/app/components/HospitalLogo';

// ─── Hospital Card ────────────────────────────────────────────────────────────
function HospitalCard({ hospital, index, onClick }: { hospital: Hospital; index: number; onClick?: () => void }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: 'white',
                borderRadius: 16,
                padding: '16px 18px',
                border: `1px solid ${hovered ? 'rgba(20,184,166,0.3)' : 'rgba(0,0,0,0.06)'}`,
                boxShadow: hovered ? '0 8px 28px rgba(20,184,166,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
                transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
                transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 14,
                animation: `fadeUp 0.4s ease ${Math.min(index, 8) * 0.05}s both`,
            }}
        >
            <HospitalLogo hospitalName={hospital.name} size={48} />

            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                    fontSize: 13, fontWeight: 700, color: hovered ? '#0d9488' : '#0f172a',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    transition: 'color 0.2s', marginBottom: 3,
                }}>
                    {hospital.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={10} style={{ color: '#94a3b8', flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {hospital.city}, {hospital.stateCode}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                        background: 'rgba(20,184,166,0.08)', color: '#0d9488',
                        border: '1px solid rgba(20,184,166,0.15)',
                    }}>
                        {hospital.type}
                    </span>
                </div>
            </div>

            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{
                    fontSize: 18, fontWeight: 800, lineHeight: 1,
                    background: 'linear-gradient(135deg, #14b8a6, #10b981)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                    {hospital.openRoles}
                </p>
                <p style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>
                    open roles
                </p>
            </div>
        </div>
    );
}

// ─── Main Hospitals Section ───────────────────────────────────────────────────
export function HospitalsSection({ onHospitalSearch }: { onHospitalSearch?: (name: string) => void }) {
    const [search, setSearch] = useState('');
    const [selectedState, setSelectedState] = useState('All States');
    const [showStateMenu, setShowStateMenu] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const stateRef = useRef<HTMLDivElement>(null);

    // Filter hospitals
    const filtered = useMemo(() => {
        return US_HOSPITALS.filter(h => {
            const matchSearch = !search ||
                h.name.toLowerCase().includes(search.toLowerCase()) ||
                h.city.toLowerCase().includes(search.toLowerCase()) ||
                h.state.toLowerCase().includes(search.toLowerCase()) ||
                h.stateCode.toLowerCase().includes(search.toLowerCase()) ||
                h.type.toLowerCase().includes(search.toLowerCase());
            const matchState = selectedState === 'All States' || h.state === selectedState || h.stateCode === selectedState;
            return matchSearch && matchState;
        });
    }, [search, selectedState]);

    const displayed = showAll ? filtered : filtered.slice(0, 12);

    const totalRoles = US_HOSPITALS.reduce((sum, h) => sum + h.openRoles, 0);

    return (
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>

            {/* Header */}
            <div style={{
                padding: '20px 24px 0',
                background: 'linear-gradient(135deg, rgba(20,184,166,0.04), rgba(37,99,235,0.03))',
                borderBottom: '1px solid rgba(20,184,166,0.08)',
                paddingBottom: 20,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: 'linear-gradient(135deg, #14b8a6, #10b981)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(20,184,166,0.3)',
                        }}>
                            <Building2 size={18} style={{ color: 'white' }} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>
                                Top US Hospitals & Health Systems
                            </h2>
                            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>
                                {US_HOSPITALS.length} facilities · {totalRoles.toLocaleString()} open roles across all 50 states
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search + State filter */}
                <div style={{ display: 'flex', gap: 10 }}>
                    {/* Search */}
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search hospitals, cities, states…"
                            style={{
                                width: '100%', height: 40, borderRadius: 12, paddingLeft: 36, paddingRight: 36,
                                background: 'white', border: '1px solid rgba(20,184,166,0.15)',
                                fontSize: 13, color: '#0f172a', outline: 'none', fontFamily: 'inherit',
                                boxSizing: 'border-box' as const, transition: 'border-color 0.2s',
                            }}
                            onFocus={e => (e.target.style.borderColor = 'rgba(20,184,166,0.5)')}
                            onBlur={e => (e.target.style.borderColor = 'rgba(20,184,166,0.15)')}
                        />
                        {search && (
                            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                                <X size={13} />
                            </button>
                        )}
                    </div>

                    {/* State dropdown */}
                    <div ref={stateRef} style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowStateMenu(v => !v)}
                            style={{
                                height: 40, padding: '0 14px', borderRadius: 12,
                                background: selectedState !== 'All States' ? 'rgba(20,184,166,0.08)' : 'white',
                                border: `1px solid ${selectedState !== 'All States' ? 'rgba(20,184,166,0.3)' : 'rgba(0,0,0,0.1)'}`,
                                color: selectedState !== 'All States' ? '#0d9488' : '#475569',
                                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 6,
                                fontFamily: 'inherit', whiteSpace: 'nowrap' as const,
                                transition: 'all 0.2s',
                            }}
                        >
                            <MapPin size={13} />
                            {selectedState === 'All States' ? 'All States' : selectedState.length > 12 ? selectedState.slice(0, 12) + '…' : selectedState}
                            <ChevronDown size={12} style={{ transform: showStateMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>

                        {showStateMenu && (
                            <div style={{
                                position: 'absolute', top: '110%', right: 0, zIndex: 100,
                                background: 'white', border: '1px solid rgba(0,0,0,0.08)',
                                borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                width: 220, maxHeight: 280, overflowY: 'auto',
                                padding: 6,
                            }}>
                                {['All States', ...ALL_STATES].map(state => (
                                    <button key={state} onClick={() => { setSelectedState(state); setShowStateMenu(false); }}
                                        style={{
                                            width: '100%', padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                                            background: selectedState === state ? 'rgba(20,184,166,0.1)' : 'transparent',
                                            color: selectedState === state ? '#0d9488' : '#374151',
                                            fontSize: 13, fontWeight: selectedState === state ? 700 : 400,
                                            textAlign: 'left' as const, fontFamily: 'inherit',
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={e => { if (selectedState !== state) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(20,184,166,0.05)'; }}
                                        onMouseLeave={e => { if (selectedState !== state) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                                    >
                                        {state}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Active filters */}
                {(search || selectedState !== 'All States') && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>
                            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                        </span>
                        {selectedState !== 'All States' && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#0d9488', background: 'rgba(20,184,166,0.08)', padding: '2px 10px', borderRadius: 20, border: '1px solid rgba(20,184,166,0.2)' }}>
                                {selectedState}
                                <button onClick={() => setSelectedState('All States')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#0d9488', padding: 0 }}><X size={11} /></button>
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Grid */}
            <div style={{ padding: '20px 24px' }}>
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                        <Building2 size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                        <p style={{ fontWeight: 600, fontSize: 14 }}>No hospitals found</p>
                        <p style={{ fontSize: 12, marginTop: 4 }}>Try a different search or state.</p>
                    </div>
                ) : (
                    <>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: 12,
                        }}>
                            {displayed.map((hospital, i) => (
                                <HospitalCard key={hospital.id} hospital={hospital} index={i} onClick={() => onHospitalSearch?.(hospital.name)} />
                            ))}
                        </div>

                        {/* Show more / less */}
                        {filtered.length > 12 && (
                            <div style={{ textAlign: 'center', marginTop: 20 }}>
                                <button
                                    onClick={() => setShowAll(v => !v)}
                                    style={{
                                        padding: '10px 28px', borderRadius: 12, border: '1px solid rgba(20,184,166,0.2)',
                                        background: 'rgba(20,184,166,0.06)', color: '#0d9488',
                                        fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {showAll ? `Show less` : `Show all ${filtered.length} hospitals`}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <style>{`
                @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
                input::placeholder { color: #94a3b8; }
            `}</style>
        </div>
    );
}

export default HospitalsSection;

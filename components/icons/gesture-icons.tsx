'use client';

import { ReactNode } from 'react';

// --- Action Icons (used in action picker grids) ---

function svg(children: ReactNode, vb = '0 0 24 24') {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox={vb} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            {children}
        </svg>
    );
}

export const ActionIcons: Record<string, ReactNode> = {
    None: svg(<><circle cx="12" cy="12" r="9" /><line x1="8" y1="8" x2="16" y2="16" /></>),
    switch_tab: svg(<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>),
    play_pause: svg(<><polygon points="6,4 20,12 6,20" fill="currentColor" stroke="none" /><rect x="16" y="5" width="2" height="14" rx="0.5" fill="currentColor" stroke="none" opacity="0.4" /></>),
    volume_up: svg(<><polygon points="4,8 8,8 13,4 13,20 8,16 4,16" /><path d="M16 8.5a5 5 0 0 1 0 7" /><path d="M19 6a9 9 0 0 1 0 12" /></>),
    volume_down: svg(<><polygon points="4,8 8,8 13,4 13,20 8,16 4,16" /><path d="M16 8.5a5 5 0 0 1 0 7" /></>),
    mute: svg(<><polygon points="4,8 8,8 13,4 13,20 8,16 4,16" /><line x1="17" y1="9" x2="23" y2="15" /><line x1="23" y1="9" x2="17" y2="15" /></>),
    next_track: svg(<><polygon points="4,4 16,12 4,20" fill="currentColor" stroke="none" /><line x1="19" y1="4" x2="19" y2="20" strokeWidth="2" /></>),
    prev_track: svg(<><polygon points="20,4 8,12 20,20" fill="currentColor" stroke="none" /><line x1="5" y1="4" x2="5" y2="20" strokeWidth="2" /></>),
    screenshot: svg(<><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="12" cy="12" r="3.5" /><path d="M3 8h2" /><path d="M19 8h2" /></>),
    scroll_up: svg(<><polyline points="7,13 12,8 17,13" /><line x1="12" y1="8" x2="12" y2="20" /><line x1="5" y1="4" x2="19" y2="4" /></>),
    scroll_down: svg(<><polyline points="7,11 12,16 17,11" /><line x1="12" y1="16" x2="12" y2="4" /><line x1="5" y1="20" x2="19" y2="20" /></>),
    brightness_up: svg(<><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" /><line x1="4.9" y1="4.9" x2="7" y2="7" /><line x1="17" y1="17" x2="19.1" y2="19.1" /><line x1="19.1" y1="4.9" x2="17" y2="7" /><line x1="7" y1="17" x2="4.9" y2="19.1" /></>),
    brightness_down: svg(<><circle cx="12" cy="12" r="4" /><line x1="12" y1="5" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="19" /><line x1="3" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="21" y2="12" /></>),
    toggle_cursor: svg(<><path d="M4 4l7 17 2.5-6.5L20 12z" /><line x1="14" y1="14" x2="20" y2="20" /></>),
    switch_desktop_left: svg(<><polyline points="14,6 8,12 14,18" /><rect x="2" y="4" width="20" height="16" rx="2" /></>),
    switch_desktop_right: svg(<><polyline points="10,6 16,12 10,18" /><rect x="2" y="4" width="20" height="16" rx="2" /></>),
};

// --- Gesture Icons (used in gesture emoji picker & gesture cards) ---
// Geometric, minimal, abstract hand-gesture-inspired marks

function glyph(children: ReactNode) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="w-full h-full">
            {children}
        </svg>
    );
}

export const GESTURE_ICONS: { id: string; label: string; icon: ReactNode }[] = [
    {
        id: 'wave',
        label: 'Wave',
        icon: glyph(
            <g stroke="url(#g1)" strokeWidth="1.8" strokeLinecap="round">
                <defs><linearGradient id="g1" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="#22d3ee" /></linearGradient></defs>
                <path d="M8 20 C8 14 10 10 12 8" /><path d="M12 20 C12 14 14 10 16 8" /><path d="M16 20 C16 15 18 11 20 9" /><path d="M20 20 C20 16 22 13 24 11" />
                <path d="M6 22 C6 26 10 28 16 28 C22 28 26 24 26 18" />
            </g>
        ),
    },
    {
        id: 'peace',
        label: 'Peace',
        icon: glyph(
            <g stroke="url(#g2)" strokeWidth="1.8" strokeLinecap="round">
                <defs><linearGradient id="g2" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#a78bfa" /><stop offset="100%" stopColor="#818cf8" /></linearGradient></defs>
                <path d="M12 22 V6" /><path d="M18 22 V6" />
                <path d="M8 22 C8 18 8 16 10 14" /><path d="M22 22 C22 18 22 16 20 14" />
                <path d="M8 22 C8 27 12 29 16 29 C20 29 24 27 24 22" />
            </g>
        ),
    },
    {
        id: 'thumbs_up',
        label: 'Thumbs Up',
        icon: glyph(
            <g stroke="url(#g3)" strokeWidth="1.8" strokeLinecap="round" fill="none">
                <defs><linearGradient id="g3" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#818cf8" /></linearGradient></defs>
                <path d="M16 4 L16 14" /><path d="M16 14 L10 14 C8 14 7 15 7 17 L7 22 C7 25 9 27 12 27 L22 27 C24 27 25 25 25 23 L25 17 C25 15 24 14 22 14 L20 14" />
            </g>
        ),
    },
    {
        id: 'thumbs_down',
        label: 'Thumbs Down',
        icon: glyph(
            <g stroke="url(#g4)" strokeWidth="1.8" strokeLinecap="round" fill="none">
                <defs><linearGradient id="g4" x1="0" y1="32" x2="32" y2="0"><stop offset="0%" stopColor="#f87171" /><stop offset="100%" stopColor="#818cf8" /></linearGradient></defs>
                <path d="M16 28 L16 18" /><path d="M16 18 L10 18 C8 18 7 17 7 15 L7 10 C7 7 9 5 12 5 L22 5 C24 5 25 7 25 9 L25 15 C25 17 24 18 22 18 L20 18" />
            </g>
        ),
    },
    {
        id: 'crossed',
        label: 'Crossed',
        icon: glyph(
            <g stroke="url(#g5)" strokeWidth="1.8" strokeLinecap="round">
                <defs><linearGradient id="g5" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#818cf8" /></linearGradient></defs>
                <path d="M11 6 L14 20" /><path d="M18 6 L15 20" />
                <path d="M8 22 C8 27 12 29 16 29 C20 29 24 27 24 22 L24 20 L8 20 Z" />
            </g>
        ),
    },
    {
        id: 'rock',
        label: 'Rock',
        icon: glyph(
            <g stroke="url(#g6)" strokeWidth="1.8" strokeLinecap="round">
                <defs><linearGradient id="g6" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#f472b6" /><stop offset="100%" stopColor="#818cf8" /></linearGradient></defs>
                <path d="M10 6 L8 16" /><path d="M22 6 L24 16" />
                <path d="M14 10 C14 10 14 16 14 18" /><path d="M18 10 C18 10 18 16 18 18" />
                <path d="M6 18 C6 24 10 28 16 28 C22 28 26 24 26 18" />
            </g>
        ),
    },
    {
        id: 'open_palm',
        label: 'Open Palm',
        icon: glyph(
            <g stroke="url(#g7)" strokeWidth="1.8" strokeLinecap="round">
                <defs><linearGradient id="g7" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#818cf8" /></linearGradient></defs>
                <path d="M8 20 V12" /><path d="M12 20 V8" /><path d="M16 20 V6" /><path d="M20 20 V8" /><path d="M24 20 V12" />
                <path d="M6 20 C6 26 10 29 16 29 C22 29 26 26 26 20" />
            </g>
        ),
    },
    {
        id: 'point_left',
        label: 'Point Left',
        icon: glyph(
            <g stroke="url(#g8)" strokeWidth="1.8" strokeLinecap="round">
                <defs><linearGradient id="g8" x1="32" y1="0" x2="0" y2="32"><stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="#22d3ee" /></linearGradient></defs>
                <path d="M4 16 H18" /><polyline points="10,11 4,16 10,21" />
                <path d="M20 10 C22 10 24 12 24 14 L24 18 C24 20 22 22 20 22 L18 22 L18 10 Z" />
            </g>
        ),
    },
    {
        id: 'point_right',
        label: 'Point Right',
        icon: glyph(
            <g stroke="url(#g9)" strokeWidth="1.8" strokeLinecap="round">
                <defs><linearGradient id="g9" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="#22d3ee" /></linearGradient></defs>
                <path d="M28 16 H14" /><polyline points="22,11 28,16 22,21" />
                <path d="M12 10 C10 10 8 12 8 14 L8 18 C8 20 10 22 12 22 L14 22 L14 10 Z" />
            </g>
        ),
    },
    {
        id: 'point_up',
        label: 'Point Up',
        icon: glyph(
            <g stroke="url(#g10)" strokeWidth="1.8" strokeLinecap="round">
                <defs><linearGradient id="g10" x1="0" y1="32" x2="32" y2="0"><stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="#c084fc" /></linearGradient></defs>
                <path d="M16 4 V20" /><polyline points="11,10 16,4 21,10" />
                <path d="M10 22 C10 24 12 26 14 26 L18 26 C20 26 22 24 22 22 L22 20 L10 20 Z" />
            </g>
        ),
    },
    {
        id: 'fist',
        label: 'Fist',
        icon: glyph(
            <g stroke="url(#g11)" strokeWidth="1.8" strokeLinecap="round">
                <defs><linearGradient id="g11" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#fb923c" /><stop offset="100%" stopColor="#818cf8" /></linearGradient></defs>
                <rect x="8" y="8" width="16" height="14" rx="5" />
                <line x1="12" y1="12" x2="12" y2="18" /><line x1="16" y1="11" x2="16" y2="18" /><line x1="20" y1="12" x2="20" y2="18" />
                <path d="M10 22 C10 26 12 28 16 28 C20 28 22 26 22 22" />
            </g>
        ),
    },
    {
        id: 'pinch',
        label: 'Pinch',
        icon: glyph(
            <g stroke="url(#g12)" strokeWidth="1.8" strokeLinecap="round">
                <defs><linearGradient id="g12" x1="0" y1="0" x2="32" y2="32"><stop offset="0%" stopColor="#e879f9" /><stop offset="100%" stopColor="#818cf8" /></linearGradient></defs>
                <path d="M10 10 L15 16" /><path d="M22 10 L17 16" />
                <circle cx="16" cy="17" r="2" fill="currentColor" stroke="none" opacity="0.5" />
                <path d="M8 22 C8 26 12 28 16 28 C20 28 24 26 24 22 L24 20 L8 20 Z" />
            </g>
        ),
    },
];

// Helper to get a gesture icon by id, with fallback
export function getGestureIcon(iconId: string): ReactNode {
    const found = GESTURE_ICONS.find(g => g.id === iconId);
    return found?.icon ?? GESTURE_ICONS[0].icon;
}

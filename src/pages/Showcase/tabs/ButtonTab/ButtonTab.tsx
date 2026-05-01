import { useState } from 'react';
import Button from '@src/components/controls/Button';

export default function ButtonTab() {
  const [clickLog, setClickLog] = useState<string[]>([]);

  function log(label: string) {
    setClickLog((prev) => [`Clicked: "${label}"`, ...prev].slice(0, 5));
  }

  return (
    <div className='flex flex-col gap-8 w-full'>
      {/* ── 1. Default ─────────────────────────────────────────────────────── */}
      <section className='flex flex-col gap-2'>
        <p className='text-sm font-semibold text-white/50 uppercase tracking-wider'>Default</p>
        <p className='text-xs text-white/40'>A standard button with default styling.</p>
        <div className='flex flex-wrap gap-3'>
          <Button onClick={() => log('Default')}>Default Button</Button>
        </div>
      </section>

      {/* ── 2. Focus state ─────────────────────────────────────────────────── */}
      <section className='flex flex-col gap-2'>
        <p className='text-sm font-semibold text-white/50 uppercase tracking-wider'>Focus state</p>
        <p className='text-xs text-white/40'>
          Press <kbd className='px-1 py-0.5 rounded border border-white/20 text-white/60 font-sans'>Tab</kbd> to
          keyboard-focus the button and see the focus ring. The ring only appears on keyboard / programmatic focus (uses{' '}
          <code>:focus-visible</code>), not on mouse clicks.
        </p>
        <div className='flex flex-wrap gap-3'>
          <Button onClick={() => log('Focus demo A')}>Focus Me (Tab here)</Button>
          <Button onClick={() => log('Focus demo B')}>Then Tab to Me</Button>
        </div>
      </section>

      {/* ── 3. Disabled ────────────────────────────────────────────────────── */}
      <section className='flex flex-col gap-2'>
        <p className='text-sm font-semibold text-white/50 uppercase tracking-wider'>Disabled</p>
        <p className='text-xs text-white/40'>
          Pass the <code>disabled</code> prop. The button becomes non-interactive and renders at 50% opacity.
        </p>
        <div className='flex flex-wrap gap-3'>
          <Button onClick={() => log('Disabled')} disabled>
            Disabled Button
          </Button>
          <Button onClick={() => log('Enabled')}>Enabled Button</Button>
        </div>
      </section>

      {/* ── 4. Custom colours via className ────────────────────────────────── */}
      <section className='flex flex-col gap-2'>
        <p className='text-sm font-semibold text-white/50 uppercase tracking-wider'>Custom colours</p>
        <p className='text-xs text-white/40'>
          Override background and hover colours with Tailwind classes via the <code>className</code> prop.
        </p>
        <div className='flex flex-wrap gap-3'>
          <Button onClick={() => log('Primary')} className='bg-blue-600 hover:bg-blue-500 active:bg-blue-700'>
            Primary
          </Button>
          <Button onClick={() => log('Success')} className='bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700'>
            Success
          </Button>
          <Button onClick={() => log('Warning')} className='bg-amber-500 hover:bg-amber-400 active:bg-amber-600'>
            Warning
          </Button>
          <Button onClick={() => log('Danger')} className='bg-red-600 hover:bg-red-500 active:bg-red-700'>
            Danger
          </Button>
          <Button onClick={() => log('Neutral')} className='bg-zinc-600 hover:bg-zinc-500 active:bg-zinc-700'>
            Neutral
          </Button>
        </div>
      </section>

      {/* ── 5. CSS variable overrides ──────────────────────────────────────── */}
      <section className='flex flex-col gap-2'>
        <p className='text-sm font-semibold text-white/50 uppercase tracking-wider'>CSS variable overrides</p>
        <p className='text-xs text-white/40'>
          Every visual token is a CSS variable (e.g. <code>--btn-bg-color-hover</code>,{' '}
          <code>--btn-ring-color-focus</code>). You can override them on a parent scope to re-theme a group of buttons
          without touching <code>className</code>.
        </p>
        <div className='flex flex-wrap gap-3 p-4 rounded-lg border border-white/10'>
          <Button onClick={() => log('Violet A')}>Violet A</Button>
          <Button onClick={() => log('Violet B')}>Violet B</Button>
          <Button onClick={() => log('Violet C')}>Violet C</Button>
        </div>
      </section>

      {/* ── 6. Click log ───────────────────────────────────────────────────── */}
      {clickLog.length > 0 && (
        <section className='flex flex-col gap-2'>
          <p className='text-sm font-semibold text-white/50 uppercase tracking-wider'>Click log</p>
          <ul className='flex flex-col gap-1'>
            {clickLog.map((entry, i) => (
              <li key={i} className='text-xs text-white/60 font-mono'>
                {entry}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

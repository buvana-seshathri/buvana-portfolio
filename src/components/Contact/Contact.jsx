import { useRef, useState } from 'react';
import { site } from '../../content/site.js';
import { Heart, Sparkle } from '../Plush/Plush.jsx';
import usePointerVars from '../../hooks/usePointerVars.js';
import './Contact.css';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX = 2000;

// ---------- the little icons on the stamps ----------
const ICONS = {
  linkedin: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="currentColor" />
      <path d="M7 10v7M7 7v.01M11 17v-7M11 13c0-2 1.2-3 2.7-3S16.5 11 16.5 13v4" stroke="var(--stamp-cut)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="3" fill="currentColor" />
      <path d="M4 7l8 6 8-6" stroke="var(--stamp-cut)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
};

// A postage stamp with perforated edges. It leans in 3D toward the cursor, and on hover a postmark lands
// on it. LinkedIn and GitHub open in a new tab; the email stamp copies the address.
function Stamp({ stamp, i, email }) {
  const [copied, setCopied] = useState(false);
  const isEmail = stamp.id === 'email';
  const href = isEmail ? null : stamp.href;
  const off = isEmail ? !email : !href;

  const lean = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--sx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    e.currentTarget.style.setProperty('--sy', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };
  const rest = (e) => {
    e.currentTarget.style.setProperty('--sx', 0);
    e.currentTarget.style.setProperty('--sy', 0);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  const inner = (
    <>
      <span className="stamp__paper">
        <span className="stamp__art">
          <span className="stamp__icon">{ICONS[stamp.id]}</span>
          <span className="stamp__value">{String(i + 1).padStart(2, '0')}</span>
        </span>
        <span className="stamp__name">{stamp.label}</span>
        <span className="stamp__note">{off ? 'soon' : copied ? 'copied!' : stamp.note}</span>
      </span>
      {/* the postmark that lands on hover */}
      <svg className="stamp__mark" viewBox="0 0 120 60" aria-hidden="true">
        <circle cx="30" cy="30" r="22" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="30" cy="30" r="16" fill="none" stroke="currentColor" strokeWidth="1" />
        <text x="30" y="27" textAnchor="middle" fontSize="7" fontWeight="700" fill="currentColor" fontFamily="ui-monospace, monospace">{copied ? 'COPIED' : 'SENT'}</text>
        <text x="30" y="37" textAnchor="middle" fontSize="6" fill="currentColor" fontFamily="ui-monospace, monospace">2026</text>
        <path d="M56 20q8-6 16 0t16 0 16 0M56 30q8-6 16 0t16 0 16 0M56 40q8-6 16 0t16 0 16 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </>
  );

  const common = {
    className: `stamp stamp--${stamp.id}${off ? ' is-off' : ''}${copied ? ' is-copied' : ''}`,
    style: { '--i': i },
    onPointerMove: lean,
    onPointerLeave: rest,
  };
  if (off) return <span {...common} aria-label={`${stamp.label}: coming soon`}>{inner}</span>;
  if (isEmail) return <button type="button" {...common} onClick={copy} aria-label={copied ? 'Email copied' : `Copy my email address, ${email}`}>{inner}</button>;
  return <a {...common} href={href} target="_blank" rel="noreferrer" aria-label={`${stamp.label} (opens in a new tab)`}>{inner}</a>;
}

// The Contact page, a blue page: a slowly moving aurora in blues and "hello" in many languages scrolling
// along a thin band at the bottom (always moving).
// Left: the heading, glass tiles (open to new roles, resume) and postage stamps for
// LinkedIn, GitHub and email. Right: a letter. "seal & send" folds it into an envelope, a wax seal pops on,
// and it flies off; then a postcard says it's delivered. It's emailed to Buvana through Web3Forms
// (site.contact.web3formsKey).
export default function Contact() {
  const c = site.contact;
  const rootRef = useRef(null);
  const envRef = useRef(null);
  usePointerVars(rootRef); // --px / --py, so the letter leans toward the cursor

  const empty = { name: '', email: '', topic: c.topics[0], message: '', botcheck: '' };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [phase, setPhase] = useState('write'); // write | fold | fly | sent | error
  const [how, setHow] = useState('sent'); // sent | mailto
  const [shake, setShake] = useState(0);

  const set = (k) => (e) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, [k]: k === 'message' ? v.slice(0, MAX) : v }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: null }));
  };

  const deliver = async (f) => {
    const subject = `A letter from ${f.name} (${f.topic})`;
    if (c.web3formsKey) {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: c.web3formsKey,
          subject,
          from_name: 'buvana portfolio',
          name: f.name,
          email: f.email,
          topic: f.topic,
          message: f.message,
          botcheck: f.botcheck,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || 'not sent');
      return 'sent';
    }
    if (c.email) {
      // not connected to Web3Forms yet: hand the letter to the visitor's own email app
      const body = `${f.message}\n\n${f.name}\n${f.email}`;
      window.location.href = `mailto:${c.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return 'mailto';
    }
    throw new Error('not connected');
  };

  const submit = async (e) => {
    e.preventDefault();
    if (phase === 'fold' || phase === 'fly') return;
    const errs = {};
    if (!form.name.trim()) errs.name = 'who should I say hi to?';
    if (!EMAIL_RE.test(form.email.trim())) errs.email = "I'll need this to write back";
    if (form.message.trim().length < 2) errs.message = 'the letter is still blank';
    if (Object.keys(errs).length) {
      setErrors(errs);
      setShake((n) => n + 1);
      return;
    }
    if (form.botcheck) return; // a bot filled the hidden field

    const quick = reduced();
    setPhase('fold');
    try {
      const [result] = await Promise.all([deliver({ ...form, name: form.name.trim(), email: form.email.trim() }), wait(quick ? 0 : 1950)]);
      setHow(result);
      setPhase('fly');
      await wait(quick ? 0 : 950);
      setPhase('sent');
    } catch {
      setPhase('error');
    }
  };

  const again = () => {
    setForm(empty);
    setErrors({});
    setPhase('write');
  };

  const busy = phase === 'fold' || phase === 'fly';
  const writing = phase === 'write' || phase === 'error' || busy;

  return (
    <section className="contact" ref={rootRef} aria-labelledby="contact-heading">
      {/* the always-moving background: aurora color fields in blues, fine grain */}
      <div className="aurora" aria-hidden="true">
        <i /><i /><i /><i />
      </div>

      <div className="contact__wrap">
        {/* ---------- left: heading, the stamps and the mailbox ---------- */}
        <div className="contact__intro">
          <h2 id="contact-heading" className="contact__heading rise" style={{ '--d': '0.05s' }}>{c.heading}</h2>
          <p className="contact__lede rise" style={{ '--d': '0.12s' }}>{c.lede}</p>

          {/* glass tiles */}
          <div className="contact__tiles rise" style={{ '--d': '0.2s' }}>
            <div className="tile">
              <span className="tile__key">status</span>
              <span className="tile__val"><i className="tile__live" aria-hidden="true" />{c.status}</span>
            </div>
            <a className="tile tile--link" href={c.resume} target="_blank" rel="noreferrer">
              <span className="tile__key">resume</span>
              <span className="tile__val">open pdf <span aria-hidden="true">↗</span></span>
            </a>
          </div>

          <div className="contact__elsewhere rise" style={{ '--d': '0.3s' }}>
            <p className="contact__label">{c.elsewhere}</p>
            <div className="contact__stamps">
              {c.stamps.map((s, i) => <Stamp key={s.id} stamp={s} i={i} email={c.email} />)}
            </div>
          </div>
        </div>

        {/* ---------- right: the letter ---------- */}
        <div className={`contact__desk rise is-${phase}`} style={{ '--d': '0.2s' }}>
          {writing && (
            <form
              key={`letter-${shake}`}
              className={`letter${shake ? ' is-shaking' : ''}`}
              onSubmit={submit}
              noValidate
              aria-label="Write me a letter"
              aria-busy={busy}
            >
              <span className="letter__fold" aria-hidden="true" />
              <header className="letter__head">
                <span className="letter__to">
                  <span className="letter__key">To</span>
                  <span className="letter__chip"><i aria-hidden="true">b</i>{c.to}</span>
                </span>
                <span className={`letter__stamp${busy ? ' is-stamped' : ''}`} aria-hidden="true">
                  <Sparkle />
                </span>
              </header>

              <label className={`letter__line${errors.name ? ' has-error' : ''}`}>
                <span className="letter__key">From</span>
                <input type="text" name="name" autoComplete="name" placeholder="your name" value={form.name} onChange={set('name')} disabled={busy} aria-invalid={!!errors.name} />
                {errors.name && <small className="letter__err" role="alert">{errors.name}</small>}
              </label>
              <label className={`letter__line${errors.email ? ' has-error' : ''}`}>
                <span className="letter__key">Reply to</span>
                <input type="email" name="email" autoComplete="email" placeholder="you@somewhere.com" value={form.email} onChange={set('email')} disabled={busy} aria-invalid={!!errors.email} />
                {errors.email && <small className="letter__err" role="alert">{errors.email}</small>}
              </label>

              <fieldset className="letter__topics" disabled={busy}>
                <legend className="letter__key">About</legend>
                <div>
                  {c.topics.map((t) => (
                    <label key={t} className={`chip${form.topic === t ? ' is-on' : ''}`}>
                      <input type="radio" name="topic" value={t} checked={form.topic === t} onChange={set('topic')} />
                      <span className="chip__tick" aria-hidden="true">✓</span>
                      {t}
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className={`letter__body${errors.message ? ' has-error' : ''}`}>
                <span className="contact__sr">Your message</span>
                <textarea
                  name="message"
                  rows={6}
                  placeholder={c.placeholder}
                  value={form.message}
                  onChange={set('message')}
                  disabled={busy}
                  aria-invalid={!!errors.message}
                  data-pager-ignore=""
                />
                {errors.message && <small className="letter__err" role="alert">{errors.message}</small>}
              </label>

              {/* a field people can't see: bots fill it in, so letters with it are dropped */}
              <input className="letter__trap" type="text" name="botcheck" tabIndex={-1} autoComplete="off" value={form.botcheck} onChange={set('botcheck')} aria-hidden="true" />

              <footer className="letter__foot">
                <span className="letter__count">{form.message.length} / {MAX}</span>
                <button type="submit" className="letter__send" disabled={busy}>
                  <span className="letter__seal" aria-hidden="true"><Sparkle /></span>
                  {busy ? 'sealing…' : c.send}
                </button>
              </footer>

              {phase === 'error' && (
                <p className="letter__oops" role="alert">
                  {c.error}{' '}
                  {c.email && <a href={`mailto:${c.email}`}>{c.email}</a>}
                </p>
              )}
            </form>
          )}

          {/* the envelope the letter folds into, then flies off to the mailbox */}
          {busy && (
            <div className="envelope" ref={envRef} aria-hidden="true">
              <span className="envelope__lift">
                <span className="envelope__body">
                  <span className="envelope__back" />
                  <span className="envelope__paper" />
                  <span className="envelope__front" />
                  <span className="envelope__flap" />
                  <span className="envelope__seal"><Sparkle /></span>
                </span>
              </span>
            </div>
          )}

          {phase === 'sent' && (
            <div className="postcard" role="status">
              <span className="postcard__stamp" aria-hidden="true"><Sparkle /></span>
              <p className="postcard__title">{how === 'mailto' ? 'almost there!' : c.sent.title}</p>
              <p className="postcard__body">
                {how === 'mailto' ? 'Your email app has the letter ready. Just press send and it’s on its way to me.' : c.sent.body}
              </p>
              <p className="postcard__sig">{c.sent.signature} <Heart /></p>
              <button type="button" className="postcard__again" onClick={again}>{c.sent.again}</button>
            </div>
          )}
        </div>
      </div>

      {/* "hello" in many languages, drifting along the bottom forever */}
      <div className="hellos" aria-hidden="true">
        <div className="hellos__track">
          {[0, 1].map((k) => (
            <span key={k} className="hellos__set">
              {c.hellos.map((h) => <span key={h}>{h}<i>✦</i></span>)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

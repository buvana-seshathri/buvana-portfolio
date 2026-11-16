import { previewFor } from './glow.js';

// The wallpaper: a nature photo drifting very slowly (or, without photos, drifting color fields), fine grain,
// a tint from the app in front, and the page's name ("PROJECTS") in big faded block capitals.
export default function Wallpaper({ wp, word, tint, center, receded }) {
  return (
    <div
      className={`os-wall${wp.photo ? ' has-photo' : ''}${receded ? ' is-receded' : ''}`}
      aria-hidden="true"
      style={{
        '--wb': wp.base,
        '--b1': wp.blobs[0], '--b2': wp.blobs[1], '--b3': wp.blobs[2], '--b4': wp.blobs[3],
        '--t1': wp.text[0], '--t2': wp.text[1], '--t3': wp.text[2],
        '--tint': tint || 'transparent',
      }}
    >
      <i className="os-wall__blob os-wall__blob--1" />
      <i className="os-wall__blob os-wall__blob--2" />
      <i className="os-wall__blob os-wall__blob--3" />
      <i className="os-wall__blob os-wall__blob--4" />
      {wp.photo && (
        <i
          key={wp.photo}
          className="os-wall__photo"
          style={{ backgroundImage: [`url("${wp.photo}")`, previewFor(wp) && `url("${previewFor(wp)}")`].filter(Boolean).join(', ') }}
        />
      )}
      {wp.photo ? <i className="os-wall__shade" /> : <i className="os-wall__dots" />}
      <i className={`os-wall__tint${tint ? ' is-on' : ''}`} />
      <div className="os-word" style={{ left: center.x, top: center.y }}>
        <span className="os-word__main">{word}</span>
      </div>
      <i className="os-wall__grain" />
      {wp.credit && <span key={wp.credit} className="os-wall__credit">{wp.credit}</span>}
    </div>
  );
}

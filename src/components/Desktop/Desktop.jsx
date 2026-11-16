import { useRef } from 'react';
import OS from './os/OS.jsx';
import Room, { Desk } from './Room.jsx';
import './Desktop.css';

// The Projects page: a monitor on a walnut desk against an oak slat wall in late-afternoon light. The desktop (buvana os) runs on the monitor; LED strips behind it light up the wall
// in the colors of what's on screen (the OS writes --led-top / --led-left / --led-right / --led-bottom here).
export default function Desktop({ active, current }) {
  const sceneRef = useRef(null);
  return (
    <section className="rig" ref={sceneRef} aria-label="Projects: a desktop running on a monitor" data-led="off">
      <Room />

      <div className="rig__setup">
        <div className="rig__monitor">
          <div className="rig__bezel">
            <div className="rig__screen" data-own-cursor="">
              <OS active={active} current={current} sceneRef={sceneRef} />
            </div>
            <i className="rig__glare" aria-hidden="true" />
          </div>
          <div className="rig__chin" aria-hidden="true">
            <span className="rig__brand">bs</span>
            <i className="rig__power" />
          </div>
        </div>
        <div className="rig__stand" aria-hidden="true">
          <i className="rig__neck" />
          <i className="rig__base" />
        </div>
      </div>

      <Desk />
    </section>
  );
}

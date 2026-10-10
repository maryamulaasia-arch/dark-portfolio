// On compact layouts cards follow their content height. Recalculate only the
// decorative SVG coordinates so chamfers/notches stay 45° instead of stretching.
// Original SVG attributes are restored verbatim when returning to desktop.
const compact = window.matchMedia('(max-width: 700px)');
const frames = [...document.querySelectorAll<SVGSVGElement>(
  '.notchbox__frame, .pcard__frame, .hexcard__frame, .flowbox__frame',
)].map(svg => ({
  svg,
  box: svg.parentElement!,
  path: svg.querySelector('path')!,
  viewBox: svg.getAttribute('viewBox')!,
  d: svg.querySelector('path')!.getAttribute('d')!,
  changed: false,
}));
function restore(frame: typeof frames[number]) {
  if (!frame.changed) return;
  frame.svg.setAttribute('viewBox', frame.viewBox);
  frame.path.setAttribute('d', frame.d);
  frame.changed = false;
}
function draw(frame: typeof frames[number]) {
  if (!compact.matches) {
    restore(frame);
    return;
  }
  const { width: w, height: h } = frame.box.getBoundingClientRect();
  if (!w || !h) return;
  const cut = 24, depth = 20, y = h - depth - 1;
  let d: string;
  if (frame.svg.matches('.hexcard__frame, .flowbox__frame')) {
    d = `M1 1 H${w-cut} L${w-1} ${cut} V${h-1} H${cut} L1 ${h-cut} Z`;
  } else {
    const first = frame.svg.classList.contains('pcard__frame') ? .22 : .1;
    d = `M${cut} 1 H${w-1} V${y} H${w*.88} L${w*.88-depth} ${h-1} H${w*.49} L${w*.49-3} ${y} H${w*(first+.21)} L${w*(first+.21)-depth} ${h-1} H${w*first+3} L${w*first} ${y} H1 V${cut} Z`;
  }
  frame.svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  frame.path.setAttribute('d', d);
  frame.changed = true;
}
const resize = new ResizeObserver(entries => {
  for (const entry of entries) {
    const frame = frames.find(frame => frame.box === entry.target);
    if (frame) draw(frame);
  }
});
function syncFrames() {
  resize.disconnect();
  for (const frame of frames) {
    if (compact.matches) { draw(frame); resize.observe(frame.box); }
    else restore(frame);
  }
}
compact.addEventListener('change', syncFrames);
syncFrames();

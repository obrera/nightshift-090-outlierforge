import { getOutlierforgeTrait, type OutlierforgeSelection } from './outlierforge-catalog'

export function renderOutlierforgeSvg(selection: OutlierforgeSelection) {
  const body = getOutlierforgeTrait('body', selection.body)
  const headgear = getOutlierforgeTrait('headgear', selection.headgear)
  const armor = getOutlierforgeTrait('armor', selection.armor)
  const weapon = getOutlierforgeTrait('weapon', selection.weapon)
  const companion = getOutlierforgeTrait('companion', selection.companion)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1500" role="img">
  <rect width="1200" height="1500" fill="#07070a"/>
  <path d="M80 1120H1120M130 1180H1070M190 1240H1010" stroke="#252735" stroke-width="8"/>
  <rect x="120" y="90" width="960" height="1260" rx="26" fill="#111218" stroke="#303444" stroke-width="4"/>
  <path d="M170 190H1030M170 1290H1030M250 140V1340M950 140V1340" stroke="#242838" stroke-width="3"/>
  <g opacity=".75">
    <circle cx="600" cy="555" r="365" fill="none" stroke="${body.accent}" stroke-width="14"/>
    <circle cx="600" cy="555" r="278" fill="none" stroke="${companion.accent}" stroke-width="5" stroke-dasharray="18 24"/>
  </g>
  <g transform="translate(600 635)">
    <path d="M-160-60h320l72 420h-464z" fill="#171923" stroke="${armor.accent}" stroke-width="14"/>
    <path d="M-90-20h180l48 260h-276z" fill="${armor.accent}" opacity=".16"/>
    <path d="M-118-244h236l62 74-44 120h-272l-44-120z" fill="#181a24" stroke="${body.accent}" stroke-width="12"/>
    <rect x="-92" y="-174" width="184" height="48" fill="${headgear.accent}"/>
    <path d="M-138-255h276l-58-72h-160z" fill="${headgear.accent}" opacity=".86"/>
    <path d="M-250 78l-126 340M250 78l126 340" stroke="${weapon.accent}" stroke-width="36" stroke-linecap="square"/>
    <path d="M270-80l230-178 54 68-220 198z" fill="${weapon.accent}"/>
    <circle cx="340" cy="-260" r="34" fill="#07070a" stroke="${companion.accent}" stroke-width="14"/>
    <path d="M-52 72h104M-72 152H72M-46 230h92" stroke="#f6f7fb" stroke-opacity=".74" stroke-width="12"/>
  </g>
  <text x="170" y="155" fill="#f8fafc" font-family="Roboto,Arial,sans-serif" font-size="44" font-weight="800">OUTLIERFORGE 090</text>
  <text x="170" y="1248" fill="${body.accent}" font-family="Roboto,Arial,sans-serif" font-size="64" font-weight="900">${escapeXml(body.label)}</text>
  <text x="170" y="1312" fill="#d8d8e1" font-family="Roboto,Arial,sans-serif" font-size="34">${escapeXml(weapon.label)} / ${escapeXml(companion.label)}</text>
</svg>`
}

function escapeXml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

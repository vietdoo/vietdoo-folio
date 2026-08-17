from pathlib import Path

OUT = Path('/home/ubuntu/vietdoo-folio/public/blog')

COLORS = {
    'paper': '#f8f4e9',
    'ink': '#172535',
    'navy': '#203e5f',
    'teal': '#3b8f8b',
    'mustard': '#d9a441',
    'coral': '#d76b58',
    'blue': '#7fb4c8',
    'muted': '#d8d1bd',
}


def svg(title, subtitle, body):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc">
  <title id="title">{title}</title><desc id="desc">{subtitle}</desc>
  <defs>
    <filter id="wobble" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="7" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.7"/>
    </filter>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="12" stdDeviation="8" flood-color="#172535" flood-opacity=".16"/></filter>
    <style>
      .ink{{stroke:{COLORS['ink']};stroke-width:7;stroke-linecap:round;stroke-linejoin:round;}}
      .thin{{stroke:{COLORS['ink']};stroke-width:4;stroke-linecap:round;stroke-linejoin:round;}}
      .label{{font-family:ui-sans-serif,system-ui,sans-serif;fill:{COLORS['ink']};font-weight:800;letter-spacing:.5px}}
      .small{{font-family:ui-sans-serif,system-ui,sans-serif;fill:{COLORS['ink']};font-size:25px;font-weight:600}}
      .arrow{{fill:none;stroke:{COLORS['ink']};stroke-width:7;stroke-linecap:round;stroke-linejoin:round;marker-end:url(#arrowhead)}}
    </style>
    <marker id="arrowhead" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="{COLORS['ink']}"/></marker>
  </defs>
  <rect width="1600" height="900" fill="{COLORS['paper']}"/>
  <path d="M0 120 C300 75 530 145 820 98 S1320 105 1600 75" fill="none" stroke="{COLORS['muted']}" stroke-width="18" opacity=".55"/>
  <path d="M30 820 C360 770 640 850 930 800 S1330 835 1570 775" fill="none" stroke="{COLORS['muted']}" stroke-width="14" opacity=".45"/>
  <g filter="url(#wobble)">{body}</g>
</svg>'''


def card(x, y, w, h, fill, label, accent=None):
    accent = accent or COLORS['ink']
    return f'''<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="28" fill="{fill}" class="ink" filter="url(#shadow)"/>
    <path d="M{x+28} {y+38} Q{x+w/2} {y+18} {x+w-30} {y+42}" fill="none" stroke="{accent}" stroke-width="7" opacity=".8"/>
    <text x="{x+w/2}" y="{y+h/2+12}" text-anchor="middle" class="label" font-size="31">{label}</text>'''


def arrow(x1, y1, x2, y2):
    return f'<path d="M{x1} {y1} C{(x1+x2)/2-40} {(y1+y2)/2-45} {(x1+x2)/2+40} {(y1+y2)/2+45} {x2} {y2}" class="arrow"/>'


def save(rel, title, subtitle, body):
    path = OUT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(svg(title, subtitle, body), encoding='utf-8')

# Eval-driven assets
save('eval-driven-ai-system-design/hero.svg', 'Eval-driven AI systems', 'A golden set flows through traces and release gates to measurable outcomes.',
     card(90, 330, 260, 190, COLORS['mustard'], 'GOLDEN SET', COLORS['coral']) +
     arrow(360, 425, 520, 425) +
     card(560, 280, 260, 290, COLORS['blue'], 'TRACE', COLORS['teal']) +
     arrow(830, 425, 990, 425) +
     card(1030, 330, 260, 190, COLORS['teal'], 'RELEASE GATE', COLORS['mustard']) +
     arrow(1300, 425, 1460, 425) +
     card(1330, 610, 210, 120, COLORS['coral'], 'OUTCOME', COLORS['mustard']) +
     '<path d="M700 230 q30 -80 70 0 q30 80 70 0" fill="none" class="thin"/><circle cx="700" cy="230" r="18" fill="'+COLORS['coral']+'" class="thin"/><circle cx="840" cy="230" r="18" fill="'+COLORS['mustard']+'" class="thin"/>')

save('eval-driven-ai-system-design/capability-regression.svg', 'Capability versus regression', 'One lane explores what the system can learn; the other protects committed behavior.',
     '<path d="M240 690 L240 270" class="ink"/><path d="M240 690 L1360 690" class="ink"/>' +
     '<path d="M300 610 C500 530 510 430 700 420 S900 260 1150 300" fill="none" stroke="'+COLORS['teal']+'" stroke-width="22"/>' +
     '<path d="M300 600 C500 610 650 590 820 600 S1100 570 1320 600" fill="none" stroke="'+COLORS['coral']+'" stroke-width="22"/>' +
     '<text x="420" y="340" class="label" font-size="40">CAPABILITY</text><text x="900" y="660" class="label" font-size="40">REGRESSION</text>' +
     '<path d="M510 465 l32 32 65 -80 M895 565 l32 32 65 -80" fill="none" class="ink"/>')

save('eval-driven-ai-system-design/kpi-bridge.svg', 'From trace to business outcome', 'Technical evidence becomes operational evidence and then a measurable business observation.',
     card(110, 365, 270, 180, COLORS['blue'], 'TRACE', COLORS['teal']) + arrow(400, 455, 610, 455) +
     card(650, 365, 270, 180, COLORS['mustard'], 'REVIEW', COLORS['coral']) + arrow(940, 455, 1150, 455) +
     card(1190, 365, 300, 180, COLORS['teal'], 'OUTCOME', COLORS['mustard']) +
     '<circle cx="500" cy="245" r="50" fill="'+COLORS['coral']+'" class="ink"/><path d="M475 245 l18 18 35 -40" fill="none" class="ink"/><circle cx="1040" cy="660" r="50" fill="'+COLORS['mustard']+'" class="ink"/><path d="M1015 660 l18 18 35 -40" fill="none" class="ink"/>')

save('eval-driven-ai-system-design/release-gate-matrix.svg', 'Risk-aware release gates', 'Hard failures, quality thresholds, and review paths vary by risk tier.',
     '<path d="M270 240 L270 700 L1370 700" class="ink"/>' +
     '<path d="M270 540 L1370 540 M270 390 L1370 390" class="thin" opacity=".5"/>' +
     '<path d="M520 240 L520 700 M780 240 L780 700 M1040 240 L1040 700" class="thin" opacity=".5"/>' +
     '<rect x="300" y="575" width="180" height="90" rx="20" fill="'+COLORS['teal']+'" class="ink"/><rect x="560" y="425" width="180" height="240" rx="20" fill="'+COLORS['mustard']+'" class="ink"/><rect x="820" y="300" width="180" height="365" rx="20" fill="'+COLORS['coral']+'" class="ink"/><rect x="1080" y="250" width="180" height="415" rx="20" fill="'+COLORS['navy']+'" class="ink"/>' +
     '<text x="310" y="205" class="label" font-size="33">LOW</text><text x="570" y="205" class="label" font-size="33">MEDIUM</text><text x="830" y="205" class="label" font-size="33">HIGH</text><text x="1090" y="205" class="label" font-size="33" fill="'+COLORS['navy']+'">CRITICAL</text>')

# Temporal RAG assets
save('temporal-rag-time-aware-retrieval/hero.svg', 'Temporal RAG', 'Evidence is filtered by the time it was valid before semantic ranking.',
     '<path d="M160 500 C420 430 650 540 880 450 S1260 430 1450 500" fill="none" stroke="'+COLORS['ink']+'" stroke-width="12"/>' +
     '<circle cx="350" cy="500" r="38" fill="'+COLORS['mustard']+'" class="ink"/><circle cx="780" cy="480" r="38" fill="'+COLORS['teal']+'" class="ink"/><circle cx="1200" cy="470" r="38" fill="'+COLORS['coral']+'" class="ink"/>' +
     card(225, 250, 250, 125, COLORS['mustard'], 'THEN', COLORS['coral']) + card(660, 220, 250, 125, COLORS['teal'], 'NOW', COLORS['mustard']) + card(1080, 250, 300, 125, COLORS['blue'], 'ANSWER WITH DATE', COLORS['teal']) +
     arrow(350, 410, 780, 410) + arrow(820, 410, 1200, 410) +
     '<path d="M280 620 q90 -130 180 0 M710 610 q90 -150 180 0 M1110 600 q120 -150 240 0" fill="none" class="thin"/>')

save('temporal-rag-time-aware-retrieval/pipeline.svg', 'Time-aware retrieval pipeline', 'Planner, temporal filter, semantic ranker, contradiction checker, and generator.',
     card(70, 350, 250, 170, COLORS['blue'], 'PLAN TIME', COLORS['teal']) + arrow(340, 435, 500, 435) +
     card(540, 350, 250, 170, COLORS['mustard'], 'FILTER', COLORS['coral']) + arrow(810, 435, 970, 435) +
     card(1010, 350, 250, 170, COLORS['teal'], 'RANK', COLORS['mustard']) + arrow(1280, 435, 1460, 435) +
     '<circle cx="855" cy="650" r="85" fill="'+COLORS['coral']+'" class="ink"/><path d="M820 650 l25 25 50 -60" fill="none" class="ink"/><text x="855" y="770" text-anchor="middle" class="label" font-size="32">CONFLICT CHECK</text>')

save('temporal-rag-time-aware-retrieval/benchmark.svg', 'Temporal benchmark', 'Historical cases test reference time, valid evidence, corrections, and uncertainty.',
     '<path d="M180 620 L1420 620" class="ink"/><path d="M330 590 L330 650 M680 590 L680 650 M1030 590 L1030 650 M1330 590 L1330 650" class="ink"/>' +
     '<rect x="230" y="360" width="250" height="120" rx="24" fill="'+COLORS['mustard']+'" class="ink"/><rect x="540" y="300" width="300" height="150" rx="24" fill="'+COLORS['teal']+'" class="ink"/><rect x="900" y="390" width="250" height="120" rx="24" fill="'+COLORS['coral']+'" class="ink"/><rect x="1200" y="300" width="250" height="150" rx="24" fill="'+COLORS['blue']+'" class="ink"/>' +
     '<text x="355" y="430" text-anchor="middle" class="label" font-size="32">QUERY</text><text x="690" y="390" text-anchor="middle" class="label" font-size="32">VALID EVIDENCE</text><text x="1025" y="460" text-anchor="middle" class="label" font-size="32">CONFLICT</text><text x="1325" y="390" text-anchor="middle" class="label" font-size="32">ANSWER</text>' + arrow(480, 420, 540, 375) + arrow(840, 380, 900, 430) + arrow(1150, 430, 1200, 375))

# GenAI telemetry assets
save('genai-telemetry-opentelemetry-mcp/hero.svg', 'Portable GenAI telemetry', 'One semantic vocabulary crosses model, retrieval, MCP, tool, policy, and outcome boundaries.',
     '<circle cx="800" cy="450" r="120" fill="'+COLORS['mustard']+'" class="ink"/><text x="800" y="465" text-anchor="middle" class="label" font-size="36">AGENT</text>' +
     '<circle cx="330" cy="260" r="95" fill="'+COLORS['blue']+'" class="ink"/><text x="330" y="275" text-anchor="middle" class="label" font-size="30">MODEL</text>' +
     '<circle cx="1270" cy="260" r="95" fill="'+COLORS['teal']+'" class="ink"/><text x="1270" y="275" text-anchor="middle" class="label" font-size="30">MCP</text>' +
     '<circle cx="330" cy="650" r="95" fill="'+COLORS['coral']+'" class="ink"/><text x="330" y="665" text-anchor="middle" class="label" font-size="30">RETRIEVAL</text>' +
     '<circle cx="1270" cy="650" r="95" fill="'+COLORS['navy']+'" class="ink"/><text x="1270" y="665" text-anchor="middle" class="label" font-size="30" fill="'+COLORS['paper']+'">OUTCOME</text>' +
     '<path d="M410 290 Q620 380 680 410 M1190 290 Q980 380 920 410 M410 620 Q620 530 680 490 M1190 620 Q980 530 920 490" class="arrow"/>' +
     '<path d="M260 470 Q800 100 1340 470 Q800 800 260 470" fill="none" stroke="'+COLORS['ink']+'" stroke-width="5" stroke-dasharray="18 18"/>')

save('genai-telemetry-opentelemetry-mcp/execution-graph.svg', 'Execution graph', 'The trace follows the real distributed path of an agent turn.',
     card(80, 370, 190, 135, COLORS['blue'], 'REQUEST', COLORS['teal']) + arrow(285, 435, 390, 435) +
     card(420, 370, 190, 135, COLORS['mustard'], 'MODEL', COLORS['coral']) + arrow(625, 435, 730, 435) +
     card(760, 370, 190, 135, COLORS['teal'], 'MCP', COLORS['mustard']) + arrow(965, 435, 1070, 435) +
     card(1100, 370, 190, 135, COLORS['coral'], 'TOOL', COLORS['mustard']) + arrow(1305, 435, 1410, 435) +
     '<circle cx="800" cy="700" r="70" fill="'+COLORS['navy']+'" class="ink"/><text x="800" y="713" text-anchor="middle" class="label" font-size="27" fill="'+COLORS['paper']+'">POLICY</text><path d="M800 505 L800 625" class="arrow"/>')

save('genai-telemetry-opentelemetry-mcp/evidence-manifest.svg', 'Evidence manifest', 'Keep document identity, score, classification, and redaction state without copying raw content.',
     '<rect x="340" y="180" width="920" height="530" rx="36" fill="'+COLORS['paper']+'" class="ink" filter="url(#shadow)"/>' +
     '<path d="M430 300 L1170 300 M430 410 L1170 410 M430 520 L1170 520" class="thin"/>' +
     '<circle cx="450" cy="245" r="28" fill="'+COLORS['teal']+'" class="ink"/><text x="510" y="255" class="label" font-size="31">DOCUMENT ID</text>' +
     '<circle cx="450" cy="355" r="28" fill="'+COLORS['mustard']+'" class="ink"/><text x="510" y="365" class="label" font-size="31">SCORE + TIME</text>' +
     '<circle cx="450" cy="465" r="28" fill="'+COLORS['coral']+'" class="ink"/><text x="510" y="475" class="label" font-size="31">CLASSIFICATION</text>' +
     '<circle cx="450" cy="575" r="28" fill="'+COLORS['navy']+'" class="ink"/><text x="510" y="585" class="label" font-size="31">REDACTED CONTENT</text>' +
     '<path d="M1040 560 q70 -80 130 0" fill="none" class="thin"/><path d="M1090 540 l35 35 75 -90" fill="none" stroke="'+COLORS['teal']+'" stroke-width="14"/>')

print('Created doodle assets under', OUT)

import json
import os
import re
from bs4 import BeautifulSoup
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable,
    PageBreak, Table, TableStyle, KeepTogether, Frame,
    BaseDocTemplate, PageTemplate
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus.flowables import Flowable

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FONT_DIR = os.path.join(BASE_DIR, "fonts")

pdfmetrics.registerFont(TTFont("Pretendard",    os.path.join(FONT_DIR, "Pretendard-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Pretendard-B",  os.path.join(FONT_DIR, "Pretendard-Bold.ttf")))
pdfmetrics.registerFont(TTFont("Pretendard-SB", os.path.join(FONT_DIR, "Pretendard-SemiBold.ttf")))

R  = "Pretendard"
B  = "Pretendard-B"
SB = "Pretendard-SB"

PURPLE       = colors.HexColor("#7c6aff")
PURPLE_LIGHT = colors.HexColor("#ede9ff")
PURPLE_TEXT  = colors.HexColor("#5b4fcf")
DARK         = colors.HexColor("#1a1a2e")
GRAY         = colors.HexColor("#444444")
LIGHT_BG     = colors.HexColor("#f5f3ff")
CALLOUT_BG   = colors.HexColor("#1a1a2e")

def ps(name, font=R, size=9, color=GRAY, leading=15, **kw):
    return ParagraphStyle(name, fontName=font, fontSize=size, textColor=color,
                          leading=leading, **kw)

# Indentation levels (mm → points, 1mm ≈ 2.83pt)
L0 = 0        # company
L1 = 6        # section label (under project)
L2 = 14       # body text / subtitle (under section label)
L3 = 22       # bullet (under body/subtitle)
L4 = 32       # subbullet (under bullet)

S = {
    "cover_title":   ps("cover_title",   B,  28, colors.white,                   36, alignment=TA_CENTER),
    "cover_sub":     ps("cover_sub",     R,  12, colors.HexColor("#aaaacc"),      18, alignment=TA_CENTER, spaceAfter=6),
    "cover_sub2":    ps("cover_sub2",    R,  10, colors.HexColor("#aaaacc"),      16, alignment=TA_CENTER),
    "toc_company":   ps("toc_company",   B,  11, DARK,                            18, spaceBefore=10, spaceAfter=2),
    "toc_project":   ps("toc_project",   R,   9, GRAY,                            15, leftIndent=14, spaceAfter=2),
    "company":       ps("company",       B,  16, DARK,                            22, spaceAfter=6, spaceBefore=20),
    # project title style (used inside callout box)
    "project_title": ps("project_title", B,  14, colors.white,                   22, spaceAfter=2),
    "project_tag":   ps("project_tag",   R,   8, colors.HexColor("#c0b8ff"),      13, spaceAfter=0),
    "section_label": ps("section_label", SB,  9, PURPLE,                          14, spaceBefore=4, spaceAfter=3,
                        leftIndent=L1),
    "body":          ps("body",          R,   9, GRAY,                            15, spaceAfter=4,   leftIndent=L2),
    "subtitle":      ps("subtitle",      B,   9, DARK,                            15, spaceBefore=6,  spaceAfter=3, leftIndent=L2),
    "bullet":        ps("bullet",        R,   9, GRAY,                            15, spaceAfter=3,   leftIndent=L3, bulletIndent=L3-8),
    "subbullet":     ps("subbullet",     R,   8, GRAY,                            14, spaceAfter=2,   leftIndent=L4, bulletIndent=L4-8),
    "goal":          ps("goal",          R,   9, DARK,                            15, spaceAfter=6,   leftIndent=L2+2, rightIndent=4, backColor=LIGHT_BG),
    "sublabel":      ps("sublabel",      SB,  9, PURPLE,                          14, spaceBefore=6,  spaceAfter=2, leftIndent=L2),
    "insight_call":  ps("insight_call",  R,   9, PURPLE_TEXT,                    15, spaceAfter=4,   leftIndent=L2+2, rightIndent=4, backColor=LIGHT_BG),
}


# --- Callout box flowable for project title ---
class CalloutBox(Flowable):
    def __init__(self, title, tag, width):
        super().__init__()
        self.title = title
        self.tag = tag
        self._width = width
        self._height = None

    def wrap(self, availW, availH):
        self._width = availW
        # Estimate height: title wrapping + tag + padding
        chars_per_line = self._width / (14 * 0.55)
        lines = max(1, len(self.title) / chars_per_line)
        self._height = lines * 22 + 14 + 20 + 16  # title lines + tag + padding
        return (self._width, self._height)

    def draw(self):
        c = self.canv
        w, h = self._width, self._height
        pad = 12

        # Background rounded rect
        c.setFillColor(CALLOUT_BG)
        c.roundRect(0, 0, w, h, 6, fill=1, stroke=0)

        # Left accent bar
        c.setFillColor(PURPLE)
        c.roundRect(0, 0, 4, h, 2, fill=1, stroke=0)

        # Tag text
        c.setFillColor(colors.HexColor("#c0b8ff"))
        c.setFont(R, 8)
        c.drawString(pad + 6, pad - 2, f"[ {self.tag} ]")

        # Title text (manual wrap)
        c.setFillColor(colors.white)
        c.setFont(B, 13)
        max_w = w - pad * 2 - 8
        words = self.title
        # Use reportlab string width
        from reportlab.pdfbase.pdfmetrics import stringWidth
        lines = []
        current = ""
        for ch in words:
            test = current + ch
            if stringWidth(test, B, 13) > max_w and current:
                lines.append(current)
                current = ch
            else:
                current = test
        if current:
            lines.append(current)

        tag_height = 14
        total_text_h = len(lines) * 20
        y_start = pad + tag_height + (h - pad * 2 - tag_height - total_text_h) / 2 + total_text_h - 20 + 4

        for i, line in enumerate(lines):
            c.drawString(pad + 6, y_start - i * 20, line)


# --- HTML helpers ---
def highlight_to_markup(text):
    text = re.sub(r'<span class="highlight-phrase">(.*?)</span>',
                  r'<font color="#5b4fcf">\1</font>', text, flags=re.DOTALL)
    text = re.sub(r'<span class="stat-em">(.*?)</span>',
                  r'<b><font color="#7c6aff">\1</font></b>', text, flags=re.DOTALL)
    text = re.sub(r'<(?!/?(?:b|i|u|br|font)[^>]*>)[^>]+>', '', text)
    text = text.replace('<br>', ' ').replace('<br/>', ' ').replace('<br />', ' ')
    return text.strip()

def parse_li_items(ul_soup, level=0):
    items = []
    for li in ul_soup.find_all("li", recursive=False):
        parts = []
        for child in li.children:
            if child.name in ("ul", "ol"):
                continue
            parts.append(str(child))
        text = highlight_to_markup("".join(parts)).strip()
        if text:
            items.append((text, level))
        nested = li.find(["ul", "ol"])
        if nested:
            items.extend(parse_li_items(nested, level + 1))
    return items

def render_ul(ul_el):
    out = []
    for text, level in parse_li_items(ul_el):
        style = S["subbullet"] if level > 0 else S["bullet"]
        bullet = "–" if level > 0 else "•"
        out.append(Paragraph(f"{bullet}  {text}", style))
    return out

def section_header(text):
    return [
        HRFlowable(width="100%", thickness=0.4, color=PURPLE_LIGHT, spaceAfter=0),
        Paragraph(f"<font color='#7c6aff'>◆</font>  {text}", S["section_label"]),
    ]

def render_info_item(item):
    out = []
    label_el = item.find(class_="info-label")
    label_text = label_el.get_text(strip=True) if label_el else ""
    out += section_header(label_text)

    # Tech tags
    tags = item.find_all(class_="tech-tag")
    if tags:
        tag_str = "  ".join(f"[{t.get_text(strip=True)}]" for t in tags)
        out.append(Paragraph(tag_str, S["project_tag"] if False else
                             ps("tags_inline", R, 8, PURPLE_TEXT, 13, leftIndent=L2)))
        return out

    for child in item.children:
        if not hasattr(child, "name") or child.name is None:
            continue
        cls = child.get("class", [])
        tag = child.name

        if any(c in cls for c in ("info-label", "info-tags", "tech-tag")):
            continue

        elif tag == "p" and any(c in cls for c in ("info-desc", "desc-lead")):
            out.append(Paragraph(highlight_to_markup(str(child)), S["body"]))

        elif "goal-box" in cls:
            out.append(Paragraph(highlight_to_markup(str(child)), S["goal"]))
            out.append(Spacer(1, 2))

        elif "insight-callout" in cls:
            out.append(Paragraph("→ " + highlight_to_markup(str(child)), S["insight_call"]))

        elif tag == "h6" and "info-subtitle" in cls:
            out.append(Paragraph(child.get_text(strip=True), S["subtitle"]))

        elif tag == "p" and "info-sub-label" in cls:
            out.append(Paragraph(child.get_text(strip=True), S["sublabel"]))

        elif tag in ("ul", "ol"):
            out += render_ul(child)

        elif "impact-grid" in cls:
            cards = child.find_all(class_="impact-card")
            rows = []
            for i in range(0, len(cards), 2):
                pair = cards[i:i+2]
                row = []
                for c in pair:
                    val = c.find(class_="impact-value")
                    lbl = c.find(class_="impact-label")
                    row += [
                        Paragraph(f"<b><font color='#7c6aff'>{val.get_text(strip=True) if val else ''}</font></b>",
                                  ps("iv", B, 11, PURPLE, 16)),
                        Paragraph(lbl.get_text(strip=True) if lbl else "",
                                  ps("il", R, 8, GRAY, 12)),
                    ]
                while len(row) < 4:
                    row.append(Paragraph("", S["body"]))
                rows.append(row)
            if rows:
                t = Table(rows, colWidths=[28*mm, 40*mm, 28*mm, 40*mm])
                t.setStyle(TableStyle([
                    ("BACKGROUND", (0,0), (-1,-1), LIGHT_BG),
                    ("TOPPADDING",    (0,0), (-1,-1), 6),
                    ("BOTTOMPADDING", (0,0), (-1,-1), 6),
                    ("LEFTPADDING",   (0,0), (-1,-1), 6),
                    ("RIGHTPADDING",  (0,0), (-1,-1), 4),
                ]))
                out.append(Spacer(1, 4))
                out.append(t)
                out.append(Spacer(1, 6))

        elif "insight-block" in cls:
            for sub in child.children:
                if not hasattr(sub, "name") or sub.name is None:
                    continue
                sub_cls = sub.get("class", [])
                if "info-subtitle" in sub_cls:
                    out.append(Paragraph(sub.get_text(strip=True), S["subtitle"]))
                elif sub.name in ("ul", "ol"):
                    out += render_ul(sub)
                elif "insight-callout" in sub_cls:
                    out.append(Paragraph("→ " + highlight_to_markup(str(sub)), S["insight_call"]))

        elif "method-stack" in cls:
            for block in child.find_all(class_="method-block"):
                _render_method_block(block, out)

        elif "method-block" in cls:
            _render_method_block(child, out)

        elif "two-column-block" in cls:
            for col in child.find_all(recursive=False):
                for sub in col.children:
                    if not hasattr(sub, "name") or sub.name is None:
                        continue
                    sub_cls = sub.get("class", [])
                    if "info-subtitle" in sub_cls:
                        out.append(Paragraph(sub.get_text(strip=True), S["subtitle"]))
                    elif sub.name in ("ul", "ol"):
                        out += render_ul(sub)

    return out


def _render_method_block(block, out):
    for sub in block.children:
        if not hasattr(sub, "name") or sub.name is None:
            continue
        sub_cls = sub.get("class", [])
        if "info-subtitle" in sub_cls:
            out.append(Paragraph(sub.get_text(strip=True), S["subtitle"]))
        elif "goal-box" in sub_cls:
            out.append(Paragraph(highlight_to_markup(str(sub)), S["goal"]))
        elif sub.name in ("ul", "ol"):
            out += render_ul(sub)


def build_project_flowables(project, page_width):
    out = []
    # Callout box for title
    out.append(CalloutBox(project["title"], project.get("tag", ""), page_width))
    out.append(Spacer(1, 6))

    body_path = project.get("body", "")
    body_html = ""
    if body_path:
        full = os.path.join(BASE_DIR, body_path)
        if os.path.exists(full):
            with open(full, encoding="utf-8") as f:
                body_html = f.read()

    soup = BeautifulSoup(body_html, "html.parser")
    for item in soup.find_all(class_="portfolio-modal-info-item"):
        out += render_info_item(item)

    return out


# --- Load ---
with open(os.path.join(BASE_DIR, "portfolio/projects.json"), encoding="utf-8") as f:
    projects = json.load(f)
active = [p for p in projects if not p.get("disabled")]

# Custom order for this PDF export
CUSTOM_ORDER = [
    "suncare-tf-dashboard",
    "global-lab-kpi-ssot",
    "business-insight-report",
    "formulation-automation",
    "research-trend-analysis",
    "wind-power-prediction",
    "ultrasonic-defect-detection",
    "crime-prediction",
]
slug_to_project = {p["slug"]: p for p in active}
active = [slug_to_project[s] for s in CUSTOM_ORDER if s in slug_to_project]

companies = []
company_map = {}
for p in active:
    c = p.get("company", "")
    if c not in company_map:
        company_map[c] = []
        companies.append(c)
    company_map[c].append(p)

# --- PDF ---
output_path = os.path.join(os.path.expanduser("~/Desktop"), "유소영_포트폴리오_260624.pdf")

LEFT = RIGHT = 18*mm
TOP = BOT = 18*mm
PAGE_W, PAGE_H = A4
CONTENT_W = PAGE_W - LEFT - RIGHT

doc = SimpleDocTemplate(
    output_path, pagesize=A4,
    leftMargin=LEFT, rightMargin=RIGHT,
    topMargin=TOP, bottomMargin=BOT,
)

story = []

# Cover
story.append(Spacer(1, 75*mm))
story.append(Paragraph("Portfolio", S["cover_title"]))
story.append(Spacer(1, 8*mm))
story.append(HRFlowable(width=40*mm, thickness=2, color=PURPLE, hAlign="CENTER"))
story.append(Spacer(1, 8*mm))
story.append(Paragraph("유소영 · Data Analyst", S["cover_sub"]))
story.append(Paragraph("2026", S["cover_sub2"]))
story.append(PageBreak())

# TOC
story.append(Spacer(1, 4*mm))
story.append(Paragraph("목  차", ps("toc_h", B, 16, DARK, 22, spaceAfter=10)))
story.append(HRFlowable(width="100%", thickness=1.5, color=PURPLE, spaceAfter=12))
for company in companies:
    story.append(Paragraph(company, S["toc_company"]))
    for p in company_map[company]:
        story.append(Paragraph(f"·  {p['title']}", S["toc_project"]))
story.append(PageBreak())

# Projects
for ci, company in enumerate(companies):
    if ci > 0:
        story.append(PageBreak())
    story.append(Paragraph(company, S["company"]))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PURPLE, spaceAfter=10))

    for pi, p in enumerate(company_map[company]):
        if pi > 0:
            story.append(PageBreak())
        story += build_project_flowables(p, CONTENT_W)

doc.build(story)
print(f"PDF saved: {output_path}")

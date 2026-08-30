import json
import textwrap
from pathlib import Path

from PIL import Image
from reportlab.graphics import renderPDF
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "output" / "source" / "iconic-product-catalogue-data.json"
OUTPUT = ROOT / "output" / "pdf" / "iconic-filtration-product-catalogue.pdf"
TMP = ROOT / "tmp" / "pdfs"

W, H = A4
NAVY = HexColor("#071A33")
BLUE = HexColor("#05306F")
CYAN = HexColor("#18BFE7")
GREEN = HexColor("#2E8B24")
GOLD = HexColor("#C99A2E")
LIGHT = HexColor("#F4F8FB")
MID = HexColor("#D8E2EA")
TEXT = HexColor("#334155")
MUTED = HexColor("#64748B")
WHITE = white

FONT_DIR = Path("C:/Windows/Fonts")
pdfmetrics.registerFont(TTFont("Catalog", str(FONT_DIR / "arial.ttf")))
pdfmetrics.registerFont(TTFont("Catalog-Bold", str(FONT_DIR / "arialbd.ttf")))

BODY = ParagraphStyle("Body", fontName="Catalog", fontSize=9.1, leading=12.8, textColor=TEXT, alignment=TA_LEFT)
SMALL = ParagraphStyle("Small", parent=BODY, fontSize=7.8, leading=10.4)
TINY = ParagraphStyle("Tiny", parent=BODY, fontSize=6.9, leading=9)
TITLE = ParagraphStyle("Title", fontName="Catalog-Bold", fontSize=28, leading=32, textColor=NAVY)
PRODUCT_TITLE = ParagraphStyle("ProductTitle", fontName="Catalog-Bold", fontSize=23, leading=27, textColor=NAVY)
H2 = ParagraphStyle("H2", fontName="Catalog-Bold", fontSize=16, leading=20, textColor=NAVY)
H3 = ParagraphStyle("H3", fontName="Catalog-Bold", fontSize=10.3, leading=13, textColor=NAVY)
COVER_TITLE = ParagraphStyle("CoverTitle", fontName="Catalog-Bold", fontSize=36, leading=41, textColor=WHITE)
COVER_SUB = ParagraphStyle("CoverSub", parent=BODY, fontSize=13, leading=18, textColor=WHITE)


def public_path(path):
    return ROOT / "public" / path.lstrip("/")


def clean(text):
    return str(text or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def para(c, text, x, y_top, width, style=BODY, max_height=400):
    paragraph = Paragraph(clean(text), style)
    _, height = paragraph.wrap(width, max_height)
    paragraph.drawOn(c, x, y_top - height)
    return height


def wrapped_lines(text, width=70, max_lines=8):
    lines = []
    for paragraph in str(text or "").splitlines():
        lines.extend(textwrap.wrap(paragraph, width=width))
    return lines[:max_lines]


def rounded(c, x, y, width, height, fill=WHITE, stroke=MID, radius=7):
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.setLineWidth(0.7)
    c.roundRect(x, y, width, height, radius, fill=1, stroke=1)


def contain(c, path, x, y, width, height, pad=0):
    image_path = public_path(path)
    if not image_path.exists():
        draw_missing_image(c, x, y, width, height)
        return

    image = Image.open(image_path)
    iw, ih = image.size
    scale = min((width - 2 * pad) / iw, (height - 2 * pad) / ih)
    draw_width, draw_height = iw * scale, ih * scale
    c.drawImage(
        ImageReader(image),
        x + (width - draw_width) / 2,
        y + (height - draw_height) / 2,
        draw_width,
        draw_height,
        preserveAspectRatio=True,
        mask="auto",
    )


def draw_missing_image(c, x, y, width, height):
    rounded(c, x, y, width, height, LIGHT, MID, 6)
    c.setFillColor(CYAN)
    c.rect(x + 18, y + height - 31, 42, 4, fill=1, stroke=0)
    para(c, "Product image to be attached", x + 18, y + height - 44, width - 36, H3, 40)


def qr(c, url, x, y, size):
    widget = QrCodeWidget(url)
    bounds = widget.getBounds()
    drawing = Drawing(size, size, transform=[size / (bounds[2] - bounds[0]), 0, 0, size / (bounds[3] - bounds[1]), 0, 0])
    drawing.add(widget)
    renderPDF.draw(drawing, c, x, y)


def page_header(c, page_number, eyebrow, title):
    c.setFillColor(NAVY)
    c.rect(0, H - 72, W, 72, fill=1, stroke=0)
    contain(c, "/brand/iconic-filtration-logo-384.png", 36, H - 62, 46, 46)
    c.setFillColor(CYAN)
    c.setFont("Catalog-Bold", 7.3)
    c.drawString(98, H - 29, eyebrow.upper())
    c.setFillColor(WHITE)
    c.setFont("Catalog-Bold", 17)
    c.drawString(98, H - 51, title[:48])
    c.setFont("Catalog", 8)
    c.drawRightString(W - 36, H - 45, f"{page_number:02d}")


def footer(c, page_number, data):
    c.setStrokeColor(MID)
    c.line(36, 30, W - 36, 30)
    c.setFillColor(MUTED)
    c.setFont("Catalog", 7.2)
    c.drawString(36, 18, data["brand"]["companyName"])
    c.drawCentredString(W / 2, 18, data["contact"]["phone"])
    c.drawRightString(W - 36, 18, str(page_number))


def bullet_list(c, items, x, y_top, width, max_items=6):
    y = y_top
    for item in (items or [])[:max_items]:
        c.setFillColor(GREEN)
        c.circle(x + 3, y - 5, 2, fill=1, stroke=0)
        height = para(c, item, x + 12, y, width - 12, SMALL, 50)
        y -= height + 4
    return y


def info_box(c, x, y, width, height, title, items):
    rounded(c, x, y, width, height, WHITE, MID)
    c.setFillColor(CYAN)
    c.rect(x + 14, y + height - 18, 28, 3, fill=1, stroke=0)
    para(c, title, x + 14, y + height - 30, width - 28, H3, 32)
    if items:
        item_limit = 3 if height <= 140 else 5
        bullet_list(c, items, x + 14, y + height - 58, width - 28, item_limit)
    else:
        para(c, "Verified data will be added when available.", x + 14, y + height - 58, width - 28, SMALL, 60)


def spec_table(c, x, y, width, rows):
    row_height = 26
    height = row_height * len(rows) + 28
    rounded(c, x, y - height, width, height, WHITE, MID)
    c.setFillColor(NAVY)
    c.roundRect(x, y - 28, width, 28, 7, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Catalog-Bold", 9)
    c.drawString(x + 12, y - 18, "Verified Product Details")

    current_y = y - 28
    for index, (label, value) in enumerate(rows):
        fill = LIGHT if index % 2 == 0 else WHITE
        c.setFillColor(fill)
        c.rect(x + 1, current_y - row_height, width - 2, row_height, fill=1, stroke=0)
        c.setFillColor(MUTED)
        c.setFont("Catalog-Bold", 7)
        c.drawString(x + 12, current_y - 16, label.upper())
        c.setFillColor(TEXT)
        c.setFont("Catalog", 7.5)
        c.drawString(x + 112, current_y - 16, str(value)[:58])
        current_y -= row_height
    return height


def cover_page(c, data):
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.saveState()
    c.setFillColor(Color(0.07, 0.75, 0.91, alpha=0.16))
    c.circle(W - 72, H - 90, 190, fill=1, stroke=0)
    c.setFillColor(Color(0.18, 0.55, 0.14, alpha=0.12))
    c.circle(55, 110, 220, fill=1, stroke=0)
    c.restoreState()

    rounded(c, 42, H - 145, 116, 88, WHITE, WHITE, 8)
    contain(c, data["brand"]["logoPath"], 52, H - 136, 96, 70)
    c.setFillColor(CYAN)
    c.setFont("Catalog-Bold", 9)
    c.drawString(42, H - 198, data["brand"]["companyName"])
    para(c, data["brand"]["title"], 42, H - 226, W - 84, COVER_TITLE, 120)
    para(c, data["brand"]["tagline"], 42, H - 324, W - 135, COVER_SUB, 70)

    c.setFillColor(GREEN)
    c.rect(42, 155, 160, 4, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Catalog-Bold", 10.5)
    c.drawString(42, 126, data["contact"]["website"].replace("https://", ""))
    c.setFont("Catalog", 9.2)
    c.drawString(42, 105, data["contact"]["phone"])
    c.drawString(42, 86, data["contact"]["email"])

    qr(c, data["contact"]["quoteUrl"], W - 138, 74, 82)
    c.setFont("Catalog-Bold", 7)
    c.drawCentredString(W - 97, 61, "Request Quote")
    c.showPage()


def category_pages(c, data, start_page):
    page = start_page
    categories = data["categories"]
    for offset in range(0, len(categories), 6):
        page_header(c, page, "Product Categories", "Available Product Categories")
        para(
            c,
            "Visual category cards generated from the current website product catalogue. Product counts update from the available brand/product data.",
            36,
            H - 105,
            W - 72,
            BODY,
            44,
        )
        cards = categories[offset : offset + 6]
        card_w = (W - 84) / 2
        card_h = 174
        for index, item in enumerate(cards):
            col = index % 2
            row = index // 2
            x = 36 + col * (card_w + 12)
            y = H - 342 - row * (card_h + 14)
            rounded(c, x, y, card_w, card_h, WHITE, MID)
            c.setFillColor(LIGHT)
            c.roundRect(x + 1, y + card_h - 84, card_w - 2, 83, 6, fill=1, stroke=0)
            contain(c, item["imagePath"], x + 12, y + card_h - 78, card_w - 24, 68, 3)
            c.setFillColor(GREEN)
            c.setFont("Catalog-Bold", 7.2)
            c.drawString(x + 14, y + 76, f"{item['productCount']} products")
            para(c, item["name"], x + 14, y + 62, card_w - 28, H3, 30)
            para(c, item["description"], x + 14, y + 34, card_w - 28, TINY, 38)
        footer(c, page, data)
        c.showPage()
        page += 1
    return page


def product_page(c, data, product, page):
    page_header(c, page, "Product Page", product["name"])

    c.setFillColor(GREEN)
    c.setFont("Catalog-Bold", 7.3)
    c.drawString(36, H - 103, product["category"].upper())
    para(c, "Product overview, quote QR, key features, applications, and related product direction.", 36, H - 124, 270, SMALL, 42)

    meta = []
    if product.get("brand"):
        meta.append(("Brand", product["brand"]))
    if product.get("modelNumber"):
        meta.append(("Model Number", product["modelNumber"]))
    meta.extend(
        [
            ("Product Category", product["category"]),
            ("Product Page", product["productPageUrl"].replace("https://", "")),
        ]
    )
    spec_table(c, 352, H - 103, 207, meta)

    rounded(c, 36, 394, 252, 210, LIGHT, MID)
    contain(c, product["imagePath"], 49, 407, 226, 184, 4)
    qr(c, product["quoteUrl"], 306, 382, 70)
    c.setFillColor(NAVY)
    c.setFont("Catalog-Bold", 7.3)
    c.drawCentredString(341, 369, "Request a Quote")

    desc = product["description"]
    rounded(c, 306, 478, 253, 126, WHITE, MID)
    c.setFillColor(CYAN)
    c.rect(320, 583, 28, 3, fill=1, stroke=0)
    para(c, "Short Description", 320, 570, 225, H3, 24)
    para(c, desc, 320, 546, 225, SMALL, 76)

    col_w = (W - 84) / 3
    info_box(c, 36, 214, col_w, 138, "Key Features", product.get("keyFeatures", []))
    info_box(c, 36 + col_w + 6, 214, col_w, 138, "Applications", product.get("applications", []))
    info_box(c, 36 + 2 * (col_w + 6), 214, col_w, 138, "Available Sizes / Variants", product.get("variants", []))

    info_box(c, 36, 104, (W - 84) / 2, 110, "Compatible Products", product.get("compatibleProducts", []))
    info_box(c, 36 + (W - 84) / 2 + 12, 104, (W - 84) / 2, 110, "Related Products", product.get("relatedProducts", []))

    c.setFillColor(NAVY)
    c.roundRect(36, 47, W - 72, 54, 8, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Catalog-Bold", 8.5)
    c.drawString(52, 78, "Product Page URL")
    c.setFont("Catalog", 7.2)
    c.drawString(52, 62, product["productPageUrl"][:92])
    c.setFont("Catalog-Bold", 8.5)
    c.drawRightString(W - 52, 70, "Scan QR for quote")

    footer(c, page, data)
    c.showPage()


def final_page(c, data, page):
    page_header(c, page, "Contact", "Request Product Support")
    para(
        c,
        "Share product category, brand preference, quantity, flow or capacity, water source, delivery location, and project timeline for faster quotation support.",
        36,
        H - 108,
        W - 72,
        BODY,
        54,
    )

    left_w = 318
    rounded(c, 36, 238, left_w, 424, WHITE, MID)
    c.setFillColor(CYAN)
    c.rect(56, 636, 34, 4, fill=1, stroke=0)
    para(c, "Contact Information", 56, 620, left_w - 40, H2, 30)
    y = 580
    for office in data["contact"]["offices"]:
        para(c, office["title"], 56, y, left_w - 40, H3, 22)
        y -= 24
        for line in office["lines"]:
            c.setFillColor(TEXT)
            c.setFont("Catalog", 8.2)
            c.drawString(56, y, line)
            y -= 13
        y -= 12
    para(c, "Phone", 56, y, left_w - 40, H3, 20)
    c.setFillColor(TEXT)
    c.setFont("Catalog", 8.4)
    c.drawString(56, y - 18, data["contact"]["phone"])
    para(c, "Email", 56, y - 45, left_w - 40, H3, 20)
    c.setFillColor(TEXT)
    c.setFont("Catalog", 8.4)
    c.drawString(56, y - 63, data["contact"]["email"])
    para(c, "Website", 56, y - 91, left_w - 40, H3, 20)
    c.setFillColor(TEXT)
    c.setFont("Catalog", 8.4)
    c.drawString(56, y - 109, data["contact"]["website"].replace("https://", ""))

    rounded(c, 374, 362, 185, 300, LIGHT, MID)
    qr(c, data["contact"]["quoteUrl"], 410, 470, 112)
    para(c, "Request a Quote", 398, 450, 135, H2, 40)
    para(c, "Scan to send product requirements to ICONIC FILTRATION AND ENGINEERS LLP.", 398, 412, 135, SMALL, 70)
    rounded(c, 374, 302, 185, 44, NAVY, NAVY)
    c.setFillColor(WHITE)
    c.setFont("Catalog-Bold", 8.2)
    c.drawCentredString(466.5, 328, data["contact"]["phone"])
    c.drawCentredString(466.5, 314, data["contact"]["email"])

    footer(c, page, data)
    c.showPage()


def make_catalogue():
    if not SOURCE.exists():
        raise FileNotFoundError(f"Missing source data: {SOURCE}")

    data = json.loads(SOURCE.read_text(encoding="utf8"))
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    TMP.mkdir(parents=True, exist_ok=True)

    c = canvas.Canvas(str(OUTPUT), pagesize=A4)
    c.setTitle("ICONIC FILTRATION AND ENGINEERS LLP - Product Catalogue")
    c.setAuthor(data["brand"]["companyName"])
    c.setSubject("Product-only catalogue for water filtration products")

    cover_page(c, data)
    page = 2
    page = category_pages(c, data, page)
    for product in data["products"]:
      product_page(c, data, product, page)
      page += 1
    final_page(c, data, page)
    c.save()
    print(f"Product catalogue generated: {OUTPUT}")


if __name__ == "__main__":
    make_catalogue()

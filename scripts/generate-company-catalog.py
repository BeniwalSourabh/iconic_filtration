from pathlib import Path

from PIL import Image, ImageOps
from reportlab.graphics import renderPDF
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "iconic-filtration-company-catalog.pdf"
TMP = ROOT / "tmp" / "pdfs"

W, H = A4
NAVY = HexColor("#071B36")
BLUE = HexColor("#073A7A")
CYAN = HexColor("#12BDEB")
GREEN = HexColor("#198A2E")
LIGHT = HexColor("#F3F7FB")
MID = HexColor("#D9E5EF")
TEXT = HexColor("#334155")
MUTED = HexColor("#64748B")

FONT_DIR = Path("C:/Windows/Fonts")
pdfmetrics.registerFont(TTFont("Catalog", str(FONT_DIR / "arial.ttf")))
pdfmetrics.registerFont(TTFont("Catalog-Bold", str(FONT_DIR / "arialbd.ttf")))

BODY = ParagraphStyle(
    "Body",
    fontName="Catalog",
    fontSize=9.6,
    leading=14,
    textColor=TEXT,
    alignment=TA_LEFT,
)
BODY_SMALL = ParagraphStyle(
    "BodySmall",
    parent=BODY,
    fontSize=8.3,
    leading=12,
)
BODY_WHITE = ParagraphStyle(
    "BodyWhite",
    parent=BODY,
    textColor=white,
)
TITLE = ParagraphStyle(
    "Title",
    fontName="Catalog-Bold",
    fontSize=25,
    leading=29,
    textColor=NAVY,
)
H2 = ParagraphStyle(
    "H2",
    fontName="Catalog-Bold",
    fontSize=14,
    leading=18,
    textColor=NAVY,
)
H3 = ParagraphStyle(
    "H3",
    fontName="Catalog-Bold",
    fontSize=10.5,
    leading=14,
    textColor=NAVY,
)
LABEL = ParagraphStyle(
    "Label",
    fontName="Catalog-Bold",
    fontSize=8,
    leading=10,
    textColor=GREEN,
)


def asset(relative):
    return ROOT / "public" / relative


def paragraph(c, text, x, y_top, width, style=BODY, max_height=300):
    p = Paragraph(text, style)
    _, height = p.wrap(width, max_height)
    p.drawOn(c, x, y_top - height)
    return height


def contain(c, path, x, y, width, height, pad=0):
    image = Image.open(path)
    iw, ih = image.size
    scale = min((width - 2 * pad) / iw, (height - 2 * pad) / ih)
    dw, dh = iw * scale, ih * scale
    c.drawImage(
        ImageReader(image),
        x + (width - dw) / 2,
        y + (height - dh) / 2,
        dw,
        dh,
        preserveAspectRatio=True,
        mask="auto",
    )


def cover_image(c, path):
    image = Image.open(path).convert("RGB")
    ratio = W / H
    fitted = ImageOps.fit(image, (1200, int(1200 / ratio)), method=Image.Resampling.LANCZOS)
    temp_path = TMP / "cover.jpg"
    fitted.save(temp_path, quality=90)
    c.drawImage(str(temp_path), 0, 0, W, H)


def rounded(c, x, y, width, height, fill=white, stroke=MID, radius=6):
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.setLineWidth(0.7)
    c.roundRect(x, y, width, height, radius, fill=1, stroke=1)


def page_header(c, eyebrow, title, page_number):
    c.setFillColor(NAVY)
    c.rect(0, H - 76, W, 76, fill=1, stroke=0)
    contain(c, asset("brand/iconic-filtration-logo-384.png"), 36, H - 64, 48, 48)
    c.setFillColor(CYAN)
    c.setFont("Catalog-Bold", 7.5)
    c.drawString(100, H - 31, eyebrow.upper())
    c.setFillColor(white)
    c.setFont("Catalog-Bold", 19)
    c.drawString(100, H - 53, title)
    c.setFont("Catalog", 8)
    c.drawRightString(W - 36, H - 48, f"{page_number:02d}")


def footer(c, page_number):
    c.setStrokeColor(MID)
    c.line(36, 31, W - 36, 31)
    c.setFillColor(MUTED)
    c.setFont("Catalog", 7.5)
    c.drawString(36, 18, "ICONIC FILTRATION AND ENGINEERS LLP")
    c.drawCentredString(W / 2, 18, "iconic-filtration.vercel.app")
    c.drawRightString(W - 36, 18, str(page_number))


def section_title(c, eyebrow, title, intro, y=H - 108):
    c.setFillColor(GREEN)
    c.setFont("Catalog-Bold", 8)
    c.drawString(36, y, eyebrow.upper())
    title_height = paragraph(c, title, 36, y - 10, W - 72, TITLE, 80)
    paragraph(c, intro, 36, y - 22 - title_height, W - 72, BODY, 80)


def logo_strip(c, logos, y):
    cell_w = (W - 72 - 4 * 8) / 5
    for index, logo in enumerate(logos):
        x = 36 + index * (cell_w + 8)
        rounded(c, x, y, cell_w, 55, white, MID)
        contain(c, asset(logo), x + 6, y + 6, cell_w - 12, 43, 3)


def product_card(c, x, y, width, height, image_path, title, text, logo_path=None):
    rounded(c, x, y, width, height, white, MID)
    image_h = height * 0.54
    c.setFillColor(LIGHT)
    c.roundRect(x + 1, y + height - image_h - 1, width - 2, image_h, 5, fill=1, stroke=0)
    contain(c, asset(image_path), x + 8, y + height - image_h + 6, width - 16, image_h - 14, 4)
    if logo_path:
        rounded(c, x + 12, y + height - 39, 76, 25, white, MID, 4)
        contain(c, asset(logo_path), x + 16, y + height - 35, 68, 17, 1)
    paragraph(c, title, x + 14, y + height - image_h - 13, width - 28, H3, 38)
    paragraph(c, text, x + 14, y + height - image_h - 46, width - 28, BODY_SMALL, 85)


def info_card(c, x, y, width, height, title, text, index=None):
    rounded(c, x, y, width, height, white, MID)
    if index is not None:
        c.setFillColor(CYAN)
        c.circle(x + 23, y + height - 23, 12, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont("Catalog-Bold", 8)
        c.drawCentredString(x + 23, y + height - 26, str(index))
        title_x = x + 43
        title_top = y + height - 17
        body_top = y + height - 48
    else:
        c.setFillColor(CYAN)
        c.rect(x + 14, y + height - 17, 24, 3, fill=1, stroke=0)
        title_x = x + 14
        title_top = y + height - 27
        body_top = y + height - 58
    paragraph(c, title, title_x, title_top, width - (title_x - x) - 14, H3, 40)
    paragraph(c, text, x + 14, body_top, width - 28, BODY_SMALL, height - 60)


def bullet_list(c, items, x, y_top, width, color=GREEN, style=BODY_SMALL, gap=4):
    y = y_top
    for item in items:
        c.setFillColor(color)
        c.circle(x + 3, y - 6, 2, fill=1, stroke=0)
        height = paragraph(c, item, x + 12, y, width - 12, style, 60)
        y -= height + gap
    return y


def draw_qr(c, url, x, y, size):
    widget = QrCodeWidget(url)
    bounds = widget.getBounds()
    drawing = Drawing(size, size, transform=[size / (bounds[2] - bounds[0]), 0, 0, size / (bounds[3] - bounds[1]), 0, 0])
    drawing.add(widget)
    renderPDF.draw(drawing, c, x, y)


def make_catalog():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    TMP.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=A4)
    c.setTitle("ICONIC FILTRATION AND ENGINEERS LLP - Company Catalogue")
    c.setAuthor("ICONIC FILTRATION AND ENGINEERS LLP")
    c.setSubject("Water filtration products and engineering solutions")

    # Page 1 - cover
    cover_image(c, asset("images/homepage-filtration-hero-1600.jpg"))
    c.saveState()
    c.setFillColor(Color(0.02, 0.08, 0.16, alpha=0.82))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.restoreState()
    rounded(c, 36, H - 142, 112, 88, white, white, 6)
    contain(c, asset("brand/iconic-filtration-logo-384.png"), 45, H - 134, 94, 72)
    c.setFillColor(CYAN)
    c.setFont("Catalog-Bold", 9)
    c.drawString(36, H - 195, "COMPANY AND PRODUCT CATALOGUE")
    cover_title = ParagraphStyle("CoverTitle", parent=TITLE, fontSize=34, leading=38, textColor=white)
    paragraph(c, "Advanced Water Filtration Solutions", 36, H - 220, W - 90, cover_title, 150)
    cover_sub = ParagraphStyle("CoverSub", parent=BODY_WHITE, fontSize=14, leading=20)
    paragraph(
        c,
        "Industrial and commercial filtration products backed by application-focused guidance, reliable supply, and responsive customer support.",
        36,
        H - 322,
        W - 130,
        cover_sub,
        100,
    )
    c.setFillColor(CYAN)
    c.rect(36, 130, 170, 3, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Catalog-Bold", 10)
    c.drawString(36, 106, "ICONIC FILTRATION AND ENGINEERS LLP")
    c.setFont("Catalog", 9)
    c.drawString(36, 87, "Water Filtration Products & Engineering Solutions")
    c.drawString(36, 68, "+91 9650086963  |  sales@iconicfiltration.com")
    c.showPage()

    # Page 2 - profile
    page_header(c, "Company profile", "Built for dependable filtration decisions", 2)
    section_title(
        c,
        "About ICONIC",
        "Quality products. Technical understanding. Reliable support.",
        "ICONIC FILTRATION AND ENGINEERS LLP supplies water filtration products and engineering solutions for industrial, commercial, OEM, and water-treatment requirements across India, with international supply available.",
    )
    profile_y = 500
    cards = [
        ("Premium Quality Products", "Dependable filtration products selected from trusted manufacturing partners."),
        ("Engineering Expertise", "Application-focused guidance around water quality, duty, capacity, and operating conditions."),
        ("Reliable Delivery", "Careful order coordination, packaging, dispatch planning, and logistics communication."),
        ("Customer Support", "Responsive assistance from product selection and quotation through after-sales clarification."),
    ]
    card_w = (W - 72 - 12) / 2
    for i, (title, text) in enumerate(cards):
        x = 36 + (i % 2) * (card_w + 12)
        y = profile_y - (i // 2) * 105
        info_card(c, x, y, card_w, 90, title, text)
    c.setFillColor(NAVY)
    c.roundRect(36, 185, W - 72, 105, 6, fill=1, stroke=0)
    c.setFillColor(CYAN)
    c.setFont("Catalog-Bold", 8)
    c.drawString(52, 268, "OUR COMMITMENT")
    commitment = ParagraphStyle("Commit", parent=BODY_WHITE, fontSize=11, leading=16)
    paragraph(
        c,
        "We help customers make confident purchasing decisions through accurate product information, transparent quotations, quality-conscious handling, and dedicated support after every order.",
        52,
        250,
        W - 104,
        commitment,
        70,
    )
    c.setFillColor(GREEN)
    c.setFont("Catalog-Bold", 8)
    c.drawString(36, 156, "PARTNER PRODUCT PORTFOLIO")
    logo_strip(
        c,
        [
            "partners/chemsel/logo.jpeg",
            "partners/seko/logo.png",
            "partners/hydranautics/logo.png",
            "partners/dax/logo.png",
            "partners/fenton/logo.png",
        ],
        78,
    )
    footer(c, 2)
    c.showPage()

    # Page 3 - core range
    page_header(c, "Product portfolio", "Core filtration products", 3)
    section_title(
        c,
        "Product range",
        "Products for industrial and commercial water treatment",
        "Our core portfolio covers membrane separation, pressure containment, chemical dosing, ultrafiltration, and supporting components for treatment plants and OEM systems.",
    )
    products = [
        (
            "partners/hydranautics/products/ld-technology-ro-membranes.webp",
            "RO Membranes",
            "Membrane products for TDS reduction, process water, boiler-feed preparation, and industrial RO systems.",
            "partners/hydranautics/logo.png",
        ),
        (
            "partners/dax/products/ro-pressure-vessels.webp",
            "RO Pressure Vessels",
            "FRP membrane housings for commercial, industrial, brackish-water, and higher-pressure RO requirements.",
            "partners/dax/logo.png",
        ),
        (
            "partners/seko/products/kosmo-mm2-dosing-pump.webp",
            "Dosing Pumps",
            "Controlled chemical dosing for antiscalant, pH correction, disinfection, coagulation, and process conditioning.",
            "partners/seko/logo.png",
        ),
        (
            "partners/fenton/products/uf-8585-ultrafiltration-membrane.webp",
            "Ultrafiltration Systems",
            "UF and membrane-based products for pretreatment, clean-water output, wastewater reuse, and industrial filtration.",
            "partners/fenton/logo.png",
        ),
    ]
    card_w = (W - 72 - 14) / 2
    card_h = 245
    for i, product in enumerate(products):
        x = 36 + (i % 2) * (card_w + 14)
        y = 345 - (i // 2) * (card_h + 14)
        product_card(c, x, y, card_w, card_h, *product)
    footer(c, 3)
    c.showPage()

    # Page 4 - membranes and vessels
    page_header(c, "Membrane systems", "RO membranes and pressure vessels", 4)
    section_title(
        c,
        "RO system components",
        "Separation performance with dependable pressure containment",
        "Membrane and pressure-vessel selection depends on feed-water chemistry, recovery target, fouling risk, operating pressure, membrane size, element count, and plant configuration.",
    )
    product_card(
        c,
        36,
        340,
        255,
        260,
        "partners/hydranautics/products/ld-technology-ro-membranes.webp",
        "Hydranautics RO Membrane Portfolio",
        "LD Technology, CPA Family, and PRO Series membrane options support low-fouling, high-rejection, and challenging industrial-water applications. Model selection is confirmed against the project duty.",
        "partners/hydranautics/logo.png",
    )
    product_card(
        c,
        304,
        340,
        255,
        260,
        "partners/dax/products/ro-pressure-vessels.webp",
        "DAX RO Pressure Vessels",
        "4 inch and 8 inch membrane housings are available in end-entry and side-entry configurations across multiple pressure requirements. Final configuration is selected for the RO skid and membrane arrangement.",
        "partners/dax/logo.png",
    )
    rounded(c, 36, 85, W - 72, 245, LIGHT, MID)
    c.setFillColor(GREEN)
    c.setFont("Catalog-Bold", 8)
    c.drawString(52, 306, "SELECTION INPUTS")
    left_items = [
        "<b>Feed water:</b> TDS, hardness, silica, organics, temperature, and fouling indicators",
        "<b>System duty:</b> permeate capacity, recovery target, rejection requirement, and operating hours",
        "<b>Membrane:</b> element size, array configuration, cleaning strategy, and compatibility",
    ]
    right_items = [
        "<b>Pressure vessel:</b> diameter, element count, pressure rating, entry arrangement, and connection details",
        "<b>Project information:</b> P&ID, GA drawing, BOQ, replacement model, and installation constraints",
        "<b>Support:</b> product documentation, quotation coordination, dispatch planning, and after-sales clarification",
    ]
    bullet_list(c, left_items, 52, 286, 226)
    bullet_list(c, right_items, 306, 286, 237)
    footer(c, 4)
    c.showPage()

    # Page 5 - dosing
    page_header(c, "Chemical dosing", "SEKO dosing pump portfolio", 5)
    section_title(
        c,
        "Dosing solutions",
        "Controlled chemical injection for treatment and process duties",
        "Dosing pump selection is based on required flow, discharge pressure, chemical compatibility, turndown, control signal, suction conditions, and maintenance requirements.",
    )
    pumps = [
        (
            "partners/seko/products/tork-ty-dosing-pump.webp",
            "Tork TY",
            "Hydraulic double-diaphragm dosing pump for demanding industrial and water-treatment duties.",
        ),
        (
            "partners/seko/products/kosmo-mm2-dosing-pump.webp",
            "Kosmo MM2",
            "Mechanical diaphragm dosing pump for higher-output chemical dosing requirements.",
        ),
        (
            "partners/seko/products/spring-ms1-avs-dosing-pump.webp",
            "Spring MS1 AVS",
            "Spring-return diaphragm pump with assisted vacuum support for improved suction performance.",
        ),
        (
            "partners/seko/products/spring-ps2-hp-dosing-pump.webp",
            "Spring PS2 HP",
            "High-pressure plunger-piston variant for demanding chemical injection applications.",
        ),
    ]
    card_w = (W - 72 - 14) / 2
    for i, product in enumerate(pumps):
        x = 36 + (i % 2) * (card_w + 14)
        y = 365 - (i // 2) * 215
        product_card(c, x, y, card_w, 200, product[0], product[1], product[2], "partners/seko/logo.png")
    c.setFillColor(NAVY)
    c.roundRect(36, 83, W - 72, 55, 6, fill=1, stroke=0)
    paragraph(
        c,
        "<b>Typical applications:</b> antiscalant dosing, pH correction, chlorine dosing, coagulant and flocculant dosing, disinfection, and industrial process conditioning.",
        52,
        123,
        W - 104,
        BODY_WHITE,
        45,
    )
    footer(c, 5)
    c.showPage()

    # Page 6 - Fenton
    page_header(c, "Wastewater and reuse", "FENTON membrane and oil-removal products", 6)
    section_title(
        c,
        "Treatment applications",
        "Ultrafiltration, MBR, and oil-skimming products",
        "Products for clean-water output, membrane bioreactor systems, industrial wastewater treatment, treated-water reuse, coolant tanks, and oil-removal requirements.",
    )
    fenton_products = [
        (
            "partners/fenton/products/uf-8585-ultrafiltration-membrane.webp",
            "UF 8585 Ultrafiltration Membrane",
            "UF membrane product for pore-precision filtration, stable flow, industrial filtration, and water-treatment applications.",
        ),
        (
            "partners/fenton/products/hollow-fiber-mbr-membrane.webp",
            "Hollow Fiber MBR Membrane",
            "Hollow-fiber membrane product for biological treatment, membrane bioreactor systems, wastewater treatment, and reuse.",
        ),
        (
            "partners/fenton/products/compact-heavy-duty-oil-skimmer.webp",
            "Compact Heavy Duty Oil Skimmer",
            "Serviceable oil-skimming product for industrial wastewater, coolant tanks, machine-shop utilities, and surface-oil removal.",
        ),
    ]
    card_w = (W - 72 - 20) / 3
    for i, product in enumerate(fenton_products):
        x = 36 + i * (card_w + 10)
        product_card(c, x, 250, card_w, 350, product[0], product[1], product[2], "partners/fenton/logo.png")
    rounded(c, 36, 75, W - 72, 160, LIGHT, MID)
    paragraph(c, "Application review before selection", 52, 210, 250, H2, 40)
    paragraph(
        c,
        "Share influent quality, solids load, target outlet quality, flow, operating hours, available footprint, cleaning approach, and reuse or discharge objective. Product and system suitability must be confirmed for each project.",
        52,
        176,
        W - 104,
        BODY,
        90,
    )
    footer(c, 6)
    c.showPage()

    # Page 7 - range and industries
    page_header(c, "Complete capability", "Supporting products and industries served", 7)
    section_title(
        c,
        "Broader portfolio",
        "Components that complete water-treatment systems",
        "Beyond the highlighted partner products, ICONIC supports enquiries for filtration, ion exchange, pumping, instrumentation, storage, and wastewater-treatment requirements.",
    )
    categories = [
        ("Pretreatment", "FRP vessels, filter media, filter cartridges, multiport valves, and vessel distribution systems."),
        ("RO System Support", "RO antiscalant, controllers, instruments, high-pressure pumps, domestic RO membranes, and accessories."),
        ("Water Handling", "Hydro-pneumatic tanks, level sensors, pumping equipment, and treated-water distribution support."),
        ("Wastewater", "Filtration systems, dosing systems, oil-removal products, MBR products, and supporting accessories."),
    ]
    card_w = (W - 72 - 12) / 2
    for i, (title, text) in enumerate(categories):
        x = 36 + (i % 2) * (card_w + 12)
        y = 445 - (i // 2) * 110
        info_card(c, x, y, card_w, 94, title, text)
    c.setFillColor(NAVY)
    c.roundRect(36, 90, W - 72, 230, 6, fill=1, stroke=0)
    c.setFillColor(CYAN)
    c.setFont("Catalog-Bold", 8)
    c.drawString(52, 296, "INDUSTRIES WE SERVE")
    industries = [
        "Pharmaceutical",
        "Food & Beverage",
        "Chemical",
        "Textile",
        "Hospitals",
        "Hotels",
        "Manufacturing",
        "Commercial Buildings",
        "Water Treatment Plants",
    ]
    chip_w = (W - 104 - 20) / 3
    for i, industry in enumerate(industries):
        x = 52 + (i % 3) * (chip_w + 10)
        y = 247 - (i // 3) * 52
        c.setFillColor(Color(1, 1, 1, alpha=0.08))
        c.setStrokeColor(Color(1, 1, 1, alpha=0.2))
        c.roundRect(x, y, chip_w, 38, 4, fill=1, stroke=1)
        c.setFillColor(white)
        c.setFont("Catalog-Bold", 8.2)
        c.drawCentredString(x + chip_w / 2, y + 14, industry)
    footer(c, 7)
    c.showPage()

    # Page 8 - process and contact
    page_header(c, "Enquiry and support", "From requirement to after-sales guidance", 8)
    section_title(
        c,
        "How we work",
        "A clear customer journey",
        "Share the right technical and commercial inputs so our team can review the application, recommend suitable products, and prepare a more accurate quotation.",
    )
    steps = [
        ("Understanding Requirements", "We review the application, water quality, operating conditions, capacity, and filtration goals."),
        ("Recommendation & Quote", "Suitable products are shortlisted and quoted with available specifications and delivery information."),
        ("Quality Inspection", "Selected products are checked against the confirmed order and basic supply requirements."),
        ("Packaging & Delivery", "Orders are securely packed and coordinated through dependable logistics partners."),
        ("After-Sales Support", "Our team remains available for documentation, product clarification, and technical guidance."),
    ]
    step_w = (W - 72 - 16) / 3
    for i, (title, text) in enumerate(steps):
        row = 0 if i < 3 else 1
        count = 3 if row == 0 else 2
        row_offset = 0 if row == 0 else (W - 72 - (2 * step_w + 8)) / 2
        x = 36 + row_offset + (i if row == 0 else i - 3) * (step_w + 8)
        y = 430 if row == 0 else 310
        info_card(c, x, y, step_w, 105, title, text, i + 1)
    c.setFillColor(NAVY)
    c.roundRect(36, 74, W - 72, 205, 6, fill=1, stroke=0)
    c.setFillColor(CYAN)
    c.setFont("Catalog-Bold", 8)
    c.drawString(52, 254, "REQUEST A CUSTOMIZED QUOTATION")
    c.setFillColor(white)
    c.setFont("Catalog-Bold", 17)
    c.drawString(52, 226, "Discuss your filtration requirement")
    paragraph(
        c,
        "Share the product or brand required, water source, application, flow rate, delivery location, timeline, and available drawings or BOQ.",
        52,
        207,
        330,
        BODY_WHITE,
        60,
    )
    c.setFont("Catalog-Bold", 9)
    c.drawString(52, 139, "+91 9650086963")
    c.drawString(52, 120, "sales@iconicfiltration.com")
    c.drawString(52, 101, "Delhi Office | Noida Branch Office")
    draw_qr(c, "https://iconic-filtration.vercel.app/request-quote", W - 162, 100, 92)
    c.setFillColor(white)
    c.setFont("Catalog", 7.5)
    c.drawCentredString(W - 116, 88, "Scan to request a quote")
    footer(c, 8)
    c.showPage()

    c.save()


if __name__ == "__main__":
    make_catalog()

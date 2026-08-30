from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path

from PIL import Image
from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.utils import ImageReader
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
BASE_PATH = ROOT / "scripts" / "generate-company-catalog.py"
SPEC = spec_from_file_location("catalog_base", BASE_PATH)
base = module_from_spec(SPEC)
SPEC.loader.exec_module(base)

W, H = A4
OUTPUT = ROOT / "output" / "pdf" / "iconic-filtration-company-catalog.pdf"
NAVY = base.NAVY
BLUE = base.BLUE
CYAN = base.CYAN
GREEN = base.GREEN
LIGHT = base.LIGHT
MID = base.MID
TEXT = base.TEXT
MUTED = base.MUTED
BODY = base.BODY
BODY_SMALL = base.BODY_SMALL
BODY_WHITE = base.BODY_WHITE
TITLE = base.TITLE
H2 = base.H2
H3 = base.H3


def asset(relative):
    return ROOT / "public" / relative


def cover_image(c, path):
    image = Image.open(path)
    image_width, image_height = image.size
    scale = max(W / image_width, H / image_height)
    draw_width = image_width * scale
    draw_height = image_height * scale
    c.drawImage(
        ImageReader(image),
        (W - draw_width) / 2,
        (H - draw_height) / 2,
        draw_width,
        draw_height,
        preserveAspectRatio=True,
        mask="auto",
    )


def footer(c, page_number):
    c.setStrokeColor(MID)
    c.line(36, 31, W - 36, 31)
    c.setFillColor(MUTED)
    c.setFont("Catalog", 7.5)
    c.drawString(36, 18, "ICONIC FILTRATION AND ENGINEERS LLP")
    c.drawCentredString(W / 2, 18, "+91 9650086963")
    c.drawRightString(W - 36, 18, str(page_number))


def page_header(c, eyebrow, title, page_number):
    c.setFillColor(NAVY)
    c.rect(0, H - 76, W, 76, fill=1, stroke=0)
    base.contain(c, asset("brand/iconic-filtration-logo-384.png"), 36, H - 64, 48, 48)
    c.setFillColor(CYAN)
    c.setFont("Catalog-Bold", 7.5)
    c.drawString(100, H - 31, eyebrow.upper())
    c.setFillColor(white)
    c.setFont("Catalog-Bold", 18)
    c.drawString(100, H - 53, title)
    c.setFont("Catalog", 8)
    c.drawRightString(W - 36, H - 48, f"{page_number:02d}")


def section_title(c, eyebrow, title, intro, y=H - 108):
    c.setFillColor(GREEN)
    c.setFont("Catalog-Bold", 8)
    c.drawString(36, y, eyebrow.upper())
    title_height = base.paragraph(c, title, 36, y - 10, W - 72, TITLE, 80)
    base.paragraph(c, intro, 36, y - 22 - title_height, W - 72, BODY, 80)


def card(c, x, y, width, height, title, text, fill=white):
    base.rounded(c, x, y, width, height, fill, MID)
    c.setFillColor(CYAN)
    c.rect(x + 14, y + height - 17, 24, 3, fill=1, stroke=0)
    base.paragraph(c, title, x + 14, y + height - 27, width - 28, H3, 40)
    base.paragraph(c, text, x + 14, y + height - 58, width - 28, BODY_SMALL, height - 64)


def list_card(c, x, y, width, height, title, items, fill=white):
    base.rounded(c, x, y, width, height, fill, MID)
    c.setFillColor(CYAN)
    c.rect(x + 14, y + height - 17, 24, 3, fill=1, stroke=0)
    base.paragraph(c, title, x + 14, y + height - 27, width - 28, H3, 40)
    base.bullet_list(c, items, x + 14, y + height - 59, width - 28, style=BODY_SMALL, gap=3)


def product_visual(c, x, y, width, height, image_path, label):
    base.rounded(c, x, y, width, height, LIGHT, MID)
    if image_path:
        base.contain(c, asset(image_path), x + 10, y + 10, width - 20, height - 20, 6)
    else:
        c.setFillColor(NAVY)
        c.roundRect(x + 12, y + 12, width - 24, height - 24, 5, fill=1, stroke=0)
        c.setFillColor(CYAN)
        c.rect(x + 28, y + height - 42, 42, 4, fill=1, stroke=0)
        base.paragraph(
            c,
            label,
            x + 28,
            y + height - 58,
            width - 56,
            base.ParagraphStyle(
                f"Visual{label}",
                parent=H2,
                fontSize=18,
                leading=22,
                textColor=white,
            ),
            100,
        )
        c.setFillColor(white)
        note_style = base.ParagraphStyle(
            f"VisualNote{label}",
            parent=BODY_SMALL,
            fontSize=7.2,
            leading=9,
            textColor=white,
        )
        base.paragraph(
            c,
            "Make and model confirmed at quotation stage.",
            x + 28,
            y + 39,
            width - 56,
            note_style,
            25,
        )


def product_page(c, page_number, data):
    page_header(c, "Product page", data["name"], page_number)
    section_title(c, data["category"], data["heading"], data["intro"])

    product_visual(c, 36, 448, 220, 178, data.get("image"), data["name"])
    card(c, 270, 526, 289, 100, "What is this product?", data["overview"], LIGHT)
    card(c, 270, 432, 289, 82, "Where is it used?", data["where_used"], white)

    col_w = (W - 72 - 16) / 3
    list_card(c, 36, 275, col_w, 145, "Typical applications", data["applications"], white)
    list_card(c, 36 + col_w + 8, 275, col_w, 145, "Key advantages", data["advantages"], LIGHT)
    list_card(
        c,
        36 + 2 * (col_w + 8),
        275,
        col_w,
        145,
        "Brands and sizes",
        data["brands_sizes"],
        white,
    )

    bottom_w = (W - 72 - 10) / 2
    list_card(c, 36, 92, bottom_w, 168, "Technical specifications", data["technical"], LIGHT)
    base.rounded(c, 36 + bottom_w + 10, 92, bottom_w, 168, white, MID)
    x2 = 36 + bottom_w + 24
    base.paragraph(c, "How to select the correct model", x2, 250, bottom_w - 28, H3, 30)
    base.paragraph(c, data["selection"], x2, 225, bottom_w - 28, BODY_SMALL, 55)
    base.paragraph(c, "Maintenance recommendations", x2, 181, bottom_w - 28, H3, 30)
    base.paragraph(c, data["maintenance"], x2, 157, bottom_w - 28, BODY_SMALL, 48)
    c.setFillColor(NAVY)
    c.roundRect(36, 39, W - 72, 39, 5, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Catalog-Bold", 8.2)
    c.drawString(50, 55, f"Related products: {data['related']}")
    c.drawRightString(W - 50, 55, "Request a Quotation  |  +91 9650086963")
    footer(c, page_number)
    c.showPage()


PRODUCTS = [
    {
        "name": "RO Membranes",
        "category": "Reverse osmosis",
        "heading": "RO membrane elements for industrial water treatment",
        "intro": "RO membranes are selected against feed-water analysis, permeate quality, recovery, operating pressure, fouling tendency, cleaning method, and plant configuration.",
        "image": "partners/hydranautics/products/ld-technology-ro-membranes.webp",
        "overview": "A reverse-osmosis membrane is a pressure-driven separation element used to reduce dissolved salts and other dissolved contaminants. Membrane choice affects permeate quality, recovery, pressure requirement, cleaning frequency, and operating cost.",
        "where_used": "Industrial and commercial RO plants, process-water systems, boiler-feed preparation, pharmaceutical water systems, power plants, and drinking-water treatment.",
        "applications": [
            "Brackish-water RO plants",
            "Boiler-feed water preparation",
            "Process-water polishing",
            "High-purity and reuse systems",
        ],
        "advantages": [
            "High salt rejection by model",
            "Options for low-fouling duties",
            "Commercial and industrial formats",
            "Datasheet-based model selection",
        ],
        "brands_sizes": [
            "Hydranautics membrane portfolio",
            "4 inch industrial elements",
            "8 inch industrial elements",
            "Other formats on enquiry",
        ],
        "technical": [
            "Confirm feed TDS and complete analysis",
            "Define permeate flow and recovery",
            "Check design pressure and temperature",
            "Review scaling and fouling limits",
            "Use manufacturer projection data",
        ],
        "selection": "Provide feed analysis, required permeate quality, capacity, recovery, array details, existing membrane model, and cleaning history. Replacement selection must verify dimensional and operating compatibility.",
        "maintenance": "Monitor normalized permeate flow, salt passage, and differential pressure. Follow the membrane manufacturer's flushing, cleaning, preservation, and chemical-compatibility instructions.",
        "related": "RO pressure vessels, antiscalant, cartridge filters, dosing pumps",
    },
    {
        "name": "RO Pressure Vessels",
        "category": "Membrane housings",
        "heading": "FRP pressure vessels for RO membrane installations",
        "intro": "Pressure-vessel selection must match membrane diameter, element count, operating pressure, port arrangement, connection sizes, skid layout, and service access.",
        "image": "partners/dax/products/ro-pressure-vessels.webp",
        "overview": "An RO pressure vessel is the pressure-retaining housing that contains membrane elements and directs feed, concentrate, and permeate flow. Correct sizing supports safe operation, sealing, membrane loading, and maintenance access.",
        "where_used": "Commercial RO skids, industrial RO plants, brackish-water systems, high-pressure membrane systems, process-water plants, and replacement projects.",
        "applications": [
            "Single and multi-element RO arrays",
            "Commercial RO systems",
            "Industrial brackish-water RO",
            "High-pressure project duties",
        ],
        "advantages": [
            "Corrosion-resistant FRP construction",
            "End-entry and side-entry options",
            "Multiple pressure ratings",
            "Serviceable head components",
        ],
        "brands_sizes": [
            "DAX pressure-vessel portfolio",
            "4 inch membrane housings",
            "8 inch membrane housings",
            "1 to 7 element configurations",
        ],
        "technical": [
            "Pressure options from 300 PSI",
            "Higher ratings up to 1800 PSI",
            "End-entry or side-entry ports",
            "Verify permeate-port arrangement",
            "Confirm thrust and mounting details",
        ],
        "selection": "Specify membrane size, number of elements, maximum operating pressure, port arrangement, feed and concentrate connections, permeate connection, mounting position, and required accessories.",
        "maintenance": "Inspect end closures, seals, ports, retaining components, and exterior condition during membrane service. Depressurize fully and follow the manufacturer's closure procedure before opening.",
        "related": "RO membranes, head assemblies, sealing plates, permeate ports",
    },
    {
        "name": "Dosing Pumps",
        "category": "Chemical dosing",
        "heading": "Metering pumps for controlled chemical addition",
        "intro": "Dosing pumps are specified by chemical, concentration, required flow, discharge pressure, turndown, suction condition, control method, wetted materials, and installation duty.",
        "image": "partners/seko/products/kosmo-mm2-dosing-pump.webp",
        "overview": "A dosing pump delivers a measured quantity of chemical into a water or process stream. The correct pump maintains dosing accuracy while resisting the chemical and operating pressure.",
        "where_used": "RO pretreatment, cooling towers, boiler-water treatment, drinking-water plants, wastewater plants, food processing, chemical plants, and process utilities.",
        "applications": [
            "Antiscalant dosing",
            "pH correction",
            "Chlorine and disinfectant dosing",
            "Coagulant and flocculant dosing",
        ],
        "advantages": [
            "Adjustable chemical feed rate",
            "Diaphragm and piston options",
            "Manual or automated control",
            "Multiple wetted-material choices",
        ],
        "brands_sizes": [
            "SEKO motor-driven pumps",
            "Tork hydraulic diaphragm range",
            "Kosmo mechanical diaphragm range",
            "Spring diaphragm and piston range",
        ],
        "technical": [
            "Flow is stated in L/h",
            "Discharge pressure is stated in bar",
            "Check turndown and stroke control",
            "Verify chemical compatibility",
            "Confirm power and control signal",
        ],
        "selection": "Provide chemical name and concentration, required maximum and minimum dose, discharge pressure, suction lift or flooded-suction condition, ambient temperature, control signal, and preferred materials.",
        "maintenance": "Inspect the diaphragm or packing, valves, seals, suction strainer, calibration column, and injection point. Keep recommended service kits and recalibrate after maintenance.",
        "related": "Chemical tanks, agitators, injection valves, controllers",
    },
    {
        "name": "Ultra Filtration Systems",
        "category": "Membrane filtration",
        "heading": "UF membrane products for pretreatment and reuse",
        "intro": "Ultrafiltration is applied where suspended solids, turbidity, and microorganisms must be reduced before reuse, RO treatment, or process use.",
        "image": "partners/fenton/products/uf-8585-ultrafiltration-membrane.webp",
        "overview": "An ultrafiltration membrane separates fine suspended matter using a defined pore structure. UF performance depends on influent quality, flux, transmembrane pressure, backwash, air scour, and chemical-cleaning practice.",
        "where_used": "RO pretreatment, surface-water treatment, industrial reuse, wastewater polishing, food and beverage utilities, commercial plants, and process-water systems.",
        "applications": [
            "RO pretreatment",
            "Turbidity and solids reduction",
            "Industrial water reuse",
            "Tertiary wastewater filtration",
        ],
        "advantages": [
            "Defined membrane pore size",
            "Compact filtration footprint",
            "Backwashable operation",
            "Stable treated-water quality",
        ],
        "brands_sizes": [
            "FENTON UF products",
            "UF 8585 membrane",
            "77 m2 membrane area",
            "System quantity by design flow",
        ],
        "technical": [
            "Nominal pore size: 0.03 um",
            "Design flux: 36-120 L/m2-h",
            "Confirm feed solids and turbidity",
            "Define backwash and CIP sequence",
            "Check operating temperature limits",
        ],
        "selection": "Provide feed-water analysis, suspended solids, turbidity, required filtrate quality, design flow, recovery target, operating hours, backwash-water availability, and cleaning constraints.",
        "maintenance": "Trend transmembrane pressure and normalized flow. Maintain backwash, chemically enhanced backwash, air scour, and CIP intervals based on actual fouling behaviour and manufacturer instructions.",
        "related": "MBR membranes, RO membranes, dosing systems, cartridge filters",
    },
    {
        "name": "FRP Vessels",
        "category": "Media filtration",
        "heading": "Composite vessels for filters and softeners",
        "intro": "FRP vessels are used as corrosion-resistant pressure bodies for media filtration, activated carbon treatment, softening, iron removal, and other packaged treatment units.",
        "image": None,
        "overview": "An FRP vessel contains filter media or ion-exchange resin under pressure. The vessel must be selected for media volume, freeboard, service flow, backwash flow, operating pressure, valve connection, and internal distribution.",
        "where_used": "Pressure sand filters, activated carbon filters, water softeners, iron-removal units, demineralization pretreatment, hotels, hospitals, commercial buildings, and industrial plants.",
        "applications": [
            "Pressure sand filtration",
            "Activated carbon filtration",
            "Water softening",
            "Iron-removal systems",
        ],
        "advantages": [
            "Corrosion-resistant construction",
            "Lower handling weight than steel",
            "Suitable for packaged systems",
            "Compatible valve and distributor options",
        ],
        "brands_sizes": [
            "Approved makes on enquiry",
            "Commercial vessel formats",
            "Industrial vessel formats",
            "Top and side connection options",
        ],
        "technical": [
            "Confirm vessel diameter and height",
            "Check working-pressure rating",
            "Define media and freeboard volume",
            "Verify service and backwash flow",
            "Match valve and distributor size",
        ],
        "selection": "Provide design flow, media type and quantity, inlet pressure, backwash rate, connection size, valve type, vessel orientation, available height, and operating temperature.",
        "maintenance": "Inspect external condition, base support, connections, valve adaptor, distributor, and leakage. Do not expose the vessel to vacuum, pressure shock, or conditions outside the selected model rating.",
        "related": "Multiport valves, filter media, distributors, dosing systems",
    },
    {
        "name": "Filter Cartridges",
        "category": "Pre-filtration",
        "heading": "Cartridge filters for particle removal and polishing",
        "intro": "Filter cartridges protect membranes, pumps, instruments, spray nozzles, and process equipment by removing suspended particles at a defined filtration stage.",
        "image": None,
        "overview": "A filter cartridge is a replaceable element installed in a compatible housing. Selection depends on particle size, dirt load, flow, pressure drop, fluid compatibility, temperature, dimensions, and required efficiency.",
        "where_used": "RO pretreatment, food processing, pharmaceutical utilities, drinking-water plants, chemical processing, cooling-water side streams, and final polishing.",
        "applications": [
            "RO guard filtration",
            "Process-water polishing",
            "Chemical and utility filtration",
            "Final particle control",
        ],
        "advantages": [
            "Defined micron-rating options",
            "Simple replacement procedure",
            "Multiple media constructions",
            "Standard and high-flow formats",
        ],
        "brands_sizes": [
            "Approved makes on enquiry",
            "10, 20, 30 and 40 inch lengths",
            "Standard and jumbo diameters",
            "DOE and model-specific end fittings",
        ],
        "technical": [
            "Specify nominal or absolute rating",
            "Confirm clean pressure drop",
            "Define maximum differential pressure",
            "Check material compatibility",
            "Match housing dimensions exactly",
        ],
        "selection": "Provide fluid, temperature, flow per housing, target particle size, upstream solids load, cartridge dimensions, end-cap style, gasket material, and existing make or model.",
        "maintenance": "Track differential pressure and replace cartridges at the approved terminal value. Clean the housing, inspect seals, prevent bypass, and record replacement frequency to identify upstream changes.",
        "related": "Cartridge housings, RO membranes, dosing pumps, filter media",
    },
    {
        "name": "Water Treatment Accessories",
        "category": "System accessories",
        "heading": "Components for operation, control, and maintenance",
        "intro": "Accessory selection must match the parent equipment, process chemistry, flow, pressure, signal type, connection standard, and maintenance requirement.",
        "image": "partners/dax/products/pressure-vessel-accessories.webp",
        "overview": "Water-treatment accessories include vessel internals, pressure-vessel parts, valves, instruments, sensors, controllers, chemical-injection parts, antiscalant, resin, and maintenance components.",
        "where_used": "RO plants, media filters, softeners, dosing skids, wastewater plants, commercial water systems, OEM packages, and replacement maintenance.",
        "applications": [
            "Pressure-vessel servicing",
            "Filter and softener control",
            "RO monitoring and protection",
            "Chemical dosing installation",
        ],
        "advantages": [
            "Supports correct system assembly",
            "Enables planned maintenance",
            "Improves monitoring and control",
            "Reduces replacement mismatch",
        ],
        "brands_sizes": [
            "DAX vessel accessories",
            "SEKO dosing accessories",
            "Other approved makes on enquiry",
            "Sizes matched to parent equipment",
        ],
        "technical": [
            "Confirm make, model and serial data",
            "Verify material and connection size",
            "Check pressure and temperature rating",
            "Specify electrical signal where relevant",
            "Use approved seals and service parts",
        ],
        "selection": "Send equipment photographs, nameplate details, existing part number, dimensions, material, connection standard, service fluid, and operating pressure. Drawings are recommended for non-standard replacements.",
        "maintenance": "Keep critical seals, valves, sensors, and service kits in planned stock. Inspect during scheduled shutdowns and replace parts using the parent manufacturer's assembly procedure.",
        "related": "RO vessels, dosing pumps, FRP vessels, controllers",
    },
]


def make_reviewed_catalog():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=A4)
    c.setTitle("ICONIC FILTRATION AND ENGINEERS LLP - Company Catalogue")
    c.setAuthor("ICONIC FILTRATION AND ENGINEERS LLP")
    c.setSubject("Water filtration products, industrial components, and engineering support")

    # Cover
    cover_image(c, asset("images/homepage-filtration-hero-1600.jpg"))
    c.saveState()
    c.setFillColor(Color(0.02, 0.08, 0.16, alpha=0.84))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.restoreState()
    base.rounded(c, 36, H - 142, 112, 88, white, white, 6)
    base.contain(c, asset("brand/iconic-filtration-logo-384.png"), 45, H - 134, 94, 72)
    c.setFillColor(CYAN)
    c.setFont("Catalog-Bold", 9)
    c.drawString(36, H - 198, "COMPANY AND PRODUCT CATALOGUE")
    cover_style = base.ParagraphStyle("ReviewedCover", parent=TITLE, fontSize=32, leading=37, textColor=white)
    base.paragraph(c, "Water Filtration Products and Engineering Support", 36, H - 225, W - 95, cover_style, 150)
    sub_style = base.ParagraphStyle("ReviewedSub", parent=BODY_WHITE, fontSize=13, leading=19)
    base.paragraph(
        c,
        "RO membranes, pressure vessels, dosing pumps, ultrafiltration products, FRP vessels, filter cartridges, and water-treatment accessories.",
        36,
        H - 340,
        W - 130,
        sub_style,
        100,
    )
    c.setFillColor(CYAN)
    c.rect(36, 128, 170, 3, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Catalog-Bold", 10)
    c.drawString(36, 104, "ICONIC FILTRATION AND ENGINEERS LLP")
    c.setFont("Catalog", 9)
    c.drawString(36, 85, "Supplier of Water Filtration Products | Industrial Components")
    c.drawString(36, 66, "Delhi | Noida | Pan India Supply | International Supply")
    c.showPage()

    # 1 Company introduction
    page_header(c, "Company introduction", "Product supply for water-treatment projects", 2)
    section_title(
        c,
        "ICONIC FILTRATION",
        "Water filtration products with technical and commercial support",
        "ICONIC FILTRATION AND ENGINEERS LLP supplies water-treatment products and industrial components to OEMs, EPC companies, consultants, distributors, commercial treatment companies, and plant users.",
    )
    card(
        c,
        36,
        470,
        W - 72,
        132,
        "Business scope",
        "Our work covers product identification, application review, quotation, documentation, order coordination, quality inspection, dispatch, and after-sales clarification. Product recommendations are prepared against the information supplied by the customer and the available manufacturer data.",
        LIGHT,
    )
    items = [
        ("Products", "RO membranes, pressure vessels, dosing pumps, UF products, FRP vessels, cartridges, and accessories."),
        ("Customers", "OEMs, EPC contractors, consultants, distributors, plant engineering teams, and procurement departments."),
        ("Supply", "Pan India supply with international supply available against confirmed commercial and logistics requirements."),
        ("Registration", "MSME Registered. Registration documentation can be shared during vendor approval or commercial discussion."),
    ]
    cell_w = (W - 72 - 12) / 2
    for i, (title, text) in enumerate(items):
        x = 36 + (i % 2) * (cell_w + 12)
        y = 335 - (i // 2) * 112
        card(c, x, y, cell_w, 96, title, text)
    c.setFillColor(NAVY)
    c.roundRect(36, 82, W - 72, 100, 6, fill=1, stroke=0)
    c.setFillColor(CYAN)
    c.setFont("Catalog-Bold", 8)
    c.drawString(52, 158, "OFFICES AND COVERAGE")
    base.paragraph(
        c,
        "Delhi Office | Noida Branch Office<br/>Supply coverage: Pan India and international markets<br/>Phone: +91 9650086963 | Email: sales@iconicfiltration.com",
        52,
        143,
        W - 104,
        BODY_WHITE,
        75,
    )
    footer(c, 2)
    c.showPage()

    # 2 Why choose
    page_header(c, "Company capability", "Why buyers work with ICONIC FILTRATION", 3)
    section_title(
        c,
        "SUPPLY AND SUPPORT",
        "Defined responsibilities from enquiry to dispatch",
        "The following services support technical review and procurement. Final product suitability remains subject to confirmed operating data and manufacturer documentation.",
    )
    reasons = [
        ("Application Review", "Review of water source, duty, flow, pressure, chemistry, installation limits, and required product function."),
        ("Manufacturer Data", "Product catalogues, model information, drawings, and available technical documents are shared for customer review."),
        ("Quotation Detail", "Quotations identify the product, make, model or description, quantity, commercial terms, and available delivery information."),
        ("Quality Inspection", "Order details, visible condition, quantity, and packing readiness are checked before dispatch where applicable."),
        ("Delivery Coordination", "Dispatch planning is coordinated against destination, material readiness, transporter availability, and agreed terms."),
        ("After-Sales Support", "The team remains available for documentation, replacement identification, installation clarification, and product-related follow-up."),
    ]
    cell_w = (W - 72 - 12) / 2
    for i, (title, text) in enumerate(reasons):
        x = 36 + (i % 2) * (cell_w + 12)
        y = 485 - (i // 2) * 122
        card(c, x, y, cell_w, 105, title, text, LIGHT if i % 2 else white)
    c.setFillColor(NAVY)
    c.roundRect(36, 80, W - 72, 110, 6, fill=1, stroke=0)
    base.paragraph(c, "Request Technical Consultation", 52, 164, 245, H2, 35)
    base.paragraph(
        c,
        "Send the application, capacity, water analysis, preferred make, required quantity, delivery location, and timeline.",
        52,
        135,
        330,
        BODY_WHITE,
        55,
    )
    c.setFillColor(white)
    c.setFont("Catalog-Bold", 9)
    c.drawRightString(W - 52, 112, "+91 9650086963")
    footer(c, 3)
    c.showPage()

    # 3 Partner brands
    page_header(c, "Partner brands", "Manufacturer product portfolio", 4)
    section_title(
        c,
        "BRAND INFORMATION",
        "Products supplied against approved makes and available catalogues",
        "Brand, model, specification, availability, and commercial terms are confirmed for each enquiry. Logos and trademarks remain the property of their respective owners.",
    )
    brands = [
        ("partners/hydranautics/logo.png", "Hydranautics", "RO membrane products, including LD Technology, CPA Family, and PRO Series catalogue references."),
        ("partners/dax/logo.png", "DAX", "RO pressure vessels and pressure-vessel accessories for commercial and industrial membrane systems."),
        ("partners/seko/logo.png", "SEKO", "Motor-driven dosing pumps covering hydraulic diaphragm, mechanical diaphragm, and piston pump ranges."),
        ("partners/fenton/logo.png", "FENTON", "Ultrafiltration membranes, hollow-fiber MBR membranes, and industrial oil-skimming products."),
        ("partners/chemsel/logo.jpeg", "CHEMSEL", "Brand logo received. Product models will be listed after the approved product catalogue is supplied."),
    ]
    for i, (logo, name, text) in enumerate(brands):
        y = 548 - i * 100
        base.rounded(c, 36, y, W - 72, 84, white if i % 2 == 0 else LIGHT, MID)
        base.rounded(c, 50, y + 12, 135, 60, white, MID)
        base.contain(c, asset(logo), 60, y + 20, 115, 44, 3)
        base.paragraph(c, name, 205, y + 65, 130, H3, 30)
        base.paragraph(c, text, 205, y + 43, W - 257, BODY_SMALL, 50)
    c.setFillColor(MUTED)
    c.setFont("Catalog", 7.5)
    c.drawString(36, 63, "Product availability and authorization status should be confirmed for each transaction and territory.")
    footer(c, 4)
    c.showPage()

    # 4 Product categories
    page_header(c, "Product categories", "Products supplied for treatment systems", 5)
    section_title(
        c,
        "PRODUCT INDEX",
        "Seven product groups covered in this catalogue",
        "Each product page gives the information normally required to start technical selection. Final selection is based on the project data, approved make, and manufacturer limits.",
    )
    categories = [
        ("RO Membranes", "Salt-rejection membrane elements for industrial and commercial RO systems."),
        ("RO Pressure Vessels", "FRP membrane housings for 4 inch and 8 inch membrane elements."),
        ("Dosing Pumps", "Metering pumps for controlled chemical addition in water and process systems."),
        ("Ultra Filtration Systems", "UF membrane products for pretreatment, solids reduction, and water reuse."),
        ("FRP Vessels", "Composite pressure vessels for media filters, softeners, and ion-exchange systems."),
        ("Filter Cartridges", "Replaceable elements for membrane protection, particle removal, and polishing."),
        ("Water Treatment Accessories", "Valves, internals, instruments, dosing parts, vessel parts, and maintenance items."),
    ]
    for i, (title, text) in enumerate(categories):
        row, col = divmod(i, 2)
        width = (W - 72 - 12) / 2
        if i == 6:
            x, width = 36, W - 72
        else:
            x = 36 + col * (width + 12)
        y = 525 - row * 112
        card(c, x, y, width, 96, title, text, LIGHT if row % 2 else white)
    c.setFillColor(NAVY)
    c.roundRect(36, 75, W - 72, 85, 6, fill=1, stroke=0)
    base.paragraph(
        c,
        "For quotation: provide product or brand, application, flow or capacity, quantity, delivery location, timeline, and available drawings or BOQ.",
        52,
        136,
        W - 104,
        BODY_WHITE,
        60,
    )
    footer(c, 5)
    c.showPage()

    for page_number, product in enumerate(PRODUCTS, start=6):
        product_page(c, page_number, product)

    # 6 Industries
    page_header(c, "Industries served", "Water-treatment applications by sector", 13)
    section_title(
        c,
        "APPLICATIONS",
        "Product supply for plant, utility, and process-water duties",
        "Selection requirements differ by sector. Water analysis, process duty, treated-water target, operating schedule, and site standards should be provided with the enquiry.",
    )
    industries = [
        ("Pharmaceutical", "RO and pretreatment components for utility, process, and purified-water preparation."),
        ("Food & Beverage", "Filtration and dosing components for ingredient water, cleaning, utilities, and process support."),
        ("Chemical", "Compatible membrane, vessel, filtration, and dosing products for process and utility duties."),
        ("Textile", "Pretreatment, process-water preparation, wastewater filtration, and reuse support."),
        ("Power Plants", "RO membranes, cartridges, dosing equipment, and pretreatment components for boiler-feed systems."),
        ("Hotels & Hospitals", "Commercial filtration, softening, RO, dosing, and utility-water components."),
        ("Manufacturing", "Filtration and water-handling products for equipment protection, utilities, and reuse."),
        ("Commercial Buildings", "Pressure filtration, softening, RO, and water-distribution support products."),
        ("Water Treatment Plants", "Components and documentation support for OEM, EPC, municipal, industrial, and reuse projects."),
    ]
    cell_w = (W - 72 - 16) / 3
    for i, (title, text) in enumerate(industries):
        x = 36 + (i % 3) * (cell_w + 8)
        y = 510 - (i // 3) * 145
        card(c, x, y, cell_w, 128, title, text, LIGHT if (i // 3) % 2 else white)
    footer(c, 13)
    c.showPage()

    # 7 Technical support
    page_header(c, "Technical support", "Information required for product selection", 14)
    section_title(
        c,
        "ENGINEERING GUIDANCE",
        "Technical inputs reduce selection and quotation errors",
        "Incomplete operating data can lead to incorrect sizing or incompatible products. The information below should be included where relevant.",
    )
    support = [
        ("Water and Process Data", ["Feed-water analysis", "Temperature and solids load", "Required treated-water quality", "Operating hours and recovery"]),
        ("Hydraulic Data", ["Design and peak flow", "Operating and maximum pressure", "Suction condition", "Connection size and standard"]),
        ("Equipment Data", ["Existing make and model", "Nameplate and serial number", "GA drawing or P&ID", "Photographs and dimensions"]),
        ("Commercial Data", ["Required quantity", "Delivery location", "Project timeline", "Inspection and documentation needs"]),
    ]
    cell_w = (W - 72 - 12) / 2
    for i, (title, items) in enumerate(support):
        x = 36 + (i % 2) * (cell_w + 12)
        y = 445 - (i // 2) * 180
        list_card(c, x, y, cell_w, 160, title, items, LIGHT if i % 2 else white)
    c.setFillColor(NAVY)
    c.roundRect(36, 84, W - 72, 145, 6, fill=1, stroke=0)
    c.setFillColor(CYAN)
    c.setFont("Catalog-Bold", 8)
    c.drawString(52, 205, "SUPPORT AVAILABLE")
    base.paragraph(
        c,
        "Technical consultation | Engineering guidance | Product documentation | Quality inspection | Dispatch coordination | After-sales support",
        52,
        187,
        W - 104,
        BODY_WHITE,
        55,
    )
    c.setFillColor(white)
    c.setFont("Catalog-Bold", 9)
    c.drawString(52, 119, "Request Product Catalogue")
    c.drawRightString(W - 52, 119, "sales@iconicfiltration.com")
    footer(c, 14)
    c.showPage()

    # 8 Quotation process and contact
    page_header(c, "Quotation and contact", "Send a complete technical enquiry", 15)
    section_title(
        c,
        "QUOTATION PROCESS",
        "Five steps from enquiry to after-sales support",
        "A complete enquiry helps the team confirm product scope, obtain manufacturer information, and prepare the commercial response.",
    )
    steps = [
        ("1. Requirement Review", "Application, operating data, brand preference, quantity, location, and timeline are checked."),
        ("2. Product Identification", "The available make, model, configuration, accessories, and documents are reviewed."),
        ("3. Quotation", "The quotation records product scope, quantity, commercial terms, and available delivery information."),
        ("4. Inspection and Dispatch", "Material, visible condition, quantity, packing, and dispatch readiness are checked where applicable."),
        ("5. After-Sales Support", "Product documents, replacement identification, and technical clarification remain available after supply."),
    ]
    for i, (title, text) in enumerate(steps):
        y = 535 - i * 88
        base.rounded(c, 36, y, W - 72, 72, white if i % 2 == 0 else LIGHT, MID)
        c.setFillColor(CYAN)
        c.circle(58, y + 36, 13, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont("Catalog-Bold", 8)
        c.drawCentredString(58, y + 33, str(i + 1))
        base.paragraph(c, title, 82, y + 54, 170, H3, 30)
        base.paragraph(c, text, 245, y + 53, W - 297, BODY_SMALL, 48)
    c.setFillColor(NAVY)
    c.roundRect(36, 65, W - 72, 118, 6, fill=1, stroke=0)
    c.setFillColor(CYAN)
    c.setFont("Catalog-Bold", 8)
    c.drawString(52, 158, "REQUEST A QUOTATION")
    c.setFillColor(white)
    c.setFont("Catalog-Bold", 10)
    c.drawString(52, 136, "+91 9650086963  |  sales@iconicfiltration.com")
    c.setFont("Catalog", 8.2)
    c.drawString(52, 115, "Delhi: Plot No. 928, Pocket-C, Paper Market, Ghazi Pur, New Delhi - 110096")
    c.drawString(52, 96, "Noida: Office No. 008, Aastha Greens, Greater Noida West, Uttar Pradesh - 201318")
    footer(c, 15)
    c.showPage()

    c.save()


if __name__ == "__main__":
    make_reviewed_catalog()

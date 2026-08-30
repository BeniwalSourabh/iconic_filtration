export const companyContact = {
  name: "ICONIC FILTRATION AND ENGINEERS LLP",
  phoneNumbers: [
    {
      label: "Primary",
      display: "+91 9650086963",
      href: "tel:+919650086963",
      whatsappHref: "https://wa.me/919650086963",
    },
    {
      label: "Alternate",
      display: "+91 9555599688",
      href: "tel:+919555599688",
      whatsappHref: "https://wa.me/919555599688",
    },
  ],
  phoneDisplay: "+91 9650086963 / +91 9555599688",
  phoneHref: "tel:+919650086963",
  email: "sales@iconicfiltration.com",
  emailHref: "mailto:sales@iconicfiltration.com",
  whatsappHref: "https://wa.me/919650086963",
  serviceArea: ["India", "International"],
  offices: [
    {
      id: "delhi",
      title: "Delhi Office",
      lines: ["Plot No. 928, Pocket-C,", "Paper Market,", "Ghazi Pur,", "New Delhi - 110096"],
      streetAddress: "Plot No. 928, Pocket-C, Paper Market, Ghazi Pur",
      addressLocality: "New Delhi",
      addressRegion: "Delhi",
      postalCode: "110096",
      mapEmbedHref:
        "https://maps.google.com/maps?q=Plot%20No.%20928%2C%20Pocket-C%2C%20Paper%20Market%2C%20Ghazi%20Pur%2C%20New%20Delhi%20110096&t=&z=15&ie=UTF8&iwloc=&output=embed",
      directionsHref:
        "https://www.google.com/maps/search/?api=1&query=Plot%20No.%20928%2C%20Pocket-C%2C%20Paper%20Market%2C%20Ghazi%20Pur%2C%20New%20Delhi%20110096",
    },
    {
      id: "noida",
      title: "Noida Branch Office",
      lines: [
        "Office No. 008,",
        "Aastha Greens,",
        "Greater Noida West,",
        "Gautam Buddha Nagar,",
        "Uttar Pradesh - 201318",
      ],
      streetAddress: "Office No. 008, Aastha Greens, Greater Noida West, Gautam Buddha Nagar",
      addressLocality: "Greater Noida West",
      addressRegion: "Uttar Pradesh",
      postalCode: "201318",
      mapEmbedHref:
        "https://maps.google.com/maps?q=Office%20No.%20008%2C%20Aastha%20Greens%2C%20Greater%20Noida%20West%2C%20Gautam%20Buddha%20Nagar%2C%20Uttar%20Pradesh%20201318&t=&z=15&ie=UTF8&iwloc=&output=embed",
      directionsHref:
        "https://www.google.com/maps/search/?api=1&query=Office%20No.%20008%2C%20Aastha%20Greens%2C%20Greater%20Noida%20West%2C%20Gautam%20Buddha%20Nagar%2C%20Uttar%20Pradesh%20201318",
    },
  ],
} as const;

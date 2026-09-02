/** Locked 11 money-page copy. Titles/H1s/metas match the approved spec table. No street address. */
"use strict";

const BOOK = "https://book.ariablackcarservice.com/book";
const PHONE = "(888) 402-8202";

const LOCKED_SLUGS = [
  "airport-transfer",
  "hourly",
  "executive-car-service",
  "corporate-shuttle",
  "point-to-point",
  "long-distance",
  "wedding",
  "cruise-terminal",
  "sightseeing-tours",
  "sporting-events",
];

const pages = {
  "airport-transfer": {
    title: "Airport Transfer",
    metaTitle: "JFK, LaGuardia & Newark Airport Car Service | Aria",
    h1: "NYC Airport Car Service",
    desc: "Car service to JFK, LaGuardia, and Newark. Flat-rate NYC airport transfers with flight tracking and meet-and-greet. Book 24/7.",
    related: ["hourly", "corporate-shuttle", "long-distance"],
    faqs: [
      {
        q: "How much is JFK car service to Manhattan?",
        a: "Aria's sedan flat rate is $165 Manhattan ↔ JFK, $250 for an SUV. That includes tolls, flight tracking, terminal meet-and-greet, and 60 minutes wait. Gratuity, tax, and card processing show as separate lines at checkout. No surge.",
      },
      {
        q: "LaGuardia and Newark?",
        a: "Manhattan ↔ LaGuardia is $140 sedan / $220 SUV. Manhattan ↔ Newark is $180 sedan / $275 SUV. Same inclusions.",
      },
      {
        q: "Is black car better than Uber from the airport?",
        a: "Aria's rate is locked at booking and does not spike in weather, rush hour, or holidays. You get flight tracking, an inside-terminal meet, a guaranteed vehicle class, and a TLC-licensed chauffeur. During peak times the total is often comparable to rideshare, without the surge.",
      },
      {
        q: "Do you wait if the flight is late?",
        a: "Yes. We track the flight and adjust pickup. Complimentary airport wait is 60 minutes.",
      },
    ],
    bodyHtml: `
        <p class="lead">Need a car at JFK, LaGuardia, or Newark tonight? Book Aria's NYC airport transfer and lock a flat rate before you fly. No surge. Your chauffeur tracks the flight, meets you inside the terminal with a name sign, and waits 60 minutes complimentary.</p>
        <p>Aria Black Car Service runs airport transfers 24/7 to and from JFK, LaGuardia (LGA), Newark Liberty (EWR), Teterboro (TEB), Westchester (HPN), Long Island MacArthur (ISP), and Stewart (SWF). Pickup is door-to-door in Manhattan, Brooklyn, Queens, the Bronx, Staten Island, Long Island, Westchester, Fairfield County CT, and Northern NJ.</p>
        <p><strong>Book now:</strong> <a href="${BOOK}">book.ariablackcarservice.com/book</a> · Call ${PHONE} · Email <a href="mailto:info@ariablackcarservice.com">info@ariablackcarservice.com</a></p>
        <h2>Airport flat rates — Manhattan</h2>
        <table class="pricing-table">
          <thead><tr><th>Route</th><th>Sedan</th><th>SUV</th></tr></thead>
          <tbody>
            <tr><td>Manhattan ↔ JFK</td><td>$165</td><td>$250</td></tr>
            <tr><td>Manhattan ↔ LaGuardia</td><td>$140</td><td>$220</td></tr>
            <tr><td>Manhattan ↔ Newark</td><td>$180</td><td>$275</td></tr>
            <tr><td>Manhattan ↔ Teterboro</td><td>$180</td><td>$275</td></tr>
            <tr><td>Manhattan ↔ Westchester (HPN)</td><td>$200</td><td>$295</td></tr>
            <tr><td>Manhattan ↔ Long Island MacArthur</td><td>$275</td><td>$370</td></tr>
            <tr><td>Manhattan ↔ Stewart</td><td>$350</td><td>$445</td></tr>
            <tr><td>Brooklyn ↔ JFK</td><td>$165</td><td>$250</td></tr>
          </tbody>
        </table>
        <p>Base rates include your TLC-licensed chauffeur, fuel, standard tolls, flight tracking, bottled water, and Wi-Fi. Gratuity (20%), NYS sales tax (8.87%), and card processing (3.5%) are itemized at checkout before you confirm. Airport flats apply within NYC's five boroughs; trips beyond are distance-priced. Instant quote online.</p>
        <h2>How JFK car service actually works</h2>
        <ol class="steps-list">
          <li>Reserve online at least 12 hours ahead, or call ${PHONE} for pickups inside 12 hours. We recommend 24 hours for airport trips.</li>
          <li>Enter your flight number. Dispatch monitors the flight and moves pickup if you land early or late. You do not need to call if the plane is delayed.</li>
          <li>After landing, your chauffeur is inside the terminal with a name sign — not curbside. 60 minutes complimentary wait at the airport.</li>
          <li>Luggage is loaded. You ride in the vehicle you booked: Mercedes-Benz E-Class sedan, Cadillac Escalade, Mercedes-Benz S-Class, or Executive Sprinter (up to 12 passengers).</li>
        </ol>
        <p>Same flow for LaGuardia and Newark, all terminals.</p>
        <h2>Which vehicle for the airport</h2>
        <ul class="check-list">
          <li><strong>Mercedes-Benz E-Class</strong> — executive sedan, 3 passengers, 3 bags. Standard JFK / LGA / EWR sedan rate.</li>
          <li><strong>Cadillac Escalade</strong> — luxury SUV, 6 passengers, 6 bags. Families, extra luggage, car seats.</li>
          <li><strong>Mercedes-Benz S-Class</strong> — flagship sedan, 3 passengers, 3 bags.</li>
          <li><strong>Executive Sprinter</strong> — 12 passengers, 10 bags. Crews, families, golf bags.</li>
        </ul>
        <p>Infant, toddler, and booster seats are free when requested at booking. Give the child's age and weight so the right seat is installed before pickup.</p>
        <h2>When this page is the wrong booking</h2>
        <ul class="check-list">
          <li>Several stops or a chauffeur on standby after landing: book <a href="/services/hourly">hourly car service</a> (3-hour minimum; Sprinter 5 hours).</li>
          <li>Recurring employee or client airport runs: open a <a href="/services/corporate-shuttle">corporate account</a>.</li>
          <li>A pier drop after the airport: <a href="/services/cruise-terminal">cruise terminal transfers</a>.</li>
          <li>One address to another with no airport: <a href="/services/point-to-point">point-to-point</a>.</li>
        </ul>
    `,
  },

  hourly: {
    title: "Hourly Chauffeur",
    metaTitle: "Hourly Chauffeur Service NYC | Aria",
    h1: "Hourly Car Service NYC",
    desc: "Hourly car service in NYC for meetings, events, and multi-stop days. Sedan, SUV, and Sprinter by the hour. Call (888) 402-8202.",
    related: ["airport-transfer", "executive-car-service", "point-to-point"],
    faqs: [
      {
        q: "How much is hourly car service in NYC?",
        a: "From $90/hr for a business sedan with a 3-hour minimum. SUV from $125/hr. S-Class $175/hr. Sprinter $200/hr with a 5-hour minimum.",
      },
      {
        q: "Hourly or airport flat?",
        a: "Airport pickup with a straight drop to one address is an airport transfer (Manhattan ↔ JFK sedan $165). Book hourly if you want the chauffeur after the airport for more stops.",
      },
      {
        q: "Where do you operate?",
        a: "Five NYC boroughs, Long Island, Westchester, Fairfield County CT, and Northern NJ (Hoboken, Jersey City, Fort Lee, Morristown). Longer days into the Hamptons, Boston, Philadelphia, or DC: see long-distance or ask for a custom hourly quote.",
      },
    ],
    bodyHtml: `
        <p class="lead">Book hourly car service NYC when you need the same chauffeur for a stretch of the day, not a single drop. Aria's hourly chauffeur stays with you between meetings, fittings, site visits, and dinners. The clock starts at pickup. The rate does not surge.</p>
        <p>Use hourly for a Midtown roadshow, a shopping day, a photographer's itinerary, client dinners with unknown end times, or a full-day executive hire. If you only need one address to another, <a href="/services/point-to-point">point-to-point</a> is usually cheaper. If the day has three or more stops, or you want the car waiting, hourly is the booking.</p>
        <p><strong>Book now:</strong> <a href="${BOOK}">book.ariablackcarservice.com/book</a> · ${PHONE} · <a href="mailto:info@ariablackcarservice.com">info@ariablackcarservice.com</a></p>
        <h2>Hourly chauffeur rates</h2>
        <table class="pricing-table">
          <thead><tr><th>Vehicle</th><th>Rate</th><th>Minimum</th></tr></thead>
          <tbody>
            <tr><td>Business / executive sedan (Mercedes-Benz E-Class)</td><td>$90/hr</td><td>3 hours</td></tr>
            <tr><td>Business / premium SUV (Cadillac Escalade)</td><td>$125/hr</td><td>3 hours</td></tr>
            <tr><td>First Class SUV</td><td>$150/hr</td><td>3 hours</td></tr>
            <tr><td>First Class sedan (Mercedes-Benz S-Class)</td><td>$175/hr</td><td>3 hours</td></tr>
            <tr><td>Executive Sprinter (up to 12 passengers)</td><td>$200/hr</td><td>5 hours</td></tr>
          </tbody>
        </table>
        <p>Rates include the chauffeur, fuel, standard tolls, bottled water, and Wi-Fi. Gratuity (20%), NYS sales tax (8.87%), and card processing (3.5%) are itemized at checkout. No surge in rush hour, weather, or holidays.</p>
        <h2>What a booked hour covers</h2>
        <p>Your chauffeur is assigned to you for the reserved block. You can add stops as you go inside the metro area. The car waits while you are inside. That is the difference from a one-way airport or <a href="/services/point-to-point">point-to-point</a> trip.</p>
        <p>Sightseeing by the hour is a separate page: <a href="/services/sightseeing-tours">private NYC tours</a> in 4, 6, or 8-hour blocks. Weddings and venue timelines: <a href="/services/wedding">wedding transportation</a>. Stadium and arena nights: <a href="/services/sporting-events">sporting events</a>.</p>
        <h2>Vehicle capacity</h2>
        <ul class="check-list">
          <li><strong>E-Class sedan</strong> — 3 passengers, 3 bags. Typical for one executive plus an assistant.</li>
          <li><strong>Escalade</strong> — 6 passengers, 6 bags.</li>
          <li><strong>S-Class</strong> — 3 passengers, 3 bags. Flagship sedan.</li>
          <li><strong>Sprinter</strong> — 12 passengers, 10 bags, 5-hour minimum. Crews, production days, family groups.</li>
        </ul>
        <p>Child seats are complimentary when requested at booking.</p>
        <h2>How to book hourly car service in NYC</h2>
        <ol class="steps-list">
          <li>Request a quote online or call ${PHONE}. Online reservations need at least 12 hours' notice; same-day is phone-only, 24/7.</li>
          <li>Choose sedan, SUV, or Sprinter from passenger and luggage count. Lock the hourly block (3 hours minimum; Sprinter 5).</li>
          <li>Confirmation includes the locked rate and assigned chauffeur.</li>
          <li>Overtime, if you run long, is billed at the same hourly rate. Ask dispatch before the clock runs out if you need to extend.</li>
        </ol>
        <p>For standing weekly hours or a travel manager's calendar, use <a href="/services/corporate-shuttle">corporate car service</a> with monthly billing.</p>
    `,
  },

  "executive-car-service": {
    title: "Executive Car Service",
    metaTitle: "Executive Car Service NYC | Aria",
    h1: "Executive Car Service in NYC",
    desc: "Executive car service in NYC for private, discreet travel. Dedicated chauffeur, sedan or SUV, flat-rate. Book 24/7.",
    related: ["airport-transfer", "hourly", "corporate-shuttle"],
    faqs: [
      {
        q: "How much does executive car service cost in NYC?",
        a: "Airport sedans from $140. Hourly from $90/hr (3-hour minimum). S-Class hourly is $175/hr. Request a flat quote at booking. No surge.",
      },
      {
        q: "Can you sign an NDA?",
        a: "Yes, on request. Say so when you book or when you open a corporate account.",
      },
      {
        q: "Who is this for?",
        a: "Principals, visiting clients, and anyone who wants a guaranteed vehicle class and a professional chauffeur. For shuttles, monthly billing, and trip reporting, use corporate car service.",
      },
    ],
    bodyHtml: `
        <p class="lead">Executive car service in NYC with Aria means a named TLC-licensed chauffeur, the vehicle class you reserved, and a rate that does not move after booking. Assistants and travel managers use this page for principals who need a discreet sedan or SUV, not a random black car.</p>
        <p>Book an E-Class or S-Class for one to three passengers. Book an Escalade when there are more people or bags. Every car is late-model, black, and detailed. Book an S-Class, get an S-Class.</p>
        <p>NDA-ready on request. Chauffeurs are TLC-licensed, background-checked, drug-tested, and trained in executive protocol.</p>
        <p><strong>Book now:</strong> <a href="${BOOK}">book.ariablackcarservice.com/book</a> · ${PHONE} · <a href="mailto:info@ariablackcarservice.com">info@ariablackcarservice.com</a></p>
        <h2>How executives actually book</h2>
        <ul class="check-list">
          <li><strong>Airport:</strong> <a href="/services/airport-transfer">JFK, LaGuardia, and Newark</a> with flight tracking, inside-terminal meet-and-greet, and 60 minutes wait. Manhattan sedan from $140 (LGA) / $165 (JFK) / $180 (EWR).</li>
          <li><strong>By the hour:</strong> <a href="/services/hourly">hourly chauffeur</a> from $90/hr, 3-hour minimum, for back-to-back meetings.</li>
          <li><strong>One address to another:</strong> <a href="/services/point-to-point">point-to-point</a> with an instant online quote.</li>
          <li><strong>Firm or team travel:</strong> <a href="/services/corporate-shuttle">corporate accounts</a> with net-30 billing and a dedicated account manager.</li>
          <li><strong>Private aviation:</strong> Teterboro from $180 sedan / $275 SUV; Westchester (HPN) from $200 sedan.</li>
        </ul>
        <h2>Fleet (as published)</h2>
        <table class="pricing-table">
          <thead><tr><th>Vehicle</th><th>Role</th><th>Passengers</th><th>Bags</th></tr></thead>
          <tbody>
            <tr><td>Mercedes-Benz E-Class</td><td>Executive sedan</td><td>3</td><td>3</td></tr>
            <tr><td>Cadillac Escalade</td><td>Luxury SUV</td><td>6</td><td>6</td></tr>
            <tr><td>Mercedes-Benz S-Class</td><td>Flagship sedan</td><td>3</td><td>3</td></tr>
            <tr><td>Executive Sprinter</td><td>Groups</td><td>12</td><td>10</td></tr>
          </tbody>
        </table>
        <p>Included on every trip: chauffeur, standard tolls, bottled water, Wi-Fi, phone chargers, luggage assistance. Airport trips add flight tracking and meet-and-greet. Gratuity, tax, and card fees are listed before you pay.</p>
        <h2>What we will not do on this page</h2>
        <p>We will not promise a vehicle we do not list, a rate that is not already on the site, or a credential we cannot verify. Same-day executive pickups are real: call ${PHONE}. Online booking needs 12 hours. For a 24-hour airport reservation, book the night before.</p>
    `,
  },

  "corporate-shuttle": {
    title: "Corporate Shuttle",
    metaTitle: "Corporate Car Service & Shuttle NYC | Aria",
    h1: "Corporate Car Service in NYC",
    desc: "Corporate car service and shuttle in NYC. Executive sedans, SUVs, and Sprinters with account billing. Call (888) 402-8202.",
    related: ["executive-car-service", "airport-transfer", "hourly"],
    faqs: [
      {
        q: "Do you replace Uber for Business?",
        a: "For firms that want flat billing, a consistent vehicle, and a chauffeur who meets clients inside the airport, yes. That is the comparison already on Aria's site.",
      },
      {
        q: "How much does corporate shuttle cost?",
        a: "Sprinter hourly is $200/hr with a 5-hour minimum. Sedan airport transfers start at $140. Individual trips can also be distance-priced. Your account manager quotes standing routes.",
      },
      {
        q: "Service area for employees and clients?",
        a: "NYC five boroughs, Long Island, Westchester, Fairfield County CT, Northern NJ (Hoboken, Jersey City, Fort Lee, Morristown), plus long-distance to Boston, Philadelphia, DC, and the Hamptons.",
      },
    ],
    bodyHtml: `
        <p class="lead">Open a corporate car service account with Aria if your office is still booking rideshare for clients, partners, and staff. You get consolidated monthly billing (net-30), a dedicated account manager, volume discounts, priority booking, and trip reporting for finance. Rates are flat. They do not surge.</p>
        <p>Use this for daily executive travel, standing shuttle routes, airport programs, and client transportation. Vehicles: executive sedans, Escalades, and Executive Sprinters (up to 12 passengers) for office-to-office or office-to-airport shuttles.</p>
        <p><strong>Start an account or book a trip:</strong> <a href="${BOOK}">book.ariablackcarservice.com/book</a> · ${PHONE} · <a href="mailto:info@ariablackcarservice.com">info@ariablackcarservice.com</a></p>
        <h2>What the corporate account includes</h2>
        <ul class="check-list">
          <li>Monthly consolidated billing, net-30</li>
          <li>Dedicated account manager</li>
          <li>Volume discounts</li>
          <li>Priority booking</li>
          <li>Detailed trip reporting</li>
          <li>TLC-licensed, background-checked, drug-tested chauffeurs</li>
          <li>Guaranteed vehicle class (no vehicle lottery)</li>
          <li>24/7 dispatch</li>
        </ul>
        <p>Travel managers and executive assistants use the same booking flow as a one-off: online with 12+ hours' notice, or phone for same-day. The difference is billing and a named contact who already knows your passengers, preferred vehicles, and regular addresses.</p>
        <h2>Shuttle vs. sedan vs. hourly</h2>
        <ul class="check-list">
          <li><strong>Sedan / SUV trips</strong> — one or two principals, airports, hotel-to-office. Airport flats: Manhattan ↔ LGA $140 / JFK $165 / EWR $180 sedan.</li>
          <li><strong>Hourly</strong> — roadshows and multi-stop days from $90/hr, 3-hour minimum. See <a href="/services/hourly">hourly car service</a>.</li>
          <li><strong>Sprinter shuttle</strong> — up to 12 passengers, $200/hr, 5-hour minimum. Office moves, offsites, airport crews.</li>
          <li><strong>Executive / VIP</strong> — S-Class, NDA on request: <a href="/services/executive-car-service">executive car service</a>.</li>
        </ul>
        <p>Pharma and investor roadshows with tight back-to-back schedules are already a published Aria service. Ask your account manager for multi-vehicle staging.</p>
        <h2>How to set it up</h2>
        <ol class="steps-list">
          <li>Call ${PHONE} or email <a href="mailto:info@ariablackcarservice.com">info@ariablackcarservice.com</a> and ask for a corporate account.</li>
          <li>Send typical routes (airports, offices, hotels), vehicle mix, and billing contacts.</li>
          <li>Employees and assistants book against the account. Finance gets one monthly invoice and trip reports instead of a pile of rideshare receipts.</li>
        </ol>
        <p>Until the account is live, anyone can still book a single trip at the published flat rates.</p>
    `,
  },

  "point-to-point": {
    title: "Point-to-Point",
    metaTitle: "Point-to-Point Car Service NYC | Aria",
    h1: "Point-to-Point Car Service in NYC",
    desc: "Point-to-point car service in NYC and the tri-state area. Address-to-address, flat quote, no surge. Book online.",
    related: ["airport-transfer", "hourly", "long-distance"],
    faqs: [
      {
        q: "Do you publish a Manhattan-to-Brooklyn price on this page?",
        a: "No. Point-to-point is distance-priced with an instant quote. Airport and long-distance routes have their own tables.",
      },
    ],
    bodyHtml: `
        <p class="lead">Need a car from one address to another in New York? Book Aria's point-to-point car service and get a distance-based fare before the chauffeur is assigned. Instant quote online. The rate is locked at booking. No surge in rush hour, weather, or holidays.</p>
        <p>This is the page for a hotel-to-office drop, a dinner reservation, a Brooklyn-to-Midtown run, or any two pins that are not an airport, a cruise pier, or a full-day hourly hire.</p>
        <p><strong>Book now:</strong> <a href="${BOOK}">book.ariablackcarservice.com/book</a> · ${PHONE} · <a href="mailto:info@ariablackcarservice.com">info@ariablackcarservice.com</a></p>
        <h2>When to book point-to-point vs something else</h2>
        <ul class="check-list">
          <li><strong>One pickup, one drop, no airport:</strong> this page. Quote is distance-based.</li>
          <li><strong>JFK, LaGuardia, Newark, Teterboro, Westchester:</strong> <a href="/services/airport-transfer">NYC airport transfer</a> — published Manhattan flats (JFK sedan $165, LGA $140, EWR $180).</li>
          <li><strong>Several stops or the car waiting:</strong> <a href="/services/hourly">hourly car service NYC</a> from $90/hr, 3-hour minimum.</li>
          <li><strong>Boston, Philadelphia, DC, Hamptons, Montauk:</strong> <a href="/services/long-distance">long distance car service</a> with published route flats.</li>
          <li><strong>Manhattan or Brooklyn cruise pier:</strong> <a href="/services/cruise-terminal">cruise terminal</a>.</li>
        </ul>
        <h2>What's on every trip</h2>
        <p>TLC-licensed chauffeur, standard tolls, bottled water, Wi-Fi, phone chargers, luggage assistance. Gratuity (20%), NYS sales tax (8.87%), and card processing (3.5%) are itemized at checkout. Child seats are free when requested at booking.</p>
        <p>Vehicles: Mercedes-Benz E-Class (3 passengers / 3 bags), Cadillac Escalade (6 / 6), Mercedes-Benz S-Class (3 / 3), Executive Sprinter (12 / 10).</p>
        <h2>How to book</h2>
        <ol class="steps-list">
          <li>Enter pickup and drop-off at <a href="${BOOK}">book.ariablackcarservice.com/book</a> or call ${PHONE}.</li>
          <li>Choose sedan, SUV, or Sprinter from passenger and luggage count.</li>
          <li>Lock the quoted fare. Online needs 12 hours' notice; same-day is phone-only, 24/7.</li>
        </ol>
        <p>Service area: five NYC boroughs, Long Island, Westchester, Fairfield County CT, Northern NJ (Hoboken, Jersey City, Fort Lee, Morristown).</p>
    `,
  },

  "long-distance": {
    title: "Long Distance",
    metaTitle: "Long Distance Car Service NYC | Aria",
    h1: "Long Distance Car Service in NYC",
    desc: "Long distance car service from NYC to Boston, Philadelphia, DC, and the Hamptons. Private sedan or SUV. Get a flat quote.",
    related: ["point-to-point", "airport-transfer", "hourly"],
    faqs: [
      {
        q: "Is Manhattan → Hamptons a flat?",
        a: "Yes: $515 sedan / $560 SUV. If your exact town is not the published Hamptons/Montauk row, use the instant quote.",
      },
    ],
    bodyHtml: `
        <p class="lead">Book long distance car service NYC when the destination is outside the five boroughs and you want a private car, not a train platform. Aria publishes sedan and SUV flats to Boston, Philadelphia, Washington DC, the Hamptons, Montauk, Atlantic City, Greenwich, Princeton, and New Haven. Rate is locked at booking. No surge.</p>
        <p>Chauffeur, fuel, and standard tolls are in the base rate. Gratuity (20%), NYS sales tax (8.87%), and card processing (3.5%) show as separate lines before you confirm.</p>
        <p><strong>Book now:</strong> <a href="${BOOK}">book.ariablackcarservice.com/book</a> · ${PHONE} · <a href="mailto:info@ariablackcarservice.com">info@ariablackcarservice.com</a></p>
        <h2>Published long-distance flats</h2>
        <table class="pricing-table">
          <thead><tr><th>Route</th><th>Sedan</th><th>SUV</th></tr></thead>
          <tbody>
            <tr><td>NYC → Boston</td><td>$955</td><td>$1,025</td></tr>
            <tr><td>NYC → Philadelphia</td><td>$475</td><td>$520</td></tr>
            <tr><td>NYC → Washington DC</td><td>$1,015</td><td>$1,085</td></tr>
            <tr><td>NYC → The Hamptons</td><td>$515</td><td>$560</td></tr>
            <tr><td>NYC → Montauk</td><td>$575</td><td>$625</td></tr>
            <tr><td>NYC → Atlantic City</td><td>$595</td><td>$645</td></tr>
            <tr><td>NYC → Greenwich CT</td><td>$215</td><td>$245</td></tr>
            <tr><td>NYC → Princeton NJ</td><td>$295</td><td>$330</td></tr>
            <tr><td>NYC → New Haven CT</td><td>$415</td><td>$455</td></tr>
          </tbody>
        </table>
        <p>Hamptons weekend traffic is why people book this instead of driving. Same reason for a Boston or DC day trip with luggage: you leave from the door, not Penn Station.</p>
        <h2>Vehicle</h2>
        <ul class="check-list">
          <li>Mercedes-Benz E-Class — 3 passengers, 3 bags</li>
          <li>Cadillac Escalade — 6 passengers, 6 bags</li>
          <li>Mercedes-Benz S-Class — 3 passengers, 3 bags</li>
          <li>Executive Sprinter — 12 passengers, 10 bags (ask dispatch; Sprinter is quoted, not in the sedan/SUV table)</li>
        </ul>
        <p>For a chauffeur who stays at the destination and runs errands, use <a href="/services/hourly">hourly</a> or ask for a custom quote on top of the one-way flat. A single drop with no wait is this page. A trip that starts or ends at JFK/LGA/EWR is an <a href="/services/airport-transfer">airport transfer</a> plus the long-distance leg — ask dispatch to price the full itinerary.</p>
        <h2>How to book</h2>
        <p>Online with 12+ hours' notice, or ${PHONE} for same-day. Recommend 24 hours on Boston, DC, and Hamptons Friday routes.</p>
    `,
  },

  wedding: {
    title: "Wedding Transportation",
    metaTitle: "NYC Wedding Transportation | Aria",
    h1: "NYC Wedding Transportation",
    desc: "NYC wedding transportation with coordinated sedans, SUVs, and Sprinters. Timeline-based pickup for the wedding party.",
    related: ["hourly", "point-to-point", "airport-transfer"],
    faqs: [
      {
        q: "How much is wedding transportation in NYC?",
        a: "There is no separate wedding package price on the site. You pay published hourly rates (sedan from $90/hr, 3-hour min; Sprinter $200/hr, 5-hour min) or a distance quote for a one-way. Ask for the timeline quote when you book.",
      },
    ],
    bodyHtml: `
        <p class="lead">Book wedding transportation NYC with Aria when the day has a timeline, not a single rideshare ping. Escalades and Sprinters, coordinated multi-vehicle pickups, and a dispatcher who holds the ceremony-to-cocktail-to-reception clock. TLC-licensed chauffeurs. Rate locked when you book. No surge because it is Saturday.</p>
        <p>Aria's live site flags 1–2 weeks' notice for weddings and special events. Online booking still needs 12 hours; inside 12 hours call ${PHONE}. Do not wait until the rehearsal dinner.</p>
        <p><strong>Book now:</strong> <a href="${BOOK}">book.ariablackcarservice.com/book</a> · ${PHONE} · <a href="mailto:info@ariablackcarservice.com">info@ariablackcarservice.com</a></p>
        <h2>What gets booked for a wedding</h2>
        <ul class="check-list">
          <li><strong>Cadillac Escalade</strong> — 6 passengers, 6 bags. Couple, parents, small bridal party.</li>
          <li><strong>Executive Sprinter</strong> — 12 passengers, 10 bags. Wedding party, hotel-to-venue shuttle. Hourly Sprinter is $200/hr with a 5-hour minimum.</li>
          <li><strong>Mercedes-Benz E-Class or S-Class</strong> — 3 passengers. Couple's car for portraits or a quiet transfer. Sedan hourly from $90/hr (E-Class) or $175/hr (S-Class), 3-hour minimum. Escalade hourly $125/hr.</li>
        </ul>
        <p>Most wedding days are hourly, not a one-way drop, because the car waits at the venue. If you only need hotel → ceremony and everyone else is on their own, <a href="/services/point-to-point">point-to-point</a> can cover that one leg.</p>
        <p>Getting-ready in Brooklyn, ceremony in Manhattan, reception on Long Island: say so when you book. Multi-vehicle timelines are already how Aria describes this service.</p>
        <h2>What's included</h2>
        <p>Chauffeur, standard tolls, bottled water, Wi-Fi, luggage assistance. Gratuity, tax, and card fees itemized at checkout. Child seats free if you have flower-girl / ring-bearer seats to request.</p>
        <p>Airport arrivals the day before: <a href="/services/airport-transfer">NYC airport transfer</a>. Out-of-town guests to the Hamptons or Greenwich: <a href="/services/long-distance">long distance</a>.</p>
        <h2>How to book</h2>
        <ol class="steps-list">
          <li>Call or email with date, venues, headcount, and whether you need one car or a shuttle plus a couple's car.</li>
          <li>We confirm vehicles and a locked rate (hourly block or listed flats where they apply).</li>
          <li>Day-of contact number for the planner or maid of honor goes to dispatch.</li>
        </ol>
    `,
  },

  "cruise-terminal": {
    title: "Cruise Terminal",
    metaTitle: "Manhattan Cruise Terminal Car Service | Aria",
    h1: "NYC Cruise Terminal Transfers",
    desc: "Car service to Manhattan cruise terminals (and Brooklyn piers) with luggage help. Meet at the pier, flat-rate, 24/7.",
    related: ["airport-transfer", "point-to-point", "hourly"],
    faqs: [
      {
        q: "Do you serve Brooklyn as well as Manhattan?",
        a: "Yes. Aria's cruise page is door-to-pier for Manhattan and Brooklyn cruise terminals.",
      },
      {
        q: "Can you take a family plus luggage?",
        a: "Escalade for 6 passengers / 6 bags, Sprinter for 12 / 10. Child seats free when requested.",
      },
    ],
    bodyHtml: `
        <p class="lead">Book Manhattan cruise terminal car service with Aria when you need a car at the pier, not a taxi line with six bags. Door-to-pier transfers for Manhattan and Brooklyn cruise terminals, luggage assistance, TLC-licensed chauffeur. Same company that does JFK: flight tracking if you are coming from the airport, then a second drop at the ship if that is the itinerary.</p>
        <p>Tell dispatch which terminal — Manhattan or Brooklyn — and whether the car is hotel → pier, home → pier, or airport → pier. Brooklyn and Manhattan are both on Aria's published cruise service. The primary booking on this page is the Manhattan cruise terminal; Brooklyn is the other pier we already run.</p>
        <p><strong>Book now:</strong> <a href="${BOOK}">book.ariablackcarservice.com/book</a> · ${PHONE} · <a href="mailto:info@ariablackcarservice.com">info@ariablackcarservice.com</a></p>
        <h2>How the pier transfer works</h2>
        <ol class="steps-list">
          <li>Reserve 24 hours ahead when you can. Online minimum is 12 hours; same-day is ${PHONE}, 24/7.</li>
          <li>Pack passenger count and bag count into the vehicle choice: E-Class 3/3, Escalade 6/6, S-Class 3/3, Sprinter 12/10.</li>
          <li>Chauffeur meets you at the hotel, home, or inside the airport terminal (meet-and-greet and 60 minutes wait on airport legs).</li>
          <li>Drop at the cruise terminal curb with luggage handed off.</li>
        </ol>
        <p>If the day is hotel → pier → (later) return, that is usually two point-to-point trips or an <a href="/services/hourly">hourly</a> block so the same car can come back at disembarkation. Sail-day traffic around the west side terminals is why a locked fare beats a surge app.</p>
        <p>Airport + pier same day: book the <a href="/services/airport-transfer">airport transfer</a> and tell dispatch the cruise terminal as the drop, or book hourly if there are extra stops.</p>
        <h2>What's included</h2>
        <p>Chauffeur, standard tolls, bottled water, Wi-Fi, luggage assistance. Airport legs add flight tracking and inside-terminal meet. Gratuity 20%, tax 8.87%, card 3.5% itemized. No surge.</p>
        <p>There is no separate cruise-only rate table on the site. Manhattan cruise terminal car service is quoted as point-to-point (or as an airport flat if the other pin is JFK/LGA/EWR within the five boroughs). Use the instant quote or call.</p>
    `,
  },

  "sightseeing-tours": {
    title: "Private Chauffeur Tours",
    metaTitle: "Private Chauffeur Tour NYC | Aria",
    h1: "Private Chauffeur Tours in NYC",
    desc: "Private chauffeur-led NYC touring by the hour. Multi-stop itineraries in a sedan, SUV, or Sprinter.",
    related: ["hourly", "executive-car-service", "point-to-point"],
    faqs: [
      {
        q: "Is this an hourly car or a ticketed tour?",
        a: "Hourly chauffeur tours. You hire the car and driver. You are not buying a group-bus seat.",
      },
    ],
    bodyHtml: `
        <p class="lead">Book a private chauffeur tour with Aria when you want a car and a TLC-licensed driver for a set block of hours — not a hop-on bus. Aria already sells 4, 6, and 8-hour private itineraries with a local chauffeur. You choose the hours. The chauffeur stays with the car. No surge.</p>
        <p>Pricing is the published hourly table, not a separate tour menu.</p>
        <p><strong>Book now:</strong> <a href="${BOOK}">book.ariablackcarservice.com/book</a> · ${PHONE} · <a href="mailto:info@ariablackcarservice.com">info@ariablackcarservice.com</a></p>
        <h2>How to price a chauffeur tour</h2>
        <p>Use <a href="/services/hourly">hourly rates</a>:</p>
        <table class="pricing-table">
          <thead><tr><th>Vehicle</th><th>Rate</th><th>Minimum</th><th>4 hours</th><th>6 hours</th><th>8 hours</th></tr></thead>
          <tbody>
            <tr><td>Business sedan (E-Class)</td><td>$90/hr</td><td>3 hours</td><td>$360</td><td>$540</td><td>$720</td></tr>
            <tr><td>Business SUV (Escalade)</td><td>$125/hr</td><td>3 hours</td><td>$500</td><td>$750</td><td>$1,000</td></tr>
            <tr><td>First Class SUV</td><td>$150/hr</td><td>3 hours</td><td>$600</td><td>$900</td><td>$1,200</td></tr>
            <tr><td>S-Class</td><td>$175/hr</td><td>3 hours</td><td>$700</td><td>$1,050</td><td>$1,400</td></tr>
            <tr><td>Executive Sprinter (12 pax)</td><td>$200/hr</td><td>5 hours</td><td>—</td><td>$1,200</td><td>$1,600</td></tr>
          </tbody>
        </table>
        <p>4-hour Sprinter is below the 5-hour minimum — book 5 hours or pick a sedan/SUV. Totals above are rate × hours (base). Gratuity 20%, NYS tax 8.87%, and card 3.5% are added at checkout. Fuel and standard tolls are in the base rate.</p>
        <p>You bring the itinerary (or ask the chauffeur for a local sequence). Aria's live copy is private NYC tours with a professional local chauffeur and 4, 6, or 8-hour curated itineraries. We are not inventing named landmark packages that are not on the site.</p>
        <p>If the day leaves the city — North Fork, Hudson Valley, or a longer hourly block — say so when you book. That can overlap <a href="/services/long-distance">long-distance</a>.</p>
        <h2>How to book</h2>
        <p>Online 12+ hours out, or call ${PHONE}. Same-day is phone-only. Child seats free on request.</p>
    `,
  },

  "sporting-events": {
    title: "Sporting Events",
    metaTitle: "NYC Sporting Events Car Service | Aria",
    h1: "NYC Sporting Events Car Service",
    desc: "Car service to NYC sporting events: MSG, Yankee Stadium, MetLife, Barclays Center. Pickup and wait. Book ahead.",
    related: ["hourly", "point-to-point", "corporate-shuttle"],
    faqs: [
      {
        q: "Do rates jump after a Knicks or Yankees game?",
        a: "No. Aria's published policy is no surge in rush hour, weather, or holidays. You pay the quote you locked.",
      },
    ],
    bodyHtml: `
        <p class="lead">Book sporting events car service NYC when the game lets out with everyone else and you do not want a surge pin. Aria runs transfers to Madison Square Garden, Yankee Stadium, MetLife Stadium, Barclays Center, and the US Open. TLC chauffeur, locked rate, no surge on game night or holidays.</p>
        <p>Two ways to book:</p>
        <ul class="check-list">
          <li><strong>Drop-off only:</strong> <a href="/services/point-to-point">point-to-point</a> with an instant quote to the venue.</li>
          <li><strong>Car waits, or you want the same chauffeur at the final whistle:</strong> <a href="/services/hourly">hourly</a> from $90/hr, 3-hour minimum (Sprinter $200/hr, 5-hour minimum).</li>
        </ul>
        <p><strong>Book now:</strong> <a href="${BOOK}">book.ariablackcarservice.com/book</a> · ${PHONE} · <a href="mailto:info@ariablackcarservice.com">info@ariablackcarservice.com</a></p>
        <h2>Venues on the live Aria page</h2>
        <p>Madison Square Garden · Yankee Stadium · MetLife Stadium · Barclays Center · US Open</p>
        <p>We are not adding arenas that are not on the site. If your event is elsewhere in the five boroughs, Westchester, or Northern NJ, it is still a normal point-to-point or hourly booking — call dispatch.</p>
        <h2>Vehicle</h2>
        <p>E-Class 3/3, Escalade 6/6, S-Class 3/3, Sprinter 12/10 for a suite group. Child seats free when requested.</p>
        <p>Corporate boxes and client nights: <a href="/services/corporate-shuttle">corporate account</a> for net-30 billing. Wedding-adjacent (ceremony then a game) is two bookings or one hourly block — ask.</p>
        <h2>How to book</h2>
        <p>Give the venue, puck/first-pitch/gate time, pickup address, and whether the chauffeur should wait. Online 12+ hours; same-day ${PHONE}. Recommend 24 hours for playoff and US Open sessions.</p>
    `,
  },
};

module.exports = { BOOK, PHONE, LOCKED_SLUGS, pages };

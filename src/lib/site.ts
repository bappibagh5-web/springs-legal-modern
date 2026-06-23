export const SITE = {
  name: "The Kohn Law Firm",
  tagline: "Colorado Springs Criminal Defense & Family Law",
  phone: "1-719-482-8092",
  phoneHref: "tel:+17194828092",
  email: "shimon@kohn.law",
  emailHref: "mailto:shimon@kohn.law",
  city: "Colorado Springs, CO",
};

export type ServiceItem = {
  slug: string;
  title: string;
  blurb: string;
  body: string[];
  whatToExpect?: string[];
};

export type ServiceCategory = {
  slug: string;
  title: string;
  short: string;
  intro: string;
  items: ServiceItem[];
};

export const CATEGORIES: ServiceCategory[] = [
  {
    slug: "criminal-defense",
    title: "Criminal Defense",
    short: "Aggressive defense for misdemeanor and felony charges across El Paso County.",
    intro:
      "We defend clients facing charges from minor offenses to serious felonies. Our team builds strong strategies to protect your freedom and future. From a first-time misdemeanor to the most serious felony allegations, our firm stands between you and the State of Colorado. We investigate every charge independently, challenge weak evidence, and build a defense designed to protect your freedom, your record, and your future. Founded in 2003 by former 4th Judicial District Attorney Shimon Kohn, The Kohn Law Firm brings prosecutorial insight to every case — we know how the State builds a case because we have built them ourselves. That perspective changes how we investigate evidence, cross-examine witnesses, and negotiate with prosecutors. Whether the charge involves a traffic stop that escalated, an allegation by a former partner, a financial investigation that has been building for months, or a violent felony with serious time on the line, the same principles apply: respond fast, prepare relentlessly, and tell the truth — even when the truth is hard. We treat every case as if it is going to trial, because that is the only way to negotiate from genuine strength. When the State sees a defense file that is organized, witnesses that are prepared, and motions that are filed on time, the conversation about resolution changes entirely. If trial is the right answer, we are ready for it. If a negotiated outcome serves you better, we have the leverage to get one worth taking.",
    items: [
      { slug: "misdemeanor-crimes", title: "Misdemeanor Crimes", blurb: "Protect your record from charges that follow you for life.",
        body: ["A misdemeanor conviction can affect employment, housing, and professional licensing for years. We treat every misdemeanor as serious — because to your future, it is.",
               "We handle DUI, assault, trespass, harassment, disorderly conduct, and other misdemeanor matters in municipal, county, and district courts throughout Colorado."],
        whatToExpect: ["Confidential case review", "Pre-trial motion strategy", "Plea negotiation or trial defense", "Sealing & expungement when eligible"] },
      { slug: "financial-crimes", title: "Financial Crimes", blurb: "Defense for fraud, embezzlement, and white-collar allegations.",
        body: ["Financial crime investigations move quietly — often long before charges are filed. Early counsel can change the entire trajectory of the case.",
               "We defend allegations of fraud, identity theft, forgery, embezzlement, money laundering, and tax-related offenses, working with forensic accountants when needed."] },
      { slug: "sexual-assault", title: "Sexual Assault", blurb: "Discreet, experienced defense for the most sensitive allegations.",
        body: ["A sexual assault accusation can upend your life before any court ever weighs the evidence. We move quickly to preserve witnesses, digital records, and your right to be heard.",
               "Our defense is grounded in thorough investigation, careful motion practice, and trial readiness from day one."] },
      { slug: "burglary", title: "Burglary", blurb: "Felony exposure demands a felony-level defense.",
        body: ["Colorado treats burglary as a serious felony — even when nothing is taken. The State must prove unlawful entry and intent, and both elements can be challenged.",
               "We scrutinize the search, the identification, and the alleged intent that elevates a trespass into a burglary charge."] },
      { slug: "domestic-violence", title: "Domestic Violence", blurb: "Mandatory arrest does not have to mean a mandatory conviction.",
        body: ["Colorado's mandatory-arrest rules mean officers often take someone into custody before the facts are fully known. A protection order, a job, and custody can be at risk within hours.",
               "We move quickly on bond conditions, no-contact orders, and the underlying charges themselves."] },
      { slug: "felony-crimes", title: "Felony Crimes", blurb: "Class 1 through Class 6 felony defense across Colorado.",
        body: ["Felony charges carry the threat of prison, parole, and a lifelong record. We prepare every felony case as if it is going to trial — because that is the only way to negotiate from strength.",
               "Our practice includes drug felonies, weapons offenses, violent felonies, and serious property crimes."] },
      { slug: "theft", title: "Theft", blurb: "From petty theft to aggravated theft of $100,000+.",
        body: ["Colorado's theft statute covers everything from shoplifting to complex schemes involving employers, contracts, and trust accounts. The class of charge — and the penalty — turns on dollar amount and intent.",
               "We negotiate restitution, challenge valuations, and pursue diversion where possible to keep convictions off your record."] },
      { slug: "sexual-offenses", title: "Sexual Offenses", blurb: "Defense across the full range of sex-offense charges.",
        body: ["Sex-offense convictions carry registration, indeterminate sentencing, and lifetime supervision. The defense must be as serious as the consequences.",
               "We handle indecent exposure, unlawful sexual contact, internet sting cases, and related allegations with the discretion they demand."] },
      { slug: "crimes-against-a-person", title: "Crimes Against a Person", blurb: "Assault, menacing, kidnapping, and related charges.",
        body: ["When the State alleges you harmed or threatened another person, every fact matters: who started it, what was said, and what the evidence actually shows.",
               "We defend assault in all degrees, menacing, false imprisonment, and second-degree kidnapping."] },
      { slug: "murder-attempted-murder", title: "Murder / Attempted Murder", blurb: "The highest-stakes defense work we do.",
        body: ["A homicide charge is the most serious accusation the State can bring. We assemble investigators, forensic experts, and trial counsel immediately.",
               "Our work covers first- and second-degree murder, manslaughter, criminally negligent homicide, and attempt charges."] },
      { slug: "sexual-assault-on-a-child", title: "Sexual Assault on a Child", blurb: "Sensitive, aggressive defense when stakes could not be higher.",
        body: ["These charges carry indeterminate sentencing, lifetime registration, and irreversible reputational harm. The defense must begin before charges are even filed where possible.",
               "We work with experts in forensic interviewing, child psychology, and digital forensics."] },
      { slug: "sexual-exploitation-of-a-child", title: "Sexual Exploitation of a Child", blurb: "Federal-grade defense for state and federal exploitation charges.",
        body: ["Possession, distribution, or production allegations frequently begin with a digital search warrant. Every byte of that warrant is open to challenge.",
               "We engage independent digital forensics and litigate suppression motions aggressively."] },
    ],
  },
  {
    slug: "family-law",
    title: "Family Law",
    short: "Clear-eyed counsel for divorce, custody, and family transitions.",
    intro:
      "Family law touches everything that matters most: your children, your home, and your financial future. We bring the same preparation and discipline we use in the courtroom to negotiated resolutions whenever possible — and to contested hearings when necessary.",
    items: [
      { slug: "divorce-separation", title: "Divorce & Separation", blurb: "Contested and uncontested dissolution in Colorado.",
        body: ["Colorado is a no-fault divorce state, but that does not make the process simple. Property division, maintenance, and parenting plans all require careful negotiation.",
               "We guide you through temporary orders, disclosures, mediation, and — if needed — trial."] },
      { slug: "adoption", title: "Adoption", blurb: "Step-parent, kinship, and private adoption matters.",
        body: ["Adoption permanently changes the legal relationship between parent and child. Done right, it brings security and peace of mind.",
               "We handle step-parent adoptions, kinship adoptions, and the legal steps needed to terminate prior parental rights when applicable."] },
      { slug: "child-support", title: "Child Support", blurb: "Establishing, enforcing, and modifying support orders.",
        body: ["Colorado calculates child support using statutory worksheets, but the inputs — income, overnights, health insurance — are often disputed.",
               "We make sure the numbers reflect reality, and we return to court when life circumstances change."] },
      { slug: "allocation-of-parental-responsibilities", title: "Allocation of Parental Responsibilities", blurb: "Decision-making and parenting time, with or without a divorce.",
        body: ["APR cases address legal decision-making and parenting time for unmarried parents or after divorce. The standard is always the best interests of the child.",
               "We prepare detailed parenting plans and litigate disputed schedules when necessary."] },
    ],
  },
  {
    slug: "protection-orders",
    title: "Protection Orders",
    short: "Petition for or defend against TPOs and PPOs in Colorado courts.",
    intro:
      "Protection orders can change where you live, where you work, and who you can see. Whether you need protection or are defending against an order, the hearing happens fast — and the record lasts.",
    items: [
      { slug: "permanent-protection-order", title: "Permanent Protection Order (PPO)", blurb: "Final hearings that set lasting restrictions.",
        body: ["A Permanent Protection Order can remain in effect indefinitely and shows up on background checks. The evidentiary hearing is your one opportunity to present the full story.",
               "We prepare witnesses, exhibits, and cross-examination strategy for every PPO hearing we take."] },
      { slug: "temporary-protection-order", title: "Temporary Protection Order (TPO)", blurb: "Emergency relief — or an emergency defense.",
        body: ["A TPO can be issued ex parte and enforced within hours. The return hearing is typically set within 14 days.",
               "We move quickly to either secure or contest the order before it becomes permanent."] },
    ],
  },
];

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Team", to: "/team" },
  { label: "Contact", to: "/contact" },
] as const;

export function findCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}
export function findService(catSlug: string, itemSlug: string) {
  const cat = findCategory(catSlug);
  return { category: cat, item: cat?.items.find((i) => i.slug === itemSlug) };
}

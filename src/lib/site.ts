export const SITE = {
  name: "The Kohn Law Firm",
  tagline: "Colorado Springs Criminal Defense & Family Law",
  phone: "719-328-9555",
  phoneHref: "tel:+17193289555",
  email: "contact@kohn.law",
  emailHref: "mailto:contact@kohn.law",
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
      "We defend clients facing charges from minor offenses to serious felonies. Our team builds strong strategies to protect your freedom and future. From a first-time misdemeanor to the most serious felony allegations, our firm stands between you and the State of Colorado. We investigate every charge independently, challenge weak evidence, and build a defense designed to protect your freedom, your record, and your future. Founded in 2003 by former 4th Judicial Deputy District Attorney Shimon Kohn, The Kohn Law Firm brings prosecutorial insight to every case — we know how the State builds a case because we have built them ourselves. That perspective changes how we investigate evidence, cross-examine witnesses, and negotiate with prosecutors. Whether the charge involves a traffic stop that escalated, an allegation by a former partner, a financial investigation that has been building for months, or a violent felony with serious time on the line, the same principles apply: respond fast, prepare relentlessly, and tell the truth — even when the truth is hard. We treat every case as if it is going to trial, because that is the only way to negotiate from genuine strength. When the State sees a defense file that is organized, witnesses that are prepared, and motions that are filed on time, the conversation about resolution changes entirely. If trial is the right answer, we are ready for it. If a negotiated outcome serves you better, we have the leverage to get one worth taking.",
    items: [
      {
        slug: "misdemeanor-crimes",
        title: "Misdemeanor Crimes",
        blurb: "Protect your record from charges that follow you for life.",
        body: [
          "A misdemeanor conviction can affect employment, housing, professional licensing, and immigration status for years after the case closes. We treat every misdemeanor as serious — because to your future, it is.",
          "Our office handles DUI, DWAI, assault in the third degree, trespass, harassment, disorderly conduct, theft, and other misdemeanor matters in municipal, county, and district courts throughout Colorado. We appear regularly in El Paso, Teller, Pueblo, Fremont, and Douglas County courts.",
          "Most misdemeanors resolve through a combination of pre-trial motion work, careful negotiation with the assigned prosecutor, and — where it benefits you — a plea to a reduced charge or a deferred judgment that keeps a conviction off your record. When the case will not resolve fairly, we are ready to take it to trial. We also handle record sealing and expungement after the case is over, so a one-time mistake does not follow you for life.",
        ],
        whatToExpect: [
          "Confidential case review",
          "Pre-trial motion strategy",
          "Plea negotiation or trial defense",
          "Sealing & expungement when eligible",
        ],
      },
      {
        slug: "financial-crimes",
        title: "Financial Crimes",
        blurb: "Defense for fraud, embezzlement, and white-collar allegations.",
        body: [
          "Financial crime investigations move quietly — often long before charges are filed. Subpoenas, search warrants, and grand-jury inquiries can build for months before anyone is publicly charged. Early counsel can change the entire trajectory of the case, sometimes preventing charges altogether.",
          "We defend allegations of fraud, identity theft, forgery, embezzlement, money laundering, tax-related offenses, and complex theft schemes involving employers, contracts, and trust accounts. We work with forensic accountants and digital-forensics experts to test the State's numbers and reconstruct the actual financial record.",
          "Because financial cases turn on documents, organization is everything. We build a defense file that mirrors the State's discovery, identifies the weak links in the chain of evidence, and gives the court a clear, alternative story when the facts support one.",
        ],
      },
      {
        slug: "sexual-assault",
        title: "Sexual Assault",
        blurb: "Discreet, experienced defense for the most sensitive allegations.",
        body: [
          "A sexual assault accusation can upend your life before any court ever weighs the evidence. Employment, housing, custody, and reputation can all be in jeopardy from the moment the allegation is made. We move quickly to preserve witnesses, digital records, and your right to be heard.",
          "Our defense is grounded in thorough investigation, careful motion practice, and trial readiness from day one. That includes work with forensic experts, retained investigators, and — where applicable — independent review of medical and digital evidence.",
          "We also pay close attention to collateral consequences. Even a non-conviction outcome can affect background checks, licensing, and parenting rights, and we plan for each of those issues from the start of the case.",
        ],
      },
      {
        slug: "burglary",
        title: "Burglary",
        blurb: "Felony exposure demands a felony-level defense.",
        body: [
          "Colorado treats burglary as a serious felony — even when nothing is taken. The State must prove unlawful entry and intent to commit a crime inside, and both elements can be challenged with the right investigation.",
          "We scrutinize the search, the identification procedures, the alleged intent that elevates a trespass into a burglary charge, and any statements made to police. Identification cases in particular often turn on how the witness was shown photos or how the suspect was first detained.",
          "When the facts support reduction to criminal trespass or another lesser charge, we make that case to the prosecutor. When they do not, we prepare the file for trial.",
        ],
      },
      {
        slug: "domestic-violence",
        title: "Domestic Violence",
        blurb: "Mandatory arrest does not have to mean a mandatory conviction.",
        body: [
          "Colorado's mandatory-arrest rules mean officers often take someone into custody before the facts are fully known. A protection order, a job, custody arrangements, and firearm rights can all be at risk within hours of the arrest.",
          "We move quickly on bond conditions, no-contact orders, and the underlying charges themselves. Where appropriate, we work with the alleged victim's counsel and the prosecutor's office to address the realities behind the report.",
          "Because the domestic-violence enhancer attaches to a wide range of underlying offenses, the defense strategy has to address both the surface charge and the enhancer. We do both at once.",
        ],
      },
      {
        slug: "felony-crimes",
        title: "Felony Crimes",
        blurb: "Class 1 through Class 6 felony defense across Colorado.",
        body: [
          "Felony charges carry the threat of prison, parole, and a lifelong record. We prepare every felony case as if it is going to trial — because that is the only way to negotiate from genuine strength.",
          "Our practice includes drug felonies, weapons offenses, violent felonies, serious property crimes, and habitual-offender filings. We litigate suppression motions aggressively when the search or the statement is questionable.",
          "Mandatory-sentencing statutes, parole eligibility, and the impact on civil rights all factor into how we evaluate any offered resolution. We make sure you understand exactly what a plea would mean — and what trial would mean — before you decide.",
        ],
      },
      {
        slug: "theft",
        title: "Theft",
        blurb: "From petty theft to aggravated theft of $100,000+.",
        body: [
          "Colorado's theft statute covers everything from shoplifting to complex schemes involving employers, contracts, and trust accounts. The class of charge — and the penalty — turns on dollar amount and intent, both of which can be contested.",
          "We negotiate restitution, challenge valuations, and pursue diversion where possible to keep convictions off your record. For employment-based allegations, we also pay attention to the parallel civil exposure and licensing impact.",
          "In aggregated theft cases, the State may attempt to combine several incidents into a single high-class felony. We push back on aggregation where the law and facts do not support it.",
        ],
      },
      {
        slug: "sexual-offenses",
        title: "Sexual Offenses",
        blurb: "Defense across the full range of sex-offense charges.",
        body: [
          "Sex-offense convictions carry registration, indeterminate sentencing, and lifetime supervision. The defense must be as serious as the consequences, and it must start immediately.",
          "We handle indecent exposure, unlawful sexual contact, internet sting cases, and related allegations with the discretion they demand. We also work with sex-offense evaluators and treatment providers where evaluations become part of the case.",
          "Where a non-registerable disposition is possible, we work toward it. Where it is not, we prepare for the hearing or trial that will decide the case.",
        ],
      },
      {
        slug: "crimes-against-a-person",
        title: "Crimes Against a Person",
        blurb: "Assault, menacing, kidnapping, and related charges.",
        body: [
          "When the State alleges you harmed or threatened another person, every fact matters: who started the incident, what was said, what the surveillance shows, and what the medical records actually document.",
          "We defend assault in all degrees, menacing, false imprisonment, second-degree kidnapping, and related charges. Self-defense, defense of others, and mutual-combat doctrines are often available — and often missed — without an aggressive defense investigation.",
          "We also handle the protection-order side of these cases, which frequently runs in parallel with the criminal charge.",
        ],
      },
      {
        slug: "murder-attempted-murder",
        title: "Murder / Attempted Murder",
        blurb: "The highest-stakes defense work we do.",
        body: [
          "A homicide charge is the most serious accusation the State can bring. We assemble investigators, forensic experts, and trial counsel immediately and begin building a defense from the day of the arrest.",
          "Our work covers first- and second-degree murder, manslaughter, criminally negligent homicide, and attempt charges. Shimon Kohn served as defense counsel on the last death-penalty case in Colorado after the moratorium passed.",
          "Homicide defense requires sustained, full-time attention. We staff these cases accordingly and treat them as our highest priority from start to finish.",
        ],
      },
      {
        slug: "sexual-assault-on-a-child",
        title: "Sexual Assault on a Child",
        blurb: "Sensitive, aggressive defense when stakes could not be higher.",
        body: [
          "These charges carry indeterminate sentencing, lifetime registration, and irreversible reputational harm. The defense must begin before charges are even filed where that opportunity exists.",
          "We work with experts in forensic interviewing, child psychology, and digital forensics. The reliability of a child's statements often turns on how — and how many times — the child was interviewed before the State filed.",
          "We pay close attention to the discovery, the chain of custody, and any prior statements that may contradict the State's version of events.",
        ],
      },
      {
        slug: "sexual-exploitation-of-a-child",
        title: "Sexual Exploitation of a Child",
        blurb: "Federal-grade defense for state and federal exploitation charges.",
        body: [
          "Possession, distribution, or production allegations frequently begin with a digital search warrant. Every byte of that warrant is open to challenge, from probable cause to scope to execution.",
          "We engage independent digital forensics and litigate suppression motions aggressively. Network attribution, device ownership, and chain of custody all matter in these cases.",
          "Federal exposure is common, and we plan the defense with the federal sentencing guidelines in mind from day one even when the case begins in state court.",
        ],
      },
    ],
  },
  {
    slug: "family-law",
    title: "Family Law",
    short: "Clear-eyed counsel for divorce, custody, and family transitions.",
    intro:
      "We handle divorce, custody, and family disputes with care and professionalism. Our focus is on protecting your rights and long-term interests. Family law touches everything that matters most: your children, your home, and your financial future. We bring the same preparation and discipline we use in the courtroom to negotiated resolutions whenever possible — and to contested hearings when necessary. Our family law practice is led by attorneys with deep courtroom experience and a working knowledge of the financial and emotional terrain that surrounds every divorce, custody dispute, and parenting case. We understand that no two families look alike: a contested divorce involving a business and substantial assets is a different case than a parenting dispute between two parents who never married, and both are different again from a step-parent adoption or a modification a few years after a final order. Our job is to listen carefully, explain Colorado law in plain language, and build a plan that fits your actual situation — not a generic template. Whether your matter resolves through mediation, a stipulated agreement, or a contested hearing, our preparation looks the same: full financial disclosures, careful witness preparation, exhibits organized in advance, and a clear theory of why the result you are asking for is in everyone's interest, especially the children's. We also coordinate with our criminal defense practice when family matters intersect with criminal allegations — a frequent occurrence in protection-order and domestic-violence cases — so nothing falls through the cracks.",
    items: [
      {
        slug: "divorce-separation",
        title: "Divorce & Child Custody",
        blurb: "Dissolution, parenting time, and decision-making in Colorado.",
        body: [
          "Divorce and child custody are often the same case in Colorado — property, maintenance, parenting time, and legal decision-making all move together on one docket. We handle both sides of that case with the same preparation, whether the matter is amicable or hotly contested.",
          "On the divorce side, Colorado is a no-fault state, but that does not make it simple. Property division, maintenance, sworn financial disclosures, and — when there are children — a parenting plan that meets statutory requirements all have to be negotiated or litigated carefully.",
          "On the custody side, the standard is always the best interests of the child. We build parenting plans that anticipate the issues most likely to cause future conflict — holiday schedules, transportation, school choice, medical decisions, and communication between households — and we litigate when the schedule or decision-making authority is contested, working with child and family investigators and parental responsibility evaluators where appropriate.",
          "Our approach is candid. We will tell you which positions are likely to succeed and which are not, and we will not run up fees on issues that should be settled. When the other side refuses a reasonable resolution, we are ready to litigate.",
        ],
      },
      {
        slug: "adoption",
        title: "Adoption",
        blurb: "Step-parent, kinship, and private adoption matters.",
        body: [
          "Adoption permanently changes the legal relationship between parent and child. Done right, it brings security and peace of mind for the family and a clean legal record for the child.",
          "We handle step-parent adoptions, kinship adoptions, and the legal steps needed to terminate prior parental rights when applicable. Each adoption involves background checks, consents, and — frequently — a hearing in front of the court.",
          "We walk families through the entire process, from the initial paperwork through the final decree, and we coordinate with caseworkers and home-study providers so nothing slows the process down.",
        ],
      },
      {
        slug: "child-support",
        title: "Child Support",
        blurb: "Establishing, enforcing, and modifying support orders.",
        body: [
          "Colorado calculates child support using statutory worksheets, but the inputs — income, overnights, health insurance, work-related childcare — are often disputed. Small differences in the inputs can change the monthly obligation significantly.",
          "We make sure the numbers reflect reality. That includes documenting self-employment income accurately, accounting for variable bonuses, and ensuring that the parenting-time schedule on paper matches what is actually happening at home.",
          "When circumstances change — a job loss, a relocation, a change in parenting time — we file modifications promptly. We also handle enforcement when the other parent stops paying.",
        ],
      },
      {
        slug: "allocation-of-parental-responsibilities",
        title: "Allocation of Parental Responsibilities",
        blurb: "Decision-making and parenting time, with or without a divorce.",
        body: [
          "APR cases address legal decision-making and parenting time for unmarried parents or after divorce. The standard is always the best interests of the child, and Colorado courts weigh a long list of statutory factors in reaching that determination.",
          "We prepare detailed parenting plans that anticipate the issues most likely to cause future conflict: holiday schedules, transportation, school choice, medical decisions, and communication between households.",
          "When the schedule is contested, we litigate. We work with child and family investigators, parental responsibility evaluators, and — where appropriate — therapists, so the court hears a complete picture.",
        ],
      },
    ],
  },
  {
    slug: "protection-orders",
    title: "Protection Orders",
    short: "Petition for or defend against TPOs and PPOs in Colorado courts.",
    intro:
      "We represent clients seeking or defending against protection and restraining orders. Our attorneys act quickly to help you navigate the legal process with confidence and security. Protection orders can change where you live, where you work, and who you can see — sometimes within hours. Whether you need protection or are defending against an order, the hearing happens fast, and the record lasts. Colorado's protection-order process moves on a compressed timeline: a Temporary Protection Order can be entered ex parte the same day a petition is filed, with a return hearing typically set within 14 days. At that hearing, the court decides whether to make the order permanent — and a Permanent Protection Order can last indefinitely. Because the standard at the return hearing is preponderance of the evidence, not the criminal beyond-a-reasonable-doubt standard, even a relatively thin case can result in a lasting order if it goes unanswered. Our role is the same on both sides: prepare the witnesses, gather the documents, file the right motions, and present a clear, organized case to the court. When we represent petitioners, we make sure the record reflects every relevant incident, with corroboration where it exists. When we defend against an order, we challenge unreliable testimony, point out missing context, and make sure the court understands the real-world consequences a permanent order will have on employment, housing, firearm rights, and family contact.",
    items: [
      {
        slug: "permanent-protection-order",
        title: "Permanent Protection Order (PPO)",
        blurb: "Final hearings that set lasting restrictions.",
        body: [
          "A Permanent Protection Order can remain in effect indefinitely and shows up on background checks. The evidentiary hearing is your one opportunity to present the full story.",
          "We prepare witnesses, exhibits, and cross-examination strategy for every PPO hearing we take.",
        ],
      },
      {
        slug: "temporary-protection-order",
        title: "Temporary Protection Order (TPO)",
        blurb: "Emergency relief — or an emergency defense.",
        body: [
          "A TPO can be issued ex parte and enforced within hours. The return hearing is typically set within 14 days.",
          "We move quickly to either secure or contest the order before it becomes permanent.",
        ],
      },
    ],
  },
];

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
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

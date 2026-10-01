export const PHONE_DISPLAY = "+1 (629) 200-1606";
export const PHONE_HREF = "tel:+16292001606";
export const EMAIL = "aramlogistics.karp@gmail.com";
export const ADDRESS_LINE_1 = "39 W Conti Pkwy, Apt 1W";
export const ADDRESS_LINE_2 = "Elmwood Park, IL 60707";

export const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#benefits", label: "Benefits" },
  { href: "/#positions", label: "Positions" },
  { href: "/#requirements", label: "Requirements" },
  { href: "/#faq", label: "FAQ" },
  { href: "/offer", label: "Offer" },
];

export const POSITIONS = ["Company", "Owner-operator", "Team"] as const;
export type Position = (typeof POSITIONS)[number];

export const EXPERIENCE_OPTIONS = ["Less than 1 year", "1–2 years", "3–5 years", "5+ years"] as const;
export const SELECT_POSITION_EVENT = "aram:select-position";

// 39 W Conti Pkwy, Elmwood Park, IL 60707 (US Census geocoder match).
export const OFFICE_COORDS: [number, number] = [-87.816991, 41.9277];
export const DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=39+W+Conti+Pkwy,+Elmwood+Park,+IL+60707";

export const US_STATES: { value: string; label: string }[] = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"],
  ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"], ["DC", "District of Columbia"],
  ["FL", "Florida"], ["GA", "Georgia"], ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"],
  ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"],
  ["ME", "Maine"], ["MD", "Maryland"], ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"],
  ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"],
  ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"], ["NY", "New York"],
  ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"], ["OK", "Oklahoma"], ["OR", "Oregon"],
  ["PA", "Pennsylvania"], ["RI", "Rhode Island"], ["SC", "South Carolina"], ["SD", "South Dakota"],
  ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"],
  ["WA", "Washington"], ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"],
].map(([value, label]) => ({ value, label }));

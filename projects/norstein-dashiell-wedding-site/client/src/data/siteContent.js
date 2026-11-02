const navigation = [
  {
    label: "Home",
    to: "/",
    end: true,
  },
  {
    label: "RSVP",
    to: "/rsvp/",
    prominent: true,
  },
  {
    label: "Theme & Attire",
    to: "/theme",
  },
  {
    label: "Our Story",
    to: "/story",
  },
  {
    label: "Read, Listen & Watch",
    to: "/read-listen-watch",
  },
  {
    label: "Venue",
    to: "/venue",
  },
  {
    label: "Travel",
    to: "/travel",
  },
  {
    label: "Day-Of Details",
    to: "/day-of",
  },
  {
    label: "FAQ",
    to: "/faq",
  },
  {
    label: "Gallery",
    to: "/gallery",
  },
  {
    label: "Privacy",
    to: "/privacy",
  },
];

export const siteContent = {
  labels: {
    siteIdentity: "Norstein-Dashiell Wedding",
    siteName: "Norstein-Dashiell Wedding Website",
    rsvp: "RSVP",
    privacy: "Privacy",
  },

  wedding: {
    date: {
      iso: "2027-05-01",
      display: "May 1, 2027",
      fullDisplay: "Saturday, May 1, 2027",
    },
    generalLocation: "Union County, New Jersey",
  },

  rsvp: {
    deadline: {
      countdownStartIso: "2027-02-01T00:00:00-05:00",
      iso: "2027-03-01T23:59:00-05:00",
      display: "Monday, March 1, 2027, at 11:59 p.m. EST",
      timeZone: "America/New_York",
    },
    assistanceEmail: "RSVPhelp@loreweavercreations.com",
  },

  navigation,

  footerNavigation: navigation.filter((item) =>
    ["/", "/rsvp/", "/faq", "/privacy"].includes(item.to),
  ),

  giftPolicy: {
    hasRegistry: false,

    preferredCategories: [
      "Cash",
      "Checks",
      "Cash-value or equivalent gifts (we use Venmo and PayPal; sadly our bank does not participate in Zelle, so we cannot accept Zelle payments)",
      "Savings bonds",
      "Handcrafted gifts (we're definitely fans of supporting small businesses, local artisans and freelance artists and crafters!)",
      "Any other thoughtful or creative gift ideas that tell us you're thinking of us, but wouldn't take up a tremendous amount of our relatively compact living space",
    ],

    nonPreferredCategories: [
      "Store-specific gift cards",
      "Charitable Donations or Investments made in our name",
    ],
  },
};

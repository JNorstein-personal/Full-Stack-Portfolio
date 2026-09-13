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
    label: "Theme and Attire",
    to: "/theme",
  },
  {
    label: "Our Story",
    to: "/story",
  },
  {
    label: "Read, Listen, and Watch",
    to: "/read-listen-watch",
  },
  {
    label: "Venues",
    to: "/venues",
  },
  {
    label: "Travel",
    to: "/travel",
  },
  {
    label: "Schedule",
    to: "/schedule",
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
    generalLocation: "Roselle, New Jersey",
  },

  rsvp: {
    deadline: {
      iso: "2027-03-01T23:59:00-05:00",
      display: "Monday, March 1, 2027, at 11:59 p.m. EST",
      timeZone: "America/New_York",
    },
    assistanceEmail: "RSVPhelp@loreweavercreations.com",
  },

  navigation,

  footerNavigation: navigation.filter((item) =>
    ["/", "/rsvp/", "/privacy"].includes(item.to),
  ),

  giftPolicy: {
    hasRegistry: false,

    preferredCategories: [
      "Cash",
      "Cash-equivalent gifts",
      "Checks",
      "Savings bonds",
      "Handcrafted gifts",
      "Otherwise thoughtful gifts",
    ],

    nonPreferredCategories: [
      "Store-specific gift cards",
      "Investments made in the couple’s name",
    ],
  },
};
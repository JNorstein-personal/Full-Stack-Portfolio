import { siteContent } from "./siteContent.js";

export const eventConfigurations = {
  A: {
    id: "A",
    displayName: "Warinanco Park ceremony + Sphinx reception",

    date: siteContent.wedding.date,

    ceremony: {
      venueName: "Warinanco Park",
      location: "Roselle, NJ 07036",
      startTime: "10:30 a.m.",
      endTime: "12:00 p.m.",
    },

    reception: {
      venueName: "Sphinx Banquet and Catering Center",
      address: "121 E 2nd Avenue, Roselle, NJ 07203",
      startTime: "12:30 p.m.",
      endTime: "4:30 p.m.",
    },

    schedule: [
      {
        id: "ceremony",
        label: "Ceremony",
        time: "10:30 a.m.–12:00 p.m.",
        venueName: "Warinanco Park",
      },
      {
        id: "reception",
        label: "Reception",
        time: "12:30 p.m.–4:30 p.m.",
        venueName: "Sphinx Banquet and Catering Center",
      },
    ],

    receptionDescription:
      "Buffet brunch, dancing, and other festivities will take place during the reception.",

    contingency: {
      fallbackConfigurationId: "B",
    },
  },

  B: {
    id: "B",
    displayName: "Sphinx ceremony + reception",

    date: siteContent.wedding.date,

    ceremony: {
      venueName: "Sphinx Banquet and Catering Center",
      address: "121 E 2nd Avenue, Roselle, NJ 07203",
    },

    reception: {
      venueName: "Sphinx Banquet and Catering Center",
      address: "121 E 2nd Avenue, Roselle, NJ 07203",
    },

    schedule: [
      {
        id: "combined-event",
        label: "Ceremony and reception",
        time: "11:30 a.m.–4:30 p.m.",
        venueName: "Sphinx Banquet and Catering Center",
      },
    ],

    receptionDescription:
      "Buffet brunch, dancing, and other festivities will take place during the reception.",

    contingency: null,
  },
};

// Development selection only.
// The final production configuration has not yet been established.
export const activeEventConfigurationId = "A";

export const activeEventConfiguration =
  eventConfigurations[activeEventConfigurationId];
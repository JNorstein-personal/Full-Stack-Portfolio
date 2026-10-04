import { siteContent } from "./siteContent.js";

function buildDirections(destination) {
  const encodedDestination = encodeURIComponent(destination);

  return {
    googleMaps:
      `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`,
    waze:
      `https://waze.com/ul?q=${encodedDestination}&navigate=yes`,
    appleMaps:
      `https://maps.apple.com/directions?destination=${encodedDestination}`,
  };
}

const WARINANCO_DIRECTIONS = buildDirections(
  "Linden Ave Entrance, Warinanco Park Loop Drive, Elizabeth, NJ",
);

const SPHINX_DIRECTIONS = buildDirections(
  "Sphinx Banquet and Catering Center, 121 E 2nd Avenue, Roselle, NJ 07203",
);

export const eventConfigurations = {
  A: {
    id: "A",
    displayName: "Warinanco Park ceremony + Sphinx reception",

    date: siteContent.wedding.date,

    ceremony: {
      id: "ceremony",
    label: "Ceremony",
    time: "10:30 a.m.–12:00 p.m.",
    venueName: "Warinanco Park (via Linden Avenue entrance)",
    directions: WARINANCO_DIRECTIONS,
    },

    reception: {
      venueName: "Sphinx Banquet and Catering Center",
      address: "121 E 2nd Avenue, Roselle, NJ 07203",
      startTime: "12:30 p.m.",
      endTime: "4:30 p.m.",
      directions: SPHINX_DIRECTIONS,
    },

    schedule: [
      {
        id: "ceremony",
        label: "Ceremony",
        time: "10:30 a.m.–12:00 p.m.",
        venueName: "Warinanco Park (via Linden Avenue entrance)",
        directions: WARINANCO_DIRECTIONS,
      },
      {
        id: "reception",
        label: "Reception",
        time: "12:30 p.m.–4:30 p.m.",
        venueName: "Sphinx Banquet and Catering Center",
        directions: SPHINX_DIRECTIONS,
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
      directions: SPHINX_DIRECTIONS,
    },

    reception: {
      venueName: "Sphinx Banquet and Catering Center",
      address: "121 E 2nd Avenue, Roselle, NJ 07203",
      directions: SPHINX_DIRECTIONS,
    },

    schedule: [
      {
        id: "combined-event",
        label: "Ceremony and reception",
        time: "11:30 a.m.–4:30 p.m.",
        venueName: "Sphinx Banquet and Catering Center",
        directions: SPHINX_DIRECTIONS,
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
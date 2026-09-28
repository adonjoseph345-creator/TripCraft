/**
 * Mock itinerary data for destinations.
 * Extend this object with more destinations as needed.
 */

const mockItineraries = {
  kerala: {
    destination: 'Kerala',
    tagline: 'God\'s Own Country',
    days: [
      {
        day: 1,
        title: 'Kochi — Gateway to Kerala',
        location: 'Kochi',
        activities: [
          {
            time: '9:00 AM',
            name: 'Fort Kochi Walk',
            description: 'Explore the charming streets of Fort Kochi, admire colonial-era architecture, and soak in the Portuguese and Dutch heritage.',
            type: 'sightseeing',
          },
          {
            time: '11:00 AM',
            name: 'Chinese Fishing Nets',
            description: 'Watch the iconic cantilevered fishing nets in action along the waterfront — a signature Kochi experience.',
            type: 'sightseeing',
          },
          {
            time: '1:00 PM',
            name: 'Lunch at a Local Restaurant',
            description: 'Enjoy authentic Kerala cuisine — fish curry, appam, and fresh seafood at a waterfront eatery.',
            type: 'food',
          },
          {
            time: '3:00 PM',
            name: 'Mattancherry Palace',
            description: 'Visit the historic Dutch Palace with its stunning Kerala murals depicting scenes from the Ramayana.',
            type: 'sightseeing',
          },
          {
            time: '7:00 PM',
            name: 'Dinner in Fort Kochi',
            description: 'End the day with a candlelit dinner at a heritage restaurant with live Kathakali performance.',
            type: 'food',
          },
        ],
      },
      {
        day: 2,
        title: 'Munnar — Tea Country',
        location: 'Munnar',
        activities: [
          {
            time: '7:00 AM',
            name: 'Travel from Kochi to Munnar',
            description: 'Scenic 4-hour drive through winding mountain roads, waterfalls, and spice plantations.',
            type: 'travel',
          },
          {
            time: '12:00 PM',
            name: 'Check-in & Lunch',
            description: 'Arrive at your hillside resort, freshen up, and enjoy a traditional Kerala sadya (meal).',
            type: 'food',
          },
          {
            time: '2:00 PM',
            name: 'Tea Gardens Tour',
            description: 'Walk through the lush green tea estates of Munnar, learn about tea processing, and enjoy fresh tea tasting.',
            type: 'sightseeing',
          },
          {
            time: '4:30 PM',
            name: 'Mattupetty Dam',
            description: 'Visit the scenic dam surrounded by hills, enjoy speed boating, and take in panoramic mountain views.',
            type: 'sightseeing',
          },
          {
            time: '7:00 PM',
            name: 'Munnar Town Evening',
            description: 'Stroll through Munnar town, shop for spices and tea, and enjoy dinner at a cozy hill-station café.',
            type: 'food',
          },
        ],
      },
      {
        day: 3,
        title: 'Munnar — Nature & Wildlife',
        location: 'Munnar',
        activities: [
          {
            time: '6:30 AM',
            name: 'Eravikulam National Park',
            description: 'Early morning visit to spot the endangered Nilgiri Tahr and enjoy breathtaking mountain vistas.',
            type: 'sightseeing',
          },
          {
            time: '10:30 AM',
            name: 'Tea Museum',
            description: 'Discover the history of tea cultivation in Munnar through vintage machinery, photographs, and exhibits.',
            type: 'sightseeing',
          },
          {
            time: '1:00 PM',
            name: 'Lunch at Resort',
            description: 'Relax and enjoy a leisurely lunch with mountain views at your resort.',
            type: 'food',
          },
          {
            time: '3:00 PM',
            name: 'Local Sightseeing',
            description: 'Visit Echo Point, Photo Point, and the Blossom Garden. Perfect for photos and peaceful walks.',
            type: 'sightseeing',
          },
          {
            time: '6:00 PM',
            name: 'Bonfire & Dinner',
            description: 'Enjoy a bonfire evening at the resort with barbecue dinner under the stars.',
            type: 'food',
          },
        ],
      },
      {
        day: 4,
        title: 'Alleppey — Backwaters',
        location: 'Alleppey',
        activities: [
          {
            time: '7:30 AM',
            name: 'Travel to Alleppey',
            description: 'Drive from Munnar to Alleppey (approx. 5 hours) through scenic Kerala countryside.',
            type: 'travel',
          },
          {
            time: '1:00 PM',
            name: 'Houseboat Check-in & Lunch',
            description: 'Board a traditional Kerala houseboat (kettuvallam) and enjoy a freshly cooked lunch on the water.',
            type: 'food',
          },
          {
            time: '3:00 PM',
            name: 'Backwater Cruise',
            description: 'Cruise through the tranquil backwaters, palm-fringed canals, and watch village life along the banks.',
            type: 'sightseeing',
          },
          {
            time: '6:00 PM',
            name: 'Sunset on the Backwaters',
            description: 'Watch a magical sunset from your houseboat deck — the perfect end to your Kerala journey.',
            type: 'sightseeing',
          },
          {
            time: '8:00 PM',
            name: 'Farewell Dinner & Checkout',
            description: 'Final Kerala dinner on the houseboat. Depart or stay overnight for a peaceful night on the water.',
            type: 'food',
          },
        ],
      },
    ],
    expenses: {
      accommodation: 12000,
      transport: 5500,
      food: 4000,
      activities: 3500,
      miscellaneous: 2000,
    },
  },
};

/**
 * Returns the itinerary for a given destination.
 * Falls back to a generic itinerary if no specific mock data exists.
 */
export function getItinerary(destination, numDays) {
  const key = destination.toLowerCase().trim();

  if (mockItineraries[key]) {
    return mockItineraries[key];
  }

  // Generate a generic placeholder itinerary
  const days = [];
  for (let i = 1; i <= numDays; i++) {
    days.push({
      day: i,
      title: `Day ${i} — Explore ${destination}`,
      location: destination,
      activities: [
        {
          time: '9:00 AM',
          name: 'Morning Sightseeing',
          description: `Discover popular landmarks and attractions in ${destination}.`,
          type: 'sightseeing',
        },
        {
          time: '12:30 PM',
          name: 'Local Cuisine',
          description: `Enjoy authentic local food at a top-rated restaurant.`,
          type: 'food',
        },
        {
          time: '3:00 PM',
          name: 'Afternoon Activity',
          description: `Experience local culture, markets, or adventure activities.`,
          type: 'sightseeing',
        },
        {
          time: '7:00 PM',
          name: 'Evening & Dinner',
          description: `Relax and enjoy the evening scene with a delicious dinner.`,
          type: 'food',
        },
      ],
    });
  }

  return {
    destination,
    tagline: `Explore the beauty of ${destination}`,
    days,
    expenses: {
      accommodation: 3000 * numDays,
      transport: 1500 * numDays,
      food: 1000 * numDays,
      activities: 800 * numDays,
      miscellaneous: 500 * numDays,
    },
  };
}

export default mockItineraries;

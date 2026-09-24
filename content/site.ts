/** Primary editing surface: update facts, services and marketing copy here. */
export const business = {
    name: "A & M Redwood Co",
    url: "https://amredwood.com",
    phone: "831-794-3305",
    phoneHref: "tel:+18317943305",
    textHref: "sms:+18317943305",
    founders: ["Asa Branden", "Manny Fonseca"],
    areas: ["Boulder Creek", "Felton", "Ben Lomond"],
    headline: ["Good people.", "Solid work."],
    intro: "Home projects, property care, and a helping hand. Asa and Manny bring a can-do approach to life in the Santa Cruz Mountains.",
    heroImage: "/images/redwoods.jpg",
};
export const services = [
    { id: "build", number: "01", title: "Build, repair & improve", summary: "Make more of the place you call home.", items: ["Decks, sheds & carpentry", "Overhangs & patio covers", "Screen rooms & mud rooms", "Painting & sanding", "Outdoor showers", "PVC plumbing & water-heater installation"] },
    { id: "outdoors", number: "02", title: "Property & garden care", summary: "A little more order. A lot more outdoors.", items: ["Gardening & yard care", "Tree pruning & trimming", "Hand-dug ditches", "Chopping & hauling firewood", "Pool cleaning"] },
    { id: "clean", number: "03", title: "Cleaning & fresh starts", summary: "A clean space, ready for whatever comes next.", items: ["Deep house cleaning", "Airbnb deep cleaning", "Window washing"] },
    { id: "move", number: "04", title: "Haul, move & clear", summary: "The heavy lifting on your list, handled.", items: ["Dump runs", "Furniture moving", "Furniture assembly", "Demolition & clearing"] },
    { id: "care", number: "05", title: "Care & companionship", summary: "Thoughtful support, with a human touch.", items: ["Caregiving", "Companionship care"] },
    { id: "life", number: "06", title: "Music & mountain life", summary: "Good company. New skills. A favorite new spot.", items: ["Guitar lessons", "Santa Cruz Mountain tours", "Cool-spot consulting"] },
];
export const beforeAfter = [
    { id: "canopy", title: "Overhangs & patio covers", before: { src: "/images/work/canopy-before.jpg", alt: "A worn canvas tent sheltering a propane fill station" }, after: { src: "/images/work/canopy-after.jpg", alt: "A new wood-framed shelter with a metal roof over the propane fill station" } },
    { id: "garden", title: "Gardening & yard care", before: { src: "/images/work/garden-before.jpg", alt: "An overgrown garden bed crowded with weeds and clutter" }, after: { src: "/images/work/garden-after.jpg", alt: "The same garden area cleared, with a tidy path and trellis" } },
    { id: "clearing", title: "Demolition & clearing", before: { src: "/images/work/clearing-before.jpg", alt: "Overgrown brush and debris piled against the side of a house" }, after: { src: "/images/work/clearing-after.jpg", alt: "The same area cleared down to bare ground, opening up defensible space" } },
];
export const steps = [
    { number: "01", title: "Tell us what’s on your list.", description: "Call or text us about the job. A few photos can help us understand what you have in mind." },
    { number: "02", title: "Make a plan together.", description: "We’ll talk through the scope, timing, and price before the work begins." },
    { number: "03", title: "Let’s get it handled.", description: "Hands-on help, clear communication, and care for your space from start to finish." },
];

// @ts-expect-error: Parcel image import
import chemistry from "~/assets/images/tab-icons/chemistry.svg";
// @ts-expect-error: Parcel image import
import medicine from "~/assets/images/tab-icons/medicine.svg";
// @ts-expect-error: Parcel image import
import plumbing from "~/assets/images/tab-icons/plumbing.svg";

const sections = [
  {
    name: "Medical",
    tabs: [
      { page: "Guide_to_medicine", icon: medicine },
      { page: "Guide_to_chemistry", icon: chemistry },
      { page: "Guide_to_plumbing", icon: plumbing },
      { page: "Grenade", text: "nade", icon: null },
      { page: "Guide_to_genetics", icon: null },
      { page: "Infections", text: "virus", icon: null },
      { page: "Surgery", icon: null },
      { page: "Guide_to_Traumas", text: "trauma", icon: null },
      { page: "Guide_to_Wounds", text: "wound", icon: null },
      { page: "Guide_to_Ghetto_Chemistry", text: "ghetto", icon: null },
    ],
  },
  {
    name: "Engineering",
    tabs: [
      { page: "Guide_to_construction", icon: null },
      { page: "Machines", icon: null },
      { page: "Guide_to_power", text: "power", icon: null },
      { page: "Solars", text: "solar", icon: null },
      { page: "Guide_to_the_Supermatter", text: "smatt", icon: null },
      { page: "Singularity_and_Tesla_engines", text: "sing/tesl", icon: null },
      { page: "Gas_turbine", text: "GAS", icon: null },
      { page: "Guide_to_Atmospherics", text: "atmos", icon: null },
      { page: "Guide_to_Telecommunications", icon: null, text: "tcomm" },
    ],
  },
  {
    name: "Science",
    tabs: [
      { page: "Guide_to_Research_and_Development", text: "R&D", icon: null },
      { page: "Guide_to_robotics", icon: null },
      { page: "Guide_to_toxins", text: "toxin", icon: null },
      { page: "Guide_to_xenobiology", icon: null },
      { page: "Guide_to_genetics", icon: null },
      { page: "Guide_to_telescience", icon: null },
      { page: "Guide_to_Nanites", text: "nanite", icon: null },
    ],
  },
  {
    name: "Security",
    tabs: [
      { page: "Guide_to_security", text: "security", icon: null },
      { page: "Space_Law", text: "space law", icon: null },
      { page: "Standard_Operating_Procedure", text: "S.O.P.", icon: null },
      { page: "Guide_to_trials", text: "trials", icon: null },
    ],
  },
  {
    name: "Antagonists",
    tabs: [
      { page: "Traitor", icon: null },
      { page: "Makeshift_weapons", icon: null },
      { page: "Hacking", icon: null },
      { page: "Guide_to_Combat", icon: null },
      { page: "Syndicate_Items", text: "synd", icon: null },
      { page: "Illicit_Access", icon: null },
      { page: "Revolutionary", icon: null },
      { page: "Blood_Cult", text: "cult", icon: null },
      { page: "Nuclear_Operative", text: "nuke", icon: null },
      { page: "Guide_to_malfunction", icon: null },
      { page: "Xenos", text: "xmor", icon: null },
      { page: "Abductor", icon: null },
      { page: "Families", icon: null },
      { page: "Heretic", icon: null },
    ],
  },
  {
    name: "Other",
    tabs: [
      { page: "Ai_Modules", text: "aimo", icon: null },
      { page: "Silicon_Policy", text: "sipo", icon: null },
      {
        page: "Guide_to_Awesome_Miscellaneous_Stuff",
        text: "misc",
        icon: null,
      },
      { page: "Creatures", icon: null },
      { page: "Critters", icon: null },
      { page: "Guide_to_races", icon: null },
      { page: "Guide_to_food_and_drinks", text: "food", icon: null },
      { page: "Guide_to_hydroponics", icon: null },
      { page: "Guide_to_plants", icon: null },
      { page: "Songs", icon: null },
      { page: "Supply_crates", icon: null },
      { page: "Auxiliary_Base_Construction", text: "aux", icon: null },
      { page: "Guide_to_wire_art", text: "wire", icon: null },
      { page: "Guide_to_Space_Exploration", icon: null },
    ],
  },
];

export default sections;

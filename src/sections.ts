// @ts-expect-error: Parcel image import
import chemistry from "~/assets/images/tab-icons/chemistry.svg";
// @ts-expect-error: Parcel image import
import medicine from "~/assets/images/tab-icons/medicine.svg";
// @ts-expect-error: Parcel image import
import plumbing from "~/assets/images/tab-icons/plumbing.svg";
// @ts-expect-error: Parcel image import
import grenade from "~/assets/images/tab-icons/grenade.svg";
// @ts-expect-error: Parcel image import
import genetics from "~/assets/images/tab-icons/genetics.svg";
// @ts-expect-error: Parcel image import
import virus from "~/assets/images/tab-icons/virus.svg";
// @ts-expect-error: Parcel image import
import surgery from "~/assets/images/tab-icons/surgery.svg";
// @ts-expect-error: Parcel image import
import trauma from "~/assets/images/tab-icons/trauma.svg";
// @ts-expect-error: Parcel image import
import wound from "~/assets/images/tab-icons/wound.svg";
// @ts-expect-error: Parcel image import
import ghetto from "~/assets/images/tab-icons/ghetto.svg";
// @ts-expect-error: Parcel image import
import construction from "~/assets/images/tab-icons/construction.svg";
// @ts-expect-error: Parcel image import
import machines from "~/assets/images/tab-icons/machines.svg";
// @ts-expect-error: Parcel image import
import power from "~/assets/images/tab-icons/power.svg";
// @ts-expect-error: Parcel image import
import solar from "~/assets/images/tab-icons/solar.svg";
// @ts-expect-error: Parcel image import
import supermatter from "~/assets/images/tab-icons/supermatter.svg";
// @ts-expect-error: Parcel image import
import shield from "~/assets/images/tab-icons/shield.svg";
// @ts-expect-error: Parcel image import
import turbine from "~/assets/images/tab-icons/turbine.svg";
// @ts-expect-error: Parcel image import
import atmos from "~/assets/images/tab-icons/atmos.svg";
// @ts-expect-error: Parcel image import
import tcomm from "~/assets/images/tab-icons/tcomm.svg";
// @ts-expect-error: Parcel image import
import rnd from "~/assets/images/tab-icons/rnd.svg";
// @ts-expect-error: Parcel image import
import toxins from "~/assets/images/tab-icons/toxins.svg";
// @ts-expect-error: Parcel image import
import xeno from "~/assets/images/tab-icons/xeno.svg";
// @ts-expect-error: Parcel image import
import nanites from "~/assets/images/tab-icons/nanites.svg";
// @ts-expect-error: Parcel image import
import rules from "~/assets/images/tab-icons/rules.svg";
// @ts-expect-error: Parcel image import
import aimod from "~/assets/images/tab-icons/aimod.svg";
// @ts-expect-error: Parcel image import
import tips from "~/assets/images/tab-icons/tips.svg";
// @ts-expect-error: Parcel image import
import critter from "~/assets/images/tab-icons/critter.svg";
// @ts-expect-error: Parcel image import
import races from "~/assets/images/tab-icons/races.svg";
// @ts-expect-error: Parcel image import
import food from "~/assets/images/tab-icons/food.svg";
// @ts-expect-error: Parcel image import
import hydro from "~/assets/images/tab-icons/hydro.svg";
// @ts-expect-error: Parcel image import
import song from "~/assets/images/tab-icons/song.svg";
// @ts-expect-error: Parcel image import
import crate from "~/assets/images/tab-icons/crate.svg";
// @ts-expect-error: Parcel image import
import space from "~/assets/images/tab-icons/space.svg";

export interface SectionInfo {
  name: string;
  tabs: TabInfo[];
}

export interface TabInfo {
  page: string;
  icon: string | null;
  text?: string;
}

const sections: SectionInfo[] = [
  {
    name: "Medical",
    tabs: [
      { page: "Guide_to_medicine", icon: medicine },
      { page: "Guide_to_chemistry", icon: chemistry },
      { page: "Guide_to_plumbing", icon: plumbing },
      { page: "Grenade", text: "nade", icon: grenade },
      { page: "Infections", text: "virus", icon: virus },
      { page: "Surgery", icon: surgery },
      { page: "Guide_to_Traumas", text: "trauma", icon: trauma },
      { page: "Guide_to_Wounds", text: "wound", icon: wound },
      { page: "Guide_to_Ghetto_Chemistry", text: "ghetto", icon: ghetto },
    ],
  },
  {
    name: "Engineering",
    tabs: [
      { page: "Guide_to_construction", icon: construction },
      { page: "Machines", icon: machines },
      { page: "Guide_to_power", text: "power", icon: power },
      { page: "Solars", text: "solar", icon: solar },
      { page: "Guide_to_the_Supermatter", text: "smatt", icon: supermatter },
      {
        page: "Singularity_and_Tesla_engines",
        text: "sing/tesl",
        icon: shield,
      },
      { page: "Gas_turbine", text: "GAST", icon: turbine },
      { page: "Guide_to_Atmospherics", text: "atmos", icon: atmos },
      { page: "Guide_to_Telecommunications", icon: tcomm, text: "tcomm" },
    ],
  },
  {
    name: "Science",
    tabs: [
      { page: "Guide_to_Research_and_Development", text: "R&D", icon: rnd },
      { page: "Guide_to_robotics", icon: null },
      { page: "Guide_to_toxins", text: "toxin", icon: toxins },
      { page: "Guide_to_xenobiology", icon: xeno },
      { page: "Guide_to_genetics", icon: genetics },
      { page: "Guide_to_Nanites", text: "nanite", icon: nanites },
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
    name: "Antag",
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
      { page: "Rules", text: "rules", icon: rules },
      { page: "AI_modules", text: "aimo", icon: aimod },
      {
        page: "Guide_to_Awesome_Miscellaneous_Stuff",
        text: "misc",
        icon: tips,
      },
      { page: "Critters", icon: critter },
      { page: "Guide_to_races", icon: races },
      { page: "Guide_to_food_and_drinks", text: "food", icon: food },
      { page: "Guide_to_hydroponics", icon: hydro },
      { page: "Songs", icon: song },
      { page: "Supply_crates", icon: crate },
      { page: "Auxiliary_Base_Construction_Area", text: "aux", icon: null },
      { page: "Guide_to_Space_Exploration", icon: space },
    ],
  },
];

export default sections;

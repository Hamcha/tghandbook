import chemistry from "@/assets/images/tab-icons/chemistry.svg";
import medicine from "@/assets/images/tab-icons/medicine.svg";
import plumbing from "@/assets/images/tab-icons/plumbing.svg";
import grenade from "@/assets/images/tab-icons/grenade.svg";
import genetics from "@/assets/images/tab-icons/genetics.svg";
import virus from "@/assets/images/tab-icons/virus.svg";
import surgery from "@/assets/images/tab-icons/surgery.svg";
import trauma from "@/assets/images/tab-icons/trauma.svg";
import wound from "@/assets/images/tab-icons/wound.svg";
import ghetto from "@/assets/images/tab-icons/ghetto.svg";
import construction from "@/assets/images/tab-icons/construction.svg";
import machines from "@/assets/images/tab-icons/machines.svg";
import power from "@/assets/images/tab-icons/power.svg";
import solar from "@/assets/images/tab-icons/solar.svg";
import supermatter from "@/assets/images/tab-icons/supermatter.svg";
import turbine from "@/assets/images/tab-icons/turbine.svg";
import atmos from "@/assets/images/tab-icons/atmos.svg";
import tcomm from "@/assets/images/tab-icons/tcomm.svg";
import rnd from "@/assets/images/tab-icons/rnd.svg";
import toxins from "@/assets/images/tab-icons/toxins.svg";
import xeno from "@/assets/images/tab-icons/xeno.svg";
import rules from "@/assets/images/tab-icons/rules.svg";
import aimod from "@/assets/images/tab-icons/aimod.svg";
import critter from "@/assets/images/tab-icons/critter.svg";
import races from "@/assets/images/tab-icons/races.svg";
import food from "@/assets/images/tab-icons/food.svg";
import hydro from "@/assets/images/tab-icons/hydro.svg";
import song from "@/assets/images/tab-icons/song.svg";
import crate from "@/assets/images/tab-icons/crate.svg";
import space from "@/assets/images/tab-icons/space.svg";
import aux from "@/assets/images/tab-icons/auxbase.svg";
import robo from "@/assets/images/tab-icons/robo.svg";
import security from "@/assets/images/tab-icons/security.svg";
import law from "@/assets/images/tab-icons/law.svg";
import sop from "@/assets/images/tab-icons/sop.svg";
import trial from "@/assets/images/tab-icons/trial.svg";
import traitor from "@/assets/images/tab-icons/traitor.svg";
import hacking from "@/assets/images/tab-icons/hacking.svg";
import weapons from "@/assets/images/tab-icons/weapons.svg";
import uplink from "@/assets/images/tab-icons/uplink.svg";
import rev from "@/assets/images/tab-icons/rev.svg";
import cult from "@/assets/images/tab-icons/cult.svg";
import nuke from "@/assets/images/tab-icons/nuke.svg";
import malf from "@/assets/images/tab-icons/malf.svg";
import combat from "@/assets/images/tab-icons/combat.svg";
import access from "@/assets/images/tab-icons/access.svg";
import xmorph from "@/assets/images/tab-icons/xmorph.svg";
import abduction from "@/assets/images/tab-icons/abduction.svg";
import mafia from "@/assets/images/tab-icons/mafia.svg";

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
        page: "Guide_to_disposals",
        text: "DISP",
        icon: null, // TODO: add icon
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
      { page: "Guide_to_robotics", icon: robo },
      { page: "Guide_to_toxins", text: "toxin", icon: toxins },
      { page: "Guide_to_xenobiology", text: "XBIO", icon: xeno },
      { page: "Guide_to_genetics", icon: genetics },
      {
        page: "Guide_to_cytology",
        text: "cyto",
        icon: null, // TODO: add icon
      },
      {
        page: "Guide_to_Circuits",
        text: "circ",
        icon: null, // TODO: add icon
      },
      // { page: "Guide_to_Nanites", text: "nanite", icon: nanites },
    ],
  },
  {
    name: "Security",
    tabs: [
      { page: "Guide_to_security", text: "security", icon: security },
      { page: "Space_Law", text: "space law", icon: law },
      { page: "Standard_Operating_Procedure", text: "S.O.P.", icon: sop },
      { page: "Guide_to_trials", text: "trials", icon: trial },
    ],
  },
  {
    name: "Antag",
    tabs: [
      { page: "Traitor", icon: traitor },
      { page: "Makeshift_weapons", icon: weapons },
      { page: "Hacking", icon: hacking },
      { page: "Guide_to_Combat", icon: combat },
      { page: "Syndicate_Items", text: "uplk", icon: uplink },
      { page: "Illicit_Access", icon: access },
      { page: "Revolutionary", text: "rev", icon: rev },
      { page: "Blood_Cult", text: "cult", icon: cult },
      { page: "Nuclear_Operative", text: "nuke", icon: nuke },
      { page: "Guide_to_malfunction", icon: malf },
      { page: "Xenos", text: "XENO", icon: xmorph },
      { page: "Abductor", icon: abduction },
      { page: "Families", icon: mafia },
      {
        page: "Heretic",
        icon: null, // TODO: add icon
      },
    ],
  },
  {
    name: "Other",
    tabs: [
      { page: "Rules", text: "rules", icon: rules },
      { page: "AI_modules", text: "aimo", icon: aimod },
      /*
      {
        page: "Guide_to_Awesome_Miscellaneous_Stuff",
        text: "misc",
        icon: tips,
      },
      */
      { page: "Critters", icon: critter },
      { page: "Guide_to_races", icon: races },
      { page: "Guide_to_food", text: "food", icon: food },
      {
        page: "Guide_to_drinks",
        text: "drnk",
        icon: food, // TODO: add icon
      },
      { page: "Guide_to_hydroponics", icon: hydro },
      { page: "Songs", icon: song },
      { page: "Supply_crates", icon: crate },
      { page: "Auxiliary_Base_Construction_Area", text: "aux", icon: aux },
      { page: "Guide_to_Space_Exploration", icon: space },
      {
        page: "Mafia",
        text: "mfia",
        icon: null, // TODO: add icon
      },
    ],
  },
];

export default sections;

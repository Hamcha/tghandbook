/* Icons */
import chemistry from "@assets/images/tab-icons/chemistry.svg";
import medicine from "@assets/images/tab-icons/medicine.svg";
import plumbing from "@assets/images/tab-icons/plumbing.svg";
import grenade from "@assets/images/tab-icons/grenade.svg";
import genetics from "@assets/images/tab-icons/genetics.svg";
import virus from "@assets/images/tab-icons/virus.svg";
import surgery from "@assets/images/tab-icons/surgery.svg";
import trauma from "@assets/images/tab-icons/trauma.svg";
import wound from "@assets/images/tab-icons/wound.svg";
import ghetto from "@assets/images/tab-icons/ghetto.svg";
import construction from "@assets/images/tab-icons/construction.svg";
import machines from "@assets/images/tab-icons/machines.svg";
import power from "@assets/images/tab-icons/power.svg";
import solar from "@assets/images/tab-icons/solar.svg";
import supermatter from "@assets/images/tab-icons/supermatter.svg";
import turbine from "@assets/images/tab-icons/turbine.svg";
import atmos from "@assets/images/tab-icons/atmos.svg";
import tcomm from "@assets/images/tab-icons/tcomm.svg";
import rnd from "@assets/images/tab-icons/rnd.svg";
import toxins from "@assets/images/tab-icons/toxins.svg";
import xeno from "@assets/images/tab-icons/xeno.svg";
import rules from "@assets/images/tab-icons/rules.svg";
import aimod from "@assets/images/tab-icons/aimod.svg";
import critter from "@assets/images/tab-icons/critter.svg";
import races from "@assets/images/tab-icons/races.svg";
import food from "@assets/images/tab-icons/food.svg";
import hydro from "@assets/images/tab-icons/hydro.svg";
import song from "@assets/images/tab-icons/song.svg";
import crate from "@assets/images/tab-icons/crate.svg";
import space from "@assets/images/tab-icons/space.svg";
import aux from "@assets/images/tab-icons/auxbase.svg";
import robo from "@assets/images/tab-icons/robo.svg";
import security from "@assets/images/tab-icons/security.svg";
import law from "@assets/images/tab-icons/law.svg";
import sop from "@assets/images/tab-icons/sop.svg";
import trial from "@assets/images/tab-icons/trial.svg";
import traitor from "@assets/images/tab-icons/traitor.svg";
import hacking from "@assets/images/tab-icons/hacking.svg";
import weapons from "@assets/images/tab-icons/weapons.svg";
import uplink from "@assets/images/tab-icons/uplink.svg";
import rev from "@assets/images/tab-icons/rev.svg";
import cult from "@assets/images/tab-icons/cult.svg";
import nuke from "@assets/images/tab-icons/nuke.svg";
import malf from "@assets/images/tab-icons/malf.svg";
import combat from "@assets/images/tab-icons/combat.svg";
import access from "@assets/images/tab-icons/access.svg";
import xmorph from "@assets/images/tab-icons/xmorph.svg";
import abduction from "@assets/images/tab-icons/abduction.svg";
import mafia from "@assets/images/tab-icons/mafia.svg";
import cyto from "@assets/images/tab-icons/cyto.svg";
import circuits from "@assets/images/tab-icons/circuit.svg";
import tourist from "@assets/images/tab-icons/tourist.svg";
import drink from "@assets/images/tab-icons/drink.svg";

/* Pages */
import Guide_to_medicine from "@pages/Guide_to_medicine.json";
import Guide_to_chemistry from "@pages/Guide_to_chemistry.json";
import Guide_to_plumbing from "@pages/Guide_to_plumbing.json";
import Grenade from "@pages/Grenade.json";
import Infections from "@pages/Infections.json";
import Surgery from "@pages/Surgery.json";
import Guide_to_Traumas from "@pages/Guide_to_Traumas.json";
import Guide_to_Wounds from "@pages/Guide_to_Wounds.json";
import Guide_to_Ghetto_Chemistry from "@pages/Guide_to_Ghetto_Chemistry.json";
import Guide_to_construction from "@pages/Guide_to_construction.json";
import Machines from "@pages/Machines.json";
import Guide_to_power from "@pages/Guide_to_power.json";
import Solars from "@pages/Solars.json";
import Guide_to_the_Supermatter from "@pages/Guide_to_the_Supermatter.json";
import Guide_to_disposals from "@pages/Guide_to_disposals.json";
import Gas_turbine from "@pages/Gas_turbine.json";
import Guide_to_Atmospherics from "@pages/Guide_to_Atmospherics.json";
import Guide_to_Telecommunications from "@pages/Guide_to_Telecommunications.json";
import Guide_to_Research_and_Development from "@pages/Guide_to_Research_and_Development.json";
import Guide_to_robotics from "@pages/Guide_to_robotics.json";
import Guide_to_toxins from "@pages/Guide_to_toxins.json";
import Guide_to_xenobiology from "@pages/Guide_to_xenobiology.json";
import Guide_to_genetics from "@pages/Guide_to_genetics.json";
import Guide_to_cytology from "@pages/Guide_to_cytology.json";
import Guide_to_Circuits from "@pages/Guide_to_Circuits.json";
import Guide_to_food from "@pages/Guide_to_food.json";
import Guide_to_drinks from "@pages/Guide_to_drinks.json";
import Guide_to_Restaurant from "@pages/Guide_to_Restaurant.json";
import Guide_to_hydroponics from "@pages/Guide_to_hydroponics.json";
import Supply_crates from "@pages/Supply_crates.json";
import Auxiliary_Base_Construction_Area from "@pages/Auxiliary_Base_Construction_Area.json";
import Guide_to_security from "@pages/Guide_to_security.json";
import Space_Law from "@pages/Space_Law.json";
import Standard_Operating_Procedure from "@pages/Standard_Operating_Procedure.json";
import Guide_to_trials from "@pages/Guide_to_trials.json";
import Guide_to_Combat from "@pages/Guide_to_Combat.json";
import Traitor from "@pages/Traitor.json";
import Makeshift_weapons from "@pages/Makeshift_weapons.json";
import Syndicate_Items from "@pages/Syndicate_Items.json";
import Illicit_Access from "@pages/Illicit_Access.json";
import Revolutionary from "@pages/Revolutionary.json";
import Blood_Cult from "@pages/Blood_Cult.json";
import Nuclear_Operative from "@pages/Nuclear_Operative.json";
import Guide_to_malfunction from "@pages/Guide_to_malfunction.json";
import Xenos from "@pages/Xenos.json";
import Abductor from "@pages/Abductor.json";
import Families from "@pages/Families.json";
import Heretic from "@pages/Heretic.json";
import Rules from "@pages/Rules.json";
import AI_modules from "@pages/AI_modules.json";
import Hacking from "@pages/Hacking.json";
import Critters from "@pages/Critters.json";
import Guide_to_races from "@pages/Guide_to_races.json";
import Paper_Markdown from "@pages/Paper_Markdown.json";
import Songs from "@pages/Songs.json";
import Guide_to_Space_Exploration from "@pages/Guide_to_Space_Exploration.json";
import Mafia from "@pages/Mafia.json";

export interface SectionInfo {
  name: string;
  tabs: TabInfo[];
}

export interface TabInfo {
  page: string;
  icon: string | null;
  text?: string;
  data?: ParsedPage;
}

export const META = "$META";

const sections: SectionInfo[] = [
  {
    name: "Medical",
    tabs: [
      { page: "Guide_to_medicine", icon: medicine, data: Guide_to_medicine },
      { page: "Guide_to_chemistry", icon: chemistry, data: Guide_to_chemistry },
      { page: "Guide_to_plumbing", icon: plumbing, data: Guide_to_plumbing },
      { page: "Grenade", text: "nade", icon: grenade, data: Grenade },
      { page: "Infections", text: "virus", icon: virus, data: Infections },
      { page: "Surgery", icon: surgery, data: Surgery },
      {
        page: "Guide_to_Traumas",
        text: "trauma",
        icon: trauma,
        data: Guide_to_Traumas,
      },
      {
        page: "Guide_to_Wounds",
        text: "wound",
        icon: wound,
        data: Guide_to_Wounds,
      },
      {
        page: "Guide_to_Ghetto_Chemistry",
        text: "ghetto",
        icon: ghetto,
        data: Guide_to_Ghetto_Chemistry,
      },
    ],
  },
  {
    name: "Engineering",
    tabs: [
      {
        page: "Guide_to_construction",
        icon: construction,
        data: Guide_to_construction,
      },
      { page: "Machines", icon: machines, data: Machines },
      {
        page: "Guide_to_power",
        text: "power",
        icon: power,
        data: Guide_to_power,
      },
      {
        page: "Solars",
        text: "solar",
        icon: solar,
        data: Solars,
      },
      {
        page: "Guide_to_the_Supermatter",
        text: "smatt",
        icon: supermatter,
        data: Guide_to_the_Supermatter,
      },
      {
        page: "Guide_to_disposals",
        text: "DISP",
        icon: null, // TODO: add icon
        data: Guide_to_disposals,
      },
      { page: "Gas_turbine", text: "TURB", icon: turbine, data: Gas_turbine },
      {
        page: "Guide_to_Atmospherics",
        text: "atmos",
        icon: atmos,
        data: Guide_to_Atmospherics,
      },
      {
        page: "Guide_to_Telecommunications",
        icon: tcomm,
        text: "tcomm",
        data: Guide_to_Telecommunications,
      },
    ],
  },
  {
    name: "Science",
    tabs: [
      {
        page: "Guide_to_Research_and_Development",
        text: "R&D",
        icon: rnd,
        data: Guide_to_Research_and_Development,
      },
      { page: "Guide_to_robotics", icon: robo, data: Guide_to_robotics },
      {
        page: "Guide_to_toxins",
        text: "toxin",
        icon: toxins,
        data: Guide_to_toxins,
      },
      {
        page: "Guide_to_xenobiology",
        text: "XBIO",
        icon: xeno,
        data: Guide_to_xenobiology,
      },
      { page: "Guide_to_genetics", icon: genetics, data: Guide_to_genetics },
      {
        page: "Guide_to_cytology",
        text: "cyto",
        icon: cyto,
        data: Guide_to_cytology,
      },
      {
        page: "Guide_to_Circuits",
        text: "circ",
        icon: circuits,
        data: Guide_to_Circuits,
      },
      // { page: "Guide_to_Nanites", text: "nanite", icon: nanites },
    ],
  },
  {
    name: "Service",
    tabs: [
      { page: "Guide_to_food", text: "food", icon: food, data: Guide_to_food },
      {
        page: "Guide_to_drinks",
        text: "drnk",
        icon: drink,
        data: Guide_to_drinks,
      },
      {
        page: "Guide_to_Restaurant",
        text: "TOUR",
        icon: tourist,
        data: Guide_to_Restaurant,
      },
      { page: "Guide_to_hydroponics", icon: hydro, data: Guide_to_hydroponics },
      { page: "Supply_crates", icon: crate, data: Supply_crates },
      {
        page: "Auxiliary_Base_Construction_Area",
        text: "aux",
        icon: aux,
        data: Auxiliary_Base_Construction_Area,
      },
    ],
  },
  {
    name: "Security",
    tabs: [
      {
        page: "Guide_to_security",
        text: "security",
        icon: security,
        data: Guide_to_security,
      },
      { page: "Space_Law", text: "space law", icon: law, data: Space_Law },
      {
        page: "Standard_Operating_Procedure",
        text: "S.O.P.",
        icon: sop,
        data: Standard_Operating_Procedure,
      },
      {
        page: "Guide_to_trials",
        text: "trials",
        icon: trial,
        data: Guide_to_trials,
      },
      { page: "Guide_to_Combat", icon: combat, data: Guide_to_Combat },
    ],
  },
  {
    name: "Antag",
    tabs: [
      { page: "Traitor", icon: traitor, data: Traitor },
      { page: "Makeshift_weapons", icon: weapons, data: Makeshift_weapons },
      {
        page: "Syndicate_Items",
        text: "uplk",
        icon: uplink,
        data: Syndicate_Items,
      },
      { page: "Illicit_Access", icon: access, data: Illicit_Access },
      { page: "Revolutionary", text: "rev", icon: rev, data: Revolutionary },
      { page: "Blood_Cult", text: "cult", icon: cult, data: Blood_Cult },
      {
        page: "Nuclear_Operative",
        text: "nuke",
        icon: nuke,
        data: Nuclear_Operative,
      },
      { page: "Guide_to_malfunction", icon: malf, data: Guide_to_malfunction },
      { page: "Xenos", text: "XENO", icon: xmorph, data: Xenos },
      { page: "Abductor", icon: abduction, data: Abductor },
      { page: "Families", icon: mafia, data: Families },
      {
        page: "Heretic",
        icon: null, // TODO: add icon
        data: Heretic,
      },
    ],
  },
  {
    name: "Other",
    tabs: [
      { page: "Rules", text: "rules", icon: rules, data: Rules },
      { page: "AI_modules", text: "aimo", icon: aimod, data: AI_modules },
      /*
      {
        page: "Guide_to_Awesome_Miscellaneous_Stuff",
        text: "misc",
        icon: tips,
      },
      */
      { page: "Hacking", icon: hacking, data: Hacking },
      { page: "Critters", icon: critter, data: Critters },
      { page: "Guide_to_races", icon: races, data: Guide_to_races },
      {
        page: "Paper_Markdown",
        text: "PAPER",
        icon: null, // TODO: add icon
        data: Paper_Markdown,
      },
      { page: "Songs", icon: song, data: Songs },
      {
        page: "Guide_to_Space_Exploration",
        icon: space,
        data: Guide_to_Space_Exploration,
      },
      { page: "Mafia", text: "mfia", icon: mafia, data: Mafia },
    ],
  },
  {
    name: META,
    tabs: [
      { page: "$Welcome", text: "HOME", icon: null },
      { page: "$Changelog", text: "LOG", icon: null },
    ],
  },
];

export default sections;

const decisionTree = {
  start: "playstyle",
  metadata: {
    level: 3,
    notes:
      "Character creation decision tree for beginner-friendly D&D heroes. Alignment is computed by combining alignment_axis1 and alignment_axis2."
  },
  nodes: {
    playstyle: {
      question: "In a dangerous situation, what sounds most fun?",
      options: [
        { label: "Rush in and fight up close", next: "melee_style" },
        { label: "Fight from a distance", next: "ranged_style" },
        { label: "Use magic", next: "magic_source" },
        { label: "Rely on stealth and tricks", next: "stealth_style" },
        { label: "Charm or perform", next: "charm_style" },
        { label: "Protect others", next: "protector_style" }
      ]
    },
    melee_style: {
      question: "What kind of warrior are you?",
      options: [
        { label: "Skilled and tactical", set: { class: "Fighter" }, next: "fighter_subclass" },
        { label: "Wild and fueled by rage", set: { class: "Barbarian" }, next: "barbarian_subclass" },
        { label: "Disciplined and precise", set: { class: "Monk" }, next: "monk_subclass" }
      ]
    },
    ranged_style: {
      question: "How do you attack?",
      options: [
        { label: "With weapons like bows and arrows", set: { class: "Fighter" }, next: "fighter_subclass" },
        { label: "I hunt and track enemies and use bows and arrows", set: { class: "Ranger" }, next: "ranger_subclass" },
        { label: "With magical blasts", next: "magic_origin_ranged" }
      ]
    },
    magic_origin_ranged: {
      question: "Where does your magic come from?",
      options: [
        { label: "A mysterious patron", set: { class: "Warlock" }, next: "warlock_subclass" },
        { label: "It was always inside me", set: { class: "Sorcerer" }, next: "sorcerer_subclass" }
      ]
    },
    magic_source: {
      question: "Where does your magic come from?",
      options: [
        { label: "Study and knowledge", set: { class: "Wizard" }, next: "wizard_subclass" },
        { label: "It’s in my blood", set: { class: "Sorcerer" }, next: "sorcerer_subclass" },
        { label: "A divine being", set: { class: "Cleric" }, next: "cleric_subclass" },
        { label: "Nature itself", set: { class: "Druid" }, next: "druid_subclass" },
        { label: "A mysterious patron", set: { class: "Warlock" }, next: "warlock_subclass" }
      ]
    },
    stealth_style: {
      question: "What kind of sneaky?",
      options: [
        { label: "Thief or assassin", set: { class: "Rogue" }, next: "rogue_subclass" },
        { label: "Illusionist trickster", set: { class: "Bard" }, next: "bard_subclass" },
        { label: "Spy and manipulator", set: { class: "Rogue" }, next: "rogue_subclass" }
      ]
    },
    charm_style: {
      question: "What’s your style?",
      options: [
        { label: "Music and storytelling", set: { class: "Bard" }, next: "bard_subclass" },
        { label: "Persuasion and leadership", set: { class: "Paladin" }, next: "paladin_subclass" },
        { label: "Glamour and enchantment magic", set: { class: "Bard" }, next: "bard_subclass" }
      ]
    },
    protector_style: {
      question: "How do you protect others?",
      options: [
        { label: "Shield and armor", set: { class: "Fighter" }, next: "fighter_subclass" },
        { label: "Healing magic", set: { class: "Cleric" }, next: "cleric_subclass" },
        { label: "Sacred oath", set: { class: "Paladin" }, next: "paladin_subclass" }
      ]
    },
    fighter_subclass: {
      question: "What kind of fighter are you?",
      options: [
        { label: "Master of weapons and tactics", set: { subclass: "Battle Master" }, next: "race_choice" },
        { label: "Natural athlete with incredible stamina", set: { subclass: "Champion" }, next: "race_choice" },
        { label: "Warrior who blends sword and magic", set: { subclass: "Eldritch Knight" }, next: "race_choice" },
        { label: "Archer who never misses", set: { subclass: "Arcane Archer" }, next: "race_choice" },
        { label: "Mounted warrior and battlefield defender", set: { subclass: "Cavalier" }, next: "race_choice" },
        { label: "Disciplined warrior from a martial tradition", set: { subclass: "Samurai" }, next: "race_choice" },
        { label: "Psychic-powered warrior", set: { subclass: "Psi Warrior" }, next: "race_choice" },
        { label: "Runes and giant magic", set: { subclass: "Rune Knight" }, next: "race_choice" }
      ]
    },
    barbarian_subclass: {
      question: "Where does your rage come from?",
      options: [
        { label: "Primal fury and wild instincts", set: { subclass: "Berserker" }, next: "race_choice" },
        { label: "Spiritual connection to animals", set: { subclass: "Totem Warrior" }, next: "race_choice" },
        { label: "Ancestral spirits guide you", set: { subclass: "Ancestral Guardian" }, next: "race_choice" },
        { label: "Rage like a raging storm", set: { subclass: "Storm Herald" }, next: "race_choice" },
        { label: "Divine mission and righteous fury", set: { subclass: "Zealot" }, next: "race_choice" },
        { label: "Primal beast within", set: { subclass: "Beast" }, next: "race_choice" },
        { label: "Wild, chaotic magic erupts", set: { subclass: "Wild Magic" }, next: "race_choice" }
      ]
    },
    monk_subclass: {
      question: "What is your monastic training focused on?",
      options: [
        { label: "Perfect martial arts technique", set: { subclass: "Way of the Open Hand" }, next: "race_choice" },
        { label: "Stealth and shadow magic", set: { subclass: "Way of Shadow" }, next: "race_choice" },
        { label: "Ancient elemental power", set: { subclass: "Way of the Four Elements" }, next: "race_choice" },
        { label: "Brawler who thrives in a tavern fight", set: { subclass: "Way of the Drunken Master" }, next: "race_choice" },
        { label: "Martial artist with bladed mastery", set: { subclass: "Way of the Kensei" }, next: "race_choice" },
        { label: "Radiant spirit and burning soul", set: { subclass: "Way of the Sun Soul" }, next: "race_choice" },
        { label: "Astral arms and spirit power", set: { subclass: "Way of the Astral Self" }, next: "race_choice" },
        { label: "Healing hands and deadly strikes", set: { subclass: "Way of Mercy" }, next: "race_choice" }
      ]
    },
    ranger_subclass: {
      question: "What kind of hunter are you?",
      options: [
        { label: "Expert tracker and monster slayer", set: { subclass: "Hunter" }, next: "race_choice" },
        { label: "Magical beast companion", set: { subclass: "Beast Master" }, next: "race_choice" },
        { label: "Ambusher of the darkness", set: { subclass: "Gloom Stalker" }, next: "race_choice" },
        { label: "Planar explorer and guardian", set: { subclass: "Horizon Walker" }, next: "race_choice" },
        { label: "Hunter of monstrous threats", set: { subclass: "Monster Slayer" }, next: "race_choice" },
        { label: "Enchanted wanderer with fey magic", set: { subclass: "Fey Wanderer" }, next: "race_choice" },
        { label: "Keeper of a swirling swarm", set: { subclass: "Swarmkeeper" }, next: "race_choice" }
      ]
    },
    rogue_subclass: {
      question: "What kind of rogue are you?",
      options: [
        { label: "Classic thief and infiltrator", set: { subclass: "Thief" }, next: "race_choice" },
        { label: "Precise and deadly assassin", set: { subclass: "Assassin" }, next: "race_choice" },
        { label: "Trickster with a touch of magic", set: { subclass: "Arcane Trickster" }, next: "race_choice" },
        { label: "Detective and mystery solver", set: { subclass: "Inquisitive" }, next: "race_choice" },
        { label: "Master manipulator and schemer", set: { subclass: "Mastermind" }, next: "race_choice" },
        { label: "Scout and wilderness skirmisher", set: { subclass: "Scout" }, next: "race_choice" },
        { label: "Daring swashbuckler", set: { subclass: "Swashbuckler" }, next: "race_choice" },
        { label: "Haunted by the dead", set: { subclass: "Phantom" }, next: "race_choice" },
        { label: "Psychic blade wielder", set: { subclass: "Soulknife" }, next: "race_choice" }
      ]
    },
    bard_subclass: {
      question: "What kind of performer are you?",
      options: [
        { label: "Jack-of-all-trades adventurer", set: { subclass: "College of Lore" }, next: "race_choice" },
        { label: "Inspiring battlefield leader", set: { subclass: "College of Valor" }, next: "race_choice" },
        { label: "Glamorous fey-touched star", set: { subclass: "College of Glamour" }, next: "race_choice" },
        { label: "Duelist with blade and song", set: { subclass: "College of Swords" }, next: "race_choice" },
        { label: "Whispers and shadowy secrets", set: { subclass: "College of Whispers" }, next: "race_choice" },
        { label: "Artist who crafts magic from creation", set: { subclass: "College of Creation" }, next: "race_choice" },
        { label: "Silver-tongued master of inspiration", set: { subclass: "College of Eloquence" }, next: "race_choice" }
      ]
    },
    wizard_subclass: {
      question: "What school of magic do you specialize in?",
      options: [
        { label: "Protective wards and barriers", set: { subclass: "School of Abjuration" }, next: "race_choice" },
        { label: "Summoning and teleportation", set: { subclass: "School of Conjuration" }, next: "race_choice" },
        { label: "Foresight and fate-reading", set: { subclass: "School of Divination" }, next: "race_choice" },
        { label: "Charming and influencing minds", set: { subclass: "School of Enchantment" }, next: "race_choice" },
        { label: "Blasting magic", set: { subclass: "School of Evocation" }, next: "race_choice" },
        { label: "Illusions and deception", set: { subclass: "School of Illusion" }, next: "race_choice" },
        { label: "Necromancy and life force", set: { subclass: "School of Necromancy" }, next: "race_choice" },
        { label: "Shaping and changing matter", set: { subclass: "School of Transmutation" }, next: "race_choice" },
        { label: "Battlefield strategist", set: { subclass: "War Magic" }, next: "race_choice" },
        { label: "Elegant swordmage", set: { subclass: "Bladesinging" }, next: "race_choice" },
        { label: "Living spellbook and arcane scribe", set: { subclass: "Order of Scribes" }, next: "race_choice" }
      ]
    },
    sorcerer_subclass: {
      question: "What fuels your innate magic?",
      options: [
        { label: "Dragon bloodline", set: { subclass: "Draconic Bloodline" }, next: "race_choice" },
        { label: "Unpredictable wild magic", set: { subclass: "Wild Magic" }, next: "race_choice" },
        { label: "Blessed by divine power", set: { subclass: "Divine Soul" }, next: "race_choice" },
        { label: "Shadowy magic from the dark", set: { subclass: "Shadow Magic" }, next: "race_choice" },
        { label: "Storm and sky within you", set: { subclass: "Storm Sorcery" }, next: "race_choice" },
        { label: "Mind touched by the Far Realm", set: { subclass: "Aberrant Mind" }, next: "race_choice" },
        { label: "Clockwork order and cosmic balance", set: { subclass: "Clockwork Soul" }, next: "race_choice" }
      ]
    },
    warlock_subclass: {
      question: "Who is your patron?",
      options: [
        { label: "A powerful fiend", set: { subclass: "The Fiend" }, next: "race_choice" },
        { label: "An ancient archfey", set: { subclass: "The Archfey" }, next: "race_choice" },
        { label: "A mysterious Great Old One", set: { subclass: "The Great Old One" }, next: "race_choice" },
        { label: "A radiant celestial", set: { subclass: "The Celestial" }, next: "race_choice" },
        { label: "A shadowy hexblade", set: { subclass: "The Hexblade" }, next: "race_choice" },
        { label: "An oceanic horror", set: { subclass: "The Fathomless" }, next: "race_choice" },
        { label: "A powerful genie", set: { subclass: "The Genie" }, next: "race_choice" }
      ]
    },
    cleric_subclass: {
      question: "What kind of divine power do you serve?",
      options: [
        { label: "Knowledge and secrets", set: { subclass: "Knowledge Domain" }, next: "race_choice" },
        { label: "Life and healing", set: { subclass: "Life Domain" }, next: "race_choice" },
        { label: "Light and radiant power", set: { subclass: "Light Domain" }, next: "race_choice" },
        { label: "Nature and the wilds", set: { subclass: "Nature Domain" }, next: "race_choice" },
        { label: "Storms and thunder", set: { subclass: "Tempest Domain" }, next: "race_choice" },
        { label: "War and battle", set: { subclass: "War Domain" }, next: "race_choice" },
        { label: "Trickery and mischief", set: { subclass: "Trickery Domain" }, next: "race_choice" },
        { label: "Divine forge and craftsmanship", set: { subclass: "Forge Domain" }, next: "race_choice" },
        { label: "Guardian of the grave", set: { subclass: "Grave Domain" }, next: "race_choice" },
        { label: "Disciplined cosmic order", set: { subclass: "Order Domain" }, next: "race_choice" },
        { label: "Peaceful protector and healer", set: { subclass: "Peace Domain" }, next: "race_choice" },
        { label: "Twilight guardian and ward", set: { subclass: "Twilight Domain" }, next: "race_choice" }
      ]
    },
    druid_subclass: {
      question: "How do you channel nature?",
      options: [
        { label: "Transform into animals", set: { subclass: "Circle of the Moon" }, next: "race_choice" },
        { label: "Spellcasting and nature wisdom", set: { subclass: "Circle of the Land" }, next: "race_choice" },
        { label: "Dreams and fey magic", set: { subclass: "Circle of Dreams" }, next: "race_choice" },
        { label: "Guardian of beasts and spirits", set: { subclass: "Circle of the Shepherd" }, next: "race_choice" },
        { label: "Starry constellations", set: { subclass: "Circle of Stars" }, next: "race_choice" },
        { label: "Wildfire and renewal", set: { subclass: "Circle of Wildfire" }, next: "race_choice" }
      ]
    },
    paladin_subclass: {
      question: "What oath drives you?",
      options: [
        { label: "Justice and honor", set: { subclass: "Oath of Devotion" }, next: "race_choice" },
        { label: "Ancient nature and light", set: { subclass: "Oath of the Ancients" }, next: "race_choice" },
        { label: "Vengeance and retribution", set: { subclass: "Oath of Vengeance" }, next: "race_choice" },
        { label: "Conquest and iron will", set: { subclass: "Oath of Conquest" }, next: "race_choice" },
        { label: "Redemption and mercy", set: { subclass: "Oath of Redemption" }, next: "race_choice" },
        { label: "Heroic glory and inspiration", set: { subclass: "Oath of Glory" }, next: "race_choice" },
        { label: "Watchers against extraplanar threats", set: { subclass: "Oath of the Watchers" }, next: "race_choice" }
      ]
    },
    race_choice: {
      question: "What do you look like in this fantasy world?",
      options: [
        { label: "Regular person with grit", set: { race: "Human" }, next: "background_choice" },
        { label: "Tall and elegant", set: { race: "Elf" }, next: "background_choice" },
        { label: "Short and sturdy", set: { race: "Dwarf" }, next: "background_choice" },
        { label: "Fiery and intimidating", set: { race: "Tiefling" }, next: "background_choice" },
        { label: "Dragon-like hero", set: { race: "Dragonborn" }, next: "background_choice" },
        { label: "Half-human with magical vibe", set: { race: "Half-Elf" }, next: "background_choice" },
        { label: "Small, cheerful, and brave", set: { race: "Halfling" }, next: "background_choice" }
      ]
    },
    background_choice: {
      question: "What was your life like before adventuring?",
      options: [
        { label: "Trained for battle", set: { background: "Soldier" }, next: "alignment_rules" },
        { label: "Studied books and ancient lore", set: { background: "Sage" }, next: "alignment_rules" },
        { label: "Entertained crowds", set: { background: "Entertainer" }, next: "alignment_rules" },
        { label: "Survived by bending the rules", set: { background: "Criminal" }, next: "alignment_rules" },
        { label: "Served a temple or faith", set: { background: "Acolyte" }, next: "alignment_rules" },
        { label: "Ordinary villager turned hero", set: { background: "Folk Hero" }, next: "alignment_rules" }
      ]
    },
    alignment_rules: {
      question: "How do you treat rules?",
      options: [
        { label: "Rules matter", set: { alignment_axis1: "Lawful" }, next: "alignment_motivation" },
        { label: "Rules are flexible", set: { alignment_axis1: "Neutral" }, next: "alignment_motivation" },
        { label: "Rules are obstacles", set: { alignment_axis1: "Chaotic" }, next: "alignment_motivation" }
      ]
    },
    alignment_motivation: {
      question: "Why do you act?",
      options: [
        { label: "To help others", set: { alignment_axis2: "Good" }, end: true },
        { label: "For balance or practicality", set: { alignment_axis2: "Neutral" }, end: true },
        {
          label: "For personal gain (not allowed at my table)",
          set: { alignment_axis2: "Evil" },
          end: true,
          disabled: true
        }
      ]
    }
  }
};

const questionEl = document.getElementById("question");
const questionNoteEl = document.getElementById("question-note");
const choicesEl = document.getElementById("choices");
const summaryEl = document.getElementById("summary");
const resultCard = document.getElementById("result");
const resultText = document.getElementById("result-text");
const copyTextEl = document.getElementById("copy-text");
const copyButton = document.getElementById("copy-summary");
const copyStatus = document.getElementById("copy-status");
const backButton = document.getElementById("back");
const restartButtons = [
  document.getElementById("restart"),
  document.getElementById("start-over")
];

let state = {
  currentNode: decisionTree.start,
  selections: {
    class: null,
    subclass: null,
    race: null,
    background: null,
    alignment_axis1: null,
    alignment_axis2: null
  }
};
let history = [];

const summaryLabels = {
  class: "Class",
  subclass: "Subclass",
  race: "Race",
  background: "Background",
  alignment: "Alignment"
};

const updateSummary = () => {
  const alignment = getAlignment();

  const summaryEntries = {
    class: state.selections.class ?? "Not decided yet",
    subclass: state.selections.subclass ?? "Not decided yet",
    race: state.selections.race ?? "Not decided yet",
    background: state.selections.background ?? "Not decided yet",
    alignment
  };

  summaryEl.innerHTML = "";
  Object.entries(summaryEntries).forEach(([key, value]) => {
    const item = document.createElement("li");
    item.className = "summary-item";
    item.innerHTML = `<strong>${summaryLabels[key]}</strong><span>${value}</span>`;
    summaryEl.appendChild(item);
  });
};

const getAlignment = () =>
  state.selections.alignment_axis1 && state.selections.alignment_axis2
    ? `${state.selections.alignment_axis1} ${state.selections.alignment_axis2}`
    : "Not decided yet";

const buildEmailSummary = () => {
  const alignment = getAlignment();
  return [
    "D&D Character Snapshot",
    `Level: ${decisionTree.metadata.level}`,
    `Class: ${state.selections.class ?? "Not decided yet"}`,
    `Subclass: ${state.selections.subclass ?? "Not decided yet"}`,
    `Race: ${state.selections.race ?? "Not decided yet"}`,
    `Background: ${state.selections.background ?? "Not decided yet"}`,
    `Alignment: ${alignment}`
  ].join("\n");
};

const renderNode = () => {
  const node = decisionTree.nodes[state.currentNode];
  if (!node) {
    questionEl.textContent = "Your journey is complete.";
    choicesEl.innerHTML = "";
    questionNoteEl.textContent = "";
    return;
  }

  questionEl.textContent = node.question;
  questionNoteEl.textContent = `Step ${history.length + 1}`;
  choicesEl.innerHTML = "";
  resultCard.hidden = true;
  if (copyStatus) {
    copyStatus.textContent = "";
  }
  backButton.disabled = history.length === 0;

  node.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.textContent = option.label;
    if (option.disabled) {
      button.disabled = true;
      button.setAttribute("aria-disabled", "true");
    } else {
      button.addEventListener("click", () => handleOption(option));
    }
    choicesEl.appendChild(button);
  });
};

const handleOption = (option) => {
  history = [
    ...history,
    {
      currentNode: state.currentNode,
      selections: { ...state.selections }
    }
  ];

  if (option.set) {
    state.selections = { ...state.selections, ...option.set };
  }

  if (option.end) {
    showResult();
  } else {
    state.currentNode = option.next;
    renderNode();
  }

  updateSummary();
};

const showResult = () => {
  const alignment = getAlignment();
  resultText.textContent = `You are a level ${decisionTree.metadata.level} ${alignment} ${
    state.selections.race
  } ${state.selections.class} (${state.selections.subclass}) with a ${
    state.selections.background
  } background. A perfect beginner-friendly hero!`;
  if (copyTextEl) {
    copyTextEl.value = buildEmailSummary();
  }
  if (copyStatus) {
    copyStatus.textContent = "";
  }
  resultCard.hidden = false;
  backButton.disabled = history.length === 0;
};

const goBack = () => {
  const previous = history.pop();
  if (!previous) return;
  state = {
    currentNode: previous.currentNode,
    selections: { ...previous.selections }
  };
  updateSummary();
  renderNode();
};

const reset = () => {
  state = {
    currentNode: decisionTree.start,
    selections: {
      class: null,
      subclass: null,
      race: null,
      background: null,
      alignment_axis1: null,
      alignment_axis2: null
    }
  };
  history = [];
  updateSummary();
  renderNode();
};

const copySummary = async () => {
  if (!copyTextEl) return;
  const summaryText = buildEmailSummary();
  copyTextEl.value = summaryText;

  if (copyStatus) {
    copyStatus.textContent = "Copying...";
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(summaryText);
    } else {
      copyTextEl.focus();
      copyTextEl.select();
      document.execCommand("copy");
      copyTextEl.setSelectionRange(0, 0);
    }
    if (copyStatus) {
      copyStatus.textContent = "Copied! Paste it into your email.";
    }
  } catch (error) {
    if (copyStatus) {
      copyStatus.textContent = "Copy failed. You can select the text and copy manually.";
    }
  }
};

if (backButton) {
  backButton.addEventListener("click", goBack);
}

restartButtons.forEach((button) => {
  if (!button) return;
  button.addEventListener("click", reset);
});

if (copyButton) {
  copyButton.addEventListener("click", copySummary);
}

updateSummary();
renderNode();

// Encounter calculator page
const characterPage = document.getElementById("character-page");
const encounterPage = document.getElementById("encounter-page");
const showCharacterBtn = document.getElementById("show-character");
const showEncounterBtn = document.getElementById("show-encounter");

const switchPage = (page) => {
  const isEncounter = page === "encounter";
  if (characterPage) characterPage.hidden = isEncounter;
  if (encounterPage) encounterPage.hidden = !isEncounter;
  if (backButton) backButton.hidden = isEncounter;
  if (showCharacterBtn) showCharacterBtn.disabled = !isEncounter;
  if (showEncounterBtn) showEncounterBtn.disabled = isEncounter;
};

showCharacterBtn?.addEventListener("click", () => switchPage("character"));
showEncounterBtn?.addEventListener("click", () => switchPage("encounter"));

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const roundKey = (value) => Math.round(value * 10) / 10;

const parseDamageExpression = (expression) => {
  const clean = String(expression).trim().toLowerCase();
  if (/^\d+$/.test(clean)) {
    return { diceCount: 0, sides: 0, modifier: Number(clean) };
  }
  const match = clean.match(/^(\d+)d(\d+)([+-]\d+)?$/);
  if (!match) {
    throw new Error(`Invalid damage expression: ${expression}`);
  }
  return {
    diceCount: Number(match[1]),
    sides: Number(match[2]),
    modifier: Number(match[3] ?? 0)
  };
};

const singleDieDistribution = (sides) => {
  const out = new Map();
  for (let i = 1; i <= sides; i += 1) {
    out.set(i, 1 / sides);
  }
  return out;
};

const convolve = (a, b) => {
  const out = new Map();
  a.forEach((pA, dA) => {
    b.forEach((pB, dB) => {
      const key = roundKey(Number(dA) + Number(dB));
      out.set(key, (out.get(key) ?? 0) + pA * pB);
    });
  });
  return normalizeDistribution(out);
};

const normalizeDistribution = (dist) => {
  const total = [...dist.values()].reduce((sum, p) => sum + p, 0);
  if (total <= 0) return new Map([[0, 1]]);
  const out = new Map();
  dist.forEach((p, d) => {
    if (p > 0) out.set(Number(d), p / total);
  });
  return out;
};

const cappedDistribution = (dist, maxEntries = 280) => {
  if (dist.size <= maxEntries) return dist;
  const entries = [...dist.entries()].sort((a, b) => a[0] - b[0]);
  const min = entries[0][0];
  const max = entries[entries.length - 1][0];
  const binWidth = Math.max(1, (max - min) / maxEntries);
  const binned = new Map();
  entries.forEach(([damage, prob]) => {
    const bin = min + Math.floor((damage - min) / binWidth) * binWidth;
    const key = roundKey(bin);
    binned.set(key, (binned.get(key) ?? 0) + prob);
  });
  return normalizeDistribution(binned);
};

const buildDamageDistribution = (expression, crit = false) => {
  const parsed = parseDamageExpression(expression);
  let distribution = new Map([[0, 1]]);
  const diceCount = crit ? parsed.diceCount * 2 : parsed.diceCount;
  for (let i = 0; i < diceCount; i += 1) {
    distribution = convolve(distribution, singleDieDistribution(parsed.sides));
  }
  const shifted = new Map();
  distribution.forEach((prob, damage) => {
    shifted.set(Math.max(0, damage + parsed.modifier), prob);
  });
  return normalizeDistribution(shifted);
};

const repeatConvolve = (dist, times) => {
  let result = new Map([[0, 1]]);
  for (let i = 0; i < times; i += 1) {
    result = cappedDistribution(convolve(result, dist));
  }
  return result;
};

const getHitRates = (attackBonus, targetAC, mode = "normal", baseCrit = 0.05) => {
  const baseHit = clamp((21 + attackBonus - targetAC) / 20, 0.05, 0.95);
  const hit =
    mode === "advantage"
      ? 1 - (1 - baseHit) ** 2
      : mode === "disadvantage"
        ? baseHit ** 2
        : baseHit;
  const crit =
    mode === "advantage" ? 1 - (1 - baseCrit) ** 2 : mode === "disadvantage" ? baseCrit ** 2 : baseCrit;
  return {
    hit: clamp(hit, 0.05, 0.9975),
    crit: clamp(crit, 0.0025, 0.5)
  };
};

const buildAttackDistribution = ({ attackBonus, targetAC, damageExpr, mode, critChance = 0.05 }) => {
  const { hit, crit } = getHitRates(attackBonus, targetAC, mode, critChance);
  const critRate = Math.min(hit, crit);
  const normalHitRate = Math.max(0, hit - critRate);
  const missRate = Math.max(0, 1 - normalHitRate - critRate);

  const normalDist = buildDamageDistribution(damageExpr, false);
  const critDist = buildDamageDistribution(damageExpr, true);

  const out = new Map([[0, missRate]]);
  normalDist.forEach((prob, damage) => {
    out.set(damage, (out.get(damage) ?? 0) + prob * normalHitRate);
  });
  critDist.forEach((prob, damage) => {
    out.set(damage, (out.get(damage) ?? 0) + prob * critRate);
  });
  return cappedDistribution(normalizeDistribution(out));
};

const scaleDistribution = (dist, scalar) => {
  const scaled = new Map();
  dist.forEach((prob, damage) => {
    const key = roundKey(Math.max(0, damage * scalar));
    scaled.set(key, (scaled.get(key) ?? 0) + prob);
  });
  return normalizeDistribution(scaled);
};

const updateHpPmf = (hpPmf, damageDist, capHp) => {
  const next = new Map();
  hpPmf.forEach((hpProb, hp) => {
    damageDist.forEach((dProb, damage) => {
      const remaining = clamp(roundKey(hp - damage), 0, capHp);
      next.set(remaining, (next.get(remaining) ?? 0) + hpProb * dProb);
    });
  });
  return cappedDistribution(normalizeDistribution(next), 320);
};

const probabilityZeroHp = (pmf) => pmf.get(0) ?? 0;
const probabilityAlive = (pmf) => 1 - probabilityZeroHp(pmf);

const distributionStats = (dist) => {
  let mean = 0;
  dist.forEach((prob, damage) => {
    mean += damage * prob;
  });
  let variance = 0;
  dist.forEach((prob, damage) => {
    variance += ((damage - mean) ** 2) * prob;
  });
  return { mean, variance };
};

const calcDifficultyBand = (partyWinChance) => {
  if (partyWinChance >= 0.8) return "Easy";
  if (partyWinChance >= 0.62) return "Medium";
  if (partyWinChance >= 0.45) return "Hard";
  return "Deadly";
};

const renderDistChart = (containerId, dist) => {
  const el = document.getElementById(containerId);
  if (!el) return;
  const sorted = [...dist.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  const maxProb = sorted[0]?.[1] ?? 1;
  el.innerHTML = "";
  sorted.forEach(([damage, prob]) => {
    const label = document.createElement("div");
    label.className = "chart-label";
    label.innerHTML = `<span>${damage.toFixed(1)} dmg</span><span>${(prob * 100).toFixed(1)}%</span>`;
    const bar = document.createElement("div");
    bar.className = "chart-bar";
    bar.style.width = `${(prob / maxProb) * 100}%`;
    el.appendChild(label);
    el.appendChild(bar);
  });
};

const encounterInputIds = [
  "party-size","party-hp","party-ac","party-attack-bonus","party-attacks","party-damage","party-attack-mode",
  "monster-count","monster-hp","monster-ac","monster-attack-bonus","monster-attacks","monster-damage",
  "legendary-actions","legendary-damage","lair-damage","lair-frequency","lair-control","monster-attack-mode",
  "focus-fire","frontliner-bias"
];

const getInputValue = (id) => {
  const el = document.getElementById(id);
  if (!el) return null;
  return el.type === "checkbox" ? el.checked : el.value;
};

const setInputValue = (id, value) => {
  const el = document.getElementById(id);
  if (!el || value == null) return;
  if (el.type === "checkbox") {
    el.checked = Boolean(value);
  } else {
    el.value = value;
  }
};

const saveEncounterInputs = () => {
  const payload = {};
  encounterInputIds.forEach((id) => {
    payload[id] = getInputValue(id);
  });
  localStorage.setItem("encounter-calc-inputs", JSON.stringify(payload));
};

const loadEncounterInputs = () => {
  const raw = localStorage.getItem("encounter-calc-inputs");
  if (!raw) return;
  const parsed = JSON.parse(raw);
  encounterInputIds.forEach((id) => setInputValue(id, parsed[id]));
};

const toNumber = (id) => Number(getInputValue(id));

const calculateEncounter = () => {
  const partySize = Math.max(1, toNumber("party-size"));
  const partyHpEach = Math.max(1, toNumber("party-hp"));
  const partyAc = Math.max(1, toNumber("party-ac"));
  const partyAttackBonus = toNumber("party-attack-bonus");
  const partyAttacks = Math.max(1, toNumber("party-attacks"));
  const partyDamage = getInputValue("party-damage");
  const partyMode = getInputValue("party-attack-mode");

  const monsterCount = Math.max(1, toNumber("monster-count"));
  const monsterHpEach = Math.max(1, toNumber("monster-hp"));
  const monsterAc = Math.max(1, toNumber("monster-ac"));
  const monsterAttackBonus = toNumber("monster-attack-bonus");
  const monsterAttacks = Math.max(1, toNumber("monster-attacks"));
  const monsterDamage = getInputValue("monster-damage");
  const monsterMode = getInputValue("monster-attack-mode");
  const legendaryActions = Math.max(0, toNumber("legendary-actions"));
  const legendaryDamage = getInputValue("legendary-damage");
  const lairDamage = getInputValue("lair-damage");
  const lairFrequency = Math.max(0, toNumber("lair-frequency"));
  const lairControl = clamp(toNumber("lair-control"), 0.4, 1.2);
  const focusFire = Boolean(getInputValue("focus-fire"));
  const frontlinerBias = Boolean(getInputValue("frontliner-bias"));

  const partyAttackDist = buildAttackDistribution({
    attackBonus: partyAttackBonus,
    targetAC: monsterAc,
    damageExpr: partyDamage,
    mode: partyMode
  });
  const partyPerCharacterDist = repeatConvolve(partyAttackDist, partyAttacks);
  const targetEfficiency = focusFire ? 1 : 0.85;
  const partyRoundDist = scaleDistribution(repeatConvolve(partyPerCharacterDist, partySize), targetEfficiency * lairControl);

  const monsterAttackDist = buildAttackDistribution({
    attackBonus: monsterAttackBonus,
    targetAC: partyAc,
    damageExpr: monsterDamage,
    mode: monsterMode
  });
  const legendaryDist = legendaryActions > 0 ? repeatConvolve(buildAttackDistribution({
    attackBonus: monsterAttackBonus,
    targetAC: partyAc,
    damageExpr: legendaryDamage,
    mode: monsterMode
  }), legendaryActions) : new Map([[0, 1]]);

  const lairBaseDist = buildDamageDistribution(lairDamage, false);
  const lairWeighted = scaleDistribution(lairBaseDist, lairFrequency);
  const monsterRoundBase = convolve(repeatConvolve(monsterAttackDist, monsterAttacks), legendaryDist);
  const monsterRoundDist = scaleDistribution(convolve(monsterRoundBase, lairWeighted), frontlinerBias ? 1.15 : 1);
  const monsterTotalRoundDist = repeatConvolve(monsterRoundDist, monsterCount);

  const totalPartyHp = partySize * partyHpEach;
  const totalMonsterHp = monsterCount * monsterHpEach;

  let partyHpPmf = new Map([[totalPartyHp, 1]]);
  let monsterHpPmf = new Map([[totalMonsterHp, 1]]);

  const maxRounds = 20;
  let unresolvedProb = 1;
  let partyWinProb = 0;
  let monsterWinProb = 0;
  let mutualWipeProb = 0;
  let expectedRounds = 0;

  for (let round = 1; round <= maxRounds; round += 1) {
    const partyAliveFactor = probabilityAlive(partyHpPmf);
    const monsterAliveFactor = probabilityAlive(monsterHpPmf);

    const incomingToMonster = scaleDistribution(partyRoundDist, partyAliveFactor);
    const incomingToParty = scaleDistribution(monsterTotalRoundDist, monsterAliveFactor);

    monsterHpPmf = updateHpPmf(monsterHpPmf, incomingToMonster, totalMonsterHp);
    partyHpPmf = updateHpPmf(partyHpPmf, incomingToParty, totalPartyHp);

    const pMonDead = probabilityZeroHp(monsterHpPmf);
    const pPartyDead = probabilityZeroHp(partyHpPmf);
    const pMonAlive = 1 - pMonDead;
    const pPartyAlive = 1 - pPartyDead;

    const cumulativePartyWin = pMonDead * pPartyAlive;
    const cumulativeMonsterWin = pPartyDead * pMonAlive;
    const cumulativeMutual = pMonDead * pPartyDead;
    const cumulativeResolved = cumulativePartyWin + cumulativeMonsterWin + cumulativeMutual;

    const resolvedThisRound = Math.max(0, cumulativeResolved - (1 - unresolvedProb));
    expectedRounds += round * resolvedThisRound;
    unresolvedProb = Math.max(0, 1 - cumulativeResolved);

    partyWinProb = cumulativePartyWin;
    monsterWinProb = cumulativeMonsterWin;
    mutualWipeProb = cumulativeMutual;
  }

  expectedRounds += maxRounds * unresolvedProb;

  const partyStats = distributionStats(partyRoundDist);
  const monsterStats = distributionStats(monsterTotalRoundDist);
  const swinginess = Math.sqrt((partyStats.variance + monsterStats.variance) / 2);

  const metrics = [
    ["Party win chance", `${(partyWinProb * 100).toFixed(1)}%`],
    ["Monster win chance", `${(monsterWinProb * 100).toFixed(1)}%`],
    ["Mutual wipe", `${(mutualWipeProb * 100).toFixed(2)}%`],
    ["Expected rounds", expectedRounds.toFixed(2)],
    ["Difficulty", calcDifficultyBand(partyWinProb)],
    ["Swinginess", `${swinginess.toFixed(2)} dmg σ`],
    ["Party EDPR", partyStats.mean.toFixed(2)],
    ["Monster EDPR", monsterStats.mean.toFixed(2)]
  ];

  const metricsEl = document.getElementById("encounter-metrics");
  if (metricsEl) {
    metricsEl.innerHTML = "";
    metrics.forEach(([label, value]) => {
      const item = document.createElement("li");
      item.className = "summary-item";
      item.innerHTML = `<strong>${label}</strong><span>${value}</span>`;
      metricsEl.appendChild(item);
    });
  }

  const resultEl = document.getElementById("encounter-result");
  const summaryElEncounter = document.getElementById("encounter-summary");
  if (summaryElEncounter) {
    summaryElEncounter.textContent = `Estimated ${calcDifficultyBand(partyWinProb)} encounter: party win chance ${(partyWinProb * 100).toFixed(1)}%, monster win chance ${(monsterWinProb * 100).toFixed(1)}%.`;
  }
  if (resultEl) resultEl.hidden = false;

  renderDistChart("party-chart", partyRoundDist);
  renderDistChart("monster-chart", monsterTotalRoundDist);

  const rulesNote = document.getElementById("rules-note");
  if (rulesNote) {
    rulesNote.innerHTML = `
      <strong>Model assumptions:</strong> P(hit) = clamp((21 + attackBonus - targetAC) / 20) with natural 1/20 bounds, critical hits default to 5% (adjusted for advantage/disadvantage), damage distributions are convolved per attack and per round, lair and legendary effects are folded into monster round damage, and HP is tracked as probability mass across rounds.<br>
      <strong>Important:</strong> This is a statistical estimate, not a tactical simulator. Initiative order, spell choice, battlefield control, and player decisions can materially change outcomes.
    `;
  }
};

document.getElementById("calculate-encounter")?.addEventListener("click", () => {
  try {
    calculateEncounter();
  } catch (error) {
    alert(error.message);
  }
});
document.getElementById("save-encounter")?.addEventListener("click", saveEncounterInputs);
document.getElementById("load-encounter")?.addEventListener("click", loadEncounterInputs);

switchPage("character");

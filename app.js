const decisionTree = {
  start: "playstyle",
  metadata: {
    level: 3,
    notes:
      "Character creation decision tree for beginner-friendly D&D wizard. Alignment is computed by combining alignment_axis1 and alignment_axis2."
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
        { label: "With weapons like bows", set: { class: "Fighter" }, next: "fighter_subclass" },
        { label: "I hunt and track enemies", set: { class: "Ranger" }, next: "ranger_subclass" },
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
        { label: "Warrior who blends sword and magic", set: { subclass: "Eldritch Knight" }, next: "race_choice" }
      ]
    },
    barbarian_subclass: {
      question: "Where does your rage come from?",
      options: [
        { label: "Primal fury and wild instincts", set: { subclass: "Berserker" }, next: "race_choice" },
        { label: "Spiritual connection to animals", set: { subclass: "Totem Warrior" }, next: "race_choice" }
      ]
    },
    monk_subclass: {
      question: "What is your monastic training focused on?",
      options: [
        { label: "Perfect martial arts technique", set: { subclass: "Way of the Open Hand" }, next: "race_choice" },
        { label: "Stealth and shadow magic", set: { subclass: "Way of Shadow" }, next: "race_choice" },
        { label: "Ancient elemental power", set: { subclass: "Way of the Four Elements" }, next: "race_choice" }
      ]
    },
    ranger_subclass: {
      question: "What kind of hunter are you?",
      options: [
        { label: "Expert tracker and monster slayer", set: { subclass: "Hunter" }, next: "race_choice" },
        { label: "Magical beast companion", set: { subclass: "Beast Master" }, next: "race_choice" }
      ]
    },
    rogue_subclass: {
      question: "What kind of rogue are you?",
      options: [
        { label: "Classic thief and infiltrator", set: { subclass: "Thief" }, next: "race_choice" },
        { label: "Precise and deadly assassin", set: { subclass: "Assassin" }, next: "race_choice" },
        { label: "Trickster with a touch of magic", set: { subclass: "Arcane Trickster" }, next: "race_choice" }
      ]
    },
    bard_subclass: {
      question: "What kind of performer are you?",
      options: [
        { label: "Jack-of-all-trades adventurer", set: { subclass: "College of Lore" }, next: "race_choice" },
        { label: "Inspiring battlefield leader", set: { subclass: "College of Valor" }, next: "race_choice" }
      ]
    },
    wizard_subclass: {
      question: "What school of magic do you specialize in?",
      options: [
        { label: "Blasting magic", set: { subclass: "School of Evocation" }, next: "race_choice" },
        { label: "Illusions and deception", set: { subclass: "School of Illusion" }, next: "race_choice" },
        { label: "Necromancy and life force", set: { subclass: "School of Necromancy" }, next: "race_choice" }
      ]
    },
    sorcerer_subclass: {
      question: "What fuels your innate magic?",
      options: [
        { label: "Dragon bloodline", set: { subclass: "Draconic Bloodline" }, next: "race_choice" },
        { label: "Unpredictable wild magic", set: { subclass: "Wild Magic" }, next: "race_choice" }
      ]
    },
    warlock_subclass: {
      question: "Who is your patron?",
      options: [
        { label: "A powerful fiend", set: { subclass: "The Fiend" }, next: "race_choice" },
        { label: "An ancient archfey", set: { subclass: "The Archfey" }, next: "race_choice" },
        { label: "A mysterious Great Old One", set: { subclass: "The Great Old One" }, next: "race_choice" }
      ]
    },
    cleric_subclass: {
      question: "What kind of divine power do you serve?",
      options: [
        { label: "Life and healing", set: { subclass: "Life Domain" }, next: "race_choice" },
        { label: "War and battle", set: { subclass: "War Domain" }, next: "race_choice" },
        { label: "Trickery and mischief", set: { subclass: "Trickery Domain" }, next: "race_choice" }
      ]
    },
    druid_subclass: {
      question: "How do you channel nature?",
      options: [
        { label: "Transform into animals", set: { subclass: "Circle of the Moon" }, next: "race_choice" },
        { label: "Spellcasting and nature wisdom", set: { subclass: "Circle of the Land" }, next: "race_choice" }
      ]
    },
    paladin_subclass: {
      question: "What oath drives you?",
      options: [
        { label: "Justice and honor", set: { subclass: "Oath of Devotion" }, next: "race_choice" },
        { label: "Ancient nature and light", set: { subclass: "Oath of the Ancients" }, next: "race_choice" },
        { label: "Vengeance and retribution", set: { subclass: "Oath of Vengeance" }, next: "race_choice" }
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
        { label: "For personal gain", set: { alignment_axis2: "Evil" }, end: true }
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
  const alignment = state.selections.alignment_axis1 && state.selections.alignment_axis2
    ? `${state.selections.alignment_axis1} ${state.selections.alignment_axis2}`
    : "Not decided yet";

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
  backButton.disabled = history.length === 0;

  node.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.textContent = option.label;
    button.addEventListener("click", () => handleOption(option));
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
  const alignment = `${state.selections.alignment_axis1} ${state.selections.alignment_axis2}`;
  resultText.textContent = `You are a level ${decisionTree.metadata.level} ${alignment} ${
    state.selections.race
  } ${state.selections.class} (${state.selections.subclass}) with a ${
    state.selections.background
  } background. A perfect beginner-friendly hero!`;
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

if (backButton) {
  backButton.addEventListener("click", goBack);
}

restartButtons.forEach((button) => {
  if (!button) return;
  button.addEventListener("click", reset);
});

updateSummary();
renderNode();

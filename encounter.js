const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const roundKey = (value) => Math.round(value * 10) / 10;

const defaultLegendaryAction = () => ({
  name: "Legendary Strike",
  uses: 1,
  type: "attack",
  mode: "normal",
  attackBonus: 8,
  saveDC: 15,
  damage: "1d8+4",
  saveEffect: "half"
});

const defaultLairAction = () => ({
  name: "Lair Pulse",
  uses: 1,
  type: "save",
  mode: "normal",
  attackBonus: 0,
  saveDC: 14,
  damage: "2d6",
  saveEffect: "half"
});

const defaultPc = () => ({
  name: "PC",
  hp: 32,
  ac: 16,
  saveBonus: 3,
  attackBonus: 6,
  attacks: 1,
  damage: "1d8+4",
  mode: "normal"
});

const defaultMonster = () => ({
  name: "Monster",
  hp: 120,
  ac: 17,
  saveBonus: 4,
  attackBonus: 7,
  attacks: 2,
  damage: "2d8+4",
  mode: "normal",
  legendaryActions: [defaultLegendaryAction()]
});

let partyActors = [defaultPc(), defaultPc(), defaultPc(), defaultPc()].map((pc, i) => ({ ...pc, name: `PC ${i + 1}` }));
let monsterActors = [{ ...defaultMonster(), name: "Boss Monster", hp: 135, ac: 18, attackBonus: 8 }];
let lairActions = [defaultLairAction()];

const parseDamageExpression = (expression) => {
  const clean = String(expression).trim().toLowerCase();
  if (/^\d+$/.test(clean)) return { diceCount: 0, sides: 0, modifier: Number(clean) };
  const match = clean.match(/^(\d+)d(\d+)([+-]\d+)?$/);
  if (!match) throw new Error(`Invalid damage expression: ${expression}`);
  return { diceCount: Number(match[1]), sides: Number(match[2]), modifier: Number(match[3] ?? 0) };
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

const cappedDistribution = (dist, maxEntries = 300) => {
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

const singleDieDistribution = (sides) => {
  const out = new Map();
  for (let i = 1; i <= sides; i += 1) out.set(i, 1 / sides);
  return out;
};

const buildDamageDistribution = (expression, crit = false) => {
  const parsed = parseDamageExpression(expression);
  const diceCount = crit ? parsed.diceCount * 2 : parsed.diceCount;
  let dist = new Map([[0, 1]]);
  for (let i = 0; i < diceCount; i += 1) dist = convolve(dist, singleDieDistribution(parsed.sides));
  const shifted = new Map();
  dist.forEach((p, d) => shifted.set(Math.max(0, d + parsed.modifier), p));
  return normalizeDistribution(shifted);
};

const repeatConvolve = (dist, times) => {
  let result = new Map([[0, 1]]);
  for (let i = 0; i < times; i += 1) result = cappedDistribution(convolve(result, dist));
  return result;
};

const getHitRates = (attackBonus, targetAC, mode = "normal", baseCrit = 0.05) => {
  const baseHit = clamp((21 + attackBonus - targetAC) / 20, 0.05, 0.95);
  const hit = mode === "advantage" ? 1 - (1 - baseHit) ** 2 : mode === "disadvantage" ? baseHit ** 2 : baseHit;
  const crit = mode === "advantage" ? 1 - (1 - baseCrit) ** 2 : mode === "disadvantage" ? baseCrit ** 2 : baseCrit;
  return { hit: clamp(hit, 0.05, 0.9975), crit: clamp(crit, 0.0025, 0.5) };
};

const getSaveFailRate = (saveDC, targetSaveBonus) => clamp((21 + saveDC - targetSaveBonus) / 20, 0.05, 0.95);

const buildAttackDistribution = ({ attackBonus, targetAC, damageExpr, mode }) => {
  const { hit, crit } = getHitRates(Number(attackBonus), Number(targetAC), mode);
  const critRate = Math.min(hit, crit);
  const normalRate = Math.max(0, hit - critRate);
  const missRate = Math.max(0, 1 - normalRate - critRate);

  const out = new Map([[0, missRate]]);
  buildDamageDistribution(damageExpr, false).forEach((p, d) => out.set(d, (out.get(d) ?? 0) + p * normalRate));
  buildDamageDistribution(damageExpr, true).forEach((p, d) => out.set(d, (out.get(d) ?? 0) + p * critRate));
  return cappedDistribution(normalizeDistribution(out));
};

const buildSaveDistribution = ({ saveDC, targetSaveBonus, damageExpr, saveEffect }) => {
  const pFail = getSaveFailRate(Number(saveDC), Number(targetSaveBonus));
  const pSuccess = 1 - pFail;
  const fullDamage = buildDamageDistribution(damageExpr, false);
  const successMultiplier = saveEffect === "none" ? 0 : saveEffect === "half" ? 0.5 : 1;
  const successDamage = scaleDistribution(fullDamage, successMultiplier);
  const out = new Map();

  fullDamage.forEach((p, d) => {
    out.set(d, (out.get(d) ?? 0) + p * pFail);
  });
  successDamage.forEach((p, d) => {
    out.set(d, (out.get(d) ?? 0) + p * pSuccess);
  });
  return cappedDistribution(normalizeDistribution(out));
};

const buildActionDistribution = ({ action, targetAC, targetSaveBonus }) => {
  if (action.type === "save") {
    return repeatConvolve(
      buildSaveDistribution({
        saveDC: action.saveDC,
        targetSaveBonus,
        damageExpr: action.damage,
        saveEffect: action.saveEffect
      }),
      Math.max(0, Number(action.uses || 0))
    );
  }
  return repeatConvolve(
    buildAttackDistribution({
      attackBonus: action.attackBonus,
      targetAC,
      damageExpr: action.damage,
      mode: action.mode
    }),
    Math.max(0, Number(action.uses || 0))
  );
};

const scaleDistribution = (dist, scalar) => {
  const scaled = new Map();
  dist.forEach((p, d) => {
    const key = roundKey(Math.max(0, d * scalar));
    scaled.set(key, (scaled.get(key) ?? 0) + p);
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

const probabilityHpAtMost = (pmf, threshold) => {
  let total = 0;
  pmf.forEach((prob, hp) => {
    if (hp > 0 && hp <= threshold) total += prob;
  });
  return total;
};

const distributionStats = (dist) => {
  let mean = 0;
  dist.forEach((p, d) => {
    mean += d * p;
  });
  let variance = 0;
  dist.forEach((p, d) => {
    variance += ((d - mean) ** 2) * p;
  });
  return { mean, variance };
};

const calcDifficultyBand = (partyWinChance) => {
  if (partyWinChance >= 0.8) return "Easy";
  if (partyWinChance >= 0.62) return "Medium";
  if (partyWinChance >= 0.45) return "Hard";
  return "Deadly";
};

const actionFields = (prefix, action, actionIndex) => `
  <div class="form-grid mini-form-grid" data-action-prefix="${prefix}" data-action-index="${actionIndex}">
    <label>Name<input data-field="name" value="${action.name}" /></label>
    <label>Uses/round<input data-field="uses" type="number" min="0" value="${action.uses}" /></label>
    <label>Type
      <select data-field="type">
        <option value="attack" ${action.type === "attack" ? "selected" : ""}>Attack Roll</option>
        <option value="save" ${action.type === "save" ? "selected" : ""}>Saving Throw</option>
      </select>
    </label>
    <label>Damage<input data-field="damage" value="${action.damage}" /></label>
    <label ${action.type === "save" ? "hidden" : ""}>Attack bonus<input data-field="attackBonus" type="number" value="${action.attackBonus}" /></label>
    <label ${action.type === "attack" ? "hidden" : ""}>Save DC<input data-field="saveDC" type="number" value="${action.saveDC}" /></label>
    <label ${action.type === "attack" ? "hidden" : ""}>On successful save
      <select data-field="saveEffect">
        <option value="none" ${action.saveEffect === "none" ? "selected" : ""}>No damage</option>
        <option value="half" ${action.saveEffect === "half" ? "selected" : ""}>Half damage</option>
        <option value="full" ${action.saveEffect === "full" ? "selected" : ""}>Full damage</option>
      </select>
    </label>
    <label ${action.type === "save" ? "hidden" : ""}>Attack mode
      <select data-field="mode">
        <option value="normal" ${action.mode === "normal" ? "selected" : ""}>Normal</option>
        <option value="advantage" ${action.mode === "advantage" ? "selected" : ""}>Advantage</option>
        <option value="disadvantage" ${action.mode === "disadvantage" ? "selected" : ""}>Disadvantage</option>
      </select>
    </label>
  </div>
`;

const actorCard = (actor, type, index) => {
  const isMonster = type === "monster";
  const actions = isMonster
    ? `
      <div class="mini-actions" data-monster-index="${index}">
        <div class="actor-card-header">
          <h5>Legendary Actions</h5>
          <button class="ghost-button add-legendary" type="button">+ Add Legendary Action</button>
        </div>
        <div class="mini-action-list">
          ${actor.legendaryActions
            .map(
              (action, actionIndex) => `
              <section class="mini-action-card" data-monster-index="${index}" data-action-index="${actionIndex}">
                <div class="actor-card-header">
                  <strong>Action ${actionIndex + 1}</strong>
                  <button class="ghost-button remove-legendary" type="button">Remove</button>
                </div>
                ${actionFields("legendary", action, actionIndex)}
              </section>
            `
            )
            .join("")}
        </div>
      </div>
    `
    : "";

  return `
    <article class="actor-card" data-type="${type}" data-index="${index}">
      <div class="actor-card-header">
        <h4>${isMonster ? "Monster" : "PC"} ${index + 1}</h4>
        <button class="ghost-button remove-actor" type="button" ${type === "party" && partyActors.length <= 1 ? "disabled" : ""} ${type === "monster" && monsterActors.length <= 1 ? "disabled" : ""}>Remove</button>
      </div>
      <div class="form-grid">
        <label>Name<input data-field="name" value="${actor.name}" /></label>
        <label>HP<input data-field="hp" type="number" min="1" value="${actor.hp}" /></label>
        <label>AC<input data-field="ac" type="number" min="1" value="${actor.ac}" /></label>
        <label>Save bonus<input data-field="saveBonus" type="number" value="${actor.saveBonus}" /></label>
        <label>Attack bonus<input data-field="attackBonus" type="number" value="${actor.attackBonus}" /></label>
        <label>Attacks/round<input data-field="attacks" type="number" min="1" value="${actor.attacks}" /></label>
        <label>Damage<input data-field="damage" value="${actor.damage}" /></label>
        <label>Attack mode
          <select data-field="mode">
            <option value="normal" ${actor.mode === "normal" ? "selected" : ""}>Normal</option>
            <option value="advantage" ${actor.mode === "advantage" ? "selected" : ""}>Advantage</option>
            <option value="disadvantage" ${actor.mode === "disadvantage" ? "selected" : ""}>Disadvantage</option>
          </select>
        </label>
      </div>
      ${actions}
    </article>
  `;
};

const lairActionCard = (action, index) => `
  <section class="mini-action-card" data-lair-index="${index}">
    <div class="actor-card-header">
      <strong>Lair Action ${index + 1}</strong>
      <button class="ghost-button remove-lair-action" type="button" ${lairActions.length <= 1 ? "disabled" : ""}>Remove</button>
    </div>
    ${actionFields("lair", action, index)}
  </section>
`;

const syncActorInputs = () => {
  document.querySelectorAll(".actor-card").forEach((card) => {
    const type = card.dataset.type;
    const idx = Number(card.dataset.index);
    const source = type === "party" ? partyActors : monsterActors;

    card.querySelectorAll(":scope > .form-grid input, :scope > .form-grid select").forEach((input) => {
      input.addEventListener("input", () => {
        const field = input.dataset.field;
        source[idx][field] = input.type === "number" ? Number(input.value) : input.value;
      });
    });

    card.querySelector(".remove-actor")?.addEventListener("click", () => {
      if (type === "party" && partyActors.length > 1) partyActors.splice(idx, 1);
      if (type === "monster" && monsterActors.length > 1) monsterActors.splice(idx, 1);
      renderActors();
    });

    if (type === "monster") {
      card.querySelector(".add-legendary")?.addEventListener("click", () => {
        monsterActors[idx].legendaryActions.push(defaultLegendaryAction());
        renderActors();
      });

      card.querySelectorAll(".mini-action-card").forEach((actionCard) => {
        const actionIndex = Number(actionCard.dataset.actionIndex);
        actionCard.querySelector(".remove-legendary")?.addEventListener("click", () => {
          monsterActors[idx].legendaryActions.splice(actionIndex, 1);
          renderActors();
        });
        actionCard.querySelectorAll("input, select").forEach((input) => {
          input.addEventListener("input", () => {
            const field = input.dataset.field;
            monsterActors[idx].legendaryActions[actionIndex][field] = input.type === "number" ? Number(input.value) : input.value;
          });
        });
      });
    }
  });

  document.querySelectorAll("#lair-list .mini-action-card").forEach((card) => {
    const idx = Number(card.dataset.lairIndex);
    card.querySelector(".remove-lair-action")?.addEventListener("click", () => {
      if (lairActions.length > 1) {
        lairActions.splice(idx, 1);
        renderActors();
      }
    });
    card.querySelectorAll("input, select").forEach((input) => {
      input.addEventListener("input", () => {
        const field = input.dataset.field;
        lairActions[idx][field] = input.type === "number" ? Number(input.value) : input.value;
      });
    });
  });
};

const renderActors = () => {
  document.getElementById("party-list").innerHTML = partyActors.map((actor, i) => actorCard(actor, "party", i)).join("");
  document.getElementById("monster-list").innerHTML = monsterActors.map((actor, i) => actorCard(actor, "monster", i)).join("");
  document.getElementById("lair-list").innerHTML = lairActions.map((action, i) => lairActionCard(action, i)).join("");
  syncActorInputs();
};

const renderDistChart = (containerId, dist) => {
  const el = document.getElementById(containerId);
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

const aggregatePartyDistribution = (targetAc, targetSaveBonus) => {
  let total = new Map([[0, 1]]);
  partyActors.forEach((pc) => {
    const base = repeatConvolve(
      buildAttackDistribution({ attackBonus: pc.attackBonus, targetAC: targetAc, damageExpr: pc.damage, mode: pc.mode }),
      Math.max(1, Number(pc.attacks))
    );
    const savePressure = buildSaveDistribution({
      saveDC: 8 + Number(pc.attackBonus),
      targetSaveBonus,
      damageExpr: pc.damage,
      saveEffect: "none"
    });
    total = convolve(total, convolve(base, scaleDistribution(savePressure, 0.15)));
    total = cappedDistribution(total);
  });
  return total;
};

const aggregateMonsterDistribution = (targetAc, targetSaveBonus) => {
  let total = new Map([[0, 1]]);
  monsterActors.forEach((monster) => {
    const base = repeatConvolve(
      buildAttackDistribution({ attackBonus: monster.attackBonus, targetAC: targetAc, damageExpr: monster.damage, mode: monster.mode }),
      Math.max(1, Number(monster.attacks))
    );

    let legendaryTotal = new Map([[0, 1]]);
    monster.legendaryActions.forEach((action) => {
      legendaryTotal = convolve(legendaryTotal, buildActionDistribution({ action, targetAC: targetAc, targetSaveBonus }));
      legendaryTotal = cappedDistribution(legendaryTotal);
    });

    total = convolve(total, convolve(base, legendaryTotal));
    total = cappedDistribution(total);
  });
  return total;
};

const aggregateLairDistribution = (targetAc, targetSaveBonus) => {
  let total = new Map([[0, 1]]);
  lairActions.forEach((action) => {
    total = convolve(total, buildActionDistribution({ action, targetAC: targetAc, targetSaveBonus }));
    total = cappedDistribution(total);
  });
  return total;
};

const calculateEncounter = () => {
  const avgMonsterAc = monsterActors.reduce((sum, m) => sum + Number(m.ac), 0) / monsterActors.length;
  const avgMonsterSave = monsterActors.reduce((sum, m) => sum + Number(m.saveBonus), 0) / monsterActors.length;
  const avgPartyAc = partyActors.reduce((sum, p) => sum + Number(p.ac), 0) / partyActors.length;
  const avgPartySave = partyActors.reduce((sum, p) => sum + Number(p.saveBonus), 0) / partyActors.length;

  const focusFire = document.getElementById("focus-fire").checked;
  const frontlinerBias = document.getElementById("frontliner-bias").checked;
  const lairControl = clamp(Number(document.getElementById("lair-control").value), 0.4, 1.2);

  const partyRoundDist = scaleDistribution(
    aggregatePartyDistribution(avgMonsterAc, avgMonsterSave),
    (focusFire ? 1 : 0.85) * lairControl
  );

  const monsterRoundBase = aggregateMonsterDistribution(avgPartyAc, avgPartySave);
  const lairRoundDist = aggregateLairDistribution(avgPartyAc, avgPartySave);
  const monsterRoundDist = scaleDistribution(
    convolve(monsterRoundBase, lairRoundDist),
    frontlinerBias ? 1.15 : 1
  );

  const totalPartyHp = partyActors.reduce((sum, p) => sum + Number(p.hp), 0);
  const totalMonsterHp = monsterActors.reduce((sum, m) => sum + Number(m.hp), 0);
  const minPcHp = Math.min(...partyActors.map((p) => Number(p.hp)));

  let partyHpPmf = new Map([[totalPartyHp, 1]]);
  let monsterHpPmf = new Map([[totalMonsterHp, 1]]);

  const maxRounds = 20;
  let unresolvedProb = 1;
  let partyWinProb = 0;
  let monsterWinProb = 0;
  let partyWinSomeDeathsProb = 0;
  let expectedRounds = 0;

  for (let round = 1; round <= maxRounds; round += 1) {
    const incomingToMonster = scaleDistribution(partyRoundDist, probabilityAlive(partyHpPmf));
    const incomingToParty = scaleDistribution(monsterRoundDist, probabilityAlive(monsterHpPmf));

    monsterHpPmf = updateHpPmf(monsterHpPmf, incomingToMonster, totalMonsterHp);
    partyHpPmf = updateHpPmf(partyHpPmf, incomingToParty, totalPartyHp);

    const pMonDead = probabilityZeroHp(monsterHpPmf);
    const pPartyDead = probabilityZeroHp(partyHpPmf);
    const pPartyAlive = 1 - pPartyDead;
    const pPartyAliveButWornDown = probabilityHpAtMost(partyHpPmf, Math.max(0, totalPartyHp - minPcHp));

    const cumulativePartyWin = pMonDead * pPartyAlive;
    const cumulativeMonsterWin = pPartyDead;
    const cumulativePartyWinSomeDeaths = pMonDead * pPartyAliveButWornDown;
    const cumulativeResolved = cumulativePartyWin + cumulativeMonsterWin;

    const resolvedThisRound = Math.max(0, cumulativeResolved - (1 - unresolvedProb));
    expectedRounds += round * resolvedThisRound;
    unresolvedProb = Math.max(0, 1 - cumulativeResolved);

    partyWinProb = cumulativePartyWin;
    monsterWinProb = cumulativeMonsterWin;
    partyWinSomeDeathsProb = cumulativePartyWinSomeDeaths;
  }

  expectedRounds += maxRounds * unresolvedProb;

  const partyStats = distributionStats(partyRoundDist);
  const monsterStats = distributionStats(monsterRoundDist);
  const swinginess = Math.sqrt((partyStats.variance + monsterStats.variance) / 2);

  const metrics = [
    ["Party win chance", `${(partyWinProb * 100).toFixed(1)}%`],
    ["Monster win chance", `${(monsterWinProb * 100).toFixed(1)}%`],
    ["Party win with some PCs dying", `${(partyWinSomeDeathsProb * 100).toFixed(2)}%`],
    ["Expected rounds", expectedRounds.toFixed(2)],
    ["Difficulty", calcDifficultyBand(partyWinProb)],
    ["Swinginess", `${swinginess.toFixed(2)} dmg σ`],
    ["Party EDPR", partyStats.mean.toFixed(2)],
    ["Monster EDPR", monsterStats.mean.toFixed(2)]
  ];

  const metricsEl = document.getElementById("encounter-metrics");
  metricsEl.innerHTML = "";
  metrics.forEach(([label, value]) => {
    const item = document.createElement("li");
    item.className = "summary-item";
    item.innerHTML = `<strong>${label}</strong><span>${value}</span>`;
    metricsEl.appendChild(item);
  });

  document.getElementById("encounter-summary").textContent = `Estimated ${calcDifficultyBand(partyWinProb)} encounter: party win chance ${(partyWinProb * 100).toFixed(1)}%, monster win chance ${(monsterWinProb * 100).toFixed(1)}%.`;
  document.getElementById("encounter-result").hidden = false;

  renderDistChart("party-chart", partyRoundDist);
  renderDistChart("monster-chart", monsterRoundDist);

  document.getElementById("rules-note").innerHTML = `
    <strong>Legendary/lair save handling:</strong> save-based actions use P(fail) = clamp((21 + saveDC - targetSaveBonus) / 20), and the configured “on successful save” outcome (none/half/full) is applied to damage distribution.<br>
    <strong>Model assumptions:</strong> attack actions use P(hit) = clamp((21 + attackBonus - targetAC) / 20) with natural 1/20 bounds and crit handling (adjusted for advantage/disadvantage). HP is tracked as probability mass across rounds. "Party win with some PCs dying" is estimated from remaining party HP relative to the weakest PC's HP threshold.
  `;
};

const saveEncounter = () => {
  const payload = {
    partyActors,
    monsterActors,
    lairActions,
    lairControl: document.getElementById("lair-control").value,
    focusFire: document.getElementById("focus-fire").checked,
    frontlinerBias: document.getElementById("frontliner-bias").checked
  };
  localStorage.setItem("encounter-calc-v3", JSON.stringify(payload));
};

const loadEncounter = () => {
  const raw = localStorage.getItem("encounter-calc-v3");
  if (!raw) return;
  const data = JSON.parse(raw);
  partyActors = data.partyActors?.length ? data.partyActors : [defaultPc()];
  monsterActors = data.monsterActors?.length
    ? data.monsterActors.map((monster) => ({
        ...defaultMonster(),
        ...monster,
        legendaryActions: Array.isArray(monster.legendaryActions) ? monster.legendaryActions : [defaultLegendaryAction()]
      }))
    : [defaultMonster()];
  lairActions = data.lairActions?.length ? data.lairActions : [defaultLairAction()];
  document.getElementById("lair-control").value = data.lairControl ?? "0.9";
  document.getElementById("focus-fire").checked = Boolean(data.focusFire);
  document.getElementById("frontliner-bias").checked = Boolean(data.frontlinerBias);
  renderActors();
};

document.getElementById("add-party-member").addEventListener("click", () => {
  partyActors.push({ ...defaultPc(), name: `PC ${partyActors.length + 1}` });
  renderActors();
});

document.getElementById("add-monster").addEventListener("click", () => {
  monsterActors.push({ ...defaultMonster(), name: `Monster ${monsterActors.length + 1}` });
  renderActors();
});

document.getElementById("add-lair-action").addEventListener("click", () => {
  lairActions.push(defaultLairAction());
  renderActors();
});

document.getElementById("calculate-encounter").addEventListener("click", () => {
  try {
    calculateEncounter();
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("save-encounter").addEventListener("click", saveEncounter);
document.getElementById("load-encounter").addEventListener("click", loadEncounter);

renderActors();

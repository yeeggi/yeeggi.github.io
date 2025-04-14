let acidVolumeInput, baseVolumeInput, baseConcInput, calcButton, resetButton, bgColorButton;
let result = null;
let titrationDone = false;
let dropletY = 140;
let dropAnimating = false;
let colorChanged = false;
let selectedAcid, selectedBase;
let dropSpeed = 1.5;
let bgColor = 245;

let acids = [
  { name: "HCl (Acide Chlorhydrique)", formula: "HCl" },
  { name: "CH3COOH (Acide Acétique)", formula: "CH3COOH" },
  { name: "H2SO4 (Acide Sulfurique)", formula: "H2SO4" }
];

let bases = [
  { name: "NaOH (Hydroxyde de Sodium)", formula: "NaOH" },
  { name: "KOH (Hydroxyde de Potassium)", formula: "KOH" },
  { name: "Ca(OH)2 (Hydroxyde de Calcium)", formula: "Ca(OH)2" }
];

let stirAngle = 0;

function setup() {
  createCanvas(989, 689);
  textSize(16);
  textAlign(LEFT);

  createP("Sélectionner un acide :").position(20, 468);
  selectedAcid = createSelect();
  selectedAcid.position(180, 488);
  acids.forEach(acid => selectedAcid.option(acid.name));

  createP("Sélectionner une base :").position(429, 468);
  selectedBase = createSelect();
  selectedBase.position(589, 488);
  bases.forEach(base => selectedBase.option(base.name));

  createP("Volume de l'acide (mL) :").position(20, 539);
  acidVolumeInput = createInput('25');
  acidVolumeInput.position(190, 559);
  acidVolumeInput.size(60);

  createP("Volume de la base utilisée (mL) :").position(350, 539);
  baseVolumeInput = createInput('20');
  baseVolumeInput.position(589, 559);
  baseVolumeInput.size(60);

  createP("Concentration de la base (mol/L) :").position(20, 639);
  baseConcInput = createInput('0.1');
  baseConcInput.position(250, 659);
  baseConcInput.size(60);

  calcButton = createButton("Démarrer la Titration");
  calcButton.position(350, 659);
  calcButton.mousePressed(startTitration);

  resetButton = createButton("Réinitialiser");
  resetButton.position(498, 659);
  resetButton.mousePressed(resetExperiment);

  bgColorButton = createButton("Changer la couleur du fond");
  bgColorButton.position(598, 659);
  bgColorButton.mousePressed(toggleBackground);
}

function draw() {
  background(bgColor);
  fill(0);
  textSize(20);
  text("\u2697\ufe0f Configuration de la Titration Virtuelle", 200, 30);
  drawApparatus();

  if (result !== null) {
    fill(0);
    textSize(18);
    text("\u21d2 " + selectedAcid.value() + " concentration : " + nf(result, 1, 3) + " mol/L", 449, 320);
  }

  if (titrationDone) {
    fill(0, 150, 80);
    textSize(16);
    text("\u2705 Réaction Terminée - Point d'Équivalence Atteint", 390, 190);
  }
}

function drawApparatus() {
  // Support et pince
  stroke(100);
  strokeWeight(4);
  line(100, 50, 100, 250); // support
  line(100, 70, 300, 70); // barre de pince

  // Burette
  noStroke();
  fill(200);
  rect(290, 70, 20, 120, 5);
  fill(100, 255, 150);
  rect(290, 190, 20, 50);
  fill(0);
  text("Burette (Base)", 250, 255);

  // Potence (small circle above the burette)
  fill(200, 0, 0); // Red color for the potence
  ellipse(300, 60, 20, 20); // Draw small circle as the potence

  // Goutte
  if (dropAnimating) {
    fill(0, 200, 100);
    ellipse(300, dropletY, 10, 10);
    dropletY += dropSpeed;
    if (dropletY >= 320) {
      dropAnimating = false;
      dropletY = 140;
      colorChanged = true;
      titrationDone = true;
      calcButton.attribute('disabled', '');
    }
  }

  // Bécher
  fill(180);
  rect(270, 320, 80, 100, 10);
  fill(colorChanged ? [200, 100, 255] : [0, 100, 255]);
  rect(275, 390, 70, 25, 5);
  fill(0);
  text("Solution (Acide)", 390, 440);

  // Sonde de pH
  fill(50);
  rect(310, 290, 10, 30);
  fill(0);
  text("Sonde de pH", 320, 310);

  // Barre d'agitation
  push();
  translate(310, 400);
  rotate(stirAngle);
  fill(100);
  rect(-10, -3, 20, 6, 3);
  pop();

  stirAngle += 0.05; // animation de la barre d'agitation

  // Base de l'agitateur magnétique
  fill(220);
  rect(260, 420, 100, 20, 5);
  fill(0);
  text("Agitateur Magnétique", 240, 469);
}

function startTitration() {
  colorChanged = false;
  titrationDone = false;
  dropAnimating = true;
  dropletY = 140;

  let V1 = parseFloat(acidVolumeInput.value());
  let V2 = parseFloat(baseVolumeInput.value());
  let C2 = parseFloat(baseConcInput.value());

  if (isNaN(V1) || isNaN(V2) || isNaN(C2) || V1 <= 0 || V2 <= 0 || C2 <= 0) {
    alert("Veuillez entrer des nombres valides et positifs.");
    result = null;
    dropAnimating = false;
    return;
  }

  let C1 = (C2 * V2) / V1;
  result = C1;
}

function resetExperiment() {
  result = null;
  titrationDone = false;
  colorChanged = false;
  dropAnimating = false;
  dropletY = 140;
  calcButton.removeAttribute('disabled');
  acidVolumeInput.value('25');
  baseVolumeInput.value('20');
  baseConcInput.value('0.1');
}

function toggleBackground() {
  bgColor = (bgColor === 245) ? 200 : 245;
}
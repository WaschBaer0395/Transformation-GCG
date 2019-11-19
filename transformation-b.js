////////////////////////////////////////////////////////////////////////////////
// transformation-b.js
//
// Bearbeiten Sie diese Datei fuer den Praktikumsteil "Transformation B".
//
// HS Duesseldorf - Fachbereich Medien - Grundlagen d. Computergrafik
//
// Studiengang: BMI
// Gruppe     : E
// Autor 1    : Philipp Dorn (797310)
// Autor 2    : Rene Hippe (797633)
// Autor 3    : Felix Rademacher (797580)
// Autor 4    : Sebastian Brendel (797366)
// Autor 5    : Louis Lange (589176)
////////////////////////////////////////////////////////////////////////////////



// globale variablen
var sceneRoot;  // speichert den Wurzelknoten der Szene
var sceneEarth;
var sceneVenus;
var sceneMars;
var sceneMercury;
var sceneMoon;
var sceneDeimos;
var scenePhobos;
var sceneMoon2;

var unscaledMatrix; // saves the unscaled matrix of a parent
////////////////////////////////////////////////////////////////////////////////
// renderScene(time)
// Wird aufgerufen, wenn die gesamte Szene gerendert werden muss.
// In der Variable time wird die verstrichene Zeit in Sekunden übergeben.
////////////////////////////////////////////////////////////////////////////////
function renderScene(time) {
  // Transformationsmatrix fuer Punkte
  var pointMatrix = initMatrix4();
  // Transformationsmatrix fuer Normalen
  var normalMatrix = initMatrix4();

  // Faktor fuer die Zeit -- fuer Zeitraffer / Zeitlupe
  var timeScale = 10;
  unscaledMatrix = initMatrix4();

  renderPlanets(sceneRoot, pointMatrix, normalMatrix, timeScale * time);
}

function initMatrix4() {
  return new Matrix4(
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0);
}

function renderPlanets(planet, pointMatrix, normalMatrix, time) {
  if (planet.shape != undefined) {

    // Tranformation des Szenenknotens bestimmen
    var nodeTransformation = planet.animator(time);

    // Transformation des Szenenknotens anwenden
    var planetPointMatrix = nodeTransformation.pointMatrix;
    var planetNormalMatrix = nodeTransformation.normalMatrix;

    pointMatrix.multiplySelf(planetPointMatrix);
    normalMatrix.multiplySelf(planetNormalMatrix);


    // Szenenknoten rendern
    renderSceneNode(planet, pointMatrix, normalMatrix);

    if(planet.children.length>0) {
      pointMatrix.copy(unscaledMatrix);
      normalMatrix.copy(unscaledMatrix);
      // Children
      for (let i = 0; i < planet.children.length; i++) {
        console.log(planet.children);
        renderPlanets(planet.children[i], pointMatrix, normalMatrix, time);
      }
    }
    else {
      pointMatrix.copy(initMatrix4());
      normalMatrix.copy(initMatrix4());
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// initScene()
// Wird aufgerufen, wenn die Szene initialisiert werden soll.
// Erstellt den Szenengraphen.
////////////////////////////////////////////////////////////////////////////////
function initScene()
{
  // TODO: Hier werden Sie die Szenenknoten für Planeten und Monde anlegen.

  // -- Merkur ---------------------
  var mercury = {
    animator: animateObj,
    shape: CreateMercury(),
    children: [],
    radius: 5,
    bahnradius: 76,
    eigendrehung: 58.7,
    umlaufzeit: 88,
    achsneigung: 0,
    bahnneigung: 7
  };

  // -- Venus ---------------------
  var venus = {
    animator: animateObj,
    shape: CreateVenus(),
    children: [],
    radius: 12,
    bahnradius: 145,
    eigendrehung: 243,
    umlaufzeit: 224.7,
    achsneigung: 177,
    bahnneigung: 3
  };

  // -- Moon2 ---------------------
  var moon2 = {
    animator: animateObj,
    shape: CreateMoon(),
    children: [],
    radius: 10.5,
    bahnradius: 30,
    eigendrehung: 27.3,
    umlaufzeit: 88,
    achsneigung: 0,
    bahnneigung: 0
  };

  // -- Mond ---------------------
  var moon = {
    animator: animateObj,
    shape: CreateMoon(),
    children: [moon2],
    radius: 3.5,
    bahnradius: 22,
    eigendrehung: 27.3,
    umlaufzeit: 27.3,
    achsneigung: 7,
    bahnneigung: 5
  };

  // -- Erde ---------------------
  var earth = {
    animator: animateObj,
    shape: CreateEarth(),
    children: [moon],
    radius: 13,
    bahnradius: 200,
    eigendrehung: 1,
    umlaufzeit: 365.2,
    achsneigung: 23,
    bahnneigung: 0
  };

  // -- Deimos ---------------------
  var deimos = {
    animator: animateObj,
    shape: CreateMoon(),
    children: [],
    radius: 1.5,
    bahnradius: 20,
    eigendrehung: 1.3,
    umlaufzeit: 1.3,
    achsneigung: 0,
    bahnneigung: 1
  };

  // -- Phobos ---------------------
  var phobos = {
    animator: animateObj,
    shape: CreateMoon(),
    children: [],
    radius: 2.5,
    bahnradius: 15,
    eigendrehung: 0.3,
    umlaufzeit: 0.3,
    achsneigung: 0,
    bahnneigung: 1
  };
  // -- mars ---------------------
  var mars = {
    animator: animateObj,
    shape: CreateMars(),
    children: [deimos,phobos],
    radius: 7,
    bahnradius: 305,
    eigendrehung: 1,
    umlaufzeit: 687,
    achsneigung: 25,
    bahnneigung: 3
  };

  // -- Sonne --------------------
  sceneRoot = {
    animator: animateSun,
    shape: CreateSun(),
    //children: [earth,mars,mercury,venus,]
    children: [earth,mercury,venus,mars]

  };

  // Setze die Sonne als Wurzelknoten der Szene.
  sceneEarth = earth;
  sceneMars = mars;
  sceneMercury = mercury;
  sceneVenus = venus;
  sceneMoon = moon;
  sceneDeimos = deimos;
  scenePhobos = phobos;
  sceneMoon2 = moon2;
}





////////////////////////////////////////////////////////////////////////////////
// Animate-Funktionen
////////////////////////////////////////////////////////////////////////////////
// -- Sonne --------------------------------------------------------------------
function animateSun(time){
  return {
    pointMatrix: initMatrix4(),
    normalMatrix: initMatrix4()
  };
}

// TODO: Hier werden Sie weitere Animate-Funktionen implementieren.

function animateObj(time){
  // initialisierung der matrix
  var animatedMatrix = initMatrix4();

  // ----------- neigung der bahn ---------------------------
  animatedMatrix = rotateZObj(animatedMatrix,this.bahnneigung);
  // ----------- rotation um parent ---------------------------
  var winkel = timeDegRatio(time,this.umlaufzeit);
  animatedMatrix = rotateYObj(animatedMatrix,winkel);
  // ----------- entfernung vom parent -------------------------
  animatedMatrix = translateObj(animatedMatrix,this.bahnradius);
  // ----------- skalierung des planeten -----------------------
  unscaledMatrix.copy(animatedMatrix);
  animatedMatrix = scaleObj(animatedMatrix,this.radius);
  // ----------- neigung der achse ---------------------------
  animatedMatrix = rotateZObj(animatedMatrix,this.achsneigung);
  // ----------- rotieren um sich selbst -----------------------
  winkel = timeDegRatio(time,this.eigendrehung);
  animatedMatrix = rotateYObj(animatedMatrix, winkel);

  return{
    pointMatrix: animatedMatrix,
    normalMatrix: animatedMatrix,
  };
}

////////////////////////////////////////////////////////////////////////////////
// Transformationsfunktionen
////////////////////////////////////////////////////////////////////////////////

// TODO: Hier werden Sie grundlegende Transformationsfunktionen implementieren.

// rotiert das objekt auf der Y achse
function rotateYObj(matrix, winkel){
  var rotationMatrix = new Matrix4();
  rotationMatrix.makeRotationY(winkel);
  matrix.multiplySelf(rotationMatrix);
  return matrix;
}
// skaliert ein objekt
function scaleObj(matrix, faktor){
  var newmatrix = new Matrix4();
  newmatrix.makeScale(faktor,faktor,faktor);
  matrix.multiplySelf(newmatrix);
  return matrix;
}
// rechnet die drehgeschwindigkeit in winkel pro sekunde um
function timeDegRatio(time,rotationTime){
  var zeit = time;
  var winkel = 1;
  var winkelSekunde = 2*Math.PI / rotationTime;
  winkel = zeit * winkelSekunde;
  return winkel;
}
// bewegt ein objekt auf der x achse
function translateObj(matrix, x){
  var translateMatrix = new Matrix4();
  translateMatrix.makeTranslation(x,0,0);
  matrix = matrix.multiplySelf(translateMatrix);
  return matrix;
}
// rotiert das objekt auf der Z achse
function rotateZObj(matrix, winkel){
  var rotationMatrix = new Matrix4();
  rotationMatrix.makeRotationZ(degToRad(winkel));
  matrix.multiplySelf(rotationMatrix);
  return matrix;
}
// convertiert degree zu radiant
function degToRad(winkel){
  return winkel*Math.PI/180;
}

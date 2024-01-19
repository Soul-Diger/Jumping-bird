const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "./media/flappy-bird-set.png";


// General settings
let gamePlaying = 0; //Toggle, sommes nous en train de jouer ou pas ?
const gravity = 0.1;
const speed = 3.2;
const size = [51, 36]; // [x, y]
const jump = -5.5;
const cTenth = canvas.width / 10;

// Pipe settings
const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () =>
  Math.random() * (canvas.height - (pipeGap + pipeWidth) - pipeWidth) +
  pipeWidth;

let index = 0; // permet de gerer l'effet d'avancée grace à une parallaxe
let bestScore = 0;
let currentScore = 0;
let pipes = [];
let flight;
let flyHeight;
let actualScore = 0;

const setup = () => {
  currentScore = 0;
  flight = jump;
  flyHeight = canvas.height / 2 - size[1] / 2;

  pipes = Array(3)
    .fill()
    .map((a, i) => [canvas.width + i * (pipeGap + pipeWidth), pipeLoc()]);
};

const render = () => {
  //le rendu de l'animation
  index++;

  // Background
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 4)) % canvas.width) + canvas.width,
    0,
    canvas.width,
    canvas.height
  );
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 4)) % canvas.width),
    0,
    canvas.width,
    canvas.height
  );

  // Oiseau
  if (gamePlaying === 1) {
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) *
        size[1] /*permet de choisir 1 des 3 oiseau, en gros les param vont tomber pile sur chacun des 3 oiseaux*/,
      ...size,
      cTenth,
      flyHeight,
      ...size
    );

    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else if (gamePlaying === 0) {
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) *
        size[1] /*permet de choisir 1 des 3 oiseau, en gros les param vont tomber pile sur chacun des 3 oiseaux*/,
      ...size,
      canvas.width / 2 - size[0] / 2,
      flyHeight,
      ...size
    ); // Chercher dans la doc
    flyHeight = canvas.height / 2 - size[1] / 2;

    ctx.fillText(`Meilleur score : ${bestScore}`, 55, 245);
    ctx.fillText("Cliquez pour jouer", 48, 535);
    ctx.font = "Bold 30px courier";
  } else if (gamePlaying === 2) {
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) *
        size[1] /*permet de choisir 1 des 3 oiseau, en gros les param vont tomber pile sur chacun des 3 oiseaux*/,
      ...size,
      cTenth,
      flyHeight,
      ...size
    );
    flyHeight = canvas.height / 2 - size[1] / 2;

    ctx.fillText(`Perdu !`, 150, 150);
    ctx.fillText(`Votre score : ${actualScore}`, 80, 245);
    ctx.fillText("Cliquez pour rejouer", 33, 535);
    ctx.font = "Bold 30px courier";
  }

  // Pipes Display
  if (gamePlaying === 1) {
    pipes.map((pipe) => {
      pipe[0] -= speed;

      // Top pipe
      ctx.drawImage(
        img,
        432,
        588 - pipe[1],
        pipeWidth,
        pipe[1],
        pipe[0],
        0,
        pipeWidth,
        pipe[1]
      );

      // Bottom pipe
      ctx.drawImage(
        img,
        432 + pipeWidth,
        108,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap,
        pipe[0],
        pipe[1] + pipeGap,
        pipeWidth,
        canvas.height - pipe[1]
      );

      if (pipe[0] <= -pipeWidth) {
        currentScore++;
        bestScore = Math.max(bestScore, currentScore);

        // remove pipe + create new pipe
        pipes = [
          ...pipes.slice(1),
          [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()],
        ];
      }
      // if hit the pipe, end
      if ([
        pipe[0] <= cTenth + size[0],
        pipe[0] + pipeWidth >= cTenth,
        pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
      ].every(elem => elem)) {
        actualScore = currentScore;
        gamePlaying = 2;
        setup();
      }
    });
  }

  document.getElementById("bestScore").innerHTML = `Meilleur : ${bestScore}`;
  document.getElementById("currentScore").innerHTML = `Actuel : ${currentScore}`;

  window.requestAnimationFrame(render); //relance la fct render et donc l'anim
};

setup();
img.onload = render; //Au chargement de l'image, tu lances render
document.addEventListener("click", () => (gamePlaying = 1));
window.onclick = () => (flight = jump);

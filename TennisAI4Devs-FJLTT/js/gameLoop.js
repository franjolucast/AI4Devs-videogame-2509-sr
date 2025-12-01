// js/gameLoop.js



// ---------- Configuración y estado inicial ----------
const config = loadGameConfig();
if (!config) {
    alert("No hay configuración de partido. Volviendo a Home.");
    window.location.href = "index.html";
}

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const hudPlayerName = document.getElementById("hud-player-name");
const hudOpponentName = document.getElementById("hud-opponent-name");
const hudDifficulty = document.getElementById("hud-difficulty");
const hudSets = document.getElementById("hud-sets");
const backBtn = document.getElementById("back-home");



// Dificultad y atributos del rival
const difficultyNames = {
    junior: "Junior",
    challenger: "Challenger",
    atp: "ATP"
};

const opponentAliases = {
    junior: "Novatín",
    challenger: "La Bala",
    atp: "El Martillo"
};

const difficultyParams = {
    junior:   { playerSpeed: 260, oppSpeed: 220, oppErrorChance: 0.35, ballSpeed: 280 },
    challenger:{ playerSpeed: 280, oppSpeed: 260, oppErrorChance: 0.18, ballSpeed: 320 },
    atp:      { playerSpeed: 300, oppSpeed: 300, oppErrorChance: 0.06, ballSpeed: 360 }
};

const params = difficultyParams[config.difficulty] || difficultyParams.junior;

// Sistema oficial de puntuación
const scoring = new TennisScoring(config.sets);

// Nuevo: quién saca el juego actual
let server = "player";  // el jugador saca el primer juego

// HUD del marcador
let scoreP = "0";
let scoreO = "0";

// HUD
hudPlayerName.textContent = config.playerName;
hudOpponentName.textContent = opponentAliases[config.difficulty] || "Rival";
hudDifficulty.textContent = difficultyNames[config.difficulty] || "Desconocida";
hudSets.textContent = `A ${config.sets} sets`;

// Botón volver
backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});

// ---------- Mundo del juego ----------
const WIDTH = canvas.width;   // 420
const HEIGHT = canvas.height; // 640

const netY = HEIGHT / 2;
const courtPaddingX = 30;
const baselineOffset = 60;

// Jugador (abajo)
const player = {
    x: WIDTH / 2,
    y: HEIGHT - baselineOffset,
    width: 14,
    height: 40,
    color: "#f6e9ff",
    speed: params.playerSpeed,
    swingTimer: 0
};

// Rival (arriba)
const opponent = {
    x: WIDTH / 2,
    y: baselineOffset,
    width: 14,
    height: 40,
    color: "#ffe08a",
    speed: params.oppSpeed,
    swingCooldown: 0
};

// Pelota
const ball = {
    x: player.x,
    y: player.y - 30,
    radius: 5,
    vx: 0,
    vy: 0,
    inPlay: false,
    lastHitter: "player" // "player" | "opponent"
};

// Entrada de teclado
const keys = {};
window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
    if ([" ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(e.key.toLowerCase())) {
        e.preventDefault();
    }
});
window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Control de tiempo
let lastTime = performance.now();

// ---------- Lógica principal ----------
function gameLoop(timestamp) {
    const dt = Math.min(0.033, (timestamp - lastTime) / 1000); // tope 33ms
    lastTime = timestamp;

    update(dt);
    render();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

// ---------- Update ----------
function update(dt) {
    handlePlayerInput(dt);
    handleOpponentAI(dt);
    updateBall(dt);
}

// Movimiento del jugador y swing
function handlePlayerInput(dt) {
    let dirX = 0;
    let dirY = 0;

    if (keys["arrowleft"] || keys["a"]) dirX -= 1;
    if (keys["arrowright"] || keys["d"]) dirX += 1;
    if (keys["arrowup"] || keys["w"]) dirY -= 1;
    if (keys["arrowdown"] || keys["s"]) dirY += 1;

    const len = Math.hypot(dirX, dirY) || 1;
    dirX /= len;
    dirY /= len;

    player.x += dirX * player.speed * dt;
    player.y += dirY * player.speed * dt;

    // Limites – solo mitad inferior de la pista
    if (player.x < courtPaddingX) player.x = courtPaddingX;
    if (player.x > WIDTH - courtPaddingX) player.x = WIDTH - courtPaddingX;
    if (player.y < netY + 20) player.y = netY + 20;
    if (player.y > HEIGHT - baselineOffset) player.y = HEIGHT - baselineOffset;

    // Swing con espacio
    if (keys[" "]) {
        player.swingTimer = 0.18; // ventana de golpeo ~180 ms
    } else if (player.swingTimer > 0) {
        player.swingTimer -= dt;
        if (player.swingTimer < 0) player.swingTimer = 0;
    }

    // Si no hay bola en juego → preparar saque del jugador o rival
    if (!ball.inPlay) {
        if (server === "player") {
            ball.x = player.x + 12;
            ball.y = player.y - 30;

            // Saque manual del jugador
            if (keys[" "]) {
                startServeFromPlayer();
            }
        } else {
            ball.x = opponent.x - 12;
            ball.y = opponent.y + 30;

            // Saque automático del rival
            setTimeout(() => {
                if (!ball.inPlay) startServeFromOpponent();
            }, 400);
        }
    }

}

function startServeFromOpponent() {
    ball.inPlay = true;
    ball.lastHitter = "opponent";

    const angleDeg = randomRange(65, 115);
    const angleRad = (angleDeg * Math.PI) / 180;
    const speed = params.ballSpeed;

    ball.vx = Math.cos(angleRad) * speed;
    ball.vy = Math.abs(Math.sin(angleRad) * speed); // hacia abajo
}


// Movimiento simple IA
function handleOpponentAI(dt) {
    if (!ball.inPlay) {
        // Posición inicial centrada
        moveTowards(opponent, WIDTH / 2, baselineOffset + 10, params.oppSpeed, dt);
    } else {
        // Objetivo: seguir la pelota SOLO si está en su mitad
        let targetX = ball.x;
        let targetY = ball.y;

        // El rival solo juega en su mitad superior
        if (targetY > netY - 20) {
            targetY = netY - 20;
        }
        if (targetY < baselineOffset) {
            targetY = baselineOffset + 10;
        }

        moveTowards(opponent, targetX, targetY, opponent.speed, dt);
    }

    // LIMITES DE MOVIMIENTO DEL RIVAL (toda su mitad)
    if (opponent.x < courtPaddingX) opponent.x = courtPaddingX;
    if (opponent.x > WIDTH - courtPaddingX) opponent.x = WIDTH - courtPaddingX;

    if (opponent.y < baselineOffset) opponent.y = baselineOffset;
    if (opponent.y > netY - 40) opponent.y = netY - 40;

    // Cooldown de golpeo
    if (opponent.swingCooldown > 0) {
        opponent.swingCooldown -= dt;
        if (opponent.swingCooldown < 0) opponent.swingCooldown = 0;
    }

    tryOpponentHit();
}


function moveTowards(entity, targetX, targetY, speed, dt) {
    const dx = targetX - entity.x;
    const dy = targetY - entity.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 1) return;
    const nx = dx / dist;
    const ny = dy / dist;
    entity.x += nx * speed * dt;
    entity.y += ny * speed * dt;
}

function startServeFromPlayer() {
    ball.inPlay = true;
    ball.lastHitter = "player";

    const angleDeg = randomRange(65, 115); // hacia arriba
    const angleRad = (angleDeg * Math.PI) / 180;
    const speed = params.ballSpeed;

    ball.vx = Math.cos(angleRad) * speed;
    ball.vy = -Math.abs(Math.sin(angleRad) * speed);
}

// Update de la pelota
function updateBall(dt) {
    if (!ball.inPlay) return;

    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    // Salida lateral izquierda → punto rival
    if (ball.x < courtPaddingX - ball.radius) {
        pointWonBy("opponent");
        return;
    }

    // Salida lateral derecha → punto jugador
    if (ball.x > WIDTH - courtPaddingX + ball.radius) {
        pointWonBy("player");
        return;
    }


    // Comprobar golpes
    checkPlayerHit();
    // IA ya lo intenta en handleOpponentAI

    // Comprobar puntos (salir por fondo)
    if (ball.y > HEIGHT + 10) {
        // Se le escapa al jugador -> punto rival
        pointWonBy("opponent");
    } else if (ball.y < -10) {
        // Se le escapa al rival -> punto jugador
        pointWonBy("player");
    }
}

function checkPlayerHit() {
    if (!ball.inPlay) return;

    // Solo si viene hacia el jugador y está en su mitad
    if (ball.vy >= 0) {
        if (ball.y < netY + 10) return;
    }

    const dx = ball.x - (player.x + 10);
    const dy = ball.y - (player.y - 20);
    const dist = Math.hypot(dx, dy);

    const hitRange = 28;

    if (dist <= hitRange && player.swingTimer > 0) {
        performHit("player");
    }
}

function tryOpponentHit() {
    if (!ball.inPlay) return;

    // Solo si viene hacia el rival y está en su mitad
    if (ball.vy <= 0) {
        if (ball.y > netY - 10) return;
    } else {
        return;
    }

    const dx = ball.x - (opponent.x - 10);
    const dy = ball.y - (opponent.y + 20);
    const dist = Math.hypot(dx, dy);
    const hitRange = 28;

    if (dist <= hitRange && opponent.swingCooldown <= 0) {
        // Probabilidad de fallo según dificultad
        if (Math.random() < params.oppErrorChance) {
            // Falla: deja pasar la bola
            opponent.swingCooldown = 0.4;
            return;
        }
        performHit("opponent");
        opponent.swingCooldown = 0.25;
    }
}

function performHit(who) {
    ball.lastHitter = who;

    const baseSpeed = params.ballSpeed;
    let angleDeg;

    if (who === "player") {
        // Golpe hacia arriba
        angleDeg = randomRange(60, 120);
        // Añade efecto según posición relativa al centro
        if (ball.x < WIDTH / 2) angleDeg -= 10;
        if (ball.x > WIDTH / 2) angleDeg += 10;
        ball.vy = -Math.abs(baseSpeed * Math.sin((angleDeg * Math.PI) / 180));
    } else {
        // Golpe hacia abajo
        angleDeg = randomRange(60, 120);
        if (ball.x < WIDTH / 2) angleDeg += 10;
        if (ball.x > WIDTH / 2) angleDeg -= 10;
        ball.vy = Math.abs(baseSpeed * Math.sin((angleDeg * Math.PI) / 180));
    }

    const angleRad = (angleDeg * Math.PI) / 180;
    ball.vx = baseSpeed * Math.cos(angleRad);
}

function pointWonBy(who) {
    // Registrar punto real
    const prevPlayerGames = scoring.playerGames;
    const prevOpponentGames = scoring.opponentGames;

    scoring.pointWonBy(who);

    // ¿Ha terminado un juego?
    const gameEnded =
        scoring.playerGames !== prevPlayerGames ||
        scoring.opponentGames !== prevOpponentGames;

    if (gameEnded) {
        // ALTERNAR SACADOR
        server = (server === "player") ? "opponent" : "player";
    }

    // ¿Ha terminado el partido?
    if (scoring.matchFinished) {
        setTimeout(() => {
            alert("¡Partido terminado!\n" +
                  `${config.playerName}: ${scoring.playerSets} sets\n` +
                  `${opponentAliases[config.difficulty]}: ${scoring.opponentSets} sets`);
            window.location.href = "index.html";
        }, 400);
        return;
    }

    // Reiniciar la jugada
    resetPoint();
}

function resetPoint() {
    ball.inPlay = false;
    ball.vx = 0;
    ball.vy = 0;

    if (server === "player") {
        // El jugador saca
        ball.x = player.x + 10;
        ball.y = player.y - 30;
        ball.lastHitter = "player";
    } else {
        // El rival saca
        ball.x = opponent.x - 10;
        ball.y = opponent.y + 30;
        ball.lastHitter = "opponent";
    }
}




function render() {
    // Fondo según superficie
    ctx.fillStyle = getSurfaceColor(config.surface);
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Bordes
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;

    // Proporciones pista real simplificadas
    const courtTop = baselineOffset;
    const courtBottom = HEIGHT - baselineOffset;
    const courtLeft = courtPaddingX;
    const courtRight = WIDTH - courtPaddingX;

    // Marco general de pista
    ctx.strokeRect(
        courtLeft,
        courtTop,
        courtRight - courtLeft,
        courtBottom - courtTop
    );

    // Red
    // RED REAL (2px grosor, siempre encima)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(
        courtLeft,
        netY - 1,
        (courtRight - courtLeft),
        2
    );

    // Líneas de saque arriba y abajo
    const serviceLineTop = netY - (HEIGHT * 0.16);
    const serviceLineBottom = netY + (HEIGHT * 0.16);

    ctx.fillRect(
        courtLeft,
        serviceLineTop - 1,
        courtRight - courtLeft,
        2
    );

    ctx.fillRect(
        courtLeft,
        serviceLineBottom - 1,
        courtRight - courtLeft,
        2
    );

    // Línea central (larga)
    ctx.fillRect(
        WIDTH / 2 - 1,
        serviceLineTop,
        2,
        serviceLineBottom - serviceLineTop
    );

    // Jugador y rival
    drawPlayer(player, false);
    drawPlayer(opponent, true);

    // Pelota
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffff66";
    ctx.fill();

    document.getElementById("hud-games").innerText = `${scoring.playerGames} - ${scoring.opponentGames}`;

    document.getElementById("hud-sets-score").innerText = `${scoring.playerSets} - ${scoring.opponentSets}`;

    document.getElementById("hud-points").innerText = `${scoring.getDisplayPoints(true)} - ${scoring.getDisplayPoints(false)}`;

}


function drawPlayer(p, isOpponent) {
    // Cuerpo
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.width / 2, p.y - p.height, p.width, p.height);

    // Cabeza
    ctx.beginPath();
    ctx.arc(p.x, p.y - p.height - 8, 8, 0, Math.PI * 2);
    ctx.fill();

    // Raqueta simple
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;

    if (!isOpponent) {
        // Jugador abajo: raqueta a la derecha
        const rx = p.x + 12;
        const ry = p.y - p.height + 10;
        ctx.beginPath();
        ctx.arc(rx, ry, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p.x + 2, p.y - p.height + 15);
        ctx.lineTo(rx - 4, ry + 6);
        ctx.stroke();
    } else {
        // Rival arriba: raqueta a la izquierda
        const rx = p.x - 12;
        const ry = p.y - p.height + 10;
        ctx.beginPath();
        ctx.arc(rx, ry, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(p.x - 2, p.y - p.height + 15);
        ctx.lineTo(rx + 4, ry + 6);
        ctx.stroke();
    }
}

function getSurfaceColor(surface) {
    switch (surface) {
        case "clay":
            return "#c95b1a"; // naranja
        case "grass":
            return "#2a8f33"; // verde
        case "hard":
        default:
            return "#1f3b8a"; // azul
    }
}

function randomRange(min, max) {
    return min + Math.random() * (max - min);
}

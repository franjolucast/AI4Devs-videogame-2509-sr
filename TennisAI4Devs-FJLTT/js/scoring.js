// js/scoring.js

window.TennisScoring = class TennisScoring {
    constructor(setFormat = 1) {
        this.setFormat = setFormat;

        this.resetMatch();
    }

    resetMatch() {
        this.playerGames = 0;
        this.opponentGames = 0;

        this.playerSets = 0;
        this.opponentSets = 0;

        this.playerPoints = 0;
        this.opponentPoints = 0;

        this.matchFinished = false;

        this.playerAdv = false;
        this.opponentAdv = false;
    }

    // --- Conversión puntos numéricos a tenis (0,15,30,40,Adv)
    getDisplayPoints(player) {
        const p = player ? this.playerPoints : this.opponentPoints;

        if (this.playerPoints >= 3 && this.opponentPoints >= 3) {
            if (this.playerAdv) return player ? "AD" : "40";
            if (this.opponentAdv) return player ? "40" : "AD";
            return "40";
        }

        return ["0","15","30","40"][p];
    }

    pointWonBy(who) {
        if (this.matchFinished) return;

        let player = who === "player";

        // --- Modo deuce ---
        if (this.playerPoints >= 3 && this.opponentPoints >= 3) {
            if (player) {
                if (this.opponentAdv) {
                    this.opponentAdv = false;
                } else if (this.playerAdv) {
                    this.winGame(true);
                } else {
                    this.playerAdv = true;
                }
            } else {
                if (this.playerAdv) {
                    this.playerAdv = false;
                } else if (this.opponentAdv) {
                    this.winGame(false);
                } else {
                    this.opponentAdv = true;
                }
            }
            return;
        }

        // --- Juego normal ---
        if (player) {
            this.playerPoints++;
            if (this.playerPoints >= 4) {
                this.winGame(true);
            }
        } else {
            this.opponentPoints++;
            if (this.opponentPoints >= 4) {
                this.winGame(false);
            }
        }
    }

    winGame(playerWon) {
        if (playerWon) this.playerGames++;
        else this.opponentGames++;

        // Reset puntos
        this.playerPoints = 0;
        this.opponentPoints = 0;
        this.playerAdv = false;
        this.opponentAdv = false;

        // ¿Se gana el set?
        if (this.isSetWon()) {
            if (playerWon) this.playerSets++;
            else this.opponentSets++;

            this.playerGames = 0;
            this.opponentGames = 0;

            // ¿Se gana el partido?
            if (this.isMatchWon()) this.matchFinished = true;
        }
    }

    isSetWon() {
        const p = this.playerGames;
        const o = this.opponentGames;

        // Set normal a 6 con diferencia de 2
        if (p >= 6 || o >= 6) {
            if (Math.abs(p - o) >= 2) return true;
        }
        return false;
    }

    isMatchWon() {
        const needed = Math.ceil(this.setFormat / 2);
        return (
            this.playerSets === needed ||
            this.opponentSets === needed
        );
    }
}

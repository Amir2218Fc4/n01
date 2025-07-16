export class GameManager {
    constructor() {
        this.reset();
    }

    reset() {
        this.gameType = 501;
        this.totalLegs = 1;
        this.currentLeg = 1;
        this.players = [];
        this.currentPlayerIndex = 0;
        this.gameHistory = [];
        this.legHistory = [];
        this.gameActive = false;
    }

    startNewGame(gameType, legs, player1Config, player2Config) {
        this.reset();
        this.gameType = gameType;
        this.totalLegs = legs;
        this.gameActive = true;

        // Initialize players
        this.players = [
            {
                ...player1Config,
                score: gameType,
                dartsThrown: 0,
                totalScore: 0,
                legs: 0,
                tons: 0,
                oneEighties: 0,
                highestFinish: 0,
                throws: []
            },
            {
                ...player2Config,
                score: gameType,
                dartsThrown: 0,
                totalScore: 0,
                legs: 0,
                tons: 0,
                oneEighties: 0,
                highestFinish: 0,
                throws: []
            }
        ];

        this.gameHistory = [];
        this.legHistory = [];
    }

    getCurrentPlayer() {
        return this.gameActive ? this.players[this.currentPlayerIndex] : null;
    }

    getOpponent() {
        return this.gameActive ? this.players[1 - this.currentPlayerIndex] : null;
    }

    submitScore(darts) {
        if (!this.gameActive) {
            return { valid: false, message: 'Game not active' };
        }

        const player = this.getCurrentPlayer();
        const totalScore = darts.reduce((sum, dart) => sum + dart, 0);

        // Validate score
        if (totalScore > 180) {
            return { valid: false, message: 'Score too high (max 180)' };
        }

        if (totalScore > player.score) {
            return { valid: false, message: 'Bust! Score exceeds remaining' };
        }

        // Check for valid finish (must end on double)
        const newScore = player.score - totalScore;
        if (newScore === 0) {
            const lastDart = darts[darts.length - 1];
            if (!this.isValidFinish(lastDart, player.score)) {
                return { valid: false, message: 'Must finish on double!' };
            }
        }

        if (newScore === 1) {
            return { valid: false, message: 'Cannot leave score of 1!' };
        }

        // Apply score
        player.score = newScore;
        player.dartsThrown += darts.length;
        player.totalScore += totalScore;

        // Update statistics
        this.updatePlayerStats(player, darts, totalScore);

        // Record throw
        const throwRecord = {
            player: player.name,
            darts: [...darts],
            total: totalScore,
            remaining: player.score,
            timestamp: new Date()
        };

        player.throws.push(throwRecord);
        this.gameHistory.push(throwRecord);

        // Check for leg win
        let winner = null;
        if (player.score === 0) {
            player.legs++;
            player.highestFinish = Math.max(player.highestFinish, totalScore);
            
            // Check for game win
            const legsToWin = Math.ceil(this.totalLegs / 2);
            if (player.legs >= legsToWin) {
                winner = player;
                this.gameActive = false;
            } else {
                // Start new leg
                this.startNewLeg();
            }
        } else {
            // Switch to next player
            this.currentPlayerIndex = 1 - this.currentPlayerIndex;
        }

        return {
            valid: true,
            player: player.name,
            score: totalScore,
            remaining: player.score,
            winner: winner,
            darts: darts
        };
    }

    isValidFinish(lastDart, remainingBefore) {
        // For simplicity, assume any score that finishes the game is valid
        // In a real implementation, you'd check if it's actually a double
        return remainingBefore <= 170 && lastDart > 0;
    }

    updatePlayerStats(player, darts, totalScore) {
        // Count tons (100+)
        if (totalScore >= 100) {
            player.tons++;
        }

        // Count 180s
        if (totalScore === 180) {
            player.oneEighties++;
        }
    }

    startNewLeg() {
        this.currentLeg++;
        
        // Reset player scores
        this.players.forEach(player => {
            player.score = this.gameType;
            player.dartsThrown = 0;
            player.totalScore = 0;
            player.throws = [];
        });

        // Store leg history
        this.legHistory.push([...this.gameHistory]);
        this.gameHistory = [];
        
        // Reset to first player
        this.currentPlayerIndex = 0;
    }

    undoLastThrow() {
        if (!this.gameActive || this.gameHistory.length === 0) {
            return false;
        }

        const lastThrow = this.gameHistory.pop();
        const player = this.players.find(p => p.name === lastThrow.player);
        
        if (player) {
            // Restore player state
            player.score += lastThrow.total;
            player.dartsThrown -= lastThrow.darts.length;
            player.totalScore -= lastThrow.total;
            player.throws.pop();

            // Update stats (reverse)
            if (lastThrow.total >= 100) {
                player.tons = Math.max(0, player.tons - 1);
            }
            if (lastThrow.total === 180) {
                player.oneEighties = Math.max(0, player.oneEighties - 1);
            }

            // Switch back to the player who threw
            this.currentPlayerIndex = this.players.indexOf(player);
        }

        return true;
    }

    getGameState() {
        return {
            gameType: this.gameType,
            totalLegs: this.totalLegs,
            currentLeg: this.currentLeg,
            players: this.players,
            currentPlayerIndex: this.currentPlayerIndex,
            gameActive: this.gameActive,
            history: this.gameHistory
        };
    }

    getPlayerAverage(player) {
        if (player.dartsThrown === 0) return 0;
        return (player.totalScore / player.dartsThrown * 3).toFixed(2);
    }

    getPlayerStats(player) {
        return {
            average: this.getPlayerAverage(player),
            dartsThrown: player.dartsThrown,
            legs: player.legs,
            tons: player.tons,
            oneEighties: player.oneEighties,
            highestFinish: player.highestFinish
        };
    }
}
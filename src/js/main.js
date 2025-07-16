import { GameManager } from './game/GameManager.js';
import { LanguageManager } from './language/LanguageManager.js';
import { UIManager } from './ui/UIManager.js';
import { SettingsManager } from './settings/SettingsManager.js';

class DartsApp {
    constructor() {
        this.languageManager = new LanguageManager();
        this.settingsManager = new SettingsManager();
        this.gameManager = new GameManager();
        this.uiManager = new UIManager(this.gameManager, this.languageManager, this.settingsManager);
        
        this.init();
    }

    async init() {
        // Initialize managers
        await this.languageManager.init();
        await this.settingsManager.init();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize UI
        this.uiManager.init();
        
        // Apply saved settings
        this.applySettings();
    }

    setupEventListeners() {
        // Language toggle
        document.getElementById('langToggle').addEventListener('click', () => {
            this.languageManager.toggleLanguage();
            this.uiManager.updateLanguage();
        });

        // Settings modal
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.uiManager.showSettingsModal();
        });

        document.getElementById('closeSettings').addEventListener('click', () => {
            this.uiManager.hideSettingsModal();
        });

        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });

        // Game controls
        document.getElementById('startGame').addEventListener('click', () => {
            this.startNewGame();
        });

        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.uiManager.showGameSetup();
        });

        document.getElementById('submitScore').addEventListener('click', () => {
            this.submitScore();
        });

        document.getElementById('undoBtn').addEventListener('click', () => {
            this.gameManager.undoLastThrow();
            this.uiManager.updateGameBoard();
        });

        // Player type changes
        document.getElementById('player1Type').addEventListener('change', (e) => {
            this.toggleComputerLevel('player1Level', e.target.value === 'computer');
        });

        document.getElementById('player2Type').addEventListener('change', (e) => {
            this.toggleComputerLevel('player2Level', e.target.value === 'computer');
        });

        // Dart input auto-calculation
        ['dart1', 'dart2', 'dart3'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                this.calculateTotal();
            });
        });

        // Play again button
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.uiManager.hideWinnerModal();
            this.uiManager.showGameSetup();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    toggleComputerLevel(levelId, show) {
        const levelSelect = document.getElementById(levelId);
        levelSelect.style.display = show ? 'block' : 'none';
    }

    calculateTotal() {
        const dart1 = parseInt(document.getElementById('dart1').value) || 0;
        const dart2 = parseInt(document.getElementById('dart2').value) || 0;
        const dart3 = parseInt(document.getElementById('dart3').value) || 0;
        
        const total = dart1 + dart2 + dart3;
        document.getElementById('totalScore').textContent = total;
        
        // Show checkout suggestions if applicable
        this.showCheckoutSuggestions();
    }

    showCheckoutSuggestions() {
        const currentPlayer = this.gameManager.getCurrentPlayer();
        if (!currentPlayer) return;

        const remaining = currentPlayer.score;
        const checkoutOptions = document.getElementById('checkoutOptions');
        
        if (remaining <= 170 && remaining > 1) {
            const suggestions = this.getCheckoutSuggestions(remaining);
            checkoutOptions.innerHTML = suggestions.map(suggestion => 
                `<div class="checkout-option">${suggestion}</div>`
            ).join('');
            document.getElementById('checkoutHelper').style.display = 'block';
        } else {
            document.getElementById('checkoutHelper').style.display = 'none';
        }
    }

    getCheckoutSuggestions(score) {
        const checkouts = {
            170: ['T20, T20, Bull'],
            167: ['T20, T19, Bull'],
            164: ['T20, T18, Bull', 'T19, T19, Bull'],
            161: ['T20, T17, Bull'],
            160: ['T20, T20, D20'],
            158: ['T20, T20, D19'],
            157: ['T20, T19, D20'],
            156: ['T20, T20, D18'],
            155: ['T20, T19, D19'],
            154: ['T20, T18, D20'],
            153: ['T20, T19, D18'],
            152: ['T20, T20, D16'],
            151: ['T20, T17, D20'],
            150: ['T20, T18, D18'],
            149: ['T20, T19, D16'],
            148: ['T20, T20, D14'],
            147: ['T20, T17, D18'],
            146: ['T20, T18, D16'],
            145: ['T20, T19, D14'],
            144: ['T20, T20, D12'],
            143: ['T20, T17, D16'],
            142: ['T20, T18, D14'],
            141: ['T20, T19, D12'],
            140: ['T20, T20, D10'],
            139: ['T20, T19, D11'],
            138: ['T20, T18, D12'],
            137: ['T20, T19, D10'],
            136: ['T20, T20, D8'],
            135: ['T20, T17, D12'],
            134: ['T20, T18, D10'],
            133: ['T20, T19, D8'],
            132: ['T20, T20, D6'],
            131: ['T20, T17, D10'],
            130: ['T20, T18, D8'],
            129: ['T19, T16, D12'],
            128: ['T18, T18, D8'],
            127: ['T20, T17, D8'],
            126: ['T19, T19, D6'],
            125: ['T20, T15, D10'],
            124: ['T20, T16, D8'],
            123: ['T19, T16, D9'],
            122: ['T18, T20, D4'],
            121: ['T17, T20, D5'],
            120: ['T20, S20, D20'],
            119: ['T19, T20, D1'],
            118: ['T20, S18, D20'],
            117: ['T20, S17, D20'],
            116: ['T20, S16, D20'],
            115: ['T20, S15, D20'],
            114: ['T20, S14, D20'],
            113: ['T20, S13, D20'],
            112: ['T20, S12, D20'],
            111: ['T20, S11, D20'],
            110: ['T20, S10, D20'],
            109: ['T20, S9, D20'],
            108: ['T20, S8, D20'],
            107: ['T19, S10, D20'],
            106: ['T20, S6, D20'],
            105: ['T20, S5, D20'],
            104: ['T18, S10, D20'],
            103: ['T17, S12, D20'],
            102: ['T20, S2, D20'],
            101: ['T17, S10, D20'],
            100: ['T20, D20'],
            99: ['T19, S10, D16'],
            98: ['T20, D19'],
            97: ['T19, D20'],
            96: ['T20, D18'],
            95: ['T19, D19'],
            94: ['T18, D20'],
            93: ['T19, D18'],
            92: ['T20, D16'],
            91: ['T17, D20'],
            90: ['T18, D18'],
            89: ['T19, D16'],
            88: ['T16, D20'],
            87: ['T17, D18'],
            86: ['T18, D16'],
            85: ['T15, D20'],
            84: ['T20, D12'],
            83: ['T17, D16'],
            82: ['T14, D20'],
            81: ['T19, D12'],
            80: ['T20, D10'],
            79: ['T13, D20'],
            78: ['T18, D12'],
            77: ['T19, D10'],
            76: ['T20, D8'],
            75: ['T17, D12'],
            74: ['T14, D16'],
            73: ['T19, D8'],
            72: ['T16, D12'],
            71: ['T13, D16'],
            70: ['T18, D8'],
            69: ['T15, D12'],
            68: ['T16, D10'],
            67: ['T17, D8'],
            66: ['T14, D12'],
            65: ['T19, D4'],
            64: ['T16, D8'],
            63: ['T17, D6'],
            62: ['T10, D16'],
            61: ['T15, D8'],
            60: ['S20, D20'],
            59: ['S19, D20'],
            58: ['S18, D20'],
            57: ['S17, D20'],
            56: ['S16, D20'],
            55: ['S15, D20'],
            54: ['S14, D20'],
            53: ['S13, D20'],
            52: ['S12, D20'],
            51: ['S11, D20'],
            50: ['S10, D20', 'Bull'],
            49: ['S9, D20'],
            48: ['S8, D20'],
            47: ['S7, D20'],
            46: ['S6, D20'],
            45: ['S5, D20'],
            44: ['S4, D20'],
            43: ['S3, D20'],
            42: ['S2, D20'],
            41: ['S1, D20'],
            40: ['D20'],
            39: ['S7, D16'],
            38: ['D19'],
            37: ['S5, D16'],
            36: ['D18'],
            35: ['S3, D16'],
            34: ['D17'],
            33: ['S1, D16'],
            32: ['D16'],
            31: ['S7, D12'],
            30: ['D15'],
            29: ['S5, D12'],
            28: ['D14'],
            27: ['S3, D12'],
            26: ['D13'],
            25: ['S1, D12'],
            24: ['D12'],
            23: ['S7, D8'],
            22: ['D11'],
            21: ['S5, D8'],
            20: ['D10'],
            19: ['S3, D8'],
            18: ['D9'],
            17: ['S1, D8'],
            16: ['D8'],
            15: ['S7, D4'],
            14: ['D7'],
            13: ['S5, D4'],
            12: ['D6'],
            11: ['S3, D4'],
            10: ['D5'],
            9: ['S1, D4'],
            8: ['D4'],
            7: ['S3, D2'],
            6: ['D3'],
            5: ['S1, D2'],
            4: ['D2'],
            3: ['S1, D1'],
            2: ['D1']
        };

        return checkouts[score] || [];
    }

    startNewGame() {
        const gameType = parseInt(document.getElementById('gameType').value);
        const legs = parseInt(document.getElementById('legs').value);
        
        const player1 = {
            name: document.getElementById('player1Name').value || 'Player 1',
            type: document.getElementById('player1Type').value,
            level: parseInt(document.getElementById('player1Level').value) || 6
        };
        
        const player2 = {
            name: document.getElementById('player2Name').value || 'Player 2',
            type: document.getElementById('player2Type').value,
            level: parseInt(document.getElementById('player2Level').value) || 6
        };

        this.gameManager.startNewGame(gameType, legs, player1, player2);
        this.uiManager.showGameBoard();
        this.uiManager.updateGameBoard();
        
        // Start computer turn if first player is computer
        if (player1.type === 'computer') {
            setTimeout(() => this.playComputerTurn(), 1000);
        }
    }

    submitScore() {
        const dart1 = parseInt(document.getElementById('dart1').value) || 0;
        const dart2 = parseInt(document.getElementById('dart2').value) || 0;
        const dart3 = parseInt(document.getElementById('dart3').value) || 0;
        
        const darts = [dart1, dart2, dart3].filter(dart => dart > 0);
        
        if (darts.length === 0) return;
        
        const result = this.gameManager.submitScore(darts);
        
        if (result.valid) {
            this.uiManager.updateGameBoard();
            this.uiManager.addToHistory(result);
            
            // Clear inputs
            document.getElementById('dart1').value = '';
            document.getElementById('dart2').value = '';
            document.getElementById('dart3').value = '';
            document.getElementById('totalScore').textContent = '0';
            
            // Check for winner
            if (result.winner) {
                this.uiManager.showWinner(result.winner);
            } else if (this.gameManager.getCurrentPlayer().type === 'computer') {
                // Computer's turn
                setTimeout(() => this.playComputerTurn(), 1000);
            }
        } else {
            alert(result.message || 'Invalid score!');
        }
    }

    playComputerTurn() {
        const currentPlayer = this.gameManager.getCurrentPlayer();
        if (!currentPlayer || currentPlayer.type !== 'computer') return;

        const darts = this.generateComputerThrow(currentPlayer);
        
        // Simulate throwing animation
        this.uiManager.showComputerThinking();
        
        setTimeout(() => {
            const result = this.gameManager.submitScore(darts);
            this.uiManager.updateGameBoard();
            this.uiManager.addToHistory(result);
            
            if (result.winner) {
                this.uiManager.showWinner(result.winner);
            } else if (this.gameManager.getCurrentPlayer().type === 'computer') {
                // Next player is also computer
                setTimeout(() => this.playComputerTurn(), 1000);
            }
        }, 2000);
    }

    generateComputerThrow(player) {
        const level = player.level;
        const remaining = player.score;
        const darts = [];
        
        // Computer skill levels (accuracy percentage)
        const skillLevels = {
            1: 0.3,   // 30% accuracy
            2: 0.35,
            3: 0.4,
            4: 0.45,
            5: 0.5,
            6: 0.55,  // 55% accuracy
            7: 0.6,
            8: 0.65,
            9: 0.7,
            10: 0.75,
            11: 0.8,
            12: 0.85  // 85% accuracy
        };
        
        const accuracy = skillLevels[level] || 0.5;
        let currentRemaining = remaining;
        
        for (let i = 0; i < 3 && currentRemaining > 0; i++) {
            let targetScore;
            
            if (currentRemaining <= 170 && Math.random() < accuracy) {
                // Try for checkout
                targetScore = this.getComputerCheckoutAttempt(currentRemaining, accuracy);
            } else {
                // Go for high score
                targetScore = this.getComputerHighScore(accuracy);
            }
            
            // Add some randomness based on skill level
            const variance = Math.floor((1 - accuracy) * 30);
            const actualScore = Math.max(0, targetScore + Math.floor(Math.random() * variance * 2) - variance);
            
            if (actualScore <= currentRemaining) {
                darts.push(actualScore);
                currentRemaining -= actualScore;
            } else {
                darts.push(0); // Bust
                break;
            }
        }
        
        return darts;
    }

    getComputerCheckoutAttempt(remaining, accuracy) {
        // Simple checkout logic - computer tries for doubles when low
        if (remaining <= 40 && remaining % 2 === 0 && Math.random() < accuracy) {
            return remaining; // Try for double out
        }
        
        if (remaining <= 60) {
            return Math.min(remaining - 2, 20); // Leave even number for double
        }
        
        return Math.min(60, remaining);
    }

    getComputerHighScore(accuracy) {
        const targets = [60, 57, 54, 51, 48, 45, 42, 39, 36, 33, 30];
        const baseTarget = targets[Math.floor(Math.random() * targets.length)];
        
        if (Math.random() < accuracy) {
            return baseTarget;
        } else {
            // Miss - return lower score
            return Math.floor(baseTarget * (0.3 + Math.random() * 0.4));
        }
    }

    saveSettings() {
        const language = document.getElementById('languageSelect').value;
        const theme = document.getElementById('themeSelect').value;
        const sound = document.getElementById('soundToggle').checked;
        
        this.settingsManager.updateSettings({
            language,
            theme,
            sound
        });
        
        this.applySettings();
        this.uiManager.hideSettingsModal();
    }

    applySettings() {
        const settings = this.settingsManager.getSettings();
        
        // Apply language
        this.languageManager.setLanguage(settings.language);
        this.uiManager.updateLanguage();
        
        // Apply theme
        document.documentElement.setAttribute('data-theme', settings.theme);
        
        // Update settings modal
        document.getElementById('languageSelect').value = settings.language;
        document.getElementById('themeSelect').value = settings.theme;
        document.getElementById('soundToggle').checked = settings.sound;
    }

    handleKeyboardShortcuts(e) {
        // Only handle shortcuts when not in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
        
        switch (e.key) {
            case 'Enter':
                if (document.getElementById('gameBoard').style.display !== 'none') {
                    this.submitScore();
                }
                break;
            case 'Escape':
                if (document.getElementById('settingsModal').style.display !== 'none') {
                    this.uiManager.hideSettingsModal();
                }
                if (document.getElementById('winnerModal').style.display !== 'none') {
                    this.uiManager.hideWinnerModal();
                }
                break;
            case 'u':
            case 'U':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.gameManager.undoLastThrow();
                    this.uiManager.updateGameBoard();
                }
                break;
            case 'n':
            case 'N':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.uiManager.showGameSetup();
                }
                break;
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DartsApp();
});
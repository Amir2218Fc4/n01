export class UIManager {
    constructor(gameManager, languageManager, settingsManager) {
        this.gameManager = gameManager;
        this.languageManager = languageManager;
        this.settingsManager = settingsManager;
    }

    init() {
        this.updateLanguage();
    }

    updateLanguage() {
        this.languageManager.updatePageLanguage();
    }

    showGameSetup() {
        document.getElementById('gameSetup').style.display = 'block';
        document.getElementById('gameBoard').style.display = 'none';
    }

    showGameBoard() {
        document.getElementById('gameSetup').style.display = 'none';
        document.getElementById('gameBoard').style.display = 'block';
    }

    updateGameBoard() {
        const gameState = this.gameManager.getGameState();
        
        if (!gameState.gameActive) return;

        // Update game info
        document.getElementById('gameTypeDisplay').textContent = gameState.gameType;
        document.getElementById('legInfo').textContent = 
            `Leg ${gameState.currentLeg} of ${gameState.totalLegs}`;

        // Update players
        gameState.players.forEach((player, index) => {
            const playerCard = document.getElementById(`player${index + 1}Card`);
            const isActive = index === gameState.currentPlayerIndex;
            
            // Update active state
            playerCard.classList.toggle('active', isActive);
            
            // Update player info
            document.getElementById(`player${index + 1}NameDisplay`).textContent = player.name;
            document.getElementById(`player${index + 1}Score`).textContent = 
                this.languageManager.formatNumber(player.score);
            
            // Update stats
            const stats = this.gameManager.getPlayerStats(player);
            document.getElementById(`player${index + 1}Darts`).textContent = 
                `${this.languageManager.translate('darts')}: ${this.languageManager.formatNumber(player.dartsThrown)}`;
            document.getElementById(`player${index + 1}Average`).textContent = 
                `${this.languageManager.translate('average')}: ${this.languageManager.formatNumber(stats.average)}`;
            document.getElementById(`player${index + 1}Legs`).textContent = 
                this.languageManager.formatNumber(player.legs);
            document.getElementById(`player${index + 1}Tons`).textContent = 
                this.languageManager.formatNumber(player.tons);
            document.getElementById(`player${index + 1}OneEighties`).textContent = 
                this.languageManager.formatNumber(player.oneEighties);
            
            // Update status
            const status = document.getElementById(`player${index + 1}Status`);
            if (isActive) {
                status.textContent = this.languageManager.translate('active') || 'Active';
                status.className = 'player-status active';
            } else {
                status.textContent = this.languageManager.translate('waiting') || 'Waiting';
                status.className = 'player-status waiting';
            }
        });

        // Update current player display
        const currentPlayer = this.gameManager.getCurrentPlayer();
        if (currentPlayer) {
            document.getElementById('currentPlayerName').textContent = currentPlayer.name;
        }
    }

    addToHistory(result) {
        const historyList = document.getElementById('historyList');
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const dartsText = result.darts.join(', ');
        
        historyItem.innerHTML = `
            <span class="history-player">${result.player}</span>
            <span class="history-score">${dartsText} (${this.languageManager.formatNumber(result.score)})</span>
            <span class="history-remaining">${this.languageManager.formatNumber(result.remaining)}</span>
        `;
        
        historyList.insertBefore(historyItem, historyList.firstChild);
        
        // Keep only last 20 entries
        while (historyList.children.length > 20) {
            historyList.removeChild(historyList.lastChild);
        }
    }

    showSettingsModal() {
        document.getElementById('settingsModal').style.display = 'flex';
    }

    hideSettingsModal() {
        document.getElementById('settingsModal').style.display = 'none';
    }

    showWinner(winner) {
        const modal = document.getElementById('winnerModal');
        const title = document.getElementById('winnerTitle');
        const message = document.getElementById('winnerMessage');
        const stats = document.getElementById('winnerStats');
        
        title.textContent = this.languageManager.translate('winner');
        message.textContent = `${this.languageManager.translate('congratulations')} ${winner.name}!`;
        
        const playerStats = this.gameManager.getPlayerStats(winner);
        stats.innerHTML = `
            <div><strong>${this.languageManager.translate('legs')}:</strong> ${this.languageManager.formatNumber(winner.legs)}</div>
            <div><strong>${this.languageManager.translate('average')}:</strong> ${this.languageManager.formatNumber(playerStats.average)}</div>
            <div><strong>${this.languageManager.translate('tons')}:</strong> ${this.languageManager.formatNumber(winner.tons)}</div>
            <div><strong>${this.languageManager.translate('oneEighties')}:</strong> ${this.languageManager.formatNumber(winner.oneEighties)}</div>
        `;
        
        modal.style.display = 'flex';
    }

    hideWinnerModal() {
        document.getElementById('winnerModal').style.display = 'none';
    }

    showComputerThinking() {
        const currentPlayer = this.gameManager.getCurrentPlayer();
        if (currentPlayer && currentPlayer.type === 'computer') {
            // Add visual indication that computer is thinking
            const playerCard = document.querySelector('.player-card.active');
            if (playerCard) {
                playerCard.style.opacity = '0.7';
                playerCard.style.transform = 'scale(0.98)';
                
                setTimeout(() => {
                    playerCard.style.opacity = '1';
                    playerCard.style.transform = 'scale(1)';
                }, 2000);
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out',
            backgroundColor: type === 'error' ? '#dc2626' : 
                           type === 'success' ? '#059669' : 
                           type === 'warning' ? '#d97706' : '#2563eb'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    updateTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    // Utility method to format player names for display
    formatPlayerName(name, isActive = false) {
        const formattedName = this.languageManager.formatMixedText(name);
        return isActive ? `▶ ${formattedName}` : formattedName;
    }

    // Method to handle responsive layout changes
    handleResize() {
        const isMobile = window.innerWidth < 768;
        
        // Adjust layout for mobile
        if (isMobile) {
            document.querySelector('.players-board').style.gridTemplateColumns = '1fr';
        } else {
            document.querySelector('.players-board').style.gridTemplateColumns = '1fr auto 1fr';
        }
    }
}
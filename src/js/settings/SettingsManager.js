export class SettingsManager {
    constructor() {
        this.defaultSettings = {
            language: 'en',
            theme: 'light',
            sound: true,
            autoSave: true,
            showCheckoutSuggestions: true,
            animationSpeed: 'normal'
        };
        
        this.settings = { ...this.defaultSettings };
    }

    async init() {
        this.loadSettings();
    }

    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('dartsSettings');
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);
                this.settings = { ...this.defaultSettings, ...parsed };
            }
        } catch (error) {
            console.warn('Failed to load settings:', error);
            this.settings = { ...this.defaultSettings };
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('dartsSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save settings:', error);
        }
    }

    getSettings() {
        return { ...this.settings };
    }

    getSetting(key) {
        return this.settings[key];
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
    }

    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
    }

    resetSettings() {
        this.settings = { ...this.defaultSettings };
        this.saveSettings();
    }

    // Export settings to file
    exportSettings() {
        const dataStr = JSON.stringify(this.settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'darts-settings.json';
        link.click();
        
        URL.revokeObjectURL(link.href);
    }

    // Import settings from file
    async importSettings(file) {
        try {
            const text = await file.text();
            const importedSettings = JSON.parse(text);
            
            // Validate imported settings
            const validSettings = {};
            Object.keys(this.defaultSettings).forEach(key => {
                if (importedSettings.hasOwnProperty(key)) {
                    validSettings[key] = importedSettings[key];
                }
            });
            
            this.updateSettings(validSettings);
            return true;
        } catch (error) {
            console.error('Failed to import settings:', error);
            return false;
        }
    }

    // Get theme-specific CSS variables
    getThemeVariables() {
        const theme = this.settings.theme;
        
        if (theme === 'dark') {
            return {
                '--background': '#0f172a',
                '--surface': '#1e293b',
                '--text-primary': '#f1f5f9',
                '--text-secondary': '#94a3b8',
                '--border': '#334155'
            };
        }
        
        return {
            '--background': '#f8fafc',
            '--surface': '#ffffff',
            '--text-primary': '#1e293b',
            '--text-secondary': '#64748b',
            '--border': '#e2e8f0'
        };
    }

    // Apply theme variables to document
    applyTheme() {
        const variables = this.getThemeVariables();
        const root = document.documentElement;
        
        Object.entries(variables).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
    }

    // Get animation duration based on speed setting
    getAnimationDuration() {
        const speed = this.settings.animationSpeed;
        
        switch (speed) {
            case 'slow':
                return 500;
            case 'fast':
                return 150;
            case 'none':
                return 0;
            default:
                return 300;
        }
    }

    // Check if feature is enabled
    isFeatureEnabled(feature) {
        return this.settings[feature] === true;
    }

    // Get localized setting labels
    getSettingLabel(key, languageManager) {
        const labels = {
            en: {
                language: 'Language',
                theme: 'Theme',
                sound: 'Sound Effects',
                autoSave: 'Auto Save',
                showCheckoutSuggestions: 'Show Checkout Suggestions',
                animationSpeed: 'Animation Speed'
            },
            fa: {
                language: 'زبان',
                theme: 'تم',
                sound: 'جلوه‌های صوتی',
                autoSave: 'ذخیره خودکار',
                showCheckoutSuggestions: 'نمایش پیشنهادات پایان',
                animationSpeed: 'سرعت انیمیشن'
            }
        };
        
        const currentLang = languageManager.getCurrentLanguage();
        return labels[currentLang][key] || key;
    }
}
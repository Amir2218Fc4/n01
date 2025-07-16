export class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
    }

    async init() {
        // Load translations
        this.translations = {
            en: {
                // App Title
                title: 'Modern Darts',
                
                // Navigation
                language: 'English',
                settings: 'Settings',
                
                // Game Setup
                gameSetup: 'Game Setup',
                gameType: 'Game Type',
                players: 'Players',
                player1: 'Player 1',
                player2: 'Player 2',
                human: 'Human',
                computer: 'Computer',
                legs: 'Legs',
                startGame: 'Start Game',
                newGame: 'New Game',
                
                // Game Board
                currentPlayer: 'Current Player',
                dart1: 'Dart 1',
                dart2: 'Dart 2',
                dart3: 'Dart 3',
                total: 'Total',
                submitScore: 'Submit Score',
                undo: 'Undo',
                
                // Statistics
                tons: '100+',
                oneEighties: '180s',
                average: 'Average',
                darts: 'Darts',
                
                // Checkout
                checkoutSuggestions: 'Checkout Suggestions',
                
                // History
                gameHistory: 'Game History',
                
                // Settings Modal
                theme: 'Theme',
                light: 'Light',
                dark: 'Dark',
                soundEffects: 'Sound Effects',
                save: 'Save',
                close: 'Close',
                
                // Winner Modal
                winner: 'Winner!',
                congratulations: 'Congratulations!',
                playAgain: 'Play Again',
                
                // Messages
                bust: 'Bust!',
                invalidScore: 'Invalid Score',
                mustFinishOnDouble: 'Must finish on double!',
                cannotLeaveOne: 'Cannot leave score of 1!'
            },
            fa: {
                // App Title
                title: 'دارت مدرن',
                
                // Navigation
                language: 'فارسی',
                settings: 'تنظیمات',
                
                // Game Setup
                gameSetup: 'تنظیمات بازی',
                gameType: 'نوع بازی',
                players: 'بازیکنان',
                player1: 'بازیکن ۱',
                player2: 'بازیکن ۲',
                human: 'انسان',
                computer: 'کامپیوتر',
                legs: 'دست‌ها',
                startGame: 'شروع بازی',
                newGame: 'بازی جدید',
                
                // Game Board
                currentPlayer: 'بازیکن فعلی',
                dart1: 'پرتاب ۱',
                dart2: 'پرتاب ۲',
                dart3: 'پرتاب ۳',
                total: 'مجموع',
                submitScore: 'ثبت امتیاز',
                undo: 'برگشت',
                
                // Statistics
                tons: '۱۰۰+',
                oneEighties: '۱۸۰ها',
                average: 'میانگین',
                darts: 'پرتاب',
                
                // Checkout
                checkoutSuggestions: 'پیشنهادات پایان',
                
                // History
                gameHistory: 'تاریخچه بازی',
                
                // Settings Modal
                theme: 'تم',
                light: 'روشن',
                dark: 'تیره',
                soundEffects: 'جلوه‌های صوتی',
                save: 'ذخیره',
                close: 'بستن',
                
                // Winner Modal
                winner: 'برنده!',
                congratulations: 'تبریک!',
                playAgain: 'بازی مجدد',
                
                // Messages
                bust: 'خراب!',
                invalidScore: 'امتیاز نامعتبر',
                mustFinishOnDouble: 'باید با دابل تمام کنید!',
                cannotLeaveOne: 'نمی‌توانید امتیاز ۱ باقی بگذارید!'
            }
        };

        // Load saved language
        const savedLanguage = localStorage.getItem('dartsLanguage');
        if (savedLanguage && this.translations[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        }

        this.updatePageLanguage();
    }

    setLanguage(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            localStorage.setItem('dartsLanguage', language);
            this.updatePageLanguage();
        }
    }

    toggleLanguage() {
        const newLanguage = this.currentLanguage === 'en' ? 'fa' : 'en';
        this.setLanguage(newLanguage);
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    translate(key) {
        return this.translations[this.currentLanguage][key] || key;
    }

    updatePageLanguage() {
        // Update document direction and font
        document.documentElement.dir = this.currentLanguage === 'fa' ? 'rtl' : 'ltr';
        document.documentElement.lang = this.currentLanguage;

        // Update all elements with data-lang attribute
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            element.textContent = this.translate(key);
        });

        // Update placeholders
        document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
            const key = element.getAttribute('data-lang-placeholder');
            element.placeholder = this.translate(key);
        });

        // Update language toggle button
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            const langText = langToggle.querySelector('.lang-text');
            if (langText) {
                langText.textContent = this.translate('language');
            }
        }

        // Apply appropriate font family
        if (this.currentLanguage === 'fa') {
            document.body.style.fontFamily = 'var(--font-family-fa)';
        } else {
            document.body.style.fontFamily = 'var(--font-family-en)';
        }
    }

    // Format numbers for current language
    formatNumber(number) {
        if (this.currentLanguage === 'fa') {
            // Convert to Persian digits
            const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
            return number.toString().replace(/\d/g, digit => persianDigits[digit]);
        }
        return number.toString();
    }

    // Format text direction for mixed content
    formatMixedText(text) {
        if (this.currentLanguage === 'fa') {
            // Add RTL marks for proper text direction
            return '\u202B' + text + '\u202C';
        }
        return text;
    }
}
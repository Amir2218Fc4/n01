/*
 * n01
 *
 * language.c
 *
 * Copyright (C) 1996-2024 by Nakashima Tomoaki. All rights reserved.
 *		http://www.nakka.com/
 *		nakka@nakka.com
 */

/* Include Files */
#include <windows.h>
#include <tchar.h>

#include "Memory.h"
#include "String.h"
#include "Font.h"
#include "language.h"
#include "resource.h"

/* Define */

/* Global Variables */
static int current_language = LANG_ENGLISH;
static HFONT persian_font = NULL;
static HFONT english_font = NULL;

/* Language strings mapping */
static LANGUAGE_STRINGS lang_strings[LANG_MAX_STRINGS] = {
    // Basic UI
    {TEXT("Player 1"), TEXT("بازیکن ۱")},                    // 0
    {TEXT("Player 2"), TEXT("بازیکن ۲")},                    // 1
    {TEXT("Score"), TEXT("امتیاز")},                         // 2
    {TEXT("To Go"), TEXT("باقیمانده")},                      // 3
    {TEXT("Round"), TEXT("دور")},                           // 4
    {TEXT("Darts"), TEXT("پرتاب")},                         // 5
    {TEXT("Finish"), TEXT("پایان")},                        // 6
    {TEXT("Game"), TEXT("بازی")},                           // 7
    {TEXT("Set"), TEXT("ست")},                              // 8
    {TEXT("Leg"), TEXT("لگ")},                              // 9
    {TEXT("Average"), TEXT("میانگین")},                     // 10
    {TEXT("Total"), TEXT("کل")},                            // 11
    {TEXT("High Off"), TEXT("بالاترین پایان")},              // 12
    {TEXT("180s"), TEXT("۱۸۰ها")},                          // 13
    {TEXT("Tons"), TEXT("صدها")},                           // 14
    {TEXT("First 9"), TEXT("۹ اول")},                       // 15
    {TEXT("Check Out"), TEXT("پایان بازی")},                // 16
    {TEXT("Arrange"), TEXT("ترتیب")},                       // 17
    {TEXT("Options"), TEXT("تنظیمات")},                     // 18
    {TEXT("Language"), TEXT("زبان")},                       // 19
    {TEXT("English"), TEXT("انگلیسی")},                     // 20
    {TEXT("Persian"), TEXT("فارسی")},                       // 21
    {TEXT("Font"), TEXT("فونت")},                           // 22
    {TEXT("OK"), TEXT("تأیید")},                            // 23
    {TEXT("Cancel"), TEXT("لغو")},                          // 24
    {TEXT("Apply"), TEXT("اعمال")},                         // 25
    {TEXT("Close"), TEXT("بستن")},                          // 26
    {TEXT("Save"), TEXT("ذخیره")},                          // 27
    {TEXT("Load"), TEXT("بارگذاری")},                       // 28
    {TEXT("New Game"), TEXT("بازی جدید")},                  // 29
    {TEXT("Exit"), TEXT("خروج")},                           // 30
    {TEXT("Help"), TEXT("راهنما")},                         // 31
    {TEXT("About"), TEXT("درباره")},                        // 32
    {TEXT("View"), TEXT("نمایش")},                          // 33
    {TEXT("Tools"), TEXT("ابزارها")},                       // 34
    {TEXT("File"), TEXT("فایل")},                           // 35
    {TEXT("Edit"), TEXT("ویرایش")},                         // 36
    {TEXT("Game History"), TEXT("تاریخچه بازی")},           // 37
    {TEXT("Statistics"), TEXT("آمار")},                     // 38
    {TEXT("Computer"), TEXT("کامپیوتر")},                   // 39
    {TEXT("Level"), TEXT("سطح")},                           // 40
    {TEXT("Start Score"), TEXT("امتیاز شروع")},             // 41
    {TEXT("Round Limit"), TEXT("محدودیت دور")},             // 42
    {TEXT("Leg Limit"), TEXT("محدودیت لگ")},                // 43
    {TEXT("Best of"), TEXT("بهترین از")},                   // 44
    {TEXT("First Mark"), TEXT("اولین نشان")},               // 45
    {TEXT("Win"), TEXT("برد")},                             // 46
    {TEXT("Lose"), TEXT("باخت")},                           // 47
    {TEXT("Tie"), TEXT("مساوی")}                            // 48
};

/*
 * language_initialize - initialize language system
 */
void language_initialize(void)
{
    // Create fonts for both languages
    english_font = font_create(TEXT("Arial"), 12, FW_NORMAL, FALSE, FALSE);
    persian_font = font_create(TEXT("Vazir"), 12, FW_NORMAL, FALSE, FALSE);
    
    // If Vazir font is not available, use Tahoma as fallback
    if (persian_font == NULL) {
        persian_font = font_create(TEXT("Tahoma"), 12, FW_NORMAL, FALSE, FALSE);
    }
    
    // Set default language
    current_language = LANG_ENGLISH;
}

/*
 * language_free - free language resources
 */
void language_free(void)
{
    if (english_font != NULL) {
        DeleteObject(english_font);
        english_font = NULL;
    }
    if (persian_font != NULL) {
        DeleteObject(persian_font);
        persian_font = NULL;
    }
}

/*
 * language_get_string - get localized string by ID
 */
TCHAR *language_get_string(const UINT id)
{
    if (id >= LANG_MAX_STRINGS) {
        return TEXT(""); // Return empty string for invalid IDs
    }
    
    if (current_language == LANG_PERSIAN && lang_strings[id].persian != NULL) {
        return lang_strings[id].persian;
    }
    
    return lang_strings[id].english;
}

/*
 * language_get_current - get current language
 */
int language_get_current(void)
{
    return current_language;
}

/*
 * language_set_current - set current language
 */
void language_set_current(const int lang)
{
    if (lang == LANG_ENGLISH || lang == LANG_PERSIAN) {
        current_language = lang;
    }
}

/*
 * language_get_font - get appropriate font for current language
 */
HFONT language_get_font(void)
{
    if (current_language == LANG_PERSIAN && persian_font != NULL) {
        return persian_font;
    }
    return english_font;
}

/*
 * language_update_font - update fonts (call after font size changes)
 */
void language_update_font(void)
{
    if (english_font != NULL) {
        DeleteObject(english_font);
    }
    if (persian_font != NULL) {
        DeleteObject(persian_font);
    }
    
    english_font = font_create(TEXT("Arial"), 12, FW_NORMAL, FALSE, FALSE);
    persian_font = font_create(TEXT("Vazir"), 12, FW_NORMAL, FALSE, FALSE);
    
    // If Vazir font is not available, use Tahoma as fallback
    if (persian_font == NULL) {
        persian_font = font_create(TEXT("Tahoma"), 12, FW_NORMAL, FALSE, FALSE);
    }
}
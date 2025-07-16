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
static LANGUAGE_STRINGS lang_strings[] = {
    // Basic UI
    {TEXT("Player 1"), TEXT("بازیکن ۱")},
    {TEXT("Player 2"), TEXT("بازیکن ۲")},
    {TEXT("Score"), TEXT("امتیاز")},
    {TEXT("To Go"), TEXT("باقیمانده")},
    {TEXT("Round"), TEXT("دور")},
    {TEXT("Darts"), TEXT("پرتاب")},
    {TEXT("Finish"), TEXT("پایان")},
    {TEXT("Game"), TEXT("بازی")},
    {TEXT("Set"), TEXT("ست")},
    {TEXT("Leg"), TEXT("لگ")},
    {TEXT("Average"), TEXT("میانگین")},
    {TEXT("Total"), TEXT("کل")},
    {TEXT("High Off"), TEXT("بالاترین پایان")},
    {TEXT("180s"), TEXT("۱۸۰ها")},
    {TEXT("Tons"), TEXT("صدها")},
    {TEXT("First 9"), TEXT("۹ اول")},
    {TEXT("Check Out"), TEXT("پایان بازی")},
    {TEXT("Arrange"), TEXT("ترتیب")},
    {TEXT("Options"), TEXT("تنظیمات")},
    {TEXT("Language"), TEXT("زبان")},
    {TEXT("English"), TEXT("انگلیسی")},
    {TEXT("Persian"), TEXT("فارسی")},
    {TEXT("Font"), TEXT("فونت")},
    {TEXT("OK"), TEXT("تأیید")},
    {TEXT("Cancel"), TEXT("لغو")},
    {TEXT("Apply"), TEXT("اعمال")},
    {TEXT("Close"), TEXT("بستن")},
    {TEXT("Save"), TEXT("ذخیره")},
    {TEXT("Load"), TEXT("بارگذاری")},
    {TEXT("New Game"), TEXT("بازی جدید")},
    {TEXT("Exit"), TEXT("خروج")},
    {TEXT("Help"), TEXT("راهنما")},
    {TEXT("About"), TEXT("درباره")},
    {TEXT("View"), TEXT("نمایش")},
    {TEXT("Tools"), TEXT("ابزارها")},
    {TEXT("File"), TEXT("فایل")},
    {TEXT("Edit"), TEXT("ویرایش")},
    {TEXT("Game History"), TEXT("تاریخچه بازی")},
    {TEXT("Statistics"), TEXT("آمار")},
    {TEXT("Computer"), TEXT("کامپیوتر")},
    {TEXT("Level"), TEXT("سطح")},
    {TEXT("Start Score"), TEXT("امتیاز شروع")},
    {TEXT("Round Limit"), TEXT("محدودیت دور")},
    {TEXT("Leg Limit"), TEXT("محدودیت لگ")},
    {TEXT("Best of"), TEXT("بهترین از")},
    {TEXT("First Mark"), TEXT("اولین نشان")},
    {TEXT("Win"), TEXT("برد")},
    {TEXT("Lose"), TEXT("باخت")},
    {TEXT("Tie"), TEXT("مساوی")},
    {NULL, NULL} // End marker
};

/*
 * language_initialize - initialize language system
 */
void language_initialize(void)
{
    // Create fonts for both languages
    english_font = font_create(TEXT("Arial"), 12, FW_NORMAL, FALSE, FALSE);
    persian_font = font_create(TEXT("Vazir"), 12, FW_NORMAL, FALSE, FALSE);
    
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
    if (id >= sizeof(lang_strings) / sizeof(LANGUAGE_STRINGS) || 
        lang_strings[id].english == NULL) {
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
}
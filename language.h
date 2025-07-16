/*
 * n01
 *
 * language.h
 *
 * Copyright (C) 1996-2024 by Nakashima Tomoaki. All rights reserved.
 *		http://www.nakka.com/
 *		nakka@nakka.com
 */

#ifndef _INC_LANGUAGE_H
#define _INC_LANGUAGE_H

/* Include Files */

/* Define */
#define LANG_ENGLISH    0
#define LANG_PERSIAN    1

/* Language String IDs */
#define LANG_PLAYER1            0
#define LANG_PLAYER2            1
#define LANG_SCORE              2
#define LANG_TO_GO              3
#define LANG_ROUND              4
#define LANG_DARTS              5
#define LANG_FINISH             6
#define LANG_GAME               7
#define LANG_SET                8
#define LANG_LEG                9
#define LANG_AVERAGE            10
#define LANG_TOTAL              11
#define LANG_HIGH_OFF           12
#define LANG_180S               13
#define LANG_TONS               14
#define LANG_FIRST_9            15
#define LANG_CHECK_OUT          16
#define LANG_ARRANGE            17
#define LANG_OPTIONS            18
#define LANG_LANGUAGE           19
#define LANG_ENGLISH_NAME       20
#define LANG_PERSIAN_NAME       21
#define LANG_FONT               22
#define LANG_OK                 23
#define LANG_CANCEL             24
#define LANG_APPLY              25
#define LANG_CLOSE              26
#define LANG_SAVE               27
#define LANG_LOAD               28
#define LANG_NEW_GAME           29
#define LANG_EXIT               30
#define LANG_HELP               31
#define LANG_ABOUT              32
#define LANG_VIEW               33
#define LANG_TOOLS              34
#define LANG_FILE               35
#define LANG_EDIT               36
#define LANG_GAME_HISTORY       37
#define LANG_STATISTICS         38
#define LANG_COMPUTER           39
#define LANG_LEVEL              40
#define LANG_START_SCORE        41
#define LANG_ROUND_LIMIT        42
#define LANG_LEG_LIMIT          43
#define LANG_BEST_OF            44
#define LANG_FIRST_MARK         45
#define LANG_WIN                46
#define LANG_LOSE               47
#define LANG_TIE                48
#define LANG_MAX_STRINGS        49

/* Struct */
typedef struct _LANGUAGE_STRINGS {
    TCHAR *english;
    TCHAR *persian;
} LANGUAGE_STRINGS;

/* Function Prototypes */
void language_initialize(void);
void language_free(void);
TCHAR *language_get_string(const UINT id);
int language_get_current(void);
void language_set_current(const int lang);
HFONT language_get_font(void);
void language_update_font(void);

#endif
/* End of source */
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
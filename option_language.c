/*
 * n01
 *
 * option_language.c
 *
 * Copyright (C) 1996-2024 by Nakashima Tomoaki. All rights reserved.
 *		http://www.nakka.com/
 *		nakka@nakka.com
 */

/* Include Files */
#include <windows.h>
#include <commctrl.h>
#include <tchar.h>

#include "Memory.h"
#include "String.h"
#include "Message.h"
#include "language.h"
#include "option_language.h"
#include "resource.h"

/* Define */

/* Global Variables */
extern OPTION_INFO option;

/*
 * option_language_proc - language option dialog procedure
 */
BOOL CALLBACK option_language_proc(HWND hDlg, UINT msg, WPARAM wParam, LPARAM lParam)
{
    switch (msg) {
    case WM_INITDIALOG:
        // Set dialog title
        SetWindowText(hDlg, language_get_string(19)); // "Language"
        
        // Set radio button texts
        SetDlgItemText(hDlg, IDC_RADIO_ENGLISH, language_get_string(20)); // "English"
        SetDlgItemText(hDlg, IDC_RADIO_PERSIAN, language_get_string(21)); // "Persian"
        
        // Set current language selection
        if (language_get_current() == LANG_PERSIAN) {
            CheckRadioButton(hDlg, IDC_RADIO_ENGLISH, IDC_RADIO_PERSIAN, IDC_RADIO_PERSIAN);
        } else {
            CheckRadioButton(hDlg, IDC_RADIO_ENGLISH, IDC_RADIO_PERSIAN, IDC_RADIO_ENGLISH);
        }
        
        // Set font preview
        SetDlgItemText(hDlg, IDC_STATIC_FONT_PREVIEW, 
            (language_get_current() == LANG_PERSIAN) ? 
            TEXT("نمونه متن فارسی - Vazir Font") : 
            TEXT("Sample English Text - Arial Font"));
        
        // Apply appropriate font to preview
        SendDlgItemMessage(hDlg, IDC_STATIC_FONT_PREVIEW, WM_SETFONT, 
            (WPARAM)language_get_font(), TRUE);
        
        return TRUE;

    case WM_COMMAND:
        switch (LOWORD(wParam)) {
        case IDC_RADIO_ENGLISH:
            if (HIWORD(wParam) == BN_CLICKED) {
                language_set_current(LANG_ENGLISH);
                SetDlgItemText(hDlg, IDC_STATIC_FONT_PREVIEW, 
                    TEXT("Sample English Text - Arial Font"));
                SendDlgItemMessage(hDlg, IDC_STATIC_FONT_PREVIEW, WM_SETFONT, 
                    (WPARAM)language_get_font(), TRUE);
            }
            break;
            
        case IDC_RADIO_PERSIAN:
            if (HIWORD(wParam) == BN_CLICKED) {
                language_set_current(LANG_PERSIAN);
                SetDlgItemText(hDlg, IDC_STATIC_FONT_PREVIEW, 
                    TEXT("نمونه متن فارسی - Vazir Font"));
                SendDlgItemMessage(hDlg, IDC_STATIC_FONT_PREVIEW, WM_SETFONT, 
                    (WPARAM)language_get_font(), TRUE);
            }
            break;
        }
        break;

    case WM_NOTIFY:
        return FALSE;
    }
    return FALSE;
}
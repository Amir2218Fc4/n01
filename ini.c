	return TRUE;
}

/*
 * ini_get_language - get language settings from ini file
 */
BOOL ini_get_language(const TCHAR *ini_path)
{
	int lang;
	
	lang = profile_get_int(TEXT("Language"), TEXT("Current"), LANG_ENGLISH, ini_path);
	language_set_current(lang);
	
	return TRUE;
}

/*
 * ini_put_language - save language settings to ini file
 */
BOOL ini_put_language(const TCHAR *ini_path)
{
	profile_write_int(TEXT("Language"), TEXT("Current"), language_get_current(), ini_path);
	return TRUE;
}
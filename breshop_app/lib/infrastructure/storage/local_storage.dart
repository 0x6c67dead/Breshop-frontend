import 'package:shared_preferences/shared_preferences.dart';

class LocalStorage {
  static const String _themeKey = 'breshop_theme';
  static const String _localeKey = 'breshop_locale';
  static const String _favoritesKey = 'breshop_favorites';

  late SharedPreferences _prefs;

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // Theme
  bool isDarkMode() => _prefs.getBool(_themeKey) ?? false;
  Future<void> setDarkMode(bool value) async {
    await _prefs.setBool(_themeKey, value);
  }

  // Locale
  String getLocale() => _prefs.getString(_localeKey) ?? 'pt_BR';
  Future<void> setLocale(String locale) async {
    await _prefs.setString(_localeKey, locale);
  }

  // Favorites (lista de IDs)
  List<String> getFavorites() =>
      _prefs.getStringList(_favoritesKey) ?? [];
  Future<void> setFavorites(List<String> favorites) async {
    await _prefs.setStringList(_favoritesKey, favorites);
  }
}

// Настройки сайта
window.SITE_CONFIG = {
  minecraftName: '_Nerix',      // ник в Minecraft (скин берётся по нему)
  storageKey: 'nerix:lang',     // ключ в localStorage для выбранного языка
  // Источники скина пробуются по очереди. {name} подставляется автоматически.
  // Сюда же можно вставить прямую ссылку на текстуру с NameMC (https://s.namemc.com/i/....png)
  skinSources: [
    'https://minotar.net/skin/{name}',
    'https://mc-heads.net/skin/{name}',
    'assets/skin.png'           // запасной вариант: положи свой скин сюда
  ]
};

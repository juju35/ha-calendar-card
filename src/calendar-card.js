var CALENDAR_CARD_VERSION = '__VERSION__';

// ── i18n ──────────────────────────────────────────────────────────────────────
var CcI18n = {
  fr: {
    agenda: 'Agenda',
    today: 'Aujourd\'hui',
    tomorrow: 'Demain',
    all_day: 'Toute la journée',
    now: 'En cours',
    in_min: 'dans {n} min',
    in_h: 'dans {h} h {m}',
    in_hours: 'dans {h} h',
    no_events: 'Aucun événement',
    no_upcoming: 'Aucun événement à venir',
    events_today: '{n} événements aujourd\'hui',
    event_today: '{n} événement aujourd\'hui',
    none_today: 'Rien aujourd\'hui',
    next: 'Ensuite',
    until: 'jusqu\'au {d}',
    more: '{n} événements de plus',
    more_one: '{n} événement de plus',
    less: 'Réduire',
    close: 'Fermer',
    load_failed: 'Calendrier non chargé : {list}',
    no_calendar: 'Aucun calendrier trouvé',
    zoom_in: 'Afficher la carte complète',
    zoom_out: 'Revenir à la vue compacte',
    ed_entities: 'Calendriers',
    ed_entities_helper: 'Couleurs et libellés par calendrier : en YAML (voir le README)',
    ed_title: 'Titre',
    ed_title_helper: 'Laisser vide pour « Agenda »',
    ed_days_to_show: 'Jours affichés',
    ed_max_events: 'Événements avant « de plus »',
    ed_max_events_helper: '0 pour tout afficher',
    ed_show_header: 'En-tête',
    ed_show_location: 'Lieu',
    ed_show_end_time: 'Heure de fin',
    ed_show_countdown: 'Compte à rebours',
    ed_show_empty_days: 'Jours sans événement',
    ed_show_past_events: 'Événements terminés du jour',
    ed_zoom: 'Bouton détail',
    ed_zoom_helper: 'Bouton en haut à droite qui passe la mini-carte en carte complète et inversement',
    ed_language: 'Langue',
    ed_language_helper: 'Laisser vide pour suivre la langue de Home Assistant',
  },
  en: {
    agenda: 'Agenda',
    today: 'Today',
    tomorrow: 'Tomorrow',
    all_day: 'All day',
    now: 'Now',
    in_min: 'in {n} min',
    in_h: 'in {h} h {m}',
    in_hours: 'in {h} h',
    no_events: 'No events',
    no_upcoming: 'No upcoming events',
    events_today: '{n} events today',
    event_today: '{n} event today',
    none_today: 'Nothing today',
    next: 'Next',
    until: 'until {d}',
    more: '{n} more events',
    more_one: '{n} more event',
    less: 'Show less',
    close: 'Close',
    load_failed: 'Calendar not loaded: {list}',
    no_calendar: 'No calendar found',
    zoom_in: 'Show the full card',
    zoom_out: 'Back to the compact view',
    ed_entities: 'Calendars',
    ed_entities_helper: 'Colors and labels per calendar: in YAML (see the README)',
    ed_title: 'Title',
    ed_title_helper: 'Leave empty for "Agenda"',
    ed_days_to_show: 'Days shown',
    ed_max_events: 'Events before "more"',
    ed_max_events_helper: '0 to show everything',
    ed_show_header: 'Header',
    ed_show_location: 'Location',
    ed_show_end_time: 'End time',
    ed_show_countdown: 'Countdown',
    ed_show_empty_days: 'Days without events',
    ed_show_past_events: 'Today\'s finished events',
    ed_zoom: 'Detail button',
    ed_zoom_helper: 'Button at the top right that switches the mini card to the full card and back',
    ed_language: 'Language',
    ed_language_helper: 'Leave empty to follow the Home Assistant language',
  },
  de: {
    agenda: 'Termine',
    today: 'Heute',
    tomorrow: 'Morgen',
    all_day: 'Ganztägig',
    now: 'Jetzt',
    in_min: 'in {n} Min.',
    in_h: 'in {h} Std. {m} Min.',
    in_hours: 'in {h} Std.',
    no_events: 'Keine Termine',
    no_upcoming: 'Keine anstehenden Termine',
    events_today: '{n} Termine heute',
    event_today: '{n} Termin heute',
    none_today: 'Heute nichts',
    next: 'Danach',
    until: 'bis {d}',
    more: '{n} weitere Termine',
    more_one: '{n} weiterer Termin',
    less: 'Weniger anzeigen',
    close: 'Schließen',
    load_failed: 'Kalender nicht geladen: {list}',
    no_calendar: 'Kein Kalender gefunden',
    zoom_in: 'Vollständige Karte anzeigen',
    zoom_out: 'Zurück zur kompakten Ansicht',
    ed_entities: 'Kalender',
    ed_entities_helper: 'Farben und Namen pro Kalender: in YAML (siehe README)',
    ed_title: 'Titel',
    ed_title_helper: 'Leer lassen für „Termine“',
    ed_days_to_show: 'Angezeigte Tage',
    ed_max_events: 'Termine vor „weitere“',
    ed_max_events_helper: '0, um alles anzuzeigen',
    ed_show_header: 'Kopfzeile',
    ed_show_location: 'Ort',
    ed_show_end_time: 'Endzeit',
    ed_show_countdown: 'Countdown',
    ed_show_empty_days: 'Tage ohne Termine',
    ed_show_past_events: 'Heute beendete Termine',
    ed_zoom: 'Detail-Schaltfläche',
    ed_zoom_helper: 'Schaltfläche oben rechts, die die Mini-Karte zur vollständigen Karte aufklappt und zurück',
    ed_language: 'Sprache',
    ed_language_helper: 'Leer lassen, um der Sprache von Home Assistant zu folgen',
  },
  es: {
    agenda: 'Agenda',
    today: 'Hoy',
    tomorrow: 'Mañana',
    all_day: 'Todo el día',
    now: 'En curso',
    in_min: 'en {n} min',
    in_h: 'en {h} h {m} min',
    in_hours: 'en {h} h',
    no_events: 'Sin eventos',
    no_upcoming: 'No hay próximos eventos',
    events_today: '{n} eventos hoy',
    event_today: '{n} evento hoy',
    none_today: 'Nada hoy',
    next: 'Después',
    until: 'hasta el {d}',
    more: '{n} eventos más',
    more_one: '{n} evento más',
    less: 'Mostrar menos',
    close: 'Cerrar',
    load_failed: 'Calendario no cargado: {list}',
    no_calendar: 'No se ha encontrado ningún calendario',
    zoom_in: 'Mostrar la tarjeta completa',
    zoom_out: 'Volver a la vista compacta',
    ed_entities: 'Calendarios',
    ed_entities_helper: 'Colores y nombres por calendario: en YAML (consulta el README)',
    ed_title: 'Título',
    ed_title_helper: 'Déjalo vacío para «Agenda»',
    ed_days_to_show: 'Días mostrados',
    ed_max_events: 'Eventos antes de «más»',
    ed_max_events_helper: '0 para mostrarlo todo',
    ed_show_header: 'Encabezado',
    ed_show_location: 'Ubicación',
    ed_show_end_time: 'Hora de fin',
    ed_show_countdown: 'Cuenta atrás',
    ed_show_empty_days: 'Días sin eventos',
    ed_show_past_events: 'Eventos de hoy ya terminados',
    ed_zoom: 'Botón de detalle',
    ed_zoom_helper: 'Botón arriba a la derecha que despliega la minitarjeta en tarjeta completa y viceversa',
    ed_language: 'Idioma',
    ed_language_helper: 'Déjalo vacío para usar el idioma de Home Assistant',
  },
  sr: {
    agenda: 'Агенда',
    today: 'Данас',
    tomorrow: 'Сутра',
    all_day: 'Цео дан',
    now: 'У току',
    in_min: 'за {n} мин',
    in_h: 'за {h} ч {m}',
    in_hours: 'за {h} ч',
    no_events: 'Нема догађаја',
    no_upcoming: 'Нема предстојећих догађаја',
    events_today: '{n} догађаја данас',
    event_today: '{n} догађај данас',
    none_today: 'Ништа данас',
    next: 'Следеће',
    until: 'до {d}',
    more: 'још {n} догађаја',
    more_one: 'још {n} догађај',
    less: 'Мање',
    close: 'Затвори',
    load_failed: 'Календар није учитан: {list}',
    no_calendar: 'Није пронађен ниједан календар',
    zoom_in: 'Прикажи пуну картицу',
    zoom_out: 'Назад на компактан приказ',
    ed_entities: 'Календари',
    ed_entities_helper: 'Боје и ознаке по календару: у YAML-у (погледајте README)',
    ed_title: 'Наслов',
    ed_title_helper: 'Оставите празно за „Агенда“',
    ed_days_to_show: 'Број приказаних дана',
    ed_max_events: 'Догађаји пре „још“',
    ed_max_events_helper: '0 за приказ свих догађаја',
    ed_show_header: 'Заглавље',
    ed_show_location: 'Локација',
    ed_show_end_time: 'Време завршетка',
    ed_show_countdown: 'Одбројавање',
    ed_show_empty_days: 'Дани без догађаја',
    ed_show_past_events: 'Завршени догађаји за данас',
    ed_zoom: 'Дугме за детаље',
    ed_zoom_helper: 'Дугме у горњем десном углу које пребацује мини картицу на пуну картицу и назад',
    ed_language: 'Језик',
    ed_language_helper: 'Оставите празно да прати језик Home Assistant-а',
  },
  'sr-Latn': {
    agenda: 'Agenda',
    today: 'Danas',
    tomorrow: 'Sutra',
    all_day: 'Ceo dan',
    now: 'U toku',
    in_min: 'za {n} min',
    in_h: 'za {h} h {m}',
    in_hours: 'za {h} h',
    no_events: 'Nema događaja',
    no_upcoming: 'Nema predstojećih događaja',
    events_today: '{n} događaja danas',
    event_today: '{n} događaj danas',
    none_today: 'Ništa danas',
    next: 'Sledeće',
    until: 'do {d}',
    more: 'još {n} događaja',
    more_one: 'još {n} događaj',
    less: 'Manje',
    close: 'Zatvori',
    load_failed: 'Kalendar nije učitan: {list}',
    no_calendar: 'Nije pronađen nijedan kalendar',
    zoom_in: 'Prikaži punu karticu',
    zoom_out: 'Nazad na kompaktan prikaz',
    ed_entities: 'Kalendari',
    ed_entities_helper: 'Boje i oznake po kalendaru: u YAML-u (pogledajte README)',
    ed_title: 'Naslov',
    ed_title_helper: 'Ostavite prazno za „Agenda“',
    ed_days_to_show: 'Broj prikazanih dana',
    ed_max_events: 'Događaji pre „još“',
    ed_max_events_helper: '0 za prikaz svih događaja',
    ed_show_header: 'Zaglavlje',
    ed_show_location: 'Lokacija',
    ed_show_end_time: 'Vreme završetka',
    ed_show_countdown: 'Odbrojavanje',
    ed_show_empty_days: 'Dani bez događaja',
    ed_show_past_events: 'Završeni događaji za danas',
    ed_zoom: 'Dugme za detalje',
    ed_zoom_helper: 'Dugme u gornjem desnom uglu koje prebacuje mini karticu na punu karticu i nazad',
    ed_language: 'Jezik',
    ed_language_helper: 'Ostavite prazno da prati jezik Home Assistant-a',
  },
  it: {
    agenda: 'Agenda',
    today: 'Oggi',
    tomorrow: 'Domani',
    all_day: 'Tutto il giorno',
    now: 'In corso',
    in_min: 'tra {n} min',
    in_h: 'tra {h} h {m} min',
    in_hours: 'tra {h} h',
    no_events: 'Nessun evento',
    no_upcoming: 'Nessun evento in programma',
    events_today: '{n} eventi oggi',
    event_today: '{n} evento oggi',
    none_today: 'Niente oggi',
    next: 'Dopo',
    until: 'fino a {d}',
    more: 'Altri {n} eventi',
    more_one: 'Ancora {n} evento',
    less: 'Mostra meno',
    close: 'Chiudi',
    load_failed: 'Calendario non caricato: {list}',
    no_calendar: 'Nessun calendario trovato',
    zoom_in: 'Mostra la scheda completa',
    zoom_out: 'Torna alla vista compatta',
    ed_entities: 'Calendari',
    ed_entities_helper: 'Colori ed etichette per calendario: in YAML (vedi il README)',
    ed_title: 'Titolo',
    ed_title_helper: 'Lascia vuoto per «Agenda»',
    ed_days_to_show: 'Giorni mostrati',
    ed_max_events: 'Eventi prima di «altri»',
    ed_max_events_helper: '0 per mostrare tutto',
    ed_show_header: 'Intestazione',
    ed_show_location: 'Luogo',
    ed_show_end_time: 'Ora di fine',
    ed_show_countdown: 'Conto alla rovescia',
    ed_show_empty_days: 'Giorni senza eventi',
    ed_show_past_events: 'Eventi di oggi già terminati',
    ed_zoom: 'Pulsante dettagli',
    ed_zoom_helper: 'Pulsante in alto a destra che passa dalla mini scheda alla scheda completa e viceversa',
    ed_language: 'Lingua',
    ed_language_helper: 'Lascia vuoto per seguire la lingua di Home Assistant',
  },
  nl: {
    agenda: 'Agenda',
    today: 'Vandaag',
    tomorrow: 'Morgen',
    all_day: 'Hele dag',
    now: 'Nu bezig',
    in_min: 'over {n} min',
    in_h: 'over {h} u {m} min',
    in_hours: 'over {h} u',
    no_events: 'Geen afspraken',
    no_upcoming: 'Geen komende afspraken',
    events_today: '{n} afspraken vandaag',
    event_today: '{n} afspraak vandaag',
    none_today: 'Niets vandaag',
    next: 'Daarna',
    until: 'tot {d}',
    more: 'Nog {n} afspraken',
    more_one: 'Nog {n} afspraak',
    less: 'Minder tonen',
    close: 'Sluiten',
    load_failed: 'Agenda niet geladen: {list}',
    no_calendar: 'Geen agenda gevonden',
    zoom_in: 'Volledige kaart tonen',
    zoom_out: 'Terug naar de compacte weergave',
    ed_entities: 'Agenda\'s',
    ed_entities_helper: 'Kleuren en labels per agenda: in YAML (zie de README)',
    ed_title: 'Titel',
    ed_title_helper: 'Leeg laten voor ‘Agenda’',
    ed_days_to_show: 'Getoonde dagen',
    ed_max_events: 'Afspraken vóór ‘nog’',
    ed_max_events_helper: '0 om alles te tonen',
    ed_show_header: 'Koptekst',
    ed_show_location: 'Locatie',
    ed_show_end_time: 'Eindtijd',
    ed_show_countdown: 'Aftellen',
    ed_show_empty_days: 'Dagen zonder afspraken',
    ed_show_past_events: 'Afgelopen afspraken van vandaag',
    ed_zoom: 'Detailknop',
    ed_zoom_helper: 'Knop rechtsboven die de minikaart uitklapt tot de volledige kaart en terug',
    ed_language: 'Taal',
    ed_language_helper: 'Leeg laten om de taal van Home Assistant te volgen',
  },
  pt: {
    agenda: 'Agenda',
    today: 'Hoje',
    tomorrow: 'Amanhã',
    all_day: 'Todo o dia',
    now: 'A decorrer',
    in_min: 'daqui a {n} min',
    in_h: 'daqui a {h} h {m}',
    in_hours: 'daqui a {h} h',
    no_events: 'Sem eventos',
    no_upcoming: 'Sem eventos próximos',
    events_today: '{n} eventos hoje',
    event_today: '{n} evento hoje',
    none_today: 'Nada hoje',
    next: 'A seguir',
    until: 'até {d}',
    more: 'Mais {n} eventos',
    more_one: 'Mais {n} evento',
    less: 'Mostrar menos',
    close: 'Fechar',
    load_failed: 'Calendário não carregado: {list}',
    no_calendar: 'Nenhum calendário encontrado',
    zoom_in: 'Mostrar o cartão completo',
    zoom_out: 'Voltar à vista compacta',
    ed_entities: 'Calendários',
    ed_entities_helper: 'Cores e etiquetas por calendário: em YAML (ver o README)',
    ed_title: 'Título',
    ed_title_helper: 'Deixar vazio para «Agenda»',
    ed_days_to_show: 'Dias mostrados',
    ed_max_events: 'Eventos antes de «mais»',
    ed_max_events_helper: '0 para mostrar tudo',
    ed_show_header: 'Cabeçalho',
    ed_show_location: 'Local',
    ed_show_end_time: 'Hora de fim',
    ed_show_countdown: 'Contagem decrescente',
    ed_show_empty_days: 'Dias sem eventos',
    ed_show_past_events: 'Eventos de hoje já terminados',
    ed_zoom: 'Botão de detalhe',
    ed_zoom_helper: 'Botão no canto superior direito que alterna entre o mini cartão e o cartão completo',
    ed_language: 'Idioma',
    ed_language_helper: 'Deixar vazio para seguir o idioma do Home Assistant',
  },
  pl: {
    agenda: 'Terminarz',
    today: 'Dzisiaj',
    tomorrow: 'Jutro',
    all_day: 'Cały dzień',
    now: 'Trwa',
    in_min: 'za {n} min',
    in_h: 'za {h} godz. {m}',
    in_hours: 'za {h} godz.',
    no_events: 'Brak wydarzeń',
    no_upcoming: 'Brak nadchodzących wydarzeń',
    events_today: 'Wydarzenia dzisiaj: {n}',
    event_today: '{n} wydarzenie dzisiaj',
    none_today: 'Nic dzisiaj',
    next: 'Następnie',
    until: 'do {d}',
    more: 'Więcej wydarzeń: {n}',
    more_one: 'Jeszcze {n} wydarzenie',
    less: 'Pokaż mniej',
    close: 'Zamknij',
    load_failed: 'Nie załadowano kalendarza: {list}',
    no_calendar: 'Nie znaleziono kalendarza',
    zoom_in: 'Pokaż pełną kartę',
    zoom_out: 'Wróć do widoku kompaktowego',
    ed_entities: 'Kalendarze',
    ed_entities_helper: 'Kolory i etykiety dla każdego kalendarza: w YAML (zobacz README)',
    ed_title: 'Tytuł',
    ed_title_helper: 'Pozostaw puste dla „Terminarz”',
    ed_days_to_show: 'Wyświetlane dni',
    ed_max_events: 'Wydarzenia przed „Więcej”',
    ed_max_events_helper: '0, aby pokazać wszystko',
    ed_show_header: 'Nagłówek',
    ed_show_location: 'Lokalizacja',
    ed_show_end_time: 'Godzina zakończenia',
    ed_show_countdown: 'Odliczanie',
    ed_show_empty_days: 'Dni bez wydarzeń',
    ed_show_past_events: 'Dzisiejsze zakończone wydarzenia',
    ed_zoom: 'Przycisk szczegółów',
    ed_zoom_helper: 'Przycisk w prawym górnym rogu, który przełącza mini kartę na pełną kartę i z powrotem',
    ed_language: 'Język',
    ed_language_helper: 'Pozostaw puste, aby używać języka Home Assistant',
  },
  ro: {
    agenda: 'Agendă',
    today: 'Astăzi',
    tomorrow: 'Mâine',
    all_day: 'Toată ziua',
    now: 'În desfășurare',
    in_min: 'în {n} min',
    in_h: 'în {h} h {m}',
    in_hours: 'în {h} h',
    no_events: 'Niciun eveniment',
    no_upcoming: 'Niciun eveniment viitor',
    events_today: 'Evenimente azi: {n}',
    event_today: '{n} eveniment azi',
    none_today: 'Nimic azi',
    next: 'Urmează',
    until: 'până pe {d}',
    more: 'Mai multe evenimente: {n}',
    more_one: 'Încă {n} eveniment',
    less: 'Afișează mai puțin',
    close: 'Închide',
    load_failed: 'Calendar neîncărcat: {list}',
    no_calendar: 'Niciun calendar găsit',
    zoom_in: 'Afișează cardul complet',
    zoom_out: 'Înapoi la vizualizarea compactă',
    ed_entities: 'Calendare',
    ed_entities_helper: 'Culori și etichete pentru fiecare calendar: în YAML (vezi README)',
    ed_title: 'Titlu',
    ed_title_helper: 'Lăsați gol pentru „Agendă”',
    ed_days_to_show: 'Zile afișate',
    ed_max_events: 'Evenimente înainte de „Mai multe”',
    ed_max_events_helper: '0 pentru a afișa tot',
    ed_show_header: 'Antet',
    ed_show_location: 'Locație',
    ed_show_end_time: 'Ora de sfârșit',
    ed_show_countdown: 'Numărătoare inversă',
    ed_show_empty_days: 'Zile fără evenimente',
    ed_show_past_events: 'Evenimentele de azi încheiate',
    ed_zoom: 'Buton de detalii',
    ed_zoom_helper: 'Buton din dreapta sus care extinde mini cardul în cardul complet și înapoi',
    ed_language: 'Limbă',
    ed_language_helper: 'Lăsați gol pentru a urma limba Home Assistant',
  },
  da: {
    agenda: 'Aftaler',
    today: 'I dag',
    tomorrow: 'I morgen',
    all_day: 'Hele dagen',
    now: 'I gang',
    in_min: 'om {n} min.',
    in_h: 'om {h} t. {m} min.',
    in_hours: 'om {h} t.',
    no_events: 'Ingen aftaler',
    no_upcoming: 'Ingen kommende aftaler',
    events_today: '{n} aftaler i dag',
    event_today: '{n} aftale i dag',
    none_today: 'Intet i dag',
    next: 'Derefter',
    until: 'til {d}',
    more: '{n} aftaler mere',
    more_one: '{n} aftale mere',
    less: 'Vis mindre',
    close: 'Luk',
    load_failed: 'Kalender ikke indlæst: {list}',
    no_calendar: 'Ingen kalender fundet',
    zoom_in: 'Vis hele kortet',
    zoom_out: 'Tilbage til kompakt visning',
    ed_entities: 'Kalendere',
    ed_entities_helper: 'Farver og navne pr. kalender: i YAML (se README)',
    ed_title: 'Titel',
    ed_title_helper: 'Lad stå tomt for »Aftaler«',
    ed_days_to_show: 'Viste dage',
    ed_max_events: 'Aftaler før »mere«',
    ed_max_events_helper: '0 for at vise alt',
    ed_show_header: 'Overskrift',
    ed_show_location: 'Sted',
    ed_show_end_time: 'Sluttidspunkt',
    ed_show_countdown: 'Nedtælling',
    ed_show_empty_days: 'Dage uden aftaler',
    ed_show_past_events: 'Dagens afsluttede aftaler',
    ed_zoom: 'Detaljeknap',
    ed_zoom_helper: 'Knap øverst til højre, der folder minikortet ud til hele kortet og tilbage',
    ed_language: 'Sprog',
    ed_language_helper: 'Lad stå tomt for at følge sproget i Home Assistant',
  },
  sv: {
    agenda: 'Schema',
    today: 'I dag',
    tomorrow: 'I morgon',
    all_day: 'Heldag',
    now: 'Pågår',
    in_min: 'om {n} min',
    in_h: 'om {h} tim {m} min',
    in_hours: 'om {h} tim',
    no_events: 'Inga händelser',
    no_upcoming: 'Inga kommande händelser',
    events_today: '{n} händelser i dag',
    event_today: '{n} händelse i dag',
    none_today: 'Inget i dag',
    next: 'Därefter',
    until: 'till {d}',
    more: '{n} händelser till',
    more_one: '{n} händelse till',
    less: 'Visa mindre',
    close: 'Stäng',
    load_failed: 'Kalendern kunde inte läsas in: {list}',
    no_calendar: 'Ingen kalender hittades',
    zoom_in: 'Visa hela kortet',
    zoom_out: 'Tillbaka till kompakt vy',
    ed_entities: 'Kalendrar',
    ed_entities_helper: 'Färger och namn per kalender: i YAML (se README)',
    ed_title: 'Titel',
    ed_title_helper: 'Lämna tomt för ”Schema”',
    ed_days_to_show: 'Visade dagar',
    ed_max_events: 'Händelser innan listan fälls ihop',
    ed_max_events_helper: '0 för att visa allt',
    ed_show_header: 'Rubrik',
    ed_show_location: 'Plats',
    ed_show_end_time: 'Sluttid',
    ed_show_countdown: 'Nedräkning',
    ed_show_empty_days: 'Dagar utan händelser',
    ed_show_past_events: 'Dagens avslutade händelser',
    ed_zoom: 'Detaljknapp',
    ed_zoom_helper: 'Knapp uppe till höger som fäller ut minikortet till hela kortet och tillbaka',
    ed_language: 'Språk',
    ed_language_helper: 'Lämna tomt för att följa språket i Home Assistant',
  },
  bg: {
    agenda: 'График',
    today: 'Днес',
    tomorrow: 'Утре',
    all_day: 'Цял ден',
    now: 'В момента',
    in_min: 'след {n} мин',
    in_h: 'след {h} ч {m} мин',
    in_hours: 'след {h} ч',
    no_events: 'Няма събития',
    no_upcoming: 'Няма предстоящи събития',
    events_today: '{n} събития днес',
    event_today: '{n} събитие днес',
    none_today: 'Нищо днес',
    next: 'След това',
    until: 'до {d}',
    more: 'Още {n} събития',
    more_one: 'Още {n} събитие',
    less: 'Покажи по-малко',
    close: 'Затвори',
    load_failed: 'Календарът не е зареден: {list}',
    no_calendar: 'Не е намерен календар',
    zoom_in: 'Покажи цялата карта',
    zoom_out: 'Обратно към компактния изглед',
    ed_entities: 'Календари',
    ed_entities_helper: 'Цветове и етикети за всеки календар: в YAML (вижте README)',
    ed_title: 'Заглавие',
    ed_title_helper: 'Оставете празно за „График“',
    ed_days_to_show: 'Показани дни',
    ed_max_events: 'Събития преди „Още“',
    ed_max_events_helper: '0, за да се покаже всичко',
    ed_show_header: 'Заглавна част',
    ed_show_location: 'Местоположение',
    ed_show_end_time: 'Час на приключване',
    ed_show_countdown: 'Обратно отброяване',
    ed_show_empty_days: 'Дни без събития',
    ed_show_past_events: 'Приключилите днес събития',
    ed_zoom: 'Бутон за подробности',
    ed_zoom_helper: 'Бутон горе вдясно, който разгъва мини картата до цялата карта и обратно',
    ed_language: 'Език',
    ed_language_helper: 'Оставете празно, за да се използва езикът на Home Assistant',
  },
  ru: {
    agenda: 'Расписание',
    today: 'Сегодня',
    tomorrow: 'Завтра',
    all_day: 'Весь день',
    now: 'Сейчас',
    in_min: 'через {n} мин',
    in_h: 'через {h} ч {m} мин',
    in_hours: 'через {h} ч',
    no_events: 'Нет событий',
    no_upcoming: 'Нет предстоящих событий',
    events_today: 'Событий сегодня: {n}',
    event_today: '{n} событие сегодня',
    none_today: 'Сегодня ничего',
    next: 'Далее',
    until: 'до {d}',
    more: 'Ещё событий: {n}',
    more_one: 'Ещё {n} событие',
    less: 'Свернуть',
    close: 'Закрыть',
    load_failed: 'Календарь не загружен: {list}',
    no_calendar: 'Календари не найдены',
    zoom_in: 'Показать полную карточку',
    zoom_out: 'Вернуться к компактному виду',
    ed_entities: 'Календари',
    ed_entities_helper: 'Цвета и подписи для каждого календаря: в YAML (см. README)',
    ed_title: 'Заголовок',
    ed_title_helper: 'Оставьте пустым для «Расписание»',
    ed_days_to_show: 'Количество дней',
    ed_max_events: 'Событий до «Ещё»',
    ed_max_events_helper: '0 — показать все',
    ed_show_header: 'Шапка',
    ed_show_location: 'Место',
    ed_show_end_time: 'Время окончания',
    ed_show_countdown: 'Обратный отсчёт',
    ed_show_empty_days: 'Дни без событий',
    ed_show_past_events: 'Завершённые сегодня события',
    ed_zoom: 'Кнопка подробностей',
    ed_zoom_helper: 'Кнопка в правом верхнем углу, которая разворачивает мини-карточку в полную и обратно',
    ed_language: 'Язык',
    ed_language_helper: 'Оставьте пустым, чтобы использовать язык Home Assistant',
  },
  uk: {
    agenda: 'Розклад',
    today: 'Сьогодні',
    tomorrow: 'Завтра',
    all_day: 'Увесь день',
    now: 'Зараз',
    in_min: 'через {n} хв',
    in_h: 'через {h} год {m} хв',
    in_hours: 'через {h} год',
    no_events: 'Немає подій',
    no_upcoming: 'Немає майбутніх подій',
    events_today: 'Подій сьогодні: {n}',
    event_today: '{n} подія сьогодні',
    none_today: 'Сьогодні нічого',
    next: 'Далі',
    until: 'до {d}',
    more: 'Ще подій: {n}',
    more_one: 'Ще {n} подія',
    less: 'Згорнути',
    close: 'Закрити',
    load_failed: 'Календар не завантажено: {list}',
    no_calendar: 'Календарів не знайдено',
    zoom_in: 'Показати повну картку',
    zoom_out: 'Повернутися до компактного вигляду',
    ed_entities: 'Календарі',
    ed_entities_helper: 'Кольори та підписи для кожного календаря: у YAML (див. README)',
    ed_title: 'Заголовок',
    ed_title_helper: 'Залиште порожнім для «Розклад»',
    ed_days_to_show: 'Кількість днів',
    ed_max_events: 'Подій до «Ще»',
    ed_max_events_helper: '0 — показати все',
    ed_show_header: 'Шапка',
    ed_show_location: 'Місце',
    ed_show_end_time: 'Час завершення',
    ed_show_countdown: 'Зворотний відлік',
    ed_show_empty_days: 'Дні без подій',
    ed_show_past_events: 'Завершені сьогодні події',
    ed_zoom: 'Кнопка деталей',
    ed_zoom_helper: 'Кнопка у правому верхньому куті, яка розгортає міні-картку до повної і назад',
    ed_language: 'Мова',
    ed_language_helper: 'Залиште порожнім, щоб використовувати мову Home Assistant',
  },
  hu: {
    agenda: 'Napirend',
    today: 'Ma',
    tomorrow: 'Holnap',
    all_day: 'Egész nap',
    now: 'Folyamatban',
    in_min: '{n} perc múlva',
    in_h: '{h} óra {m} perc múlva',
    in_hours: '{h} óra múlva',
    no_events: 'Nincs esemény',
    no_upcoming: 'Nincs közelgő esemény',
    events_today: '{n} esemény ma',
    event_today: '{n} esemény ma',
    none_today: 'Ma nincs semmi',
    next: 'Utána',
    until: 'eddig: {d}',
    more: 'További {n} esemény',
    more_one: 'További {n} esemény',
    less: 'Kevesebb',
    close: 'Bezárás',
    load_failed: 'Nem sikerült betölteni a naptárat: {list}',
    no_calendar: 'Nem található naptár',
    zoom_in: 'A teljes kártya megjelenítése',
    zoom_out: 'Vissza a kompakt nézethez',
    ed_entities: 'Naptárak',
    ed_entities_helper: 'Naptáronkénti színek és címkék: YAML-ben (lásd a README-t)',
    ed_title: 'Cím',
    ed_title_helper: 'Hagyja üresen a „Napirend” címhez',
    ed_days_to_show: 'Megjelenített napok',
    ed_max_events: 'Események a „További” előtt',
    ed_max_events_helper: '0 esetén minden megjelenik',
    ed_show_header: 'Fejléc',
    ed_show_location: 'Helyszín',
    ed_show_end_time: 'Befejezés ideje',
    ed_show_countdown: 'Visszaszámlálás',
    ed_show_empty_days: 'Esemény nélküli napok',
    ed_show_past_events: 'Mai befejezett események',
    ed_zoom: 'Részletek gomb',
    ed_zoom_helper: 'Gomb a jobb felső sarokban, amely a mini kártyát teljes kártyává nyitja ki, és vissza',
    ed_language: 'Nyelv',
    ed_language_helper: 'Hagyja üresen a Home Assistant nyelvének követéséhez',
  },
  ga: {
    agenda: 'Clár',
    today: 'Inniu',
    tomorrow: 'Amárach',
    all_day: 'An lá ar fad',
    now: 'Ar siúl',
    in_min: 'i gceann {n} nóim',
    in_h: 'i gceann {h} u {m} nóim',
    in_hours: 'i gceann {h} u',
    no_events: 'Gan imeachtaí',
    no_upcoming: 'Gan imeachtaí le teacht',
    events_today: 'Imeachtaí inniu: {n}',
    event_today: '{n} imeacht inniu',
    none_today: 'Faic inniu',
    next: 'Ina dhiaidh sin',
    until: 'go dtí {d}',
    more: 'Tuilleadh imeachtaí: {n}',
    more_one: '{n} imeacht eile',
    less: 'Taispeáin níos lú',
    close: 'Dún',
    load_failed: 'Níor lódáladh an féilire: {list}',
    no_calendar: 'Níor aimsíodh aon fhéilire',
    zoom_in: 'Taispeáin an cárta iomlán',
    zoom_out: 'Ar ais go dtí an t-amharc dlúth',
    ed_entities: 'Féilirí',
    ed_entities_helper: 'Dathanna agus lipéid in aghaidh an fhéilire: in YAML (féach an README)',
    ed_title: 'Teideal',
    ed_title_helper: 'Fág folamh le haghaidh “Clár”',
    ed_days_to_show: 'Laethanta a thaispeántar',
    ed_max_events: 'Imeachtaí roimh “Tuilleadh”',
    ed_max_events_helper: '0 chun gach rud a thaispeáint',
    ed_show_header: 'Ceanntásc',
    ed_show_location: 'Suíomh',
    ed_show_end_time: 'Am críochnaithe',
    ed_show_countdown: 'Comhaireamh síos',
    ed_show_empty_days: 'Laethanta gan imeachtaí',
    ed_show_past_events: 'Imeachtaí críochnaithe an lae inniu',
    ed_zoom: 'Cnaipe sonraí',
    ed_zoom_helper: 'Cnaipe ag barr ar dheis a osclaíonn an mionchárta go dtí an cárta iomlán agus ar ais',
    ed_language: 'Teanga',
    ed_language_helper: 'Fág folamh chun teanga Home Assistant a leanúint',
  },
  sk: {
    agenda: 'Program',
    today: 'Dnes',
    tomorrow: 'Zajtra',
    all_day: 'Celý deň',
    now: 'Prebieha',
    in_min: 'o {n} min',
    in_h: 'o {h} h {m} min',
    in_hours: 'o {h} h',
    no_events: 'Žiadne udalosti',
    no_upcoming: 'Žiadne nadchádzajúce udalosti',
    events_today: 'Udalosti dnes: {n}',
    event_today: '{n} udalosť dnes',
    none_today: 'Dnes nič',
    next: 'Potom',
    until: 'do {d}',
    more: 'Ďalšie udalosti: {n}',
    more_one: 'Ešte {n} udalosť',
    less: 'Zobraziť menej',
    close: 'Zavrieť',
    load_failed: 'Kalendár sa nenačítal: {list}',
    no_calendar: 'Nenašiel sa žiadny kalendár',
    zoom_in: 'Zobraziť celú kartu',
    zoom_out: 'Späť na kompaktné zobrazenie',
    ed_entities: 'Kalendáre',
    ed_entities_helper: 'Farby a názvy pre každý kalendár: v YAML (pozri README)',
    ed_title: 'Názov',
    ed_title_helper: 'Nechajte prázdne pre „Program“',
    ed_days_to_show: 'Zobrazené dni',
    ed_max_events: 'Udalosti pred „Ďalšie“',
    ed_max_events_helper: '0 na zobrazenie všetkého',
    ed_show_header: 'Hlavička',
    ed_show_location: 'Miesto',
    ed_show_end_time: 'Čas ukončenia',
    ed_show_countdown: 'Odpočítavanie',
    ed_show_empty_days: 'Dni bez udalostí',
    ed_show_past_events: 'Dnešné ukončené udalosti',
    ed_zoom: 'Tlačidlo podrobností',
    ed_zoom_helper: 'Tlačidlo vpravo hore, ktoré rozbalí mini kartu na celú kartu a späť',
    ed_language: 'Jazyk',
    ed_language_helper: 'Nechajte prázdne, ak chcete používať jazyk Home Assistanta',
  },
  cs: {
    agenda: 'Program',
    today: 'Dnes',
    tomorrow: 'Zítra',
    all_day: 'Celý den',
    now: 'Probíhá',
    in_min: 'za {n} min',
    in_h: 'za {h} h {m} min',
    in_hours: 'za {h} h',
    no_events: 'Žádné události',
    no_upcoming: 'Žádné nadcházející události',
    events_today: 'Události dnes: {n}',
    event_today: '{n} událost dnes',
    none_today: 'Dnes nic',
    next: 'Potom',
    until: 'do {d}',
    more: 'Další události: {n}',
    more_one: 'Ještě {n} událost',
    less: 'Zobrazit méně',
    close: 'Zavřít',
    load_failed: 'Kalendář se nenačetl: {list}',
    no_calendar: 'Nebyl nalezen žádný kalendář',
    zoom_in: 'Zobrazit celou kartu',
    zoom_out: 'Zpět na kompaktní zobrazení',
    ed_entities: 'Kalendáře',
    ed_entities_helper: 'Barvy a názvy pro každý kalendář: v YAML (viz README)',
    ed_title: 'Název',
    ed_title_helper: 'Ponechte prázdné pro „Program“',
    ed_days_to_show: 'Zobrazené dny',
    ed_max_events: 'Události před „Další“',
    ed_max_events_helper: '0 pro zobrazení všeho',
    ed_show_header: 'Záhlaví',
    ed_show_location: 'Místo',
    ed_show_end_time: 'Čas konce',
    ed_show_countdown: 'Odpočet',
    ed_show_empty_days: 'Dny bez událostí',
    ed_show_past_events: 'Dnešní skončené události',
    ed_zoom: 'Tlačítko podrobností',
    ed_zoom_helper: 'Tlačítko vpravo nahoře, které rozbalí mini kartu na celou kartu a zpět',
    ed_language: 'Jazyk',
    ed_language_helper: 'Ponechte prázdné pro použití jazyka Home Assistantu',
  },
  sl: {
    agenda: 'Razpored',
    today: 'Danes',
    tomorrow: 'Jutri',
    all_day: 'Ves dan',
    now: 'Poteka',
    in_min: 'čez {n} min',
    in_h: 'čez {h} h {m} min',
    in_hours: 'čez {h} h',
    no_events: 'Ni dogodkov',
    no_upcoming: 'Ni prihajajočih dogodkov',
    events_today: 'Dogodki danes: {n}',
    event_today: '{n} dogodek danes',
    none_today: 'Danes nič',
    next: 'Nato',
    until: 'do {d}',
    more: 'Več dogodkov: {n}',
    more_one: 'Še {n} dogodek',
    less: 'Prikaži manj',
    close: 'Zapri',
    load_failed: 'Koledar ni naložen: {list}',
    no_calendar: 'Ni bilo najdenega koledarja',
    zoom_in: 'Prikaži celotno kartico',
    zoom_out: 'Nazaj na strnjen pogled',
    ed_entities: 'Koledarji',
    ed_entities_helper: 'Barve in oznake za vsak koledar: v YAML (glejte README)',
    ed_title: 'Naslov',
    ed_title_helper: 'Pustite prazno za »Razpored«',
    ed_days_to_show: 'Prikazani dnevi',
    ed_max_events: 'Dogodki pred »Več«',
    ed_max_events_helper: '0 za prikaz vsega',
    ed_show_header: 'Glava',
    ed_show_location: 'Lokacija',
    ed_show_end_time: 'Čas konca',
    ed_show_countdown: 'Odštevanje',
    ed_show_empty_days: 'Dnevi brez dogodkov',
    ed_show_past_events: 'Današnji končani dogodki',
    ed_zoom: 'Gumb za podrobnosti',
    ed_zoom_helper: 'Gumb zgoraj desno, ki mini kartico razširi v celotno kartico in nazaj',
    ed_language: 'Jezik',
    ed_language_helper: 'Pustite prazno, da sledi jeziku Home Assistanta',
  },
  mt: {
    agenda: 'Aġenda',
    today: 'Illum',
    tomorrow: 'Għada',
    all_day: 'Il-ġurnata kollha',
    now: 'Għaddej',
    in_min: 'fi żmien {n} min',
    in_h: 'fi żmien {h} h {m} min',
    in_hours: 'fi żmien {h} h',
    no_events: 'L-ebda avveniment',
    no_upcoming: 'L-ebda avveniment li ġej',
    events_today: 'Avvenimenti llum: {n}',
    event_today: '{n} avveniment illum',
    none_today: 'Xejn illum',
    next: 'Wara',
    until: 'sa {d}',
    more: 'Aktar avvenimenti: {n}',
    more_one: '{n} avveniment ieħor',
    less: 'Uri inqas',
    close: 'Agħlaq',
    load_failed: 'Il-kalendarju ma tteligax: {list}',
    no_calendar: 'Ma nstab l-ebda kalendarju',
    zoom_in: 'Uri l-kard sħiħa',
    zoom_out: 'Lura għall-veduta kompatta',
    ed_entities: 'Kalendarji',
    ed_entities_helper: 'Kuluri u tikketti għal kull kalendarju: f’YAML (ara r-README)',
    ed_title: 'Titlu',
    ed_title_helper: 'Ħallih vojt għal “Aġenda”',
    ed_days_to_show: 'Jiem murija',
    ed_max_events: 'Avvenimenti qabel “Aktar”',
    ed_max_events_helper: '0 biex jintwera kollox',
    ed_show_header: 'Intestatura',
    ed_show_location: 'Post',
    ed_show_end_time: 'Ħin tat-tmiem',
    ed_show_countdown: 'Għadd lura',
    ed_show_empty_days: 'Jiem mingħajr avvenimenti',
    ed_show_past_events: 'Avvenimenti ta’ llum li spiċċaw',
    ed_zoom: 'Buttuna tad-dettalji',
    ed_zoom_helper: 'Buttuna fuq il-lemin li tiftaħ il-mini kard fil-kard sħiħa u lura',
    ed_language: 'Lingwa',
    ed_language_helper: 'Ħallih vojt biex issegwi l-lingwa ta’ Home Assistant',
  },
  lv: {
    agenda: 'Grafiks',
    today: 'Šodien',
    tomorrow: 'Rīt',
    all_day: 'Visu dienu',
    now: 'Notiek',
    in_min: 'pēc {n} min',
    in_h: 'pēc {h} st. {m} min',
    in_hours: 'pēc {h} st.',
    no_events: 'Nav notikumu',
    no_upcoming: 'Nav gaidāmu notikumu',
    events_today: 'Notikumi šodien: {n}',
    event_today: '{n} notikums šodien',
    none_today: 'Šodien nekā',
    next: 'Pēc tam',
    until: 'līdz {d}',
    more: 'Citi notikumi: {n}',
    more_one: 'Vēl {n} notikums',
    less: 'Rādīt mazāk',
    close: 'Aizvērt',
    load_failed: 'Kalendārs netika ielādēts: {list}',
    no_calendar: 'Nav atrasts neviens kalendārs',
    zoom_in: 'Rādīt pilno karti',
    zoom_out: 'Atpakaļ uz kompakto skatu',
    ed_entities: 'Kalendāri',
    ed_entities_helper: 'Krāsas un nosaukumi katram kalendāram: YAML (skatīt README)',
    ed_title: 'Virsraksts',
    ed_title_helper: 'Atstājiet tukšu, lai rādītu „Grafiks”',
    ed_days_to_show: 'Rādītās dienas',
    ed_max_events: 'Notikumi pirms „Citi notikumi”',
    ed_max_events_helper: '0, lai rādītu visu',
    ed_show_header: 'Galvene',
    ed_show_location: 'Vieta',
    ed_show_end_time: 'Beigu laiks',
    ed_show_countdown: 'Atpakaļskaitīšana',
    ed_show_empty_days: 'Dienas bez notikumiem',
    ed_show_past_events: 'Šodienas beigušies notikumi',
    ed_zoom: 'Detaļu poga',
    ed_zoom_helper: 'Poga augšējā labajā stūrī, kas izvērš mini karti par pilno karti un atpakaļ',
    ed_language: 'Valoda',
    ed_language_helper: 'Atstājiet tukšu, lai izmantotu Home Assistant valodu',
  },
  el: {
    agenda: 'Πρόγραμμα',
    today: 'Σήμερα',
    tomorrow: 'Αύριο',
    all_day: 'Ολοήμερο',
    now: 'Σε εξέλιξη',
    in_min: 'σε {n} λεπ.',
    in_h: 'σε {h} ώ. {m} λεπ.',
    in_hours: 'σε {h} ώ.',
    no_events: 'Δεν υπάρχουν συμβάντα',
    no_upcoming: 'Δεν υπάρχουν επερχόμενα συμβάντα',
    events_today: '{n} συμβάντα σήμερα',
    event_today: '{n} συμβάν σήμερα',
    none_today: 'Τίποτα σήμερα',
    next: 'Μετά',
    until: 'έως {d}',
    more: 'Άλλα {n} συμβάντα',
    more_one: 'Άλλο {n} συμβάν',
    less: 'Λιγότερα',
    close: 'Κλείσιμο',
    load_failed: 'Το ημερολόγιο δεν φορτώθηκε: {list}',
    no_calendar: 'Δεν βρέθηκε ημερολόγιο',
    zoom_in: 'Εμφάνιση πλήρους κάρτας',
    zoom_out: 'Επιστροφή στη συμπαγή προβολή',
    ed_entities: 'Ημερολόγια',
    ed_entities_helper: 'Χρώματα και ετικέτες ανά ημερολόγιο: σε YAML (δείτε το README)',
    ed_title: 'Τίτλος',
    ed_title_helper: 'Αφήστε κενό για «Πρόγραμμα»',
    ed_days_to_show: 'Εμφανιζόμενες ημέρες',
    ed_max_events: 'Συμβάντα πριν από το «Άλλα»',
    ed_max_events_helper: '0 για εμφάνιση όλων',
    ed_show_header: 'Κεφαλίδα',
    ed_show_location: 'Τοποθεσία',
    ed_show_end_time: 'Ώρα λήξης',
    ed_show_countdown: 'Αντίστροφη μέτρηση',
    ed_show_empty_days: 'Ημέρες χωρίς συμβάντα',
    ed_show_past_events: 'Σημερινά ολοκληρωμένα συμβάντα',
    ed_zoom: 'Κουμπί λεπτομερειών',
    ed_zoom_helper: 'Κουμπί πάνω δεξιά που αναπτύσσει τη μίνι κάρτα σε πλήρη κάρτα και αντίστροφα',
    ed_language: 'Γλώσσα',
    ed_language_helper: 'Αφήστε κενό για να ακολουθεί τη γλώσσα του Home Assistant',
  },
};

// Language tag -> CcI18n key: the full tag when it has its own strings (sr-Latn), else the part before
// the dash (fr-FR -> fr, pt-BR -> European Portuguese pt), else English.
function ccLang(l) {
  l = String(l || 'en');
  if (Object.hasOwn(CcI18n, l)) return l;
  l = l.split('-')[0];
  return Object.hasOwn(CcI18n, l) ? l : 'en';
}

// Locale for Intl: the full tag when its base matches the resolved card language (en-GB, sr-Latn…),
// else the card language; bare pt means European Portuguese.
function ccFmtLang(tag, lang) {
  var l = String(tag || '');
  if (l.split('-')[0].toLowerCase() !== lang.split('-')[0]) l = lang;
  return l.toLowerCase() === 'pt' ? 'pt-PT' : l;
}

function ccT(lang, key) {
  var strings = CcI18n[lang] || CcI18n.en;
  return strings[key] || CcI18n.en[key] || key;
}

// CLDR plural category of n in the card language, cached per language. 'one' covers 1 everywhere, and
// also 21, 31… in Serbian (21 догађај); the other forms are one plural string ("{n} events", or a
// "Label: {n}" counter in Polish, whose 2-4 and 5+ forms differ).
var ccPlurals = {};
function ccIsOne(lang, n) {
  if (n === 1) return true;
  try {
    ccPlurals[lang] = ccPlurals[lang] || new Intl.PluralRules(lang);
    return ccPlurals[lang].select(n) === 'one';
  } catch {
    return false;
  }
}

// "{n} event(s)…" from a singular and a plural key.
function ccCount(lang, one, many, n) {
  return ccT(lang, ccIsOne(lang, n) ? one : many).replace('{n}', n);
}

function ccEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ── Calendars and events ─────────────────────────────────────────────────────
var CC_COLORS = ['#039be5', '#e67c73', '#33b679', '#f6bf26', '#8e24aa', '#f4511e', '#3f51b5', '#0b8043', '#d81b60', '#616161'];
var CC_REFRESH = 5 * 60000;
var CC_DEFAULTS = {
  days_to_show: 7, max_events: 5, show_header: true, show_location: true, show_end_time: true,
  show_countdown: true, show_empty_days: false, show_past_events: false,
};

// A YAML scalar where a list is expected (`entities: calendar.home`, `exclude: Private`) is a one-item list.
function ccList(v) {
  if (Array.isArray(v)) return v;
  return v == null || v === '' ? [] : [v];
}

// The configured calendars: `entities` (a list, or a single one), else the single `entity`.
function ccCalList(config) {
  return config.entities ? ccList(config.entities) : ccList(config.entity);
}

// A calendar color is written into the card's <style> and style attributes: anything that is not a
// CSS color (a typo, or markup such as `red}</style><img …>`) falls back to the palette color.
function ccColor(v, fallback) {
  if (typeof v !== 'string' || !v.trim() || /[<>{};"'\\]/.test(v)) return fallback;
  if (typeof CSS !== 'undefined' && CSS.supports && !CSS.supports('color', v)) return fallback;
  return v.trim();
}

// [r, g, b] of an opaque color, or null when the card cannot tell (var(), transparency…).
var ccRgbCache = new Map();
function ccRgb(color) {
  var key = String(color);
  if (ccRgbCache.has(key)) return ccRgbCache.get(key);
  var s = key.trim(), rgb = null, m;
  if (!/^(#|rgba?\()/i.test(s)) {
    // Named, hsl()… colors: the browser's canvas normalizes them to #rrggbb / rgba(); var() stays unknown.
    try {
      var ctx = document.createElement('canvas').getContext('2d');
      ctx.fillStyle = '#010203';
      ctx.fillStyle = s;
      if (ctx.fillStyle !== '#010203') s = ctx.fillStyle;
    } catch (_e) { /* no canvas: unknown color */ }
  }
  if ((m = s.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i))) {
    var h = m[1].length < 6 ? m[1].replace(/./g, '$&$&') : m[1];
    if (h.length === 6 || /ff$/i.test(h)) rgb = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  } else if ((m = s.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[,/]\s*([\d.]+)(%?)\s*)?\)$/i))) {
    if (m[4] == null || Number(m[4]) >= (m[5] ? 100 : 1)) rgb = [m[1], m[2], m[3]].map(Number);
  }
  ccRgbCache.set(key, rgb);
  return rgb;
}

// Text on a calendar color (live countdown, today's date, logo): white when it reaches the WCAG AA
// 4.5:1, black otherwise (always ≥ 4.58:1 then). Same in light and dark themes, as the background is
// the calendar color itself. An unreadable color keeps the theme's text color for colored backgrounds.
function ccOnColor(color) {
  var rgb = ccRgb(color);
  if (!rgb) return 'var(--text-primary-color, #fff)';
  var l = rgb.map((v) => {
    var c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  var lum = 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
  return 1.05 / (lum + 0.05) >= 4.5 ? '#ffffff' : '#000000';
}

// `entities` accepts entity ids or objects { entity, color, name }; colors default to a palette.
function ccCalendars(config, hass) {
  return ccCalList(config).map((item, i) => {
    var c = typeof item === 'string' ? { entity: item } : Object.assign({}, item);
    var st = hass?.states?.[c.entity];
    c.color = ccColor(c.color, CC_COLORS[i % CC_COLORS.length]);
    c.name = c.name || st?.attributes?.friendly_name || c.entity;
    return c;
  }).filter((c) => c.entity);
}

function ccLocalDate(s) {
  var p = String(s).slice(0, 10).split('-').map(Number);
  return new Date(p[0], p[1] - 1, p[2]);
}

function ccDayStart(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }

function ccAddDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }

function ccKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// A start / end from the calendar API: { dateTime } for a timed event, { date } for an all-day one.
function ccTime(v) {
  if (!v) return null;
  if (typeof v === 'object') {
    if (v.dateTime) return { d: new Date(v.dateTime), allDay: false };
    if (v.date) return { d: ccLocalDate(v.date), allDay: true };
    return null;
  }
  var s = String(v);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? { d: ccLocalDate(s), allDay: true } : { d: new Date(s), allDay: false };
}

function ccParse(raw, cal) {
  var s = ccTime(raw?.start);
  if (!s || Number.isNaN(s.d.getTime())) return null;
  var e = ccTime(raw.end);
  var end = e && !Number.isNaN(e.d.getTime()) ? e.d : (s.allDay ? ccAddDays(s.d, 1) : s.d);
  if (end < s.d) end = s.d;
  return {
    summary: String(raw.summary || raw.message || ''),
    start: s.d, end: end, allDay: s.allDay,
    location: raw.location || '', description: raw.description || '',
    uid: raw.uid || '', cal: cal,
  };
}

// The same event in several calendars (a shared invitation) is listed once.
function ccDedupe(events) {
  var seen = new Set();
  return events.filter((e) => {
    var k = `${e.summary}|${+e.start}|${+e.end}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// Stable identity of an event across fetches and re-renders (row indexes shift as events end or change).
function ccEvKey(e) {
  return `${e.uid}|${e.summary}|${+e.start}|${+e.end}`;
}

function ccSort(a, b) {
  if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
  return (a.start - b.start) || (a.end - b.end) || a.summary.localeCompare(b.summary);
}

// Days from `from`, each with the events it overlaps. A multi-day event is listed once, on the first
// day shown (its start day, or today when it started earlier), with its full date range.
function ccByDay(events, from, days, now, showPast) {
  var out = [], placed = new Set();
  for (var i = 0; i < days; i++) {
    var ds = ccAddDays(from, i), de = ccAddDays(from, i + 1);
    var list = events.filter((e) => {
      if (placed.has(e)) return false;
      var overlaps = e.start < de && (e.end > ds || (+e.end === +e.start && e.start >= ds));
      if (!overlaps) return false;
      // Timed events that are over are hidden unless show_past_events.
      if (!showPast && !e.allDay && (e.end > e.start ? e.end <= now : e.start < now)) return false;
      placed.add(e);
      return true;
    }).sort(ccSort);
    out.push({ date: ds, events: list });
  }
  return out;
}

function ccMultiDay(e) {
  var last = e.allDay ? ccAddDays(e.end, -1) : new Date(e.end - 1);
  return +e.end > +e.start && ccKey(e.start) !== ccKey(last);
}

function ccExcluded(e, exclude) {
  var list = ccList(exclude);
  if (!list.length) return false;
  var s = e.summary.toLowerCase();
  return list.some((x) => x && s.indexOf(String(x).toLowerCase()) >= 0);
}

// ── Header logo: a tear-off calendar page with today's date ─────────────────
var ccLogo = (wd, day) => '<svg class="logo" viewBox="0 0 40 40" role="img" aria-hidden="true">' +
  '<rect x="2" y="3" width="36" height="35" rx="8" fill="var(--card-background-color, #fff)" stroke="var(--divider-color, rgba(0,0,0,.12))"/>' +
  '<path d="M10 3h20a8 8 0 0 1 8 8v3H2v-3a8 8 0 0 1 8-8Z" fill="var(--cc-accent)"/>' +
  `<text x="20" y="11.6" text-anchor="middle" font-size="7.2" font-weight="700" fill="var(--cc-accent-on)" letter-spacing=".4">${ccEsc(wd)}</text>` +
  `<text x="20" y="32" text-anchor="middle" font-size="17" font-weight="500" fill="var(--primary-text-color, #212121)">${ccEsc(day)}</text></svg>`;

var ccInDialog = (ev) => ev.composedPath().some((n) => ['ha-more-info-dialog', 'ha-dialog', 'dialog'].indexOf(n.localName) >= 0);

// ── Card ─────────────────────────────────────────────────────────────────────
class CalendarAgendaCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement('calendar-agenda-card-editor');
  }

  static getStubConfig(hass) {
    var ids = Object.keys(hass?.states || {}).filter((id) => id.indexOf('calendar.') === 0);
    return { entities: ids.slice(0, 3) };
  }

  constructor() {
    super();
    this._events = [];
    this._failed = [];
    this._fetchedAt = 0;
    this._fetchSeq = 0;
    // Popup, "more" section and mini card fold back on a click anywhere else on the page.
    this._onOutside = (ev) => {
      if (ev.composedPath().includes(this) || ccInDialog(ev)) return;
      if (this._detail != null || this._expanded || this._zoomed) {
        this._detail = null;
        this._expanded = false;
        this._zoomed = false;
        this._update();
      }
    };
  }

  setConfig(config) {
    if (!config) throw new Error('Invalid configuration');
    var prev = this._config;
    this._config = Object.assign({}, CC_DEFAULTS, config);
    // A new calendar list invalidates the stored events, whose `cal` indexes the old one.
    var ccIds = (c) => JSON.stringify(ccCalList(c).map((x) => (typeof x === 'string' ? x : x?.entity)));
    if (prev && ccIds(prev) !== ccIds(this._config)) {
      this._events = [];
      this._loaded = false;
    }
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.addEventListener('click', (ev) => this._onClick(ev));
      this.shadowRoot.addEventListener('keydown', (ev) => this._onKey(ev));
    }
    this._sig = null;
    this._fetchKey = null;
    this._update();
  }

  set hass(hass) {
    this._hass = hass;
    this._update();
  }

  connectedCallback() {
    // Every minute: countdowns move on, finished events go, and the events are fetched again every 5 min.
    // The tick is skipped while the details popup is open: re-rendering would reset its scroll position.
    clearInterval(this._timer);
    this._timer = setInterval(() => { if (this._detail != null) return; this._sig = null; this._update(); }, 60000);
    document.addEventListener('click', this._onOutside, true);
  }

  disconnectedCallback() {
    clearInterval(this._timer);
    document.removeEventListener('click', this._onOutside, true);
  }

  getCardSize() {
    var n = this._shown || 3;
    return 1 + Math.ceil(n * 0.8);
  }

  // 8 columns at least: at 6 (about 160px in a section) an event under way lost its title and time to the
  // date column and the countdown badge. The mini card keeps 6.
  getGridOptions() { return { columns: 12, min_columns: 8 }; }

  _lang() {
    return ccLang((this._config?.language) || (this._hass?.language) || document.documentElement.lang);
  }

  _t(k) { return ccT(this._lang(), k); }

  // Full locale tag for date/time formatting (en-GB vs en-US…); the truncated _lang() is only for CcI18n.
  // The full tag is kept only when its base matches the card language, else the card language is used;
  // bare pt (Home Assistant's European Portuguese) becomes pt-PT, as Intl reads pt as Brazilian.
  _fmtLang() {
    return ccFmtLang(this._fmtTag(), this._lang());
  }

  _fmtTag() {
    var l = (this._config?.language) || (this._hass?.locale?.language) || (this._hass?.language) || document.documentElement.lang || 'en';
    if (l === this._fmtOk) return l;
    // An invalid tag is remembered too, so Intl is not asked (and does not throw) again on every format.
    if (l === this._fmtBad) return this._lang();
    try { new Intl.DateTimeFormat(l); this._fmtOk = l; } catch { this._fmtBad = l; l = this._lang(); }
    return l;
  }

  _days() { return Math.max(1, Math.min(62, Number(this._config.days_to_show) || CC_DEFAULTS.days_to_show)); }

  _timeFmt(d) {
    var o = { hour: '2-digit', minute: '2-digit' };
    var tf = this._hass?.locale?.time_format;
    if (tf === '12') o.hour12 = true;
    else if (tf === '24') o.hour12 = false;
    return d.toLocaleTimeString(this._fmtLang(), o);
  }

  _dateFmt(d, opts) { return d.toLocaleDateString(this._fmtLang(), opts); }

  // Abbreviated month under the day number. Intl gives a number for a lone short month in some
  // languages (Bulgarian "11"): the first three letters of the full name are used there (ное).
  _monthShort(d) {
    var m = this._dateFmt(d, { month: 'short' }).replace('.', '');
    return /^\d+$/.test(m) ? this._dateFmt(d, { month: 'long' }).slice(0, 3) : m;
  }


  // "in 25 min", "in 2 h 05", "Now": for today's events only.
  _countdown(e, now) {
    if (e.allDay) return '';
    if (e.start <= now && e.end > now) return this._t('now');
    var mins = Math.round((e.start - now) / 60000);
    if (mins < 0 || mins >= 24 * 60) return '';
    if (mins < 60) return this._t('in_min').replace('{n}', Math.max(1, mins));
    var h = Math.floor(mins / 60), m = mins % 60;
    if (!m) return this._t('in_hours').replace('{h}', h);
    // Clock-style "in 2 h 05" (fr/en/pt/pl/ro, minutes last) pads the minutes; "in 2 Std. 5 Min." (de/es/it/nl…) does not.
    var tpl = this._t('in_h');
    return tpl.replace('{h}', h).replace('{m}', /\{m\}$/.test(tpl) ? String(m).padStart(2, '0') : m);
  }

  // Time line of an event: a multi-day one shows its whole range, since it is listed only once.
  _when(e) {
    if (e.allDay) {
      var days = Math.round((ccDayStart(e.end) - ccDayStart(e.start)) / 86400000);
      if (days <= 1) return this._t('all_day');
      return `${this._t('all_day')} · ${this._dateFmt(e.start, { day: 'numeric', month: 'short' })} – ${this._dateFmt(ccAddDays(e.end, -1), { day: 'numeric', month: 'short' })}`;
    }
    var hasEnd = +e.end !== +e.start;
    if (hasEnd && ccKey(e.start) !== ccKey(new Date(e.end - 1))) {
      var o = { weekday: 'short', day: 'numeric', month: 'short' };
      return `${this._dateFmt(e.start, o)} ${this._timeFmt(e.start)} – ${this._dateFmt(e.end, o)} ${this._timeFmt(e.end)}`;
    }
    var from = this._timeFmt(e.start);
    return this._config.show_end_time && hasEnd ? `${from} – ${this._timeFmt(e.end)}` : from;
  }

  _update() {
    if (!this._config || !this._hass || !this.shadowRoot) return;
    var cals = ccCalendars(this._config, this._hass);
    this._cals = cals;
    var now = new Date();
    // Cheap pre-check: a hass update that touches neither the calendar entities, the minute, the
    // language / time format nor the card state cannot change the fetch key or the render — skip the
    // two JSON.stringify below. `_sig = null` (set by setConfig, the minute timer and a resolved fetch)
    // forces a full pass. While the details popup is open the minute is left out, so the next hass
    // update after a minute change does not re-render (and reset the popup's scroll) underneath it.
    var minute = this._detail != null ? '' : Math.floor(Date.now() / 60000);
    var loc = this._hass.locale || {};
    var tick = `${cals.map((c) => this._hass.states[c.entity]?.last_updated || '').join('|')}|${minute}|${this._detail}|${this._expanded}|${this._zoomed}` +
      `|${this._hass.language}|${loc.language}|${loc.time_format}`;
    if (this._sig != null && tick === this._tick) return;
    this._tick = tick;
    // Fetch again when the calendars, the range or the day change, when a calendar entity changes
    // (an event starts or ends) and every 5 minutes.
    var key = JSON.stringify([cals.map((c) => c.entity), this._days(), ccKey(now),
      cals.map((c) => this._hass.states[c.entity]?.last_changed || '')]);
    if (cals.length && (key !== this._fetchKey || Date.now() - this._fetchedAt > CC_REFRESH)) {
      this._fetchKey = key;
      this._fetch(cals);
    }
    var sig = JSON.stringify([this._lang(), this._fmtLang(), this._fetchedAt, this._detail, this._expanded, this._zoomed,
      minute, cals.map((c) => [c.entity, c.color, c.name]), this._hass.locale?.time_format]);
    if (sig === this._sig) return;
    this._sig = sig;
    // Re-rendering replaces the whole shadow DOM: put the keyboard focus back on the same event (found
    // by its key, its row index may have moved) and keep the open popup's scroll position — only when
    // the popup still shows the same event (another event's popup, e.g. opened from the keyboard, starts
    // at the top).
    var focusedIdx = this.shadowRoot.activeElement?.dataset?.ev;
    var focused = focusedIdx != null ? this._evKeyAt(focusedIdx) : null;
    var popScroll = this.shadowRoot.querySelector('.pop')?.scrollTop;
    var popShown = this._popShown;
    this._render(cals, now);
    this._popShown = this._detail;
    if (popScroll && popShown != null && popShown === this._detail) {
      var pop = this.shadowRoot.querySelector('.pop'); if (pop) pop.scrollTop = popScroll;
    }
    var at = focused != null ? this._evIndex(focused) : -1;
    // preventScroll: a re-render from a hass update must not scroll the page to the card.
    if (at >= 0) this.shadowRoot.querySelector(`[data-ev="${at}"]`)?.focus({ preventScroll: true });
  }

  // `_detail` holds the open event's key (ccEvKey); rows carry their index in `_flat`.
  _evKeyAt(i) {
    var item = this._flat?.[Number(i)];
    return item ? ccEvKey(item.e) : null;
  }

  _evIndex(key) {
    return (this._flat || []).findIndex((x) => ccEvKey(x.e) === key);
  }

  _toggleDetail(i) {
    var key = this._evKeyAt(i);
    this._detail = key == null || this._detail === key ? null : key;
    this._update();
  }

  async _fetch(cals) {
    var seq = ++this._fetchSeq;
    var from = ccDayStart(new Date());
    var to = ccAddDays(from, this._days());
    var q = `?start=${encodeURIComponent(from.toISOString())}&end=${encodeURIComponent(to.toISOString())}`;
    // Set before the await, so a `set hass` while the request is pending does not refetch.
    this._fetchedAt = Date.now();
    var res = await Promise.allSettled(cals.map((c) => this._hass.callApi('GET', `calendars/${c.entity}${q}`)));
    if (seq !== this._fetchSeq) return;
    var events = [], failed = [];
    res.forEach((r, i) => {
      // A calendar that fails (network blip, HA restarting) keeps its last events instead of
      // emptying the agenda. `_events` is cleared when the calendar list changes, so `cal` is valid.
      if (r.status !== 'fulfilled') {
        failed.push(cals[i].name);
        this._events.forEach((e) => { if (e.cal === i) events.push(e); });
        return;
      }
      (Array.isArray(r.value) ? r.value : []).forEach((raw) => {
        var e = ccParse(raw, i);
        if (e) events.push(e);
      });
    });
    this._events = ccDedupe(events.sort(ccSort));
    this._failed = failed;
    // "No upcoming events" needs at least one calendar that answered.
    if (failed.length < cals.length) this._loaded = true;
    // After a failure, try again a minute later rather than at the next 5-minute refresh.
    this._fetchedAt = failed.length ? Date.now() - CC_REFRESH + 60000 : Date.now();
    this._sig = null;
    this._update();
  }

  _visibleDays(now) {
    var c = this._config;
    var events = this._events.filter((e) => !ccExcluded(e, c.exclude) && this._cals[e.cal]);
    return ccByDay(events, ccDayStart(now), this._days(), now, c.show_past_events);
  }

  _eventHtml(e, now, idx, isToday) {
    var c = this._config, cal = this._cals[e.cal];
    var meta = [`<span class="when">${ccEsc(this._when(e))}</span>`];
    if (c.show_location && e.location) meta.push(`<span class="loc"><ha-icon icon="mdi:map-marker-outline"></ha-icon><span class="lt">${ccEsc(e.location)}</span></span>`);
    var ongoing = !e.allDay && e.start <= now && e.end > now;
    var cd = c.show_countdown && isToday ? this._countdown(e, now) : '';
    var prog = '';
    if (ongoing && e.end > e.start) {
      var pct = Math.round(((now - e.start) / (e.end - e.start)) * 100);
      prog = `<div class="eprog"><div class="efill" style="width:${pct}%"></div></div>`;
    }
    return `<div class="ev${ongoing ? ' ongoing' : ''}${e.end <= now && !e.allDay ? ' past' : ''}" style="--c:${ccEsc(cal.color)};--c-on:${ccEsc(ccOnColor(cal.color))}" data-ev="${idx}" role="button" tabindex="0">` +
      '<span class="cbar"></span>' +
      `<div class="emain"><div class="etitle">${ccEsc(e.summary)}</div><div class="emeta">${meta.join('<span class="sep">·</span>')}</div>${prog}</div>` +
      (cd ? `<span class="cd${ongoing ? ' live' : ''}">${ccEsc(cd)}</span>` : '') +
    '</div>';
  }

  _dayHtml(day, events, now, firstIdx, cont) {
    var isToday = ccKey(day.date) === ccKey(now);
    var isTomorrow = ccKey(day.date) === ccKey(ccAddDays(now, 1));
    var wd = this._dateFmt(day.date, { weekday: 'short' }).replace('.', '');
    var label = isToday ? this._t('today') : (isTomorrow ? this._t('tomorrow') : '');
    var date = cont ? '<div class="date"></div>'
      : `<div class="date${isToday ? ' today' : ''}"><span class="wd">${ccEsc(wd)}</span><span class="dn">${day.date.getDate()}</span>` +
        `<span class="mo">${ccEsc(this._monthShort(day.date))}</span></div>`;
    var body = events.length
      ? events.map((e, i) => this._eventHtml(e, now, firstIdx + i, isToday)).join('')
      : `<div class="none">${this._t('no_events')}</div>`;
    return `<div class="day${cont ? ' cont' : ''}">${date}<div class="events">${label && !cont ? `<div class="dlabel">${ccEsc(label)}</div>` : ''}${body}</div></div>`;
  }

  // Shared by the full and mini cards: the "N events today" counter is a status badge at the right
  // of the header, like the other ha-* cards.
  _headerHtml(now, sub) {
    // Locale-aware upper case: Greek drops its accents (ΤΡΙ, not ΤΡΊ).
    var wd = this._dateFmt(now, { weekday: 'short' }).replace('.', '').toLocaleUpperCase(this._fmtLang());
    return '<div class="header">' + ccLogo(wd, now.getDate()) +
      `<div class="titles"><div class="name">${ccEsc(this._config.title || this._t('agenda'))}</div></div>` +
      `<span class="st" title="${ccEsc(sub)}"><span class="dot"></span><span class="stt">${ccEsc(sub)}</span></span>${this._zoomButton()}</div>`;
  }

  _todaySub(days) {
    var n = days.length ? days[0].events.length : 0;
    if (!n) return this._t('none_today');
    return ccCount(this._lang(), 'event_today', 'events_today', n);
  }

  _errorHtml() {
    return this._failed.length
      ? `<div class="error" role="alert"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>${ccEsc(this._t('load_failed').replace('{list}', this._failed.join(', ')))}</span></div>`
      : '';
  }

  // Overridden by the mini card.
  _compact() { return false; }

  _zoomButton() { return ''; }

  _render(cals, now) {
    var c = this._config;
    var accent = cals[0]?.color || CC_COLORS[0];
    if (!cals.length) {
      this.shadowRoot.innerHTML = `${this._styles(accent)}<ha-card lang="${ccEsc(this._fmtLang())}"><div class="empty"><ha-icon icon="mdi:calendar-blank-outline"></ha-icon>${this._t('no_calendar')}</div></ha-card>`;
      return;
    }
    var days = this._visibleDays(now);
    // Flat list of shown events, so a click finds its event back.
    this._flat = [];
    days.forEach((d) => { d.events.forEach((e) => { this._flat.push({ e: e, day: d.date }); }); });
    // The open event is gone (finished and hidden, removed by a refetch): close its details.
    if (this._detail != null && this._evIndex(this._detail) < 0) this._detail = null;

    if (this._compact()) {
      this.shadowRoot.innerHTML = this._styles(accent) + this._miniHtml(days, now);
      return;
    }

    var max = Math.max(0, Number(c.max_events) || 0);
    var shown = [], more = [], count = 0, idx = 0;
    days.forEach((d) => {
      if (!d.events.length) {
        // An empty day counts as shown only before the cut.
        if (c.show_empty_days) (!max || count < max ? shown : more).push(this._dayHtml(d, [], now, idx, false));
        return;
      }
      if (!max || count + d.events.length <= max) {
        shown.push(this._dayHtml(d, d.events, now, idx, false));
      } else if (count < max) {
        var head = d.events.slice(0, max - count);
        shown.push(this._dayHtml(d, head, now, idx, false));
        more.push(this._dayHtml(d, d.events.slice(head.length), now, idx + head.length, true));
      } else {
        more.push(this._dayHtml(d, d.events, now, idx, false));
      }
      count += d.events.length;
      idx += d.events.length;
    });
    var moreCount = max ? Math.max(0, this._flat.length - max) : 0;
    // No event hidden: `more` only holds trailing empty days — keep them visible.
    if (!moreCount && more.length) { shown = shown.concat(more); more = []; }
    this._shown = Math.min(this._flat.length, max || this._flat.length) + (this._expanded ? moreCount : 0);

    var list = shown.join('') || (this._loaded ? `<div class="none big">${this._t('no_upcoming')}</div>` : '');
    var moreHtml = '';
    if (moreCount) {
      var open = !!this._expanded;
      var label = open ? this._t('less') : ccCount(this._lang(), 'more_one', 'more', moreCount);
      moreHtml = `<div class="more-body${open ? ' open' : ''}">${open ? more.join('') : ''}</div>` +
        `<button class="more" data-action="more" aria-expanded="${open}"><ha-icon icon="${open ? 'mdi:chevron-down' : 'mdi:chevron-right'}"></ha-icon>${ccEsc(label)}</button>`;
    }

    this.shadowRoot.innerHTML = this._styles(accent) + `<ha-card class="${this._detail != null ? 'popped' : ''}" lang="${ccEsc(this._fmtLang())}">` +
      // An unfolded mini card keeps its header whatever show_header says: it holds the fold button.
      (c.show_header || this._zoomed ? this._headerHtml(now, this._todaySub(days)) : '') +
      `<div class="list">${list}</div>${moreHtml}${this._errorHtml()}${this._popupHtml()}</ha-card>`;
  }

  // Event details, at the top of the card.
  _popupHtml() {
    var item = this._detail != null && this._flat[this._evIndex(this._detail)];
    if (!item) return '';
    var e = item.e, cal = this._cals[e.cal];
    var date = this._dateFmt(e.start, { weekday: 'long', day: 'numeric', month: 'long' });
    var when;
    if (e.allDay) {
      when = this._when(e).indexOf('·') > 0 ? this._when(e) : `${date} · ${this._t('all_day')}`;
    } else if (ccKey(e.start) === ccKey(e.end) || +e.end === +ccAddDays(ccDayStart(e.start), 1)) {
      when = `${date} · ${this._timeFmt(e.start)}${+e.end !== +e.start ? ` – ${this._timeFmt(e.end)}` : ''}`;
    } else {
      var o = { weekday: 'short', day: 'numeric', month: 'short' };
      when = `${this._dateFmt(e.start, o)} ${this._timeFmt(e.start)} – ${this._dateFmt(e.end, o)} ${this._timeFmt(e.end)}`;
    }
    var rows = [`<div class="prow"><ha-icon icon="mdi:clock-outline"></ha-icon><span>${ccEsc(when)}</span></div>`];
    if (e.location) rows.push(`<div class="prow"><ha-icon icon="mdi:map-marker-outline"></ha-icon><span>${ccEsc(e.location)}</span></div>`);
    rows.push(`<div class="prow"><span class="pdot" style="background:${ccEsc(cal.color)}"></span><span>${ccEsc(cal.name)}</span></div>`);
    if (e.description) rows.push(`<div class="pdesc">${ccEsc(String(e.description).slice(0, 1200))}</div>`);
    return `<div class="pop" role="dialog" aria-label="${ccEsc(e.summary)}" style="--c:${ccEsc(cal.color)}">` +
      `<div class="phead"><span class="cbar"></span><div class="ptitle">${ccEsc(e.summary)}</div>` +
      `<button class="pclose" data-action="close" title="${ccEsc(this._t('close'))}" aria-label="${ccEsc(this._t('close'))}"><ha-icon icon="mdi:close"></ha-icon></button></div>` +
      rows.join('') + '</div>';
  }

  _onClick(ev) {
    var path = ev.composedPath();
    var btn = path.find((n) => n.dataset?.action);
    if (btn) {
      switch (btn.dataset.action) {
        case 'more': this._expanded = !this._expanded; break;
        case 'close': this._detail = null; break;
        case 'zoom': this._zoomed = !this._zoomed; this._detail = null; break;
      }
      this._update();
      if (btn.dataset.action === 'zoom' && ev.detail === 0) this.shadowRoot.querySelector('.zoom')?.focus({ preventScroll: true });
      return;
    }
    var row = path.find((n) => n.dataset?.ev != null);
    if (row) {
      this._toggleDetail(row.dataset.ev);
      return;
    }
    // A click on the card outside the popup closes it.
    if (this._detail != null && !path.some((n) => n.classList?.contains('pop'))) {
      this._detail = null;
      this._update();
    }
  }

  _onKey(ev) {
    if (ev.key === 'Escape' && this._detail != null) {
      this._detail = null;
      this._update();
      return;
    }
    if ((ev.key === 'Enter' || ev.key === ' ') && ev.target?.dataset?.ev != null) {
      ev.preventDefault();
      // Same toggle as a click: a second Enter/Space on the open event closes its details.
      this._toggleDetail(ev.target.dataset.ev);
    }
  }

  _styles(accent) {
    return '<style>' +
      // One minmax(0, 1fr) column: the card's min-content width is 0, so it shrinks in a shared grid (1fr 1fr,
      // a stack) instead of pushing out of it, while an inline-block or an auto column still gets its content width.
      `:host { display: grid; grid-template-columns: minmax(0, 1fr); height: 100%; --cc-accent: ${accent}; --cc-accent-on: ${ccOnColor(accent)}; }` +
      // No size containment on the card: it would drop to its padding in a container sized by its content
      // (inline-block, a grid's auto column). The header alone is the container of the narrow query below.
      'ha-card { position: relative; height: 100%; box-sizing: border-box; padding: 12px; display: flex; flex-direction: column; gap: 10px; }' +
      'ha-card.popped { min-height: 240px; }' +
      '.empty { display: flex; align-items: center; gap: 10px; color: var(--secondary-text-color); }' +
      // The body starts 8px under the header, like the other ha-* cards (the card's gap is 10px).
      '.header { display: flex; align-items: center; gap: 10px; margin-bottom: -2px; container-type: inline-size; }' +
      '.logo { width: 40px; height: 40px; flex-shrink: 0; font-family: inherit; }' +
      // The counter pill gets its whole width first and the title the rest, down to a few characters
      // (ellipsized); only then does the pill give way.
      '.titles { flex: 1 1 0; min-width: 4.5ch; font-size: 16px; }' +
      '.name { font-size: 16px; font-weight: 500; line-height: 1.25; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }' +
      '.list, .more-body { display: flex; flex-direction: column; gap: 10px; }' +
      '.more-body:not(.open) { display: none; }' +
      // A full card squeezed into a narrow column (an unfolded mini card left at 6 columns): the events go
      // under the date rather than keep less than 120px beside it.
      '.day { display: flex; flex-wrap: wrap; gap: 10px; }' +
      '.day + .day { border-top: 1px solid var(--divider-color, rgba(128,128,128,0.15)); padding-top: 10px; }' +
      '.list .day.cont, .more-body .day.cont { border-top: none; padding-top: 0; }' +
      '.date { width: 40px; flex-shrink: 0; display: flex; flex-direction: column; align-items: center; line-height: 1.1; padding-top: 2px; }' +
      // ha-card carries the card language, so the upper case follows it (Greek drops its accents).
      '.date .wd, .date .mo { font-size: 11px; font-weight: 500; text-transform: uppercase; color: var(--secondary-text-color); }' +
      '.date .dn { font-size: 20px; font-weight: 500; color: var(--primary-text-color); margin: 2px 0; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; }' +
      // Accent text: mixed with the theme's text color so it reads at ≥ 4.5:1 in light and dark themes.
      '.date.today .wd { color: color-mix(in srgb, var(--cc-accent) 45%, var(--primary-text-color)); }' +
      '.date.today .dn { background: var(--cc-accent); color: var(--cc-accent-on); }' +
      '.events { flex: 1 1 0; min-width: min(100%, 120px); display: flex; flex-direction: column; gap: 4px; }' +
      '.dlabel { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; color: var(--secondary-text-color); margin: 2px 0 2px 2px; }' +
      '.none { font-size: 13px; color: var(--secondary-text-color); padding: 6px 2px; }' +
      '.none.big { display: flex; align-items: center; justify-content: center; padding: 18px 0; }' +
      // The countdown pill drops under the event when the event would keep less than 120px beside it, so
      // neither the title nor the time is cut down to a letter; the color bar spans both lines.
      '.ev { position: relative; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; padding: 6px 8px 6px 20px; border-radius: 10px; cursor: pointer; min-width: 0;' +
        ' background: color-mix(in srgb, var(--c) 9%, transparent); outline: none; }' +
      '.ev:hover { background: color-mix(in srgb, var(--c) 16%, transparent); }' +
      '.ev:focus-visible { box-shadow: 0 0 0 2px var(--c); }' +
      '.ev.past { opacity: 0.55; }' +
      '.cbar { width: 4px; align-self: stretch; min-height: 28px; border-radius: 2px; background: var(--c); flex-shrink: 0; }' +
      '.ev .cbar { position: absolute; left: 6px; top: 6px; bottom: 6px; min-height: 0; }' +
      '.emain { flex: 1 1 0; min-width: min(100%, 120px); display: flex; flex-direction: column; gap: 2px; }' +
      '.etitle { font-size: 14px; font-weight: 500; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }' +
      '.emeta { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--secondary-text-color); min-width: 0; white-space: nowrap; overflow: hidden; }' +
      '.emeta .sep { opacity: 0.6; }' +
      // The time comes first: the location gives way before it (and ends with an ellipsis). A time line
      // still too long (an all-day range) wraps rather than being cut.
      '.emeta .when { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: normal; }' +
      '.loc { display: inline-flex; align-items: center; gap: 2px; flex: 0 1000 auto; min-width: 0; overflow: hidden; }' +
      '.loc .lt { min-width: 0; overflow: hidden; text-overflow: ellipsis; }' +
      '.loc ha-icon { --mdc-icon-size: 13px; flex-shrink: 0; }' +
      '.eprog { height: 3px; border-radius: 2px; margin-top: 3px; background: color-mix(in srgb, var(--c) 20%, transparent); overflow: hidden; }' +
      '.efill { height: 100%; background: var(--c); border-radius: 2px; }' +
      '.cd { flex-shrink: 0; font-size: 11px; font-weight: 500; padding: 1px 8px; border-radius: 12px; white-space: nowrap;' +
        ' background: var(--secondary-background-color, rgba(128,128,128,0.12)); color: var(--secondary-text-color); }' +
      '.cd.live { background: var(--c); color: var(--c-on); }' +
      'button { font: inherit; cursor: pointer; border: none; }' +
      '.more { align-self: flex-start; display: inline-flex; align-items: center; gap: 2px; font-size: 12px; font-weight: 500; padding: 4px 8px 4px 2px;' +
        ' border-radius: 10px; background: none; color: var(--primary-color, #03a9f4); }' +
      '.more ha-icon { --mdc-icon-size: 18px; }' +
      '.error { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--error-color, #db4437); }' +
      '.error ha-icon { --mdc-icon-size: 16px; flex-shrink: 0; }' +
      '.pop { position: absolute; top: 8px; left: 8px; right: 8px; z-index: 2; display: flex; flex-direction: column; gap: 8px; padding: 12px;' +
        ' border-radius: 12px; background: var(--card-background-color, #fff); color: var(--primary-text-color);' +
        ' box-shadow: 0 6px 24px rgba(0,0,0,0.22), 0 0 0 1px var(--divider-color, rgba(0,0,0,0.12)); animation: cc-in 0.16s ease-out; max-height: calc(100% - 16px); overflow: auto; box-sizing: border-box; }' +
      '@keyframes cc-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }' +
      '@media (prefers-reduced-motion: reduce) { .pop { animation: none; } }' +
      '.phead { display: flex; align-items: flex-start; gap: 10px; }' +
      '.phead .cbar { min-height: 22px; }' +
      '.ptitle { flex: 1; font-size: 16px; font-weight: 500; line-height: 1.3; word-break: break-word; }' +
      '.pclose { all: unset; cursor: pointer; width: 28px; height: 28px; margin: -4px -4px 0 0; border-radius: 50%; display: grid; place-items: center; color: var(--secondary-text-color); }' +
      '.pclose:hover { background: color-mix(in srgb, var(--secondary-text-color) 16%, transparent); }' +
      '.pclose:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }' +
      '.pclose ha-icon { --mdc-icon-size: 18px; }' +
      '.prow { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--secondary-text-color); padding-left: 14px; }' +
      '.prow ha-icon { --mdc-icon-size: 16px; flex-shrink: 0; }' +
      '.pdot { width: 10px; height: 10px; margin: 0 3px; border-radius: 50%; flex-shrink: 0; }' +
      '.pdesc { font-size: 13px; line-height: 1.45; white-space: pre-wrap; word-break: break-word; color: var(--primary-text-color); padding: 8px 0 0 14px;' +
        ' border-top: 1px solid var(--divider-color, rgba(128,128,128,0.15)); }' +
      '.zoom { all: unset; flex: none; cursor: pointer; width: 24px; height: 24px; margin: -4px -4px -4px 0; border-radius: 50%;' +
        ' display: grid; place-items: center; color: var(--secondary-text-color); }' +
      '.zoom ha-icon { --mdc-icon-size: 16px; }' +
      '.zoom:hover { background: color-mix(in srgb, var(--secondary-text-color) 16%, transparent); color: var(--primary-text-color); }' +
      '.zoom:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }' +
      // The counter pill shrinks before the title and ellipsizes its text; on a very narrow card only its dot is left.
      '.st { display: inline-flex; align-items: center; gap: 4px; flex: 0 1 auto; min-width: 0; overflow: hidden; padding: 1px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;' +
        ' white-space: nowrap; background: color-mix(in srgb, var(--cc-accent) 15%, transparent);' +
        ' color: color-mix(in srgb, var(--cc-accent) 45%, var(--primary-text-color)); }' +
      '.st .stt { min-width: 0; overflow: hidden; text-overflow: ellipsis; }' +
      '.st .dot { display: none; flex: none; width: 6px; height: 6px; border-radius: 50%; background: var(--cc-accent); }' +
      // Header under 240px (a phone's 6 to 8-column section card): the logo gives its room to the title and
      // the counter, which then shows its whole text down to a 245px card in every language.
      '@container (max-width: 240px) { .logo { display: none; } }' +
      // Header under 200px: dot only, tighter gaps (the header is the container: its 10px gaps lose 4px
      // through the items' margins). The text stays readable by screen readers, and in the pill's tooltip.
      '@container (max-width: 200px) {' +
        ' .st, .zoom { margin-left: -4px; }' +
        ' .st { padding: 4px; }' +
        ' .st .stt { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }' +
        ' .st .dot { display: block; }' +
      ' }' +
      '.mnext { font-size: 12px; color: var(--secondary-text-color); display: flex; gap: 6px; align-items: center; min-width: 0; white-space: nowrap; overflow: hidden; }' +
      // The event name keeps at least 40px; the date or time after it gives way first.
      '.mnext b { min-width: 40px; font-weight: 500; color: var(--primary-text-color); overflow: hidden; text-overflow: ellipsis; }' +
      '.mnext span:last-child { min-width: 0; overflow: hidden; text-overflow: ellipsis; }' +
      '.mallday { display: flex; align-items: center; gap: 6px; min-width: 0; padding: 4px 8px; border-radius: 10px; cursor: pointer; white-space: nowrap; overflow: hidden;' +
        ' font-size: 12px; color: var(--secondary-text-color); background: color-mix(in srgb, var(--c) 9%, transparent); outline: none; }' +
      '.mallday:hover { background: color-mix(in srgb, var(--c) 16%, transparent); }' +
      '.mallday:focus-visible { box-shadow: 0 0 0 2px var(--c); }' +
      '.mallday b { min-width: 40px; font-weight: 500; color: var(--primary-text-color); overflow: hidden; text-overflow: ellipsis; }' +
      '.mallday span:last-child { margin-left: auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; }' +
      '.mallday .ndot, .mnext .ndot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; background: var(--c); }' +
    '</style>';
  }
}

// ── Mini card ────────────────────────────────────────────────────────────────
// The next event (or the one under way) and the one after; the detail button unfolds the full card
// and a click anywhere else on the page folds it back, like the other mini cards.
class CalendarAgendaMiniCard extends CalendarAgendaCard {
  static get mini() { return true; }

  static getConfigElement() {
    var el = CalendarAgendaCard.getConfigElement();
    el.mini = true;
    return el;
  }

  getCardSize() { return this._zoomed ? super.getCardSize() : 2; }

  getGridOptions() { return this._zoomed ? super.getGridOptions() : { columns: 6, min_columns: 6 }; }

  _compact() { return !this._zoomed; }

  _zoomButton() {
    if (this._config.zoom === false) return '';
    var z = !!this._zoomed;
    var label = ccEsc(this._t(z ? 'zoom_out' : 'zoom_in'));
    return `<button class="zoom" data-action="zoom" title="${label}" aria-label="${label}"><ha-icon icon="${z ? 'mdi:arrow-collapse' : 'mdi:arrow-expand'}"></ha-icon></button>`;
  }

  _miniHtml(days, now) {
    // Upcoming: all-day, ongoing or future events.
    var upcoming = this._flat.filter((x) => x.e.allDay || x.e.end > now);
    // All-day events under way today (school holidays, a public holiday…) get a compact line each, on top.
    var current = upcoming.filter((x) => x.e.allDay && x.e.start <= now && x.e.end > now).slice(0, 3);
    var allDayHtml = current.map((x) => {
      var last = ccAddDays(x.e.end, -1);
      var until = ccKey(last) === ccKey(now) ? this._t('all_day')
        : this._t('until').replace('{d}', this._dateFmt(last, { weekday: 'short', day: 'numeric', month: 'short' }));
      return `<div class="mallday" style="--c:${ccEsc(this._cals[x.e.cal].color)}" data-ev="${this._flat.indexOf(x)}" role="button" tabindex="0">` +
        `<span class="ndot"></span><b>${ccEsc(x.e.summary)}</b><span>${ccEsc(until)}</span></div>`;
    }).join('');
    upcoming = upcoming.filter((x) => current.indexOf(x) < 0);
    // A timed event (under way or next) comes before the day's other all-day ones.
    var first = upcoming.find((x) => !x.e.allDay) || upcoming[0];
    var second = upcoming.find((x) => x !== first && !x.e.allDay) || upcoming.find((x) => x !== first);
    var body;
    if (!first) {
      body = allDayHtml || `<div class="none big">${this._loaded ? this._t('no_upcoming') : ''}</div>`;
    } else {
      var i = this._flat.indexOf(first);
      var isToday = ccKey(first.day) === ccKey(now);
      var html = this._eventHtml(first.e, now, i, isToday);
      if (!isToday && !ccMultiDay(first.e)) {
        // A later day: its date goes in front of the time (a multi-day event already shows its dates).
        var d = ccKey(first.day) === ccKey(ccAddDays(now, 1)) ? this._t('tomorrow') : this._dateFmt(first.day, { weekday: 'short', day: 'numeric', month: 'short' });
        html = html.replace('<div class="emeta">', `<div class="emeta"><span class="when">${ccEsc(d)}</span><span class="sep">·</span>`);
      }
      body = allDayHtml + html;
      if (second) {
        var cal = this._cals[second.e.cal];
        var when = ccKey(second.day) === ccKey(now) ? this._when(second.e)
          : `${this._dateFmt(second.day, { weekday: 'short' }).replace('.', '')} ${second.e.allDay ? '' : this._timeFmt(second.e.start)}`.trim();
        body += `<div class="mnext" style="--c:${ccEsc(cal.color)}"><span>${this._t('next')}</span><span class="ndot"></span><b>${ccEsc(second.e.summary)}</b><span>${ccEsc(when)}</span></div>`;
      }
    }
    return `<ha-card class="mini${this._detail != null ? ' popped' : ''}" lang="${ccEsc(this._fmtLang())}">` +
      this._headerHtml(now, this._todaySub(days)) +
      `<div class="list">${body}</div>${this._errorHtml()}${this._popupHtml()}</ha-card>`;
  }
}

// ── Visual editor (built on HA's ha-form) ────────────────────────────────────
var CC_EDITOR_DEFAULTS = Object.assign({ zoom: true }, CC_DEFAULTS);

class CalendarAgendaCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = Object.assign({}, config);
    this._render();
  }

  set hass(hass) {
    var prevLang = this._hass?.language;
    this._hass = hass;
    if (this._form && prevLang === (hass?.language)) this._form.hass = hass;
    else this._render();
  }

  _calList() {
    return ccCalList(this._config || {});
  }

  _lang() {
    return ccLang((this._config?.language) || (this._hass?.language));
  }

  _schema() {
    var mini = this.mini || /-mini-card$/.test(this._config.type || '');
    return [
      { name: 'entities', selector: { entity: { domain: 'calendar', multiple: true } } },
      { name: 'title', selector: { text: {} } },
      {
        type: 'grid', name: '', schema: [
          { name: 'days_to_show', selector: { number: { min: 1, max: 62, mode: 'box' } } },
          { name: 'max_events', selector: { number: { min: 0, max: 100, mode: 'box' } } },
        ],
      },
      {
        type: 'grid', name: '', schema: [
          { name: 'show_header', selector: { boolean: {} } },
          { name: 'show_location', selector: { boolean: {} } },
          { name: 'show_end_time', selector: { boolean: {} } },
          { name: 'show_countdown', selector: { boolean: {} } },
          { name: 'show_empty_days', selector: { boolean: {} } },
          { name: 'show_past_events', selector: { boolean: {} } },
        ].concat(mini ? [{ name: 'zoom', selector: { boolean: {} } }] : []),
      },
      {
        name: 'language',
        selector: { select: { mode: 'dropdown', options: [{ value: 'fr', label: 'Français' }, { value: 'en', label: 'English' }, { value: 'de', label: 'Deutsch' }, { value: 'es', label: 'Español' }, { value: 'sr', label: 'Српски' }, { value: 'sr-Latn', label: 'Srpski (latinica)' }, { value: 'it', label: 'Italiano' }, { value: 'nl', label: 'Nederlands' }, { value: 'pt', label: 'Português (Portugal)' }, { value: 'pl', label: 'Polski' }, { value: 'ro', label: 'Română' }, { value: 'da', label: 'Dansk' }, { value: 'sv', label: 'Svenska' }, { value: 'bg', label: 'Български' }, { value: 'ru', label: 'Русский' }, { value: 'uk', label: 'Українська' }, { value: 'hu', label: 'Magyar' }, { value: 'ga', label: 'Gaeilge' }, { value: 'sk', label: 'Slovenčina' }, { value: 'cs', label: 'Čeština' }, { value: 'sl', label: 'Slovenščina' }, { value: 'mt', label: 'Malti' }, { value: 'lv', label: 'Latviešu' }, { value: 'el', label: 'Ελληνικά' }] } },
      },
    ];
  }

  _render() {
    if (!this._config || !this._hass) return;
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.addEventListener('value-changed', (ev) => this._valueChanged(ev));
      this.appendChild(this._form);
    }
    var lang = this._lang();
    this._form.hass = this._hass;
    this._form.schema = this._schema();
    this._form.computeLabel = (s) => ccT(lang, `ed_${s.name}`);
    this._form.computeHelper = (s) => {
      var key = `ed_${s.name}_helper`;
      var txt = ccT(lang, key);
      return txt === key ? undefined : txt;
    };
    var data = Object.assign({}, CC_EDITOR_DEFAULTS, this._config);
    // The form edits entity ids; colors and names set in YAML are kept aside. A YAML `entity:` (single
    // calendar) is shown as the list and written back as `entities`.
    data.entities = this._calList().map((e) => (typeof e === 'string' ? e : e.entity));
    delete data.entity;
    this._form.data = data;
  }

  _valueChanged(ev) {
    ev.stopPropagation();
    var value = Object.assign({}, ev.detail.value);
    Object.keys(value).forEach((key) => {
      if (value[key] === '' || value[key] === null || value[key] === undefined) delete value[key];
    });
    Object.keys(CC_EDITOR_DEFAULTS).forEach((key) => {
      if (value[key] === CC_EDITOR_DEFAULTS[key]) delete value[key];
    });
    // Put back the YAML settings (color, name) of the calendars still listed.
    var prev = {};
    this._calList().forEach((e) => { if (typeof e === 'object' && e) prev[e.entity] = e; });
    // `entities` replaces a YAML `entity:` (an empty list would otherwise hide it from ccCalendars).
    delete value.entity;
    if (value.entities) value.entities = value.entities.map((id) => prev[id] || id);
    if (this._config.exclude) value.exclude = this._config.exclude;
    if (this._config.type) value = Object.assign({ type: this._config.type }, value);
    var lang = this._lang();
    this._config = value;
    if (lang !== this._lang()) this._render();
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: value }, bubbles: true, composed: true }));
  }
}

if (!customElements.get('calendar-agenda-card-editor')) {
  customElements.define('calendar-agenda-card-editor', CalendarAgendaCardEditor);
}

window.customCards = window.customCards || [];
[
  ['calendar-agenda-card', CalendarAgendaCard, 'Calendar Agenda Card', 'Agenda of one or more Home Assistant calendars, grouped by day'],
  ['calendar-agenda-mini-card', CalendarAgendaMiniCard, 'Calendar Agenda Mini Card', 'Next event and the one after, unfolds into the full agenda'],
].forEach(([type, cls, name, description]) => {
  if (customElements.get(type)) return;
  customElements.define(type, cls);
  window.customCards.push({ type, name, description, preview: true, documentationURL: 'https://github.com/juju35/ha-calendar-card' });
});

console.info(`%c CALENDAR-CARD %c v${CALENDAR_CARD_VERSION} `, 'color:#fff;background:#039be5;font-weight:700', 'color:#039be5;background:#fff');

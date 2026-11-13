var CALENDAR_CARD_VERSION = '__VERSION__';

// ── i18n ──────────────────────────────────────────────────────────────────────
var CcI18n = {
  fr: {
    agenda: 'Agenda',
    today: 'Aujourd\'hui',
    prev_week: 'Semaine précédente',
    next_week: 'Semaine suivante',
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
    add_event: 'Nouvel événement',
    ev_title: 'Titre',
    ev_calendar: 'Calendrier',
    ev_start: 'Début',
    ev_end: 'Fin',
    ev_location: 'Lieu',
    ev_description: 'Description',
    ev_add: 'Ajouter',
    ev_cancel: 'Annuler',
    ev_need_title: 'Donnez un titre à l\'événement',
    ev_bad_end: 'La fin doit être après le début',
    ev_bad_when: 'Indiquez la date et les heures',
    ev_failed: 'Impossible d\'ajouter l\'événement : {e}',
    edit_event: 'Modifier l\'événement',
    delete_event: 'Supprimer l\'événement',
    ev_save: 'Enregistrer',
    ev_delete: 'Supprimer',
    ev_delete_confirm: 'Supprimer cet événement ?',
    ev_this: 'Cet événement',
    ev_future: 'Cet événement et les suivants',
    ev_apply_to: 'Appliquer les modifications à',
    ev_save_failed: 'Impossible d\'enregistrer l\'événement : {e}',
    ev_delete_failed: 'Impossible de supprimer l\'événement : {e}',
    ed_add_button: 'Bouton d\'ajout',
    ed_add_button_helper: 'Bouton + dans l\'en-tête pour ajouter un événement à un calendrier qui l\'accepte',
    ed_edit_buttons: 'Boutons de modification et de suppression',
    ed_edit_buttons_helper: 'Boutons dans le détail d\'un événement pour le modifier ou le supprimer, sur un calendrier qui le permet',
    ed_entities: 'Calendriers',
    ed_entities_helper: 'Couleurs et libellés par calendrier : en YAML (voir le README)',
    ed_title: 'Titre',
    ed_title_helper: 'Laisser vide pour « Agenda »',
    ed_days_to_show: 'Jours affichés',
    ed_view: 'Vue',
    ed_view_helper: 'Semaine : 7 jours côte à côte à partir d\'aujourd\'hui (liste sur une carte étroite)',
    view_agenda: 'Liste',
    view_week: 'Semaine',
    ed_max_events: 'Événements avant « de plus »',
    ed_max_events_helper: '0 pour tout afficher',
    ed_show_header: 'En-tête',
    ed_show_title: 'Afficher le titre',
    ed_show_location: 'Lieu',
    ed_show_end_time: 'Heure de fin',
    ed_show_countdown: 'Compte à rebours',
    ed_show_empty_days: 'Jours sans événement',
    ed_show_past_events: 'Événements terminés du jour',
    ed_exclude: 'Événements masqués',
    ed_exclude_helper: 'Masque les événements dont le titre contient l\'un de ces textes (sans tenir compte de la casse)',
    ed_zoom: 'Bouton détail',
    ed_zoom_helper: 'Bouton en haut à droite qui passe la mini-carte en carte complète et inversement',
    ed_language: 'Langue',
    ed_language_helper: 'Laisser vide pour suivre la langue de Home Assistant',
    workday: 'Jour ouvré',
    day_off: 'Jour non ouvré',
    school_holidays: 'Vacances scolaires',
    todo_done: 'Marquer comme fait',
    todo_empty: 'Rien à faire',
    ed_todo_entities: 'Listes de tâches',
    ed_todo_entities_helper: 'Éléments à faire de ces listes (Bring!, liste locale…), cochés depuis la carte',
    ed_workday_entity: 'Capteur de jours ouvrés',
    ed_workday_entity_helper: 'Badge jour ouvré ou non ouvré dans l\'en-tête ; trouvé tout seul quand l\'intégration Workday est configurée',
    ed_school_holidays_calendar: 'Calendrier des vacances scolaires',
    ed_school_holidays_calendar_helper: 'Ses événements marquent les jours qu\'ils couvrent, sans être listés (Remote Calendar…)',
  },
  en: {
    agenda: 'Agenda',
    today: 'Today',
    prev_week: 'Previous week',
    next_week: 'Next week',
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
    add_event: 'New event',
    ev_title: 'Title',
    ev_calendar: 'Calendar',
    ev_start: 'Start',
    ev_end: 'End',
    ev_location: 'Location',
    ev_description: 'Description',
    ev_add: 'Add',
    ev_cancel: 'Cancel',
    ev_need_title: 'Give the event a title',
    ev_bad_end: 'The end must be after the start',
    ev_bad_when: 'Enter the date and times',
    ev_failed: 'Could not add the event: {e}',
    edit_event: 'Edit event',
    delete_event: 'Delete event',
    ev_save: 'Save',
    ev_delete: 'Delete',
    ev_delete_confirm: 'Delete this event?',
    ev_this: 'This event',
    ev_future: 'This and following events',
    ev_apply_to: 'Apply the changes to',
    ev_save_failed: 'Could not save the event: {e}',
    ev_delete_failed: 'Could not delete the event: {e}',
    ed_add_button: 'Add button',
    ed_add_button_helper: '+ button in the header to add an event to a calendar that accepts it',
    ed_edit_buttons: 'Edit and delete buttons',
    ed_edit_buttons_helper: 'Buttons in the event details to edit or delete an event of a calendar that allows it',
    ed_entities: 'Calendars',
    ed_entities_helper: 'Colors and labels per calendar: in YAML (see the README)',
    ed_title: 'Title',
    ed_title_helper: 'Leave empty for "Agenda"',
    ed_days_to_show: 'Days shown',
    ed_view: 'View',
    ed_view_helper: 'Week: 7 days side by side from today (a list on a narrow card)',
    view_agenda: 'Agenda',
    view_week: 'Week',
    ed_max_events: 'Events before "more"',
    ed_max_events_helper: '0 to show everything',
    ed_show_header: 'Header',
    ed_show_title: 'Show title',
    ed_show_location: 'Location',
    ed_show_end_time: 'End time',
    ed_show_countdown: 'Countdown',
    ed_show_empty_days: 'Days without events',
    ed_show_past_events: 'Today\'s finished events',
    ed_exclude: 'Hidden events',
    ed_exclude_helper: 'Hides events whose title contains one of these texts (case-insensitive)',
    ed_zoom: 'Detail button',
    ed_zoom_helper: 'Button at the top right that switches the mini card to the full card and back',
    ed_language: 'Language',
    ed_language_helper: 'Leave empty to follow the Home Assistant language',
    workday: 'Working day',
    day_off: 'Day off',
    school_holidays: 'School holidays',
    todo_done: 'Mark as done',
    todo_empty: 'Nothing to do',
    ed_todo_entities: 'To-do lists',
    ed_todo_entities_helper: 'Open items of these lists (Bring!, Local To-do…), checked off from the card',
    ed_workday_entity: 'Workday sensor',
    ed_workday_entity_helper: 'Working day or day off badge in the header; found by itself when the Workday integration is set up',
    ed_school_holidays_calendar: 'School holidays calendar',
    ed_school_holidays_calendar_helper: 'Its events mark the days they cover, without being listed (Remote Calendar…)',
  },
  de: {
    agenda: 'Termine',
    today: 'Heute',
    prev_week: 'Vorherige Woche',
    next_week: 'Nächste Woche',
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
    add_event: 'Neuer Termin',
    ev_title: 'Titel',
    ev_calendar: 'Kalender',
    ev_start: 'Beginn',
    ev_end: 'Ende',
    ev_location: 'Ort',
    ev_description: 'Beschreibung',
    ev_add: 'Hinzufügen',
    ev_cancel: 'Abbrechen',
    ev_need_title: 'Gib dem Termin einen Titel',
    ev_bad_end: 'Das Ende muss nach dem Beginn liegen',
    ev_bad_when: 'Gib das Datum und die Uhrzeiten ein',
    ev_failed: 'Termin konnte nicht hinzugefügt werden: {e}',
    edit_event: 'Termin bearbeiten',
    delete_event: 'Termin löschen',
    ev_save: 'Speichern',
    ev_delete: 'Löschen',
    ev_delete_confirm: 'Diesen Termin löschen?',
    ev_this: 'Dieser Termin',
    ev_future: 'Dieser und alle folgenden Termine',
    ev_apply_to: 'Änderungen anwenden auf',
    ev_save_failed: 'Termin konnte nicht gespeichert werden: {e}',
    ev_delete_failed: 'Termin konnte nicht gelöscht werden: {e}',
    ed_add_button: 'Hinzufügen-Schaltfläche',
    ed_add_button_helper: '+-Schaltfläche in der Kopfzeile, um einem Kalender, der es erlaubt, einen Termin hinzuzufügen',
    ed_edit_buttons: 'Schaltflächen Bearbeiten und Löschen',
    ed_edit_buttons_helper: 'Schaltflächen in den Termindetails, um einen Termin eines Kalenders, der es erlaubt, zu bearbeiten oder zu löschen',
    ed_entities: 'Kalender',
    ed_entities_helper: 'Farben und Namen pro Kalender: in YAML (siehe README)',
    ed_title: 'Titel',
    ed_title_helper: 'Leer lassen für „Termine“',
    ed_days_to_show: 'Angezeigte Tage',
    ed_view: 'Ansicht',
    ed_view_helper: 'Woche: 7 Tage nebeneinander ab heute (Liste auf einer schmalen Karte)',
    view_agenda: 'Agenda',
    view_week: 'Woche',
    ed_max_events: 'Termine vor „weitere“',
    ed_max_events_helper: '0, um alles anzuzeigen',
    ed_show_header: 'Kopfzeile',
    ed_show_title: 'Titel anzeigen',
    ed_show_location: 'Ort',
    ed_show_end_time: 'Endzeit',
    ed_show_countdown: 'Countdown',
    ed_show_empty_days: 'Tage ohne Termine',
    ed_show_past_events: 'Heute beendete Termine',
    ed_exclude: 'Ausgeblendete Termine',
    ed_exclude_helper: 'Blendet Termine aus, deren Titel einen dieser Texte enthält (ohne Groß-/Kleinschreibung)',
    ed_zoom: 'Detail-Schaltfläche',
    ed_zoom_helper: 'Schaltfläche oben rechts, die die Mini-Karte zur vollständigen Karte aufklappt und zurück',
    ed_language: 'Sprache',
    ed_language_helper: 'Leer lassen, um der Sprache von Home Assistant zu folgen',
    workday: 'Arbeitstag',
    day_off: 'Freier Tag',
    school_holidays: 'Schulferien',
    todo_done: 'Als erledigt markieren',
    todo_empty: 'Nichts zu tun',
    ed_todo_entities: 'Aufgabenlisten',
    ed_todo_entities_helper: 'Offene Einträge dieser Listen (Bring!, lokale Liste…), in der Karte abhakbar',
    ed_workday_entity: 'Arbeitstag-Sensor',
    ed_workday_entity_helper: 'Abzeichen Arbeitstag oder freier Tag in der Kopfzeile; automatisch gefunden, wenn die Workday-Integration eingerichtet ist',
    ed_school_holidays_calendar: 'Schulferien-Kalender',
    ed_school_holidays_calendar_helper: 'Seine Termine markieren die Tage, die sie abdecken, ohne aufgelistet zu werden (Remote Calendar…)',
  },
  es: {
    agenda: 'Agenda',
    today: 'Hoy',
    prev_week: 'Semana anterior',
    next_week: 'Semana siguiente',
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
    add_event: 'Nuevo evento',
    ev_title: 'Título',
    ev_calendar: 'Calendario',
    ev_start: 'Inicio',
    ev_end: 'Fin',
    ev_location: 'Lugar',
    ev_description: 'Descripción',
    ev_add: 'Añadir',
    ev_cancel: 'Cancelar',
    ev_need_title: 'Pon un título al evento',
    ev_bad_end: 'El fin debe ser posterior al inicio',
    ev_bad_when: 'Indica la fecha y las horas',
    ev_failed: 'No se pudo añadir el evento: {e}',
    edit_event: 'Editar evento',
    delete_event: 'Eliminar evento',
    ev_save: 'Guardar',
    ev_delete: 'Eliminar',
    ev_delete_confirm: '¿Eliminar este evento?',
    ev_this: 'Este evento',
    ev_future: 'Este y los siguientes eventos',
    ev_apply_to: 'Aplicar los cambios a',
    ev_save_failed: 'No se pudo guardar el evento: {e}',
    ev_delete_failed: 'No se pudo eliminar el evento: {e}',
    ed_add_button: 'Botón de añadir',
    ed_add_button_helper: 'Botón + en la cabecera para añadir un evento a un calendario que lo admita',
    ed_edit_buttons: 'Botones de editar y eliminar',
    ed_edit_buttons_helper: 'Botones en los detalles del evento para editar o eliminar un evento de un calendario que lo admita',
    ed_entities: 'Calendarios',
    ed_entities_helper: 'Colores y nombres por calendario: en YAML (consulta el README)',
    ed_title: 'Título',
    ed_title_helper: 'Déjalo vacío para «Agenda»',
    ed_days_to_show: 'Días mostrados',
    ed_view: 'Vista',
    ed_view_helper: 'Semana: 7 días uno al lado del otro desde hoy (lista en una tarjeta estrecha)',
    view_agenda: 'Agenda',
    view_week: 'Semana',
    ed_max_events: 'Eventos antes de «más»',
    ed_max_events_helper: '0 para mostrarlo todo',
    ed_show_header: 'Encabezado',
    ed_show_title: 'Mostrar el título',
    ed_show_location: 'Ubicación',
    ed_show_end_time: 'Hora de fin',
    ed_show_countdown: 'Cuenta atrás',
    ed_show_empty_days: 'Días sin eventos',
    ed_show_past_events: 'Eventos de hoy ya terminados',
    ed_exclude: 'Eventos ocultos',
    ed_exclude_helper: 'Oculta los eventos cuyo título contiene uno de estos textos (sin distinguir mayúsculas)',
    ed_zoom: 'Botón de detalle',
    ed_zoom_helper: 'Botón arriba a la derecha que despliega la minitarjeta en tarjeta completa y viceversa',
    ed_language: 'Idioma',
    ed_language_helper: 'Déjalo vacío para usar el idioma de Home Assistant',
    workday: 'Día laborable',
    day_off: 'Día libre',
    school_holidays: 'Vacaciones escolares',
    todo_done: 'Marcar como hecho',
    todo_empty: 'Nada pendiente',
    ed_todo_entities: 'Listas de tareas',
    ed_todo_entities_helper: 'Elementos pendientes de estas listas (Bring!, lista local…), marcados desde la tarjeta',
    ed_workday_entity: 'Sensor de días laborables',
    ed_workday_entity_helper: 'Insignia de día laborable o libre en la cabecera; se encuentra solo cuando la integración Workday está configurada',
    ed_school_holidays_calendar: 'Calendario de vacaciones escolares',
    ed_school_holidays_calendar_helper: 'Sus eventos marcan los días que cubren, sin listarse (Remote Calendar…)',
  },
  sr: {
    agenda: 'Агенда',
    today: 'Данас',
    prev_week: 'Претходна недеља',
    next_week: 'Следећа недеља',
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
    add_event: 'Нови догађај',
    ev_title: 'Наслов',
    ev_calendar: 'Календар',
    ev_start: 'Почетак',
    ev_end: 'Крај',
    ev_location: 'Место',
    ev_description: 'Опис',
    ev_add: 'Додај',
    ev_cancel: 'Откажи',
    ev_need_title: 'Дајте наслов догађају',
    ev_bad_end: 'Крај мора бити после почетка',
    ev_bad_when: 'Унесите датум и време',
    ev_failed: 'Догађај није могао да се дода: {e}',
    edit_event: 'Измени догађај',
    delete_event: 'Обриши догађај',
    ev_save: 'Сачувај',
    ev_delete: 'Обриши',
    ev_delete_confirm: 'Обрисати овај догађај?',
    ev_this: 'Овај догађај',
    ev_future: 'Овај и следећи догађаји',
    ev_apply_to: 'Примени измене на',
    ev_save_failed: 'Није могуће сачувати догађај: {e}',
    ev_delete_failed: 'Није могуће обрисати догађај: {e}',
    ed_add_button: 'Дугме за додавање',
    ed_add_button_helper: 'Дугме + у заглављу за додавање догађаја у календар који то дозвољава',
    ed_edit_buttons: 'Дугмад за измену и брисање',
    ed_edit_buttons_helper: 'Дугмад у детаљима догађаја за измену или брисање догађаја у календару који то дозвољава',
    ed_entities: 'Календари',
    ed_entities_helper: 'Боје и ознаке по календару: у YAML-у (погледајте README)',
    ed_title: 'Наслов',
    ed_title_helper: 'Оставите празно за „Агенда“',
    ed_days_to_show: 'Број приказаних дана',
    ed_view: 'Приказ',
    ed_view_helper: 'Недеља: 7 дана један поред другог од данас (листа на уској картици)',
    view_agenda: 'Агенда',
    view_week: 'Недеља',
    ed_max_events: 'Догађаји пре „још“',
    ed_max_events_helper: '0 за приказ свих догађаја',
    ed_show_header: 'Заглавље',
    ed_show_title: 'Прикажи наслов',
    ed_show_location: 'Локација',
    ed_show_end_time: 'Време завршетка',
    ed_show_countdown: 'Одбројавање',
    ed_show_empty_days: 'Дани без догађаја',
    ed_show_past_events: 'Завршени догађаји за данас',
    ed_exclude: 'Скривени догађаји',
    ed_exclude_helper: 'Скрива догађаје чији наслов садржи један од ових текстова (без обзира на велика и мала слова)',
    ed_zoom: 'Дугме за детаље',
    ed_zoom_helper: 'Дугме у горњем десном углу које пребацује мини картицу на пуну картицу и назад',
    ed_language: 'Језик',
    ed_language_helper: 'Оставите празно да прати језик Home Assistant-а',
    workday: 'Радни дан',
    day_off: 'Слободан дан',
    school_holidays: 'Школски распуст',
    todo_done: 'Означи као урађено',
    todo_empty: 'Нема обавеза',
    ed_todo_entities: 'Листе задатака',
    ed_todo_entities_helper: 'Отворене ставке ових листа, штиклиране из картице',
    ed_workday_entity: 'Сензор радних дана',
    ed_workday_entity_helper: 'Ознака радног или слободног дана у заглављу; проналази се сам када је интеграција радних дана подешена',
    ed_school_holidays_calendar: 'Календар школских распуста',
    ed_school_holidays_calendar_helper: 'Његови догађаји означавају дане које покривају, без приказа на листи',
  },
  'sr-Latn': {
    agenda: 'Agenda',
    today: 'Danas',
    prev_week: 'Prethodna nedelja',
    next_week: 'Sledeća nedelja',
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
    add_event: 'Novi događaj',
    ev_title: 'Naslov',
    ev_calendar: 'Kalendar',
    ev_start: 'Početak',
    ev_end: 'Kraj',
    ev_location: 'Mesto',
    ev_description: 'Opis',
    ev_add: 'Dodaj',
    ev_cancel: 'Otkaži',
    ev_need_title: 'Dajte naslov događaju',
    ev_bad_end: 'Kraj mora biti posle početka',
    ev_bad_when: 'Unesite datum i vreme',
    ev_failed: 'Događaj nije mogao da se doda: {e}',
    edit_event: 'Izmeni događaj',
    delete_event: 'Obriši događaj',
    ev_save: 'Sačuvaj',
    ev_delete: 'Obriši',
    ev_delete_confirm: 'Obrisati ovaj događaj?',
    ev_this: 'Ovaj događaj',
    ev_future: 'Ovaj i sledeći događaji',
    ev_apply_to: 'Primeni izmene na',
    ev_save_failed: 'Nije moguće sačuvati događaj: {e}',
    ev_delete_failed: 'Nije moguće obrisati događaj: {e}',
    ed_add_button: 'Dugme za dodavanje',
    ed_add_button_helper: 'Dugme + u zaglavlju za dodavanje događaja u kalendar koji to dozvoljava',
    ed_edit_buttons: 'Dugmad za izmenu i brisanje',
    ed_edit_buttons_helper: 'Dugmad u detaljima događaja za izmenu ili brisanje događaja u kalendaru koji to dozvoljava',
    ed_entities: 'Kalendari',
    ed_entities_helper: 'Boje i oznake po kalendaru: u YAML-u (pogledajte README)',
    ed_title: 'Naslov',
    ed_title_helper: 'Ostavite prazno za „Agenda“',
    ed_days_to_show: 'Broj prikazanih dana',
    ed_view: 'Prikaz',
    ed_view_helper: 'Nedelja: 7 dana jedan pored drugog od danas (lista na uskoj kartici)',
    view_agenda: 'Agenda',
    view_week: 'Nedelja',
    ed_max_events: 'Događaji pre „još“',
    ed_max_events_helper: '0 za prikaz svih događaja',
    ed_show_header: 'Zaglavlje',
    ed_show_title: 'Prikaži naslov',
    ed_show_location: 'Lokacija',
    ed_show_end_time: 'Vreme završetka',
    ed_show_countdown: 'Odbrojavanje',
    ed_show_empty_days: 'Dani bez događaja',
    ed_show_past_events: 'Završeni događaji za danas',
    ed_exclude: 'Skriveni događaji',
    ed_exclude_helper: 'Skriva događaje čiji naslov sadrži jedan od ovih tekstova (bez obzira na velika i mala slova)',
    ed_zoom: 'Dugme za detalje',
    ed_zoom_helper: 'Dugme u gornjem desnom uglu koje prebacuje mini karticu na punu karticu i nazad',
    ed_language: 'Jezik',
    ed_language_helper: 'Ostavite prazno da prati jezik Home Assistant-a',
    workday: 'Radni dan',
    day_off: 'Slobodan dan',
    school_holidays: 'Školski raspust',
    todo_done: 'Označi kao urađeno',
    todo_empty: 'Nema obaveza',
    ed_todo_entities: 'Liste zadataka',
    ed_todo_entities_helper: 'Otvorene stavke ovih lista (Bring!, lokalna lista…), štiklirane iz kartice',
    ed_workday_entity: 'Senzor radnih dana',
    ed_workday_entity_helper: 'Oznaka radnog ili slobodnog dana u zaglavlju; pronalazi se sam kada je integracija Workday podešena',
    ed_school_holidays_calendar: 'Kalendar školskih raspusta',
    ed_school_holidays_calendar_helper: 'Njegovi događaji označavaju dane koje pokrivaju, bez prikaza na listi (Remote Calendar…)',
  },
  it: {
    agenda: 'Agenda',
    today: 'Oggi',
    prev_week: 'Settimana precedente',
    next_week: 'Settimana successiva',
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
    add_event: 'Nuovo evento',
    ev_title: 'Titolo',
    ev_calendar: 'Calendario',
    ev_start: 'Inizio',
    ev_end: 'Fine',
    ev_location: 'Luogo',
    ev_description: 'Descrizione',
    ev_add: 'Aggiungi',
    ev_cancel: 'Annulla',
    ev_need_title: 'Dai un titolo all\'evento',
    ev_bad_end: 'La fine deve essere dopo l\'inizio',
    ev_bad_when: 'Inserisci la data e gli orari',
    ev_failed: 'Impossibile aggiungere l\'evento: {e}',
    edit_event: 'Modifica evento',
    delete_event: 'Elimina evento',
    ev_save: 'Salva',
    ev_delete: 'Elimina',
    ev_delete_confirm: 'Eliminare questo evento?',
    ev_this: 'Questo evento',
    ev_future: 'Questo evento e i successivi',
    ev_apply_to: 'Applica le modifiche a',
    ev_save_failed: 'Impossibile salvare l\'evento: {e}',
    ev_delete_failed: 'Impossibile eliminare l\'evento: {e}',
    ed_add_button: 'Pulsante di aggiunta',
    ed_add_button_helper: 'Pulsante + nell\'intestazione per aggiungere un evento a un calendario che lo consente',
    ed_edit_buttons: 'Pulsanti di modifica ed eliminazione',
    ed_edit_buttons_helper: 'Pulsanti nei dettagli dell\'evento per modificare o eliminare un evento di un calendario che lo consente',
    ed_entities: 'Calendari',
    ed_entities_helper: 'Colori ed etichette per calendario: in YAML (vedi il README)',
    ed_title: 'Titolo',
    ed_title_helper: 'Lascia vuoto per «Agenda»',
    ed_days_to_show: 'Giorni mostrati',
    ed_view: 'Vista',
    ed_view_helper: 'Settimana: 7 giorni affiancati da oggi (elenco su una scheda stretta)',
    view_agenda: 'Agenda',
    view_week: 'Settimana',
    ed_max_events: 'Eventi prima di «altri»',
    ed_max_events_helper: '0 per mostrare tutto',
    ed_show_header: 'Intestazione',
    ed_show_title: 'Mostra il titolo',
    ed_show_location: 'Luogo',
    ed_show_end_time: 'Ora di fine',
    ed_show_countdown: 'Conto alla rovescia',
    ed_show_empty_days: 'Giorni senza eventi',
    ed_show_past_events: 'Eventi di oggi già terminati',
    ed_exclude: 'Eventi nascosti',
    ed_exclude_helper: 'Nasconde gli eventi il cui titolo contiene uno di questi testi (senza distinzione tra maiuscole e minuscole)',
    ed_zoom: 'Pulsante dettagli',
    ed_zoom_helper: 'Pulsante in alto a destra che passa dalla mini scheda alla scheda completa e viceversa',
    ed_language: 'Lingua',
    ed_language_helper: 'Lascia vuoto per seguire la lingua di Home Assistant',
    workday: 'Giorno lavorativo',
    day_off: 'Giorno libero',
    school_holidays: 'Vacanze scolastiche',
    todo_done: 'Segna come fatto',
    todo_empty: 'Niente da fare',
    ed_todo_entities: 'Liste di cose da fare',
    ed_todo_entities_helper: 'Elementi aperti di queste liste (Bring!, lista locale…), spuntati dalla scheda',
    ed_workday_entity: 'Sensore giorni lavorativi',
    ed_workday_entity_helper: 'Badge giorno lavorativo o libero nell\'intestazione; trovato da solo quando l\'integrazione Workday è configurata',
    ed_school_holidays_calendar: 'Calendario delle vacanze scolastiche',
    ed_school_holidays_calendar_helper: 'I suoi eventi segnano i giorni che coprono, senza essere elencati (Remote Calendar…)',
  },
  nl: {
    agenda: 'Agenda',
    today: 'Vandaag',
    prev_week: 'Vorige week',
    next_week: 'Volgende week',
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
    add_event: 'Nieuwe afspraak',
    ev_title: 'Titel',
    ev_calendar: 'Agenda',
    ev_start: 'Begin',
    ev_end: 'Einde',
    ev_location: 'Locatie',
    ev_description: 'Beschrijving',
    ev_add: 'Toevoegen',
    ev_cancel: 'Annuleren',
    ev_need_title: 'Geef de afspraak een titel',
    ev_bad_end: 'Het einde moet na het begin liggen',
    ev_bad_when: 'Vul de datum en de tijden in',
    ev_failed: 'Afspraak kon niet worden toegevoegd: {e}',
    edit_event: 'Afspraak bewerken',
    delete_event: 'Afspraak verwijderen',
    ev_save: 'Opslaan',
    ev_delete: 'Verwijderen',
    ev_delete_confirm: 'Deze afspraak verwijderen?',
    ev_this: 'Deze afspraak',
    ev_future: 'Deze en volgende afspraken',
    ev_apply_to: 'Wijzigingen toepassen op',
    ev_save_failed: 'Kan de afspraak niet opslaan: {e}',
    ev_delete_failed: 'Kan de afspraak niet verwijderen: {e}',
    ed_add_button: 'Knop toevoegen',
    ed_add_button_helper: '+-knop in de kop om een afspraak toe te voegen aan een agenda die dat toestaat',
    ed_edit_buttons: 'Knoppen bewerken en verwijderen',
    ed_edit_buttons_helper: 'Knoppen in de details van een afspraak om een afspraak te bewerken of te verwijderen in een agenda die dat toestaat',
    ed_entities: 'Agenda\'s',
    ed_entities_helper: 'Kleuren en labels per agenda: in YAML (zie de README)',
    ed_title: 'Titel',
    ed_title_helper: 'Leeg laten voor ‘Agenda’',
    ed_days_to_show: 'Getoonde dagen',
    ed_view: 'Weergave',
    ed_view_helper: 'Week: 7 dagen naast elkaar vanaf vandaag (lijst op een smalle kaart)',
    view_agenda: 'Agenda',
    view_week: 'Week',
    ed_max_events: 'Afspraken vóór ‘nog’',
    ed_max_events_helper: '0 om alles te tonen',
    ed_show_header: 'Koptekst',
    ed_show_title: 'Titel tonen',
    ed_show_location: 'Locatie',
    ed_show_end_time: 'Eindtijd',
    ed_show_countdown: 'Aftellen',
    ed_show_empty_days: 'Dagen zonder afspraken',
    ed_show_past_events: 'Afgelopen afspraken van vandaag',
    ed_exclude: 'Verborgen afspraken',
    ed_exclude_helper: 'Verbergt afspraken waarvan de titel een van deze teksten bevat (hoofdletterongevoelig)',
    ed_zoom: 'Detailknop',
    ed_zoom_helper: 'Knop rechtsboven die de minikaart uitklapt tot de volledige kaart en terug',
    ed_language: 'Taal',
    ed_language_helper: 'Leeg laten om de taal van Home Assistant te volgen',
    workday: 'Werkdag',
    day_off: 'Vrije dag',
    school_holidays: 'Schoolvakantie',
    todo_done: 'Markeren als gedaan',
    todo_empty: 'Niets te doen',
    ed_todo_entities: 'Takenlijsten',
    ed_todo_entities_helper: 'Open items van deze lijsten (Bring!, lokale lijst…), af te vinken vanuit de kaart',
    ed_workday_entity: 'Werkdagsensor',
    ed_workday_entity_helper: 'Badge werkdag of vrije dag in de kop; vanzelf gevonden als de Workday-integratie is ingesteld',
    ed_school_holidays_calendar: 'Schoolvakantiekalender',
    ed_school_holidays_calendar_helper: 'De afspraken markeren de dagen die ze beslaan, zonder in de lijst te staan (Remote Calendar…)',
  },
  pt: {
    agenda: 'Agenda',
    today: 'Hoje',
    prev_week: 'Semana anterior',
    next_week: 'Semana seguinte',
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
    add_event: 'Novo evento',
    ev_title: 'Título',
    ev_calendar: 'Calendário',
    ev_start: 'Início',
    ev_end: 'Fim',
    ev_location: 'Local',
    ev_description: 'Descrição',
    ev_add: 'Adicionar',
    ev_cancel: 'Cancelar',
    ev_need_title: 'Dê um título ao evento',
    ev_bad_end: 'O fim tem de ser depois do início',
    ev_bad_when: 'Indique a data e as horas',
    ev_failed: 'Não foi possível adicionar o evento: {e}',
    edit_event: 'Editar evento',
    delete_event: 'Eliminar evento',
    ev_save: 'Guardar',
    ev_delete: 'Eliminar',
    ev_delete_confirm: 'Eliminar este evento?',
    ev_this: 'Este evento',
    ev_future: 'Este e os eventos seguintes',
    ev_apply_to: 'Aplicar as alterações a',
    ev_save_failed: 'Não foi possível guardar o evento: {e}',
    ev_delete_failed: 'Não foi possível eliminar o evento: {e}',
    ed_add_button: 'Botão de adicionar',
    ed_add_button_helper: 'Botão + no cabeçalho para adicionar um evento a um calendário que o aceite',
    ed_edit_buttons: 'Botões de editar e eliminar',
    ed_edit_buttons_helper: 'Botões nos detalhes do evento para editar ou eliminar um evento de um calendário que o permita',
    ed_entities: 'Calendários',
    ed_entities_helper: 'Cores e etiquetas por calendário: em YAML (ver o README)',
    ed_title: 'Título',
    ed_title_helper: 'Deixar vazio para «Agenda»',
    ed_days_to_show: 'Dias mostrados',
    ed_view: 'Vista',
    ed_view_helper: 'Semana: 7 dias lado a lado a partir de hoje (lista num cartão estreito)',
    view_agenda: 'Agenda',
    view_week: 'Semana',
    ed_max_events: 'Eventos antes de «mais»',
    ed_max_events_helper: '0 para mostrar tudo',
    ed_show_header: 'Cabeçalho',
    ed_show_title: 'Mostrar o título',
    ed_show_location: 'Local',
    ed_show_end_time: 'Hora de fim',
    ed_show_countdown: 'Contagem decrescente',
    ed_show_empty_days: 'Dias sem eventos',
    ed_show_past_events: 'Eventos de hoje já terminados',
    ed_exclude: 'Eventos ocultos',
    ed_exclude_helper: 'Oculta os eventos cujo título contém um destes textos (sem distinguir maiúsculas)',
    ed_zoom: 'Botão de detalhe',
    ed_zoom_helper: 'Botão no canto superior direito que alterna entre o mini cartão e o cartão completo',
    ed_language: 'Idioma',
    ed_language_helper: 'Deixar vazio para seguir o idioma do Home Assistant',
    workday: 'Dia útil',
    day_off: 'Dia de folga',
    school_holidays: 'Férias escolares',
    todo_done: 'Marcar como feito',
    todo_empty: 'Nada a fazer',
    ed_todo_entities: 'Listas de tarefas',
    ed_todo_entities_helper: 'Itens por fazer destas listas (Bring!, lista local…), marcados a partir do cartão',
    ed_workday_entity: 'Sensor de dias úteis',
    ed_workday_entity_helper: 'Distintivo de dia útil ou de folga no cabeçalho; encontrado sozinho quando a integração Workday está configurada',
    ed_school_holidays_calendar: 'Calendário das férias escolares',
    ed_school_holidays_calendar_helper: 'Os seus eventos marcam os dias que abrangem, sem serem listados (Remote Calendar…)',
  },
  pl: {
    agenda: 'Terminarz',
    today: 'Dzisiaj',
    prev_week: 'Poprzedni tydzień',
    next_week: 'Następny tydzień',
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
    add_event: 'Nowe wydarzenie',
    ev_title: 'Tytuł',
    ev_calendar: 'Kalendarz',
    ev_start: 'Początek',
    ev_end: 'Koniec',
    ev_location: 'Miejsce',
    ev_description: 'Opis',
    ev_add: 'Dodaj',
    ev_cancel: 'Anuluj',
    ev_need_title: 'Nadaj wydarzeniu tytuł',
    ev_bad_end: 'Koniec musi być po początku',
    ev_bad_when: 'Podaj datę i godziny',
    ev_failed: 'Nie udało się dodać wydarzenia: {e}',
    edit_event: 'Edytuj wydarzenie',
    delete_event: 'Usuń wydarzenie',
    ev_save: 'Zapisz',
    ev_delete: 'Usuń',
    ev_delete_confirm: 'Usunąć to wydarzenie?',
    ev_this: 'To wydarzenie',
    ev_future: 'To i następne wydarzenia',
    ev_apply_to: 'Zastosuj zmiany do',
    ev_save_failed: 'Nie udało się zapisać wydarzenia: {e}',
    ev_delete_failed: 'Nie udało się usunąć wydarzenia: {e}',
    ed_add_button: 'Przycisk dodawania',
    ed_add_button_helper: 'Przycisk + w nagłówku do dodawania wydarzenia do kalendarza, który na to pozwala',
    ed_edit_buttons: 'Przyciski edycji i usuwania',
    ed_edit_buttons_helper: 'Przyciski w szczegółach wydarzenia do edycji lub usuwania wydarzenia z kalendarza, który na to pozwala',
    ed_entities: 'Kalendarze',
    ed_entities_helper: 'Kolory i etykiety dla każdego kalendarza: w YAML (zobacz README)',
    ed_title: 'Tytuł',
    ed_title_helper: 'Pozostaw puste dla „Terminarz”',
    ed_days_to_show: 'Wyświetlane dni',
    ed_view: 'Widok',
    ed_view_helper: 'Tydzień: 7 dni obok siebie od dziś (lista na wąskiej karcie)',
    view_agenda: 'Agenda',
    view_week: 'Tydzień',
    ed_max_events: 'Wydarzenia przed „Więcej”',
    ed_max_events_helper: '0, aby pokazać wszystko',
    ed_show_header: 'Nagłówek',
    ed_show_title: 'Pokaż tytuł',
    ed_show_location: 'Lokalizacja',
    ed_show_end_time: 'Godzina zakończenia',
    ed_show_countdown: 'Odliczanie',
    ed_show_empty_days: 'Dni bez wydarzeń',
    ed_show_past_events: 'Dzisiejsze zakończone wydarzenia',
    ed_exclude: 'Ukryte wydarzenia',
    ed_exclude_helper: 'Ukrywa wydarzenia, których tytuł zawiera jeden z tych tekstów (bez rozróżniania wielkości liter)',
    ed_zoom: 'Przycisk szczegółów',
    ed_zoom_helper: 'Przycisk w prawym górnym rogu, który przełącza mini kartę na pełną kartę i z powrotem',
    ed_language: 'Język',
    ed_language_helper: 'Pozostaw puste, aby używać języka Home Assistant',
    workday: 'Dzień roboczy',
    day_off: 'Dzień wolny',
    school_holidays: 'Ferie szkolne',
    todo_done: 'Oznacz jako zrobione',
    todo_empty: 'Nic do zrobienia',
    ed_todo_entities: 'Listy zadań',
    ed_todo_entities_helper: 'Otwarte pozycje tych list (Bring!, lista lokalna…), odhaczane z karty',
    ed_workday_entity: 'Czujnik dni roboczych',
    ed_workday_entity_helper: 'Plakietka dnia roboczego lub wolnego w nagłówku; znajdowany sam, gdy integracja Workday jest skonfigurowana',
    ed_school_holidays_calendar: 'Kalendarz ferii szkolnych',
    ed_school_holidays_calendar_helper: 'Jego wydarzenia oznaczają dni, które obejmują, bez pokazywania na liście (Remote Calendar…)',
  },
  ro: {
    agenda: 'Agendă',
    today: 'Astăzi',
    prev_week: 'Săptămâna anterioară',
    next_week: 'Săptămâna următoare',
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
    next: 'Apoi',
    until: 'până pe {d}',
    more: 'Mai multe: {n}',
    more_one: 'Încă {n} eveniment',
    less: 'Mai puțin',
    close: 'Închide',
    load_failed: 'Calendar neîncărcat: {list}',
    no_calendar: 'Niciun calendar găsit',
    zoom_in: 'Afișează cardul complet',
    zoom_out: 'Înapoi la vizualizarea compactă',
    add_event: 'Eveniment nou',
    ev_title: 'Titlu',
    ev_calendar: 'Calendar',
    ev_start: 'Început',
    ev_end: 'Sfârșit',
    ev_location: 'Loc',
    ev_description: 'Descriere',
    ev_add: 'Adaugă',
    ev_cancel: 'Anulează',
    ev_need_title: 'Dați un titlu evenimentului',
    ev_bad_end: 'Sfârșitul trebuie să fie după început',
    ev_bad_when: 'Introduceți data și orele',
    ev_failed: 'Evenimentul nu a putut fi adăugat: {e}',
    edit_event: 'Editează evenimentul',
    delete_event: 'Șterge evenimentul',
    ev_save: 'Salvează',
    ev_delete: 'Șterge',
    ev_delete_confirm: 'Ștergi acest eveniment?',
    ev_this: 'Acest eveniment',
    ev_future: 'Acesta și evenimentele următoare',
    ev_apply_to: 'Aplică modificările la',
    ev_save_failed: 'Evenimentul nu a putut fi salvat: {e}',
    ev_delete_failed: 'Evenimentul nu a putut fi șters: {e}',
    ed_add_button: 'Buton de adăugare',
    ed_add_button_helper: 'Butonul + din antet pentru a adăuga un eveniment într-un calendar care permite',
    ed_edit_buttons: 'Butoane de editare și ștergere',
    ed_edit_buttons_helper: 'Butoane în detaliile evenimentului pentru a edita sau șterge un eveniment dintr-un calendar care permite',
    ed_entities: 'Calendare',
    ed_entities_helper: 'Culori și etichete pentru fiecare calendar: în YAML (vezi README)',
    ed_title: 'Titlu',
    ed_title_helper: 'Lăsați gol pentru „Agendă”',
    ed_days_to_show: 'Zile afișate',
    ed_view: 'Vizualizare',
    ed_view_helper: 'Săptămână: 7 zile alăturate de azi (listă pe un card îngust)',
    view_agenda: 'Agendă',
    view_week: 'Săptămână',
    ed_max_events: 'Evenimente afișate',
    ed_max_events_helper: '0 pentru a afișa tot',
    ed_show_header: 'Antet',
    ed_show_title: 'Afișează titlul',
    ed_show_location: 'Locație',
    ed_show_end_time: 'Ora de sfârșit',
    ed_show_countdown: 'Numărătoare inversă',
    ed_show_empty_days: 'Zile fără evenimente',
    ed_show_past_events: 'Evenimentele de azi încheiate',
    ed_exclude: 'Evenimente ascunse',
    ed_exclude_helper: 'Ascunde evenimentele al căror titlu conține unul dintre aceste texte (fără a ține cont de majuscule)',
    ed_zoom: 'Buton de detalii',
    ed_zoom_helper: 'Buton din dreapta sus care extinde mini cardul în cardul complet și înapoi',
    ed_language: 'Limbă',
    ed_language_helper: 'Lăsați gol pentru a urma limba Home Assistant',
    workday: 'Zi lucrătoare',
    day_off: 'Zi liberă',
    school_holidays: 'Vacanță școlară',
    todo_done: 'Marchează ca făcut',
    todo_empty: 'Nimic de făcut',
    ed_todo_entities: 'Liste de sarcini',
    ed_todo_entities_helper: 'Elementele deschise ale acestor liste (Bring!, listă locală…), bifate din card',
    ed_workday_entity: 'Senzor de zile lucrătoare',
    ed_workday_entity_helper: 'Insignă zi lucrătoare sau liberă în antet; găsit singur când integrarea Workday este configurată',
    ed_school_holidays_calendar: 'Calendarul vacanțelor școlare',
    ed_school_holidays_calendar_helper: 'Evenimentele lui marchează zilele pe care le acoperă, fără a fi listate (Remote Calendar…)',
  },
  da: {
    agenda: 'Aftaler',
    today: 'I dag',
    prev_week: 'Forrige uge',
    next_week: 'Næste uge',
    tomorrow: 'I\u00a0morgen',
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
    next: 'Næste',
    until: 'til {d}',
    more: '{n} aftaler mere',
    more_one: '{n} aftale mere',
    less: 'Vis mindre',
    close: 'Luk',
    load_failed: 'Kalender ikke indlæst: {list}',
    no_calendar: 'Ingen kalender fundet',
    zoom_in: 'Vis hele kortet',
    zoom_out: 'Tilbage til kompakt visning',
    add_event: 'Ny begivenhed',
    ev_title: 'Titel',
    ev_calendar: 'Kalender',
    ev_start: 'Start',
    ev_end: 'Slut',
    ev_location: 'Sted',
    ev_description: 'Beskrivelse',
    ev_add: 'Tilføj',
    ev_cancel: 'Annuller',
    ev_need_title: 'Giv begivenheden en titel',
    ev_bad_end: 'Slut skal være efter start',
    ev_bad_when: 'Angiv dato og tidspunkter',
    ev_failed: 'Begivenheden kunne ikke tilføjes: {e}',
    edit_event: 'Rediger begivenhed',
    delete_event: 'Slet begivenhed',
    ev_save: 'Gem',
    ev_delete: 'Slet',
    ev_delete_confirm: 'Slet denne begivenhed?',
    ev_this: 'Denne begivenhed',
    ev_future: 'Denne og følgende begivenheder',
    ev_apply_to: 'Anvend ændringerne på',
    ev_save_failed: 'Kunne ikke gemme begivenheden: {e}',
    ev_delete_failed: 'Kunne ikke slette begivenheden: {e}',
    ed_add_button: 'Tilføj-knap',
    ed_add_button_helper: '+-knap i overskriften til at tilføje en begivenhed til en kalender, der tillader det',
    ed_edit_buttons: 'Knapper til redigering og sletning',
    ed_edit_buttons_helper: 'Knapper i begivenhedens detaljer til at redigere eller slette en begivenhed i en kalender, der tillader det',
    ed_entities: 'Kalendere',
    ed_entities_helper: 'Farver og navne pr. kalender: i YAML (se README)',
    ed_title: 'Titel',
    ed_title_helper: 'Lad stå tomt for »Aftaler«',
    ed_days_to_show: 'Viste dage',
    ed_view: 'Visning',
    ed_view_helper: 'Uge: 7 dage side om side fra i dag (liste på et smalt kort)',
    view_agenda: 'Dagsorden',
    view_week: 'Uge',
    ed_max_events: 'Aftaler før »mere«',
    ed_max_events_helper: '0 for at vise alt',
    ed_show_header: 'Overskrift',
    ed_show_title: 'Vis titel',
    ed_show_location: 'Sted',
    ed_show_end_time: 'Sluttidspunkt',
    ed_show_countdown: 'Nedtælling',
    ed_show_empty_days: 'Dage uden aftaler',
    ed_show_past_events: 'Dagens afsluttede aftaler',
    ed_exclude: 'Skjulte begivenheder',
    ed_exclude_helper: 'Skjuler begivenheder, hvis titel indeholder en af disse tekster (uden forskel på store og små bogstaver)',
    ed_zoom: 'Detaljeknap',
    ed_zoom_helper: 'Knap øverst til højre, der folder minikortet ud til hele kortet og tilbage',
    ed_language: 'Sprog',
    ed_language_helper: 'Lad stå tomt for at følge sproget i Home Assistant',
    workday: 'Arbejdsdag',
    day_off: 'Fridag',
    school_holidays: 'Skoleferie',
    todo_done: 'Markér som udført',
    todo_empty: 'Intet at lave',
    ed_todo_entities: 'Opgavelister',
    ed_todo_entities_helper: 'Åbne punkter på disse lister (Bring!, lokal liste…), afkrydset fra kortet',
    ed_workday_entity: 'Arbejdsdagssensor',
    ed_workday_entity_helper: 'Mærke for arbejdsdag eller fridag i overskriften; findes selv, når Workday-integrationen er sat op',
    ed_school_holidays_calendar: 'Skoleferiekalender',
    ed_school_holidays_calendar_helper: 'Dens begivenheder markerer de dage, de dækker, uden at blive vist på listen (Remote Calendar…)',
  },
  sv: {
    agenda: 'Schema',
    today: 'I dag',
    prev_week: 'Föregående vecka',
    next_week: 'Nästa vecka',
    tomorrow: 'I\u00a0morgon',
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
    next: 'Sedan',
    until: 'till {d}',
    more: '{n} händelser till',
    more_one: '{n} händelse till',
    less: 'Visa mindre',
    close: 'Stäng',
    load_failed: 'Kalendern kunde inte läsas in: {list}',
    no_calendar: 'Ingen kalender hittades',
    zoom_in: 'Visa hela kortet',
    zoom_out: 'Tillbaka till kompakt vy',
    add_event: 'Ny händelse',
    ev_title: 'Titel',
    ev_calendar: 'Kalender',
    ev_start: 'Start',
    ev_end: 'Slut',
    ev_location: 'Plats',
    ev_description: 'Beskrivning',
    ev_add: 'Lägg till',
    ev_cancel: 'Avbryt',
    ev_need_title: 'Ge händelsen en titel',
    ev_bad_end: 'Slutet måste vara efter starten',
    ev_bad_when: 'Ange datum och tider',
    ev_failed: 'Händelsen kunde inte läggas till: {e}',
    edit_event: 'Redigera händelse',
    delete_event: 'Ta bort händelse',
    ev_save: 'Spara',
    ev_delete: 'Ta bort',
    ev_delete_confirm: 'Ta bort den här händelsen?',
    ev_this: 'Den här händelsen',
    ev_future: 'Den här och följande händelser',
    ev_apply_to: 'Tillämpa ändringarna på',
    ev_save_failed: 'Det gick inte att spara händelsen: {e}',
    ev_delete_failed: 'Det gick inte att ta bort händelsen: {e}',
    ed_add_button: 'Lägg till-knapp',
    ed_add_button_helper: '+-knapp i rubriken för att lägga till en händelse i en kalender som tillåter det',
    ed_edit_buttons: 'Knappar för redigering och borttagning',
    ed_edit_buttons_helper: 'Knappar i händelsens detaljer för att redigera eller ta bort en händelse i en kalender som tillåter det',
    ed_entities: 'Kalendrar',
    ed_entities_helper: 'Färger och namn per kalender: i YAML (se README)',
    ed_title: 'Titel',
    ed_title_helper: 'Lämna tomt för ”Schema”',
    ed_days_to_show: 'Visade dagar',
    ed_view: 'Vy',
    ed_view_helper: 'Vecka: 7 dagar sida vid sida från i dag (lista på ett smalt kort)',
    view_agenda: 'Agenda',
    view_week: 'Vecka',
    ed_max_events: 'Max antal händelser',
    ed_max_events_helper: '0 för att visa allt',
    ed_show_header: 'Rubrik',
    ed_show_title: 'Visa rubrik',
    ed_show_location: 'Plats',
    ed_show_end_time: 'Sluttid',
    ed_show_countdown: 'Nedräkning',
    ed_show_empty_days: 'Dagar utan händelser',
    ed_show_past_events: 'Dagens avslutade händelser',
    ed_exclude: 'Dolda händelser',
    ed_exclude_helper: 'Döljer händelser vars titel innehåller någon av dessa texter (skiftlägesokänsligt)',
    ed_zoom: 'Detaljknapp',
    ed_zoom_helper: 'Knapp uppe till höger som fäller ut minikortet till hela kortet och tillbaka',
    ed_language: 'Språk',
    ed_language_helper: 'Lämna tomt för att följa språket i Home Assistant',
    workday: 'Arbetsdag',
    day_off: 'Ledig dag',
    school_holidays: 'Skollov',
    todo_done: 'Markera som klar',
    todo_empty: 'Inget att göra',
    ed_todo_entities: 'Att göra-listor',
    ed_todo_entities_helper: 'Öppna punkter i dessa listor (Bring!, lokal lista…), bockas av från kortet',
    ed_workday_entity: 'Arbetsdagssensor',
    ed_workday_entity_helper: 'Märke för arbetsdag eller ledig dag i rubriken; hittas automatiskt när Workday-integrationen är konfigurerad',
    ed_school_holidays_calendar: 'Skollovskalender',
    ed_school_holidays_calendar_helper: 'Dess händelser markerar dagarna de täcker, utan att listas (Remote Calendar…)',
  },
  bg: {
    agenda: 'График',
    today: 'Днес',
    prev_week: 'Предишна седмица',
    next_week: 'Следваща седмица',
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
    next: 'После',
    until: 'до {d}',
    more: 'Още {n} събития',
    more_one: 'Още {n} събитие',
    less: 'По-малко',
    close: 'Затвори',
    load_failed: 'Календарът не е зареден: {list}',
    no_calendar: 'Не е намерен календар',
    zoom_in: 'Покажи цялата карта',
    zoom_out: 'Обратно към компактния изглед',
    add_event: 'Ново събитие',
    ev_title: 'Заглавие',
    ev_calendar: 'Календар',
    ev_start: 'Начало',
    ev_end: 'Край',
    ev_location: 'Място',
    ev_description: 'Описание',
    ev_add: 'Добави',
    ev_cancel: 'Отказ',
    ev_need_title: 'Дайте заглавие на събитието',
    ev_bad_end: 'Краят трябва да е след началото',
    ev_bad_when: 'Въведете датата и часовете',
    ev_failed: 'Събитието не можа да бъде добавено: {e}',
    edit_event: 'Редактиране на събитието',
    delete_event: 'Изтриване на събитието',
    ev_save: 'Запази',
    ev_delete: 'Изтрий',
    ev_delete_confirm: 'Да се изтрие ли това събитие?',
    ev_this: 'Това събитие',
    ev_future: 'Това и следващите събития',
    ev_apply_to: 'Приложи промените към',
    ev_save_failed: 'Събитието не може да бъде запазено: {e}',
    ev_delete_failed: 'Събитието не може да бъде изтрито: {e}',
    ed_add_button: 'Бутон за добавяне',
    ed_add_button_helper: 'Бутон + в заглавката за добавяне на събитие в календар, който го позволява',
    ed_edit_buttons: 'Бутони за редактиране и изтриване',
    ed_edit_buttons_helper: 'Бутони в подробностите за събитието за редактиране или изтриване на събитие от календар, който го позволява',
    ed_entities: 'Календари',
    ed_entities_helper: 'Цветове и етикети за всеки календар: в YAML (вижте README)',
    ed_title: 'Заглавие',
    ed_title_helper: 'Оставете празно за „График“',
    ed_days_to_show: 'Показани дни',
    ed_view: 'Изглед',
    ed_view_helper: 'Седмица: 7 дни един до друг от днес (списък на тясна карта)',
    view_agenda: 'Програма',
    view_week: 'Седмица',
    ed_max_events: 'Събития преди „Още“',
    ed_max_events_helper: '0, за да се покаже всичко',
    ed_show_header: 'Заглавна част',
    ed_show_title: 'Показване на заглавието',
    ed_show_location: 'Местоположение',
    ed_show_end_time: 'Час на приключване',
    ed_show_countdown: 'Обратно отброяване',
    ed_show_empty_days: 'Дни без събития',
    ed_show_past_events: 'Приключилите днес събития',
    ed_exclude: 'Скрити събития',
    ed_exclude_helper: 'Скрива събитията, чието заглавие съдържа един от тези текстове (без значение от главни и малки букви)',
    ed_zoom: 'Бутон за подробности',
    ed_zoom_helper: 'Бутон горе вдясно, който разгъва мини картата до цялата карта и обратно',
    ed_language: 'Език',
    ed_language_helper: 'Оставете празно, за да се използва езикът на Home Assistant',
    workday: 'Работен ден',
    day_off: 'Почивен ден',
    school_holidays: 'Училищна ваканция',
    todo_done: 'Отбелязване като изпълнено',
    todo_empty: 'Няма задачи',
    ed_todo_entities: 'Списъци със задачи',
    ed_todo_entities_helper: 'Отворени елементи от тези списъци (Bring!, локален списък…), отмятани от картата',
    ed_workday_entity: 'Сензор за работни дни',
    ed_workday_entity_helper: 'Значка за работен или почивен ден в заглавката; намира се сам, когато интеграцията Workday е настроена',
    ed_school_holidays_calendar: 'Календар на училищните ваканции',
    ed_school_holidays_calendar_helper: 'Събитията му отбелязват дните, които обхващат, без да се показват в списъка (Remote Calendar…)',
  },
  ru: {
    agenda: 'События',
    today: 'Сегодня',
    prev_week: 'Предыдущая неделя',
    next_week: 'Следующая неделя',
    tomorrow: 'Завтра',
    all_day: 'Весь день',
    now: 'Идёт',
    in_min: 'через {n} мин',
    in_h: 'через {h} ч {m} мин',
    in_hours: 'через {h} ч',
    no_events: 'Нет событий',
    no_upcoming: 'Нет предстоящих событий',
    events_today: 'Сегодня: {n}',
    event_today: 'Сегодня: {n}',
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
    add_event: 'Новое событие',
    ev_title: 'Название',
    ev_calendar: 'Календарь',
    ev_start: 'Начало',
    ev_end: 'Конец',
    ev_location: 'Место',
    ev_description: 'Описание',
    ev_add: 'Добавить',
    ev_cancel: 'Отмена',
    ev_need_title: 'Укажите название события',
    ev_bad_end: 'Конец должен быть после начала',
    ev_bad_when: 'Укажите дату и время',
    ev_failed: 'Не удалось добавить событие: {e}',
    edit_event: 'Изменить событие',
    delete_event: 'Удалить событие',
    ev_save: 'Сохранить',
    ev_delete: 'Удалить',
    ev_delete_confirm: 'Удалить это событие?',
    ev_this: 'Это событие',
    ev_future: 'Это и последующие события',
    ev_apply_to: 'Применить изменения к',
    ev_save_failed: 'Не удалось сохранить событие: {e}',
    ev_delete_failed: 'Не удалось удалить событие: {e}',
    ed_add_button: 'Кнопка добавления',
    ed_add_button_helper: 'Кнопка + в заголовке для добавления события в календарь, который это позволяет',
    ed_edit_buttons: 'Кнопки изменения и удаления',
    ed_edit_buttons_helper: 'Кнопки в подробностях события для изменения или удаления события в календаре, который это позволяет',
    ed_entities: 'Календари',
    ed_entities_helper: 'Цвета и подписи для каждого календаря: в YAML (см. README)',
    ed_title: 'Заголовок',
    ed_title_helper: 'Оставьте пустым для «События»',
    ed_days_to_show: 'Количество дней',
    ed_view: 'Вид',
    ed_view_helper: 'Неделя: 7 дней рядом, начиная с сегодня (список на узкой карточке)',
    view_agenda: 'Повестка',
    view_week: 'Неделя',
    ed_max_events: 'Событий до «Ещё»',
    ed_max_events_helper: '0 — показать все',
    ed_show_header: 'Шапка',
    ed_show_title: 'Показывать заголовок',
    ed_show_location: 'Место',
    ed_show_end_time: 'Время окончания',
    ed_show_countdown: 'Обратный отсчёт',
    ed_show_empty_days: 'Дни без событий',
    ed_show_past_events: 'Завершённые сегодня события',
    ed_exclude: 'Скрытые события',
    ed_exclude_helper: 'Скрывает события, название которых содержит один из этих текстов (без учёта регистра)',
    ed_zoom: 'Кнопка подробностей',
    ed_zoom_helper: 'Кнопка в правом верхнем углу, которая разворачивает мини-карточку в полную и обратно',
    ed_language: 'Язык',
    ed_language_helper: 'Оставьте пустым, чтобы использовать язык Home Assistant',
    workday: 'Рабочий день',
    day_off: 'Выходной',
    school_holidays: 'Школьные каникулы',
    todo_done: 'Отметить как выполненное',
    todo_empty: 'Нечего делать',
    ed_todo_entities: 'Списки дел',
    ed_todo_entities_helper: 'Открытые пункты этих списков (Bring!, локальный список…), отмечаются прямо в карточке',
    ed_workday_entity: 'Датчик рабочих дней',
    ed_workday_entity_helper: 'Значок рабочего или выходного дня в заголовке; находится сам, если настроена интеграция Workday',
    ed_school_holidays_calendar: 'Календарь школьных каникул',
    ed_school_holidays_calendar_helper: 'Его события отмечают дни, которые они охватывают, не попадая в список (Remote Calendar…)',
  },
  uk: {
    agenda: 'Розклад',
    today: 'Сьогодні',
    prev_week: 'Попередній тиждень',
    next_week: 'Наступний тиждень',
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
    add_event: 'Нова подія',
    ev_title: 'Назва',
    ev_calendar: 'Календар',
    ev_start: 'Початок',
    ev_end: 'Кінець',
    ev_location: 'Місце',
    ev_description: 'Опис',
    ev_add: 'Додати',
    ev_cancel: 'Скасувати',
    ev_need_title: 'Вкажіть назву події',
    ev_bad_end: 'Кінець має бути після початку',
    ev_bad_when: 'Вкажіть дату й час',
    ev_failed: 'Не вдалося додати подію: {e}',
    edit_event: 'Змінити подію',
    delete_event: 'Видалити подію',
    ev_save: 'Зберегти',
    ev_delete: 'Видалити',
    ev_delete_confirm: 'Видалити цю подію?',
    ev_this: 'Ця подія',
    ev_future: 'Ця та наступні події',
    ev_apply_to: 'Застосувати зміни до',
    ev_save_failed: 'Не вдалося зберегти подію: {e}',
    ev_delete_failed: 'Не вдалося видалити подію: {e}',
    ed_add_button: 'Кнопка додавання',
    ed_add_button_helper: 'Кнопка + у заголовку для додавання події до календаря, який це дозволяє',
    ed_edit_buttons: 'Кнопки змінення та видалення',
    ed_edit_buttons_helper: 'Кнопки в деталях події для змінення або видалення події в календарі, який це дозволяє',
    ed_entities: 'Календарі',
    ed_entities_helper: 'Кольори та підписи для кожного календаря: у YAML (див. README)',
    ed_title: 'Заголовок',
    ed_title_helper: 'Залиште порожнім для «Розклад»',
    ed_days_to_show: 'Кількість днів',
    ed_view: 'Вигляд',
    ed_view_helper: 'Тиждень: 7 днів поруч, починаючи з сьогодні (список на вузькій картці)',
    view_agenda: 'Порядок денний',
    view_week: 'Тиждень',
    ed_max_events: 'Подій до «Ще»',
    ed_max_events_helper: '0 — показати все',
    ed_show_header: 'Шапка',
    ed_show_title: 'Показувати заголовок',
    ed_show_location: 'Місце',
    ed_show_end_time: 'Час завершення',
    ed_show_countdown: 'Зворотний відлік',
    ed_show_empty_days: 'Дні без подій',
    ed_show_past_events: 'Завершені сьогодні події',
    ed_exclude: 'Приховані події',
    ed_exclude_helper: 'Приховує події, назва яких містить один із цих текстів (без урахування регістру)',
    ed_zoom: 'Кнопка деталей',
    ed_zoom_helper: 'Кнопка у правому верхньому куті, яка розгортає міні-картку до повної і назад',
    ed_language: 'Мова',
    ed_language_helper: 'Залиште порожнім, щоб використовувати мову Home Assistant',
    workday: 'Робочий день',
    day_off: 'Вихідний',
    school_holidays: 'Шкільні канікули',
    todo_done: 'Позначити як виконане',
    todo_empty: 'Нічого робити',
    ed_todo_entities: 'Списки справ',
    ed_todo_entities_helper: 'Відкриті пункти цих списків (Bring!, локальний список…), позначаються з картки',
    ed_workday_entity: 'Датчик робочих днів',
    ed_workday_entity_helper: 'Значок робочого чи вихідного дня в заголовку; знаходиться сам, коли налаштовано інтеграцію Workday',
    ed_school_holidays_calendar: 'Календар шкільних канікул',
    ed_school_holidays_calendar_helper: 'Його події позначають дні, які вони охоплюють, не потрапляючи до списку (Remote Calendar…)',
  },
  hu: {
    agenda: 'Napirend',
    today: 'Ma',
    prev_week: 'Előző hét',
    next_week: 'Következő hét',
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
    more: 'Még {n} esemény',
    more_one: 'Még {n} esemény',
    less: 'Kevesebb',
    close: 'Bezárás',
    load_failed: 'Nem sikerült betölteni a naptárat: {list}',
    no_calendar: 'Nem található naptár',
    zoom_in: 'A teljes kártya megjelenítése',
    zoom_out: 'Vissza a kompakt nézethez',
    add_event: 'Új esemény',
    ev_title: 'Cím',
    ev_calendar: 'Naptár',
    ev_start: 'Kezdés',
    ev_end: 'Vége',
    ev_location: 'Helyszín',
    ev_description: 'Leírás',
    ev_add: 'Hozzáadás',
    ev_cancel: 'Mégse',
    ev_need_title: 'Adjon címet az eseménynek',
    ev_bad_end: 'A végének a kezdés után kell lennie',
    ev_bad_when: 'Adja meg a dátumot és az időpontokat',
    ev_failed: 'Az esemény nem adható hozzá: {e}',
    edit_event: 'Esemény szerkesztése',
    delete_event: 'Esemény törlése',
    ev_save: 'Mentés',
    ev_delete: 'Törlés',
    ev_delete_confirm: 'Törli ezt az eseményt?',
    ev_this: 'Ez az esemény',
    ev_future: 'Ez és a következő események',
    ev_apply_to: 'Mire vonatkozzanak a módosítások?',
    ev_save_failed: 'Nem sikerült menteni az eseményt: {e}',
    ev_delete_failed: 'Nem sikerült törölni az eseményt: {e}',
    ed_add_button: 'Hozzáadás gomb',
    ed_add_button_helper: '+ gomb a fejlécben esemény hozzáadásához egy olyan naptárhoz, amely ezt engedi',
    ed_edit_buttons: 'Szerkesztés és törlés gombok',
    ed_edit_buttons_helper: 'Gombok az esemény részleteiben egy olyan naptár eseményének szerkesztéséhez vagy törléséhez, amely ezt engedi',
    ed_entities: 'Naptárak',
    ed_entities_helper: 'Naptáronkénti színek és címkék: YAML-ben (lásd a README-t)',
    ed_title: 'Cím',
    ed_title_helper: 'Hagyja üresen a „Napirend” címhez',
    ed_days_to_show: 'Megjelenített napok',
    ed_view: 'Nézet',
    ed_view_helper: 'Hét: 7 nap egymás mellett mától (lista keskeny kártyán)',
    view_agenda: 'Napirend',
    view_week: 'Hét',
    ed_max_events: 'Események a „További” előtt',
    ed_max_events_helper: '0 esetén minden megjelenik',
    ed_show_header: 'Fejléc',
    ed_show_title: 'Cím megjelenítése',
    ed_show_location: 'Helyszín',
    ed_show_end_time: 'Befejezés ideje',
    ed_show_countdown: 'Visszaszámlálás',
    ed_show_empty_days: 'Esemény nélküli napok',
    ed_show_past_events: 'Mai befejezett események',
    ed_exclude: 'Elrejtett események',
    ed_exclude_helper: 'Elrejti azokat az eseményeket, amelyek címe tartalmazza e szövegek egyikét (kis- és nagybetűtől függetlenül)',
    ed_zoom: 'Részletek gomb',
    ed_zoom_helper: 'Gomb a jobb felső sarokban, amely a mini kártyát teljes kártyává nyitja ki, és vissza',
    ed_language: 'Nyelv',
    ed_language_helper: 'Hagyja üresen a Home Assistant nyelvének követéséhez',
    workday: 'Munkanap',
    day_off: 'Szabadnap',
    school_holidays: 'Iskolai szünet',
    todo_done: 'Megjelölés késznek',
    todo_empty: 'Nincs teendő',
    ed_todo_entities: 'Teendőlisták',
    ed_todo_entities_helper: 'E listák nyitott tételei (Bring!, helyi lista…), a kártyáról kipipálhatók',
    ed_workday_entity: 'Munkanap-érzékelő',
    ed_workday_entity_helper: 'Munkanap vagy szabadnap jelvény a fejlécben; magától megtalálja, ha a Workday integráció be van állítva',
    ed_school_holidays_calendar: 'Iskolai szünetek naptára',
    ed_school_holidays_calendar_helper: 'Eseményei megjelölik az általuk lefedett napokat, a listában való megjelenés nélkül (Remote Calendar…)',
  },
  sk: {
    agenda: 'Program',
    today: 'Dnes',
    prev_week: 'Predchádzajúci týždeň',
    next_week: 'Nasledujúci týždeň',
    tomorrow: 'Zajtra',
    all_day: 'Celý deň',
    now: 'Teraz',
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
    add_event: 'Nová udalosť',
    ev_title: 'Názov',
    ev_calendar: 'Kalendár',
    ev_start: 'Začiatok',
    ev_end: 'Koniec',
    ev_location: 'Miesto',
    ev_description: 'Popis',
    ev_add: 'Pridať',
    ev_cancel: 'Zrušiť',
    ev_need_title: 'Zadajte názov udalosti',
    ev_bad_end: 'Koniec musí byť po začiatku',
    ev_bad_when: 'Zadajte dátum a časy',
    ev_failed: 'Udalosť sa nepodarilo pridať: {e}',
    edit_event: 'Upraviť udalosť',
    delete_event: 'Odstrániť udalosť',
    ev_save: 'Uložiť',
    ev_delete: 'Odstrániť',
    ev_delete_confirm: 'Odstrániť túto udalosť?',
    ev_this: 'Táto udalosť',
    ev_future: 'Táto a nasledujúce udalosti',
    ev_apply_to: 'Použiť zmeny na',
    ev_save_failed: 'Udalosť sa nepodarilo uložiť: {e}',
    ev_delete_failed: 'Udalosť sa nepodarilo odstrániť: {e}',
    ed_add_button: 'Tlačidlo pridania',
    ed_add_button_helper: 'Tlačidlo + v hlavičke na pridanie udalosti do kalendára, ktorý to umožňuje',
    ed_edit_buttons: 'Tlačidlá úpravy a odstránenia',
    ed_edit_buttons_helper: 'Tlačidlá v podrobnostiach udalosti na úpravu alebo odstránenie udalosti v kalendári, ktorý to umožňuje',
    ed_entities: 'Kalendáre',
    ed_entities_helper: 'Farby a názvy pre každý kalendár: v YAML (pozri README)',
    ed_title: 'Názov',
    ed_title_helper: 'Nechajte prázdne pre „Program“',
    ed_days_to_show: 'Zobrazené dni',
    ed_view: 'Zobrazenie',
    ed_view_helper: 'Týždeň: 7 dní vedľa seba od dnes (zoznam na úzkej karte)',
    view_agenda: 'Agenda',
    view_week: 'Týždeň',
    ed_max_events: 'Udalosti pred „Ďalšie“',
    ed_max_events_helper: '0 na zobrazenie všetkého',
    ed_show_header: 'Hlavička',
    ed_show_title: 'Zobraziť názov',
    ed_show_location: 'Miesto',
    ed_show_end_time: 'Čas ukončenia',
    ed_show_countdown: 'Odpočítavanie',
    ed_show_empty_days: 'Dni bez udalostí',
    ed_show_past_events: 'Dnešné ukončené udalosti',
    ed_exclude: 'Skryté udalosti',
    ed_exclude_helper: 'Skryje udalosti, ktorých názov obsahuje jeden z týchto textov (bez ohľadu na veľkosť písmen)',
    ed_zoom: 'Tlačidlo podrobností',
    ed_zoom_helper: 'Tlačidlo vpravo hore, ktoré rozbalí mini kartu na celú kartu a späť',
    ed_language: 'Jazyk',
    ed_language_helper: 'Nechajte prázdne, ak chcete používať jazyk Home Assistanta',
    workday: 'Pracovný deň',
    day_off: 'Voľný deň',
    school_holidays: 'Školské prázdniny',
    todo_done: 'Označiť ako hotové',
    todo_empty: 'Nič na práci',
    ed_todo_entities: 'Zoznamy úloh',
    ed_todo_entities_helper: 'Otvorené položky týchto zoznamov (Bring!, miestny zoznam…), odškrtávané z karty',
    ed_workday_entity: 'Snímač pracovných dní',
    ed_workday_entity_helper: 'Odznak pracovného alebo voľného dňa v hlavičke; nájde sa sám, keď je nastavená integrácia Workday',
    ed_school_holidays_calendar: 'Kalendár školských prázdnin',
    ed_school_holidays_calendar_helper: 'Jeho udalosti označujú dni, ktoré pokrývajú, bez zobrazenia v zozname (Remote Calendar…)',
  },
  cs: {
    agenda: 'Program',
    today: 'Dnes',
    prev_week: 'Předchozí týden',
    next_week: 'Následující týden',
    tomorrow: 'Zítra',
    all_day: 'Celý den',
    now: 'Nyní',
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
    add_event: 'Nová událost',
    ev_title: 'Název',
    ev_calendar: 'Kalendář',
    ev_start: 'Začátek',
    ev_end: 'Konec',
    ev_location: 'Místo',
    ev_description: 'Popis',
    ev_add: 'Přidat',
    ev_cancel: 'Zrušit',
    ev_need_title: 'Zadejte název události',
    ev_bad_end: 'Konec musí být po začátku',
    ev_bad_when: 'Zadejte datum a časy',
    ev_failed: 'Událost se nepodařilo přidat: {e}',
    edit_event: 'Upravit událost',
    delete_event: 'Smazat událost',
    ev_save: 'Uložit',
    ev_delete: 'Smazat',
    ev_delete_confirm: 'Smazat tuto událost?',
    ev_this: 'Tato událost',
    ev_future: 'Tato a následující události',
    ev_apply_to: 'Použít změny na',
    ev_save_failed: 'Událost se nepodařilo uložit: {e}',
    ev_delete_failed: 'Událost se nepodařilo smazat: {e}',
    ed_add_button: 'Tlačítko přidání',
    ed_add_button_helper: 'Tlačítko + v záhlaví pro přidání události do kalendáře, který to umožňuje',
    ed_edit_buttons: 'Tlačítka úprav a smazání',
    ed_edit_buttons_helper: 'Tlačítka v podrobnostech události pro úpravu nebo smazání události v kalendáři, který to umožňuje',
    ed_entities: 'Kalendáře',
    ed_entities_helper: 'Barvy a názvy pro každý kalendář: v YAML (viz README)',
    ed_title: 'Název',
    ed_title_helper: 'Ponechte prázdné pro „Program“',
    ed_days_to_show: 'Zobrazené dny',
    ed_view: 'Zobrazení',
    ed_view_helper: 'Týden: 7 dní vedle sebe od dneška (seznam na úzké kartě)',
    view_agenda: 'Agenda',
    view_week: 'Týden',
    ed_max_events: 'Události před „Další“',
    ed_max_events_helper: '0 pro zobrazení všeho',
    ed_show_header: 'Záhlaví',
    ed_show_title: 'Zobrazit název',
    ed_show_location: 'Místo',
    ed_show_end_time: 'Čas konce',
    ed_show_countdown: 'Odpočet',
    ed_show_empty_days: 'Dny bez událostí',
    ed_show_past_events: 'Dnešní skončené události',
    ed_exclude: 'Skryté události',
    ed_exclude_helper: 'Skryje události, jejichž název obsahuje jeden z těchto textů (bez ohledu na velikost písmen)',
    ed_zoom: 'Tlačítko podrobností',
    ed_zoom_helper: 'Tlačítko vpravo nahoře, které rozbalí mini kartu na celou kartu a zpět',
    ed_language: 'Jazyk',
    ed_language_helper: 'Ponechte prázdné pro použití jazyka Home Assistantu',
    workday: 'Pracovní den',
    day_off: 'Volný den',
    school_holidays: 'Školní prázdniny',
    todo_done: 'Označit jako hotové',
    todo_empty: 'Nic na práci',
    ed_todo_entities: 'Seznamy úkolů',
    ed_todo_entities_helper: 'Otevřené položky těchto seznamů (Bring!, místní seznam…), odškrtávané z karty',
    ed_workday_entity: 'Senzor pracovních dnů',
    ed_workday_entity_helper: 'Odznak pracovního nebo volného dne v záhlaví; najde se sám, když je nastavena integrace Workday',
    ed_school_holidays_calendar: 'Kalendář školních prázdnin',
    ed_school_holidays_calendar_helper: 'Jeho události označují dny, které pokrývají, bez zobrazení v seznamu (Remote Calendar…)',
  },
  sl: {
    agenda: 'Razpored',
    today: 'Danes',
    prev_week: 'Prejšnji teden',
    next_week: 'Naslednji teden',
    tomorrow: 'Jutri',
    all_day: 'Ves dan',
    now: 'Zdaj',
    in_min: 'čez {n} min',
    in_h: 'čez {h} h {m} min',
    in_hours: 'čez {h} h',
    no_events: 'Ni dogodkov',
    no_upcoming: 'Ni prihajajočih dogodkov',
    events_today: 'Danes: {n}',
    event_today: 'Danes: {n}',
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
    add_event: 'Nov dogodek',
    ev_title: 'Naslov',
    ev_calendar: 'Koledar',
    ev_start: 'Začetek',
    ev_end: 'Konec',
    ev_location: 'Kraj',
    ev_description: 'Opis',
    ev_add: 'Dodaj',
    ev_cancel: 'Prekliči',
    ev_need_title: 'Dogodku dajte naslov',
    ev_bad_end: 'Konec mora biti po začetku',
    ev_bad_when: 'Vnesite datum in ure',
    ev_failed: 'Dogodka ni bilo mogoče dodati: {e}',
    edit_event: 'Uredi dogodek',
    delete_event: 'Izbriši dogodek',
    ev_save: 'Shrani',
    ev_delete: 'Izbriši',
    ev_delete_confirm: 'Želite izbrisati ta dogodek?',
    ev_this: 'Ta dogodek',
    ev_future: 'Ta in naslednji dogodki',
    ev_apply_to: 'Uporabi spremembe za',
    ev_save_failed: 'Dogodka ni bilo mogoče shraniti: {e}',
    ev_delete_failed: 'Dogodka ni bilo mogoče izbrisati: {e}',
    ed_add_button: 'Gumb za dodajanje',
    ed_add_button_helper: 'Gumb + v glavi za dodajanje dogodka v koledar, ki to omogoča',
    ed_edit_buttons: 'Gumba za urejanje in brisanje',
    ed_edit_buttons_helper: 'Gumba v podrobnostih dogodka za urejanje ali brisanje dogodka v koledarju, ki to omogoča',
    ed_entities: 'Koledarji',
    ed_entities_helper: 'Barve in oznake za vsak koledar: v YAML (glejte README)',
    ed_title: 'Naslov',
    ed_title_helper: 'Pustite prazno za »Razpored«',
    ed_days_to_show: 'Prikazani dnevi',
    ed_view: 'Pogled',
    ed_view_helper: 'Teden: 7 dni drug ob drugem od danes (seznam na ozki kartici)',
    view_agenda: 'Dnevni red',
    view_week: 'Teden',
    ed_max_events: 'Dogodki pred »Več«',
    ed_max_events_helper: '0 za prikaz vsega',
    ed_show_header: 'Glava',
    ed_show_title: 'Prikaži naslov',
    ed_show_location: 'Lokacija',
    ed_show_end_time: 'Čas konca',
    ed_show_countdown: 'Odštevanje',
    ed_show_empty_days: 'Dnevi brez dogodkov',
    ed_show_past_events: 'Današnji končani dogodki',
    ed_exclude: 'Skriti dogodki',
    ed_exclude_helper: 'Skrije dogodke, katerih naslov vsebuje enega od teh besedil (ne glede na velike in male črke)',
    ed_zoom: 'Gumb za podrobnosti',
    ed_zoom_helper: 'Gumb zgoraj desno, ki mini kartico razširi v celotno kartico in nazaj',
    ed_language: 'Jezik',
    ed_language_helper: 'Pustite prazno, da sledi jeziku Home Assistanta',
    workday: 'Delovni dan',
    day_off: 'Prost dan',
    school_holidays: 'Šolske počitnice',
    todo_done: 'Označi kot opravljeno',
    todo_empty: 'Nič za narediti',
    ed_todo_entities: 'Seznami opravil',
    ed_todo_entities_helper: 'Odprti elementi teh seznamov (Bring!, lokalni seznam…), odkljukani iz kartice',
    ed_workday_entity: 'Senzor delovnih dni',
    ed_workday_entity_helper: 'Značka delovnega ali prostega dne v glavi; najde se sam, ko je integracija Workday nastavljena',
    ed_school_holidays_calendar: 'Koledar šolskih počitnic',
    ed_school_holidays_calendar_helper: 'Njegovi dogodki označijo dneve, ki jih pokrivajo, ne da bi bili na seznamu (Remote Calendar…)',
  },
  lv: {
    agenda: 'Grafiks',
    today: 'Šodien',
    prev_week: 'Iepriekšējā nedēļa',
    next_week: 'Nākamā nedēļa',
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
    next: 'Tālāk',
    until: 'līdz {d}',
    more: 'Citi notikumi: {n}',
    more_one: 'Vēl {n} notikums',
    less: 'Rādīt mazāk',
    close: 'Aizvērt',
    load_failed: 'Kalendārs netika ielādēts: {list}',
    no_calendar: 'Nav atrasts neviens kalendārs',
    zoom_in: 'Rādīt pilno karti',
    zoom_out: 'Atpakaļ uz kompakto skatu',
    add_event: 'Jauns notikums',
    ev_title: 'Nosaukums',
    ev_calendar: 'Kalendārs',
    ev_start: 'Sākums',
    ev_end: 'Beigas',
    ev_location: 'Vieta',
    ev_description: 'Apraksts',
    ev_add: 'Pievienot',
    ev_cancel: 'Atcelt',
    ev_need_title: 'Piešķiriet notikumam nosaukumu',
    ev_bad_end: 'Beigām jābūt pēc sākuma',
    ev_bad_when: 'Ievadiet datumu un laikus',
    ev_failed: 'Notikumu neizdevās pievienot: {e}',
    edit_event: 'Rediģēt notikumu',
    delete_event: 'Dzēst notikumu',
    ev_save: 'Saglabāt',
    ev_delete: 'Dzēst',
    ev_delete_confirm: 'Dzēst šo notikumu?',
    ev_this: 'Šis notikums',
    ev_future: 'Šis un nākamie notikumi',
    ev_apply_to: 'Piemērot izmaiņas',
    ev_save_failed: 'Neizdevās saglabāt notikumu: {e}',
    ev_delete_failed: 'Neizdevās dzēst notikumu: {e}',
    ed_add_button: 'Pievienošanas poga',
    ed_add_button_helper: 'Poga + galvenē, lai pievienotu notikumu kalendāram, kas to atļauj',
    ed_edit_buttons: 'Rediģēšanas un dzēšanas pogas',
    ed_edit_buttons_helper: 'Pogas notikuma informācijā, lai rediģētu vai dzēstu notikumu kalendārā, kas to atļauj',
    ed_entities: 'Kalendāri',
    ed_entities_helper: 'Krāsas un nosaukumi katram kalendāram: YAML (skatīt README)',
    ed_title: 'Virsraksts',
    ed_title_helper: 'Atstājiet tukšu, lai rādītu „Grafiks”',
    ed_days_to_show: 'Rādītās dienas',
    ed_view: 'Skats',
    ed_view_helper: 'Nedēļa: 7 dienas blakus no šodienas (saraksts uz šauras kartītes)',
    view_agenda: 'Darba kārtība',
    view_week: 'Nedēļa',
    ed_max_events: 'Notikumi pirms „Citi notikumi”',
    ed_max_events_helper: '0, lai rādītu visu',
    ed_show_header: 'Galvene',
    ed_show_title: 'Rādīt virsrakstu',
    ed_show_location: 'Vieta',
    ed_show_end_time: 'Beigu laiks',
    ed_show_countdown: 'Atpakaļskaitīšana',
    ed_show_empty_days: 'Dienas bez notikumiem',
    ed_show_past_events: 'Šodienas beigušies notikumi',
    ed_exclude: 'Paslēptie notikumi',
    ed_exclude_helper: 'Paslēpj notikumus, kuru nosaukumā ir kāds no šiem tekstiem (reģistrs netiek ņemts vērā)',
    ed_zoom: 'Detaļu poga',
    ed_zoom_helper: 'Poga augšējā labajā stūrī, kas izvērš mini karti par pilno karti un atpakaļ',
    ed_language: 'Valoda',
    ed_language_helper: 'Atstājiet tukšu, lai izmantotu Home Assistant valodu',
    workday: 'Darba diena',
    day_off: 'Brīvdiena',
    school_holidays: 'Skolas brīvdienas',
    todo_done: 'Atzīmēt kā izdarītu',
    todo_empty: 'Nav ko darīt',
    ed_todo_entities: 'Uzdevumu saraksti',
    ed_todo_entities_helper: 'Šo sarakstu atvērtie vienumi (Bring!, lokāls saraksts…), atzīmējami no kartītes',
    ed_workday_entity: 'Darba dienu sensors',
    ed_workday_entity_helper: 'Darba dienas vai brīvdienas žetons galvenē; atrodams pats, kad iestatīta Workday integrācija',
    ed_school_holidays_calendar: 'Skolas brīvdienu kalendārs',
    ed_school_holidays_calendar_helper: 'Tā notikumi iezīmē dienas, ko tie aptver, neparādoties sarakstā (Remote Calendar…)',
  },
  el: {
    agenda: 'Ατζέντα',
    today: 'Σήμερα',
    prev_week: 'Προηγούμενη εβδομάδα',
    next_week: 'Επόμενη εβδομάδα',
    tomorrow: 'Αύριο',
    all_day: 'Ολοήμερο',
    now: 'Σε εξέλιξη',
    in_min: 'σε {n} λεπ.',
    in_h: 'σε {h} ώ. {m} λεπ.',
    in_hours: 'σε {h} ώ.',
    no_events: 'Δεν υπάρχουν συμβάντα',
    no_upcoming: 'Δεν υπάρχουν επερχόμενα συμβάντα',
    events_today: 'Σήμερα: {n}',
    event_today: 'Σήμερα: {n}',
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
    add_event: 'Νέο συμβάν',
    ev_title: 'Τίτλος',
    ev_calendar: 'Ημερολόγιο',
    ev_start: 'Έναρξη',
    ev_end: 'Λήξη',
    ev_location: 'Τοποθεσία',
    ev_description: 'Περιγραφή',
    ev_add: 'Προσθήκη',
    ev_cancel: 'Ακύρωση',
    ev_need_title: 'Δώστε τίτλο στο συμβάν',
    ev_bad_end: 'Η λήξη πρέπει να είναι μετά την έναρξη',
    ev_bad_when: 'Εισαγάγετε την ημερομηνία και τις ώρες',
    ev_failed: 'Δεν ήταν δυνατή η προσθήκη του συμβάντος: {e}',
    edit_event: 'Επεξεργασία συμβάντος',
    delete_event: 'Διαγραφή συμβάντος',
    ev_save: 'Αποθήκευση',
    ev_delete: 'Διαγραφή',
    ev_delete_confirm: 'Διαγραφή αυτού του συμβάντος;',
    ev_this: 'Αυτό το συμβάν',
    ev_future: 'Αυτό και τα επόμενα συμβάντα',
    ev_apply_to: 'Εφαρμογή των αλλαγών σε',
    ev_save_failed: 'Δεν ήταν δυνατή η αποθήκευση του συμβάντος: {e}',
    ev_delete_failed: 'Δεν ήταν δυνατή η διαγραφή του συμβάντος: {e}',
    ed_add_button: 'Κουμπί προσθήκης',
    ed_add_button_helper: 'Κουμπί + στην κεφαλίδα για προσθήκη συμβάντος σε ημερολόγιο που το επιτρέπει',
    ed_edit_buttons: 'Κουμπιά επεξεργασίας και διαγραφής',
    ed_edit_buttons_helper: 'Κουμπιά στις λεπτομέρειες του συμβάντος για επεξεργασία ή διαγραφή συμβάντος σε ημερολόγιο που το επιτρέπει',
    ed_entities: 'Ημερολόγια',
    ed_entities_helper: 'Χρώματα και ετικέτες ανά ημερολόγιο: σε YAML (δείτε το README)',
    ed_title: 'Τίτλος',
    ed_title_helper: 'Αφήστε κενό για «Ατζέντα»',
    ed_days_to_show: 'Εμφανιζόμενες ημέρες',
    ed_view: 'Προβολή',
    ed_view_helper: 'Εβδομάδα: 7 ημέρες δίπλα-δίπλα από σήμερα (λίστα σε στενή κάρτα)',
    view_agenda: 'Ατζέντα',
    view_week: 'Εβδομάδα',
    ed_max_events: 'Συμβάντα πριν το «Άλλα»',
    ed_max_events_helper: '0 για εμφάνιση όλων',
    ed_show_header: 'Κεφαλίδα',
    ed_show_title: 'Εμφάνιση τίτλου',
    ed_show_location: 'Τοποθεσία',
    ed_show_end_time: 'Ώρα λήξης',
    ed_show_countdown: 'Αντίστροφη μέτρηση',
    ed_show_empty_days: 'Ημέρες χωρίς συμβάντα',
    ed_show_past_events: 'Σημερινά ολοκληρωμένα συμβάντα',
    ed_exclude: 'Κρυφά συμβάντα',
    ed_exclude_helper: 'Κρύβει τα συμβάντα των οποίων ο τίτλος περιέχει ένα από αυτά τα κείμενα (χωρίς διάκριση πεζών-κεφαλαίων)',
    ed_zoom: 'Κουμπί λεπτομερειών',
    ed_zoom_helper: 'Κουμπί πάνω δεξιά που αναπτύσσει τη μίνι κάρτα σε πλήρη κάρτα και αντίστροφα',
    ed_language: 'Γλώσσα',
    ed_language_helper: 'Αφήστε κενό για να ακολουθεί τη γλώσσα του Home Assistant',
    workday: 'Εργάσιμη ημέρα',
    day_off: 'Αργία',
    school_holidays: 'Σχολικές διακοπές',
    todo_done: 'Σήμανση ως ολοκληρωμένο',
    todo_empty: 'Τίποτα για να κάνετε',
    ed_todo_entities: 'Λίστες εργασιών',
    ed_todo_entities_helper: 'Ανοιχτά στοιχεία αυτών των λιστών (Bring!, τοπική λίστα…), τσεκάρονται από την κάρτα',
    ed_workday_entity: 'Αισθητήρας εργάσιμων ημερών',
    ed_workday_entity_helper: 'Σήμα εργάσιμης ημέρας ή αργίας στην κεφαλίδα; βρίσκεται μόνο του όταν έχει ρυθμιστεί η ενσωμάτωση Workday',
    ed_school_holidays_calendar: 'Ημερολόγιο σχολικών διακοπών',
    ed_school_holidays_calendar_helper: 'Τα συμβάντα του σημειώνουν τις ημέρες που καλύπτουν, χωρίς να εμφανίζονται στη λίστα (Remote Calendar…)',
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
// Least horizontal move (px) read as a swipe over the week.
var CC_SWIPE = 50;
var CC_REFRESH = 5 * 60000;
var CC_DEFAULTS = {
  view: 'agenda', days_to_show: 7, max_events: 5, show_header: true, show_title: true, show_location: true, show_end_time: true,
  show_countdown: true, show_empty_days: false, show_past_events: false, add_button: true, edit_buttons: true,
};

// Calendar features (CalendarEntityFeature): calendar.create_event, calendar/event/delete and
// calendar/event/update.
var CC_CREATE = 1;
var CC_DELETE = 2;
var CC_UPDATE = 4;
// recurrence_range of a change to an instance of a recurring event and the ones after it.
var CC_FUTURE = 'THISANDFUTURE';
// "2026-11-07" in local time, for a date input and the create_event action.
function ccIso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// A form's date ("2026-11-20") and time ("14:00") as the inputs give them; empty when cleared.
function ccDateOk(v) { return /^\d{4}-\d{2}-\d{2}$/.test(v || '') && !Number.isNaN(ccLocalDate(v).getTime()); }

function ccTimeOk(v) { return /^([01]\d|2[0-3]):[0-5]\d/.test(v || ''); }

function ccHm(d) {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// New event form defaults: the next round hour, for an hour. The end date defaults to the start's, so
// the end stays on that day (23:59 at most): opened at 22:30, 23:00 to 23:59, not 23:00 to 00:00.
function ccFormTimes(now) {
  var start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1);
  var end = new Date(Math.min(start.getTime() + 3600000, new Date(start.getFullYear(), start.getMonth(), start.getDate(), 23, 59).getTime()));
  return { date: ccIso(start), start: ccHm(start), end: ccHm(end) };
}

// Days from one form date to another ("2026-11-20" to "2026-11-22": 2).
function ccDaysBetween(from, to) {
  return Math.round((ccLocalDate(to) - ccLocalDate(from)) / 86400000);
}

// A form date and time ("2026-11-20", "14:00"), in the zone the agenda shows the events in (the
// browser's, or the server's `tz` with the profile's server time zone setting), as an absolute UTC time
// for create_event. A naive time would be read in the Home Assistant server's time zone; UTC for both
// ends also keeps them in one zone across a daylight saving change, as Home Assistant requires.
function ccUtc(date, hm, tz) {
  var p = `${date}-${hm}`.split(/[-:]/).map(Number);
  var d = tz ? ccFromZone(p[0], p[1] - 1, p[2], p[3], p[4], tz) : new Date(p[0], p[1] - 1, p[2], p[3], p[4]);
  return `${d.toISOString().slice(0, 19)}+00:00`;
}

// Time zone of the profile's "server" setting (hass.locale.time_zone === 'server'): the agenda then shows
// and enters times in the Home Assistant server's zone. The card keeps working on browser-local Date
// objects: an instant is turned into a Date whose local fields are its wall-clock time in that zone
// (ccInZone), and back (ccFromZone). Null, so nothing is shifted, when the setting is "local", the zone
// is unknown, or it is the browser's own.
var ccZoneFmts = {};
function ccZoneFmt(tz) {
  if (!Object.hasOwn(ccZoneFmts, tz)) {
    try {
      ccZoneFmts[tz] = new Intl.DateTimeFormat('en-US', {
        timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
      });
    } catch {
      ccZoneFmts[tz] = null;
    }
  }
  return ccZoneFmts[tz];
}

function ccServerZone(hass) {
  var tz = hass?.locale?.time_zone === 'server' ? hass?.config?.time_zone : null;
  if (!tz || !ccZoneFmt(tz)) return null;
  try {
    if (Intl.DateTimeFormat().resolvedOptions().timeZone === tz) return null;
  } catch { /* unknown browser zone: shift */ }
  return tz;
}

function ccInZone(d, tz) {
  if (!tz) return d;
  var p = {};
  ccZoneFmt(tz).formatToParts(d).forEach((x) => { p[x.type] = Number(x.value); });
  return new Date(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second, d.getMilliseconds());
}

// The instant of a wall-clock time in `tz` (month from 0). A time skipped by a daylight saving change
// lands an hour later, one repeated by it on its first occurrence.
function ccFromZone(y, mo, day, h, mi, tz) {
  var wall = Date.UTC(y, mo, day, h, mi);
  var offset = (t) => {
    var w = ccInZone(new Date(t), tz);
    return Date.UTC(w.getFullYear(), w.getMonth(), w.getDate(), w.getHours(), w.getMinutes(), w.getSeconds()) - Math.floor(t / 1000) * 1000;
  };
  var t = wall - offset(wall);
  var t2 = wall - offset(t);
  return new Date(offset(t2) === wall - t2 ? t2 : t);
}

// A shifted Date (see ccInZone) back to its instant.
function ccOutZone(d, tz) {
  return tz ? ccFromZone(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), tz) : d;
}

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

// Workday badge: the `binary_sensor` of `workday_entity`, else the first one of the Workday integration;
// `workday_entity: false` turns it off.
function ccWorkday(config, hass) {
  var v = config.workday_entity;
  if (v === false || v === 'none') return null;
  if (typeof v === 'string' && v) return hass?.states?.[v] ? v : null;
  var e = Object.values(hass?.entities || {}).find((x) => x?.platform === 'workday' && String(x.entity_id).indexOf('binary_sensor.') === 0 && hass.states?.[x.entity_id]);
  return e ? e.entity_id : null;
}

// `todo_entities`: to-do lists (Bring!, Local To-do…) as entity ids or objects { entity, name }.
function ccTodoLists(config, hass) {
  return ccList(config.todo_entities).map((item) => {
    var t = typeof item === 'string' ? { entity: item } : Object.assign({}, item);
    t.name = t.name || hass?.states?.[t.entity]?.attributes?.friendly_name || t.entity;
    return t;
  }).filter((t) => t.entity && String(t.entity).indexOf('todo.') === 0);
}

// A to-do item's due date ("2026-11-20" or a date and time) as a local Date, or null.
function ccDue(v) {
  if (!v) return null;
  var d = /^\d{4}-\d{2}-\d{2}$/.test(v) ? ccLocalDate(v) : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
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
    uid: raw.uid || '', recurrence_id: raw.recurrence_id || '', rrule: raw.rrule || '', cal: cal,
  };
}

// The same event in several calendars (a shared invitation, same uid) is listed once, from the first
// calendar. Events without a uid, or with different uids, are all kept even when their title and times
// match: they are distinct events (each can be changed or deleted in its own calendar).
function ccDedupe(events) {
  var seen = new Set();
  return events.filter((e) => {
    if (!e.uid) return true;
    var k = `${e.uid}|${e.recurrence_id}|${+e.start}|${+e.end}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// Stable identity of an event across fetches and re-renders (row indexes shift as events end or change).
function ccEvKey(e) {
  return `${e.cal}|${e.uid}|${e.summary}|${+e.start}|${+e.end}`;
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
      // The new event form stays open: a click elsewhere would lose what was typed.
      if (this._adding) return;
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
      // The form's fields are kept on the card as they are typed: a render puts them back.
      this.shadowRoot.addEventListener('input', (ev) => this._onField(ev));
      this.shadowRoot.addEventListener('change', (ev) => this._onField(ev));
      // Week view: a horizontal swipe over the days shows the previous or the next week.
      this.shadowRoot.addEventListener('pointerdown', (ev) => {
        this._swipe = ev.composedPath().some((n) => n.classList?.contains('weekwrap')) ? { x: ev.clientX, y: ev.clientY } : null;
      });
      this.shadowRoot.addEventListener('pointerup', (ev) => this._onSwipe(ev));
    }
    this._sig = null;
    this._fetchKey = null;
    this._update();
  }

  set hass(hass) {
    this._hass = hass;
    this._update();
  }

  // The open event's key (see _evKeyAt). Another event, or none, drops the delete confirmation and its
  // error: reopening the event shows its details, not the old confirmation. The popup stays busy only
  // for an event whose delete is still pending (`_deleting`), so it cannot be deleted twice.
  get _detail() { return this._detailKey; }

  set _detail(key) {
    if (key !== this._detailKey) {
      this._confirm = null;
      this._popErr = '';
      this._popBusy = key != null && key === this._deleting;
    }
    this._detailKey = key;
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

  // Server time zone to show and enter times in, or null for the browser's (see ccServerZone).
  _tz() { return ccServerZone(this._hass); }

  // Now, as a Date in the zone the agenda is shown in.
  _now() { return ccInZone(new Date(), this._tz()); }

  _days() {
    if (this._week()) return 7;
    return Math.max(1, Math.min(62, Number(this._config.days_to_show) || CC_DEFAULTS.days_to_show));
  }

  // `view: week`: the full card lays the 7 days from today side by side (the mini card keeps its list).
  _week() { return this._config.view === 'week' && !this._compact(); }

  // First day shown: today, or a whole number of weeks before / after it in the week view (the arrows, a swipe).
  _from(now) {
    var off = this._week() ? this._weekOff || 0 : 0;
    return ccAddDays(ccDayStart(now), 7 * off);
  }

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

  // Abbreviated weekday (date column, header logo, next-event line). Some of the newer languages
  // get long ones from Intl (Latvian "Ceturtd") that overflow the 40px date column: there the whole week is
  // cut to its first three letters (Cet), so the days stay alike. The earlier languages keep Intl's form.
  // Checked once per locale.
  _wdShort(d) {
    var lang = this._fmtLang();
    if (this._wdCutLang !== lang) {
      this._wdCutLang = lang;
      this._wdCut = !/^(en|fr|de|es|sr|it|nl|pt|pl)(-|$)/i.test(lang) && [...Array(7)].some((_, i) => this._dateFmt(new Date(2026, 0, 5 + i), { weekday: 'short' }).replace('.', '').length > 5);
    }
    var w = this._dateFmt(d, { weekday: 'short' }).replace('.', '');
    return this._wdCut ? w.slice(0, 3) : w;
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
    // The new event form is open: nothing redraws under it (inputs, caret and focus stay as they are).
    if (this._adding && this._formShown) return;
    var cals = ccCalendars(this._config, this._hass);
    this._cals = cals;
    var tz = this._tz();
    var now = ccInZone(new Date(), tz);
    // Cheap pre-check: a hass update that touches neither the calendar entities, the minute, the
    // language / time format nor the card state cannot change the fetch key or the render — skip the
    // two JSON.stringify below. `_sig = null` (set by setConfig, the minute timer and a resolved fetch)
    // forces a full pass. While the details popup is open the minute is left out, so the next hass
    // update after a minute change does not re-render (and reset the popup's scroll) underneath it.
    var minute = this._detail != null ? '' : Math.floor(Date.now() / 60000);
    var loc = this._hass.locale || {};
    var workday = ccWorkday(this._config, this._hass);
    var todos = ccTodoLists(this._config, this._hass);
    var watched = cals.map((c) => c.entity).concat(todos.map((t) => t.entity), workday ? [workday] : []);
    var tick = `${watched.map((id) => this._hass.states[id]?.last_updated || '').join('|')}|${this._todoAt || 0}|${minute}|${this._detail}|${this._expanded}|${this._zoomed}|${!!this._adding}|${this._confirm}` +
      `|${this._hass.language}|${loc.language}|${loc.time_format}|${tz}|${this._weekOff || 0}`;
    if (this._sig != null && tick === this._tick) return;
    this._tick = tick;
    // Fetch again when the calendars, the range or the day change, when a calendar entity changes
    // (an event starts or ends) and every 5 minutes.
    var key = JSON.stringify([cals.map((c) => c.entity), this._config.school_holidays_calendar || '', this._days(), ccKey(now), tz, this._weekOff || 0,
      cals.map((c) => this._hass.states[c.entity]?.last_changed || '')]);
    if (cals.length && (key !== this._fetchKey || Date.now() - this._fetchedAt > CC_REFRESH)) {
      this._fetchKey = key;
      this._fetch(cals);
    }
    // To-do lists: fetched again when one of them changes (its state is the count of open items).
    var todoKey = JSON.stringify(todos.map((t) => [t.entity, this._hass.states[t.entity]?.last_updated || '']));
    if (todos.length && (todoKey !== this._todoKey || Date.now() - (this._todoFetched || 0) > CC_REFRESH)) {
      this._todoKey = todoKey;
      this._fetchTodos(todos);
    } else if (!todos.length) this._todos = [];
    var sig = JSON.stringify([this._lang(), this._fmtLang(), this._fetchedAt, this._weekOff || 0, this._detail, this._expanded, this._zoomed, !!this._adding, this._form?.error, this._form?.busy, this._form?.confirm,
      this._confirm, this._popErr, this._popBusy,
      minute, cals.map((c) => [c.entity, c.color, c.name]), this._hass.locale?.time_format, tz,
      workday ? this._hass.states[workday]?.state : '', this._todoAt || 0, todos.map((t) => t.name)]);
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
    var wasAdding = !!this._formWas;
    this._render(cals, now);
    this._popShown = this._detail;
    this._formWas = !!this._adding;
    this._formShown = !!this._adding;
    // The form is taller than a short agenda: the card grows to hold it, so its buttons are never cut.
    var formPop = this._adding && this.shadowRoot.querySelector('.pop.form');
    if (formPop) formPop.parentNode.style.minHeight = `${formPop.scrollHeight + 16}px`;
    if (this._adding && this._focusForm) {
      this._focusForm = false;
      this.shadowRoot.querySelector('[data-f="summary"]')?.focus({ preventScroll: true });
    }
    if (popScroll && popShown != null && popShown === this._detail) {
      var pop = this.shadowRoot.querySelector('.pop'); if (pop) pop.scrollTop = popScroll;
    }
    var at = focused != null ? this._evIndex(focused) : -1;
    // preventScroll: a re-render from a hass update must not scroll the page to the card.
    if (at >= 0) this.shadowRoot.querySelector(`[data-ev="${at}"]`)?.focus({ preventScroll: true });
    this._moveFocus(popShown, wasAdding);
  }

  // Dialog focus: a details popup that opens (or shows another event) takes the focus on its close
  // button; when the popup or the form closes, the focus goes back to the event row it was opened from
  // (or to the + button for a new event), so a keyboard user does not lose their place.
  _moveFocus(popShown, wasAdding) {
    var q = (sel) => this.shadowRoot.querySelector(sel);
    var focus = (el) => el?.focus({ preventScroll: true });
    if (this._detail != null && popShown !== this._detail) {
      this._returnTo = this._detail;
      focus(q('.pop [data-action="close"]'));
      return;
    }
    if (this._adding) {
      // Opened from the details popup (Edit): back to that event's row on close.
      if (!wasAdding && popShown != null) this._returnTo = popShown;
      else if (!wasAdding) this._returnTo = null;
      return;
    }
    if (popShown == null && !wasAdding) return;
    var key = this._returnTo;
    this._returnTo = null;
    var at = key != null ? this._evIndex(key) : -1;
    focus(at >= 0 ? q(`[data-ev="${at}"]`) : wasAdding ? q('.addb') : null);
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
    var tz = this._tz();
    var from = this._from(ccInZone(new Date(), tz));
    var to = ccAddDays(from, this._days());
    var q = `?start=${encodeURIComponent(ccOutZone(from, tz).toISOString())}&end=${encodeURIComponent(ccOutZone(to, tz).toISOString())}`;
    // Set before the await, so a `set hass` while the request is pending does not refetch.
    this._fetchedAt = Date.now();
    // School holidays: the events of `school_holidays_calendar` mark the days they cover, without being listed.
    var hol = this._config.school_holidays_calendar;
    var holReq = hol ? this._hass.callApi('GET', `calendars/${hol}${q}`).catch(() => null) : Promise.resolve([]);
    var res = await Promise.allSettled(cals.map((c) => this._hass.callApi('GET', `calendars/${c.entity}${q}`)));
    var holRes = await holReq;
    if (seq !== this._fetchSeq) return;
    // A failed holiday request keeps the days already marked.
    if (holRes) this._holidays = (Array.isArray(holRes) ? holRes : []).map((raw) => ccParse(raw, -1)).filter(Boolean);
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
        if (!e) return;
        // Timed events in the server's zone (all-day ones are dates, in no zone).
        if (tz && !e.allDay) Object.assign(e, { start: ccInZone(e.start, tz), end: ccInZone(e.end, tz) });
        events.push(e);
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

  // The open items of the to-do lists (todo/item/list); a list that fails keeps its last items.
  async _fetchTodos(lists) {
    var seq = (this._todoSeq = (this._todoSeq || 0) + 1);
    this._todoFetched = Date.now();
    var res = await Promise.allSettled(lists.map((t) => this._hass.callWS({ type: 'todo/item/list', entity_id: t.entity })));
    if (seq !== this._todoSeq) return;
    var prev = this._todos || [];
    this._todos = lists.map((t, i) => {
      var ok = res[i].status === 'fulfilled';
      var items = ok ? (res[i].value?.items || []).filter((x) => x && x.status !== 'completed')
        : (prev.find((p) => p.entity === t.entity)?.items || []);
      return { entity: t.entity, name: t.name, items: items, failed: !ok };
    });
    this._todoAt = Date.now();
    this._sig = null;
    this._update();
  }

  // Check off a to-do item: shown done at once, the list is fetched again when its entity changes.
  _todoDone(li, uid) {
    var list = this._todos?.[li];
    var item = list?.items.find((x) => x.uid === uid);
    if (!item) return;
    list.items = list.items.filter((x) => x !== item);
    this._todoAt = Date.now();
    Promise.resolve(this._hass.callService('todo', 'update_item', { item: uid, status: 'completed' }, { entity_id: list.entity }))
      .catch(() => { this._todoKey = null; this._sig = null; this._update(); });
  }

  // The to-do lists under the agenda: each list's name and open items, a round check button before each item.
  _todoHtml(now) {
    if (!this._todos?.length) return '';
    var lists = this._todos.map((t, li) => {
      var items = t.items.map((x) => {
        var due = ccDue(x.due);
        var dueHtml = due ? `<span class="tdue${due < ccDayStart(now) ? ' late' : ''}">${ccEsc(this._dateFmt(due, { day: 'numeric', month: 'short' }))}</span>` : '';
        var label = `${this._t('todo_done')} · ${x.summary}`;
        return `<div class="titem"><button class="tcheck" data-action="todo-done" data-list="${li}" data-uid="${ccEsc(x.uid)}" title="${ccEsc(label)}" aria-label="${ccEsc(label)}">` +
          `<ha-icon icon="mdi:checkbox-blank-circle-outline"></ha-icon></button><span class="tsum">${ccEsc(x.summary)}</span>${dueHtml}</div>`;
      }).join('');
      return `<div class="tlist"><div class="thead"><ha-icon icon="mdi:format-list-checks"></ha-icon><span class="tname">${ccEsc(t.name)}</span>` +
        `${t.items.length ? `<span class="tcount">${t.items.length}</span>` : ''}</div>${items || `<div class="none">${this._t('todo_empty')}</div>`}</div>`;
    });
    return `<div class="todos">${lists.join('')}</div>`;
  }

  // The school holiday that covers a day, or null.
  _holidayOn(date) {
    var next = ccAddDays(date, 1);
    return (this._holidays || []).find((h) => h.start < next && h.end > date) || null;
  }

  // Under the title: the workday badge (working day / day off) and today's school holiday.
  _chipsHtml(now) {
    var chips = [];
    var wd = ccWorkday(this._config, this._hass);
    var st = wd ? this._hass.states[wd]?.state : '';
    if (st === 'on' || st === 'off') {
      var off = st === 'off';
      chips.push(`<span class="chip${off ? ' off' : ''}"><ha-icon icon="${off ? 'mdi:beach' : 'mdi:briefcase-outline'}"></ha-icon>${ccEsc(this._t(off ? 'day_off' : 'workday'))}</span>`);
    }
    var hol = this._holidayOn(ccDayStart(now));
    if (hol) chips.push(`<span class="chip hol" title="${ccEsc(hol.summary)}"><ha-icon icon="mdi:school-outline"></ha-icon>${ccEsc(hol.summary || this._t('school_holidays'))}</span>`);
    return chips.length ? `<div class="chips">${chips.join('')}</div>` : '';
  }

  _visibleDays(now) {
    var c = this._config;
    var events = this._events.filter((e) => !ccExcluded(e, c.exclude) && this._cals[e.cal]);
    // A past week shows its events, whatever show_past_events says (it only trims today's agenda).
    return ccByDay(events, this._from(now), this._days(), now, c.show_past_events || (this._week() && (this._weekOff || 0) < 0));
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

  // One column of the week view: the day, then its events as short tiles (time and title, the calendar's color).
  _weekColHtml(day, events, now, firstIdx) {
    var isToday = ccKey(day.date) === ccKey(now);
    var evs = events.map((e, i) => {
      var cal = this._cals[e.cal];
      var ongoing = !e.allDay && e.start <= now && e.end > now;
      var when = e.allDay ? this._t('all_day') : (ccKey(e.start) === ccKey(day.date) ? this._timeFmt(e.start) : '…');
      return `<div class="wev${ongoing ? ' ongoing' : ''}${e.end <= now && !e.allDay ? ' past' : ''}${e.allDay ? ' allday' : ''}" style="--c:${ccEsc(cal.color)};--c-on:${ccEsc(ccOnColor(cal.color))}" data-ev="${firstIdx + i}" role="button" tabindex="0" title="${ccEsc(`${this._when(e)} · ${e.summary}`)}">` +
        `<span class="wt">${ccEsc(when)}</span><span class="ws">${ccEsc(e.summary)}</span></div>`;
    }).join('');
    var hol = this._holidayOn(day.date);
    return `<div class="wcol${isToday ? ' today' : ''}${hol ? ' hol' : ''}"><div class="whead"${hol ? ` title="${ccEsc(hol.summary || this._t('school_holidays'))}"` : ''}><span class="wd">${ccEsc(this._wdShort(day.date))}</span><span class="dn">${day.date.getDate()}</span></div>` +
      `<div class="wevs">${evs || '<div class="none">–</div>'}</div></div>`;
  }

  _dayHtml(day, events, now, firstIdx, cont) {
    var isToday = ccKey(day.date) === ccKey(now);
    var isTomorrow = ccKey(day.date) === ccKey(ccAddDays(now, 1));
    var wd = this._wdShort(day.date);
    var label = isToday ? this._t('today') : (isTomorrow ? this._t('tomorrow') : '');
    var date = cont ? '<div class="date"></div>'
      : `<div class="date${isToday ? ' today' : ''}"><span class="wd">${ccEsc(wd)}</span><span class="dn">${day.date.getDate()}</span>` +
        `<span class="mo">${ccEsc(this._monthShort(day.date))}</span></div>`;
    var body = events.length
      ? events.map((e, i) => this._eventHtml(e, now, firstIdx + i, isToday)).join('')
      : `<div class="none">${this._t('no_events')}</div>`;
    var hol = cont ? null : this._holidayOn(day.date);
    var holHtml = hol ? `<div class="dhol" title="${ccEsc(hol.summary)}"><ha-icon icon="mdi:school-outline"></ha-icon><span>${ccEsc(hol.summary || this._t('school_holidays'))}</span></div>` : '';
    return `<div class="day${cont ? ' cont' : ''}">${date}<div class="events">${label && !cont ? `<div class="dlabel">${ccEsc(label)}</div>` : ''}${holHtml}${body}</div></div>`;
  }

  // Shared by the full and mini cards: the "N events today" counter is a status badge at the right
  // of the header, like the other ha-* cards.
  _headerHtml(now, sub) {
    // Locale-aware upper case: Greek drops its accents (ΤΡΙ, not ΤΡΊ).
    var wd = this._wdShort(now).toLocaleUpperCase(this._fmtLang());
    return '<div class="header">' + ccLogo(wd, now.getDate()) +
      `<div class="titles">${this._config.show_title !== false ? `<div class="name">${ccEsc(this._config.title || this._t('agenda'))}</div>` : ''}${this._chipsHtml(now)}</div>` +
      `<span class="st" title="${ccEsc(sub)}"><span class="dot"></span><span class="stt">${ccEsc(sub)}</span></span>${this._addButton()}${this._zoomButton()}</div>`;
  }

  // Above the week: the arrows, its dates, and Today when another week is shown.
  _weekNavHtml(days) {
    if (!days.length) return '';
    var fmt = new Intl.DateTimeFormat(this._fmtLang(), { day: 'numeric', month: 'short' });
    var off = this._weekOff || 0;
    var btn = (action, label, icon) => `<button class="wbtn" data-action="${action}" title="${ccEsc(this._t(label))}" aria-label="${ccEsc(this._t(label))}"><ha-icon icon="${icon}"></ha-icon></button>`;
    return `<div class="wnav">${btn('week-prev', 'prev_week', 'mdi:chevron-left')}` +
      `<span class="wrange" aria-live="polite">${ccEsc(fmt.format(days[0].date))} – ${ccEsc(fmt.format(days[days.length - 1].date))}</span>` +
      (off ? `<button class="wtoday" data-action="week-today">${ccEsc(this._t('today'))}</button>` : '') +
      `${btn('week-next', 'next_week', 'mdi:chevron-right')}</div>`;
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
  // Whether the calendar at index i in this._cals has a feature (CC_CREATE, CC_DELETE, CC_UPDATE).
  _supports(i, flag) {
    var c = this._cals?.[i];
    return !!c && (Number(this._hass?.states[c.entity]?.attributes?.supported_features) & flag) === flag;
  }

  // Calendars of the card that accept new events (Local Calendar, CalDAV, Google…), by index in this._cals.
  _writable() {
    return (this._cals || []).map((c, i) => ({ c, i })).filter(({ i }) => this._supports(i, CC_CREATE));
  }

  _addButton() {
    if (this._config.add_button === false || this._compact() || !this._writable().length) return '';
    var label = ccEsc(this._t('add_event'));
    return `<button class="addb" data-action="add" title="${label}" aria-label="${label}"><ha-icon icon="mdi:plus"></ha-icon></button>`;
  }

  // Edit / delete buttons of the details popup: full card, an event with a uid, a calendar that allows it.
  _canChange(e, flag) {
    return this._config.edit_buttons !== false && !this._compact() && !!e.uid && this._supports(e.cal, flag);
  }

  // The new event form, or the edit form of an event (pre-filled, saved with calendar/event/update).
  // `span` is the number of days from the start date to the end date: the end date follows the start's.
  _openForm(e) {
    var f = {
      summary: '', cal: this._writable()[0]?.i ?? 0, all_day: false, ...ccFormTimes(this._now()), span: 0, location: '', description: '', error: '', busy: false,
    };
    if (e) {
      // An all-day event's end is the day after its last day.
      var last = e.allDay ? ccAddDays(e.end, -1) : e.end;
      Object.assign(f, {
        summary: e.summary, cal: e.cal, all_day: e.allDay, date: ccIso(e.start), span: Math.max(0, ccDaysBetween(ccIso(e.start), ccIso(last))),
        location: e.location, description: e.description, edit: { uid: e.uid, recurrence_id: e.recurrence_id, rrule: e.rrule },
      });
      if (!e.allDay) Object.assign(f, { start: ccHm(e.start), end: ccHm(e.end) });
    }
    this._form = f;
    this._adding = true;
    this._detail = null;
    this._formShown = false;
    this._focusForm = true;
  }

  _closeForm() {
    this._adding = false;
    this._form = null;
    this._formShown = false;
  }

  _onField(ev) {
    var key = ev.target?.dataset?.f;
    if (!key || !this._form) return;
    var t = ev.target;
    if (key === 'end_date') {
      if (t.value && this._form.date) this._form.span = ccDaysBetween(this._form.date, t.value);
      return;
    }
    this._form[key] = t.type === 'checkbox' ? t.checked : key === 'cal' ? Number(t.value) : t.value;
    // All day hides the times: redraw the form (its values come from this._form).
    if (key === 'all_day') this._redrawForm();
  }

  _redrawForm() {
    this._formShown = false;
    this._sig = null;
    this._update();
  }

  // Read the calendars again: a new, changed or deleted event shows at once.
  _refetch() {
    this._fetchKey = null;
    this._sig = null;
    this._update();
  }

  _endDate() {
    var f = this._form;
    return f.date ? ccIso(ccAddDays(ccLocalDate(f.date), f.span)) : '';
  }

  // The action's data: start/end dates (the end the day after the end date, exclusive) or start/end
  // date-times.
  _eventData() {
    var f = this._form;
    var data = { summary: f.summary.trim() };
    if (f.location.trim()) data.location = f.location.trim();
    if (f.description.trim()) data.description = f.description.trim();
    if (f.all_day) {
      data.start_date = f.date;
      data.end_date = ccIso(ccAddDays(ccLocalDate(f.date), f.span + 1));
    } else {
      data.start_date_time = ccUtc(f.date, f.start, this._tz());
      data.end_date_time = ccUtc(this._endDate(), f.end, this._tz());
    }
    return data;
  }

  // calendar/event/update message of the edited event. A change to one instance of a recurring event
  // cannot carry the recurrence rule; a change to it and the following ones keeps it, like the Home
  // Assistant calendar panel.
  _updateMsg(entity, range) {
    var f = this._form, ed = f.edit, d = this._eventData();
    var event = { summary: d.summary, dtstart: d.start_date || d.start_date_time, dtend: d.end_date || d.end_date_time };
    if (d.location) event.location = d.location;
    if (d.description) event.description = d.description;
    if (ed.rrule && (range === CC_FUTURE || !ed.recurrence_id)) event.rrule = ed.rrule;
    var msg = { type: 'calendar/event/update', entity_id: entity, uid: ed.uid };
    if (ed.recurrence_id) {
      msg.recurrence_id = ed.recurrence_id;
      if (range) msg.recurrence_range = range;
    }
    msg.event = event;
    return msg;
  }

  // `range` answers "this event or this and the following ones?" for an instance of a recurring event
  // ('' or CC_FUTURE); the form asks it first.
  async _saveForm(range) {
    var f = this._form;
    if (!f || f.busy) return;
    if (!f.summary.trim()) f.error = this._t('ev_need_title');
    // A date or time field left empty (or half typed: the input's value is then '').
    else if (!ccDateOk(f.date) || (!f.all_day && !(ccTimeOk(f.start) && ccTimeOk(f.end)))) f.error = this._t('ev_bad_when');
    else if (!(f.span >= 0) || (!f.all_day && !f.span && f.end <= f.start)) f.error = this._t('ev_bad_end');
    else f.error = '';
    f.confirm = !f.error && !!f.edit?.recurrence_id && range == null;
    if (f.error || f.confirm) return this._redrawForm();
    var cal = this._cals[f.cal];
    f.busy = true;
    this._redrawForm();
    try {
      if (f.edit) await this._hass.callWS(this._updateMsg(cal.entity, range));
      else await this._hass.callService('calendar', 'create_event', this._eventData(), { entity_id: cal.entity });
      this._closeForm();
      this._refetch();
    } catch (err) {
      f.busy = false;
      f.error = this._t(f.edit ? 'ev_save_failed' : 'ev_failed').replace('{e}', err?.message || String(err));
      this._redrawForm();
    }
  }

  // Buttons at the bottom of a form or a confirmation: Cancel, then the actions (no filled button).
  _btnsHtml(cancel, actions, busy) {
    return `<div class="fbtns"><button class="fbtn" data-action="${cancel}">${ccEsc(this._t('ev_cancel'))}</button>` +
      actions.map(([action, label, icon, cls]) => `<button class="fbtn ${cls}" data-action="${action}"${busy ? ' disabled' : ''}>` +
        `<ha-icon icon="${busy ? 'mdi:loading' : icon}"></ha-icon>${ccEsc(this._t(label))}</button>`).join('') + '</div>';
  }

  _formHtml() {
    var f = this._form;
    var cals = this._writable();
    var cal = this._cals[f.cal] || cals[0]?.c;
    var title = ccEsc(this._t(f.edit ? 'edit_event' : 'add_event'));
    var field = (key, label, input) => `<label class="ff ff-${key}"><span>${ccEsc(this._t(label))}</span>${input}</label>`;
    // Start and end: a date and, unless all day, a time.
    var when = (key, label, dateKey, date, timeKey, time) => {
      var l = ccEsc(this._t(label));
      return `<div class="ff ff-${key}" role="group" aria-label="${l}"><span>${l}</span><div class="fdt">` +
        `<input type="date" data-f="${dateKey}" value="${ccEsc(date)}" aria-label="${l}">` +
        (f.all_day ? '' : `<input type="time" data-f="${timeKey}" value="${ccEsc(time)}" aria-label="${l}">`) + '</div></div>';
    };
    var options = cals.map(({ c, i }) => `<option value="${i}"${i === f.cal ? ' selected' : ''}>${ccEsc(c.name)}</option>`).join('');
    var btns = f.confirm
      ? `<div class="fask">${ccEsc(this._t('ev_apply_to'))}</div>` +
        this._btnsHtml('back-edit', [['save-one', 'ev_this', 'mdi:check', 'primary'], ['save-future', 'ev_future', 'mdi:check-all', 'primary']], f.busy)
      : this._btnsHtml('cancel-add', [['save-add', f.edit ? 'ev_save' : 'ev_add', 'mdi:check', 'primary']], f.busy);
    return `<div class="pop form" role="dialog" aria-modal="true" aria-label="${title}" style="--c:${ccEsc(cal?.color || CC_COLORS[0])}">` +
      `<div class="phead"><span class="cbar"></span><div class="ptitle">${title}</div>` +
      `<button class="pclose" data-action="cancel-add" title="${ccEsc(this._t('ev_cancel'))}" aria-label="${ccEsc(this._t('ev_cancel'))}"><ha-icon icon="mdi:close"></ha-icon></button></div>` +
      field('summary', 'ev_title', `<input type="text" data-f="summary" value="${ccEsc(f.summary)}" maxlength="200" autocomplete="off">`) +
      // An edited event stays in its calendar.
      (cals.length > 1 && !f.edit ? field('cal', 'ev_calendar', `<select data-f="cal">${options}</select>`) : '') +
      `<label class="fcheck"><input type="checkbox" data-f="all_day"${f.all_day ? ' checked' : ''}><span>${ccEsc(this._t('all_day'))}</span></label>` +
      when('start', 'ev_start', 'date', f.date, 'start', f.start) +
      when('end', 'ev_end', 'end_date', this._endDate(), 'end', f.end) +
      field('location', 'ev_location', `<input type="text" data-f="location" value="${ccEsc(f.location)}" maxlength="200" autocomplete="off">`) +
      field('description', 'ev_description', `<textarea data-f="description" rows="3" maxlength="2000">${ccEsc(f.description)}</textarea>`) +
      (f.error ? `<div class="ferr" role="alert">${ccEsc(f.error)}</div>` : '') +
      btns + '</div>';
  }

  // Delete confirmation of the event in the details popup, under its title: an instance of a recurring
  // event offers this event only, or this one and the following ones.
  _confirmHtml(e) {
    if (this._confirm == null || this._confirm !== this._detail) return '';
    var actions = e.recurrence_id
      ? [['delete-one', 'ev_this', 'mdi:delete-outline', 'danger'], ['delete-future', 'ev_future', 'mdi:delete-sweep-outline', 'danger']]
      : [['delete-one', 'ev_delete', 'mdi:delete-outline', 'danger']];
    return `<div class="pconf"><div class="fask">${ccEsc(this._t('ev_delete_confirm'))}</div>` +
      (this._popErr ? `<div class="ferr" role="alert">${ccEsc(this._popErr)}</div>` : '') +
      this._btnsHtml('cancel-delete', actions, this._popBusy) + '</div>';
  }

  _detailEvent() {
    var item = this._detail != null && this._flat?.[this._evIndex(this._detail)];
    return item ? item.e : null;
  }

  async _deleteEvent(range) {
    var e = this._detailEvent();
    var key = this._detail;
    if (!e || this._popBusy || this._deleting === key) return;
    var msg = { type: 'calendar/event/delete', entity_id: this._cals[e.cal].entity, uid: e.uid };
    if (e.recurrence_id) {
      msg.recurrence_id = e.recurrence_id;
      if (range) msg.recurrence_range = range;
    }
    this._deleting = key;
    this._popBusy = true;
    this._popErr = '';
    this._sig = null;
    this._update();
    // The popup may have been closed, or show another event, by the time the answer comes: the
    // outcome only touches the popup when it still shows the deleted event.
    try {
      await this._hass.callWS(msg);
      this._deleting = null;
      if (this._detail === key) this._detail = null;
      this._refetch();
    } catch (err) {
      this._deleting = null;
      if (this._detail === key) {
        this._popBusy = false;
        this._popErr = this._t('ev_delete_failed').replace('{e}', err?.message || String(err));
      }
      this._sig = null;
      this._update();
    }
  }

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

    if (this._week()) {
      var at = 0;
      var cols = days.map((d) => {
        var html = this._weekColHtml(d, d.events, now, at);
        at += d.events.length;
        return html;
      });
      this._shown = this._flat.length;
      this.shadowRoot.innerHTML = this._styles(accent) + `<ha-card class="${this._detail != null || this._adding ? 'popped' : ''}" lang="${ccEsc(this._fmtLang())}">` +
        (c.show_header ? this._headerHtml(now, this._todaySub(days)) : '') +
        this._weekNavHtml(days) +
        `<div class="weekwrap"><div class="week">${cols.join('')}</div></div>${this._todoHtml(now)}${this._errorHtml()}${this._popupHtml()}</ha-card>`;
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

    this.shadowRoot.innerHTML = this._styles(accent) + `<ha-card class="${this._detail != null || this._adding ? 'popped' : ''}" lang="${ccEsc(this._fmtLang())}">` +
      // An unfolded mini card keeps its header whatever show_header says: it holds the fold button.
      (c.show_header || this._zoomed ? this._headerHtml(now, this._todaySub(days)) : '') +
      `<div class="list">${list}</div>${moreHtml}${this._todoHtml(now)}${this._errorHtml()}${this._popupHtml()}</ha-card>`;
  }

  // Event details, at the top of the card.
  _popupHtml() {
    if (this._adding && this._form) return this._formHtml();
    var e = this._detailEvent();
    if (!e) return '';
    var cal = this._cals[e.cal];
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
    var btn = (action, label, icon) => `<button class="pclose" data-action="${action}" title="${ccEsc(this._t(label))}" aria-label="${ccEsc(this._t(label))}"><ha-icon icon="${icon}"></ha-icon></button>`;
    return `<div class="pop" role="dialog" aria-modal="true" aria-label="${ccEsc(e.summary)}" style="--c:${ccEsc(cal.color)}">` +
      `<div class="phead"><span class="cbar"></span><div class="ptitle">${ccEsc(e.summary)}</div>` +
      (this._canChange(e, CC_UPDATE) ? btn('edit', 'edit_event', 'mdi:pencil-outline') : '') +
      (this._canChange(e, CC_DELETE) ? btn('delete', 'delete_event', 'mdi:delete-outline') : '') +
      `${btn('close', 'close', 'mdi:close')}</div>${this._confirmHtml(e)}${rows.join('')}</div>`;
  }

  _onSwipe(ev) {
    var start = this._swipe;
    this._swipe = null;
    if (!start || !this._week()) return;
    var dx = ev.clientX - start.x, dy = ev.clientY - start.y;
    if (Math.abs(dx) < CC_SWIPE || Math.abs(dx) < 2 * Math.abs(dy)) return;
    this._weekOff = (this._weekOff || 0) + (dx < 0 ? 1 : -1);
    this._detail = null;
    // The click that follows the swipe must not open the event under the finger.
    this._swiped = Date.now();
    this._update();
  }

  _onClick(ev) {
    if (this._swiped && Date.now() - this._swiped < 400) {
      this._swiped = 0;
      return;
    }
    var path = ev.composedPath();
    var btn = path.find((n) => n.dataset?.action);
    if (btn) {
      switch (btn.dataset.action) {
        case 'more': this._expanded = !this._expanded; break;
        case 'todo-done': this._todoDone(Number(btn.dataset.list), btn.dataset.uid); break;
        case 'week-prev': this._weekOff = (this._weekOff || 0) - 1; this._detail = null; break;
        case 'week-next': this._weekOff = (this._weekOff || 0) + 1; this._detail = null; break;
        case 'week-today': this._weekOff = 0; this._detail = null; break;
        case 'close': this._detail = null; break;
        case 'zoom': this._zoomed = !this._zoomed; this._detail = null; break;
        case 'add': this._openForm(); break;
        case 'cancel-add': this._closeForm(); break;
        case 'save-add': this._saveForm(); return;
        case 'save-one': this._saveForm(''); return;
        case 'save-future': this._saveForm(CC_FUTURE); return;
        case 'back-edit': this._form.confirm = false; this._redrawForm(); return;
        case 'edit': { var e = this._detailEvent(); if (e) this._openForm(e); break; }
        case 'delete': this._confirm = this._detail; this._popErr = ''; break;
        case 'cancel-delete': this._confirm = null; break;
        case 'delete-one': this._deleteEvent(''); return;
        case 'delete-future': this._deleteEvent(CC_FUTURE); return;
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
    if (this._adding) return;
    // A click on the card outside the popup closes it.
    if (this._detail != null && !path.some((n) => n.classList?.contains('pop'))) {
      this._detail = null;
      this._update();
    }
  }

  _onKey(ev) {
    if (this._adding) {
      if (ev.key === 'Escape') {
        this._closeForm();
        this._update();
      } else if (ev.key === 'Enter' && ev.target?.tagName === 'INPUT' && ev.target.type !== 'checkbox') {
        ev.preventDefault();
        this._saveForm();
      }
      return;
    }
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
      // Week view: 7 columns, each day on top of its events; on a narrow card (under 7 × 72px), one day per row.
      '.weekwrap { container-type: inline-size; touch-action: pan-y; }' +
      '.wnav { display: flex; align-items: center; gap: 4px; margin: 0 0 6px; }' +
      '.wrange { flex: 1; text-align: center; font-size: 13px; font-weight: 500; color: var(--secondary-text-color); }' +
      '.wbtn { all: unset; display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; color: var(--secondary-text-color); --mdc-icon-size: 20px; }' +
      '.wbtn:hover { background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); }' +
      '.wtoday { all: unset; cursor: pointer; font-size: 12px; font-weight: 500; padding: 2px 10px; border-radius: 12px; color: var(--cc-accent); border: 1px solid color-mix(in srgb, var(--cc-accent) 50%, transparent); }' +
      '.wbtn:focus-visible, .wtoday:focus-visible { outline: 2px solid var(--cc-accent); outline-offset: 1px; }' +
      '.week { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px; }' +
      '.wcol { display: flex; flex-direction: column; gap: 4px; min-width: 0; padding: 4px 3px; border-radius: 8px; }' +
      '.wcol.today { background: color-mix(in srgb, var(--cc-accent) 10%, transparent); }' +
      '.whead { display: flex; flex-direction: column; align-items: center; line-height: 1.15; color: var(--secondary-text-color); font-size: 11px; text-transform: uppercase; }' +
      '.whead .dn { font-size: 18px; font-weight: 500; color: var(--primary-text-color); text-transform: none; }' +
      '.wcol.today .whead .dn { color: var(--cc-accent); }' +
      '.wevs { display: flex; flex-direction: column; gap: 3px; min-width: 0; }' +
      '.wevs .none { text-align: center; font-size: 12px; }' +
      '.wev { display: flex; flex-direction: column; min-width: 0; padding: 2px 5px; border-radius: 5px; cursor: pointer; font-size: 11px; line-height: 1.3;' +
        ' border-left: 3px solid var(--c); background: color-mix(in srgb, var(--c) 14%, transparent); color: var(--primary-text-color); }' +
      '.wev.allday { background: var(--c); color: var(--c-on); border-left-color: transparent; }' +
      '.wev.past { opacity: .55; }' +
      '.wev.ongoing { box-shadow: inset 0 0 0 1px var(--c); }' +
      '.wev:focus-visible { outline: 2px solid var(--cc-accent); outline-offset: 1px; }' +
      '.wt { font-variant-numeric: tabular-nums; color: var(--secondary-text-color); white-space: nowrap; }' +
      '.wev.allday .wt { color: inherit; opacity: .85; }' +
      '.ws { font-weight: 500; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow-wrap: anywhere; }' +
      '@container (max-width: 504px) {' +
        ' .week { grid-template-columns: minmax(0, 1fr); gap: 2px; }' +
        ' .wcol { flex-direction: row; align-items: flex-start; gap: 10px; }' +
        ' .whead { width: 40px; flex: none; }' +
        ' .wevs { flex: 1; }' +
        ' .wev { flex-direction: row; gap: 6px; font-size: 13px; }' +
        ' .wevs .none { text-align: start; }' +
      ' }' +
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
      // + button of the header, like the zoom button; the new event form uses the popup's frame.
      '.addb { all: unset; flex: none; cursor: pointer; width: 28px; height: 28px; margin: -4px -2px; border-radius: 50%; display: grid; place-items: center; color: var(--secondary-text-color); }' +
      '.addb ha-icon { --mdc-icon-size: 20px; }' +
      '.addb:hover { background: color-mix(in srgb, var(--secondary-text-color) 16%, transparent); color: var(--primary-text-color); }' +
      '.addb:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }' +
      '.form .ff { display: flex; flex-direction: column; gap: 3px; flex: 1 1 0; min-width: 0; font-size: 12px; color: var(--secondary-text-color); }' +
      '.form input[type=text], .form input[type=date], .form input[type=time], .form select, .form textarea { box-sizing: border-box; width: 100%; min-width: 0; padding: 7px 9px; border-radius: 8px; font: inherit; font-size: 14px;' +
        ' color: var(--primary-text-color); background: var(--secondary-background-color, rgba(128,128,128,0.12)); border: 1px solid var(--divider-color, rgba(128,128,128,0.3)); outline: none; color-scheme: light dark; }' +
      '.form input:focus, .form select:focus, .form textarea:focus { border-color: var(--c); }' +
      '.form textarea { resize: vertical; min-height: 54px; line-height: 1.35; }' +
      '.form .frow { display: flex; gap: 8px; align-items: flex-end; flex-wrap: wrap; }' +
      '.form .fcheck { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--primary-text-color); padding: 8px 0; white-space: nowrap; }' +
      '.form .fcheck input { accent-color: var(--c); }' +
      // Start and end: the date, then the time, on one line.
      '.form .fdt { display: flex; gap: 8px; }' +
      '.form .fdt input { flex: 1 1 0; }' +
      '.pop .ferr { font-size: 12px; color: var(--error-color, #db4437); }' +
      '.pop .fask { font-size: 13px; font-weight: 500; color: var(--primary-text-color); }' +
      '.pop .fbtns { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; margin-top: 2px; }' +
      // Delete confirmation, under the popup's title.
      '.pconf { display: flex; flex-direction: column; gap: 8px; padding: 0 0 8px 14px; border-bottom: 1px solid var(--divider-color, rgba(128,128,128,0.15)); }' +
      // No filled button: outlined, the main one in the calendar's colour, a delete in the error colour.
      '.pop .fbtn { display: inline-flex; align-items: center; gap: 4px; padding: 6px 14px; border-radius: 10px; font-size: 13px; font-weight: 500; background: none;' +
        ' color: var(--secondary-text-color); border: 1px solid color-mix(in srgb, var(--secondary-text-color) 35%, transparent); }' +
      '.pop .fbtn.primary { color: color-mix(in srgb, var(--c) 55%, var(--primary-text-color)); border-color: color-mix(in srgb, var(--c) 55%, transparent); }' +
      '.pop .fbtn.danger { --c: var(--error-color, #db4437); color: color-mix(in srgb, var(--c) 70%, var(--primary-text-color)); border-color: color-mix(in srgb, var(--c) 55%, transparent); }' +
      '.pop .fbtn:hover:not([disabled]) { background: color-mix(in srgb, var(--c) 10%, transparent); }' +
      '.pop .fbtn[disabled] { opacity: 0.6; cursor: default; }' +
      '.pop .fbtn ha-icon { --mdc-icon-size: 16px; }' +
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
      '.mnext { font-size: 12px; color: var(--secondary-text-color); display: flex; gap: 6px; align-items: center; min-width: 0; white-space: nowrap; overflow: hidden; border-radius: 6px; cursor: pointer; }' +
      '.mtodos { display: flex; flex-direction: column; gap: 2px; border-top: 1px solid var(--divider-color, rgba(128,128,128,0.15)); padding-top: 8px; }' +
      '.mtodo { display: flex; align-items: center; gap: 6px; min-width: 0; font-size: 12px; color: var(--secondary-text-color); border-radius: 6px; }' +
      '.mtodo[data-action] { cursor: pointer; }' +
      '.mtodo[data-action]:hover { background: color-mix(in srgb, var(--cc-accent) 12%, transparent); }' +
      '.mtodo:focus-visible { box-shadow: 0 0 0 2px var(--cc-accent); outline: none; }' +
      '.mtodo ha-icon { --mdc-icon-size: 16px; }' +
      '.mtodo .tname { color: var(--primary-text-color); font-weight: 500; }' +
      '.tcount.none { opacity: 0.6; }' +
      '.mnext:hover { background: color-mix(in srgb, var(--c) 16%, transparent); }' +
      '.mnext:focus-visible { box-shadow: 0 0 0 2px var(--c); outline: none; }' +
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
      // Workday and school holiday chips under the title; the holiday's days are tinted in the agenda and the week.
      '.chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 3px; }' +
      '.chip { display: inline-flex; align-items: center; gap: 3px; min-width: 0; max-width: 100%; padding: 0 7px 0 5px; border-radius: 10px; font-size: 11px; font-weight: 500; line-height: 18px;' +
      ' white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--secondary-text-color); background: color-mix(in srgb, var(--secondary-text-color) 12%, transparent); }' +
      '.chip ha-icon { --mdc-icon-size: 13px; flex: none; }' +
      '.chip.off, .chip.hol { color: color-mix(in srgb, var(--cc-hol) 70%, var(--primary-text-color)); background: color-mix(in srgb, var(--cc-hol) 16%, transparent); }' +
      ':host { --cc-hol: #f4511e; }' +
      '.dhol { display: flex; align-items: center; gap: 4px; min-width: 0; padding: 2px 8px 2px 6px; border-radius: 8px; font-size: 12px; color: color-mix(in srgb, var(--cc-hol) 70%, var(--primary-text-color));' +
      ' background: color-mix(in srgb, var(--cc-hol) 12%, transparent); }' +
      '.dhol ha-icon { --mdc-icon-size: 14px; flex: none; }' +
      '.dhol span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }' +
      '.wcol.hol .whead { box-shadow: inset 0 -2px 0 var(--cc-hol); }' +
      // To-do lists under the agenda.
      '.todos { display: flex; flex-direction: column; gap: 8px; border-top: 1px solid var(--divider-color, rgba(128,128,128,0.15)); padding-top: 10px; }' +
      '.thead { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; color: var(--secondary-text-color); }' +
      '.thead ha-icon { --mdc-icon-size: 16px; }' +
      '.tname { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }' +
      '.tcount { margin-left: auto; padding: 0 7px; border-radius: 10px; line-height: 18px; background: color-mix(in srgb, var(--cc-accent) 16%, transparent); color: var(--primary-text-color); }' +
      '.titem { display: flex; align-items: center; gap: 6px; min-width: 0; font-size: 14px; color: var(--primary-text-color); }' +
      '.tcheck { flex: none; display: grid; place-items: center; width: 32px; height: 32px; margin: -2px 0 -2px -4px; padding: 0; border: 0; border-radius: 50%; background: none; color: var(--secondary-text-color); cursor: pointer; }' +
      '.tcheck:hover { color: var(--cc-accent); background: color-mix(in srgb, var(--cc-accent) 12%, transparent); }' +
      '.tcheck:focus-visible { outline: 2px solid var(--cc-accent); }' +
      '.tcheck ha-icon { --mdc-icon-size: 20px; }' +
      '.tsum { flex: 1 1 0; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }' +
      '.tdue { flex: none; font-size: 12px; color: var(--secondary-text-color); }' +
      '.tdue.late { color: var(--error-color, #db4437); }' +
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
          : `${this._wdShort(second.day)} ${second.e.allDay ? '' : this._timeFmt(second.e.start)}`.trim();
        body += `<div class="mnext" style="--c:${ccEsc(cal.color)}" data-ev="${this._flat.indexOf(second)}" role="button" tabindex="0"><span>${this._t('next')}</span><span class="ndot"></span><b>${ccEsc(second.e.summary)}</b><span>${ccEsc(when)}</span></div>`;
      }
    }
    return `<ha-card class="mini${this._detail != null ? ' popped' : ''}" lang="${ccEsc(this._fmtLang())}">` +
      this._headerHtml(now, this._todaySub(days)) +
      `<div class="list">${body}</div>${this._todoSummaryHtml()}${this._errorHtml()}${this._popupHtml()}</ha-card>`;
  }

  // Folded: a line per to-do list, its name and its number of open items; a tap unfolds the card to the lists
  // (with zoom: false, the line only shows).
  _todoSummaryHtml() {
    if (!this._todos?.length) return '';
    var zoom = this._config.zoom !== false;
    var lines = this._todos.map((t) => {
      var n = t.items.length;
      var attrs = zoom ? ' data-action="zoom" role="button" tabindex="0"' : '';
      return `<div class="mtodo"${attrs}><ha-icon icon="mdi:format-list-checks"></ha-icon><span class="tname">${ccEsc(t.name)}</span>` +
        `<span class="tcount${n ? '' : ' none'}">${n}</span></div>`;
    });
    return `<div class="mtodos">${lines.join('')}</div>`;
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
      // The mini card shows the to-do lists once unfolded.
      { name: 'todo_entities', selector: { entity: { domain: 'todo', multiple: true } } },
    ].concat([
      { name: 'workday_entity', selector: { entity: { domain: 'binary_sensor', integration: 'workday' } } },
      { name: 'school_holidays_calendar', selector: { entity: { domain: 'calendar' } } },
      // The unfolded mini card is the full card: the week view and the buttons apply to it too.
      { name: 'view', selector: { select: { mode: 'dropdown', options: [{ value: 'agenda', label: ccT(this._lang(), 'view_agenda') }, { value: 'week', label: ccT(this._lang(), 'view_week') }] } } },
    ], [
      {
        type: 'grid', name: '', schema: [
          { name: 'days_to_show', selector: { number: { min: 1, max: 62, mode: 'box' } } },
          { name: 'max_events', selector: { number: { min: 0, max: 100, mode: 'box' } } },
        ],
      },
      {
        type: 'grid', name: '', schema: [
          { name: 'show_header', selector: { boolean: {} } },
          { name: 'show_title', selector: { boolean: {} } },
          { name: 'show_location', selector: { boolean: {} } },
          { name: 'show_end_time', selector: { boolean: {} } },
          { name: 'show_countdown', selector: { boolean: {} } },
          { name: 'show_empty_days', selector: { boolean: {} } },
          { name: 'show_past_events', selector: { boolean: {} } },
          { name: 'add_button', selector: { boolean: {} } },
          { name: 'edit_buttons', selector: { boolean: {} } },
        ].concat(mini ? [{ name: 'zoom', selector: { boolean: {} } }] : []),
      },
      { name: 'exclude', selector: { text: { multiple: true } } },
      {
        name: 'language',
        selector: { select: { mode: 'dropdown', options: [{ value: 'fr', label: 'Français' }, { value: 'en', label: 'English' }, { value: 'de', label: 'Deutsch' }, { value: 'es', label: 'Español' }, { value: 'sr', label: 'Српски' }, { value: 'sr-Latn', label: 'Srpski (latinica)' }, { value: 'it', label: 'Italiano' }, { value: 'nl', label: 'Nederlands' }, { value: 'pt', label: 'Português (Portugal)' }, { value: 'pl', label: 'Polski' }, { value: 'ro', label: 'Română' }, { value: 'da', label: 'Dansk' }, { value: 'sv', label: 'Svenska' }, { value: 'bg', label: 'Български' }, { value: 'ru', label: 'Русский' }, { value: 'uk', label: 'Українська' }, { value: 'hu', label: 'Magyar' }, { value: 'sk', label: 'Slovenčina' }, { value: 'cs', label: 'Čeština' }, { value: 'sl', label: 'Slovenščina' }, { value: 'lv', label: 'Latviešu' }, { value: 'el', label: 'Ελληνικά' }] } },
      },
    ]);
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
    if (data.todo_entities) data.todo_entities = ccList(data.todo_entities).map((e) => (typeof e === 'string' ? e : e?.entity));
    if (data.workday_entity === false) delete data.workday_entity;
    // `exclude: Private` (a YAML scalar) is shown as a one-item list.
    if (data.exclude != null) data.exclude = ccList(data.exclude).map(String);
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
    // Same for the names of the to-do lists; an empty list is dropped.
    var prevTodo = {};
    ccList(this._config.todo_entities).forEach((e) => { if (typeof e === 'object' && e) prevTodo[e.entity] = e; });
    if (Array.isArray(value.todo_entities)) {
      if (value.todo_entities.length) value.todo_entities = value.todo_entities.map((id) => prevTodo[id] || id);
      else delete value.todo_entities;
    }
    if (this._config.workday_entity === false && !value.workday_entity) value.workday_entity = false;
    if (Array.isArray(value.exclude)) {
      value.exclude = value.exclude.filter((x) => x != null && String(x).trim() !== '');
      if (!value.exclude.length) delete value.exclude;
    }
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

/*

Ext Gantt 2.2.9
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
/**
 * Polish translations for the Scheduler component
 *
 * NOTE: To change locale for month/day names you have to use the corresponding Ext JS language file.
 */
Ext.define('Sch.locale.Pl', {
    extend      : 'Sch.locale.Locale',
    singleton   : true,

    l10n        : {
        'Sch.util.Date' : {
            unitNames : {
                YEAR        : { single : 'rok',     plural : 'lata',     abbrev : 'r' },
                QUARTER     : { single : 'kwartał', plural : 'kwartały', abbrev : 'kw' },
                MONTH       : { single : 'miesiąc', plural : 'miesiące', abbrev : 'm' },
                WEEK        : { single : 'tydzień', plural : 'tygodnie', abbrev : 't' },
                DAY         : { single : 'dzień',   plural : 'dni',      abbrev : 'd' },
                HOUR        : { single : 'godzina', plural : 'godziny',  abbrev : 'g' },
                MINUTE      : { single : 'minuta',  plural : 'minuty',   abbrev : 'min' },
                SECOND      : { single : 'sekunda', plural : 'sekundy',  abbrev : 's' },
                MILLI       : { single : 'ms',      plural : 'ms',       abbrev : 'ms' }
            }
        },

        'Sch.view.SchedulerGridView' : {
            loadingText : "Ładowanie danych..."
        },

        'Sch.plugin.CurrentTimeLine' : {
            tooltipText : 'Obecny czas'
        },

        'Sch.plugin.EventEditor' : {
            saveText    : 'Zapisz',
            deleteText  : 'Usuń',
            cancelText  : 'Anuluj'
        },

        'Sch.plugin.SimpleEditor' : {
            newEventText    : 'Nowe zdarzenie...'
        },

        'Sch.widget.ExportDialog' : {
            generalError                : 'Wystąpił bład, spróbuj ponownie.',
            title                       : 'Ustawienia eksportowania',
            formatFieldLabel            : 'Format papieru',
            orientationFieldLabel       : 'Orientacja',
            rangeFieldLabel             : 'Zasięg eksportu',
            showHeaderLabel             : 'Dodaj numer strony',
            orientationPortraitText     : 'Pionowa',
            orientationLandscapeText    : 'Pozioma',
            completeViewText            : 'Kompletny grafik',
            currentViewText             : 'Obecny widok',
            dateRangeText               : 'Zesięg dat',
            dateRangeFromText           : 'Eksportuj od',
            pickerText                  : 'Zmień rozmiary kolumn/rzedów',
            dateRangeToText             : 'Eksportuj do',
            exportButtonText            : 'Eksportuj',
            cancelButtonText            : 'Anuluj',
            progressBarText             : 'Eksportowanie...',
            exportToSingleLabel         : 'Exportuj jako pojedyncza strona',
            adjustCols                  : 'Dostosuj szerokość kolumn',
            adjustColsAndRows           : 'Dostosuj szerokość kolumn i wysokość wierszy',
            specifyDateRange            : 'Wybierz zakres dat'
        },

        // -------------- View preset date formats/strings -------------------------------------
        'Sch.preset.Manager' : function () {
            var M = Sch.preset.Manager,
                vp = M.getPreset("hourAndDay");

            if (vp) {
                vp.displayDateFormat = 'g:i A';
                vp.headerConfig.middle.dateFormat = 'g A';
                vp.headerConfig.top.dateFormat = 'd/m/Y';
            }

            vp = M.getPreset("dayAndWeek");
            if (vp) {
                vp.displayDateFormat = 'd/m h:i A';
                vp.headerConfig.middle.dateFormat = 'd/m/Y';
            }

            vp = M.getPreset("weekAndDay");
            if (vp) {
                vp.displayDateFormat = 'd/m';
                vp.headerConfig.bottom.dateFormat = 'd M';
                vp.headerConfig.middle.dateFormat = 'Y F d';
            }

            vp = M.getPreset("weekAndMonth");
            if (vp) {
                vp.displayDateFormat = 'd/m/Y';
                vp.headerConfig.middle.dateFormat = 'd/m';
                vp.headerConfig.top.dateFormat = 'd/m/Y';
            }

            vp = M.getPreset("weekAndDayLetter");
            if (vp) {
                vp.displayDateFormat = 'd/m/Y';
                vp.headerConfig.middle.dateFormat = 'D d M Y';
            }

            vp = M.getPreset("weekDateAndMonth");
            if (vp) {
                vp.displayDateFormat = 'd/m/Y';
                vp.headerConfig.middle.dateFormat = 'd';
                vp.headerConfig.top.dateFormat = 'Y F';
            }

            vp = M.getPreset("monthAndYear");
            if (vp) {
                vp.displayDateFormat = 'd/m/Y';
                vp.headerConfig.middle.dateFormat = 'M Y';
                vp.headerConfig.top.dateFormat = 'Y';
            }

            vp = M.getPreset("year");
            if (vp) {
                vp.displayDateFormat = 'd/m/Y';
                vp.headerConfig.middle.dateFormat = 'Y';
            }

            vp = M.getPreset("manyyears");
            if (vp) {
                vp.displayDateFormat = 'd/m/Y';
                vp.headerConfig.middle.dateFormat = 'Y';
            }
        }
    }
});

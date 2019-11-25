/*

Ext Gantt 2.2.9
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
/**
 * German translations for the Scheduler component
 *
 * NOTE: To change locale for month/day names you have to use the corresponding Ext JS language file.
 */
Ext.define('Sch.locale.De', {
    extend      : 'Sch.locale.Locale',
    singleton   : true,

    l10n        : {
        'Sch.util.Date' : {
            unitNames : {
                YEAR        : { single : 'Jahr',        plural : 'Jahre',           abbrev : 'j' },
                QUARTER     : { single : 'Quartal',     plural : 'Quartale',        abbrev : 'q' },
                MONTH       : { single : 'Monat',       plural : 'Monate',          abbrev : 'm' },
                WEEK        : { single : 'Woche',       plural : 'Wochen',          abbrev : 'w' },
                DAY         : { single : 'Tag',         plural : 'Tage',            abbrev : 't' },
                HOUR        : { single : 'Stunde',      plural : 'Stunden',         abbrev : 'h' },
                MINUTE      : { single : 'Minute',      plural : 'Minuten',         abbrev : 'min' },
                SECOND      : { single : 'Sekunde',     plural : 'Sekunden',        abbrev : 's' },
                MILLI       : { single : 'Millisekunde',plural : 'Millisekunden',   abbrev : 'ms' }
            }
        },

        'Sch.plugin.CurrentTimeLine' : {
            tooltipText : 'Aktuelle Zeit'
        },

        'Sch.plugin.EventEditor' : {
            saveText    : 'Speichern',
            deleteText  : 'Löschen',
            cancelText  : 'Abbrechen'
        },

        'Sch.plugin.SimpleEditor' : {
            newEventText    : 'Neue Buchung...'
        },

        'Sch.widget.ExportDialog' : {
            generalError                : 'Ein Fehler ist aufgetreten, bitte versuchen Sie es erneut.',
            title                       : 'Einstellungen exportieren',
            formatFieldLabel            : 'Papierformat',
            orientationFieldLabel       : 'Ausrichtung',
            rangeFieldLabel             : 'Auswahl exportieren',
            showHeaderLabel             : 'Seitennummer hinzuf&uuml;gen',
            orientationPortraitText     : 'Hochformat',
            orientationLandscapeText    : 'Querformat',
            completeViewText            : 'Vollst&auml;ndige Ansicht',
            currentViewText             : 'Aktuelle Ansicht',
            dateRangeText               : 'Zeitraum',
            dateRangeFromText           : 'Exportieren ab',
            pickerText                  : 'Spalten/Reihen auf gew&uuml;nschten Wert &auml;ndern.',
            dateRangeToText             : 'Exportieren bis',
            exportButtonText            : 'Exportieren',
            cancelButtonText            : 'Abbrechen',
            progressBarText             : 'Exportiere...',
            exportToSingleLabel         : 'Exportieren als einzelne Seite',
            adjustCols                  : 'Spaltenbreite anpassen',
            adjustColsAndRows           : 'Spaltenbreite und Höhe anpassen',
            specifyDateRange            : 'Datumsbereich festlegen'
        },

        // -------------- View preset date formats/strings -------------------------------------
        'Sch.preset.Manager' : function () {
            var M = Sch.preset.Manager,
                vp = M.getPreset("hourAndDay");

            if (vp) {
                vp.displayDateFormat = 'G:i';
                vp.headerConfig.middle.dateFormat = 'H';
                vp.headerConfig.top.dateFormat = 'D, d. M. Y';
            }

            vp = M.getPreset("dayAndWeek");
            if (vp) {
                vp.displayDateFormat = 'd.m. G:i';
                vp.headerConfig.middle.dateFormat = 'd.m.Y';
            }

            vp = M.getPreset("weekAndDay");
            if (vp) {
                vp.displayDateFormat = 'd.m.';
                vp.headerConfig.bottom.dateFormat = 'd. M';
                vp.headerConfig.middle.dateFormat = 'Y F d';
            }

            vp = M.getPreset("weekAndMonth");
            if (vp) {
                vp.displayDateFormat = 'd.m.Y';
                vp.headerConfig.middle.dateFormat = 'd.m.';
                vp.headerConfig.top.dateFormat = 'd.m.Y';
            }

            vp = M.getPreset("weekAndDayLetter");
            if (vp) {
                vp.displayDateFormat = 'd.m.Y';
                vp.headerConfig.middle.dateFormat = 'D, d. M. Y';
            }

            vp = M.getPreset("weekDateAndMonth");
            if (vp) {
                vp.displayDateFormat = 'd.m.Y';
                vp.headerConfig.middle.dateFormat = 'd';
                vp.headerConfig.top.dateFormat = 'Y F';
            }

            vp = M.getPreset("monthAndYear");
            if (vp) {
                vp.displayDateFormat = 'd.m.Y';
                vp.headerConfig.middle.dateFormat = 'M. Y';
                vp.headerConfig.top.dateFormat = 'Y';
            }

            vp = M.getPreset("manyyears");
            if (vp) {
                vp.displayDateFormat = 'd.m.Y';
                vp.headerConfig.middle.dateFormat = 'Y';
            }
        }
    }
});
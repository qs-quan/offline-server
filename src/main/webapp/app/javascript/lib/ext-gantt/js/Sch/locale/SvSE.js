/*

Ext Gantt 2.2.9
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
/**
 * Swedish translations for the Scheduler component
 *
 * NOTE: To change locale for month/day names you have to use the corresponding Ext JS language file.
 */

Ext.define('Sch.locale.SvSE', {
    extend      : 'Sch.locale.Locale',
    singleton   : true,

    l10n        : {
        'Sch.util.Date' : {
            unitNames : {
                YEAR        : { single : 'år',    plural : 'år',   abbrev : 'år' },
                QUARTER     : { single : 'kvartal', plural : 'kvartal',abbrev : 'kv' },
                MONTH       : { single : 'månad',   plural : 'månader',  abbrev : 'mån' },
                WEEK        : { single : 'vecka',    plural : 'veckor',   abbrev : 'v' },
                DAY         : { single : 'dag',     plural : 'dagar',    abbrev : 'd' },
                HOUR        : { single : 'timme',    plural : 'timmar',   abbrev : 'tim' },
                MINUTE      : { single : 'minut',  plural : 'minuter', abbrev : 'min' },
                SECOND      : { single : 'sekund',  plural : 'sekunder', abbrev : 's' },
                MILLI       : { single : 'ms',      plural : 'ms',      abbrev : 'ms' }
            }
        },

        'Sch.view.SchedulerGridView' : {
            loadingText : "Laddar bokningar..."
        },

        'Sch.plugin.CurrentTimeLine' : {
            tooltipText : 'Aktuell tid'
        },

        'Sch.plugin.EventEditor' : {
            saveText    : 'Spara',
            deleteText  : 'Ta bort',
            cancelText  : 'Avbryt'
        },

        'Sch.plugin.SimpleEditor' : {
            newEventText    : 'Ny bokning...'
        },

        'Sch.widget.ExportDialog' : {
            generalError                : 'Ett fel har uppstått, vänligen försök igen.',
            title                       : 'Inställningar för export',
            formatFieldLabel            : 'Pappersformat',
            orientationFieldLabel       : 'Orientering',
            rangeFieldLabel             : 'Intervall',
            showHeaderLabel             : 'Visa sidnummer',
            orientationPortraitText     : 'Stående',
            orientationLandscapeText    : 'Liggande',
            completeViewText            : 'Hela schemat',
            currentViewText             : 'Aktuell vy',
            dateRangeText               : 'Datumintervall',
            dateRangeFromText           : 'Från',
            dateRangeToText             : 'Till',
            pickerText                  : 'Ställ in önskad rad och kolumn-storlek',
            exportButtonText            : 'Exportera',
            cancelButtonText            : 'Avbryt',
            progressBarText             : 'Arbetar...',
            exportToSingleLabel         : 'Exportera till en sida',
            adjustCols                  : 'Ställ in kolumnbredd',
            adjustColsAndRows           : 'Ställ in radhöjd och kolumnbredd',
            specifyDateRange            : 'Ställ in datumintervall'
        },

        // -------------- View preset date formats/strings -------------------------------------
        'Sch.preset.Manager' : function () {
            var M = Sch.preset.Manager,
                vp = M.getPreset("hourAndDay");

            if (vp) {
                vp.displayDateFormat = 'G:i';
                vp.headerConfig.middle.dateFormat = 'G:i';
                vp.headerConfig.top.dateFormat = 'l d M Y';
            }

            vp = M.getPreset("dayAndWeek");
            if (vp) {
                vp.displayDateFormat = 'Y-m-d G:i';
                vp.headerConfig.middle.dateFormat = 'D d M';
            }

            vp = M.getPreset("weekAndDay");
            if (vp) {
                vp.displayDateFormat = 'Y-m-d';
                vp.headerConfig.bottom.dateFormat = 'D d';
                vp.headerConfig.middle.dateFormat = 'd M Y';
            }

            vp = M.getPreset("weekAndMonth");
            if (vp) {
                vp.displayDateFormat = 'Y-m-d';
                vp.headerConfig.middle.dateFormat = 'm/d';
                vp.headerConfig.top.dateFormat = 'Y-m-d';
            }

            vp = M.getPreset("monthAndYear");
            if (vp) {
                vp.displayDateFormat = 'Y-m-d';
                vp.headerConfig.middle.dateFormat = 'M Y';
                vp.headerConfig.top.dateFormat = 'Y';
            }

            vp = M.getPreset("year");
            if (vp) {
                vp.displayDateFormat = 'Y-m-d';
                vp.headerConfig.middle.dateFormat = 'Y';
            }

            vp = M.getPreset("manyyears");
            if (vp) {
                vp.displayDateFormat = 'Y-m-d';
                vp.headerConfig.middle.dateFormat = 'Y';
            }
        }
    }
});

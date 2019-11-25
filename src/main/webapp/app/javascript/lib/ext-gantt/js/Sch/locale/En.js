/**
 * English translations for the Scheduler component
 *
 * NOTE: To change locale for month/day names you have to use the corresponding Ext JS language file.
 */
Ext.define('Sch.locale.En', {
    extend      : 'Sch.locale.Locale',
    singleton   : true,

    l10n        : {
        'Sch.util.Date' : {
            unitNames : {
                YEAR        : { single : 'year',    plural : 'years',   abbrev : 'yr' },
                QUARTER     : { single : 'quarter', plural : 'quarters',abbrev : 'q' },
                MONTH       : { single : 'month',   plural : 'months',  abbrev : 'mon' },
                WEEK        : { single : 'week',    plural : 'weeks',   abbrev : 'w' },
                DAY         : { single : 'day',     plural : 'days',    abbrev : 'd' },
                HOUR        : { single : 'hour',    plural : 'hours',   abbrev : 'h' },
                MINUTE      : { single : 'minute',  plural : 'minutes', abbrev : 'min' },
                SECOND      : { single : 'second',  plural : 'seconds', abbrev : 's' },
                MILLI       : { single : 'ms',      plural : 'ms',      abbrev : 'ms' }
            }
        },

        'Sch.plugin.CurrentTimeLine' : {
            tooltipText : 'Current time'
        },

        'Sch.plugin.EventEditor' : {
            saveText    : 'Save',
            deleteText  : 'Delete',
            cancelText  : 'Cancel'
        },

        'Sch.plugin.SimpleEditor' : {
            newEventText    : 'New booking...'
        },

        'Sch.widget.ExportDialog' : {
            generalError                : 'An error occured, try again.',
            title                       : 'Export Settings',
            formatFieldLabel            : 'Paper format',
            orientationFieldLabel       : 'Orientation',
            rangeFieldLabel             : 'Export range',
            showHeaderLabel             : 'Add page number',
            orientationPortraitText     : 'Portrait',
            orientationLandscapeText    : 'Landscape',
            completeViewText            : 'Complete schedule',
            currentViewText             : 'Current view',
            dateRangeText               : 'Date range',
            dateRangeFromText           : 'Export from',
            pickerText                  : 'Resize column/rows to desired value',
            dateRangeToText             : 'Export to',
            exportButtonText            : 'Export',
            cancelButtonText            : 'Cancel',
            progressBarText             : 'Exporting...',
            exportToSingleLabel         : 'Export as single page',
            adjustCols                  : 'Adjust column width',
            adjustColsAndRows           : 'Adjust column width and row height',
            specifyDateRange            : 'Specify date range'
        },

        // -------------- View preset date formats/strings -------------------------------------
        'Sch.preset.Manager' : function () {
            var M = Sch.preset.Manager,
                vp = M.getPreset("hourAndDay");

            if (vp) {
                vp.displayDateFormat = 'G:i';
                vp.headerConfig.middle.dateFormat = 'G:i';
                vp.headerConfig.top.dateFormat = 'D d/m';
            }

            vp = M.getPreset("dayAndWeek");
            if (vp) {
                vp.displayDateFormat = 'm/d h:i A';
                vp.headerConfig.middle.dateFormat = 'D d M';
            }

            vp = M.getPreset("weekAndDay");
            if (vp) {
                vp.displayDateFormat = 'm/d';
                vp.headerConfig.bottom.dateFormat = 'd M';
                vp.headerConfig.middle.dateFormat = 'Y F d';
            }

            vp = M.getPreset("weekAndMonth");
            if (vp) {
                vp.displayDateFormat = 'm/d/Y';
                vp.headerConfig.middle.dateFormat = 'm/d';
                vp.headerConfig.top.dateFormat = 'm/d/Y';
            }

            vp = M.getPreset("weekAndDayLetter");
            if (vp) {
                vp.displayDateFormat = 'm/d/Y';
                vp.headerConfig.middle.dateFormat = 'D d M Y';
            }

            vp = M.getPreset("weekDateAndMonth");
            if (vp) {
                vp.displayDateFormat = 'm/d/Y';
                vp.headerConfig.middle.dateFormat = 'd';
                vp.headerConfig.top.dateFormat = 'Y F';
            }

            vp = M.getPreset("monthAndYear");
            if (vp) {
                vp.displayDateFormat = 'm/d/Y';
                vp.headerConfig.middle.dateFormat = 'M Y';
                vp.headerConfig.top.dateFormat = 'Y';
            }

            vp = M.getPreset("year");
            if (vp) {
                vp.displayDateFormat = 'm/d/Y';
                vp.headerConfig.middle.dateFormat = 'Y';
            }

            vp = M.getPreset("manyyears");
            if (vp) {
                vp.displayDateFormat = 'm/d/Y';
                vp.headerConfig.middle.dateFormat = 'Y';
            }
        }
    }
});

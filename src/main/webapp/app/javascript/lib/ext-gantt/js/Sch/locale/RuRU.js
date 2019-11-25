/*

Ext Gantt 2.2.9
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
/**
 * English translations for the Scheduler component
 *
 * NOTE: To change locale for month/day names you have to use the corresponding Ext JS language file.
 */
Ext.define('Sch.locale.RuRU', {
    extend      : 'Sch.locale.Locale',
    singleton   : true,

    l10n        : {
        'Sch.util.Date' : {
            unitNames : {
                YEAR        : { single : 'год',     plural : 'лет',         abbrev : 'г' },
                QUARTER     : { single : 'квартал', plural : 'кварталов',   abbrev : 'квар' },
                MONTH       : { single : 'месяц',   plural : 'месяцев',     abbrev : 'мес' },
                WEEK        : { single : 'неделя',  plural : 'недели',      abbrev : 'нед' },
                DAY         : { single : 'день',    plural : 'дней',        abbrev : 'д' },
                HOUR        : { single : 'час',     plural : 'часов',       abbrev : 'ч' },
                MINUTE      : { single : 'минута',  plural : 'минут',       abbrev : 'мин' },
                SECOND      : { single : 'секунда',  plural : 'секунд',     abbrev : 'с' },
                MILLI       : { single : 'миллисек',      plural : 'миллисек',      abbrev : 'мс' }
            }
        },

        'Sch.plugin.CurrentTimeLine' : {
            tooltipText : 'Текущеее время'
        },

        'Sch.plugin.EventEditor' : {
            saveText    : 'Сохранить',
            deleteText  : 'Удалить',
            cancelText  : 'Отмена'
        },

        'Sch.plugin.SimpleEditor' : {
            newEventText    : 'Новое событие...'
        },

        'Sch.widget.ExportDialog' : {
            generalError                : 'Произошла ошибка, попробуйте еще раз.',
            title                       : 'Настройки экспорта',
            formatFieldLabel            : 'Размер листа',
            orientationFieldLabel       : 'Ориентация',
            rangeFieldLabel             : 'Диапазон экспорта',
            showHeaderLabel             : 'Добавить номера страниц',
            orientationPortraitText     : 'Портрет',
            orientationLandscapeText    : 'Ландшафт',
            completeViewText            : 'Полное расписание',
            currentViewText             : 'Текущая видимая область',
            dateRangeText               : 'Диапазон дат',
            dateRangeFromText           : 'Экспортировать с',
            pickerText                  : 'Выставите желаемые размеры столбцов/строк',
            dateRangeToText             : 'Экспортировать по',
            exportButtonText            : 'Экспортировать',
            cancelButtonText            : 'Отмена',
            progressBarText             : 'Экспортирование...',
            exportToSingleLabel         : 'Экспортировать как одну страницу',
            adjustCols                  : 'Настройка ширины столбцов',
            adjustColsAndRows           : 'Настройка ширины столбцов и высоты строк',
            specifyDateRange            : 'Укажите диапазон'
        },

        // -------------- View preset date formats/strings -------------------------------------
        'Sch.preset.Manager' : function () {
            var M = Sch.preset.Manager,
                vp = M.getPreset("hourAndDay");

            if (vp) {
                vp.displayDateFormat = 'g:i A';
                vp.headerConfig.middle.dateFormat = 'g A';
                vp.headerConfig.top.dateFormat = 'd.m.Y';
            }

            vp = M.getPreset("dayAndWeek");
            if (vp) {
                vp.displayDateFormat = 'd.m h:i A';
                vp.headerConfig.middle.dateFormat = 'd.m.Y';
            }

            vp = M.getPreset("weekAndDay");
            if (vp) {
                vp.displayDateFormat = 'd.m';
                vp.headerConfig.bottom.dateFormat = 'd M';
                vp.headerConfig.middle.dateFormat = 'Y F d';
            }

            vp = M.getPreset("weekAndMonth");
            if (vp) {
                vp.displayDateFormat = 'd.m.Y';
                vp.headerConfig.middle.dateFormat = 'd.m';
                vp.headerConfig.top.dateFormat = 'd.m.Y';
            }

            vp = M.getPreset("weekAndDayLetter");
            if (vp) {
                vp.displayDateFormat = 'd/m/Y';
                vp.headerConfig.middle.dateFormat = 'D d M Y';
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
                vp.headerConfig.middle.dateFormat = 'M Y';
                vp.headerConfig.top.dateFormat = 'Y';
            }

            vp = M.getPreset("year");
            if (vp) {
                vp.displayDateFormat = 'd.m.Y';
                vp.headerConfig.middle.dateFormat = 'Y';
            }

            vp = M.getPreset("manyyears");
            if (vp) {
                vp.displayDateFormat = 'd.m.Y';
                vp.headerConfig.middle.dateFormat = 'Y';
            }
        }
    }
});

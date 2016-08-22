/**
 * calendarManager.js
 *
 * Tetsuya Chiba, Aug/16/2016
 */
var _g = (function (g) {
  var set      = new g.Set(),
      $        = g.jQuery,
      window   = g.window,
      document = g.document,
      ls       = g.localStrage,
      moment   = g.moment(),
      apoMgr   = g.apoMgr = {
        setCalendar:         function (mark, cont, anew) {
          $('#calendar').fullCalendar('addEventSource', [{
            id:     mark,
            title:  cont,
            start:  g.moment(mark, 'YYYY-MM-DD'),
            allDay: true /* will make the time show */
          }]);
          apoMgr.addCache(mark);
          apoMgr.listenDeleteApo(mark);
          if (anew) {
            apoMgr.setLs(mark, mark);
          }
        },
        listenDeleteApo:     function (mark) {
          var deleteApoPane = 'td.fc-day-number[data-date=' + mark + ']';
          $(deleteApoPane).get(0).addEventListener('click', function () {
            $('#calendar').fullCalendar('removeEvents', mark);
            if (apoMgr.hasMark(mark)) {
              apoMgr.deleteMark(mark);
            }
            apoMgr.removeLs(mark);
          });
          $(deleteApoPane).get(0).addEventListener('focusout', function (e) {
            apoMgr.setLs(mark, e.target.text);
          });
        },
        startEditingApo:     function (calEvent, mark, elm) {
          $(elm).attr('contentEditable', 'true');
          $(elm).css('border-color', 'red');
          elm.focus();
          apoMgr.listenEndEditingApo(calEvent, mark, elm);
        },
        listenEndEditingApo: function (calEvent, mark, elm) {
          var _calEvent = calEvent;
          $(elm).get(0).addEventListener('focusout', function (e) {
            apoMgr.endEditingApo(e.target);
            apoMgr.setLs(mark, e.target.text);
            _calEvent.title = e.target.text;
            $('#calendar').fullCalendar('removeEvent', [mark]);
//          $('#calendar').fullCalendar('updateEvent', _calEvent); // I am not quite sure why this is not necessary..
          });
        },
        endEditingApo:       function (elm) {
          $(elm).attr('contentEditable', 'false');
          $(elm).css('border-color', 'inherit');
        },
        loadApo:             function (keyHead) {
          var cache = [], i, mark, apo;
          for (var key in ls) {
            if (0 <= (i = key.indexOf(keyHead))) {
              mark = key.substr(i + keyHead.length);
              apo  = ls[key];
              if (!cache.find(isSame)) {
                apoMgr.setCalendar(mark, ls[key], false);
                cache.push(mark);
              } else {
                apoMgr.removeLs(mark);
              }
            }
          }
          function isSame(e) {
            return e === mark;
          }
        },
        hasMark:             function (mark) {
          return this.marks.has(mark);
        },
        deleteMark:          function (mark) {
          return this.marks.delete(mark);
        },
        isSame:              function (apo, pick) {
          return apo.y === pick.y && apo.m === pick.m && apo.d === pick.d;
        },
        isPast:              function (today, pick) {
          return (pick.y < today.y)
            || (pick.y == today.y && pick.m < today.m)
            || (pick.y == today.y && pick.m == today.m && pick.d < today.d);
        },
        apoToMark:           function (apo) {
          return apo.y + '-' + padZero(apo.m) + '-' + padZero(apo.d);
          function padZero(n) {
            return ('0' + n).slice(-2);
          }
        },
        markToApo:           function (mark) { // YYYY-MM-DD
          var apo = {};
          apo.y   = Number(mark.substr(0, 4));
          apo.m   = Number(mark.substr(5, 2));
          apo.d   = Number(mark.substr(8, 2));
          return apo;
        },
        markToIso:           function (mark) { // 2014-04-23T09:54:51
          return (new Date(mark)).toISOString();
        },
        addCache:            function (mark) {
          return !this.marks.has(mark) ? this.marks.add(mark) : false;
        },
        setLs:               function (mark, cont) {
          ls.setItem('calendar.tc' + mark, cont);
        },
        removeLs:            function (mark) {
          ls.removeItem('calendar.tc' + mark);
        },
        marks:               set
      };
  if (typeof g.document === 'object') {
    $(g.document).ready(function () {
      $('#calendar').fullCalendar({ //// server side testing ongoing.
        header:              {
          left:   'title',
          center: '',
          right:  'today prev,next,month,basicWeek'
        },
        defaultView:         'month',
        dayClick:            function (date, jsEvent, view) {
          var today = {}, apo = {}, now = new Date(), mark;
          today.y   = now.getFullYear();
          today.m   = now.getMonth() + 1;
          today.d   = now.getDate();
          apo.y     = date.year();
          apo.m     = date.month() + 1;
          apo.d     = date.date();
          mark      = apoMgr.apoToMark(apo);
          if (apoMgr.isPast(today, apo)) {
            if (!g.isNode) {
              g.window.alert('an appointment is only available for today or future date.');
            } else {
              console.log('an appointment is only available for today or future date.');
            }
          } else if (apoMgr.hasMark(mark)) {
            if (!g.isNode) {
              g.window.alert('an appointment has already been placed on ' + mark + '\n' +
                'please select up part of this day pane to delete the appointment you made.');
            } else {
              console.log('an appointment has already been placed on ' + mark + '\n' +
                'please select up part of this day pane to delete the appointment you made.');
            }
          } else {
            if (!g.isNode) {
              g.window.alert('setting an appointment on ' + mark);
            } else {
              console.log('setting an appointment on ' + mark);
            }
            apoMgr.setCalendar(mark, mark, true);
          }
        },
        eventClick:          function (calEvent, jsEvent, view) {
          if (!this.isContentEditable) {
            apoMgr.startEditingApo(calEvent, calEvent.id, this);
          }
        },
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives'
      });
      apoMgr.loadApo('calendar.tc');
    });
  }
  return g;
})(new globalVars());
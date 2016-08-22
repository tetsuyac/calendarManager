/**
 * main.js
 *
 * Tetsuya Chiba, Aug/20/2016
 */
/*require(["calendarManager"], function(util) {
 //This function is called when scripts/helper/util.js is loaded.
 //If util.js calls define(), then this function is not fired until
 //util's dependencies have loaded, and the util argument will hold
 //the module value for "helper/util".
 });*/

/*<script src='../node_modules/jquery/dist/jquery.min.js'></script>
 <script src='../node_modules/moment/min/moment.min.js'></script>
 <script src='../bower_components/fullcalendar/dist/fullcalendar.js'></script>
 <script src='../bower_components/fullcalendar-scheduler/dist/scheduler.js'></script>
 */
if (typeof window === 'undefined' || window === null) { // node
  requirejs.config({
    baseUrl: '../node_modules',
    paths:   {
      // the left side is the module ID,
      // the right side is the path to
      // the jQuery file, relative to baseUrl.
      // Also, the path should NOT include
      // the '.js' file extension. This example
      // is using jQuery 1.9.0 located at
      // js/lib/jquery-1.9.0.js, relative to
      // the HTML page.
      fs:           'fs',
      jsdom:        'jsdom/lib/jsdom',
      jquery:       'jquery/dist/jquery.min',
      moment:       'moment/min/moment.min',
      fullcalendar: '../bower_components/fullcalendar/dist/fullcalendar',
      scheduler:    '../bower_components/fullcalendar-scheduler/dist/scheduler'
    }
  });
} else { // browser
  requirejs.config({
    baseUrl: '../node_modules',
    paths:   {
      jquery:       '../node_modules/jquery/dist/jquery.min',
      moment:       '../node_modules/moment/min/moment.min',
      fullcalendar: '../bower_components/fullcalendar/dist/fullcalendar',
      scheduler:    '../bower_components/fullcalendar-scheduler/dist/scheduler'
    }
  });
}
requirejs(["../client/calendarManager"]);

window.Vue = require('vue');
window.VueRouter = require('vue-router');
window.VueResource = require('vue-resource');

var badDiv = new Vue({
  el: '#bad',
  data: {message: 'Negative Activities'},
  created: function() {
    this.$http.get('/login').then(response => {
      console.log(response.data);
    }, (err) => {
      console.log(err);
    })
  },
  methods: {
    showBad: function () {
      console.log('clicked show bad');
      location.href = "/badActivities.html";
    }
  }
})

var addDiv = new Vue({
  el: '#add',
  data: {message: 'Add Activites'},
  methods: {
    showAdd: function () {
      location.href = "/addActivity.html";
    }
  }
})

var goodDiv = new Vue({
  el: '#goodDiv',
  data: {message: 'Good Activites'},
  methods: {
    showGood: function () {
      location.href = "/goodActivities.html";
    }
  }
})
var rateDiv = new Vue({
  el: '#rate',
  methods: {
    showRate: function () {
      location.href = "/rateActivities.html";
    }
  }
})

var reportDiv = new Vue({
  el: '#reports',
  methods: {
    showReport: function () {
      location.href = "/reports.html";
    }
  }
})
var checkinDiv = new Vue({
  el: '#checkin',
  methods: {
    showCheckin: function () {
      location.href = "/checkin.html";
    }
  }
})

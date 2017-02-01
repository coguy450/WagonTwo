

var badDiv = new Vue({
  el: '#bad',
  data: {message: 'Negative Activities'},
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

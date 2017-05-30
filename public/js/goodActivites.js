const myEmail = 'coguy450@gmail.com';
var goodAct = new Vue({
  el: '#goodAct',
  data: {
    message: '',
    activities: {},
    showPreviousNotes: false,
    prev: [],
  },
  created: function() {
    this.$http.get('/goodActivities').then(response => {
      this.activities = response.data;
    //  console.log(response.data);
    }, (err) => {
      console.log(err);
    })
    this.$http.get('/activityAverages').then(resp => {
      console.log(resp.data);
    }, (avgErr) => {
      console.log(avgErr);
    })
  },
  methods: {
    doActivity: function(activity) {
      activity.email = myEmail;
      console.log(activity);
      delete activity._id;
      activity.date = new Date();
      this.$http.post('/doActivity', activity).then(response => {
          this.message = 'Good luck doing that activity, please rate it later';
          this.showPreviousNotes = true;
          this.prev = response.data;
      //    location.href = "/reports.html";

      });
    },
    goRate: () => {
      location.href = "/rateActivities.html"
    }
  }

})

var app = new Vue({
  el: '#nav-mobile',
  methods: {
    goHome: () => {
      location.href= "/";
    }
  }
})

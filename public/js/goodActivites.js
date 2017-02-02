const myEmail = 'coguy450@gmail.com';
var goodAct = new Vue({
  el: '#goodAct',
  data: {
    message: 'Test message',
    activities: {}
  },
  created: function() {
    this.$http.get('/goodActivities').then(response => {
      this.activities = response.data;
      console.log(response.data);
    }, (err) => {
      console.log(err);
    })
  },
  methods: {
    doActivity: function(activity) {
      activity.email = myEmail;
      console.log(activity);
      delete activity._id;
      activity.date = new Date();
      this.$http.post('/doActivity', activity).then(response => {
          this.message = 'Activity added';
      });
    }
  }

})

var app = new Vue({
  el: '#app',
  methods: {
    goHome: () => {
      location.href= "/";
    }
  }
})

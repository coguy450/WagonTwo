const myEmail = 'coguy450@gmail.com';
var header = new Vue({
  el: '#header',
  methods: {
    goHome: () => {
      location.href = '/';
    }
  }
})


var curAct = new Vue({
  el: '#badAct',
  data: {
    activities: null,
  },
  created: function() {
    this.$http.get('/badActivities').then(response => {
      this.activities = response.data;
      console.log(response.data);
    }, (err) => {
      console.log(err);
    })
  },
  methods: {
    deleteActivity: function(act) {
      console.log('deleting', act);
    },
    doActivity: function(activity) {
      activity.email = myEmail;
      console.log(activity);
      this.$http.post('/doActivity', activity).then(response => {

      });
    }
  }
})

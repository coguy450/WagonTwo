const myEmail = 'coguy450@gmail.com';
var goodAct = new Vue({
  el: '#goodAct',
  data: {
    activities: {}
  },
  created: function() {
    this.$http.get('/goodActivities').then(response => {
      this.activities = response.data;
      console.log(response.data);
    }, (err) => {
      console.log(err);
    })
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

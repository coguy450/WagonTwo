var app = new Vue({
  el: '#app',
  methods: {
    goHome: () => {
      location.href= "/";
    }
  }
})

var reportsDiv = new Vue({
  el: '#reportsDiv',
  methods: {

  },
  data: {
    reports: {}
  },
  beforeCreate: function() {
    this.$http.get('/pastActions').then(response => {
      this.reports = response.data;
      console.log(response.data);
    }, (err) => {
      console.log(err);
    })
    this.$http.get('/getRatings').then(response => {

      console.log(response.data);
    }, (err) => {
      console.log(err);
    })

  },
  filters: {
    date: function(val) {
      const f = new Date(val);
      const fYear = f.getFullYear();
      const fMonth = f.getMonth() + 1;
      const fDay = f.getDay();
      const fHour = f.getHours() > 12 ? f.getHours() - 12 : f.getHours();
      const fMinutes = f.getMinutes().length > 1 ?  f.getMinutes() : '0' +  f.getMinutes();
      const AMPM = f.getHours() > 12 ? 'PM' : 'AM';
      const formattedDate = fMonth + '/' + fDay + '/' + fYear + ' at ' + fHour + ':' + fMinutes + AMPM;
      return formattedDate;
    }
  }
})

var rateAct = new Vue({
  el: '#rateAct',
  data: {
    actions: null,
  },
  created: function() {
    this.$http.get('/actions').then(response => {
      this.actions = response.data;

      console.log(response.data);
    }, (err) => {
      console.log(err);
    })
  },
  filters: {
    date: function(val) {
      console.log('filtering: ', val);
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

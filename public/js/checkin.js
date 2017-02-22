var app = new Vue({
  el: '#app',
  methods: {
    goHome: () => {
      location.href= "/";
    }
  }
})


var checkin = new Vue({
  el: '#checkinDiv',
  data: {
    message: null,
    notes: {note: null},
    checkin: {rating: null, date: null},
    error: null,
  },
  methods: {
    doCheckin: function (rating) {
      console.log('checking in', rating);
      this.checkin.rating = rating;
      this.$http.post('/checkin', this.checkin).then(response => {
        if (rating === 4) {
          this.message = "That's great that you're doing so well, be sure to do an activity so you stay that way";
        }
     }, err => {
       console.log(err)
       this.error = err;
     });
   },
   checkinNotes: function() {
     this.$http.post('/checkinNotes', this.notes).then(response => {
       this.notes.note = '';
       console.log('notes added');
     }, err => {
       console.log(err);
     })
   }
 },

  })

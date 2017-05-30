var reportsDiv = new Vue({
  el: '#movieDiv',
  data: {
    selectedType: null,
    queryString: null,
    results: null,
    sources: null
  },
  created: function() {
    $(document).ready(function() {
       $('select').material_select();
     });
  },
  methods: {
    searchMovies: function () {
      console.log('calling function', this.queryString, this.selectedType)
      this.sources = null
      this.$http.post('/searchMovies', {type: this.selectedType, queryString: this.queryString}).then(response => {
        this.results = response.data.results;
      }, (err) => {
        console.log(err);
      })
    },
    findMovie: function(id) {
      console.log('search for this id', id)
      this.$http.post('/specificShow', {searchId: id, type: this.selectedType}).then(response => {
        console.log(response.data);
        this.sources = response.data.subscription_web_sources
      }, (err) => {
        console.log(err);
      })
    },
    updateType: function(value) {
      console.log('updating type', value)
    }
  }

})

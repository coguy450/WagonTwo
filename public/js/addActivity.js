const myEmail = 'coguy450@gmail.com';

var app = new Vue({
  el: '#app',
  methods: {
    goHome: () => {
      location.href= "/";
    }
  }
})

var addAct = new Vue({
  el: '#newForm',
  data: {
    message: null,
    newActivity: {actType: 'Positive', newCategory: 'Exercise', user: myEmail},
    error: null,
  },
  methods: {
    addForm: function () {
      this.$http.post('/addActivity', this.newActivity).then(response => {
        console.log(response);
        this.newActivity = {actType: 'Positive', newCategory: 'Exercise'};
        this.message = "Activity Added";
        this.error = null;
        curAct._data.activities = response.data;
     }, err => {
       console.log(err)
       this.error = err;
     });
    }}})

  var curAct = new Vue({
    el: '#curAct',
    data: {
      activities: null
    },
    created: function() {
      this.$http.get('/activities').then(response => {
        this.activities = response.data;
        console.log(response.data);
      }, (err) => {
        console.log(err);
      })
    },
    methods: {
      deleteActivity: ((act) => {
        console.log('deleting', act);
      })
    }
  })

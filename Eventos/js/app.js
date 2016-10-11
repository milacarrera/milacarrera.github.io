var app = new Vue({
  el: '#app',

  data: {
    selectedState: "",
    selectedMonth: 0,
    eventList: [],
    eventListFull: null,
    title: "Eventos de TI pelo Brasil",
    states: ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PE","PI","RJ","RN","RO","RR","RS","SC","SP","SE","TO"],
    months: [
      {num: 1, label: "Janeiro"},
      {num: 2, label: "Fevereiro"},
      {num: 3, label: "Março"},
      {num: 4, label: "Abril"},
      {num: 5, label: "Maio"},
      {num: 6, label: "Junho"},
      {num: 7, label: "Julho"},
      {num: 8, label: "Agosto"},
      {num: 9, label: "Setembro"},
      {num: 10, label: "Outubro"},
      {num: 11, label: "Novembro"},
      {num: 12, label: "Dezembro"}
    ]
  },

  created: function(){
    this.fetchEvents();
  },

  methods:{
    fetchEvents: function(){
      var self = this;
      $.getJSON( "./data/events.json", function( data ) {
        data.sort(function(a,b){
          return new Date(a.start_date.year, a.start_date.month - 1, a.start_date.day) - new Date(b.start_date.year, b.start_date.month - 1, b.start_date.day);
        });
        self.eventList = data;
        self.eventListFull = data;
      });
    },
	fetchData: function () {
      var xhr = new XMLHttpRequest()
      var self = this
      xhr.open('GET', apiURL + self.currentBranch)
      xhr.onload = function () {
        self.commits = JSON.parse(xhr.responseText)
      }
      xhr.send()
    },
    filterByMonth: function(){
      var self = this;
      this.eventList = this.eventListFull.filter(function filterByState(value){
        return value.start_date.month == self.selectedMonth;
      });
    },
    filterByState: function(){
      var self = this;
      this.eventList = this.eventListFull.filter(function filterByState(value){
        return value.location.state == self.selectedState;
      });
    },
    filterByAll: function(){
      var self = this;
      this.eventList = this.eventListFull.filter(function filterByState(value){
        return value.location.state == self.selectedState && value.start_date.month == self.selectedMonth;
      });
    },
    resetList: function(){
      this.eventList = this.eventListFull;
    }
  },

  watch:{
    selectedState: function(currValue){
      if(currValue != "" && this.selectedMonth == ""){
        this.filterByState();
      } else if(currValue != "" && this.selectedMonth != ""){
        this.filterByAll();
      } else if(currValue == "" && this.selectedMonth != ""){
        this.filterByMonth();
      } else{
        this.resetList();
      }
    },

    selectedMonth: function(currValue){
      if(currValue != "" && this.selectedState == ""){
        this.filterByMonth();
      }else if(currValue != "" && this.selectedState != ""){
        this.filterByAll();
      }else if(currValue == "" && this.selectedState != ""){
        this.filterByState();
      }else{
        this.resetList();
      }
    }
  }
})

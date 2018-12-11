<template>
  <section class="hero is-fullheight bkg">
    <div class="section">
      <img src="../assets/christmas.png"/>
      <div class="snowflakes" aria-hidden="true">
        <div class="snowflake">
          ❅
        </div>
        <div class="snowflake">
          ❆
        </div>
        <div class="snowflake">
          ❅
        </div>
        <div class="snowflake">
          ❆
        </div>
        <div class="snowflake">
          ❅
        </div>
        <div class="snowflake">
          ❆
        </div>
        <div class="snowflake">
          ❅
        </div>
        <div class="snowflake">
          ❆
        </div>
        <div class="snowflake">
          ❅
        </div>
        <div class="snowflake">
          ❆
        </div>
        <div class="snowflake">
          ❅
        </div>
        <div class="snowflake">
          ❆
        </div>
      </div>
      <div class="container has-text-white">
        <div class="column is-6 is-offset-3">
          <div v-if="this.loading">
            <div class="spinner">
              <div class="rect1"></div>
              <div class="rect2"></div>
              <div class="rect3"></div>
              <div class="rect4"></div>
              <div class="rect5"></div>
            </div>
          </div>
          <h1 class="title" style="color:white">
            {{ nextEvent.name }}
          </h1>
          <div v-if="!this.loading">
            <h2 class="subtitle"  style="color:white">
              {{ nextEvent.location }} <strong  style="color:white">{{nextEvent.date}}</strong>
            </h2>
            <h3>
              <strong v-if="nextEvent.participants.length > 4 ">{{nextEvent.participants.length}}</strong>
              <strong style="color:red" v-if="nextEvent.participants.length < 5 ">{{nextEvent.participants.length}}</strong>
              <span> deltakere</span>
            </h3> 
          </div>
          <div v-if="!this.loading" class="content">
            <span v-for="(participant, index) in nextEvent.participants">
              {{ participant }}<span v-if="index != (nextEvent.participants.length -1)">,</span>
            </span>
            <progress v-if="nextEvent.participants.length < 4" class="progress is-medium is-danger" v-bind:value="nextEvent.participants.length" max="10"></progress>
            <progress v-if="nextEvent.participants.length >= 4 && nextEvent.participants.length < 6" class="progress is-medium is-warning" v-bind:value="nextEvent.participants.length" max="20"></progress>
            <progress v-if="nextEvent.participants.length > 5" class="progress is-medium is-success" v-bind:value="nextEvent.participants.length" max="10"></progress>
          </div>
          <div>
            <form id="signup-form" class="description" @submit.prevent="signup">
              <div class="field is-grouped">
                <div class="control is-expanded">
                  <input type="text" class="input" name="name" placeholde="Skriv inn navnet ditt" required="" autocomplete="off" v-model="name">
                </div>
                <div class="control">
                  <button class="button is-info">
                    Delta
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="column is-6 is-offset-3 " >
          <h3>Oppmøte</h3>
          <div class="content has-text-centered">
            <canvas id="stat-chart" width="100" height="100"></canvas>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { db } from '../main'

export default {
  name: 'Events',
  data () {
    return {
      events: [],
      nextEvent: 0,
      nextEventRef: 0,
      name: '',
      loading: true,
      chart: 0
    }
  },
  created: function() {
    const fridayOfWeek = 5;
    var d = new Date();
    d.setHours(0,0,0,0);
    var diff = fridayOfWeek - new Date().getDay();
    var nextFriday = new Date(d.setDate(d.getDate() + diff));
    var nextFridayStr = (nextFriday.getDate() + "-" + (nextFriday.getMonth()+1) + "-" + nextFriday.getFullYear());

    var docRef = db.collection("events").doc(nextFridayStr);
    docRef.onSnapshot( doc =>  {
      if (doc.exists) {
        this.nextEvent = doc.data();
        this.nextEventRef = doc.id;
        console.log(this.nextEventRef);
        this.loading = false;
      } else {
        console.log("No such document, creating new event for:", nextFridayStr);
        db.collection("events").doc(nextFridayStr).set({
          name: "Fredagsgym",
          date: nextFridayStr,
          location: "Birkenlundhallen",
          participants: []
        })
        .then( () => {
          console.log("Document successfully written!");
        });
      }
    });
  },

  mounted: function() {
    var ctx = document.getElementById( "stat-chart" );
    var dates = [];
    var perps = [];
    db.collection("events").orderBy('date').onSnapshot( querySnapShot => {
      querySnapShot.docChanges().forEach(change => {
        if (change.type === "added") {
          dates.push(change.doc.data().date);
          perps.push(change.doc.data().participants.length);
        }
        if (change.type === "modified") {
          console.log("What changed?", dates.indexOf(change.doc.data().date));
          perps[dates.indexOf(change.doc.data().date)] = change.doc.data().participants.length;
          this.chart.update();
        }
      }); 

      var chartData = {
        type: 'line',
        data: {
          labels: dates,
          datasets: [
          { 
            data: perps,
            fill: false,
            borderColor: '#fff',
            borderWidth: 3
          },
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          lineTension: 1,
          legend: {
            display: false
          },
          tooltips: {
            callbacks: {
             label: function(tooltipItem) {
              return tooltipItem.yLabel;
            }
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              padding: 25,
            }
          }]
        }
      }
    };
    if(this.chart == 0) {
      console.log("Creating chart with dates: ", dates);
      console.log("and perps: ", perps);
      this.chart = new Chart(ctx, chartData);
    }
  });
  //Animated background
  var grassTimeline = new TimelineMax({
    repeat: -1
  });

  grassTimeline.to("#ground", 20, {
    backgroundPosition: "1301px 0px",
    force3D:true,
    rotation:0.01,
    z:0.01,
    autoRound:false,
    ease: Linear.easeNone
  });

  var timeline = new TimelineMax({
    repeat: -1
  });

  timeline
  .add(grassTimeline, 0)
  .timeScale(0.7)
  .progress(1).progress(0)
  .play();
},

methods: {
  addUser: function() {
      // var self = this;
      db.collection('events').doc(this.nextEventRef).update({ "participants" : this.nextEvent.participants })
    },
    signup: function() {
      this.nextEvent.participants.push(this.name);
      this.addUser();
      this.name="";
    }    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.section {
  padding: 0 !important;
}

.spinner {
  margin: 100px auto;
  width: 50px;
  height: 40px;
  text-align: center;
  font-size: 10px;
}

.spinner > div {
  background-color: #333;
  height: 100%;
  width: 6px;
  display: inline-block;
  
  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes sk-stretchdelay {
  0%, 40%, 100% { -webkit-transform: scaleY(0.4) }  
  20% { -webkit-transform: scaleY(1.0) }
}

@keyframes sk-stretchdelay {
  0%, 40%, 100% { 
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
    }  20% { 
      transform: scaleY(1.0);
      -webkit-transform: scaleY(1.0);
    }
  }

  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }

  #ground {
    /*background:url("../assets/grasshanging.png") repeat-x 0 0 transparent;    */
    background:url("../assets/christmas.png") repeat-x 0 0 transparent;    
    bottom: 0;
    left: 0;
    z-index:2;
    width: 100%;
    height: 192px;
    min-height:192px;
    border:0 none transparent;
    outline:0 none transparent;
    -webkit-transform:translate3d(0,0,0.01);
    transform:translate3d(0,0,0.01);
    will-change: transform;
  }

  .bkg {
   background: url("../assets/background.png");
 }
 /* customizable snowflake styling */
 .snowflake {
  color: #fff;
  font-size: 1em;
  font-family: Arial, sans-serif;
  text-shadow: 0 0 5px #000;
}

@-webkit-keyframes snowflakes-fall{0%{top:-10%}100%{top:100%}}@-webkit-keyframes snowflakes-shake{0%,100%{-webkit-transform:translateX(0);transform:translateX(0)}50%{-webkit-transform:translateX(80px);transform:translateX(80px)}}@keyframes snowflakes-fall{0%{top:-10%}100%{top:100%}}@keyframes snowflakes-shake{0%,100%{transform:translateX(0)}50%{transform:translateX(80px)}}.snowflake{position:fixed;top:-10%;z-index:9999;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default;-webkit-animation-name:snowflakes-fall,snowflakes-shake;-webkit-animation-duration:10s,3s;-webkit-animation-timing-function:linear,ease-in-out;-webkit-animation-iteration-count:infinite,infinite;-webkit-animation-play-state:running,running;animation-name:snowflakes-fall,snowflakes-shake;animation-duration:10s,3s;animation-timing-function:linear,ease-in-out;animation-iteration-count:infinite,infinite;animation-play-state:running,running}.snowflake:nth-of-type(0){left:1%;-webkit-animation-delay:0s,0s;animation-delay:0s,0s}.snowflake:nth-of-type(1){left:10%;-webkit-animation-delay:1s,1s;animation-delay:1s,1s}.snowflake:nth-of-type(2){left:20%;-webkit-animation-delay:6s,.5s;animation-delay:6s,.5s}.snowflake:nth-of-type(3){left:30%;-webkit-animation-delay:4s,2s;animation-delay:4s,2s}.snowflake:nth-of-type(4){left:40%;-webkit-animation-delay:2s,2s;animation-delay:2s,2s}.snowflake:nth-of-type(5){left:50%;-webkit-animation-delay:8s,3s;animation-delay:8s,3s}.snowflake:nth-of-type(6){left:60%;-webkit-animation-delay:6s,2s;animation-delay:6s,2s}.snowflake:nth-of-type(7){left:70%;-webkit-animation-delay:2.5s,1s;animation-delay:2.5s,1s}.snowflake:nth-of-type(8){left:80%;-webkit-animation-delay:1s,0s;animation-delay:1s,0s}.snowflake:nth-of-type(9){left:90%;-webkit-animation-delay:3s,1.5s;animation-delay:3s,1.5s}.snowflake:nth-of-type(10){left:25%;-webkit-animation-delay:2s,0s;animation-delay:2s,0s}.snowflake:nth-of-type(11){left:65%;-webkit-animation-delay:4s,2.5s;animation-delay:4s,2.5s}
</style>

</style>

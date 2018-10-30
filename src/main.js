// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueFire from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'
import '../node_modules/bulma/css/bulma.css';

require('firebase/auth')
Vue.use(VueFire)

var config = {
  apiKey: 'AIzaSyCiMnr4q6MWj64Bgy8wF7if_OFnWnB_Lpk',
  authDomain: 'gymballistic.firebaseapp.com',
  databaseURL: 'https://gymballistic.firebaseio.com',
  projectId: 'gymballistic',
  storageBucket: 'gymballistic.appspot.com',
  messagingSenderId: '646286393804',
}

firebase.initializeApp(config)

firebase.auth().signInAnonymously().then(function() {
  console.log("Logged in anonymously");
}).catch(function(err) {
  console.log(err);
});

export const db = firebase.firestore()
const settings = {timestampsInSnapshots: true};
db.settings(settings);

Vue.config.productionTip = false


// var nextEvent = nextFriday();
// db.collection("events").where("name", "==", "Fredagsgym").orderBy("date")
// //db.collection("events").where("name", "==", "Fredagsgym").where("date", "==", "31/8/2018")
// .get()
// .then(function(querySnapshot) {
//   querySnapshot.forEach(function(doc) { 
//     console.log(doc.id, " => ", doc.data());
//   });
// })
// .catch(function(error) {
//   console.log("Error getting documents: ", error);
// });

// db.collection("events").where("name", "==", "Fredagsgym").where("date", "==", "31/8/2018")
// .onSnapshot(function(data) {
//   console.log("Current data: ", data);
// });

// const eventsCollection = db.collection("events");

// eventsCollection
// .onSnapshot((eventsRef) => {
//   eventsRef.forEach((doc) => {
//     const event = doc.data();
//     events.push(event);
//   });
//   console.log(events);
// });

// export const _events = {
//   nextEvent: null
// };



var eventsRef = db.collection("events");
var event = 0;
eventsRef.where("name", "==", "Fredagsgym").where("date", "==", "31/8/2018")

db.collection('events').where("name", "==", "Fredagsgym").where("date", "==", "31/8/2018").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data())
      })
})


new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})

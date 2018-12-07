// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueFire from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'
import '../node_modules/bulma/css/bulma.css';
import Chart from 'chart.js';

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

firebase.auth().signInAnonymously().then( () => {
  console.log("Logged in anonymously");
}).catch(function(err) {
  console.log(err);
});

export const db = firebase.firestore()
const settings = {timestampsInSnapshots: true};
db.settings(settings);

Vue.config.productionTip = false

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})

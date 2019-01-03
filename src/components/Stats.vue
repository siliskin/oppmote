<template>
  <section id="fullscreen" class="hero is-fullheight bkg">
    <div class="section">
      <div class="container has-text-black">
      </div>
    </div>
  </section>
</template>

<script>
import { db } from '../main'

var Perp = function ( name ) {
  this.name = name;
  this.attendance = 0;
};

Perp.prototype.equals = function (obj) {
  return this.name === obj.name();
}

Perp.prototype.name = function () {
  return this.name;
}

Perp.prototype.attendance = function () {
  return this.attendance;
}

Perp.prototype.increaseAttendance = function () {
  this.attendance++;
}

export default {
  name: 'Stats',
  data () {
    return {
      perps: [],
      chart: 0
    }
  },
  created: function() {
    const thisYear = 2019;
  },

  mounted: function() {
    db.collection("events").orderBy('created_at').onSnapshot( querySnapShot => {
      querySnapShot.docChanges().forEach(change => {
        var index = -1;
        change.doc.data().participants.forEach( el => {
          if( (index = this.perps.map(p => p.name).indexOf(el)) == -1 ) {
            this.perps.push(new Perp(el));
          } else {
            this.perps[index].increaseAttendance();
          }
        })
      });
    });

  },

  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.section {
  padding: 0 !important;
}

</style>

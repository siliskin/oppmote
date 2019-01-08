<template>
  <div id="app">
    <div class="tile is-ancestor is-paddingless">
      <div class="tile is-parent is-8 is-vertical">
        <div class="tile is-child">
          <Events/>
        </div>
        <div class="tile is-child">
          <Oppmote/>
        </div>
      </div>
      <div class="tile is-parent">
        <div class="tile is-child">
          <Stats/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Events from './components/Events';
import Oppmote from './components/Oppmote';
import Stats from './components/Stats';
export default {
  name: 'App',
  components: {
    Events,
    Oppmote,
    Stats
  }
}
</script>

<style>
#app {
  font-family: 'ZCOOL KuaiLe';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 0px;
}

html {
 background-image: url("./assets/4424.jpg");
 background-repeat: repeat-y;
 background-size: auto;
}
body {
  margin: 0 !important;

}
</style>

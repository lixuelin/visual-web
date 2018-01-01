<template>
  <div id="app">
    <header-view></header-view>
    <keep-alive include="state">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
  import Header from './components/header'
  export default {
    name: 'app',
    components: {
      'headerView': Header
    }
  }
</script>

<style>
</style>

import Vue from 'vue'
import Router from 'vue-router'
// import Login from '@/views/Login'
import State from '@/views/state'
import Intrusion from '@/views/Intrusion'
import Intelligence from '@/views/Intelligence'
import VehicleManagment from '@/views/VehicleManagment'
import Notification from '@/views/Notification'
import whole from '../components/whole'
import monitor from '../components/monitor'
import attack from '../components/attack'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    // {
    //   path: '/',
    //   name: 'Login',
    //   component: Login
    // },
    {
      path: '/Intrusion',
      name: 'Intrusion',
      component: Intrusion
    },
    {
      path: '/',
      name: 'State',
      component: State
    },
    {
      path: '/Intelligence',
      name: 'Intelligence',
      component: Intelligence
    },
    {
      path: '/VehicleManagment',
      name: 'VehicleManagment',
      component: VehicleManagment,
      children: [
        {
          path: '/',
          name: 'whole',
          component: whole
        },
        {
          path: '/VehicleManagment/monitor',
          name: 'monitor',
          component: monitor
        },
        {
          path: '/VehicleManagment/attack',
          name: 'attack',
          component: attack
        }
      ]
    },
    {
      path: '/Notification',
      name: 'Notification',
      component: Notification
    }
  ]
})

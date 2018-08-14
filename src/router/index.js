import Vue from 'vue'
import Router from 'vue-router'
import Music from '../components/Music'
import Login from '../components/Login'
import Register from '../components/Register'
import AddTrack from '../components/AddTrack'
import Home from '../components/Home'

import firebase from 'firebase'
import '../firestore/firebaseInit'

Vue.use(Router)

let router = new Router({
  linkExactActiveClass: 'is-active',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/music',
      name: 'Music',
      component: Music,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/add-track',
      name: 'Add Track',
      component: AddTrack,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!firebase.auth().currentUser) {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (firebase.auth().currentUser) {
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router

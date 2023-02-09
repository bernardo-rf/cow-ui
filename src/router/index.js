import Vue from "vue";
import VueRouter from "vue-router";
import store from '../store.js'
import { isAfter } from "date-fns"

import NotFound from "../components/HomePage.vue";
import Home from "../components/HomePage.vue";
import Login from "../components/LoginPage.vue";
import Register from "../components/RegisterPage.vue";
import About from "../components/AboutPage.vue";
import MainLayout from '../components/MainLayout.vue'
import Start from '../components/StartPage.vue'
import Profile from '../components/ProfilePage.vue'
import Cow from '../components/CowPage.vue'
import Cows from '../components/CowsPage.vue'
import CreateCow from '../components/CreateCow.vue'
import UpdateCow from '../components/UpdateCow.vue'
import Fields from '../components/FieldsPage.vue'
import Field from '../components/FieldPage.vue'
import CreateField from '../components/CreateField.vue'
import UpdateField from '../components/UpdateField.vue'
import Appointments from '../components/AppointmentsPage.vue'
import CreateAppointment from '../components/CreateAppointment.vue'
import UpdateAppointment from '../components/UpdateAppointment.vue'
import AppointmentRequests from '../components/AppointmentRequests.vue'
import CreateAppointmentRequest from '../components/CreateAppointmentRequest.vue'
import UpdateAppointmentRequest from '../components/UpdateAppointmentRequest.vue'
import Auctions from '../components/AuctionsPage.vue'
import Auction from '../components/AuctionPage.vue'
import CreateAuction from '../components/CreateAuction.vue'
import UpdateAuction from '../components/UpdateAuction.vue'

Vue.use(VueRouter)

const authGuard = (to, from, next) => {
    if (store.getters.accessToken) {
        if (!isAfter(new Date(), new Date(localStorage.getItem("tokensExpiry")))) {
            next()
        } else {
            store.commit("logout")
            next({ name: "login" })
        }
    } else {
        next({ name: "login" })
    }
}

export default new VueRouter({
    routes: [
        { path: "*", component: NotFound },
        { path: "/", component: Home, name: "home" },
        { path: "/login", component: Login, name: "login"},
        { path: "/register", component: Register,name: "register"},
        { path: "/about", component: About, name: "about" },
        {
            path: '', component: MainLayout, redirect: 'start',
            children: [
                { path: 'start', component: Start, name: 'start'},
                { path: 'profile', component: Profile, name: 'profile' },
                { path: 'cows', component: Cows, name: 'cows' },
                { path: 'newCow', component: CreateCow, name: 'createCow' },
                { path: 'cow/:bovineId', component: Cow, name: 'cow' },
                { path: 'cow/:bovineId/update', component: UpdateCow, name: 'updateCow' },
                { path: 'fields', component: Fields, name: 'fields' },
                { path: 'newField', component: CreateField, name: 'createField' },
                { path: 'field/:fieldId', component: Field, name: 'field' },
                { path: 'field/:fieldId/update', component: UpdateField, name: 'updateField' },
                { path: 'appointments', component: Appointments, name: 'appointments' },
                { path: 'newAppointment/', component: CreateAppointment, name: 'createAppointment' },
                { path: 'appointment/:appointmentId/update', component: UpdateAppointment, name: 'updateAppoitment' },
                { path: 'appointmentRequests', component: AppointmentRequests, name: 'appointmentRequest' },
                { path: 'newAppointmentRequest/:bovineId', component: CreateAppointmentRequest, name: 'createAppointmentRequest' },
                { path: 'appointmentRequest/:AppointmentRequestId/update', component: UpdateAppointmentRequest, name: 'updateAppointmentRequest' },
                { path: 'auctions', component: Auctions, name: 'auctions' },
                { path: 'newAuction', component: CreateAuction, name: 'createAuction' },
                { path: 'auction/:auctionId', component: Auction, name: 'auction' },
                { path: 'auction/:auctionId/update', component: UpdateAuction, name: 'updateAuction' }
            ],
            beforeEnter: authGuard
        }
    ]
})
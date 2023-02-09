<template>
    <div>
        <b-navbar :shadow="true" :spaced="true">
            <template slot="brand">
                <b-navbar-item tag="router-link" :to="{ path: '/start' }">
                    <img :src="require('../assets/img/icon.png')" alt="Cow">
                </b-navbar-item>
            </template>
            <template slot="start">
                <b-navbar-item tag="router-link" to="/start">
                    Start
                </b-navbar-item>
                <template v-if="user.userType != 'VETERINARY'">
                    <b-navbar-dropdown label="Auctions" type="is-dark">
                        <b-navbar-item tag="router-link" to="/auctions">
                            Auctions
                        </b-navbar-item>
                        <b-navbar-item tag="router-link" to="/newAuction">
                            Create Auction
                        </b-navbar-item>
                    </b-navbar-dropdown>
                </template>
                <b-navbar-dropdown label="Appointments" type="is-dark">
                    <div v-if="user.userType == 'VETERINARY'">
                        <b-navbar-item tag="router-link" to="/appointments">
                        Appointments
                        </b-navbar-item>
                        <b-navbar-item tag="router-link" to="/newAppointment">
                            Create Appointment
                        </b-navbar-item>
                    </div>
                    <b-navbar-item tag="router-link" to="/appointmentRequests">
                        Appointments Request
                    </b-navbar-item>
                    <b-navbar-item v-if="user.userType != 'VETERINARY'" tag="router-link" to="/newAppointmentRequest/0">
                        Create Appointment Request
                    </b-navbar-item>
                </b-navbar-dropdown>
                <b-navbar-dropdown v-if="user.userType != 'VETERINARY'" label="Cows" type="is-dark">
                    <b-navbar-item tag="router-link" to="/cows">
                        Cows
                    </b-navbar-item>
                    <b-navbar-item tag="router-link" to="/newCow">
                        Create Cow
                    </b-navbar-item>
                </b-navbar-dropdown>
                <b-navbar-dropdown v-if="user.userType != 'VETERINARY'" label="Fields" type="is-dark">
                    <b-navbar-item tag="router-link" to="/fields">
                        Fields
                    </b-navbar-item>
                    <b-navbar-item tag="router-link" to="/newField">
                        Create Field
                    </b-navbar-item>
                </b-navbar-dropdown>
            </template>

            <template slot="end">
                <figure class="image is-32x32">
                    <img class="image is-rounded"
                        :src="this.fileURL == '' || this.fileURL == null ? './assets/img/blank_user_image.png' : this.fileURL">
                </figure>
                <b-navbar-dropdown>
                    <template slot="label"><span class="has-margin-right-10">{{ username }}</span>
                        <b-tag type="is-volby">{{ user.userType }}</b-tag>
                    </template>
                    <b-navbar-item @click="profile">
                        Profile
                    </b-navbar-item>
                    <b-navbar-item @click="logout">
                        Logout
                    </b-navbar-item>
                </b-navbar-dropdown>
            </template>
        </b-navbar>
        <div class="section">
            <div class="container main has-padding-top-0 has-margin-bottom-70">
                <div class="is-flex is-vcentered has-margin-bottom-30">
                    <b-button class="has-margin-top-15 has-margin-right-15" v-if="backRedirect" tag="router-link"
                        :to="backRedirect" rounded type="is-info" size="is-small" icon-left="arrow-left"></b-button>
                    <h1 class="title is-1">
                        {{ title }}
                    </h1>
                </div>
                <router-view @title="onTitle" @back="onBackButton"></router-view>
            </div>
        </div>
        <footer class="footer volby-footer has-padding-top-100">
            <div class="columns is-vcentered has-text-centered">
                <div class="column is-3">
                    <img class="image is-horizontal-center" width="50%" :src="require('../assets/img/credits_ipleiria.png')" />
                </div>
                <div class="column is-6">
                    <p>Copyright © 2022 Bernardo Figueiredo @ IPLeiria.</p>
                    <p>All Rights Reserved</p>
                </div>
                <div class="column is-3">
                    <b-button type="is-text" tag="router-link" to="/about" target='_blank'>About COW</b-button>
                </div>
            </div>
        </footer>
    </div>
</template>
<script>
export default {
    data: function () {
        return {
            title: "",
            backRedirect: "",
            user: {},//this.$store.getters.user,
            username: "",
            fileURL: null
        }
    },
    methods: {
        onTitle: function (title) {
            this.title = title
        },
        onBackButton: function (redirect) {
            this.backRedirect = redirect
        },
        profile() {
            this.$router.push("/profile").catch(e => { console.log(e)})
        },
        logout() {
            this.$store.commit('logout')
            this.$router.push("/").catch(e => { console.log(e) })
        }
    },
    updated() {
        if (this.$store.getters.user.imageCID != "" && this.$store.getters.user.imageCID != null) {
            this.fileURL = `https://gateway.pinata.cloud/ipfs/${this.$store.getters.user.imageCID}`
        }
        this.username = this.$store.getters.user.name
    }
}
</script>
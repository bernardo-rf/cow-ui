<template>
    <div>
        <div class="section has-padding-top-10">
            <div class="container main">
                <div class="columns is-centered is-full-height is-vcentered">
                    <div class="column has-text-centered has-padding-top-30">
                        <img class="image is-128x128 is-horizontal-center" :src="require('../assets/img/icon.png')"/>
                        <h1 id="home_title">COW</h1>
                        <h4 id="home_subtitle">Login</h4>
                        <div class="columns is-centered">
                            <div class="column is-5">
                                <div class="card box shadow has-padding-top-0 has-padding-left-0 has-padding-right-0 has-padding-bottom-0">
                                    <div class="card-content">
                                        <b-message v-show="isInvalidLogin" type="is-danger">
                                            <strong>Information:</strong> Invalid email or password.
                                        </b-message>
                                        <validation-observer ref="observer" v-slot="{handleSubmit}">
                                            <form @submit.prevent="handleSubmit(submit)">
                                                <validation-provider rules="required" name="Email" v-slot="validationContext">
                                                    <b-field label="Email" :type="getValidationState(validationContext)" :message="validationContext.errors[0]">
                                                        <b-input rounded v-model="email"></b-input>
                                                    </b-field>
                                                </validation-provider>
                                                <validation-provider rules="required" name="Password" v-slot="validationContext">
                                                    <b-field label="Password" :type="getValidationState(validationContext)" :message="validationContext.errors[0]">
                                                        <b-input rounded type="password" v-model="password"></b-input>
                                                    </b-field>
                                                </validation-provider>
                                                <b-button class="has-margin-top-20" type="is-primary" expanded rounded native-type="submit" :loading="isLoading">Login</b-button>
                                            </form>
                                        </validation-observer>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="columns">
                            <div class="column">
                                <b-button type="is-text" tag="router-link" to="/register">Create an account</b-button>
                            </div>
                        </div>
                        <div class="columns">
                            <div class="column">
                                <b-button type="is-text" tag="router-link" to="/">Home</b-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer class="footer volby-footer has-margin-top-15">
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
export default{
    data(){
        return{
            email: "",
            password: "",
            isInvalidLogin: false,
            isLoading: false
        }
    },
    methods: {
        submit(){
            this.isInvalidLogin = false
            this.isLoading = true

            axios.post(`http://${process.env.VUE_APP_API_URL}users/auth/`,{  // eslint-disable-line
                email: this.email,
                password: this.password
            })
            .then(response => {
                axios.defaults.headers.common.Authorization = "Bearer " + response.data.accessToken  // eslint-disable-line
 
                this.$store.commit("setAuthToken",response.data.token)
                this.$store.commit("setUser", response.data.user)

                this.$buefy.toast.open({
                    duration: 3000,
                    message: 'Welcome to COW!',
                    type: 'is-success'
                })
                
                this.$router.push("/start").catch(e => {console.log(e)})
            })
            .catch(error => {
                if(error.response.status == 401){
                    this.isInvalidLogin = true
                }
            })
            .then(() => {
                this.isLoading = false
            })
        },
        getValidationState({ dirty, validated, valid = null }) {
            return dirty || validated ? (valid ? "" : "is-danger") : "";
        }
    }
}
</script>

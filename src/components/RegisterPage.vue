<template>
    <div>
        <div class="section pt-1">
            <div class="container main">
                <div class="columns is-centered is-full-height is-vcentered">
                    <div class="column has-text-centered pt-4">
                        <img class="image is-128x128 is-horizontal-center" :src="require('../assets/img/icon.png')"/>
                        <h1 id="home_title">COW</h1>
                        <h4 id="home_subtitle">Sign Up</h4>
                        <div class="columns is-centered">
                            <div class="column is-5">
                                <div class="card box shadow pt-0 pl-0 pr-0 pb-0">
                                    <div class="card-content">
                                        <b-message v-show="isEmailNotUnique" type="is-warning">
                                            <strong>Information:</strong> The email is already assign in our plataform.
                                        </b-message>
                                        <validation-observer ref="observer" v-slot="{handleSubmit}">
                                            <form @submit.prevent="handleSubmit(submit)">
                                                <validation-provider rules="required|min:2|alpha_spaces|max:15" name="Name" v-slot="validationContext">
                                                    <b-field label="Name" :type="getValidationState(validationContext)" :message="validationContext.errors[0]">
                                                        <b-input rounded v-model="name"></b-input>
                                                    </b-field>
                                                </validation-provider>
                                                <validation-provider rules="required|email|max:50" name="Email" v-slot="validationContext">
                                                    <b-field label="Email" :type="getValidationState(validationContext)" :message="validationContext.errors[0]">
                                                        <b-input rounded v-model="email"></b-input>
                                                    </b-field>
                                                </validation-provider>
                                                <validation-provider vid="password" rules="required|capitalLetter|oneNumber|min:8|max:30" name="Password" v-slot="validationContext">
                                                    <b-field label="Password" :type="getValidationState(validationContext)" :message="validationContext.errors[0]">
                                                        <b-input rounded type="password" v-model="password" password-reveal></b-input>
                                                    </b-field>
                                                </validation-provider>
                                                <validation-provider vid="confirmation" rules="required|confirmed:password" name="Password Confirmation" v-slot="validationContext">
                                                    <b-field label="Password Confirmation" :type="getValidationState(validationContext)" :message="validationContext.errors[0]">
                                                        <b-input rounded type="password" v-model="confirmation" password-reveal></b-input>
                                                    </b-field>
                                                </validation-provider>
                                                <validation-provider rules="required" name="User Type" v-slot="validationContext">
                                                    <b-field rounded label="User Type" :type="getValidationState(validationContext)" :message="validationContext.errors[0]">
                                                        <b-select v-model="userType" rounded expanded placeholder="Select a User Type">
															<option v-for="userType in userTypes" :value="userType.idUserType" :key="userType.idUserType">
																{{ userType.typeDescription }}
															</option>
                                                        </b-select>
                                                    </b-field>
                                                </validation-provider>
                                                <b-button class="mt-3" type="is-primary" expanded rounded native-type="submit" :loading="isLoading">Sign Up</b-button>
                                            </form>
                                        </validation-observer>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="columns">
                            <div class="column">
                                <b-button type="is-text" tag="router-link" to="/login">Already have an account? Sign In.</b-button>
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
        <footer class="footer volby-footer mt-1">
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

import { extend } from 'vee-validate';

extend('oneNumber', {
    validate(value) {
        var count = 0
        count = value.replace(/\D/g, '').length

        if (count == 0) {
            return  'Password at least one number.'
        }else{
            return true;
        }
    }
});

extend('capitalLetter', {
    validate(value) {
        var count=0
        for(var i=0; i<value.length; i++) {
            if(/[A-Z]/.test(value.charAt(i))) count++;
        }

        if (count == 0) {
            return  'Password needs one uppercase letter.'
        }else{
            return true;
        }
    }
});

export default{
    data(){
        return{
            name: "",
            email: "",
            password: "",
            confirmation: "",
            userType: "",
            isEmailNotUnique: "",
            userTypes: [],
            isLoading: false
        }
    },
    methods: {
        getInformation(){
            axios.get(`${process.env.VUE_APP_API_URL}userTypes/`)  // eslint-disable-line
                .then(response => {
                    this.userTypes = response.data
                    this.isLoading = false
                })
                .catch(error => {
                    console.log(error)
                    if (error.response.status == 404) {
                        this.$router.push("/*")
                    }
                    console.log(error)
                })
        },
        submit(){
            this.isEmailNotUnique = false
            this.isLoading = true
            
            axios.post(`${process.env.VUE_APP_API_URL}users/`,{  // eslint-disable-line
                idUserType: this.userType,
                name: this.name,
                email: this.email,
                password: this.password
            })
            .then(response => {
                axios.defaults.headers.common.Authorization = "Bearer " + response.data.token  // eslint-disable-line
                
                this.$store.commit("setAuthToken",response.data.token)
                this.$store.commit("setUser",response.data.user)

                this.$buefy.toast.open({
                    duration: 3000,
                    message: 'Welcome to Cow!',
                    type: 'is-success'
                })
                this.$router.push("/start").catch(e => {console.log(e)})
            })
            .catch(error => {
                if(error.response.status == 409){
                    this.isEmailNotUnique = true
                }
            })
            .then(() => {
                this.isLoading = false
            })
        },
        getValidationState({ dirty, validated, valid = null }) {
            return dirty || validated ? (valid ? "" : "is-danger") : "";
        }
    },
    created() {
		this.getInformation();
	}
}
</script>

<template>
    <div>
        <div class="columns">
            <div class="column">
                <div class="card box shadow mb-3">
                    <div class="card-content mb-0">
                        <template v-if="isLoadingPanel">
                            <div class="columns is-centered">
                                <div class="column is-12 has-text-centered">
                                    <b-icon pack="fas" icon="rotate" size="is-large" custom-class="fa-spin"></b-icon>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <validation-observer ref="observer">
                                <b-tabs v-model="activeTab" expanded>
                                    <b-tab-item label="Informations">
                                        <div class="columns">
                                            <div class="column">
                                                <validation-provider vid="motive" rules="required" name="Type"
                                                    v-slot="validationContext">
                                                    <b-field :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <template slot="label">Type <span
                                                                class="has-text-danger">*</span></template>
                                                        <b-input v-model="appointment.appointmentType"></b-input>
                                                    </b-field>
                                                </validation-provider>
                                            </div>
                                        </div>
                                        <div class="columns">
                                            <div class="column is-6">
                                                <validation-provider rules="required" name="Veterinary"
                                                    v-slot="validationContext">
                                                    <b-field rounded :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <template slot="label">Veterinary <span
                                                                class="has-text-danger">*</span></template>
                                                        <b-select v-model="idVeterinary"
                                                            placeholder="Select a Veterinary" expanded>
                                                            <option v-for="user in veterinaries" :value="user.idUser"
                                                                :key="user.idUser">
                                                                {{ user.name }}
                                                            </option>
                                                        </b-select>
                                                    </b-field>
                                                </validation-provider>
                                            </div>
                                            <div class="column is-6">
                                                <validation-provider vid="appointmentDate" rules="required"
                                                    name="Appointment Date" v-slot="validationContext">
                                                    <b-field expanded :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <template slot="label">Appointment Date <span
                                                                class="has-text-danger">*</span></template>
                                                        <b-datetimepicker v-model="appointment.appointmentDate"
                                                            placeholder="Click to select..." 
                                                            :datepicker="{ showWeekNumber }" :min-datetime="appointment.appointmentDate"
                                                            :timepicker="{ enableSeconds, hourFormat: format }"
                                                            horizontal-time-picker>
                                                        </b-datetimepicker>
                                                    </b-field>
                                                </validation-provider>
                                            </div>
                                        </div>
                                        <div class="columns">
                                            <div class="column">
                                                <validation-provider vid="cost" :rules="{
                                                    required: true,
                                                    min_value: 0,
                                                    cost_validation: appointment.cost
                                                }" name="Cost" v-slot="validationContext">
                                                    <b-field label="Cost" :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <b-input v-model="appointment.cost"
                                                            :placeholder=appointment.cost type="decimal">
                                                        </b-input>
                                                    </b-field>
                                                </validation-provider>
                                            </div>
                                            <div class="column is-6">
                                                <validation-provider rules="required" name="Status"
                                                    v-slot="validationContext">
                                                    <b-field rounded :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <template slot="label">Status <span
                                                                class="has-text-danger">*</span></template>
                                                        <b-select v-model="appointment.status"
                                                            placeholder="Select a Status" expanded>
                                                            <option value="0">Waiting</option>
                                                            <option value="1">Pending Payment</option>
                                                            <option value="2">Conclude</option>
                                                        </b-select>
                                                    </b-field>
                                                </validation-provider>
                                            </div>

                                        </div>
                                        <div class="columns">
                                            <div class="column">
                                                <b-field label="Observation">
                                                    <b-input v-model="appointment.observation" maxlength="1000"
                                                        type="textarea">
                                                    </b-input>
                                                </b-field>
                                            </div>
                                        </div>
                                        <div>
                                            <b-field>
                                                <template slot="label">Bovine</template>
                                            </b-field>
                                            <div class="card box">
                                                <div class="card-content pt-0 mb-0">
                                                    <div class="columns is-vcentered">
                                                        <div class="column is-2">
                                                            <figure class="image is-64x64 is-horizontal-center">
                                                                <img class="image is-rounded"
                                                                    :src="cow.imageCID == ''  ? require('../assets/img/blank_cow_image.png') : 'https://gateway.pinata.cloud/ipfs/' + cow.imageCID"
                                                                    :title="cow.SerialNumber">
                                                            </figure>
                                                        </div>
                                                        <div class="column">
                                                            <span class="has-text-weight-bold">Serial Number: </span>
                                                            {{ cow.serialNumber }}
                                                        </div>
                                                        <div class="column">
                                                            <span class="has-text-weight-bold">Birth Date: </span>
                                                            {{ cow.birthDate }}
                                                        </div>
                                                        <div class="column">
                                                            <span class="has-text-weight-bold">Color: </span>
                                                            {{ cow.color }}
                                                        </div>
                                                        <div class="column">
                                                            <span class="has-text-weight-bold">Breed: </span>
                                                            {{ cow.breed }}
                                                        </div>
                                                    </div>
                                                    <div class="columns is-vcentered">
                                                        <div class="column is-2 has-text-centered ">
                                                            <router-link :to="'/cow/' + cow.idBovine"><span
                                                                    class="is-size-5">{{ cow.serialNumber }}</span>
                                                            </router-link>
                                                        </div>
                                                        <div class="column is-10">
                                                            <span class="has-text-weight-bold">Location: </span>
                                                            {{ cow.field.address }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div>
                                            <b-field class="is-pulled-right">
                                                <b-button type="is-dark" rounded :loading="isLoading"
                                                    @click.prevent="submit">Submit</b-button>
                                            </b-field>
                                        </div>
                                    </b-tab-item>
                                </b-tabs>
                            </validation-observer>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import { extend } from 'vee-validate';
import { toDate } from '../helpers.js';

extend('cost_validation', {
    validate(value) {
        if (typeof value === 'undefined' || value === null || value === '') {
            return `Define a valid cost value ${value} .`
        } else if (/^\d+(.\d{1,2})?$/.test(value) == false) {
            return `${value} is not a valid cost.`
        } else {
            return true;
        }
    }
});

export default {
    data() {
        return {
            title: "Update Appointment",
            isLoading: false,
            isLoadingPanel: true,
            activeTab: 0,
            appointment: {},
            idVeterinary: 0,
            cow: {},
            veterinaries: [],
            format: '24',
            showWeekNumber: false,
            enableSeconds: false
        }
    },
    methods: {
        getValidationState({ dirty, validated, valid = null }) {
            return dirty || validated ? (valid ? "" : "is-danger") : "";
        },
        getAppointment() {
            axios.get(`${process.env.VUE_APP_API_URL}users/`) // eslint-disable-line
                .then(response => {
                    const usersAux = response.data
                    usersAux.forEach(user => {
                        if (user.userType == 'VETERINARY') {
                            this.veterinaries.push(user);
                        }
                    })

                    axios.get(`${process.env.VUE_APP_API_URL}appointment/${this.$route.params.appointmentId}`) // eslint-disable-line
                        .then(response => {
                            this.appointment = response.data
                            this.appointment.appointmentDate = new Date(this.appointment.appointmentDate)
                            this.idVeterinary = this.appointment.idUser

                            axios.get(`${process.env.VUE_APP_API_URL}bovines/${this.appointment.idBovine}`) // eslint-disable-line
                                .then(response => {
                                    this.cow = response.data
                                    this.cow.birthDate = toDate(this.cow.birthDate)
                                    this.isLoadingPanel = false
                                })
                                .catch(error => {
                                    console.log(error)
                                    if (error.response.status == 404) {
                                        this.$router.push("/*")
                                    }
                                })
                        })
                        .catch(error => {
                            console.log(error)
                            if (error.response.status == 404) {
                                this.$router.push("/*")
                            }
                        })
                })
                .catch(error => {
                    console.log(error)
                    if (error.response.status == 404) {
                        this.$router.push("/*")
                    }
                })
        },
        submit() {
            this.$refs.observer.validate()
                .then(result => {
                    this.isLoading = true
                    const loadingSnackbar = this.$buefy.snackbar.open({
						message: 'Writing to blockchain. This might take some time...',
						position: 'is-bottom-left',
						type: 'is-warning',
						indefinite: true
                        
					})

                    if (!result) {
                        this.$buefy.snackbar.open({
                            message: 'Input errors on the <b>Informations</b> tab.',
                            type: 'is-warning',
                            position: 'is-bottom-left',
                            actionText: 'Go There',
                            indefinite: true,
                            queue: false,
                            onAction: () => {
                                this.activeTab = 0
                            }
                        })
                        this.isLoading = false
                        loadingSnackbar.close()
                        return
                    }

                    axios.put(`${process.env.VUE_APP_API_URL}appointment/${this.$route.params.appointmentId}`, { // eslint-disable-line
                        "idAppointment": this.appointment.idAppointment,
                        "idAppointmentRequest": this.appointment.idAppointmenRequest,
                        "idContract": this.appointment.idContract,
                        "idBovine": this.appointment.idBovine,
                        "idUser": this.appointment.idUser,
                        "appointmentDate": this.appointment.appointmentDate,
                        "appointmentType": this.appointment.appointmentType,
                        "cost": this.appointment.cost,
                        "observation": this.appointment.observation,
                        "status": this.appointment.status
                    })
                        .then(() => {
                            this.$buefy.toast.open({
                                duration: 3000,
                                message: 'Appointment updated successfully!',
                                type: 'is-success'
                            })
                        })
                        .catch(error => {
                            console.log(error)
                        })
                        .then(() => {
                            this.isLoading = false
                            loadingSnackbar.close()
                            this.$router.push("/appointments").catch(e => { console.log(e)})
                        })
                })
        }
    },
    created() {
        this.$emit('title', this.title)
        this.$emit('back', "")
        this.getAppointment();
    }
}
</script>

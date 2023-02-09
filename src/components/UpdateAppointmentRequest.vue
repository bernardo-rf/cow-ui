<template>
    <div>
        <div class="columns">
            <div class="column">
                <div class="card box shadow has-margin-bottom-40">
                    <div class="card-content has-padding-bottom-0">
                        <template v-if="isLoadingPanel">
                            <div class="columns is-centered">
                                <div class="column is-12 has-text-centered">
                                    <b-icon pack="fas" icon="sync-alt" size="is-large" custom-class="fa-spin"></b-icon>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <validation-observer ref="observer">
                                <b-tabs v-model="activeTab" expanded>
                                    <b-tab-item label="Informations">
                                        <div class="columns">
                                            <div class="column">
                                                <validation-provider vid="motive" rules="required" name="Motive"
                                                    v-slot="validationContext">
                                                    <b-field :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <template slot="label">Motive <span
                                                                class="has-text-danger">*</span></template>
                                                        <b-input v-model="appointmentRequest.motive"></b-input>
                                                    </b-field>
                                                </validation-provider>
                                            </div>
                                        </div>
                                        <div class="columns">
                                            <div class="column">
                                                <validation-provider rules="required" name="Veterinary"
                                                    v-slot="validationContext">
                                                    <b-field rounded :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <template slot="label">Veterinary <span
                                                                class="has-text-danger">*</span></template>
                                                        <b-select v-model="appointmentRequest.idUser"
                                                            placeholder="Select a Veterinary" expanded>
                                                            <option v-for="user in veterinaries" :value="user.idUser"
                                                                :key="user.id">
                                                                {{ user.name }}
                                                            </option>
                                                        </b-select>
                                                    </b-field>
                                                </validation-provider>
                                            </div>
                                            <div class="column">
                                                <validation-provider vid="appointmentDate" rules="required"
                                                    name="Appointment Request Date" v-slot="validationContext">
                                                    <b-field expanded :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <template slot="label">Appointment Date <span
                                                                class="has-text-danger">*</span></template>
                                                        <b-datetimepicker rounded
                                                            v-model="appointmentRequest.appointmentDate"
                                                            placeholder="Click to select..." icon="calendar-today"
                                                            :datepicker="{ showWeekNumber }" :min-datetime="appointmentRequest.appointmentDate"
                                                            :timepicker="{ enableSeconds, hourFormat: format }"
                                                            horizontal-time-picker>
                                                        </b-datetimepicker>
                                                    </b-field>
                                                </validation-provider>
                                            </div>
                                        </div>
                                        <div class="columns">
                                            <div class="column is-6">
                                                <validation-provider rules="required" name="User"
                                                    v-slot="validationContext">
                                                    <b-field rounded label="User"
                                                        :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <b-select v-model="appointmentRequest.idUserRequest"
                                                            placeholder="Select a User" expanded disabled>
                                                            <option :value="user.idUser" :key="user.idUser">
                                                                {{ user.name }}
                                                            </option>
                                                        </b-select>
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
                                                        <b-select v-model="appointmentRequest.status"
                                                            placeholder="Select a Status" expanded disabled>
                                                            <option value="0">Pending Approval</option>
                                                        </b-select>
                                                    </b-field>
                                                </validation-provider>
                                            </div>
                                        </div>
                                        <b-field>
                                            <template slot="label">Bovine</template>
                                        </b-field>
                                        <div class="card box">
                                            <div class="card-content has-padding-top-0 has-padding-bottom-0">
                                                <div class="columns is-vcentered">
                                                    <div class="column is-2">
                                                        <figure class="image is-64x64 is-horizontal-center">
                                                            <img class="image is-rounded"
                                                                :src="cow.imageCID == '' ? 'img/no_image.png' : 'https://gateway.pinata.cloud/ipfs/' + cow.imageCID"
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
                                                    <div class="column ">
                                                        <span class="has-text-weight-bold">Breed: </span>
                                                        {{ cow.breed }}
                                                    </div>
                                                </div>
                                                <div class="columns is-vcentered">
                                                    <div class="column is-2 has-text-centered ">
                                                        <router-link :to="'/cow/' + cow.idBovine"><span
                                                                class="is-size-5">{{
                                                                        cow.serialNumber
                                                                }}</span>
                                                        </router-link>
                                                    </div>
                                                    <div class="column is-10">
                                                        <span class="has-text-weight-bold">Location: </span>
                                                        {{ cow.address }}
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

export default {
    data() {
        return {
            title: "Update Appointment Request",
            isLoading: false,
            isLoadingPanel: true,
            appointmentRequest: {},
            user: this.$parent.user,
            cow: {},
            dateNow: new Date(),
            veterinaries: [],
            isPaginated: true,
            format: '24',
            showWeekNumber: false,
            enableSeconds: false,
            activeTab: 0
        }
    },
    methods: {
        getValidationState({ dirty, validated, valid = null }) {
            return dirty || validated ? (valid ? "" : "is-danger") : "";
        },
        getAppointmentRequest() {
            axios.get(`http://${process.env.VUE_APP_API_URL}appointmentRequest/` + this.$route.params.AppointmentRequestId) // eslint-disable-line
                .then(response => {
                    this.appointmentRequest = response.data

                    this.appointmentRequest.appointmentDate = new Date(this.appointmentRequest.appointmentDate)

                    axios.get(`http://${process.env.VUE_APP_API_URL}bovines/${this.appointmentRequest.idBovine}`) // eslint-disable-line
                        .then(response => {
                            this.cow = response.data

                            axios.get(`http://${process.env.VUE_APP_API_URL}users/veterinary`) // eslint-disable-line
                                .then(response => {
                                    this.veterinaries = response.data
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
                        return
                    }

                    axios.put(`http://${process.env.VUE_APP_API_URL}appointmentRequest/${this.$route.params.AppointmentRequestId}`, { // eslint-disable-line
                        "idAppointmentRequest": this.$route.params.AppointmentRequestId,
                        "idUser": this.appointmentRequest.idUser,
                        "idUserRequest": this.appointmentRequest.idUserRequest,
                        "idBovine": this.appointmentRequest.idBovine,
                        "appointmentDate": this.appointmentRequest.appointmentDate,
                        "motive": this.appointmentRequest.motive,
                        "status": this.appointmentRequest.status
                    })
                        .then(() => {
                            this.$buefy.toast.open({
                                duration: 3000,
                                message: 'Appointment request updated successfully!',
                                type: 'is-success'
                            })
                            this.isLoading = false
                            this.$router.push("/appointmentRequests").catch(e => { console.log(e) })
                        })
                        .catch(error => {
                            console.log(error)
                        })
                })
        },
        toDate(timestamp) {
            if (timestamp != undefined) {
                const [dateValues, timeValues] = timestamp.split(' '); // eslint-disable-line
                return dateValues
            }
        }
    },
    created() {
        this.$emit('title', this.title)
        this.$emit('back', "")
        this.getAppointmentRequest();
    }
}
</script>

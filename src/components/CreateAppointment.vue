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
                            <template v-if="cows.length == 0">
                                <div class="columns is-centered">
                                    <div class="column is-12 has-text-centered">
                                        <span class="has-text-weight-bold"> You don't have any cows registered. Add a
                                            cow to
                                            create an appointment.</span>
                                    </div>
                                </div>
                            </template>
                            <template v-else-if="veterinaries.length == 0">
                                <div class="columns is-centered">
                                    <div class="column is-12 has-text-centered">
                                        <span class="has-text-weight-bold"> There are no veterinaries registered.
                                            Contact
                                            administration.</span>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <validation-observer ref="observer">
                                    <b-tabs v-model="activeTab" expanded>
                                        <b-tab-item label="Informations">
                                            <div class="columns">
                                                <div class="column">
                                                    <validation-provider vid="motive" rules="required|max:50" name="Type"
                                                        v-slot="validationContext">
                                                        <b-field :type="getValidationState(validationContext)"
                                                            :message="validationContext.errors[0]">
                                                            <template slot="label">Type <span
                                                                    class="has-text-danger">*</span></template>
                                                            <b-input v-model="type"></b-input>
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
                                                            <b-select v-model="idUser" placeholder="Select a Veterinary"
                                                                expanded>
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
                                                            <b-datetimepicker v-model="appointmentDate"
                                                                placeholder="Click to select..."
                                                                :datepicker="{ showWeekNumber }"
                                                                :timepicker="{ enableSeconds, hourFormat: format }"
                                                                :min-datetime="dateNow" horizontal-time-picker>
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
                                                        cost_validation: cost
                                                    }" name="Cost" v-slot="validationContext">
                                                        <b-field :type="getValidationState(validationContext)"
                                                            :message="validationContext.errors[0]">
                                                            <template slot="label">Cost <span
                                                                    class="has-text-danger">*</span></template>
                                                            <b-input v-model="cost" :placeholder=cost type="decimal">
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
                                                            <b-select v-model="status" placeholder="Select a Status"
                                                                expanded>
                                                                <option value="0">Waiting</option>
                                                                <option value="1">Close</option>
                                                                <option value="2">Conclude</option>
                                                            </b-select>
                                                        </b-field>
                                                    </validation-provider>
                                                </div>

                                            </div>
                                            <div class="columns">
                                                <div class="column">
                                                    <validation-provider rules="max:255" name="Observation"
                                                        v-slot="validationContext">
                                                        <b-field :type="getValidationState(validationContext)"
                                                            :message="validationContext.errors[0]">
                                                            <template slot="label">Observation </template>
                                                            <b-input v-model="observation" maxlength="255" type="textarea">
                                                            </b-input>
                                                        </b-field>
                                                    </validation-provider>
                                                </div>
                                            </div>
                                            <div>
                                                <b-field rounded>
                                                    <template slot="label">Bovines <span
                                                            class="has-text-danger">*</span></template>
                                                    <b-table :data="cows" :paginated="isPaginated" :per-page="perPage"
                                                        :current-page.sync="currentPage"
                                                        :pagination-simple="isPaginationSimple"
                                                        :pagination-position="paginationPosition" checkable
                                                        :checked-rows.sync="checkedCows" checkbox-position="left"
                                                        default-sort="type" :default-sort-direction="'desc'"
                                                        aria-next-label="Next page" aria-previous-label="Previous page"
                                                        aria-page-label="Page" aria-current-label="Current page">

                                                        <b-table-column field="serialNumber" label="Serial Number" sortable>
                                                            <template v-slot:default="props">
                                                                {{ props.row.serialNumber }}
                                                            </template>
                                                        </b-table-column>
                                                        <b-table-column field="color" label="Color" sortable>
                                                            <template v-slot:default="props">
                                                                {{ props.row.color }}
                                                            </template>
                                                        </b-table-column>
                                                        <b-table-column field="breed" label="Breed" sortable>
                                                            <template v-slot:default="props">
                                                                {{ props.row.color }}
                                                            </template>
                                                        </b-table-column>
                                                        <b-table-column field="gender" label="Gender" sortable>
                                                            <template v-slot:default="props">
                                                                <b-icon pack="fas"
                                                                    :icon="props.row.gender == '1' ? 'mars' : 'venus'">
                                                                </b-icon>
                                                                {{ props.row.gender == '1' ? 'Masculine' : 'Feminine' }}
                                                            </template>
                                                        </b-table-column>
                                                    </b-table>
                                                </b-field>
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
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import { extend } from 'vee-validate';

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
            title: "New Appointment",
            activeTab: 0,
            isLoading: false,
            isLoadingPanel: true,
            isBovineSelected: false,
            appointmentDate: null,
            type: '',
            cost: 0.0,
            status: 0,
            observation: '',
            active: true,
            dateNow: new Date(),
            cows: [],
            checkedCows: [],
            idUser: this.$parent.user.idUser,
            veterinaries: [],
            perPage: 10,
            currentPage: 1,
            isPaginated: true,
            isPaginationSimple: false,
            paginationPosition: 'bottom',
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
            axios.get(`${process.env.VUE_APP_API_URL}bovines/${this.$parent.user.idWallet}/own`)  // eslint-disable-line
                .then(response => {
                    this.cows = response.data

                    if (this.$route.params.bovineId != 0) {
                        this.cows.forEach(cow => {
                            if (cow.idBovine == this.$route.params.bovineId)
                                this.checkedCows.push(cow)
                        })
                    }

                    axios.get(`${process.env.VUE_APP_API_URL}users/`)  // eslint-disable-line
                        .then(response => {
                            const usersAux = response.data
                            usersAux.forEach(user => {
                                if (user.type == 'VETERINARY') {
                                    this.veterinaries.push(user);
                                }
                            })
                            this.isLoading = false
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
        },
        submit() {
            this.$refs.observer.validate()
                .then(result => {

                    if (this.checkedCows.length == 0) {
                        this.$buefy.snackbar.open({
                            message: `Input errors on the <b>Informations</b> tab. <br\> Select a <b>bovine</b> to create an appointment.`,  // eslint-disable-line
                            type: 'is-danger',
                            position: 'is-bottom-left',
                            actionText: 'Go There',
                            indefinite: true,
                            queue: false,
                            onAction: () => {
                                this.activeTab = 0
                            }
                        })
                        return
                    }

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

                    var bovineIds = []
                    this.checkedCows.forEach(bovine => {
                        bovineIds.push(bovine.idBovine)
                    })


                    axios.post(`${process.env.VUE_APP_API_URL}appointment/`, {  // eslint-disable-line
                        "idAppointmentRequest": 0,
                        "idUser": this.idUser,
                        "appointmentDate": this.appointmentDate,
                        "appointmentType": this.type,
                        "cost": this.cost,
                        "observation": this.observation,
                        "status": this.status,
                        "bovineIds": bovineIds
                    })
                        .then(() => {
                            this.$buefy.toast.open({
                                duration: 3000,
                                message: 'Appointment created successfully!',
                                type: 'is-success'
                            })
                        })
                        .catch(error => {
                            console.log(error)
                        })
                        .then(() => {
                            this.isLoading = false
                            loadingSnackbar.close()
                            this.$router.push("/appointments").catch(e => { console.log(e) })
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

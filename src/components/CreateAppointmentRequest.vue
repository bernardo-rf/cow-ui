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
                                            request an appointment.</span>
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
                                                    <validation-provider vid="motive" rules="required|max:50" name="Motive"
                                                        v-slot="validationContext">
                                                        <b-field :type="getValidationState(validationContext)"
                                                            :message="validationContext.errors[0]">
                                                            <template slot="label">Motive <span
                                                                    class="has-text-danger">*</span></template>
                                                            <b-input v-model="motive"></b-input>
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
                                                                    :key="user.id">
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
                                                                :datepicker="{ showWeekNumber }" :min-datetime="dateNow"
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
                                                        <b-field label="User" :type="getValidationState(validationContext)"
                                                            :message="validationContext.errors[0]">
                                                            <b-select v-model="idUserRequest" placeholder="Select a User"
                                                                expanded disabled>
                                                                <option v-for="user in users" :value="idUserRequest"
                                                                    :key="user.id">
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
                                                            <b-select v-model="status" placeholder="Select a Status"
                                                                expanded disabled>
                                                                <option value="0">Pending Approval</option>
                                                            </b-select>
                                                        </b-field>
                                                    </validation-provider>
                                                </div>

                                            </div>
                                            <div>
                                                <b-message v-if="isBovineSelected" type="is-danger" title="Create: Warning"
                                                    aria-close-label="Close message">
                                                    <strong>Information:</strong> To create an appointment request is
                                                    required to
                                                    select a bovine.
                                                </b-message>
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

export default {
    data() {
        return {
            title: "New Appointment Request",
            isLoading: false,
            isLoadingPanel: true,
            isBovineSelected: false,
            activeTab: 0,
            idUserRequest: this.$parent.user.idUser,
            idUser: null,
            appointmentDate: null,
            motive: '',
            status: 0,
            active: true,
            cows: [],
            checkedCows: [],
            users: [],
            veterinaries: [],
            dateNow: new Date(),
            isPaginated: true,
            perPage: 10,
            currentPage: 1,
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
        getAppointmentRequests() {
            axios.get(`${process.env.VUE_APP_API_URL}bovines/${this.$parent.user.idWallet}/own`)  // eslint-disable-line
                .then(response => {
                    this.cows = response.data
                    console.log(this.cows)

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
                                } else if (user.idUser == this.$parent.user.idUser) {
                                    this.users.push(user)
                                }
                            })
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
                        this.isBovineSelected = true
                        return
                    }

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
                    } else if (this.checkedCows.length == 0) {
                        this.$buefy.snackbar.open({
                            message: 'Select at least one bovine on the <b>Informations</b> tab.',
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

                    var bovines = []
                    this.checkedCows.forEach(bovine => {
                        bovines.push(bovine.idBovine)
                    })

                    axios.post(`${process.env.VUE_APP_API_URL}appointmentRequest/`, {  // eslint-disable-line
                        "idUser": this.idUser,
                        "idUserRequest": this.idUserRequest,
                        "appointmentDate": this.appointmentDate,
                        "motive": this.motive,
                        "status": this.status,
                        "bovineIds": bovines
                    })
                        .then(() => {
                            this.$buefy.toast.open({
                                duration: 3000,
                                message: 'Appointment request created successfully!',
                                type: 'is-success'
                            })
                            this.isLoading = false
                            this.$router.push("/appointmentRequests").catch(e => { console.log(e) })
                        })
                        .catch(error => {
                            console.log(error)
                        })
                })
        }
    },
    created() {
        this.$emit('title', this.title)
        this.$emit('back', "")
        this.getAppointmentRequests();
    }
}
</script>

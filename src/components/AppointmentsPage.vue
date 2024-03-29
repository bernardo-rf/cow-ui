<template>
    <div>
        <h3 class="title is-3">Current Appointments </h3>
        <div class="card box shadow">
            <div class="card-content">
                <template v-if="isLoading">
                    <div class="columns is-centered">
                        <div class="column is-12 has-text-centered">
                            <b-icon pack="fas" icon="rotate" size="is-large" custom-class="fa-spin"></b-icon>
                        </div>
                    </div>
                </template>
                <template v-else-if="currentAppointments.length == 0">
                    <div class="columns is-centered">
                        <div class="column is-12 has-text-right">
                            <b-button icon-right="plus" type="is-dark" rounded tag="router-link" :to="'/newAppointment'">
                                Create
                            </b-button>
                        </div>
                    </div>
                    <div class="columns is-centered">
                        <div class="column is-6 has-text-centered">
                            <span class="has-text-weight-bold">You don't have any appointments registered.
                            </span>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <template>
                        <div v-if="user.type == 'VETERINARY'" class="columns is-vcentered">
                            <div class="column is-12 has-text-right crud-button">
                                <b-button icon-right="plus" type="is-dark" rounded tag="router-link"
                                    :to="'/newAppointment'">Create
                                </b-button>
                            </div>
                        </div>
                    </template>
                    <div>
                        <b-table :data="currentAppointments" :paginated="isPaginated" :per-page="perPage"
                            :current-page.sync="currentPage" :pagination-simple="isPaginationSimple" detailed
                            detail-key="idAppointment" :detail-transition="transitionName"
                            :pagination-position="paginationPosition" aria-next-label="Next page"
                            aria-previous-label="Previous page" aria-page-label="Page" aria-current-label="Current page">

                            <b-table-column field="idAppointmentRequest" label="Appointment Request" sortable>
                                <template v-slot:default="props">
                                    <b-tag v-if="props.row.idAppointmentRequest == 0" type="is-dark">Without Request</b-tag>
                                    <b-tag v-if="props.row.idAppointmentRequest != 0" type="is-warning">With Request</b-tag>
                                </template>
                            </b-table-column>
                            <b-table-column field="appointmentDate" label="Date" sortable searchable>
                                <template v-slot:default="props">
                                    {{ props.row.appointmentDate }}
                                </template>
                            </b-table-column>
                            <b-table-column field="bovineSerialNumber" label="Cow Serial Number" sortable searchable>
                                <template v-slot:default="props">
                                    {{ props.row.bovineSerialNumber }}
                                </template>
                            </b-table-column>
                            <b-table-column field="cost" label="Cost" sortable searchable>
                                <template v-slot:default="props">
                                    {{ props.row.cost }}€
                                </template>
                            </b-table-column>
                            <b-table-column field="status" label="Status" sortable>
                                <template v-slot:default="props">
                                    <b-tag v-if="props.row.status == 0" type="is-dark">Waiting</b-tag>
                                    <b-tag v-if="props.row.status == 1" type="is-warning">Pending Payment</b-tag>
                                    <b-tag v-if="props.row.status == 2" type="is-success">Concluded</b-tag>
                                </template>
                            </b-table-column>
                            <b-table-column v-if="user.type == 'VETERINARY'" label="Actions" :visible="visibleValue">
                                <template v-slot:default="props">
                                    <div class="columns">
                                        <div v-if="props.row.status == 0" class="column">
                                            <b-tooltip label="Close an appointment that already as been executed."
                                                position="is-left" type="is-dark">
                                                <b-button @click="updateStatus(1, props.row.idAppointment)"
                                                    icon-right="check" type="is-warning" size="is-small" rounded>Close
                                                </b-button>
                                            </b-tooltip>
                                        </div>
                                        <div v-if="props.row.status == 1" class="column">
                                            <b-tooltip label="Conclude an appointment that already as been paid."
                                                position="is-left" type="is-dark">
                                                <b-button @click="updateStatus(2, props.row.idAppointment)"
                                                    icon-right="close" type="is-success" size="is-small" rounded>
                                                    Concluded
                                                </b-button>
                                            </b-tooltip>
                                        </div>
                                        <div class="column">
                                            <b-button icon-right="wrench" type="is-dark" size="is-small" tag="router-link"
                                                :to="'appointment/' + props.row.idAppointment + '/update'" rounded>
                                                Update
                                            </b-button>
                                        </div>
                                    </div>
                                </template>
                            </b-table-column>

                            <template #detail="props">
                                <article class="media">
                                    <div class="media-content">
                                        <div class="content">
                                            <p>
                                                <strong>Motive</strong>
                                                <small>@{{ props.row.appointmentDate }}</small>
                                                <br>
                                                {{ props.row.appointmentType }}
                                            </p>
                                            <p v-if="props.row.observation != ''">
                                                <strong>Observation</strong>
                                                <small>@{{ props.row.appointmentDate }}</small>
                                                <br>
                                                {{ props.row.observation }}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            </template>
                        </b-table>
                    </div>
                </template>
            </div>
        </div>
        <h3 class="title is-3">Past Appointments </h3>
        <div class="card box shadow">
            <div class="card-content">
                <template v-if="isLoading">
                    <div class="columns is-centered">
                        <div class="column is-12 has-text-centered">
                            <b-icon pack="fas" icon="rotate" size="is-large" custom-class="fa-spin"></b-icon>
                        </div>
                    </div>
                </template>
                <template v-else-if="pastAppointments.length == 0">
                    <div class="columns is-centered">
                        <div class="column is-6 has-text-centered">
                            <span class="has-text-weight-bold">You don't have any past appointment registered.
                            </span>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div>
                        <b-table :data="pastAppointments" :paginated="isPaginated" :per-page="perPage"
                            :current-page.sync="currentPage" :pagination-simple="isPaginationSimple" detailed
                            detail-key="idAppointment" :detail-transition="transitionName"
                            :pagination-position="paginationPosition" aria-next-label="Next page"
                            aria-previous-label="Previous page" aria-page-label="Page" aria-current-label="Current page">

                            <b-table-column field="idAppointmentRequest" label="Appointment Request" sortable>
                                <template v-slot:default="props">
                                    <b-tag v-if="props.row.idAppointmentRequest == 0" type="is-dark">Without Request</b-tag>
                                    <b-tag v-if="props.row.idAppointmentRequest != 0" type="is-warning">With Request</b-tag>
                                </template>
                            </b-table-column>
                            <b-table-column field="appointmentType" label="Motive" sortable searchable>
                                <template v-slot:default="props">
                                    {{ props.row.appointmentType }}
                                </template>
                            </b-table-column>
                            <b-table-column field="appointmentDate" label="Date" sortable searchable>
                                <template v-slot:default="props">
                                    {{ props.row.appointmentDate }}
                                </template>
                            </b-table-column>
                            <b-table-column field="bovineSerialNumber" label="Cow Serial Number" sortable searchable>
                                <template v-slot:default="props">
                                    {{ props.row.bovineSerialNumber }}
                                </template>
                            </b-table-column>
                            <b-table-column field="cost" label="Cost" sortable searchable>
                                <template v-slot:default="props">
                                    {{ props.row.cost }}€
                                </template>
                            </b-table-column>
                            <b-table-column field="status" label="Status" sortable>
                                <template v-slot:default="props">
                                    <b-tag v-if="props.row.status == 0" type="is-dark">Waiting</b-tag>
                                    <b-tag v-if="props.row.status == 1" type="is-warning">Pending Payment</b-tag>
                                    <b-tag v-if="props.row.status == 2" type="is-success">Concluded</b-tag>
                                </template>

                            </b-table-column>

                            <template #detail="props">
                                <article class="media">
                                    <div class="media-content">
                                        <div class="content">
                                            <p>
                                                <strong>Motive</strong>
                                                <small>@{{ props.row.appointmentDate }}</small>
                                                <br>
                                                {{ props.row.appointmentType }}
                                            </p>
                                            <p v-if="props.row.observation != ''">
                                                <strong>Observation</strong>
                                                <small>@{{ props.row.appointmentDate }}</small>
                                                <br>
                                                {{ props.row.observation }}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            </template>

                        </b-table>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import { toDateTime } from '../helpers.js'

export default {
    data() {
        return {
            title: "Appointments",
            user: this.$store.getters.user,
            currentAppointments: [],
            pastAppointments: [],
            status: 0,
            isLoading: true,
            isPaginated: true,
            perPage: 10,
            currentPage: 1,
            isPaginationSimple: false,
            paginationPosition: 'bottom',
            visibleValue: true
        }
    },
    computed: {
        transitionName() {
            if (this.useTransition) {
                return 'fade'
            } else {
                return ''
            }

        }
    },
    methods: {
        getAppointments() {
            this.isLoading = true
            this.pastAppointments = []
            this.currentAppointments = []
            var url = ''
            if (this.$parent.user.type == 'VETERINARY') {
                url = `${process.env.VUE_APP_API_URL}appointments/user/${this.$parent.user.idUser}`
            } else {
                url = `${process.env.VUE_APP_API_URL}appointments/bovines/${this.$parent.user.idWallet}`
            }

            axios.get(url) // eslint-disable-line
                .then(response => {
                    var appointments = response.data

                    appointments.forEach(appointment => {
                        appointment.appointmentDate = toDateTime(appointment.appointmentDate)
                        appointment.cost = appointment.cost.toString()
                        if (appointment.status == 2) {
                            this.pastAppointments.push(appointment)
                        } else {
                            this.currentAppointments.push(appointment)
                        }
                    })

                    this.isLoading = false
                })
                .catch(error => {
                    console.log(error)
                })
        },
        updateStatus(status, id) {
            this.isLoading = true
            const loadingSnackbar = this.$buefy.snackbar.open({
                message: 'Writing to blockchain. This might take some time...',
                position: 'is-bottom-left',
                type: 'is-warning',
                indefinite: true
            })

            axios.put(`${process.env.VUE_APP_API_URL}appointments/${id}/status?status=${status}`) // eslint-disable-line
                .then(() => {
                    this.getAppointments()
                })
                .catch(error => {
                    if (error.response.status == 409) {
                        this.activeTab = 0
                    }
                    console.log(error)
                })
                .then(() => {
                    loadingSnackbar.close()
                })
        },
        index(id) {
            var index = this.appointments.findIndex(x => x.idAppointment === id);
            return index
        }
    },
    created() {
        this.$emit('title', this.title)
        this.$emit('back', "")
        this.getAppointments()
    }
}
</script>

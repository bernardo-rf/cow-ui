<template>
    <div>
        <h3 class="title is-3">My Appointments Requests</h3>
        <div class="card box shadow">
            <div class="card-content">
                <template v-if="isLoading">
                    <div class="columns is-centered">
                        <div class="column is-12 has-text-centered">
                            <b-icon pack="fas" icon="rotate" size="is-large" custom-class="fa-spin"></b-icon>
                        </div>
                    </div>
                </template>
                <template v-else-if="appointmentsRequests.length == 0">
                    <div v-if="user.type != 'VETERINARY'" class="columns is-centered">
                        <div class="column is-12 has-text-right">
                            <b-button icon-right="plus" type="is-dark" rounded tag="router-link"
                                :to="'/newAppointmentRequest/0'">Create
                            </b-button>
                        </div>
                    </div>
                    <div class="columns is-centered">
                        <div class="column is-6 has-text-centered">
                            <span class="has-text-weight-bold">You don't have any appointments requests registered.
                            </span>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <template v-if="user.type != 'VETERINARY'">
                        <div class="columns is-vcentered">
                            <div class="column is-12 has-text-right crud-button">
                                <b-button icon-right="plus" type="is-dark" rounded tag="router-link"
                                    :to="'/newAppointmentRequest/0'">Create
                                </b-button>
                            </div>
                        </div>
                    </template>
                    <div>
                        <b-table :data="appointmentsRequests" :paginated="isPaginated" :per-page="perPage"
                            :current-page.sync="currentPage" :pagination-simple="isPaginationSimple" detailed
                            detail-key="idAppointmentRequest" :detail-transition="transitionName"
                            :pagination-position="paginationPosition" aria-next-label="Next page"
                            aria-previous-label="Previous page" aria-page-label="Page" aria-current-label="Current page">

                            <b-table-column field="appointmentDate" label="Date" sortable searchable>
                                <template v-slot:default="props">
                                    {{ props.row.appointmentDate }}
                                </template>
                            </b-table-column>
                            <b-table-column field="bovineSerialNumber" label="Bovine Serial Number" sortable searchable>
                                <template v-slot:default="props">
                                    {{ props.row.bovineSerialNumber }}
                                </template>
                            </b-table-column>
                            <b-table-column field="userName" label="Veterinary" sortable searchable>
                                <template v-slot:default="props">
                                    {{ props.row.userName }}
                                </template>
                            </b-table-column>
                            <b-table-column field="status" label="Status" sortable searchable>
                                <template v-slot:default="props">
                                    <b-tag v-if="props.row.status == 0" type="is-warning">Pending Approval</b-tag>
                                    <b-tag v-if="props.row.status == 1" type="is-success">Accepted</b-tag>
                                    <b-tag v-if="props.row.status == 2" type="is-danger">Canceled</b-tag>
                                </template>
                            </b-table-column>
                            <b-table-column label="Actions" :visible="visibleValue">
                                <template v-slot:default="props">
                                    <div v-if="props.row.status == 0" class="columns">
                                        <div v-if="$parent.user.type == 'VETERINARY'" class="column">
                                            <b-button @click="updateStatus(1, props.row.idAppointmentRequest)"
                                                icon-right="check" type="is-success" size="is-small" rounded>Accept
                                            </b-button>
                                        </div>
                                        <div v-if="$parent.user.type == 'VETERINARY'" class="column">
                                            <b-button @click="updateStatus(2, props.row.idAppointmentRequest)"
                                                icon-right="close" type="is-danger" size="is-small" rounded>Cancel
                                            </b-button>
                                        </div>
                                        <div v-if="$parent.user.type != 'VETERINARY'" class="column">
                                            <b-button icon-right="wrench" class="mr-2" type="is-dark" size="is-small"
                                                tag="router-link"
                                                :to="'appointmentRequest/' + props.row.idAppointmentRequest + '/update'"
                                                rounded>Update</b-button>
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
                                                {{ props.row.motive }}
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
            title: "Appointments Requests",
            user: this.$store.getters.user,
            isLoading: true,
            appointmentsRequests: [],
            isPaginated: true,
            perPage: 10,
            currentPage: 1,
            isPaginationSimple: false,
            paginationPosition: 'bottom',
            visibleValue: false
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
        getAppointmentRequests() {
            var url = ""
            if (this.$parent.user.type == 'VETERINARY') {
                url = `${process.env.VUE_APP_API_URL}appointmentsRequest/user/`
            } else {
                url = `${process.env.VUE_APP_API_URL}appointmentsRequest/userRequest/`
            }

            axios.get(url + this.$parent.user.idUser) // eslint-disable-line
                .then(response => {
                    this.appointmentsRequests = response.data

                    this.appointmentsRequests.forEach(appointment => {
                        appointment.appointmentDate = toDateTime(appointment.appointmentDate)
                        if (appointment.status == 0) {
                            this.visibleValue = true;
                        }
                    })
                    this.isLoading = false
                    console.log(this.appointmentsRequests)
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

            axios.put(`${process.env.VUE_APP_API_URL}appointmentsRequest/${id}/status?status=${status}`) // eslint-disable-line
                .then(() => {
                    this.getAppointmentRequests()
                })
                .catch(error => {
                    if (error.response.status == 409) {
                        this.isSerialNumberUnique = true
                        this.activeTab = 0
                    }
                    console.log(error)
                })
                .then(() => {
                    loadingSnackbar.close()
                })
        },
        index(id) {
            var index = this.appointmentsRequests.findIndex(x => x.idAppointmentRequest === id);
            return index
        }
    },
    created() {
        this.$emit('title', this.title)
        this.$emit('back', "")
        this.getAppointmentRequests()
    }
}
</script>

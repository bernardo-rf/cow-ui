<template>
    <div>
        <div class="columns">
            <div v-if="user.type != 'VETERINARY'" class="column is-6">
                <div class="title is-3">
                    <strong>Total Cows Own</strong>
                </div>
                <div>
                    <template v-if="cows.length == 0">
                        <div class="card box shadow">
                            <div class="card-content">
                                <div class="columns is-centered">
                                    <div class="column is-12 has-text-centered">
                                        <span class="has-text-weight-bold"> You don't have any cows registered.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="small_chart">
                            <pie-chart :chart-data="datacollectionPie"></pie-chart>
                        </div>
                    </template>
                </div>
            </div>
            <div class="column is-6">
                <div class="title is-3">
                    <strong>Total Appointments </strong>
                </div>
                <div>
                    <template v-if="appointmentsLabels.length == 0">
                        <div class="card box shadow">
                            <div class="card-content">
                                <div class="columns is-centered">
                                    <div class="column is-12 has-text-centered">
                                        <span class="has-text-weight-bold"> You don't have any appointments
                                            registered.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="small_chart">
                            <bar-chart :chart-data="datacollectionBar" :options="options"></bar-chart>
                        </div>
                    </template>
                </div>

            </div>
        </div>
        <div class="columns is-centered">
            <div class="column is-10">
                <div class="title is-3">
                    <strong>Auction</strong>
                </div>
                <div>
                    <div class="title is-4">
                        <strong>Global Statistics</strong>
                    </div>
                    <div class="columns">
                        <div class="column is-6">
                            <h6 class="title is-6">Cows Sold</h6>
                            <b-message type="is-success" class="shadow">
                                <h4 class="title is-4">{{ this.countCowsSold }} Cows</h4>
                            </b-message>
                        </div>
                        <div class="column is-6">
                            <h6 class="title is-6">Cows on Sale</h6>
                            <b-message type="is-danger" class="shadow">
                                <h4 class="title is-4">{{ this.countCowsOnSale }} Cows</h4>
                            </b-message>
                        </div>
                    </div>
                    <div class="title is-4">
                        <strong>My Statistics</strong>
                    </div>
                    <div class="columns">
                        <div class="column is-6">
                            <h6 class="title is-6">Cows Sold</h6>
                            <b-message type="is-success" class="shadow">
                                <h4 class="title is-4">{{ this.countMyCowsSold }} Cows</h4>
                            </b-message>
                        </div>
                        <div class="column is-6">
                            <h6 class="title is-6">Cows on Sale</h6>
                            <b-message type="is-danger" class="shadow">
                                <h4 class="title is-4">{{ this.countMyCowsOnSale }} Cows</h4>
                            </b-message>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import PieChart from './Charts/PieChart.js'
import BarChart from './Charts/BarChart.js'
import { toDate } from '../helpers.js'

export default {
    components: {
        PieChart,
        BarChart
    },
    data() {
        return {
            title: "Dashboard",
            user: this.$store.getters.user,
            cows: [],
            cowsLabels: [],
            cowsColors: [],
            cowsData: [],
            appointmentsLabels: [],
            appointmentsData: [],
            appointmentsColors: [],
            countCowsSold: 0,
            countCowsOnSale: 0,
            countMyCowsSold: 0,
            countMyCowsOnSale: 0,
            datacollectionPie: {},
            datacollectionBar: {},
            datacollectionLine: {},
            options: null
        }
    },
    methods: {
        getInformation() {
            axios.get(`${process.env.VUE_APP_API_URL}bovines/${this.$parent.user.idWallet}/own`) // eslint-disable-line
                .then(response => {
                    this.cows = response.data

                    this.cows.forEach(cow => {
                        this.cowsLabels.push(cow.breed)
                        this.cowsColors.push("#" + Math.floor(Math.random() * 16777215).toString(16))
                    })

                    this.cowsLabels.forEach(label => {
                        var count = 0
                        this.cows.forEach(cow => {
                            if (cow.breed == label) {
                                count++;
                            }
                        })
                        this.cowsData.push(count);
                    })

                    this.cowsColors.splice(0, this.cowsColors.length - this.cowsLabels.length)

                    var url = ""
                    if (this.$parent.user.type == 'VETERINARY') {
                        url = `${process.env.VUE_APP_API_URL}appointment/user/${this.$parent.user.idUser}`
                    } else {
                        url = `${process.env.VUE_APP_API_URL}appointment/bovines/${this.$parent.user.idWallet}`
                    }
                    axios.get(url) // eslint-disable-line
                        .then(response => {
                            var appointments = response.data
                            var aux = []

                            appointments.forEach(appointment => {
                                appointment.appointmentDate = toDate(appointment.appointmentDate).substring(0, 7)
                                aux.push(appointment.appointmentDate)
                                this.appointmentsColors.push("#" + Math.floor(Math.random() * 16777215).toString(16))
                            })

                            var obj = {}
                            for (var i = 0; i < aux.length; i++) {
                                obj[aux[i]] = 0;
                            }

                            for (i in obj) {
                                this.appointmentsLabels.push(i);
                            }

                            this.appointmentsLabels.forEach(label => {
                                var count = 0
                                appointments.forEach(appointment => {
                                    if (appointment.appointmentDate == label) {
                                        count++;
                                    }
                                })
                                this.appointmentsData.push(count);
                            })

                            this.appointmentsColors.splice(0, this.appointmentsColors.length - this.appointmentsLabels.length)

                            axios.get(`${process.env.VUE_APP_API_URL}auctions/`) // eslint-disable-line
                                .then(response => {
                                    var auctions = response.data
                                    auctions.forEach(auction => {
                                        if (auction.status == 2) {
                                            this.countCowsSold++
                                        } else if (auction.status == 1) {
                                            this.countCowsOnSale++
                                        }

                                        if (auction.status == 2 & auction.user.idWallet == this.$parent.user.idWallet) {
                                            this.countMyCowsSold++
                                        } else if (auction.status == 1 & auction.user.idWallet == this.$parent.user.idWallet) {
                                            this.countMyCowsOnSale++
                                        }
                                    })

                                    this.fillData()
                                    this.isLoading = false
                                })
                                .catch(error => {
                                    console.log(error)
                                })
                        })
                        .catch(error => {
                            console.log(error)
                        })
                })
        },
        fillData() {
            this.datacollectionPie = {
                labels: this.cowsLabels,
                datasets: [
                    {
                        label: 'Cows',
                        backgroundColor: this.cowsColors,
                        data: this.cowsData
                    }
                ]
            },
                this.datacollectionBar = {
                    labels: this.appointmentsLabels,
                    datasets: [
                        {
                            backgroundColor: this.appointmentsColors,
                            data: this.appointmentsData
                        }
                    ]
                },
                this.options = {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            },
                            gridLines: {
                                display: true
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                beginAtZero: true
                            },
                            gridLines: {
                                display: false
                            }
                        }]
                    },
                    legend: {
                        display: false
                    },
                    responsive: true,
                }
        }
    },
    created() {
        this.$emit('title', this.title)
        this.$emit('back', "")
    },
    mounted() {
        this.getInformation()
    }
}
</script>
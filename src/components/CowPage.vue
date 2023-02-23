<template>
    <div>
        <div class="card box shadow">
            <div class="card-content">
                <template v-if="isLoading">
                    <div class="columns is-centered">
                        <div class="column is-12 has-text-centered">
                            <b-icon pack="fas" icon="rotate" size="is-large" custom-class="fa-spin">></b-icon>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="columns is-vcentered">
                        <div class="column is-6">
                            <span class="is-size-3 mr-2">Cow - {{ cow.serialNumber }}</span>
                        </div>
                        <template>
                            <div class="column is-6 has-text-right">
                                <b-button icon-right="stethoscope" class="mr-2" type="is-warning" rounded tag="router-link"
                                    :to="`/newAppointmentRequest/${cow.idBovine}`">Request Appointment</b-button>
                                <b-button icon-right="money-bill-transfer" class="mr-2" type="is-success" rounded tag="router-link" :to="`/newAuction`">
                                    Sell</b-button>
                                <b-button icon-right="wrench" class="mr-2" type="is-dark" rounded tag="router-link" :to="`/cow/${cow.idBovine}/update`">
                                    Update</b-button>
                            </div>
                        </template>
                    </div>
                    <div class="columns">
                        <div class="column is-12">
                            <b-tabs v-model="activeTab" expanded>
                                <b-tab-item label="Informations">
                                    <div class="columns">
                                        <div class="column is-2" style="padding-top: 60px ;">
                                            <figure class="image is-128x128 is-horizontal-center is-vcentered">
                                                <img class="thumbnail image is-rounded"
                                                    :src="cow.imageCID == '' ? require('../assets/img/blank_cow_image.png') : 'https://gateway.pinata.cloud/ipfs/' + cow.imageCID">
                                            </figure>
                                        </div>
                                        <div class="column is-10">
                                            <div class="card">
                                                <div class="card-content">
                                                    <div class="columns">
                                                        <div class="column is-4">
                                                            <span class="has-text-weight-bold">Serial Number: </span>
                                                            {{ cow.serialNumber }}
                                                        </div>
                                                        <div class="column is-4">
                                                            <span class="has-text-weight-bold">Birth Date:</span>
                                                            {{ cow.birthDate }}
                                                        </div>
                                                        <div class="column is-4">
                                                            <span class="has-text-weight-bold">Age:</span> {{ cow.age }}
                                                        </div>
                                                    </div>
                                                    <hr />
                                                    <div class="columns">
                                                        <div class="column is-4">
                                                            <span class="has-text-weight-bold">Color: </span> {{
                                                                cow.color
                                                            }}
                                                        </div>
                                                        <div class="column is-4">
                                                            <span class="has-text-weight-bold">Breed: </span> {{
                                                                cow.breed
                                                            }}
                                                        </div>
                                                        <div class="column is-4">
                                                            <div v-if="cow.gender == '0'">
                                                                <span class="has-text-weight-bold">Gender: </span>
                                                                <span>
                                                                    <b-icon pack="fas" :icon="'venus'" /> Female
                                                                </span>
                                                            </div>
                                                            <div v-else>
                                                                <span class="has-text-weight-bold">Gender: </span>
                                                                <span>
                                                                    <b-icon pack="fas" :icon="'mars'" /> Male
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="column"></div>
                                                    </div>
                                                    <hr />
                                                    <div class="columns">
                                                        <div class="column is-4">
                                                            <span class="has-text-weight-bold">Weight:</span>
                                                            {{ cow.weight }} Kg
                                                            <b-tag v-if="isTag1Active"
                                                                :type="getWeightInfortmation(cow)" rounded closable
                                                                @close="isTag1Active = false"
                                                                aria-close-label="Close tag">
                                                                {{ this.weightNote }}
                                                            </b-tag>
                                                        </div>
                                                        <div class="column is-8">
                                                            <span class="has-text-weight-bold">Height:</span>
                                                            {{ cow.height }} m
                                                            <b-tag v-if="isTag2Active"
                                                                :type="getHeightInfortmation(cow)" rounded closable
                                                                @close="isTag2Active = false"
                                                                aria-close-label="Close tag">
                                                                {{ this.heightNote }}
                                                            </b-tag>
                                                        </div>
                                                    </div>
                                                    <div v-if="cow.observation">
                                                        <hr />
                                                        <div class="columns">
                                                            <div class="column is-12">
                                                                <span class="has-text-weight-bold">Observation: </span>
                                                                {{ cow.observation }}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <b-field class="is-pulled-right">
                                        <b-button rounded @click="nextTab()" icon-right="arrow-right">Next</b-button>
                                    </b-field>
                                </b-tab-item>
                                <b-tab-item label="Genealogy">
                                    <template v-if="genealogy.length == 0">
                                        <br />
                                        <div class="columns is-centered">
                                            <div class="column is-12 has-text-centered">
                                                <span class="has-text-weight-bold"> Cow {{ cow.serialNumber }} don't
                                                    have any
                                                    relatives registered. </span>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div id="tree"></div>
                                    </template>
                                    <b-field class="is-pulled-left">
                                        <b-button rounded @click="prevTab()" icon-left="arrow-left">Previous</b-button>
                                    </b-field>
                                    <b-field class="is-pulled-right">
                                        <b-button rounded @click="nextTab()" icon-right="arrow-right">Next</b-button>
                                    </b-field>
                                </b-tab-item>
                                <b-tab-item label="Appointments History">
                                    <div class="pb-2">
                                        <template v-if="appointments.length != 0">
                                            <template>
                                                <div class="card">
                                                    <div class="card-content">
                                                        <div v-for="appointment in appointments" :key="appointment.id">
                                                            <vue-timeline-update :date="appointment.datePast"
                                                                :title="appointment.title"
                                                                :description="appointment.descriptionTimeline"
                                                                category="Appointment" icon="code" color="green" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                        </template>
                                        <template v-else>
                                            <br />
                                            <div class="columns is-centered">
                                                <div class="column is-12 has-text-centered">
                                                    <span class="has-text-weight-bold"> Cow {{ cow.serialNumber }} don't
                                                        have
                                                        any appointments registered. </span>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                    <b-field class="is-pulled-left">
                                        <b-button rounded @click="prevTab()" icon-left="arrow-left">Previous</b-button>
                                    </b-field>
                                    <b-field class="is-pulled-right">
                                        <b-button rounded @click="nextTab()" icon-right="arrow-right">Next</b-button>
                                    </b-field>
                                </b-tab-item>
                                <b-tab-item label="Relocation History">
                                    <template v-if="fieldsHistory.length != 0">
                                        <template>
                                            <div class="card">
                                                <div class="card-content">
                                                    <div v-for="history in fieldsHistory" :key="history.id">
                                                        <vue-timeline-update :date="history.datePast"
                                                            :title="history.title"
                                                            :description="history.descriptionTimeline"
                                                            category="Relocation" icon="code" color="black" />
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </template>
                                    <template v-else>
                                        <br />
                                        <div class="columns is-centered">
                                            <div class="column is-12 has-text-centered">
                                                <span class="has-text-weight-bold"> This cow {{ cow.serialNumber }} has
                                                    no
                                                    registered moves. </span>
                                            </div>
                                        </div>
                                    </template>
                                    <b-field class="is-pulled-left">
                                        <b-button rounded @click="prevTab()" icon-left="arrow-left">Previous</b-button>
                                    </b-field>
                                    <b-field class="is-pulled-right">
                                        <b-button rounded @click="nextTab()" icon-right="arrow-right">Next</b-button>
                                    </b-field>
                                </b-tab-item>
                                <b-tab-item label="Owner History">
                                    <template>
                                        <br />
                                        <div class="columns is-centered">
                                            <div class="column is-12 has-text-centered">
                                                <span class="has-text-weight-bold"> You are the 1st owner of cow with
                                                    serial number - {{ cow.serialNumber }}. </span>
                                            </div>
                                        </div>
                                    </template>
                                    <b-field class="is-pulled-left">
                                        <b-button rounded @click="prevTab()" icon-left="arrow-left">Previous</b-button>
                                    </b-field>
                                </b-tab-item>
                            </b-tabs>
                        </div>
                    </div>
                </template>

            </div>
        </div>
    </div>
</template>

<script>
import { toDateTime, toNewDate } from '../helpers.js'
import OrgChart from '@balkangraph/orgchart.js'

export default {
    data() {
        return {
            title: "Cow",
            cowId: this.$route.params.bovineId,
            cow: {},
            appointments: [],
            isLoading: true,
            activeTab: 0,
            weightNote: "",
            heightNote: "",
            isTag1Active: 1,
            isTag2Active: 1,
            genealogy: [],
            genealogyData: [],
            image: {},
            fieldsHistory: []
        }
    },
    methods: {
        prevTab() {
            this.activeTab--
        },
        nextTab() {
            this.activeTab++
        },
        getCow() {
            axios.get(`${process.env.VUE_APP_API_URL}bovines/${this.cowId}`)  // eslint-disable-line
                .then(response => {
                    this.cow = response.data
                    this.cow.birthDate = toDateTime(this.cow.birthDate)

                    axios.get(`${process.env.VUE_APP_API_URL}appointment/bovine/${this.cowId}`)  // eslint-disable-line
                        .then(response => {
                            this.appointments = response.data
                            this.appointments.forEach(appointment => {
                                appointment.appointmentDate = toDateTime(appointment.appointmentDate)
                                appointment.datePast = toNewDate(appointment.appointmentDate)
                                appointment.title = this.indexOf(appointment.idAppointment) + "º- Motive: " + appointment.appointmentType
                                appointment.descriptionTimeline = "<strong>Appointment</strong> cost: " + appointment.cost + "€"
                                
                                if(appointment.observation != ""){
                                    appointment.descriptionTimeline += "with the following observation" + appointment.observation + "."
                                }
                            })

                            axios.get(`${process.env.VUE_APP_API_URL}historyFields/${this.cowId}`)  // eslint-disable-line
                                .then(response => {
                                    this.fieldsHistory = response.data

                                    this.fieldsHistory.forEach(history => {
                                        history.switchDate = toDateTime(history.switchDate)
                                        history.datePast = new Date(history.switchDate.split(" ")[0])
                                        history.title = this.indexOfRelocation(history.idFieldHistory) + "º- Field: " + history.fieldDescription
                                        history.descriptionTimeline = "<strong>Cow</strong> with serial nº" + history.bovineSerialNumber + " move to field <strong>'" + history.fieldDescription + "'</strong> with the address <strong>'" + history.fieldAddress + "'</strong>."
                                    })

                                    axios.get(`${process.env.VUE_APP_API_URL}bovines/genealogy/${this.cowId}`) // eslint-disable-line
                                        .then(response => {
                                            this.genealogy = response.data
                                            console.log("this.genealogy")
                                            console.log(this.genealogy)

                                            var imgAux = ''
                                            if (this.genealogy.length == 1) {
                                                if (this.genealogy[0].imageCID == '') {
                                                    imgAux = require('../assets/img/blank_cow_image.png')
                                                } else {
                                                    imgAux = 'https://gateway.pinata.cloud/ipfs/' + this.genealogy[0].imageCID
                                                }
                                                this.genealogyData.push({ id: 1, serial_number: this.genealogy[0].serialNumber, breed: this.genealogy[0].breed, color: this.genealogy[0].color, img: imgAux });
                                            } else {
                                                this.genealogy.forEach(bovine => {
                                                    if (bovine.imageCID == "") {
                                                        console.log("TEST")
                                                        imgAux = require('../assets/img/blank_cow_image.png')
                                                    } else {
                                                        imgAux = 'https://gateway.pinata.cloud/ipfs/' + bovine.imageCID
                                                    }

                                                    console.log(bovine.serialNumber)
                                                    console.log(imgAux)

                                                    if (bovine.idBovineParent1 == 0 & bovine.idBovineParent2 == 0) {
                                                        this.genealogyData.push({ id: bovine.idBovine, serial_number: bovine.serialNumber, breed: bovine.breed, color: bovine.color, img: imgAux });
                                                    } else {
                                                        this.genealogyData.push({ id: bovine.idBovine, pid: bovine.idBovineParent1, ppid: bovine.idBovineParent2, serial_number: bovine.serialNumber, breed: bovine.breed, color: bovine.color, img: imgAux });

                                                        this.genealogyData.forEach(partner => {
                                                            if (partner.id == bovine.idBovineParent2) {
                                                                var index = this.genealogyData.findIndex(obj => {
                                                                    return obj.id === partner.id
                                                                })
                                                                var auxObj = partner
                                                                console.log(auxObj)
                                                                this.genealogyData.splice(index, 1, { id: partner.id, pid: bovine.idBovineParent1, serial_number: auxObj.serial_number, breed: auxObj.breed, color: auxObj.color, img: auxObj.img, tags: ['partner'] })
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                            this.isLoading = false
                                            console.log(this.genealogyData)
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
                })
                .catch(error => {
                    console.log(error)
                    if (error.response.status == 404) {
                        this.$router.push("/*")
                    }
                })
        },
        getTree() {
            OrgChart.LINK_ROUNDED_CORNERS = 20;
            OrgChart.templates.filtered = Object.assign({}, OrgChart.templates.ana);
            OrgChart.templates.filtered.size = [40, 120];
            OrgChart.templates.filtered.img_0 = '';
            OrgChart.templates.filtered.field_0 = '<text transform="rotate(90)"  style="font-size: 14px;" fill="white" x="60" y="-15" text-anchor="middle">{val}</text>';
            var chart = new OrgChart(document.getElementById("tree"), {
                mouseScrool: OrgChart.action.none,
                template: "olivia",
                filterBy: ['serial_number', 'breed', 'color'],
                tags: {
                    filter: {
                        template: 'filtered'
                    }
                },
                nodeBinding: {
                    field_0: "serial_number",
                    field_1: "breed",
                    field_2: "color",
                    img_0: "img"
                },
                editForm: {
                    buttons: {
                        edit: {
                            icon: OrgChart.icon.edit(24, 24, '#fff'),
                            text: 'Edit',
                            hideIfDetailsMode: true
                        },
                        share: {
                            icon: OrgChart.icon.share(24, 24, '#fff'),
                            text: 'Share'
                        },
                        pdf: {
                            icon: OrgChart.icon.pdf(24, 24, '#fff'),
                            text: 'Save as PDF',
                            hideIfDetailsMode: false
                        },
                    }
                }
            });
            chart.load(this.genealogyData);
        },
        indexOf(appointmentId) {
            var index = this.appointments.findIndex(x => x.idAppointment === appointmentId);
            return this.appointments.length - index
        },
        indexOfRelocation(historyId) {
            var index = this.fieldsHistory.findIndex(x => x.idFieldHistory === historyId);
            return this.fieldsHistory.length - index
        },
        getWeightInfortmation(cow) {
            var ageAux = parseInt(cow.age.substring(0, cow.age.indexOf(' ')))
            var ageType = cow.age.substring(cow.age.indexOf(' ') + 1, cow.age.length)

            switch (cow.gender) {
                case false:
                    if ((ageAux > 2 & cow.weight <= 720) | (ageType != "years" & cow.weight <= 720)) {
                        this.weightNote = "Normal weight."
                        return "is-dark"
                    } else {
                        this.weightNote = "Weigh above average."
                        return 'is-warning'
                    }

                case true:
                    if ((ageAux > 2 & cow.weight <= 1100) | (ageType != "years" & cow.weight <= 1100)) {
                        this.weightNote = "Normal weight."
                        return "is-dark"
                    } else {
                        this.weightNote = "Weigh above average."
                        return 'is-warning'
                    }
            }
        },
        getHeightInfortmation(cow) {
            var ageAux = parseInt(cow.age.substring(0, cow.age.indexOf(' ')))
            var ageType = cow.age.substring(cow.age.indexOf(' ') + 1, cow.age.length)

            if ((ageAux > 2 & cow.height <= 1.45) | (ageType != "years" & cow.height <= 1.45)) {
                this.heightNote = "Normal Height"
                return 'is-dark'
            } else {
                this.heightNote = "Height above average"
                return 'is-warning'
            }
        }
    },
    created() {
        this.$emit('title', this.title)
    },
    mounted() {
        this.getCow();
    },
    updated() {
        this.getTree();
    }
}
</script>
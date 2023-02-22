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
                        <template v-else-if="cows.length == 0">
                            <div class="columns is-centered">
                                <div class="column is-12 has-text-centered">
                                    <span class="has-text-weight-bold"> You don't have any cows registered. </span>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <validation-observer ref="observer">
                                <b-tabs v-model="activeTab" expanded>
                                    <b-tab-item label="Informations">
                                        <div class="columns">
                                            <div class="column">
                                                <validation-provider vid="auctionDescription" rules="required|max:50"
                                                    name="Description" v-slot="validationContext">
                                                    <b-field :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <template slot="label">Description <span
                                                                class="has-text-danger">*</span></template>
                                                        <b-input v-model="auctionDescription"></b-input>
                                                    </b-field>
                                                </validation-provider>
                                            </div>
                                        </div>
                                        <div class="columns">
                                            <div class="column">
                                                <validation-provider vid="startDate" rules="required" name="Start Date"
                                                    v-slot="validationContext">
                                                    <b-field expanded :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <template slot="label">Start Date <span
                                                                class="has-text-danger">*</span></template>
                                                        <b-datetimepicker v-model="startDate"
                                                            placeholder="Click to select..." 
                                                            :datepicker="{ showWeekNumber }"
                                                            :timepicker="{ enableSeconds, hourFormat: format }"
                                                            :min-datetime="dateNow" :max-datetime="endDate"
                                                            horizontal-time-picker>
                                                        </b-datetimepicker>
                                                    </b-field>
                                                </validation-provider>
                                            </div>
                                            <div class="column">
                                                <validation-provider vid="endDate" rules="required" name="End Date"
                                                    v-slot="validationContext">
                                                    <b-field expanded :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <template slot="label">End Date <span
                                                                class="has-text-danger">*</span></template>
                                                        <b-datetimepicker v-model="endDate"
                                                            placeholder="Click to select..." 
                                                            :datepicker="{ showWeekNumber }"
                                                            :timepicker="{ enableSeconds, hourFormat: format }"
                                                            :min-datetime="startDate ? startDate : dateNow"
                                                            horizontal-time-picker>
                                                        </b-datetimepicker>
                                                    </b-field>
                                                </validation-provider>
                                            </div>
                                        </div>
                                        <div class="columns">
                                            <div class="column">
                                                <validation-provider rules="required" name="Cow"
                                                    v-slot="validationContext">
                                                    <b-field rounded label="Cow"
                                                        :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <template slot="label">Cow to Sell <span
                                                                class="has-text-danger">*</span></template>
                                                        <b-select v-model="idBovine" placeholder="Select a cow"
                                                            expanded>
                                                            <option v-for="cow in cows" :value="cow.idBovine"
                                                                :key="cow.id">
                                                                Cow S.N.: {{ cow.serialNumber }} - Breed: {{ cow.breed
                                                                }}
                                                            </option>
                                                        </b-select>
                                                    </b-field>
                                                </validation-provider>
                                            </div>
                                            <div class="column is-6">
                                                <validation-provider vid="startingPrice" :rules="{
                                                        required: true,
                                                        min_value: 1,
                                                        decimal_validation: startingPrice
                                                    }" name="Starting Price"  v-slot="validationContext">
                                                    <b-field :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <template slot="label">Starting Price <span
                                                                class="has-text-danger">*</span></template>
                                                        <b-input v-model="startingPrice" :placeholder=startingPrice>
                                                        </b-input>
                                                    </b-field>
                                                </validation-provider>
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

extend('decimal_validation', {
    validate(value) {
        if (typeof value === 'undefined' || value === null || value === '') {
            return `Define a valid starting price value ${value} .`
        } else if (/^\d+(.\d{1,2})?$/.test(value) == false) {
            return `${value} is not a valid starting price.`
        } else {
            return true;
        }
    }
});

export default {
    data() {
        return {
            title: "New Auction",
            isLoading: false,
            isLoadingPanel: true,
            activeTab: 0,
            idBovine: null,
            auctionDescription: "My Auction",
            startDate: null,
            endDate: null,
            status: 0,
            startingPrice: 1,
            dateNow: null,
            cows: [],
            format: '24',
            showWeekNumber: false,
            enableSeconds: false
        }
    },
    watch: {
		endDate: function (o) {
            if (o != null && this.startDate != null ){
                if(this.startDate.getTime() == o.getTime()){
                    this.startDate = new Date(this.startDate.getTime() - 5*60000)
                    return
                }
            }
		}
	},
    methods: {
        getValidationState({ dirty, validated, valid = null }) {
            return dirty || validated ? (valid ? "" : "is-danger") : "";
        },
        getCows() {
            axios.get(`${process.env.VUE_APP_API_URL}bovines/${this.$parent.user.idWallet}/own/auction`)  // eslint-disable-line
                .then(response => {
                    this.cows = response.data
                    this.dateNow = new Date(new Date().getTime() + 10*60000)
                    this.isLoadingPanel = false
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
                        loadingSnackbar.close()
                        this.isLoading = false
                        return
                    }

                    var startTimestamp = Date.parse(this.startDate)
                    var endTimestamp = Date.parse(this.endDate)
                    var currentTimestamp = Math.floor((new Date().getTime()) / 1000)

                    if (currentTimestamp >= startTimestamp && currentTimestamp <= endTimestamp) {
                        this.status = 1;
                    }else if (currentTimestamp <= startTimestamp && currentTimestamp <= endTimestamp) {
                        this.status = 0
                    }

                    axios.post(`${process.env.VUE_APP_API_URL}auctions/`, {  // eslint-disable-line
                        "idBovine": this.idBovine,
                        "idOwner": this.$parent.user.idWallet,
                        "auctionDescription": this.auctionDescription,
                        "startDate": this.startDate,
                        "endDate": this.endDate,
                        "status": this.status,
                        "startingPrice": this.startingPrice
                    })
                        .then(() => {
                            this.$buefy.toast.open({
                                duration: 3000,
                                message: 'Auction created successfully!',
                                type: 'is-success'
                            })
                            this.$router.push("/auctions").catch(e => { console.log(e)})
                        })
                        .catch(error => {
                            console.log(error)
                        })
                        .then(() => {
                            loadingSnackbar.close()
                            this.isLoading = false
                        })
                })
        }
    },
    created() {
        this.$emit('title', this.title)
        this.$emit('back', "")
        this.getCows();
    }
}
</script>

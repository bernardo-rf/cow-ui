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
                            <span class="is-size-3 mr-2">{{ auction.auctionDescription }}</span>
                        </div>
                        <template v-if="auction.status == 0">
                            <div class="column is-6 has-text-right crud-button">
                                <b-button type="is-dark" rounded tag="router-link"
                                    :to="'/auction/' + auction.idAuction + '/update'">Update</b-button>
                            </div>
                        </template>
                    </div>
                    <div class="columns">
                        <div class="column">
                            <div class="columns" v-if="auction.status == 1.">
                                <div class="column">
                                    <b-collapse animation="slide" aria-id="contentIdForBidder" :open="false">
                                        <template #trigger="props">
                                            <div class="card-header card-header-cow" role="button"
                                                aria-controls="contentIdForBidder" :aria-expanded="props.open">
                                                <p class="card-header-title">
                                                    Place a Bid:
                                                </p>
                                                <a class="card-header-icon">
                                                    <b-icon :icon="props.open ? 'menu-up' : 'menu-down'">
                                                    </b-icon>
                                                </a>
                                            </div>
                                        </template>
                                        <validation-observer ref="observer">
                                            <div class="card">
                                                <div class="card-content">
                                                    <div class="columns">
                                                        <div class="column">
                                                            <validation-provider vid="bidValue" :rules="{
                                                                required: true,
                                                                min_value: bidMinValue,
                                                                decimal_validation: bidValue
                                                            }" name="Bid Value" v-slot="validationContext">
                                                                <b-field :type="getValidationState(validationContext)"
                                                                    :message="validationContext.errors[0]">
                                                                    <template slot="label">Bid Value <span
                                                                            class="has-text-danger">*</span></template>
                                                                    <b-input v-model="bidValue">
                                                                    </b-input>
                                                                </b-field>
                                                            </validation-provider>
                                                        </div>
                                                    </div>
                                                    <div class="columns">
                                                        <div class="column">
                                                            <b-field class="is-pulled-right">
                                                                <b-button type="is-dark" rounded :loading="isLoadingBid"
                                                                    @click.prevent="submit">
                                                                    Submit</b-button>
                                                            </b-field>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </validation-observer>
                                    </b-collapse>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-content">
                                    <div class="columns">
                                        <div class="column is-vcentered">
                                            <span class="is-size-3">Cow Information</span>
                                            <figure class="image is-256x256 is-horizontal-center">
                                                <img class="image is-rounded"
                                                    :src="auction.bovine.imageCID == '' ? require('../assets/img/blank_cow_image.png') : 'https://gateway.pinata.cloud/ipfs/' + auction.bovine.imageCID"
                                                    :title="auction.bovine.SerialNumber">
                                            </figure>
                                        </div>
                                    </div>
                                    <div class="column">
                                        <div class="card">
                                            <div class="card-content">
                                                <div class="columns">
                                                    <div class="column">
                                                        <span class="has-text-weight-bold">Serial Number: </span>
                                                        {{ auction.bovine.serialNumber }}
                                                    </div>
                                                    <div class="column">
                                                        <span class="has-text-weight-bold">Birth Date:</span>
                                                        {{ auction.bovine.birthDate }}
                                                    </div>
                                                </div>
                                                <div class="columns">
                                                    <div class="column">
                                                        <span class="has-text-weight-bold">Color: </span> {{
                                                                auction.bovine.color
                                                        }}
                                                    </div>
                                                    <div class="column">
                                                        <span class="has-text-weight-bold">Breed: </span> {{
                                                                auction.bovine.breed
                                                        }}
                                                    </div>
                                                </div>
                                                <div class="columns">
                                                    <div class="column">
                                                        <span class="has-text-weight-bold">Weight:</span>
                                                        {{ auction.bovine.weight }} Kg
                                                    </div>
                                                    <div class="column">
                                                        <span class="has-text-weight-bold">Height:</span>
                                                        {{ auction.bovine.height }} m
                                                    </div>
                                                </div>
                                                <div class="columns">
                                                    <div class="column is-centered">
                                                        <div v-if="auction.bovine.gender == '0'">
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
                                                    <div v-if="auction.bovine.observation" class="column">
                                                        <span class="has-text-weight-bold">Observation: </span>
                                                        {{ auction.bovine.observation }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="column">
                            <div class="card">
                                <div class="card-content">
                                    <div class="columns">
                                        <span class="is-size-3">Auction Information</span>
                                    </div>
                                    <div class="card">
                                        <div class="card-content">
                                            <div class="columns">
                                                <div class="column">
                                                    <span class="has-text-weight-bold">Start Date: </span> {{
                                                            auction.startDate
                                                    }}
                                                </div>
                                                <div class="column">
                                                    <span class="has-text-weight-bold">End Date: </span> {{
                                                            auction.endDate
                                                    }}
                                                </div>
                                            </div>
                                            <div class="columns">
                                                <div class="column"
                                                    v-if="endTimestamp >= currentTimestamp && currentTimestamp >= startTimestamp">
                                                    <countdown :time="(endTimestamp - currentTimestamp)">
                                                        <template slot-scope="props"><span
                                                                class="has-text-weight-bold">Time Remaining:</span> {{
                                                                        props.days
                                                                }} d, {{ props.hours }} hrs, {{ props.minutes }}
                                                            min, {{ props.seconds }}sec.</template>
                                                    </countdown>
                                                </div>
                                            </div>
                                            <div class="columns">
                                                <div class="column" v-if="currentTimestamp < startTimestamp">
                                                    <countdown v-if="auction.status == 0"
                                                        :time="(startTimestamp - currentTimestamp)">
                                                        <template slot-scope="props"><span
                                                                class="has-text-weight-bold">Starts In:</span> {{
                                                                        props.days
                                                                }} d, {{ props.hours }} hrs, {{ props.minutes }}
                                                            min, {{ props.seconds }}sec.</template>
                                                    </countdown>
                                                </div>
                                            </div>
                                            <div class="columns">
                                                <div class="column">
                                                    <span class="has-text-weight-bold">Created By:</span> {{
                                                            auction.user.name
                                                    }}
                                                </div>
                                                <div class="column">
                                                    <span class="has-text-weight-bold">Starting Price: </span> {{
                                                            auction.startingPrice
                                                    }} €
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div class="columns">
                                        <div class="column is-10">
                                            <span class="is-size-3">Top Bidders</span>
                                        </div>
                                    </div>
                                    <template v-if="bidders.length != 0">
                                        <div class="columns">
                                            <div class="column">
                                                <b-table :data="bidders" :paginated="isPaginated" :per-page="perPage"
                                                    :current-page.sync="currentPage" default-sort="idContract"
                                                    :default-sort-direction="'asc'">
                                                    <template slot-scope="props">
                                                        <b-table-column label="Contract Identifier">
                                                            {{ props.row.idContract }}
                                                        </b-table-column>
                                                        <b-table-column label="Value">
                                                            {{ props.row.value }} €
                                                        </b-table-column>
                                                        <b-table-column label="Bid Date">
                                                            {{ props.row.bidDate }}
                                                        </b-table-column>
                                                    </template>
                                                </b-table>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="card">
                                            <div class="card-content">
                                                <div class="columns is-centered">
                                                    <div class="column is-12 has-text-centered">
                                                        <span class="has-text-weight-bold"> There aren't any bids
                                                            registered. </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>

                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { toDate, toDateTime } from '../helpers'
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
            title: "Auction",
            isOpen: false,
            isLoading: true,
            isLoadingBid: false,
            activeTab: 0,
            auctionId: this.$route.params.auctionId,
            auction: {},
            bidders: [],
            currentTimestamp: new Date().getTime(),
            startTimestamp: null,
            endTimestamp: null,
            bidValue: 0,
            bidMinValue: 0,
            isPaginated: true,
            perPage: 3,
            currentPage: 1,
            isPaginationSimple: false,
            paginationPosition: 'bottom',
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
        getValidationState({ dirty, validated, valid = null }) {
            return dirty || validated ? (valid ? "" : "is-danger") : "";
        },
        getInformation() {
            axios.get(`${process.env.VUE_APP_API_URL}auctions/${this.auctionId}`) // eslint-disable-line
                .then(response => {
                    this.auction = response.data
                    this.auction.startDate = toDateTime(this.auction.startDate)
                    this.auction.endDate = toDateTime(this.auction.endDate)
                    this.auction.bovine.birthDate = toDate(this.auction.bovine.birthDate)
                    this.startTimestamp = Date.parse(this.auction.startDate)
                    this.endTimestamp = Date.parse(this.auction.endDate)
                    this.bidders = this.auction.bidSet.sort((a,b) => b.value - a.value)
                    this.isLoading = false

                    if (this.bidders.length == 0) {
                        this.bidMinValue = this.auction.startingPrice
                    } else {
                        this.bidders.forEach(bid => {
                            bid.bidDate = toDate(bid.bidDate)

                            if (this.bidMinValue < bid.value) {
                                this.bidMinValue = bid.value
                            }
                        })
                    }
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
                .then(() => {
                    this.isLoadingBid = true
                    const loadingSnackbar = this.$buefy.snackbar.open({
                        message: 'Writing to blockchain. This might take some time...',
                        position: 'is-bottom-left',
                        type: 'is-warning',
                        indefinite: true
                    })

                    axios.post(`${process.env.VUE_APP_API_URL}bids/`, {  // eslint-disable-line
                        "idAuction": this.auctionId,
                        "idBidder": this.$parent.user.idWallet,
                        "value": this.bidValue,
                        "bidDate": new Date()
                    })
                        .then( () => {
                            this.$buefy.toast.open({
                                duration: 3000,
                                message: 'Bid created successfully!',
                                type: 'is-success'
                            })
                            this.isLoadingBid = false
                        })
                        .catch(error => {
                            console.log(error)
                        })
                        .then(() => {
                            this.isLoading = false
                            loadingSnackbar.close()
                            this.$router.push("/auctions").catch(e => { console.log(e)})
                        })
                })
        },
    },
    created() {
        this.$emit('title', this.title)
        this.getInformation();
    }
}
</script>

<template>
    <div>
        <div class="card box shadow">
            <div class="card-content">
                <template v-if="isLoading">
                    <div class="columns is-centered">
                        <div class="column is-12 has-text-centered">
                            <b-icon pack="fas" icon="sync-alt" size="is-large" custom-class="fa-spin"></b-icon>
                        </div>
                    </div>
                </template>
                <template v-else-if="currentAuctions.length == 0">
                    <template>
                        <div class="columns is-vcentered">
                            <div class="column is-12 has-text-right crud-button">
                                <b-button icon-left="plus" type="is-dark" rounded tag="router-link" :to="'/newAuction'">
                                    Create</b-button>
                            </div>
                        </div>
                    </template>
                    <div class="columns is-centered">
                        <div class="column is-12 has-text-centered">
                            <span class="has-text-weight-bold"> There aren't any auctions registered. </span>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <template>
                        <div class="columns is-vcentered">
                            <div class="column has-text-right crud-button">
                                <b-button icon-left="plus" type="is-dark" rounded tag="router-link" :to="'/newAuction'">
                                    Create</b-button>
                            </div>
                        </div>
                    </template>
                    <div class="card box" v-for="auction in currentAuctions" :key="auction.id">
                        <div class="card-content has-padding-top-0 has-padding-bottom-0">
                            <div class="columns is-vcentered">
                                <div class="column is-2 has-text-centered ">
                                    <router-link :to="'/auction/' + auction.idAuction"><span class="is-size-5">{{
                                            auction.auctionDescription
                                    }}</span></router-link>
                                </div>
                                <div class="column is-4"
                                    v-if="auction.endTimestamp >= currentTimestamp && currentTimestamp <= auction.startTimestamp">
                                    <countdown :time="(auction.startTimestamp - currentTimestamp)"
                                        @end="onCountdownEndInProgress(auction.idAuction)">
                                        <template slot-scope="props"><span class="has-text-weight-bold">Start In:
                                            </span> {{ props.days
                                            }} d, {{ props.hours }} hrs, {{ props.minutes }}
                                            min, {{ props.seconds }}sec.</template>
                                    </countdown>
                                </div>
                                <div class="column is-4"
                                    v-if="auction.endTimestamp >= currentTimestamp && currentTimestamp >= auction.startTimestamp">
                                    <countdown :time="(auction.endTimestamp - currentTimestamp)"
                                        @end="onCountdownEndConcluded(auction.idAuction)">
                                        <template slot-scope="props"><span class="has-text-weight-bold">Time
                                                Remaining:</span> {{ props.days
                                                }} d, {{ props.hours }} hrs, {{ props.minutes }}
                                            min, {{ props.seconds }}sec.</template>
                                    </countdown>
                                </div>
                                <div class="column is-2 has-text-centered">
                                    <span class="has-text-weight-bold">Starting Price: </span> {{ auction.startingPrice
                                    }}€
                                </div>
                                <div class="column is-2 has-text-centered">
                                    <span class="has-text-weight-bold">Curr. Highest Bid </span> {{auction.highestBid == 0 ? 'N/D' : auction.highestBid + ' €' }}
                                </div>
                                <div class="column is-1">
                                    <template slot="searchable" slot-scope="props">
                                        <b-input v-model="props.filters[props.column.field]" placeholder="Search..."
                                            icon="magnify" size="is-small" />
                                    </template>
                                    <b-tag v-if="auction.status == 0" type="is-dark">Starting Soon</b-tag>
                                    <b-tag v-if="auction.status == 1" type="is-warning">In Progress</b-tag>
                                    <b-tag v-if="auction.status == 2" type="is-danger">Concluded</b-tag>
                                </div>
                                <div class="column is-1 has-text-right crud-button">
                                    <b-button type="is-dark" rounded tag="router-link"
                                        :to="`/auction/${auction.idAuction}`">
                                        Open</b-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div>
            <h3 class="title is-3">Past Auctions </h3>
            <div class="card box shadow">
                <div class="card-content">
                    <template v-if="isLoading">
                        <div class="columns is-centered">
                            <div class="column is-12 has-text-centered">
                                <b-icon pack="fas" icon="sync-alt" size="is-large" custom-class="fa-spin"></b-icon>
                            </div>
                        </div>
                    </template>
                    <template v-else-if="pastAuctions.length == 0">
                        <div class="columns is-centered">
                            <div class="column is-12 has-text-centered">
                                <span class="has-text-weight-bold"> There aren't any past auctions. </span>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="card box" v-for="auction in pastAuctions" :key="auction.id">
                            <div class="card-content has-padding-top-0 has-padding-bottom-0">
                                <div class="columns is-vcentered">
                                    <div class="column is-2 has-text-centered ">
                                        <router-link :to="'/auction/' + auction.idAuction"><span class="is-size-5">{{
                                                auction.auctionDescription
                                        }}</span></router-link>
                                    </div>
                                    <div class="column is-2">
                                        <span class="has-text-weight-bold">Start Date: </span> {{ auction.startDate }}
                                    </div>
                                    <div class="column is-2">
                                        <span class="has-text-weight-bold">End Date: </span> {{ auction.endDate }}
                                    </div>
                                    <div class="column is-2 has-text-centered">
                                        <span class="has-text-weight-bold">Bovine: </span>
                                        <figure class="image is-64x64 is-horizontal-center">
                                            <img class="image is-rounded"
                                                :src="auction.bovine.imageCID == '' ? 'img/no_image.png' : 'https://gateway.pinata.cloud/ipfs/' + auction.bovine.imageCID"
                                                :title="auction.bovine.serialNumber">
                                        </figure>
                                    </div>
                                    <div class="column is-2 has-text-centered">
                                        <span class="has-text-weight-bold">Highest Bid:</span> {{
                                                auction.highestBid
                                        }}€
                                    </div>
                                    <div class="column is-1">
                                        <template slot="searchable" slot-scope="props">
                                            <b-input v-model="props.filters[props.column.field]" placeholder="Search..."
                                                icon="magnify" size="is-small" />
                                        </template>
                                        <b-tag v-if="auction.status == 0" type="is-dark">Starting Soon</b-tag>
                                        <b-tag v-if="auction.status == 1" type="is-warning">In Progress</b-tag>
                                        <b-tag v-if="auction.status == 2" type="is-danger">Concluded</b-tag>
                                    </div>
                                    <div class="column is-1 has-text-right crud-button">
                                        <b-button type="is-dark" rounded tag="router-link"
                                            :to="`/auction/${auction.idAuction}`">
                                            Open</b-button>
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
<script>
import { toDate, toDateTime } from '../helpers.js'

export default {
    data() {
        return {
            title: "Auctions",
            isLoading: true,
            isUpdatingStatus: false,
            currentAuctions: [],
            pastAuctions: [],
            currentTimestamp: null,
            snackbarAuctionStatus: {}
        }
    },
    methods: {
        getAuctions() {
            axios.get(`http://${process.env.VUE_APP_API_URL}auctions/`)  // eslint-disable-line
                .then(response => {
                    if (this.isUpdatingStatus) {
                        this.isLoading = true
                        this.currentAuctions = []
                        this.pastAuctions = []
                    }
                    var auctions = response.data
                    this.currentTimestamp = new Date().getTime()
                    
                    auctions.forEach(auction => {
                        auction.startTimestamp = Date.parse(toDateTime(auction.startDate))
                        auction.endTimestamp = Date.parse(toDateTime(auction.endDate))

                        auction.startDate = toDate(auction.startDate)
                        auction.endDate = toDate(auction.endDate)

                        if (auction.status == 2) {
                            this.pastAuctions.push(auction)
                        } else {
                            this.currentAuctions.push(auction)
                        }

                        auction.highestBid = 0
                        if (auction.bidSet.length != 0) {
                            auction.bidSet.forEach(bid => {
                                if (auction.highestBid < bid.value) {
                                    auction.highestBid = bid.value
                                }
                            })
                        }

                    })

                    this.isLoading = false
                    if (this.isUpdatingStatus) {
                        this.snackbarAuctionStatus.close()
                        this.isUpdatingStatus = false
                        this.isLoading = false
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        onCountdownEndConcluded: function (idAuction) {
            this.isLoading = true
            this.isUpdatingStatus = true

            this.snackbarAuctionStatus = this.$buefy.snackbar.open({
                message: 'Updating auction status. This might take some time...',
                position: 'is-bottom-left',
                type: 'is-warning',
                indefinite: true
            })

            this.status = 2
            axios.put(`http://${process.env.VUE_APP_API_URL}auctions/${idAuction}/status?status=${this.status}`)  // eslint-disable-line
                .then(() => {
                    this.getAuctions()
                })
                .catch(error => {
                    console.log(error)
                })
        },
        onCountdownEndInProgress: function (idAuction) {
            this.isLoading = true
            this.isUpdatingStatus = true

            this.snackbarAuctionStatus = this.$buefy.snackbar.open({
                message: 'Updating auction status. This might take some time...',
                position: 'is-bottom-left',
                type: 'is-warning',
                indefinite: true
            })

            this.status = 1
            axios.put(`http://${process.env.VUE_APP_API_URL}auctions/${idAuction}/status?status=${this.status}`)  // eslint-disable-line
                .then(() => {
                    this.getAuctions()
                })
                .catch(error => {
                    console.log(error)
                })
        }
    },
    created() {
        this.$emit('title', this.title)
        this.$emit('back', "")
        this.getAuctions()
    }
}
</script>
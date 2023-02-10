º<template>
    <div>
        <h3 class="title is-3">My Cows</h3>
        <div class="card box shadow">
            <div class="card-content">
                <template v-if="isLoading">
                    <div class="columns is-centered">
                        <div class="column is-12 has-text-centered">
                            <b-icon pack="fas" icon="rotate" size="is-large" custom-class="fa-spin"></b-icon>
                        </div>
                    </div>
                </template>
                <template v-else-if="cows.length == 0">
                    <template>
                        <div class="columns is-vcentered">
                            <div class="column is-12 has-text-right crud-button">
                                <b-button class="has-margin-right-5" type="is-success" rounded tag="router-link" :to="'/auctions'">Buy</b-button>
                                <b-button icon-left="plus" type="is-dark" rounded tag="router-link" :to="'/newCow'">Create</b-button>
                            </div>
                        </div>
                    </template>
                    <div class="columns is-centered">
                        <div class="column is-12 has-text-centered">
                            <span class="has-text-weight-bold"> You don't have any cows registered. </span>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <template>
                        <div class="columns is-vcentered">
                            <div class="column is-12 has-text-right crud-button">
                                <b-button class="has-margin-right-5" type="is-success" rounded tag="router-link" :to="'/auctions'">Buy</b-button>
                                <b-button icon-left="plus" type="is-dark" rounded tag="router-link" :to="'/newCow'">Create</b-button>
                            </div>
                        </div>
                    </template>
                    <div class="card box" v-for="cow in cows" :key="cow.id">
                        <div class="card-content has-padding-top-0 has-padding-bottom-0">
                            <div class="columns is-vcentered">
                                <div class="column is-2">
                                    <figure class="image is-64x64 is-horizontal-center">
                                        <img class="image is-rounded" :src="cow.imageCID == '' ? 'img/no_image.png' : 'https://gateway.pinata.cloud/ipfs/' + cow.imageCID" :title="cow.SerialNumber">
                                    </figure>
                                </div>
                                <div class="column is-2">
                                    <span class="has-text-weight-bold">Serial Number: </span> {{cow.serialNumber}}
                                </div>
                                <div class="column is-2">
                                    <span class="has-text-weight-bold">Birth Date: </span> {{cow.birthDate}}
                                </div>
                                <div class="column is-2">
                                    <span class="has-text-weight-bold">Color: </span> {{cow.color}}
                                </div>
                                <div class="column is-3">
                                    <span class="has-text-weight-bold">Breed: </span> {{cow.breed}}
                                </div>
                                <div class="column is-1 has-text-right">
                                    <b-button class="has-text-right" tag="router-link" :to="'/cow/' + cow.idBovine" rounded type="is-dark">Open</b-button>
                                </div>
                            </div>
                            <div class="columns is-vcentered">
                                <div class="column is-2 has-text-centered ">
                                    <router-link :to="'/cow/' + cow.idBovine"><span class="is-size-5">{{cow.serialNumber}}</span></router-link>
                                </div>
                                <div class="column is-10">
                                    <span class="has-text-weight-bold">Location: </span> {{cow.field.address}}
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
import {toDate} from '../helpers.js'

export default {
    data(){
        return {
            title: "Cows",
            cows: [],
            isLoading: true,
        }
    },
    methods: {
        getCows(){
            axios.get(`http://${process.env.VUE_APP_API_URL}bovines/${this.$parent.user.idWallet}/own`)  // eslint-disable-line
            .then(response => {
                this.cows = response.data
                this.cows.forEach(cow => {
                    cow.birthDate = toDate(cow.birthDate)
                })
                this.isLoading = false
            })
            .catch(error => {
                console.log(error)
            })
        }
    },
    created() {
        this.$emit('title',this.title)
        this.$emit('back',"")
        this.getCows()
    }
}
</script>
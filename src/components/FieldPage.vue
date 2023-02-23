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
                            <span class="is-size-3 mr-2">{{field.fieldDescription}}</span>
                        </div>
                        <template>
                            <div class="column is-6 has-text-right crud-button">
                                <b-button icon-right="wrench" class="mr-2" type="is-dark" rounded tag="router-link" :to="'/field/' + field.idField + '/update'">Update</b-button>
                            </div>
                        </template>
                    </div>
                    <div class="columns">
                        <div class="column is-12">
                            <b-tabs v-model="activeTab" expanded>
                                <b-tab-item label="Informations">
                                   <div class="card">
                                        <div class="card-content">
                                            <div class="columns">
                                                <div class="column is-4">
                                                    <span class="has-text-weight-bold">Description: </span> {{field.fieldDescription}}
                                                </div>
                                                <div class="column is-8">
                                                    <span class="has-text-weight-bold">Address:</span> {{field.address}}
                                                </div>
                                            </div>
                                            <hr/>
                                            <div class="columns">
                                                <div class="column is-4">
                                                    <span class="has-text-weight-bold">Latitude: </span> {{ field.latitude }}
                                                </div>
                                                <div class="column is-8">
                                                    <span class="has-text-weight-bold">Longitude: </span> {{ field.longitude }}
                                                </div>
                                            </div>
                                            <hr/>
                                            <div class="columns">
                                                <div class="column is-4">
                                                    <span class="has-text-weight-bold">Max Ocuppation:</span> {{field.limit}}
                                                </div>
                                                <div class="column is-3">
                                                    <span class="has-text-weight-bold">Current Occupation:</span> {{field.currentOccupation}}/{{field.limit}}
                                                </div>
                                                <div class="column is-5">
                                                    <b-progress id="progress_bar" :type="field.currentOccupationPercentage <= 20 ? 'is-success' : field.currentOccupationPercentage <= 75 ? 'is-warning' : 'is-danger'" :value="field.currentOccupationPercentage" show-value format="percent"></b-progress>
                                                </div>
                                            </div>
                                            <div v-if="field.observation">
                                            <hr/>
                                            <div  class="columns">
                                                <div class="column is-12">
                                                    <br/>
                                                    <span class="has-text-weight-bold">Observation: </span> {{field.observation}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>    
                                <br/>
                                </b-tab-item>
                                <b-tab-item :label="'Current Cows (' + cows.length + ')'">
                                    <template v-if="cows.length == 0">
                                        <br/>
                                        <div class="columns is-centered">
                                            <div class="column is-12 has-text-centered">
                                                <span class="has-text-weight-bold"> This field don't have any cows. </span>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="card box" v-for="cow in cows" :key="cow.id">
                                            <div class="card-content pt-0 mb-0">
                                                <div class="columns is-vcentered">
                                                    <div class="column is-2">
                                                        <figure class="image is-64x64 is-horizontal-center is-vcentered">
                                                            <img class="thumbnail-layout image is-rounded" :src="cow.imageCID == '' ? require('../assets/img/blank_cow_image.png') : 'https://gateway.pinata.cloud/ipfs/' + cow.imageCID"  :title="cow.SerialNumber">
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
                                                    <div class="column is-2">
                                                        <span class="has-text-weight-bold">Breed: </span> {{cow.breed}}
                                                    </div>
                                                    <div class="column is-2 has-text-right">
                                                        <b-button class="has-text-right" tag="router-link" :to="'/cow/' + cow.idBovine" rounded type="is-dark">Open</b-button>
                                                    </div>
                                                </div>
                                                <div class="columns is-vcentered">
                                                    <div class="column is-2 has-text-centered ">
                                                        <router-link :to="'/cow/' + cow.idBovine"><span class="is-size-5">{{cow.serialNumber}}</span></router-link>
                                                    </div>
                                                    <div class="column is-10">
                                                        <span class="has-text-weight-bold">Location: </span> {{field.address}}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </b-tab-item>
                                <b-tab-item label="Map">
                                    <div style="height: 500px">
                                        <l-map ref="map" :zoom="zoom" :center="center">
                                            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                                            <l-marker :lat-lng="[field.latitude, field.longitude]">
                                                <l-popup>{{cowsCount}}</l-popup>
                                                <l-icon :icon-size="[32,32]"  :icon-url="require('../assets/img/icon.png')"></l-icon>
                                            </l-marker>
                                            <l-circle :lat-lng="[field.latitude, field.longitude ]" :radius="500">
                                                <l-popup :content=cowsCount />
                                            </l-circle>
                                        </l-map>
                                    </div>
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
import { LMap, LTileLayer, LMarker, LCircle, LPopup, LIcon } from 'vue2-leaflet';
import { Icon } from 'leaflet';
import { toDate } from '../helpers.js'

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default{
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LCircle,
        LPopup,
        LIcon
    },
    data(){
        return{
            title: "Field",
            fieldId: this.$route.params.fieldId,
            field: {},
            cows: [],
            cow:{},
            isLoading: true,
            activeTab: 0,
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution:'&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            zoom: 15,
            center: [0, 0],
            myMap: {},
            cowsCount: ""
        }
    },
    methods: {
        getField(){
            axios.get(`${process.env.VUE_APP_API_URL}fields/${this.fieldId}`) // eslint-disable-line
            .then(response => {
                this.field = response.data
                this.center = [this.field.latitude, this.field.longitude];

                axios.get(`${process.env.VUE_APP_API_URL}fields/bovines/${this.fieldId}`) // eslint-disable-line
                .then(response => {
                    var responseData = response.data
                    this.cows = responseData.bovines
                    this.cows.forEach(cow => {
                       cow.birthDate = toDate(cow.birthDate) 
                    })
                    this.cowsCount = "Currently are "+ this.cows.length + " cows in this field."
                    this.isLoading = false
                })
                .catch(error => {
                    console.log(error)
                    if(error.response.status == 404){
                        this.$router.push("/*")
                    }
                })
            })
            .catch(error => {
                console.log(error)
                if(error.response.status == 404){
                    this.$router.push("/*")
                }
            })
        }
    },
    created() {
        this.$emit('title',this.title)
    },
    mounted(){
        this.getField();
    },
    updated(){
        this.myMap = this.$refs.map.mapObject
        this.myMap.invalidateSize()
    }
}
</script>

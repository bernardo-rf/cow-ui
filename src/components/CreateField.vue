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
                            <validation-observer ref="observer">
                                <b-tabs v-model="activeTab" expanded>
                                    <b-tab-item label="Informations">
                                        <div class="columns">
                                            <div class="column">
                                                <validation-provider vid="description" rules="required|max:100"
                                                    name="Description" v-slot="validationContext">
                                                    <b-field :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <template slot="label">Description <span
                                                                class="has-text-danger">*</span></template>
                                                        <b-input v-model="description" maxlength="100"></b-input>
                                                    </b-field>
                                                </validation-provider>
                                            </div>
                                        </div>
                                        <div class="columns">
                                            <div class="column">
                                                <validation-provider vid="address" rules="required|max:250"
                                                    name="Address" v-slot="validationContext">
                                                    <b-field :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <template slot="label">Address <span
                                                                class="has-text-danger">*</span></template>
                                                        <b-input v-model="address" maxlength="250"></b-input>
                                                    </b-field>
                                                </validation-provider>
                                            </div>
                                        </div>
                                        <div class="columns">
                                            <div class="column">
                                                <validation-provider rules="max:255" name="Observation"
                                                    v-slot="validationContext">
                                                    <b-field :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <template slot="label">Observation </template>
                                                        <b-input v-model="observation" maxlength="255" type="textarea">
                                                        </b-input>
                                                    </b-field>
                                                </validation-provider>
                                            </div>
                                        </div>
                                        <div class="columns">
                                            <div class="column">
                                                <validation-provider vid="latitude" :rules="{
                                                    required: true,
                                                    min_value: -90,
                                                    max_value: 90,
                                                    latitude_validation: latitude
                                                }" name="Latitude" v-slot="validationContext">
                                                    <b-field label="Latitude"
                                                        :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <template slot="label">Latitude <span
                                                                class="has-text-danger">*</span></template>
                                                        <b-input v-model="latitude" :placeholder=latitude></b-input>
                                                    </b-field>
                                                </validation-provider>
                                            </div>
                                            <div class="column">
                                                <validation-provider vid="longitude" :rules="{
                                                    required: true,
                                                    min_value: -180,
                                                    max_value: 180,
                                                    longitude_validation: longitude
                                                }" name="Longitude" v-slot="validationContext">
                                                    <b-field label="Longitude"
                                                        :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <template slot="label">Longitude <span
                                                                class="has-text-danger">*</span></template>
                                                        <b-input v-model="longitude" :placeholder=longitude
                                                            type="decimal">
                                                        </b-input>
                                                    </b-field>
                                                </validation-provider>
                                            </div>
                                        </div>
                                        <div class="columns">
                                            <div class="column">
                                                <validation-provider vid="limit"
                                                    rules="required|min_value:1|max_value:999999" name="Limit"
                                                    v-slot="validationContext">
                                                    <b-field label="Limit" :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <template slot="label">Limit <span
                                                                class="has-text-danger">*</span></template>
                                                        <b-numberinput v-model="limit" type="is-dark" :placeholder=limit
                                                            min="1" max="999999"></b-numberinput>
                                                    </b-field>
                                                </validation-provider>
                                            </div>
                                            <div class="column">
                                                <validation-provider vid="active" rules="required" name="Active"
                                                    v-slot="validationContext">
                                                    <b-field label="Active"
                                                        :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <b-switch v-model="active" type="is-dark">
                                                            {{ active ? 'Cows can be place in the field' : "Cows can't be place in the field"}}
                                                        </b-switch>
                                                    </b-field>
                                                </validation-provider>
                                            </div>
                                        </div>
                                        <hr />
                                        <div v-if="this.cows.length == 0">
                                            <b-field class="is-pulled-right">
                                                <b-button type="is-dark" rounded :loading="isLoading"
                                                    @click.prevent="submit">Submit</b-button>
                                            </b-field>
                                        </div>
                                        <div v-else>
                                            <b-field class="is-pulled-right">
                                                <b-button rounded @click="nextTab()" icon-right="arrow-right">Next
                                                </b-button>
                                            </b-field>
                                        </div>
                                    </b-tab-item>
                                    <b-tab-item v-if="this.cows.length != 0" label="Cows">
                                        <div class="mb-2">
                                            <b-tag type="is-info">NOTE</b-tag> <b>All selected cows</b> will change to
                                            the
                                            new field.
                                        </div>
                                        <div>
                                            <b-table :data="cows" :paginated="isPaginated" :per-page="perPage"
                                                :current-page.sync="currentPage" :pagination-simple="isPaginationSimple"
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
                                        </div>
                                        <hr />
                                        <b-field class="is-pulled-left">
                                            <b-button rounded @click="prevTab()" icon-left="arrow-left">Previous
                                            </b-button>
                                        </b-field>
                                        <b-field class="is-pulled-right">
                                            <b-button type="is-dark" rounded :loading="isLoading"
                                                @click.prevent="submit">
                                                Submit</b-button>
                                        </b-field>
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

extend('latitude_validation', {
    validate(value) {
        if (typeof value === 'undefined' || value === null || value === '') {
            return `Define a valid latitude value ${value} .`
        } else if (/^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})$/.test(value) == false) {
            return `${value} is not a valid latitude.`
        } else {
            return true;
        }
    }
});

extend('longitude_validation', {
    validate(value) {
        if (typeof value === 'undefined' || value === null || value === '') {
            return `Define a valid longitude value ${value} .`
        } else if (/^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})?$/.test(value) == false) {
            return `${value} is not a valid longitude.`
        } else {
            return true;
        }
    }
});

export default {
    data() {
        return {
            title: "New Field",
            isLoadingPanel: true,
            activeTab: 0,
            description: "Field Description",
            address: "Field Address",
            observation: "",
            limit: 50,
            latitude: 39.74362,
            longitude: -8.80705,
            active: true,
            checkedCows: [],
            cows: [],
            isLoading: false,
            isPaginated: true,
            perPage: 10,
            currentPage: 1,
            isPaginationSimple: false,
            paginationPosition: 'bottom'
        }
    },
    methods: {
        prevTab() {
            this.activeTab--
        },
        nextTab() {
            this.activeTab++
        },
        getValidationState({ dirty, validated, valid = null }) {
            return dirty || validated ? (valid ? "" : "is-danger") : "";
        },
        getCows() {
            axios.get(`${process.env.VUE_APP_API_URL}bovines/${this.$parent.user.idWallet}/own`)  // eslint-disable-line
                .then(response => {
                    this.cows = response.data
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

                    axios.post(`${process.env.VUE_APP_API_URL}fields/`, {  // eslint-disable-line
                        "idOwner": this.$parent.user.idWallet,
                        "fieldDescription": this.description,
                        "address": this.address,
                        "limit": this.limit,
                        "latitude": this.latitude,
                        "longitude": this.longitude,
                        "active": this.active,
                        "observation": this.observation,
                        "bovines": this.checkedCows
                    })
                        .then(() => {
                            this.$buefy.toast.open({
                                duration: 3000,
                                message: 'Field created successfully!',
                                type: 'is-success'
                            })
                            this.$router.push("/fields").catch(e => { console.log(e)})
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

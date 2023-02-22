<template>
    <div>
        <h3 class="title is-3">Private Fields</h3>
        <div class="card box shadow">
            <div class="card-content">
                <template v-if="isLoading">
                    <div class="columns is-centered">
                        <div class="column is-12 has-text-centered">
                            <b-icon pack="fas" icon="rotate" size="is-large" custom-class="fa-spin"></b-icon>
                        </div>
                    </div>
                </template>
                <template v-else-if="fields.length == 0">
                    <div class="columns is-centered">
                        <div class="column is-12 has-text-right">
                            <b-button icon-left="plus" type="is-dark" rounded tag="router-link" :to="'/newField'">Create</b-button>
                        </div> 
                    </div>
                    <div class="columns is-centered">
                        <div class="column is-6 has-text-centered">
                            <span class="has-text-weight-bold">You don't have any fields registered. </span>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <template>
                        <div class="columns is-vcentered">
                            <div class="column is-12 has-text-right crud-button">
                                <b-button icon-left="plus" type="is-dark" rounded tag="router-link" :to="'/newField'">Create</b-button>
                            </div>
                        </div>
                    </template>
                    <div class="card box" v-for="field in fields" :key="field.id">
                        <div class="card-content pt-0 mb-0">
                            <div class="columns is-vcentered">
                                <div class="column is-2">
                                    <router-link :to="'/field/' + field.idField"><span class="is-size-5">{{field.fieldDescription}}</span></router-link>
                                </div>
                                <div class="column is-4">
                                    <span class="has-text-weight-bold">Address: </span> {{field.address}}
                                </div>
                                <div class="column is-2">
                                    <span class="has-text-weight-bold">Max Ocupation: </span> {{field.limit}}
                                </div>
                                <div class="column is-3">
                                        <span class="has-text-weight-bold">Current Ocupation: </span>
                                        <b-progress id="progress_bar" :type="field.currentOccupationPercentage <= 20 ? 'is-success' : field.currentOccupationPercentage <= 75 ? 'is-warning' : 'is-danger'" :value="field.currentOccupationPercentage" show-value format="percent"></b-progress>
                                </div>
                                <div class="column is-1 has-text-right">
                                    <b-button class="has-text-right" tag="router-link" :to="'/field/' + field.idField" rounded type="is-dark" expanded>Open</b-button>
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

export default{
    data(){
        return{
            title: "Fields",
            fields: [],
            isLoading: true,
        }
    },  
    methods:{
        getFields(){
            axios.get(`${process.env.VUE_APP_API_URL}fields/${this.$parent.user.idWallet}/full_info`) // eslint-disable-line
            .then(response => {
                this.fields = response.data
                this.isLoading = false
            })
            .catch(error => {
                console.log(error)
            })
        },
    },
    created() {
        this.$emit('title',this.title)
        this.$emit('back',"")
        this.getFields()
    }
}
</script>

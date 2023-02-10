<template>
    <div>
        <div class="columns">
            <div class="column">
                <div class="card box shadow has-margin-bottom-40">
                    <div class="card-content has-padding-bottom-0">
                        <template>
                            <b-message v-if="isEmailNotUnique" type="is-warning" title="Update: Warning" aria-close-label="Close message">
                                <strong>Information:</strong> The email is already taken. Please, choose another one.
                            </b-message>
                            <b-message v-if="isPasswordEqualsPrevious" type="is-warning" title="Update: Warning" aria-close-label="Close message">
                                <strong>Information:</strong> The password must be distinct from previous password
                                definition. Please, choose another one.
                            </b-message>
                            <div class="columns">
                                <div class="column has-text-right">
                                    <b-field label="Update Profile">
                                        <b-switch v-model="isUpdate">
                                        </b-switch>
                                    </b-field>
                                </div>
                            </div>
                        </template>
                        <validation-observer ref="observer">
                            <b-tabs v-model="activeTab" expanded>
                                <b-tab-item label="Informations">
                                    <div class="columns">
                                        <div class="column is-12">
                                            <figure class="image is-128x128 is-horizontal-center is-vcentered">
                                                <img class="thumbnail image is-rounded"
                                                    :src="this.fileURL == '' || this.fileURL == null ? require('../assets/img/blank_user_image.png') : this.fileURL">
                                            </figure>
                                            <b-field v-if="isUpdate" class="file is-dark"
                                                :class="{ 'has-name': !!file }">
                                                <b-upload v-model="file"
                                                    class="file-label is-horizontal-center is-vcentered"
                                                    style="padding-top:10px;">
                                                    <span class="file-cta">
                                                        <b-icon class="file-icon" icon="upload"></b-icon>
                                                        <span class="file-label">Click to upload</span>
                                                    </span>
                                                    <span v-if="file" class="file-name"> {{ file.name }}</span>
                                                </b-upload>
                                            </b-field>
                                        </div>
                                    </div>
                                    <div class="columns">
                                        <div class="column">
                                            <template v-if="isUpdate">
                                                <validation-provider vid="full_name" rules="alpha_spaces|max:150"
                                                    name="Full Name" v-slot="validationContext">
                                                    <b-field :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <template slot="label">Full Name</template>
                                                        <b-input v-model="fullName"></b-input>
                                                    </b-field>
                                                </validation-provider>
                                            </template>
                                            <template v-else>
                                                <b-field>
                                                    <template slot="label">Full Name</template>
                                                    <b-input v-model="user.fullName" disabled></b-input>
                                                </b-field>
                                            </template>
                                        </div>
                                    </div>
                                    <div class="columns">
                                        <div class="column is-6">
                                            <template v-if="isUpdate">
                                                <validation-provider vid="name" rules="required|alpha_dash|max:15"
                                                    name="Username" v-slot="validationContext">
                                                    <b-field :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <template slot="label">Name <span
                                                                class="has-text-danger">*</span></template>
                                                        <b-input v-model="name"></b-input>
                                                    </b-field>
                                                </validation-provider>
                                            </template>
                                            <template v-else>
                                                <b-field>
                                                    <template slot="label">Name</template>
                                                    <b-input v-model="user.name" disabled></b-input>
                                                </b-field>
                                            </template>
                                        </div>
                                        <div class="column is-6">
                                            <template v-if="isUpdate">
                                                <validation-provider vid="birthDate" rules="required" name="Birth Date"
                                                    v-slot="validationContext">
                                                    <b-field :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <template slot="label">Birth Date <span
                                                                class="has-text-danger">*</span></template>
                                                        <b-datetimepicker rounded v-model="birthDate"
                                                            placeholder="Click to select..."
                                                            :datepicker="{ showWeekNumber }" horizontal-time-picker
                                                            :max-datetime="dateNow">
                                                        </b-datetimepicker>
                                                    </b-field>
                                                </validation-provider>
                                            </template>
                                            <template v-else>
                                                <b-field expanded>
                                                    <template slot="label">Birth Date</template>
                                                    <b-datetimepicker v-model="birthDate"
                                                        placeholder="Click to select..."
                                                        :datepicker="{ showWeekNumber }" horizontal-time-picker disabled
                                                        :max-datetime="dateNow">
                                                    </b-datetimepicker>
                                                </b-field>
                                            </template>
                                        </div>
                                    </div>
                                    <div class="columns">
                                        <div class="column">
                                            <template v-if="isUpdate">
                                                <validation-provider vid="email" rules="required|email|max:50" name="Email"
                                                    v-slot="validationContext">
                                                    <b-field :type="getValidationState(validationContext)"
                                                        :message="validationContext.errors[0]">
                                                        <template slot="label">Email <span
                                                                class="has-text-danger">*</span></template>
                                                        <b-input v-model="email"></b-input>
                                                    </b-field>
                                                </validation-provider>
                                            </template>
                                            <template v-else>
                                                <b-field>
                                                    <template slot="label">Email</template>
                                                    <b-input v-model="user.email" disabled></b-input>
                                                </b-field>
                                            </template>

                                        </div>
                                    </div>
                                    <div class="columns">
                                        <div class="column is-6">
                                            <b-field label="User Type">
                                                <b-message type="is-dark" class="shadow">
                                                    <div class="columns">
                                                        <div class="column is-1">
                                                            <b-icon class="title"
                                                                :icon="user.type == 'FARMER' ? 'fa-tractor' : user.type == 'VETERINARY' ? 'fa-paw' : 'fa-money-bill-transfer'"
                                                                size="is-medium">
                                                            </b-icon>
                                                        </div>
                                                        <div class="column">
                                                            <h4 class="title is-4">{{ user.type }}</h4>
                                                        </div>
                                                    </div>
                                                </b-message>
                                            </b-field>
                                        </div>
                                        <div class="column is-6">
                                            <b-field label="Balance">
                                                <b-message
                                                    :type="user.balance <= 0 ? 'is-danger' : user.balance <= 100 ? 'is-warning' : 'is-success'"
                                                    class="shadow">
                                                    <h4 class="title is-4">{{ user.balance }}€</h4>
                                                </b-message>
                                            </b-field>
                                        </div>
                                    </div>
                                    <b-field v-if="isUpdate" label="Update Password">
                                        <b-switch v-model="isUpdatePassword">
                                        </b-switch>
                                    </b-field>
                                    <div v-if="isUpdatePassword">
                                        <hr />
                                        <div class="columns">
                                            <div class="column">
                                                <b-collapse class="card" animation="slide" aria-id="updatePassword">
                                                    <template #trigger="props">
                                                        <div class="card-header" role="button"
                                                            aria-controls="updatePassword" :aria-expanded="props.open">
                                                            <p class="card-header-title">
                                                                Password Update
                                                            </p>
                                                            <a class="card-header-icon">
                                                                <b-icon :icon="props.open ? 'arrow-up' : 'arrow-down'">
                                                                </b-icon>
                                                            </a>
                                                        </div>
                                                    </template>

                                                    <div class="card-content">
                                                        <div class="content">
                                                            <div class="columns">
                                                                <div class="column is-6">
                                                                    <validation-provider vid="password"
                                                                        rules="required|capitalLetter|oneNumber|min:6|max:30"
                                                                        name="Password" v-slot="validationContext">
                                                                        <b-field label="Password"
                                                                            :type="getValidationState(validationContext)"
                                                                            :message="validationContext.errors[0]">
                                                                            <template slot="label">Password
                                                                                <span
                                                                                    class="has-text-danger">*</span></template>
                                                                            <b-input rounded type="password"
                                                                                v-model="password" password-reveal>
                                                                            </b-input>
                                                                        </b-field>
                                                                    </validation-provider>
                                                                </div>
                                                                <div class="column is-6">
                                                                    <validation-provider vid="confirmation"
                                                                        rules="required|confirmed:password"
                                                                        name="Password Confirmation"
                                                                        v-slot="validationContext">
                                                                        <b-field label="Password Confirmation"
                                                                            :type="getValidationState(validationContext)"
                                                                            :message="validationContext.errors[0]">
                                                                            <template slot="label">Password Confirmation
                                                                                <span
                                                                                    class="has-text-danger">*</span></template>
                                                                            <b-input rounded type="password"
                                                                                v-model="confirmation" password-reveal>
                                                                            </b-input>
                                                                        </b-field>
                                                                    </validation-provider>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </b-collapse>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <b-field v-if="isUpdate" class="is-pulled-right">
                                        <b-button type="is-dark" rounded :loading="isLoading" @click.prevent="submit">
                                            Submit</b-button>
                                    </b-field>
                                </b-tab-item>
                            </b-tabs>
                        </validation-observer>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { extend } from 'vee-validate';

extend('oneNumber', {
    validate(value) {
        var count = 0
        count = value.replace(/\D/g, '').length

        if (count == 0) {
            return 'Password at least one number.'
        } else {
            return true;
        }
    }
});

extend('capitalLetter', {
    validate(value) {
        var count = 0
        for (var i = 0; i < value.length; i++) {
            if (/[A-Z]/.test(value.charAt(i))) count++;
        }

        if (count == 0) {
            return 'Password needs one uppercase letter.'
        } else {
            return true;
        }
    }
});

export default {
    data() {
        return {
            title: "Profile",
            user: {},
            name: "",
            fullName: "",
            email: "",
            birthDate: null,
            password: "",
            confirmation: "",
            dateNow: new Date(),
            activeTab: 0,
            isEmailNotUnique: false,
            isPasswordEqualsPrevious: false,
            isUpdate: false,
            isUpdatePassword: false,
            format: '24',
            showWeekNumber: false,
            enableSeconds: false,
            file: null,
            fileURL: null,
            imageCID: "",
            isLoading: false,
            loadingSnackbar: {}
        }
    },
    watch: {
        file: function (file) {
            if (file != null) {
                this.fileURL = URL.createObjectURL(file)
            }
        },
        isUpdate: function () {
            if (!this.isUpdate) {
                this.name = this.user.name
                this.fullName = this.user.fullName
                this.email = this.user.email
                this.birthDate = this.user.birthDate
                this.password = ""
                this.user.confirmation = ""
                this.file = null

                if (this.user.imageCID != '' && this.user.imageCID != null) {
                    this.fileURL = `https://gateway.pinata.cloud/ipfs/${this.user.imageCID}`
                }
            }
        },
        isUpdatePassword: function () {
            if (this.isUpdatePassword) {
                this.$buefy.dialog.confirm({
                    title: 'Update account password',
                    message: 'Are you sure you want to <b>update</b> your password?',
                    confirmText: 'Update',
                    type: 'is-warning',
                    hasIcon: true,
                    onCancel: () => this.isUpdatePassword = false
                })
            }
        }
    },
    methods: {
        getValidationState({ dirty, validated, valid = null }) {
            return dirty || validated ? (valid ? "" : "is-danger") : "";
        },
        getInformation() {
            axios.get(`http://${process.env.VUE_APP_API_URL}users/${this.$parent.user.idUser}`)  // eslint-disable-line
                .then(response => {
                    this.user = response.data

                    if (this.user.birthDate != null) {
                        this.user.birthDate = new Date(this.user.birthDate)
                    }

                    if (this.user.imageCID != '' && this.user.imageCID != null) {
                        this.fileURL = `https://gateway.pinata.cloud/ipfs/${this.user.imageCID}` 
                    }

                    this.name = this.user.name
                    this.fullName = this.user.fullName
                    this.email = this.user.email
                    this.birthDate = this.user.birthDate
                })
                .catch(error => {
                    console.log(error)
                    if (error.response.status == 404) {
                        this.$router.push("/*")
                    }
                })
        },
        updatePassword() {
            this.isUpdatePassword = !this.isUpdatePassword
        },
        updateUser(imageCID) {
            axios.put(`http://${process.env.VUE_APP_API_URL}users/${this.user.idWallet}`, {  // eslint-disable-line
                "idUser": this.user.idUser,
                "idContract": this.user.idContract,
                "idWallet": this.user.idWallet,
                "idUserType": this.user.idUserType,
                "name": this.name,
                "birthDate": this.birthDate,
                "email": this.email,
                "password": this.password,
                "active": this.user.active,
                "balance": this.user.balance,
                "fullName": this.fullName,
                "imageCID": imageCID
            })
                .then(() => {
                    axios.get(`http://${process.env.VUE_APP_API_URL}users/${this.$parent.user.idUser}`)  // eslint-disable-line
                        .then(response => {
                            this.$store.commit("setUser", response.data)

                            this.$buefy.toast.open({
                                duration: 3000,
                                message: 'User updated successfully!',
                                type: 'is-success'
                            })

                            this.$router.push("/start")
                        })
                        .catch(error => {
                            console.log(error)
                            this.activeTab = 0
                        })
                })
                .catch(error => {
                    if (error.response.status == 406) {
                        this.isPasswordEqualsPrevious = true
                        this.activeTab = 0
                    }

                    if (error.response.status == 409) {
                        this.isEmailNotUnique = true
                        this.activeTab = 0
                    }
                    console.log(error)
                })
                .then(() => {
                    this.loadingSnackbar.close()
                    this.isLoading = false
                })
        },
        submit() {
            this.$refs.observer.validate()
                .then(result => {
                    this.isEmailNotUnique = false
                    this.isPasswordEqualsPrevious = false

                    this.isLoading = true
                    this.loadingSnackbar = this.$buefy.snackbar.open({
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
                        this.loadingSnackbar.close()
                        this.isLoading = false
                        return
                    }

                    if (this.file != null) {
                        var data = new FormData();
                        data.append('file', this.file);
                        data.append('pinataOptions', '{"cidVersion": 1}');
                        data.append('pinataMetadata', '{"name": "' + this.file.name + '"}');

                        var token = `${process.env.VUE_APP_PINATA_API_KEY}`
                        var config = {
                            method: 'post',
                            url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
                            headers: {
                                'Authorization': token
                            },
                            data: data
                        };

                        axios(config) // eslint-disable-line
                            .then(response => {
                                this.imageCID = response.data.IpfsHash
                                this.updateUser(this.imageCID)
                            })
                            .catch(error => {
                                console.log(error)
                            })
                    } else {
                        this.updateUser(this.user.imageCID)
                    }
                })
        }
    },
    created() {
        this.$emit('title', this.title)
        this.$emit('back', "")
        this.getInformation();
    }
}
</script>

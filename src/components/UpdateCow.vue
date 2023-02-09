<template>
	<div>
		<div class="columns">
			<div class="column">
				<div class="card box shadow has-margin-bottom-40">
					<div class="card-content has-padding-bottom-0">
						<template v-if="isLoadingPanel">
							<div class="columns is-centered">
								<div class="column is-12 has-text-centered">
									<b-icon pack="fas" icon="sync-alt" size="is-large" custom-class="fa-spin"></b-icon>
								</div>
							</div>
						</template>
						<template v-else>
							<b-message title="Warning" v-show="isSerialNumberUnique" type="is-warning">
								The serial number is already taken. Please, define another one.
							</b-message>
							<validation-observer ref="observer">
								<b-tabs v-model="activeTab" expanded>
									<b-tab-item label="Informations">
										<div class="columns">
											<div class="column is-12">
												<figure class="image is-128x128 is-horizontal-center is-vcentered">
													<img class="thumbnail image is-rounded"
														:src="this.fileURL == '' || this.fileURL == null ? 'img/no_image.png' : this.fileURL">
												</figure>
												<b-field class="file is-dark" :class="{ 'has-name': !!file }">
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
											<div class="column is-6">
												<validation-provider vid="serialNumber" rules="required|numeric"
													name="SerialNumber" v-slot="validationContext">
													<b-field :type="getValidationState(validationContext)"
														:message="validationContext.errors[0]">
														<template slot="label">Serial Number <span
																class="has-text-danger">*</span></template>
														<b-numberinput v-model="cow.serialNumber" min="1"
															:controls="false">
														</b-numberinput>
													</b-field>
												</validation-provider>
											</div>
											<div class="column is-6">
												<validation-provider vid="birthDate" rules="required" name="Birth Date"
													v-slot="validationContext">
													<b-field expanded :type="getValidationState(validationContext)"
														:message="validationContext.errors[0]">
														<template slot="label">Birth Date <span
																class="has-text-danger">*</span></template>
														<b-datetimepicker rounded v-model="cow.birthDate"
															placeholder="Click to select..." icon="calendar-today"
															:datepicker="{ showWeekNumber }" horizontal-time-picker>
														</b-datetimepicker>
													</b-field>
												</validation-provider>
											</div>
										</div>
										<div class="columns">
											<div class="column is-6">
												<validation-provider vid="height" :rules="{
													required: true,
													min_value: 0,
													max_value: 4,
													height_validation: cow.height
												}" name="Height" v-slot="validationContext">
													<b-field :type="getValidationState(validationContext)"
														:message="validationContext.errors[0]">
														<template slot="label">Height <span
																class="has-text-danger">*</span></template>
														<b-input v-model="cow.height" :placeholder=cow.height></b-input>
													</b-field>
												</validation-provider>
											</div>
											<div class="column is-6">
												<validation-provider vid="weight" :rules="{
													required: true,
													min_value: 0,
													max_value: 2000,
													weight_validation: cow.weight
												}" name="Weight" v-slot="validationContext">
													<b-field :type="getValidationState(validationContext)"
														:message="validationContext.errors[0]">
														<template slot="label">Weight <span
																class="has-text-danger">*</span></template>
														<b-input v-model="cow.weight" :placeholder=cow.weight></b-input>
													</b-field>
												</validation-provider>
											</div>
										</div>
										<div class="columns">
											<div class="column is-6">
												<validation-provider vid="breed" rules="required|alpha_spaces|max:50" name="Breed"
													v-slot="validationContext">
													<b-field :type="getValidationState(validationContext)"
														:message="validationContext.errors[0]">
														<template slot="label">Breed <span
																class="has-text-danger">*</span></template>
														<b-input v-model="cow.breed" maxlength="50"></b-input>
													</b-field>
												</validation-provider>
											</div>
											<div class="column is-6">
												<validation-provider vid="color" rules="required|alpha_spaces|max:50" name="Color"
													v-slot="validationContext">
													<b-field :type="getValidationState(validationContext)"
														:message="validationContext.errors[0]">
														<template slot="label">Color <span
																class="has-text-danger">*</span></template>
														<b-input v-model="cow.color" maxlength="50"></b-input>
													</b-field>
												</validation-provider>
											</div>
										</div>
										<div class="columns">
											<div class="column">
												<validation-provider rules="required" name="Current Field"
													v-slot="validationContext">
													<b-field rounded label="Current Field"
														:type="getValidationState(validationContext)"
														:message="validationContext.errors[0]">
														<b-select v-model="idField" placeholder="Select a cow"
															expanded>
															<option v-for="field in fields" :value="field.idField" :key="field.id">
																{{ field.fieldDescription + ' - ' + field.address }}
															</option>
														</b-select>
													</b-field>
												</validation-provider>
											</div>
										</div>
										<div class="columns">
											<div class="column">
												<b-field label="Observation">
													<b-input v-model="cow.observation" maxlength="250" type="textarea">
													</b-input>
												</b-field>
											</div>
										</div>
										<div class="columns">
											<div class="column">
												<validation-provider vid="gender" rules="required" name="Gender"
													v-slot="validationContext">
													<b-field label="Gender"
														:type="getValidationState(validationContext)"
														:message="validationContext.errors[0]">
														<b-switch v-model="cow.gender" type="is-dark">
															{{ cow.gender ? 'Cow gender set as Masculine' : "Cow gender set as Feminine"}}
														</b-switch>
													</b-field>
												</validation-provider>
											</div>
											<div class="column">
												<validation-provider vid="active" rules="required" name="Active"
													v-slot="validationContext">
													<b-field label="Active"
														:type="getValidationState(validationContext)"
														:message="validationContext.errors[0]">
														<b-switch v-model="cow.active" type="is-dark">
															{{ cow.active ? 'Cow can be sold' : "Cow can't be sold" }}
														</b-switch>
													</b-field>
												</validation-provider>
											</div>
										</div>
										<hr />
										<b-field class="is-pulled-right">
											<b-button rounded @click="nextTab()" icon-right="arrow-right">Next
											</b-button>
										</b-field>
									</b-tab-item>
									<b-tab-item label="Genealogy">
										<div class="columns has-margin-bottom-20">
											<div class="column is-6">
												<b-tag type="is-info">NOTE</b-tag> Define cow genealogy <b>to improve
													history information</b>.
											</div>
											<div v-if="cowsMale.length == 0 || cowsFeminine.length == 0"
												class="column is-6 has-text-right">
												<b-tag type="is-warning">INFO</b-tag> No M/F cows <b> registered</b>.
											</div>
										</div>
										<div class="card box">
											<div class="card-content">
												<div class="columns">
													<div class="column is-6">
														<b-icon pack="fas" icon="mars"></b-icon>
														<span class="has-text-weight-bold">Parent 1: </span> <span
															class="has-text-danger">*</span>
														<validation-provider vid="parent1" rules="required"
															name="Parent1" v-slot="validationContext">
															<b-field :type="getValidationState(validationContext)"
																:message="validationContext.errors[0]">
																<b-select v-model="cow.idBovineParent1"
																	placeholder="Select a cow" expanded
																	:disabled="cowsMale.length != 0 ? false : true">
																	<option v-for="cow in cowsMale"
																		:value="cow.idBovine" :key="cow.idBovine">
																		{{ cow.serialNumber }}
																	</option>
																</b-select>
															</b-field>
														</validation-provider>
													</div>
													<div class="column is-6">
														<b-icon pack="fas" icon="venus"></b-icon>
														<span class="has-text-weight-bold">Parent 2: </span><span
															class="has-text-danger">*</span>
														<validation-provider rules="required" name="Parent 2"
															v-slot="validationContext">
															<b-field :type="getValidationState(validationContext)"
																:message="validationContext.errors[0]">
																<b-select v-model="cow.idBovineParent2"
																	placeholder="Select a cow" expanded
																	:disabled="cowsFeminine.length != 0 ? false : true">
																	<option v-for="cow in cowsFeminine"
																		:value="cow.idBovine" :key="cow.idBovine">
																		{{ cow.serialNumber }}
																	</option>
																</b-select>
															</b-field>
														</validation-provider>
													</div>
												</div>
											</div>
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

extend('height_validation', {
	validate(value) {
		if (typeof value === 'undefined' || value === null || value === '' || value == 0) {
			return `Define a valid heigth value ${value} .`
		} else if (/^[0-9]*\.?[0-9]{0,2}$/.test(value) == false) {
			return `${value} is not a valid heigth. Height needs 2 decimal values.`
		} else {
			return true;
		}
	}
});

extend('weight_validation', {
	validate(value) {
		if (typeof value === 'undefined' || value === null || value === '' || value == 0) {
			return `Define a valid weigth value ${value} .`
		} else if (/^[0-9]*\.?[0-9]{0,2}$/.test(value) == false) {
			return `${value} is not a valid weigth. Weight needs 2 decimal values.`
		} else {
			return true;
		}
	}
});

export default {
	data() {
		return {
			title: "Update Cow",
			isLoading: false,
			isLoadingPanel: true,
			isSerialNumberUnique: false,
			loadingSnackbar: {},
			activeTab: 0,
			cow: {},
			idField: 0,
			file: null,
			fileURL: null,
			imageCID: "",
			cows: [],
			cowsMale: [],
			cowsFeminine: [],
			fields: [],
			format: '24',
			showWeekNumber: false,
			enableSeconds: false
		}
	},
	watch: {
		file: function (o) {
			this.fileURL = URL.createObjectURL(o)
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
		getInformation() {
			axios.get(`http://${process.env.VUE_APP_API_URL}bovines/${this.$route.params.bovineId}`) // eslint-disable-line
				.then(response => {
					this.cow = response.data
					this.cow.birthDate = new Date(this.cow.birthDate)
					this.idField = this.cow.field.idField

					if (this.cow.imageCID != '') {
						this.fileURL = 'https://gateway.pinata.cloud/ipfs/' + this.cow.imageCID
					}

					axios.get(`http://${process.env.VUE_APP_API_URL}bovines/${this.$parent.user.idWallet}/own`) // eslint-disable-line
						.then(response => {
							this.cows = response.data
							this.cows.forEach(cow => {
								if (cow.idBovine != this.$route.params.bovineId) {
									if (cow.gender == 0) {
										this.cowsFeminine.push(cow)
									} else {
										this.cowsMale.push(cow)
									}
								}
							})

							axios.get(`http://${process.env.VUE_APP_API_URL}fields/${this.$parent.user.idWallet}/not_occupied`) // eslint-disable-line
								.then(response => {
									this.fields = response.data
									this.isLoadingPanel = false
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
		updateRequest(imageCID) {
			axios.put(`http://${process.env.VUE_APP_API_URL}bovines/${this.$route.params.bovineId}`, { // eslint-disable-line
				"idOwner": this.$parent.user.idWallet,
				"idContract": this.cow.idContract,
				"idBovine": this.cow.idBovine,
				"idField": this.idField,
				"serialNumber": this.cow.serialNumber,
				"birthDate": this.cow.birthDate,
				"weight": this.cow.weight,
				"height": this.cow.height,
				"breed": this.cow.breed,
				"color": this.cow.color,
				"active": this.cow.active,
				"observation": this.cow.observation,
				"idBovineParent1": this.cow.idBovineParent1,
				"idBovineParent2": this.cow.idBovineParent2,
				"gender": this.cow.gender,
				"imageCID": imageCID
			})
				.then(() => {
					this.$buefy.toast.open({
						duration: 3000,
						message: 'Cow updated successfully!',
						type: 'is-success'
					})
					this.$router.push("/cows")
				})
				.catch(error => {
					if (error.response.status == 409) {
						this.isSerialNumberUnique = true
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

						var config = {
							method: 'post',
							url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
							headers: {
								'Authorization': `${process.env.VUE_APP_PINATA_API_KEY}`
							},
							data: data
						};

						axios(config)  // eslint-disable-line
							.then(response => {
								this.imageCID = response.data.IpfsHash
								this.updateRequest(this.imageCID)
							})
							.catch(error => {
								console.log(error)
							})
					} else {
						this.updateRequest(this.cow.imageCID)
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

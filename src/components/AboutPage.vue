<template>
    <div class="section pt-1">
        <div class="container">
            <div class="columns is-centered is-full-height is-vcentered">
                <div class="column is-half has-text-centered pt-0">
                    <img class="image is-256x256 is-horizontal-center" :src="require('../assets/img/icon.png')"/>
                    <h1 id="home_title">COW</h1>
                    <h4 id="home_subtitle">About</h4>
                    <div class="columns mt-1">
                        <p class="has-text-centered">The COW project is based on involving blockchain technology as a way to improve the efficiency and transparency of supply chain management in agriculture, through Hedera technology.  The platform developed under the project allows extending the management capacity by identifying each of those involved in the chain, presenting real and abdicable information in real time, improving traceability..</p>
                    </div>
                    <div class="mt-3">
                        <h4 id="home_subtitle">Contribuitions</h4>
                        <div class="columns mt-1 has-text-centered">
                            <div class="column is-12">
                                <p>Want to be part of this project? Check out our <a href="https://github.com/bernardo-figueiredo/cow-api" target="_blank">repository at GitHub.</a></p>
                            </div>
                        </div>
                        <div class="columns">
                            <div class="column">
                                <p>Current Contributors:</p>
                            </div>
                        </div>
                        <div class="columns is-centered">
                            <div class="column is-3 has-text-centered">
                                <figure class="image is-64x64 is-horizontal-center">
                                    <img class="image is-rounded" :src="require('../assets/img/credits_bernardo.jpg')" >
                                </figure>
                                <a href="https://github.com/bernardo-rf/" target="_blank">Benardo Figueiredo</a>
                            </div>
                        </div>
                    </div>
                    <div class="mt-3">
                        <div class="columns">
                            <div class="column">
                                <p>Current Supervisors:</p>
                            </div>
                        </div>
                        <div class="columns is-centered">
                            <div class="column is-3 has-text-centered">
                                <figure class="image is-64x64 is-horizontal-center">
                                    <img class="image is-rounded" :src="require('../assets/img/credits_catarina.jpg')" >
                                </figure>
                                <a href="https://github.com/catarinareis" target="_blank">Catarina Reis</a>
                            </div>
                        </div>
                    </div>
                    <div class="mt-3">
                        <h4 id="home_subtitle">In Association With</h4>
                        <div class="columns">
                            <img class="image is-horizontal-center" width="50%" :src="require('../assets/img/credits_ipleiria.png')" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {

}
</script>
<template>
    <div>
        <div class="section mt-1">
            <div class="container main">
                <div class="columns is-centered is-full-height is-vcentered">
                    <div class="column is-half has-text-centered pt-0">
                        <img class="image is-256x256 is-horizontal-center" :src="require('../assets/img/icon.png')"/>
                        <h1 id="home_title">COW</h1>
                        <h4 id="home_subtitle">Agro-Precision Solution</h4>
                        <div class="columns mt-3">
                            <div class="column">
                                <b-button tag="router-link" to="/login" type="is-volby" size="is-large" rounded expanded outlined>Login</b-button>
                            </div>
                            <div class="column">
                                <b-button tag="router-link" to="/register" type="is-volby" size="is-large" rounded expanded outlined>Register</b-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer class="footer volby-footer mt-1">
            <div class="columns is-vcentered has-text-centered">
                <div class="column is-3">
                    <img class="image is-horizontal-center" width="50%" :src="require('../assets/img/credits_ipleiria.png')" />
                </div>
                <div class="column is-6">
                    <p>Copyright © 2022 Bernardo Figueiredo @ PLeiria.</p>
                    <p>All Rights Reserved</p>
                </div>
                <div class="column is-3">
                    <b-button type="is-text" tag="router-link" to="/about" target='_blank'>About COW</b-button>
                </div>
            </div>
        </footer>
    </div>
</template>
<script>
export default {

}
</script>
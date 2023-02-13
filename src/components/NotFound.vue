<template>
    <div>
        <div class="columns is-centered mt-6">
            <div class="column is-half has-text-centered">
                <img class="image is-128x128 is-horizontal-center" :src="require('../assets/img/icon.png')"/>
                <h1 class="title is-1 has-text-volby">404</h1>
                <h3 class="title is-3">Oops! Page Not Found.</h3>
                <b-button class="mt-6" tag="router-link" to="/" type="is-volby" size="is-large" rounded expanded outlined>Go back to COW</b-button>
            </div>
        </div>
    </div>
</template>
<template>
    <a-form
        id="components-form-demo-normal-login"
        :form="form"
        class="login-form"
        @submit="handleSubmit">
        <a-form-item v-if="!login">
            <a-input placeholder="Username" v-model="form.username">
                <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)"/>
            </a-input>
        </a-form-item>
        <a-form-item v-if="!login">
            <a-input placeholder="Name" v-model="form.name">
                <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)"/>
            </a-input>
        </a-form-item>
        <a-form-item>
            <a-input placeholder="Email" v-model="form.email">
                <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)"/>
            </a-input>
        </a-form-item>
        <a-form-item>
            <a-input type="password" placeholder="Password" v-model="form.password">
                <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)"/>
            </a-input>
        </a-form-item>
        <a-form-item>
            <a-checkbox>Remember me</a-checkbox>
            <div><a class="login-form-forgot" href="">Forgot password</a></div>
            <a-button type="primary" @click="handleSubmit">{{login?'Login':'Register'}}</a-button>
            <div>Or <span class="clickable" @click="login = !login">{{login?'Register':' Login'}}</span></div>
        </a-form-item>
    </a-form>
</template>

<script>
    export default {
        beforeCreate() {
            this.form = this.$form.createForm(this);
        },
        data: () => {
            return {
                form: {
                    username: null,
                    email: null,
                    name: null,
                    password: null
                },
                login: true,
                validForm: {}
            }
        },
        methods: {
            async handleSubmit() {
                if (this.login) {
                    let res = await this.$auth.loginWith('local', {
                        data: this.form
                    })
                    console.log(res);
                } else {
                    await this.$axios.$post('/users/', this.form)
                }
            }
        },
    };
</script>
<style>

</style>

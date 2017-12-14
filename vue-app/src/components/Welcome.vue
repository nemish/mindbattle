<template>
  <div class="welcome">
    <div class='slogan'>
        <h1>BRAINBATTLE</h1>
    </div>
    <div v-if='message'>{{ message }}</div>
    <div class='login-input'>
        <input class='full-row-input'
               type='text'
               placeholder='Please enter your name'
               @keyup.enter='handleUserSubmit'
               @keyup='onChangeName'
               v-model='name' />
        <input class='full-row-input'
               type='password'
               placeholder='Please enter a password'
               v-if='checkPassed'
               @keyup.enter='handleUserSubmit'
               v-model='passwd' />
    </div>
    <div>
        <button class='login-button' v-bind:disabled='submitNotAllowed' @click='handleUserSubmit'>Enter</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'Welcome',
    data() {
        return { name: '', passwd: '', isDirty: false };
    },
    computed: {
        user() {
            return this.$store.state.user
        },
        ...mapGetters([
            'check'
        ]),
        checkPassed() {
            return !!this.check.status && !this.isDirty;
        },
        submitNotAllowed() {
            const { user } = this;
            if (user.loading || this.check.loading) {
                return true;
            }
            if (this.check.status && !this.isDirty) {
                return !this.name.length || !this.passwd.length;
            }
            return !this.name.length;
        },
        message() {
            if (this.isDirty || !this.name.length) {
                return
            }

            if (this.check.status === 'occupied') {
                return `Great to see you again ${this.name}`;
            } else if (this.check.status == 'ok') {
                return `Nice to meet you ${this.name}`;
            }
        }
    },
    methods: {
        onChangeName(e) {
            this.isDirty = true;
        },
        handleUserSubmit() {
            const { name, passwd } = this;
            this.isDirty = false;
            if (name && name.length && passwd && passwd.length) {
                let actionName = 'registerUser';
                if (this.user.check.status === 'occupied') {
                    actionName = 'login';
                }
                this.$store.dispatch(actionName, { name, passwd, router: this.$router });
            } else if (name && name.length) {
                this.$store.dispatch('checkUserName', name);
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.welcome {
    width: 500px;
    font-weight: normal;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.login-input {
    width: 100%;
    margin: 20px 0;
}

.login-button {
    border: none;
    background-color: #00cc66;
    padding: 10px 30px;
    color: #fff;
    font-size: 24px;
}

.login-button:hover {
    cursor: pointer;
    background-color: #00cc00;
}

.login-button:disabled,.login-button[disabled] {
    background-color: #ccc;
}

.full-row-input {
    text-align: center;
    width: 100%;
    color: #fff;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 30px;
}

</style>

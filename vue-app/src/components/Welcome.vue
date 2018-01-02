<template>
  <div class="container">
    <div class='slogan'>
        <h1>BRAINBATTLE</h1>
    </div>
    <div v-if='message' :class='msgClass'>{{ message }}</div>
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
    <full-row-button :disabled='submitNotAllowed'
                     @click='handleUserSubmit'
                     text='Enter'
                     colorType='green' />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FullRowButton from './FullRowButton';
export default {
    name: 'Welcome',
    data() {
        return { name: '', passwd: '', isDirty: false, msgClass: 'msg' };
    },
    components: {
        'full-row-button': FullRowButton
    },
    computed: {
        user() {
            return this.$store.state.user
        },
        ...mapGetters([
            'check'
        ]),
        checkPassed() {
            const checkPassed = !!this.check.status && !this.isDirty;
            if (!checkPassed) {
                this.passwd = '';
            }
            return checkPassed;
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
            if (this.isDirty) {
                return
            }
            this.isDirty = false;

            let msg = null;

            if (this.check.status === 'occupied') {
                this.msgClass = 'msg msg-warning';
                msg = `Great to see you again ${this.name}`;
            } else if (this.check.status == 'ok') {
                this.msgClass = 'msg msg-success';
                msg = `Nice to meet you ${this.name}`;
            }

            if (this.user.status === 'LOGIN_FAILED') {
                this.msgClass = 'msg-error';
                msg = 'Login error. Try later or type another data.'
            }

            return msg;
        }
    },
    methods: {
        onChangeName(e) {
            if (e.keyCode !== 13) {
                this.isDirty = true;
            }
        },
        handleUserSubmit() {
            const { name, passwd } = this;
            if (!this.isDirty && name && name.length && passwd && passwd.length) {
                let actionName = 'registerUser';
                if (this.user.check.status === 'occupied') {
                    actionName = 'login';
                }
                this.$store.dispatch(actionName, { name, passwd, router: this.$router });
            } else if (name && name.length) {
                this.$store.dispatch('checkUserName', name);
            }
            this.isDirty = false;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


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

.msg {
    font-size: 16px;
    font-weight: bold;
}

.msg-error {
    color: tomato;
    border-top: 3px solid rgba(50, 100, 255, 0.3);
}

.msg-success {
    color: lightgreen;
    border-top: 3px solid rgba(255, 165, 0, 0.3);
}

.msg-warning {
    color: #FFA500;
    border-top: 3px solid rgba(0, 0, 255, 0.3);
}

.full-row-input {
    padding: 0;
    text-align: center;
    width: 100%;
    color: #fff;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 30px;
}

</style>

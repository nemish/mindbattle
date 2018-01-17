<template>
  <div class="container welcome">
    <div class='full-width'>
        <h1>BRAINBATTLE</h1>
    </div>
    <div v-if='message' :class='msgClass'>{{ message }}</div>
    <div v-if='loaded' class='login-input full-width'>
        <input class='full-row-input'
               type='text'
               placeholder='Please enter your name'
               @keyup.enter='handleUserSubmit'
               v-model='name' />
        <input class='full-row-input'
               type='password'
               placeholder='Please enter a password'
               v-if='showPasswordField'
               ref='passwd'
               v-focus
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
// import reduxStore from '../redux-store';
import FullRowButton from './FullRowButton';
export default {
    name: 'Welcome',
    data() {
        return { name: '', passwd: '', isDirty: false, msgClass: 'msg' };
    },
    components: {
        'full-row-button': FullRowButton
    },
    directives: {
       focus: {
            inserted: function (el) {
                el.focus();
            }
        }
    },
    computed: {
        loaded() {
            return !this.loading;
        },
        user() {
            return this.$store.state.user
        },
        ...mapGetters([
            'check',
            'loading'
        ]),
        showPasswordField() {
            return !!this.check.status && !this.isDirty && this.name.length;
        },
        isLoading() {
            return this.user.loading || this.check.loading;
        },
        submitNotAllowed() {
            const { user } = this;
            if (this.isLoading) {
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
            this.isDirty = false;

            let msg = null;

            if (this.isLoading) {
                this.msgClass = 'msg msg-warning';
                msg = 'Loading ...';
            } else if (this.check.status === 'occupied') {
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
    watch: {
        name: dispatchOnChange('name', function (data) {
            this.isDirty = true;
        }),
        passwd: dispatchOnChange('passwd', null),
    },
    methods: {
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
                // this.$refs.passwd.$el.focus();
                // console.log(this.$refs.passwd, this);
            }
            this.isDirty = false;
        },
        _$refreshState() {
            this.name = this.$reduxStore.getState().user.name;
            this.passwd = this.$reduxStore.getState().user.passwd;
        }
    }
};


function dispatchOnChange(key, onChangeCb, context) {
    return function(data) {
        const val = this.$reduxStore.getState().user[key];
        if (val !== data) {
            this.$reduxStore.dispatch({
                type: 'USER_LOGIN_FORM__CHANGE_VALUE',
                data: {
                    name: key,
                    value: data
                }
            });
            if (onChangeCb) {
                onChangeCb.apply(this, [data]);
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


.login-input {
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

.container.welcome > div {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

</style>

<template>
  <div :class="['container', 'welcome']">
    <div :class="['full-width']">
        <transition
            enter-active-class='animated flipInX'
            leave-active-class='animated flipOutX'>
            <h1 v-if='isReady'>BRAINBATTLE</h1>
        </transition>
        <transition
            enter-active-class='animated zoomIn'
            leave-active-class='animated zoomOut'>
            <h2 v-if='isReady' class='font-poiret'>Проверь свой ум</h2>
        </transition>
    </div>
    <div :class="['login-input', 'full-width']">
        <transition
            enter-active-class='animated bounceIn'>
            <h1 v-if='message' :class='msgClass'>{{ message }}</h1>
        </transition>
        <transition
            leave-active-class='animated flipOutX'
            enter-active-class='animated flipInX'>
            <input :class="['full-row-input', 'font-poiret']"
                   v-if='isReady'
                   id='name-input'
                   type='text'
                   placeholder='Твой логин'
                   @keyup.enter='handleUserSubmit'
                   v-model='name' />
        </transition>
        <transition
            leave-active-class='animated flipOutX'
            enter-active-class='animated flipInX'>
            <input :class="['full-row-input', 'font-poiret']"
                   id='passwd-input'
                   type='password'
                   placeholder='Твой пароль'
                   v-if='isReady && showPasswordField'
                   ref='passwd'
                   v-focus
                   @keyup.enter='handleUserSubmit'
                   v-model='passwd' />
        </transition>
    </div>
        <transition
            enter-active-class='animated flipInX'
            leave-active-class='animated flipOutX'>
            <full-row-button v-if='isReady'
                             :disabled='submitNotAllowed'
                             @click='handleUserSubmit'
                             className='border-round-lg'
                             text='Вход'
                             colorType='green' />
        </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import FullRowButton from './FullRowButton';
export default {
    name: 'Welcome',
    data() {
        return {
            name: '',
            passwd: '',
            isDirty: false,
            msgClass: 'msg',
            isReady: false
        };
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
    mounted() {
        setTimeout(() => {
            this.isReady = true;
        }, 500);
    },
    computed: {
        loaded() {
            return !this.loading;
        },
        user() {
            return this.$store.state.user
        },
        ...mapGetters('user', [
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
                msg = 'Загрузка...';
            } else if (this.check.status === 'occupied') {
                this.msgClass = 'msg msg-warning';
                msg = `С возвращением, ${this.name}`;
            } else if (this.check.status == 'ok') {
                this.msgClass = 'msg msg-success';
                msg = `Рады видеть, ${this.name}`;
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
        ...mapActions('user', [
            'checkUserName',
            'login',
            'registerUser'
        ]),
        handleUserSubmit() {
            const { name, passwd } = this;
            if (!this.isDirty && name && name.length && passwd && passwd.length) {
                let actionName = 'registerUser';
                if (this.user.check.status === 'occupied') {
                    actionName = 'login';
                }
                this[actionName]({ name, passwd, router: this.$router });
            } else if (name && name.length) {
                this.checkUserName(name);
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

.welcome h1,
.welcome h2 {
    display: block;
    transition: font-size 1s;
}


.welcome h1.hidden,
.welcome h2.hidden {
    font-size: 0em;
}

.welcome h1 {
    transition-delay: 1s;
}

.welcome h2 {
    transition-delay: 1.5s;
}


.login-input {
    margin: 20px 0;
}

.login-button {
    border: none;
    background-color: #00cc66;
    padding: 10px 30px;
    color: #fff;
    font-size: 6em;
}

.login-button:hover {
    cursor: pointer;
    background-color: #00cc00;
}

.login-button:disabled,.login-button[disabled] {
    background-color: #ccc;
}

.msg {
    font-size: 2em;
    font-weight: bold;
}

.msg-error {
    color: tomato;
    border-top: 3px solid rgba(50, 100, 255, 0.3);
    border-bottom: 3px solid rgba(50, 100, 255, 0.3);
}

.msg-success {
    color: lightgreen;
    border-top: 3px solid rgba(255, 165, 0, 0.3);
    border-bottom: 3px solid rgba(50, 100, 255, 0.3);
}

.msg-warning {
    color: #FFA500;
    border-top: 3px solid rgba(0, 0, 255, 0.3);
    border-bottom: 3px solid rgba(50, 100, 255, 0.3);
}


.full-row-input {
    padding: 0;
    text-align: center;
    width: 100%;
    color: #fff;
    font-size: 2.5em;
    background-color: rgba(0,0,0,0);
    border: none;
    opacity: 1;
}

.welcome h1, .welcome h2 {
    text-align: center;
}

</style>

<template>
  <div :class="['container', 'suggest-question']">
    <transition
        enter-active-class='animated flipInX'
        leave-active-class='animated flipOutX'>
        <div class='full-width text-center' v-if='isReady'>
            <h2>СПАСИБО ЧТО ПОМОГАЕТЕ!</h2>
            <p>Хороших вопросов всегда не хватает. Вместе мы станем лучше!</p>
            <div class='animated pulse infinite heart'></div>
        </div>
    </transition>
    <div :class="['login-input']">
        <transition
            enter-active-class='animated bounceIn'>
            <h3 v-if='message' :class='msgClass'>{{ message }}</h3>
        </transition>
        <transition
            leave-active-class='animated flipOutX'
            enter-active-class='animated flipInX'>
            <textarea :class="['full-row-input', 'font-poiret']"
                   v-if='isReady'
                   id='name-input'
                   type='text'
                   placeholder='Текст вопроса'
                   @keyup.enter='createQuestion'
                   v-model='text' />
        </transition>
        <div class='full-width-item-container'>
            <div>
                <transition
                    leave-active-class='animated flipOutX'
                    enter-active-class='animated flipInX'>
                    <input :class="['full-row-input', 'font-poiret', 'sm']"
                           id='option-1'
                           type='text'
                           placeholder='Вариант 1'
                           v-if='isReady'
                           @keyup.enter='createQuestion'
                           :input='onChangeOption'
                           v-model='option_1' />
                </transition>
            </div>
            <div>
                <transition
                    leave-active-class='animated flipOutX'
                    enter-active-class='animated flipInX'>
                    <input :class="['full-row-input', 'font-poiret', 'sm']"
                           id='option-2'
                           type='text'
                           placeholder='Вариант 2'
                           v-if='isReady'
                           @keyup.enter='createQuestion'
                           :input='onChangeOption'
                           v-model='option_2' />
                </transition>
            </div>
        </div>
        <div class='full-width-item-container'>
            <div>
                <transition
                    leave-active-class='animated flipOutX'
                    enter-active-class='animated flipInX'>
                    <input :class="['full-row-input', 'font-poiret', 'sm']"
                           id='option-3'
                           type='text'
                           placeholder='Вариант 3'
                           v-if='isReady'
                           @keyup.enter='createQuestion'
                           :input='onChangeOption'
                           v-model='option_3' />
                </transition>
            </div>
            <div>
                <transition
                    leave-active-class='animated flipOutX'
                    enter-active-class='animated flipInX'>
                    <input :class="['full-row-input', 'font-poiret', 'sm']"
                           id='option-4'
                           type='text'
                           placeholder='Вариант 4'
                           v-if='isReady'
                           @keyup.enter='createQuestion'
                           :input='onChangeOption'
                           v-model='option_4' />
                </transition>
            </div>
        </div>
    </div>
    <transition
        enter-active-class='animated flipInX'
        leave-active-class='animated flipOutX'>
        <div class='full-width-item-container buttons' v-if='isReady'>
            <div>
                <full-row-button :disabled='submitNotAllowed'
                                 @click='createQuestion'
                                 className='border-round-lg'
                                 text='ПРЕДЛОЖИТЬ'
                                 colorType='green' />
            </div>
            <div>
                <full-row-button @click='back'
                                 className='border-round-lg'
                                 text='ОТМЕНА'
                                 colorType='grey' />
            </div>
        </div>
    </transition>
  </div>
</template>

<script>
import FullRowButton from './FullRowButton';
export default {
    name: 'Welcome',
    data() {
        return {
            text: '',
            option_1: '',
            option_2: '',
            option_3: '',
            option_4: '',
            isReady: false
        };
    },
    components: {
        'full-row-button': FullRowButton
    },
    mounted() {
        setTimeout(() => {
            this.isReady = true;
        }, 500);
    },
    computed: {
        isLoading() {
            return false;
        },
        submitNotAllowed() {
            return !(this.text.length && this.option_1.length && this.option_2.length && this.option_3.length && this.option_4.length);
        },
        message() {
            return null;
            // if (this.isDirty || !this.name.length) {
            //     return
            // }
            // this.isDirty = false;

            // let msg = null;

            // if (this.isLoading) {
            //     this.msgClass = 'msg msg-warning';
            //     msg = 'Загрузка...';
            // } else if (this.check.status === 'occupied') {
            //     this.msgClass = 'msg msg-warning';
            //     msg = `С возвращением, ${this.name}`;
            // } else if (this.check.status == 'ok') {
            //     this.msgClass = 'msg msg-success';
            //     msg = `Рады видеть, ${this.name}`;
            // }

            // if (this.user.status === 'LOGIN_FAILED') {
            //     this.msgClass = 'msg-error';
            //     msg = 'Login error. Try later or type another data.'
            // }

            // return msg;
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        createQuestion() {

        },
        onChangeOption(args) {
            console.log(args);
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

.heart {
    align-self: center;
    justify-self: center;
    width: 80px;
    height: 120px;
    margin: 0 auto;
    background-image: url('../assets/img/heart.svg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
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

.full-row-input.sm {
    font-size: 1.5em;
}

.container.welcome > div {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.buttons > div {
    margin: 0 5px;
}

</style>
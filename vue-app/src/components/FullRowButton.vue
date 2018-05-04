<template>
    <div class='full-width' :disabled='disabled'>
        <button :class='btnClass' @click='onClick' :disabled='disabled'>
            <h1 class="text-center">{{text}}</h1>
            <div v-if='needSpinner' class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            <slot name='additional-info'>
                <div v-if='hasAdditionalInfo' class="text-center additional-info font-poiret">
                    <div v-for='(item, index) in preparedAdditionalInfo' :key='item' class="text-center">
                        {{item}}
                    </div>
                </div>
            </slot>
        </button>
    </div>
</template>

<script>
const classesMap = {
    red: 'bg-tomato-opacity',
    green: 'bg-darken-green-opacity',
    yellow: 'bg-yellow-opacity',
    blue: 'bg-yellow-2-opacity',
    grey: 'bg-grey-opacity',
    white: 'bg-white',
    yellowTrue: 'bg-yellow-true-opacity',
    darkGreen: 'bg-dark-green'
};
export default {
    name: 'FullRowButton',
    props: {
        text: {
            type: String,
            required: true
        },
        additionalInfo: {
            type: String
        },
        additionalInfoList: {
            type: Array
        },
        colorType: {
            type: String
        },
        className: {
            type: String
        },
        disabled: {
            type: Boolean
        },
        needSpinner: {
            type: Boolean
        }
    },
    computed: {
        btnClass() {
            let name = `${classesMap[this.colorType]} full-row-button padding-sides-sm`;
            if (this.className) {
                name += ' ' + this.className;
            }
            return name;
        },
        hasAdditionalInfo() {
            return (this.additionalInfo && this.additionalInfo.length) || (this.additionalInfoList && this.additionalInfoList.length)
        },
        preparedAdditionalInfo() {
            if (this.additionalInfoList && this.additionalInfoList.length) {
                return this.additionalInfoList;
            }
            return [this.additionalInfo];
        }
    },
    methods: {
        onClick() {
            this.$emit('click');
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='stylus' scoped>

$font-size = 40px

button {
    display: block;
}


.full-width-item-container .full-row-button {
    flex: 1;
}


.full-row-button {
    box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.75);
    opacity: 0.7;
    cursor: pointer;
    padding-top: 10px;
    padding-bottom: 10px;
    margin: 5px 0;
    transition: opacity 0.5s;
}

.full-row-button h1 {
    font-size: $font-size;
}

.full-row-button:hover {
    opacity: 0.9;
}

.full-row-button:disabled,.full-row-button[disabled] {
    opacity: 0.7;
    cursor: arrow;
    background-color: rgba(255, 255, 255, 0.4);
    color: 999;
}


.additional-info {
    font-size: 14px;
    color: #ccc;
    flex-direction: column;
}

.additional-info > div {
    margin: 5px 0;
    align-items: center;
    justify-content: center;
}

.bg-white .additional-info {
    color: #444;
}

.btn-small h1 {
    font-size: 24px;
}

</style>

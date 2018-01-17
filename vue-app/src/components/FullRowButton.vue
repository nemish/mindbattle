<template>
    <div class='full-width'>
        <button :class='btnClass' @click='onClick'>
            <h1 class="text-center">{{text}}</h1>
            <h4 v-if='hasAdditionalInfo' class="text-center additional-info">{{additionalInfo}}</h4>
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
        colorType: {
            type: String
        }
    },
    computed: {
        btnClass() {
            return `${classesMap[this.colorType]} full-row-button`;
        },
        hasAdditionalInfo: function() {
            return this.additionalInfo && this.additionalInfo.length
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
<style scoped>

button {
    display: block;
}

.full-row-button {
    opacity: 0.7;
    cursor: pointer;
    width: 100%;
    padding: 10px 0;
    margin: 5px 0;
}

.full-row-button:hover {
    opacity: 0.9;
}

.full-row-button:disabled,.full-row-button[disabled] {
    opacity: 0.5;
    cursor: arrow;
}

.additional-info {
    color: #999;
}

.bg-white .additional-info {
    color: #444;
}

</style>

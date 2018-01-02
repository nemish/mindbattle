<template>
    <button :class='btnClass' @click='onClick'>
        <h1 class="text-center">{{text}}</h1>
        <h4 v-if='hasAdditionalInfo' class="text-center additional-info">{{additionalInfo}}</h4>
    </button>
</template>

<script>
const classesMap = {
    red: 'bg-tomato-opacity',
    green: 'bg-darken-green-opacity',
    yellow: 'bg-yellow-opacity',
    blue: 'bg-yellow-2-opacity',
    grey: 'bg-grey-opacity',
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

.bg-darken-green-opacity {
    background-color: rgba(114, 160, 80, 0.5);
}

.bg-yellow-opacity {
    background-color: rgba(0, 120, 160, 0.5);
}

.bg-yellow-2-opacity {
    background-color: rgba(255, 100, 100, 0.5);
}

.bg-tomato-opacity {
    background-color: rgba(255, 100, 0, 0.5);
}

.bg-grey-opacity {
    background-color: rgba(100, 100, 100, 0.4);
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

</style>

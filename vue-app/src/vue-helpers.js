let VueHelpers = {};

VueHelpers.install = (Vue) => {
    Vue.mixin({
        mounted() {
            setTimeout(() => {
                this.isReady = true;
            }, 500);
        }
    });
};

export default VueHelpers;
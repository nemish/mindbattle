let Vudux = {};

Vudux.install = (Vue, { reduxStore }) => {
    Vue.prototype.$reduxStore = reduxStore;

    Vue.mixin({
        mounted() {
            if (this._$refreshState) {
                this.unsubscribe = reduxStore.subscribe(this._$refreshState.bind(this));
            }
        },
        destroyed() {
            if (this.unsubscribe) {
                this.unsubscribe();
            }
        }
    });
};

export default Vudux;
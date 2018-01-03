let Vudux = {};

Vudux.install = (Vue, { store }) => {
    Vue.prototype.$reduxStore = store;

    Vue.mixin({
        mounted() {
            if (this.isRedux) {
                this.unsubscribe = store.subscribe(this._refreshState.bind(this));
            }
        },
        destroyed() {
            if (this.isRedux) {
                this.unsubscribe();
            }
        }
    });
};

export default Vudux;
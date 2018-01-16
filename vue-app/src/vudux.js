let Vudux = {};

Vudux.install = (Vue, { reduxStore, actions }) => {
    Vue.prototype.$reduxStore = reduxStore;
    reduxStore._$actions = actions;
    reduxStore._$callAction = (action, data) => {
        const { dispatch } = reduxStore;
        return reduxStore._$actions[action](data)(dispatch);
    }

    Vue.mixin({
        created() {
            if (this._$refreshState) {
                this._$refreshState();
            }
        },
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
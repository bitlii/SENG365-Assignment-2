import {reactive} from 'vue';


export const state = reactive({
    userId: -1,
    token: "",

    resetState: function() {
        this.userId = -1;
        this.token = "";
    },

    hasToken: function() {
        return this.token !== "";
    }

});
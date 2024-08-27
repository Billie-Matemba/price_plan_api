document.addEventListener('alpine:init', () => {
    Alpine.data('pricePlan', () => ({
        plans: [],
        plan: '',
        actions: '',
        newPlan: '',
        smsCost: '',
        callCost: '',
        idNum: '',
        total: '',
        message: '',
        existingPlan: '',
        newCallCost: '',
        newSmsCost: '',
        showPricePlan: false,

        fetchPlan() {
            axios.get('http://localhost:4011/api/price_plans')
                .then(result => {
                    console.log(result.data);
                    this.plans = result.data;
                })
                .catch(error => {
                    console.error('Error fetching price plans:', error);
                });
        },

        togglePricePlan() {
            this.showPricePlan = !this.showPricePlan;
            console.log(this.showPricePlan ? "Table is shown" : "Table is hidden");
        },

        calculateTotal() {
            return axios.post('http://localhost:4011/api/phonebill/',{
                "price_plan": this.plan,
                "actions": this.actions
            })
            .then(response =>{
                this.total = response.data.total;
                this.plan ='';
                this.actions = '';

                setTimeout(() => {
                    this.total = '';
                }, 3000);
            })
        },

        createPricePlan () {
            return axios.post('http://localhost:4011/api/price_plan/create', {
                "name": this.newPlan,
                "sms_cost": this.smsCost,
                "call_cost": this.callCost
            })
            .then(response =>{
                this.newPlan = '';
                this.smsCost = '';
                this.callCost = '';
            })
        },
        updatePricePlan () {
            return axios.post('http://localhost:4011/api/price_plan/update', {
                "name": this.existingPlan,
                "sms_cost": this.newSmsCost,
                "call_cost": this.newCallCost
            })
            .then(response =>{
                this.message = 'Price Plan updated sucessfully!';
                this.newPlan = '';
                this.smsCost = '';
                this.callCost = '';

                setTimeout(() => {
                    this.message = '';
                }, 3000);
            })

            
        },

        deletePricePlan () {
            return axios.post('http://localhost:4011/api/price_plan/delete', {
                "id": this.idNum
            })
            .then(response => {
                this.idNum = '';
            })
        }

    }))
})
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
            .catch(error => {
                console.error('Error calculating total:', error);
            });  
        },

        createPricePlan () {
            return axios.post('http://localhost:4011/api/price_plan/create', {
                "name": this.newPlan,
                "sms_cost": this.smsCost,
                "call_cost": this.callCost
            })
            .then(response =>{
                this.plans = response.data;
                this.newPlan = '';
                this.smsCost = '';
                this.callCost = '';
            })

            .catch(error => {
                console.error('Error creating price plan:', error);
            });
        },
        updatePricePlan () {
            return axios.post('http://localhost:4011/api/price_plan/update', {
                "name": this.existingPlan,
                "sms_cost": this.newSmsCost,
                "call_cost": this.newCallCost
            })
            .then(response =>{
                this.plans = response.data;
                this.message = 'Price Plan updated sucessfully!';
                this.existingPlan = '';
                this.newSmsCostmsCost = '';
                this.newCallCost = '';

                setTimeout(() => {
                    this.message = '';
                }, 3000);
            })
            .catch(error => {
                console.error('Error updating price plan:', error);
                this.message = 'Failed to update price plan.';
            });

            
        },

        deletePricePlan () {
            return axios.post('http://localhost:4011/api/price_plan/delete', {
                "id": this.idNum
            })
            .then(response => {
                this.plans = response.data;
                this.idNum = '';
            })
            .catch(error => {
                console.error('Error deleting price plan:', error);
            });
        }

    }))
})
//this component will be used to display user cart, depending on the current user id stored in local storage

export default{
    template:`
    <div>
        <div class="hstack gap-3" v-for="item in cart_items">
            <div class="p-2">{{item.product_id}}</div>
            <div class="p-2 ms-auto"> Quantity: {{item.quantity}}</div>
            <div class="vr"></div>
            <div class="p-2">Price per Unit: {{item.price}}</div>
        </div>

       

                    <div class="card text-center">
            <div class="card-header">
                Checkout
            </div>
            <div class="card-body">
                <h5 class="card-title">Total: {{total}}</h5>
                <p class="card-text"></p>
                <a href="#" class="btn btn-primary" @click="checkout">Proceed</a>
            </div>
            <div class="card-footer text-muted">
                
            </div>
</div>
    </div>`, 

    data(){
        return {
            cart_items:[],
            total:0 , 
            token: localStorage.getItem("auth-token"),
            user_id: Number(localStorage.getItem("id")),
            total:0, 
            message:null


        }
    }, 
    computed:{
       
    },

    async mounted(){
        const res=await fetch(`/api/cart/${this.user_id}`, {
            headers:{
                "Authentication-Token":this.token,
                // "Content-Type":"application/json" 
            }, 
            // body: JSON.stringify({
            //     user_id: this.user_id
            // })
        })
        if (res.ok){
            let data=await res.json()
            this.cart_items=data
        }
        else{
            console.log("response from cart was not ok")
        } 

        
            let sum=0
            for (let i=0; i<this.cart_items.length; i++){
                let quantity=this.cart_items[i]["quantity"]
                let price=this.cart_items[i]["price"]
                sum=sum + quantity*price
            }
            this.total= sum
        
    }, 

    methods:{
        async checkout(){
            //pass current user id and preferabbly the cart object as well, or fetch cart in the views.py function instead
            const res=await fetch(`/checkout/${this.user_id}`, {
                method:"POST",
                headers:{
                    "Authentication-Token":this.token,
                    "Content-Type":"application/json"
                }, 
                body:JSON.stringify(this.cart_items)
            })

            if (res.ok){
                console.log("checkout successfull")
                this.$router.push("/")
            }
            else{
                console.log("There was an error while adding the product to the db")
                this.cart_items=await res.json()
                // this.message=this.message.message
            }
        }
    }
}
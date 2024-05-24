//this home page is to be copied from the mad 1 project

export default{
    template:`
    <div>
        <div v-for="products, category_name in categories">
            <h3>{{category_name}}</h3>
            <h5 class="text-success">{{message}}</h5>
            <!-- the following div is for the horizontal container showing the product cards of a given category-->
            <div class="container-fluid" style=" display:flex; overflow: scroll; align-content: space-between;">

                <div v-for="product in products" class="card" style="width: 20%; min-width: 20%; margin: 0.5%">
                    <img :src="product[4]" class="card-img-top" alt="Image of the product">

                    <div class="card-body">
                      
                        <h5 class="card-title">{{product[1]}}</h5>
                        <p class="card-text">Price per unit: {{product[2]}} </p>
                        <p class="card-text">Stock: {{product[3]}}</p>
                        

                        <!-- let us not add a form at all, let user be able to click a button and get the message that item added to cart-->
                        <button class="btn btn-primary" @click="add_to_cart(product[0])">Add Item to Cart</button>

                    </div>
                </div>

            </div>
            

            

        </div>
      
    </div>`, 

    data(){
        return {
            categories:{} , //js object with keys as categories and value being a single list of lists, every sub list constains product name, id and quantity and price
            user_id:localStorage.getItem("id"), 
            message:null,
            token:localStorage.getItem('auth-token')
        }
    }, 

    async mounted(){
        const res= await fetch("/api/home", {
            headers:{
                "Authentication-Token":this.token
            }
        })

        if (res.ok){
            let data=await res.json()
            this.categories=data
            // console.log(res)
            // console.log(this.categories.keys())
        }
        else{
            console.log("An error occured while fetching data from the api")
        }
    }, 

    methods:{
        async add_to_cart(product_id){  //need product id and user id
            console.log(product_id)
            const res=await fetch("/api/cart", {
                method:"POST", 
                headers:{
                    "Authentication-Token":this.token,
                    "Content-Type":"application/json"
                }, 
                body:JSON.stringify({
                    "user_id": this.user_id,
                    "product_id": product_id
                })
            })

            if (res.ok){
                let data=await res.json()
                this.message=data.message
                let clear_message=setTimeout(()=>{
                    console.log("inside set timeout")
                    this.message=null
                }, 1500)

            }
        }
    }
}
//this page displays the results of a search query from home page
export default{
    template:`
    <div> 
        <h2>{{message}}</h2>
        <div class="card" style="width: 30%; display: inline-block; margin: 1%;" v-for="product in product_list">
            <img src="product[image]" class="card-img-top" alt="image of the product">
            <div class="card-body">
                <h5 class="card-title">{{ product["name"] }}</h5>
                <p class="card-text">Stock: {{product["quantity"]}}</p>
                <p class="card-text">Price: {{product["rate_per_unit"]}}</p>
                <a href="#" class="btn btn-primary" @click="add_to_cart(product['id'])">Add to Cart</a>
        </div>
</div>
    </div>`, 

    data(){
        return {
            query:this.$route.params.query_string,
            product_list:[], 
            message:null, 
            user_id:localStorage.getItem("id")
        }
    }, 
    methods:{
        //method for adding to cart
    },

    async mounted(){
        const res=await fetch(`/api/search-results/${this.query}`)

        if (res.ok){
            this.product_list=await res.json()  //list of products that matches the search String
            console.log(this.product_list)

        }
        else{
            this.message=await res.json()

        }
    }, 

    methods:{
        async add_to_cart(product_id){
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

            }
        }
    }
}
/*for updating the name, quantity and price of a product, page is basically a form where we have to enter
 these 3 fields and keep in mind that we also will have to pass the id of the product in the request body*/


 export default{
    template:`
    <div> 
    <p>{{message}}</p>

    <div class="mb-3">
        <label for="product_name" class="form-label">Name of the product</label>
        <input class="form-control" type="text" id="product_name" v-model="cred.name">
    </div>
    <div class="mb-3">
        <label for="rate" class="form-label">Rate per unit</label>
        <input class="form-control" type="number" id="rate" v-model="cred.rate_per_unit">
    </div>
    <div class="mb-3">
        <label for="quantity" class="form-label">Quantity</label>
        <input class="form-control" type="number" id="quantity" v-model="cred.quantity">
    </div>
     
    <div class="mb-3">
  <label for="category_id" class="form-label">Category Id</label>
  <input class="form-control form-control-lg" id="category_id" type="number" v-model="cred.category_id">
    </div>

    <button class="btn btn-primary"  @click='update_product()'>Update</button>

    </div>`,

    data(){
        return {
            cred:{
                name: null,
                id:Number(this.$route.params.product_id),
                rate_per_unit: null,
                quantity: null, 
                category_id: null
    
            }, 
            message:null, 
            product_id:Number(this.$route.params.product_id),
            token:localStorage.getItem('auth-token')
        }
      },

      methods:{
        async update_product(){
            const res=await fetch("/api/products", {
                method:"PUT", 
                headers:{
                "Authentication-Token":this.token,
                "Content-Type":"application/json"
                },
                body: JSON.stringify(this.cred)

            })
            let data=await res.json()
            if(res.ok){
                this.$router.push("/categories")
            }
            else{
                this.message=data.message
            }
        }
      }


 }
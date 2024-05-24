export default{
    template:`
    <div>
    {{message}}
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
  <label for="image" class="form-label">Image</label>
  <input class="form-control form-control-sm" id="image" type="text" v-model="cred.image">
</div>
<div class="mb-3">
  <label for="category_id" class="form-label">Category Id</label>
  <input class="form-control form-control-lg" id="category_id" type="number" v-model="cred.category_id">
</div>
  
<button class="btn btn-primary"  @click='add_product'>Add Product!</button>
</div>`, 

  data(){
    return {
        cred:{
            name: null,
            rate_per_unit: null,
            quantity: null, 
            image: null, 
            category_id: null

        }, 
        message:null, 
        token:localStorage.getItem('auth-token')
    }
  },

  methods:{
    async add_product(){
        const res=await fetch("/api/products", {
            method:"POST", 
            headers:{
                "Authentication-Token":this.token,
                "Content-Type":"application/json"
            }, 

            body: JSON.stringify(this.cred)
        }
        )

        let data=await res.json()

        if(res.ok){
            console.log(data)

            this.$router.push("/admin")
        }

        else{
            this.message= "An error occured, product could not be added to the database"

        }
    }
  }
}
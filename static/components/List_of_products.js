//for displaying the products of a given category
export default{
    template:`<div>  {{error}}

    <h1> List of products of category{{category_id}}</h1>
    <table class="table">
  <thead>
    <tr>
      <th scope="col">Id</th>
      <th scope="col">Name</th>
      <th scope="col">Quantity</th>
      <th scope="col">Price</th>
      
    </tr>
  </thead>
  <tbody>
    <tr v-for="product in products">
      <th scope="row">{{product.id}}</th>
      <td>{{product.name}}</td>
      <td>{{product.quantity}}</td>
      <td>{{product.rate_per_unit}}</td>
      <td scope="col"><button class="btn btn-primary" @click="update_product(product.id)">Update</button></td>
      <td scope="col"><button class="btn btn-danger" @click="delete_product(product.id)">Delete</button></td>
    </tr>
    
  </tbody>
</table>
    <button class="btn btn-primary" @click=add_product()>Add Products</button>
    <h4>{{message}}</h4>

    </div>
    `,

    data(){
        return {
            category_id:Number(this.$route.params.category_id),  //for fetching products of the given category
            products:[],
            error:null,
            token:localStorage.getItem("auth-token"),
            role:localStorage.getItem("role"), 
            message:null
        }
    },

    async mounted(){  //get the products specific to the given category id for editing or deletion 
        // console.log(typeof(this.category_id))
        const res=await fetch(`/api/products/${this.category_id}`,{
            headers:{
                "Authentication-Token":this.token
            }
        })
        
        if(res.ok){
            console.log("response was okay")
            this.products=await res.json()  //list of js object containing data about the products of category_id
            
        }
        else{
            console.log("there was an error with the response")
            let response=await res.json()
            this.error=response.message
        }
    },

    methods:{
        async delete_product(product_id){
            console.log(this.role)
            if(this.role=="admin"){ //if admin, delete the product from the db

                const res=await fetch("/api/products", {
                    method:"DELETE", 
                    
                    headers: {
                    "Authentication-Token":this.token,
                    "Content-Type":"application/json"
                    }, 
                    body:JSON.stringify({
                        id: product_id
                    }) 
                })

                const response=await res.json()
                if(res.ok){
                    
                //return updated list of products
                const response=await fetch(`/api/products/${this.category_id}`,{
                    headers:{
                        "Authentication-Token":this.token
                    }
                })
                
                if(response.ok){
                    console.log("response was okay")
                    this.products=await response.json()  //list of js object containing data about the products of category_id
                    
                }
                else{
                    console.log("there was an error with the response")
                    let result=await response.json()
                    this.error=result.message
                }
                }
                else{
                    console.log(response.message)
                    
                    }
            }
            // console.log(this.category_id)
            else if(this.role=="inst"){ //if instructor, change delete attribute of the product to True
                const res=await fetch("/api/approval/products", {
                    method:"PUT", 
                    
                    headers: {
                    "Authentication-Token":this.token,
                    "Content-Type":"application/json"
                    }, 
                    body:JSON.stringify({
                        id: product_id
                    }) 
                })

                const response=await res.json()
                if(res.ok){
                      
                    this.message=response.message
                    
                    console.log(this.message)

                    let clear_message=setTimeout(()=>{
                        console.log("inside set timeout")
                        this.message=null
                    }, 2000)
                    
                
                }
                else{
                    console.log(response.message)
                    
                    }
            }
            
        },

        update_product(product_id){
            product_id=String(product_id)

            this.$router.push(`/update/product/${product_id}`)
        }, 

        add_product(){
            this.$router.push("/add/product")
        }

    }
}
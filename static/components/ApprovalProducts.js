//for store manager to get approvals for product deletion
export default{
    template: `<div>
    <h1> Products Deletion Requests by Store Manager</h1>
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
      
      <td scope="col"><button class="btn btn-danger" title="This will permanently remove the product." @click="delete_product(product.id)">Delete</button></td>
      <td scope="col"><button class="btn btn-primary" title="Deny the store managers Approval request!" @click="keep_product(product.id)">Keep</button></td>
    </tr>
    
  </tbody>
</table>

    <h4>{{message}}</h4>

    </div>
    `,

    data(){
        return {
            products:[], 
            message:null, 
            token:localStorage.getItem("auth-token")
        }
    }, 
    async mounted(){
        const res=await fetch("/api/approval/products", {
            headers:{
                "Authentication-Token":this.token
            }
        })
        
        if(res.ok){
            
            let data=await res.json()
            this.products=data
        }
        else{
            let data=await res.json()
            // console.log(data)
            this.message="There are no Product deletion requests as of now."
            
        }
    },

    methods:{
        async delete_product(product_id){
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

            // const response=await res.json()
            if(res.ok){  //if product has been successfully deleted
                //update product list on the web page at the same time
                const res2=await fetch("/api/approval/products", {
                    headers:{
                        "Authentication-Token":this.token
                    }
                })

                if (res2.ok){
                    console.log("res2 was ok")
                    let data=await res2.json()
                    this.products=data
                }
                else{
                    console.log("response was not ok! no product left for deletion")
                    this.products=[]
                }
                
            
            
            
            }
            else{
                console.log(response.message)
                    
                }
        }, 

        async keep_product(product_id){
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

            //update products present on screen
            if (res.ok){  

                const res=await fetch("/api/approval/products", {
                    headers:{
                        "Authentication-Token":this.token
                    }
                })
                
                if(res.ok){
                    
                    let data=await res.json()
                    this.products=data
                }
                else{
                    let data=await res.json()
                    // console.log(data)
                    this.products=[]
                    this.message="There are no Product deletion requests as of now."
                    
                }
            }
        }
    
    }
}
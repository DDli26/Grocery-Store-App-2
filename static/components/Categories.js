//to display all the categories in the db for admin and store manage
export default{
    template:`<div>
    <h3>Categories:</h3>
    
    
    <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Category Name</th>
      <th scope="col">Edit Products</th>
      
    </tr>
  </thead>
  <tbody >
    <tr v-for="category in categories">
      <th scope="row">{{category.id}}</th>
      <td>{{category.name}}</td>
      <td><button type="button" class="btn btn-primary" @click="get_products(category.id)">Products</button></td>
      <td><button type="button" class="btn btn-primary" @click="update_category(category.id)">Edit Category</button></td>
      <td><button type="button" class="btn btn-danger" @click="delete_category(category.id)">Delete Category</button></td>
    </tr>
    
  </tbody>
</table>
    
    
    
    
    </div>`,

    data(){
        return {
            categories:[]
        }
    }, 

    async mounted(){  //to get all the categories from the db and display them
        
            const res= await fetch("/api/categories", {
                headers:{
                    "Authentication-Token":localStorage.getItem("auth-token")

                }
            })
            console.log("fine before catch")
            let response=res//.catch((e)=>{console.log("there was an error while retriving categories from the end point")})
            console.log(response)
            console.log(response.ok)
            if(response.ok){
                let data=await response.json()
                this.categories=data
                console.log("response was ok", this.categories)
            }
            else{
                console.log("Response not ok")
            }
            
        
    }, 

    methods:{

        //route to list of products with a varibale in route
        get_products(category_id){
          this.$router.push(`/product_list/${category_id}`)
        }, 

        update_category(category_id){
          this.$router.push(`/update/category/${category_id}`)
        }, 

        delete_category(category_id){
          //open the warning page and 
          this.$router.push(`/delete/category/${category_id}`)

        }
    }
}
//this page is for categories tht require an approval
export default{
    template:`<div>
    <h3>Categories:</h3>

    <h4>{{message}}</h4>
    
    
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
      
      <td><button type="button" class="btn btn-primary" @click="approve_category(category.id)">Approve</button></td>
      <td><button type="button" class="btn btn-danger" @click="delete_category(category.id)">Delete Category</button></td>
    </tr>
    
  </tbody>
</table>
    
    
    
    
    </div>`,

    data(){
        return {
            categories:[], 
            token:localStorage.getItem("auth-token"), 
            message:null
            
        }
    }, 

    async mounted(){  //to get all the categories from the db and display them
        
            const res= await fetch("/api/approval/categories", {
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
              this.message="There are no approval requests as of now!"
                console.log("Response not ok")
            }
            
        
    }, 

    methods:{

        // //route to list of products with a varibale in route
        // get_products(category_id){
        //   this.$router.push(`/product_list/${category_id}`)
        // }, 

        async approve_category(category_id){
          //approve the category, using put
          const res=await fetch("/api/approval/categories", {
              method:"PUT", 
              headers:{
                "Authentication-Token":this.token,
                "Content-Type":"application/json"
              },
              body: JSON.stringify({
                id:Number(category_id)
              })
          })
          const data=await res.json()
          if (res.ok){
             this.categories=data
          }
          else{
            this.message=data.message
          }

          
        }, 

        async delete_category(category_id){
          const res=await fetch("/api/categories", {
            method:"DELETE", 
            headers:
            {
                "Authentication-Token":this.token,
                "Content-Type":"application/json" 
            }, 
            body:JSON.stringify({
              "id":category_id
            })
        })
        const data=await res.json()
        if (res.ok){
            //update category list on screen after one category has been deleted
            const res= await fetch("/api/approval/categories", {
              headers:{
                  "Authentication-Token":localStorage.getItem("auth-token")

              }
          })

            if (res.ok){
            let data=await res.json()
            this.categories=data
            console.log("response was ok for fetching categories after category approval", this.categories)
            }
            else{
              this.message="There are no approval requests as of now!"
              this.categories=[]
            } 
        }
        else{
            this.message="There are no approval requests as of now!"
            this.categories=[]
        }

        }
    }
}
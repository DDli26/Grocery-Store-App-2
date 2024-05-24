//this is for adding a new category to the db
/* Give the user a form in which he enters and category name and that category name is 
added to the database*/

export default{
    template:`
    <div>
    <h6>{{message}}</h6>
    <div class="mb-3">
    <label for="category_name" class="form-label">Name of the category</label>
    <input class="form-control" type="text" id="category_name" v-model="cred.name">
  </div>
  <button class="btn btn-primary" @click="create_category()">Create</button>
    </div>`, 

    data(){
        return {
            cred:{
                name:null
            }, 
            token: localStorage.getItem("auth-token"), 
            message:null, 
            role:localStorage.getItem("role")
            
        }
    },
    methods:{
        async create_category(){
            // console.log("inside create_category")

            if (this.role=="admin"){
                const res=await fetch("/api/categories", {
                    method:"POST", 
                    headers:{
                        "Authentication-Token": this.token,
                        "Content-Type":"application/json"
                    }, 
                    body: JSON.stringify(this.cred)
                })


                // let data=await res.json()

                if (res.ok){
                    this.$router.push("/categories")
                }
                else{
                let data=await res.json()
                this.message=data.message
                }
            } //if role ==admin

            else if(this.role=="inst"){
                const res=await fetch("/api/approval/categories", {
                    method:"POST", 
                    headers:{
                        "Authentication-Token": this.token,
                        "Content-Type":"application/json"
                    }, 
                    body: JSON.stringify(this.cred)
                })


                // let data=await res.json()

                if (res.ok){
                    this.$router.push("/")
                }
                else{
                let data=await res.json()
                this.message=data.message
                }
            }
        }
    }
}
//component displays a form for changing the name of the category, the category id is passed in the route
export default{
    template:`
    <div>
    <p>{{message}}</p>
    <div class="mb-3">
        <label for="category_name" class="form-label">Name of the category</label>
        <input class="form-control" type="text" id="category_name" v-model="cred.name">
    </div>
    <button class="btn btn-primary" @click="update_category()">Update</button>
    </div>`, 

    data(){
        return {
            cred:{
                id:Number(this.$route.params.category_id),
                name:null,
            },
            token:localStorage.getItem("auth-token"), 
            message:null
        }
    },
    methods:{
        async update_category(){
            const res=await fetch("/api/categories", {
                method:"PUT", 
                headers:{
                    "Authentication-Token":this.token, 
                    "Content-Type":"application/json"
                }, 
                body: JSON.stringify(this.cred)
            })

            let data=await res.json()
            if(res.ok){
                console.log("category updated successfully")
                this.$router.push("/categories")
            }
            else{
                message=data.message
            }
        }
    } 

}
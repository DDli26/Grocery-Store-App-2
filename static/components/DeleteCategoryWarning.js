//this is where you come after pressing the delete category button, 
export default{
    template:`
    <div>  
        <p>{{message}}</p>
    <div class="card" style="width: 18rem;">
    
    <div class="card-body">
        <h5 class="card-title">Are you sure you want to delete this Category! The changes cannot be reversed</h5>
        <p class="card-text"></p>
        <button class="btn btn-danger"  @click="del()">Delete!</button>
        <button class="btn btn-success"  @click='go_back()'>No! Take me back.</button>
    </div>
</div>
</div>

    </div>`,

    data(){
        return {
            cred:{
                id:Number(this.$route.params.category_id), 

            }, 
            token:localStorage.getItem("auth-token"), 
            message:null
        }
    }, 

    methods:{
        async del(){
            const res=await fetch("/api/categories", {
                method:"DELETE", 
                headers:
                {
                    "Authentication-Token":this.token,
                    "Content-Type":"application/json" 
                }, 
                body:JSON.stringify(this.cred)
            })

            const data=await res.json()
            if (res.ok){
                this.$router.push("/categories")
            }
            else{
                this.message=data.message
            }
        }, 

        async go_back(){
            this.$router.push("/categories")
        }
    }
}
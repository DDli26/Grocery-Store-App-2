export default{   //approving store-managers, here we are doin it wrt the instructor, but it is the same
    template:`
    <div>
    <div v-if='error'>{{error}}</div>  <!-- v-if only working with single quotes-->

    <div v-for="user in allUsers"><br>{{user.email}} <span style="tab-size:4;">   </span>
    <button class="btn btn-primary" v-if='!user.active' @click="approve_user(user.id)"> Approve </button>
    </div>
    
    </div>`,

    data(){
        return {
            allUsers:[],
            error:null,
            token:localStorage.getItem('auth-token')
        }
    },
    methods:{

        async approve_user(id){  
            let res= await fetch(`/activate/instructor/${id}`, {
                headers:{
                    "Authentication-Token":this.token
                }
            })
            
            //update user page to display users who have been freshly approved
            
            let res2=await fetch("/users", {
                headers:{
                    "Authentication-Token":this.token
                }
            })

            if (res2.ok){
                this.allUsers=await res2.json()
            }
            else{
                console.log("An error occured while fetching users the second")
            }
        }

    },

    async mounted(){  //executes after the page is loaded
        const res=await fetch('/users', {
            headers:{
                "Authentication-Token":this.token //flask security can figure out the role based on the token

            },

        })

        const response=await res.json().catch(e=> {console.log("nothing doing")})

        

        if (res.ok){
            this.allUsers=response
        }
        else{
            this.error="Error"
        }
    }
}
//template for login page

export default{
    template: `


<div class="d-flex justify-content-center" style="margin-top: 30vh;">
    <div class="mb-3 p-5 bg-light">

    <div>{{error}}</div>
    
  <label for="user-email" class="form-label">Email address</label>
  <input type="email" class="form-control" id="user-email" placeholder="name@example.com"
  v-model="cred.email">


  <label for="user-password" class="form-label">Password</label>
  <input type="password" class="form-control" id="user-password" placeholder="Enter your password"
  v-model="cred.password">
  <br>

  <button class="btn btn-primary"  @click='login'>Login</button>
  <br>
  <br>

  <router-link to="/register"><button class="btn btn-success">Don't Have an account</button></router-link>

  
    </div>
</div> 
`, 
  data(){
    return {
        cred: {
            'email': null,
            "password": null
        }, 
        userRole: null,  //no use for this 
        error:null
    }
  }, 
  methods:{
    async login(){  //login is async as we must await confirmation first.
        // console.log(this.cred) //check console and see
        const res=await fetch("/user-login", 
        {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            }, 
            body:JSON.stringify(this.cred)  //sending json cred to user-login, will be sent as request object, 
            //notice that we are using data.get("email") and "password" in the user login function. Any other name and it won't work
            

        })


        
        if(res.ok){
          const data=await res.json()  //this will read the response as a JSON String and convert/parse it into a javascript object
            console.log(data)
            localStorage.setItem('auth-token', data.token)  //saving the authentication token in the local storage
            localStorage.setItem("role", data.role)
            localStorage.setItem("id", data.id)
            //check role and navigate the user accordingly

            this.userRole=data.role;

            // if(data.role=="admin")
            this.$router.push("/")   //router instance can be access from any component using this.$router


            //works like /?role=admin
            // this.$router.push({path:"/", query:{role: data.role}})  //no longer needed as role is present in the local storage
        }

        else{
          const data=await res.json()
          this.error=data.message
        }
    }
  }
}
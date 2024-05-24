export default{   
    template: `
    <div>
    <h4>Store Manager Dashboard</h4>

    <button class="btn btn-primary" @click='downlodCSV'>Download Inventory Details</button><span v-if='Waiting'> Waiting... </span>
    <main>
            <ul class="list-group list-group-flush">
                
                <li class="list-group-item"> <router-link to='/categories'>Categories</router-link> </li>
                <li class="list-group-item"><router-link to="/add/product">Add a new Product</router-link></li>
                
                <li class="list-group-item"><router-link to="/add/category">Add a new Category</router-link></li>
                
            </ul>

            </main>
    </div>`,
    data() {
        return {
          Waiting: false,
          message:null
        }
      },
      methods: {
        async downlodCSV() {
          this.Waiting = true
          const res = await fetch('/download-csv')
          const data = await res.json()
          if (res.ok) {
            const taskId = data['task_id']
            const intv = setInterval(async () => {
              const csv_res = await fetch(`/get-csv/${taskId}`)
              if (csv_res.ok) {
                console.log("csv_res was ok")
                this.Waiting = false
                clearInterval(intv)
                window.location.href = `/get-csv/${taskId}` //this will directly go to that url and download the file, otherwise we'd have to use blob and a lot of stuff to save the fetch result
              }
              else{
                console.log("There was an error while downloading the file")
              }
            }, 1000)
          }
        },
      },
    
}
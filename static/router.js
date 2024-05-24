import Home from "./components/Home.js"
import Login from "./components/Login.js"
import Register from "./components/Register.js"
import admin_dashboard from "./components/AdminDashboard.js"
import Users from "./components/Users.js"
import Categories from "./components/Categories.js"
import AddProduct from "./components/AddProduct.js"
import List_of_products from "./components/List_of_products.js"
import Update_product from "./components/Update_product.js"
import Update_category from "./components/Update_category.js"
import AddCategory from "./components/AddCategory.js"
import DeleteCategoryWarning from "./components/DeleteCategoryWarning.js"
// import AdminApprovals from "./components/AdminApprovals.js"
import Approvals from "./components/Approvals.js"
import CategoryApprovals from "./components/ApprovalCategories.js"
import ApprovalProducts from "./components/ApprovalProducts.js"
import Cart from "./components/Cart.js"
import SearchResults from "./components/SearchResults.js"
const routes=[
    {
        path: "/", 
        component: Home, 
        name:"Home"
    }, 
    {
        path:"/login", component:Login, 
        name:"login"
    },
    {
        path: "/register", component:Register, name:"register" 
    },

    {
        path:"/admin", component: admin_dashboard, name:"admin_dashboard"
    },

    {
        path:"/users", component:Users, name:"users"
    }, 

    {
        path:"/categories", component:Categories, name:"categories"
    }, 

    {
        path:"/add/product", component:AddProduct, name:"add product"
    }, 
    
    {
        path:"/product_list/:category_id", component:List_of_products, name:"list of products"
    }, 

    {
        path:"/update/product/:product_id", component:Update_product, name:"Update Products"
    },

    {
        path:"/update/category/:category_id", component:Update_category, name:"Update Category"
    }, 

    {
        path:"/add/category", component:AddCategory, name:"Add Category"
    }, 

    {
        path:"/delete/category/:category_id", component:DeleteCategoryWarning, name:"delete category"
    }, 

    {
        path:"/categories_approval", component:CategoryApprovals, name:"Category Approvals"
    }, 
    {
        path:"/product_approvals", component:ApprovalProducts, name:"Product Approvals"
    },

    {
        path:"/cart", component:Cart, name:"cart"
    
    }, 
    {
        path:"/admin_approval", component:Approvals, name:"Approvals"
    },

    {
        path:"/search/:query_string", component:SearchResults, name:"Search Results"
    }
]

export default new VueRouter({
    routes,
})
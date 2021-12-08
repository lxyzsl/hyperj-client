export default[
    // 用户
    {
        path:"/system",
        redirect:"/system/user"
    },
    {
        path:"/system/user",
        component:"./system/user",
    },

    // 角色
    {
        path:"/role",
        redirect:"/system/role"
    },
    {
        path:"/system/role",
        component:"./system/role",
    },


]
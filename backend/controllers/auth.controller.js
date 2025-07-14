export const signup=async(req,res)=>
{
    try
    {
        res.send("signup");
    }
    catch(error)
    {
        console.log(`\nError in signup controller ${error}\n`);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const login=async(req,res)=>
{
    try
    {
        res.send("login");
    }
    catch(error)
    {
        console.log(`\nError in login controller ${error}\n`);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const logout=async(req,res)=>
{
    try
    {
        res.send("logout");
    }
    catch(error)
    {
        console.log(`\nError in logout controller ${error}\n`);
        res.status(500).json({message:"Internal Server Error"});
    }
}
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const app = express();


app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods:'POST',
    allowedHeaders: 'Content-Type, Accept, Accept-Language',
    exposedHeadersHeaders: 'Content-Type, Accept, Accept-Language'
  })
);
app.use(express.json());





app.post("/users/register", async (req,res) =>{
    const {email,password} = req.body;
    try {
        const {data,error} = await supabase.auth.signUp({
            email,
            password
        });
        if (error) throw error;
        res.json({message: "Registration Succesfull", user: data.user});
    }  catch (error) {
        res.status(400).json({error: error.message});
    }
});

app.post("/users/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      res.json({ token: data.session.access_token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  const checkAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
  
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);
      if (error) throw error;
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  };
  app.get("/users/protected", checkAuth, (req, res) => {
    res.json({
      message: "You are authenticated!",
      user: req.user.email,
      timestamp: new Date().toISOString(),
    });
  });


  







app.post("/users/create", async (req,res) => {

  const { first_name, last_name, email, bio, date_of_birth} = req.body;

  try{
    const { data: userData, error: userError } = await supabase
    .from("users")
    .insert([
      {
        first_name,
        last_name,
        email
      },
    ])
    .select('id');

    if (userError) {
      return res.status(400).json({error: userError.message});
    }

    const userId = userData[0].id;
    console.log(req.body);

    const {data: profileData, error: profileError} = await supabase
    .from('user_profiles')
    .insert([
      {id:userId, bio, date_of_birth}
    ]);

    if (profileError) {
      return res.status(400).json({ error: profileError.message });
    }

    console.log(JSON.stringify(userData));

    //, user: userData[0], profile: profileData[0]}


    res.status(201).json({message: "PROFILE CREATED"}); 
  } catch (error) {
    console.error("Error inserting profile:", error);
    res.status(500).json({ error: error.message });
  }
});




app.get("/users/profiles", async (req, res) => {
    try{
        console.log("Fetching");
        const {data,error} = await supabase
        
        .from('users')
        .select(`
            id, 
            first_name, 
            last_name, 
            email,  
            user_profiles (
                date_of_birth,
                bio
            )
        `)

        if (error) {
            return res.status(500).json({error: error.message});
        }
        res.status(200).json(data);
    } catch (error) {
        res.statur(500).json({error: error.message});
    }

});

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
const express=require("express")
const path=require("path");
const bcrypt=require("bcrypt")
const Users=require('./config')
// const { signupValidationRules, loginValidationRules, validate } = require('./validation');

const app = express();
// convert data into json format
app.use(express.json());
// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post('/signup',async (req,res)=>{
    try{
        const data={
        name:req.body.username,
        password:req.body.password,
        email:req.body.email
        };

        const existingUser = await Users.findOne({ $or: [{ name: data.name }, { email: data.email }] });
        if (existingUser) {
            return res.render('signup', { error: 'User with this email or username already exists' });

        }
        else {
            // Hash the password using bcrypt
            const saltRounds = 10; // Number of salt rounds for bcrypt
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);

            data.password = hashedPassword; // Replace the original password with the hashed one

            const userdata = await Users.create(data);;
            console.log(userdata);
            res.render("login")
        }   
    }
     catch(err) {
            console.error('Error registering user:', err);
            res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/login', async(req, res) => {
    try{
        // Extract username and password from request body
        const data={
            name:req.body.username,
            password:req.body.password
            };
    

        // Find the user by username
        const user = await Users.findOne({name: data.name});

        // If user does not exist or password does not match, return error
        if( !user || !(await user.comparePassword(data.password))){
            // alert('Invalid username or password');
            // return res.status(401).json({error: 'Invalid username or password'});
            return res.render('login', { error: 'Invalid username or password' });
        }
        else{
            res.render("home");
        }
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/logout', (req, res) => {
    try{
        res.render("login");
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});









// Define Port for Application
const port = 2000;
app.listen(port, '0.0.0.0', () => {  // Bind to all network interfaces
    console.log(`Server is running on http://localhost:${port} or http://<local-ip-address>:${port}`);
});
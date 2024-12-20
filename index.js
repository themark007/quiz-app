import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "quiz",
  password: "xmkms@123",
  port: 5432,
});

db.connect();

var un;
let ud;

let un1;
let uid2;



const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true })); 

// Route to display login form
app.get("/", (req, res) => {
  res.render("login.ejs");
});

let uid;



// Route to handle login form submission
app.post("/submit", (req, res) => {
  const { username, password } = req.body;
    // Store the username in a variable
  

  const query = "SELECT * FROM users WHERE username = $1 AND password = $2";
  
  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Database error");
    } else {
      if (result.rows.length > 0) {
        // If a matching user is found, store the id in the ud variable
        let un = result.rows[0].username;
        
        ud = result.rows[0].id; // Storing the user's id in the ud variable

        console.log(`User ID (ud): ${ud}`);
        console.log(un);
        // You can now use the ud variable to pass to the dashboard or for further processing
        res.render("dashboard.ejs", { username: un });  
        // Optionally pass the userId to the dashboard
      } else {
        res.send("Invalid username or password");
      }
    }
  });
});


app.get("/r",(req,res)=>{
  res.render("details.ejs");
});



// Route to handle REGISTERATION form submission
app.post("/registration", (req, res) => {
  const { username, password, email } = req.body;
  
  // Insert data into the 'users' table
  const query = `INSERT INTO users (username, password, email) VALUES ($1, $2, $3)`;
  
  db.query(query, [username, password, email], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Database error");
    } else {
      res.render("details.ejs");
    }
  });
});


app.post("/info", (req, res) => {
  const { username, full_name, age, email, college_name, college_email,  contact_number,password } = req.body;
  un1=username;

  // Insert data into the 'users' table
  const query = `INSERT INTO users (username, full_name, age, email, college_name, college_email,  contact_number,password) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7 , $8)`;

  // Use parameterized queries to prevent SQL injection
  db.query(query, [username, full_name, age, email, college_name, college_email, contact_number,password], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Database error");
    } else {
      res.render("login.ejs");
    }
  });
});


//--------login page and dashboard completed--------------------//

//profile

app.get("/profile", (req, res) => {
  // Get the 'un' query parameter
  const un = req.query.ud;
  console.log("Query parameter 'un':", un);

  

  // SQL query to select everything from the 'users' table
  const query = "SELECT * FROM users WHERE id = $1";

  // Execute the query
  db.query(query, [ud], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).send("Database error");
    } else if (result.rows.length === 0) {
      console.log("No user found for username:", un);
      res.status(404).send("User not found");
    } else {
      // Extract and render user data
      const user = result.rows[0];
      const { username, full_name, age, email, college_name, college_email, contact_number } = user;

      res.render("profile.ejs", {
        username,
       email,
       full_name,
        college_name
        
      });
    }
  });
 
});



let subject;

app.get("/inst",(req,res)=>{
   subject = req.query.subject; // Retrieve the subject value

  if (!subject) {
    return res.status(400).send("No subject provided");
  }

  // Handle the subject value
  console.log(`Selected subject: ${subject}`);
  // Redirect to the relevant page or fetch data based on the subject
  res.render("instruction.ejs");
  
});



//----questionsssssss-------------//


// Add a route to fetch random 15 questions
 // Array to store the questions

// Add a route to fetch random 15 questions


app.get("/test", (req, res) => {
  if(subject== "cn"){
  const query = `
    SELECT question, option_a, option_b, option_c, option_d, correct_answer
    FROM cn
    ORDER BY RANDOM() 
    LIMIT 15;
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).send("Database error");
    } else {
      const questionsArray = result.rows;
      res.render("question.ejs", { questionsArray });
    }
  });
}
else if(subject == "os")
{
  const query = `
    SELECT question, option_a, option_b, option_c, option_d, correct_answer
    FROM os
    ORDER BY RANDOM() 
    LIMIT 15;
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).send("Database error");
    } else {
      const questionsArray = result.rows;
      res.render("question.ejs", { questionsArray });
    }
  });
}
else if(subject == "dsa")
{
  const query = `
    SELECT question, option_a, option_b, option_c, option_d, correct_answer
    FROM dsa
    ORDER BY RANDOM() 
    LIMIT 15;
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).send("Database error");
    } else {
      const questionsArray = result.rows;
      res.render("question.ejs", { questionsArray });
    }
  });
}
else if(subject == "apti")
{
  const query = `
    SELECT question, option_a, option_b, option_c, option_d, correct_answer
    FROM apti
    ORDER BY RANDOM() 
    LIMIT 15;
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).send("Database error");
    } else {
      const questionsArray = result.rows;
      res.render("question.ejs", { questionsArray });
    }
  });
}
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



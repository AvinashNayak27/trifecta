const express = require("express");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2").Strategy;
const axios = require("axios");

async function fetchUserDetails(accessToken) {
  const query = `
            {
              viewer {
                user {
                  username
                }
              }
            }
  `;

  try {
    const response = await axios.post(
      "https://api.producthunt.com/v2/api/graphql",
      { query },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(response.data);

    return response.data.data.viewer;
  } catch (error) {
    console.error(
      "Error fetching user details:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to fetch user details");
  }
}

const app = express();

// Replace these with your Product Hunt app's credentials
const CLIENT_ID = "XWdN_aI5A3inhjWTgRfBP1uaMSfVG0wmKlyA1O-mdso";
const CLIENT_SECRET = "FKBA9P9DTRgW-BqlzgmOdVQ-WxuLa0nEy21fNLCz97U";

passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: "https://api.producthunt.com/v2/oauth/authorize",
      tokenURL: "https://api.producthunt.com/v2/oauth/token",
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL:
      "https://producthunt-server.fly.dev/redirect",
      scope: "public private",
    },
    function (accessToken, refreshToken, profile, cb) {
      // Here, you can save the accessToken and profile information as needed
      return cb(null, { accessToken, profile });
    }
  )
);

// Serialize user into the sessions
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the sessions
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.use(
  session({ secret: "your_secret_key", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Initiate authentication with Product Hunt
app.get("/auth/producthunt", passport.authenticate("oauth2"));

// Define a route to display user profile information
app.get("/get-access-token", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/producthunt");
  }

  res.json({ accessToken: req.user.accessToken });
});

app.get("/profile", async (req, res) => {
  const bearerToken = req.headers['authorization'];
  const accessToken = bearerToken.split(' ')[1];

  if (!accessToken) {
    return res.status(401).send("No access token provided");
  }

  try {
    const userDetails = await fetchUserDetails(accessToken);
    console.log(userDetails);
    res.json({ profile: userDetails });
  } catch (error) {
    res.status(500).send("Error retrieving user profile");
  }
});

// Home route
app.get("/", (req, res) => {
  res.send(
    '<h1>Welcome to the Product Hunt Auth App</h1><a href="/auth/producthunt">Login with Product Hunt</a>'
  );
});

// Handle the callback from Product Hunt
app.get(
  "/redirect",
  passport.authenticate("oauth2", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication
    res.redirect("/profile");
  }
);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

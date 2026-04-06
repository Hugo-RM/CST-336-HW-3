import 'dotenv/config'
import express from 'express'
import pokemon from 'pokemontcgsdk'

const app = express();
const POKEMON_TCG_API_KEY = process.env.API_KEY;

pokemon.configure({apiKey: `${POKEMON_TCG_API_KEY}`})

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

// routes

// root
app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

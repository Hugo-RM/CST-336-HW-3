import 'dotenv/config'
import express from 'express'
import pokemon from 'pokemontcgsdk'

const app = express();
const POKEMON_TCG_API_KEY = process.env.API_KEY;

pokemon.configure({apiKey: `${POKEMON_TCG_API_KEY}`})

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

function dayOfYear(month, day) {
    const days = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
    return days[month - 1] + day;
}

// routes

// root
app.get('/', (req, res) => {
    res.render('home.ejs');
});

app.post('/displayPokemon', async(req, res) => {
    const birthday = req.body.birthday;
    let [year, month, day] = birthday.split('-').map(Number);

    const pokeId = ((dayOfYear(month, day) * year) % 1025) + 1;

    try {    
        let url = `https://pokeapi.co/api/v2/pokemon/${pokeId}`;

        let response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        let data = await response.json();

        res.render('pokemon.ejs', { data, month, day, year });
    } catch (err) {
        console.log(err);
    }
});

app.get('/pokemonOfTheDay', async(req, res) => {
    const today = new Date();

    const month = today.getMonth() + 1;
    const day = today.getDate();
    const year = today.getFullYear();


    try {    
        let url = `https://pokeapi.co/api/v2/pokemon/${month}${day}`;

        let response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        let data = await response.json();

        res.render('pokemon.ejs', { data, month, day, year });
    } catch (err) {
        console.log(err);
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

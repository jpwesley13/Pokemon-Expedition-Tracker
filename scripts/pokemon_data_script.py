import os
import requests
import json

def fetch_data():
    url = "https://pokeapi.co/api/v2/pokemon/"
    pokemon_data = []
    next_page = url

    while next_page:
        res = requests.get(next_page)
        data = res.json()
        next_page = data['next']

        for pokemon in data['results']:
            pokemon_details = requests.get(pokemon['url']).json()
            dex_number = pokemon_details['id']

            if dex_number > 1025:
                species_data = requests.get(pokemon_details['species']['url']).json()
                dex_number = species_data['pokedex_numbers'][0]['entry_number']

            pokemon_data.append({
                'name': pokemon_details['name'],
                'dex_number': dex_number,
                'types': [t['type']['name'] for t in pokemon_details['types']],
                'shiny': False 
            })

            print(f"Fetched {pokemon_details['name']}")

    with open('../client/public/data/pokemon_data.json', 'w') as f:
        json.dump(pokemon_data, f, indent=2)

fetch_data()
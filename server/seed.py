#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from datetime import datetime
import requests

# Remote library imports
from faker import Faker


# Local imports
from app import app
from models import *

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
        User.query.delete()
        Locale.query.delete()
        Expedition.query.delete()
        Region.query.delete()
        Pokedex.query.delete()
        Goal.query.delete()
        Species.query.delete()
        Catch.query.delete()
        Type.query.delete()

        regions = []
        region_names = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar", "Paldea", "Orre", "Ultra Space", "Kitakami", "Almia", "Oblivia", "Lental", "Uncharted"]

        for region_name in region_names:
            region = Region(
                name = region_name
            )
            regions.append(region)

        db.session.add_all(regions)

        types = []
        type_names = ["Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"]

        for type_name in type_names:
            type = Type(
                name = type_name
            )
            types.append(type)

        db.session.add_all(types)

        users = []
        usernames = []

        for i in range(10):

            username = fake.first_name()
            while username in usernames:
                username = fake.first_name()
            usernames.append(username)

            user = User(
                username = username,
                age = randint(10,100)
            )

            user.password_hash = user.username + '1337'

            users.append(user)
        
        db.session.add_all(users)

        locales = []

        for i in range(30):
            locale = Locale(
                name = fake.city()
            )

            locale.region = rc(regions)

            locales.append(locale)
        
        db.session.add_all(locales)

        goals = []
        for i in range(50):

            target_date_str = fake.date()
            target_date = datetime.strptime(target_date_str, '%Y-%m-%d').date()

            goal = Goal(
                content = fake.paragraph(nb_sentences=8),
                target_date = target_date
            )

            goal.user = rc(users)

            goals.append(goal)

        db.session.add_all(goals)

        pokedexes = []
        for i in range(10):
            pokedex = Pokedex()

            pokedex.user = users[i]

            pokedexes.append(pokedex)
        
        db.session.add_all(pokedexes)

        species_entries = []
        dex_numbers = []
        for i in range(50):


            dex_number = randint(1, 1025)
            while dex_number in dex_numbers:
                dex_number = randint(1, 1025)
            dex_numbers.append(dex_number)

            response = requests.get(f'https://pokeapi.co/api/v2/pokemon/{dex_number}')
            if response.status_code == 200:
                pokemon = response.json()

                species = Species(
                    name = pokemon['name'],
                    dex_number = pokemon['id'],
                    shiny = fake.boolean()
                )

                species_entries.append(species)
            else:
                print("Error, failed to fetch Pokemon data.")
        
        db.session.add_all(species_entries)

        expeditions = []
        for i in range(50):

            expedition = Expedition(
                date = fake.date_this_month()
            )

            expedition.user = rc(users)
            expedition.locale = rc(locales)

            expeditions.append(expedition)

        db.session.add_all(expeditions)

        catches = []
        for i in range(50):

            catch = Catch(
                caught_at = fake.date_this_month()
            )

            catch.user = rc(users)
            catch.species = rc(species_entries)
            catch.expedition = rc(expeditions)

            catches.append(catch)
        
        db.session.add_all(catches)

        db.session.commit()

        # Self note: don't forget pokemont_types table later.
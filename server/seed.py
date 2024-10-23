#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

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
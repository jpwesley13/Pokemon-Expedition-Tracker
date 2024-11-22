#!/usr/bin/env python3

from flask import request, make_response, session
from flask_restful import Resource
from models import *
from sqlalchemy.exc import IntegrityError
from datetime import datetime

from config import app, db, api

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Regions(Resource):
    def get(self):
        regions = [region.to_dict() for region in Region.query.all()]
        return make_response(regions, 200)
    
    def post(self):
        params = request.get_json()

        try:
            new_region = Region(
                name = params['name'],
            )
            db.session.add(new_region)
            db.session.commit()
            return make_response(new_region.to_dict(), 201)
        except ValueError:
            return make_response({"errors": ["validation errors"]}, 400)
        
class RegionById(Resource):
    def get(self, id):
        region = Region.query.filter(Region.id == id).first()
        if region:
            return make_response(region.to_dict(), 200)
        return make_response({'error': 'Region not found.'}, 404)
    
class Types(Resource):
    def get(self):
        types = [type.to_dict() for type in Type.query.all()]
        return make_response(types, 200)
    
    def post(self):
        params = request.get_json()

        try:
            new_type = Type(
                name = params['name']
            )
            db.session.add(new_type)
            db.session.commit()
            return make_response(new_type, 201)
        except ValueError:
            return make_response({"errors": ["validation errors"]}, 400)
        
class TypeById(Resource):
    def get(self, id):
        type = Type.query.filter(Type.id == id).first()
        if type:
            return make_response(type.to_dict(), 200)
        return make_response({'error': 'Type not found.'}, 404)
    
class Pokedexes(Resource):
    def get(self):
        pokedexes = [pokedex.to_dict() for pokedex in Pokedex.query.all()]
        return make_response(pokedexes, 200)
    
    def post(self):
        params = request.get_json()

        try:
            new_pokedex = Pokedex(
                user_id = params['user_id']
            )
            db.session.add(new_pokedex)
            db.session.commit()
            return make_response(new_pokedex.to_dict(), 201)
        except ValueError:
            return make_response({"errors": ["validation errors"]}, 400)
        
class PokedexByUser(Resource):
    def get(self, user_id):
        user = User.query.filter(User.id == user_id).first()
        if not user:
            return make_response({"error": "User not found."}, 404)

        pokedex = user.pokedex

        if not pokedex:
            return make_response({'error': 'Pokedex not found.'}, 404)
        
        dex_data = pokedex.to_dict()
        
        # species_counts = {}
        # for catch in user.catches:
        #     species_name = catch.species.name
        #     species_counts[species_name] = species_counts.get(species_name, 0) + 1

        species_counts = {}
        for catch in user.catches:
            species_name = catch.species.name
            if species_name not in species_counts:
                species_counts[species_name] = user.total_counts(species_name)

        dex_data['species_counts'] = species_counts

        return make_response(dex_data, 200)
    
class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(users, 200)
    
class UserById(Resource):
    def get(self, id):
        user = User.query.filter(User.id == id).first()
        if user:
            return make_response(user.to_dict(), 200)
        return make_response({'error': 'User not found.'}, 404)
    
    def patch(self, id):
        user = User.query.filter(User.id == id).first()
        params = request.get_json()

        if user is None:
            return make_response({'error': 'User not found.'}, 404)
        
        try:
            for attr in params:
                if attr == "username" and User.query.filter(User.username == params[attr]).first():
                    return make_response({"errors": {"username": "Username must be unique"}}, 400)
                setattr(user, attr, params[attr])
            db.session.commit()
            return make_response(user.to_dict(), 202)
        except ValueError:
            return make_response({"errors": ["validation errors"]}, 400)
        
class Locales(Resource):
    def get(self):
        locales = [locale.to_dict() for locale in Locale.query.all()]
        return make_response(locales, 200)
    
    def post(self):
        params = request.get_json()

        proper_name = params['name'].strip().title()

        try:
            duplicate = Locale.query.filter(Locale.name == proper_name, Locale.region_id == params['region_id']).first()
            if duplicate:
                return {"errors": "Locale with this name and region already exists."}, 400
            
            new_locale = Locale(
                name = proper_name,
                region_id = params['region_id']
            )
            db.session.add(new_locale)
            db.session.commit()
            return make_response(new_locale.to_dict(), 201)
        except ValueError:
            return make_response({"errors": ["validation errors"]}, 400)
        
class LocaleById(Resource):
    def get(self, id):
        locale = Locale.query.filter(Locale.id == id).first()
        if locale:
            return make_response(locale.to_dict(), 200)
        return make_response({'error': 'Locale not found.'}, 404)
    
class Goals(Resource):
    def get(self):
        goals = [goal.to_dict() for goal in Goal.query.all()]
        return make_response(goals, 200)
    
    def post(self):
        params = request.get_json()

        try:
            target_date_str = params['target_date']
            target_date = datetime.strptime(target_date_str, '%Y-%m-%d').date()

            new_goal = Goal(
                content = params['content'],
                target_date = target_date,
                user_id = params['user_id']
            )
            db.session.add(new_goal)
            db.session.commit()
            return make_response(new_goal.to_dict(), 201)
        except (ValueError):
            return make_response({"errors": ["validation errors"]}, 400)
        
class GoalById(Resource):
    def get(self, id):
        goal = Goal.query.filter(Goal.id == id).first()
        if goal:
            return make_response(goal.to_dict(), 200)
        return make_response({'error': 'Goal not found.'}, 404)
    
    def patch(self, id):
        goal = Goal.query.filter(Goal.id == id).first()
        params = request.get_json()

        if goal is None:
            return make_response({"error": "Goal not found."}, 404)
        
        try:
            for attr in params:
                if attr == 'target_date':
                    target_date_str = params[attr]
                    setattr(goal, attr, datetime.strptime(target_date_str, '%Y-%m-%d').date())
                else:
                    setattr(goal, attr, params[attr])
            db.session.commit()
            return make_response(goal.to_dict(), 202)
        except ValueError:
            return make_response({"errors": ["validation errors"]}, 400)
    
    def delete(self, id):
        goal = Goal.query.filter(Goal.id == id).first()

        if goal is None:
            return make_response({"error": "Goal not found."}, 404)
        
        db.session.delete(goal)
        db.session.commit()

        return {}, 204

class Speciess(Resource):
    def get(self):
        species = [species.to_dict() for species in Species.query.all()]
        return make_response(species, 200)
    
    def post(self):
        params = request.get_json()

        try:
            new_species = Species(
                name = params['name'],
                dex_number = params['dex_number'],
                shiny = params['shiny']
            )

            type_names = params.get('types', [])
            types = Type.query.filter(Type.name.in_(type_names)).all()
            new_species.types.extend(types)

            db.session.add(new_species)
            db.session.commit()
            return make_response(new_species.to_dict(), 201)
        except ValueError:
            return make_response({"errors": ["validation errors"]}, 400)
        
class SpeciesById(Resource):
    def get(self, id):
        species = Species.query.filter(Species.id == id).first()
        if species:
            return make_response(species.to_dict(), 200)
        return make_response({'error': 'Species not found.'}, 404)
    
    def patch(self, id):
        species = Species.query.filter(Species.id == id).first()
        params = request.get_json()

        if species is None:
            return make_response({"error": "Species not found."}, 404)
        
        try:
            for attr in params:
                setattr(species, attr, params[attr])
            db.session.commit()
            return make_response(species.to_dict(), 202)
        except ValueError:
            return make_response({"errors": ["validation errors"]}, 400)
    
    def delete(self, id):
        species = Species.query.filter(Species.id == id).first()

        if species is None:
            return make_response({"error": "Species not found."}, 404)
        
        db.session.delete(species)
        db.session.commit()

        return {}, 204
    
class Catches(Resource):
    def get(self):
        catches = [catch.to_dict() for catch in Catch.query.all()]
        return make_response(catches, 200)
    
    def post(self):
        params = request.get_json()

        try:
            new_catch = Catch(
                caught_at = params['caught_at'],
                user_id = params['user_id'],
                species_id = params['species_id']
            )
            db.session.add(new_catch)
            db.session.commit()
            return make_response(new_catch.to_dict(), 201)
        except ValueError:
            return make_response({"errors": ["validation errors"]}, 400)
        
class CatchById(Resource):
    def get(self, id):
        catch = Catch.query.filter(Catch.id == id).first()
        if catch:
            return make_response(catch.to_dict(), 200)
        return make_response({'error': 'Catch not found.'}, 404)
    
    def patch(self, id):
        catch = Catch.query.filter(Catch.id == id).first()
        params = request.get_json()

        if catch is None:
            return make_response({"error": "Catch not found."}, 404)
        
        try:
            for attr in params:
                setattr(catch, attr, params[attr])
            db.session.commit()
            return make_response(catch.to_dict(), 202)
        except ValueError:
            return make_response({"errors": ["validation errors"]}, 400)
    
    def delete(self, id):
        catch = Catch.query.filter(Catch.id == id).first()

        if catch is None:
            return make_response({"error": "Rare catch not found."}, 404)
        
        db.session.delete(catch)
        db.session.commit()

        return {}, 204
    
class Expeditions(Resource):
    def get(self):
        expeditions = [expedition.to_dict() for expedition in Expedition.query.all()]
        return make_response(expeditions, 200)
    
    def post(self):
        params = request.get_json()

        try:
            expedition_date_str = params['date']
            expedition_date = datetime.strptime(expedition_date_str, '%Y-%m-%d').date()

            with db.session.begin_nested():

                new_expedition = Expedition(
                    date = expedition_date,
                    user_id = params['user_id'],
                    locale_id = params['locale_id']
                )
                db.session.add(new_expedition)

                new_species_list = []
                new_catches_list = []

                for capture_data in params.get('captures', []):
                    species_data = capture_data['species']

                    new_species = Species(
                        name=species_data['name'],
                        dex_number=species_data['dex_number'],
                        shiny=species_data['shiny']
                    )
                    type_names = species_data['types']
                    types = Type.query.filter(Type.name.in_(type_names)).all()
                    new_species.types.extend(types)

                    db.session.add(new_species)
                    new_species_list.append(new_species)

                    new_catch = Catch(
                        caught_at=expedition_date,
                        user_id=params['user_id'],
                        expedition_id=params['expedition_id'],
                        species=new_species
                    )
                    db.session.add(new_catch)
                    new_catches_list.append(new_catch)

            db.session.commit()

            response_data = {
            'expedition': new_expedition.to_dict(),
            'species': [species.to_dict() for species in new_species_list],
            'catches': [catch.to_dict() for catch in new_catches_list],
            }
            return make_response(response_data, 201)
        except ValueError:
            db.session.rollback()
            return make_response({"errors": ["validation errors"]}, 400)

class ExpeditionById(Resource):
    def get(self, id):
        expedition = Expedition.query.filter(Expedition.id == id).first()
        if expedition:
            return make_response(expedition.to_dict(), 200)
        return make_response({'error': 'Expedition not found.'}, 404)
    
    def patch(self, id):
        expedition = Expedition.query.filter(Expedition.id == id).first()
        params = request.get_json()

        if expedition is None:
            return make_response({"error": "Expedition not found."}, 404)
        
        try:
            for attr in params:
                setattr(expedition, attr, params[attr])
            db.session.commit()
            return make_response(expedition.to_dict(), 202)
        except ValueError:
            return make_response({"errors": ["validation errors"]}, 400)
    
    def delete(self, id):
        expedition = Expedition.query.filter(Expedition.id == id).first()

        if expedition is None:
            return make_response({"error": "Expedition not found."}, 404)
        
        db.session.delete(expedition)
        db.session.commit()

        return {}, 204
    
class Signup(Resource):
    def post(self):
        params = request.get_json()
        password = params.get('password')

        try:
            if User.query.filter(User.username == params['username']).first():
                return make_response({"errors": {"username": "Username already exists"}}, 400)
            
            new_user = User(
                username = params['username'],
                age = params['age']
            )
            new_user.password_hash = password

            print(f"New user: {new_user}")

            db.session.add(new_user)
            db.session.commit()
            session['user_id'] = new_user.id

            print("User added successfully")

            return make_response(new_user.to_dict(), 201)
        except (IntegrityError, ValueError):
            return make_response({"errors": ["validation errors"]}, 400)
        
class CheckSession(Resource):
    def get(self):
        user_id = session['user_id']
        if user_id:
            user = User.query.filter(User.id == user_id).first()
            return user.to_dict(), 200
        return {}, 401
        
class Login(Resource):
    def post(self):
        params = request.get_json()

        username = params['username']
        password = params['password']

        user = User.query.filter(User.username == username).first()

        if user:
            if user.authenticate(password):
                session['user_id'] = user.id
                return user.to_dict(), 200
        return {'errors': 'Invalid login credentials'}, 401
    
class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return {}, 204
    
api.add_resource(Users, '/users')
api.add_resource(UserById, '/users/<int:id>')
api.add_resource(PokedexByUser, '/users/<int:user_id>/pokedex')
api.add_resource(Pokedexes, '/pokedexes')
api.add_resource(Goals, '/goals')
api.add_resource(GoalById, '/goals/<int:id>')
api.add_resource(Locales, '/locales')
api.add_resource(LocaleById, '/locales/<int:id>')
api.add_resource(Regions, '/regions')
api.add_resource(RegionById, '/regions/<int:id>')
api.add_resource(Speciess, '/species')
api.add_resource(SpeciesById, '/species/<int:id>')
api.add_resource(Types, '/types')
api.add_resource(TypeById, '/types/<int:id>')
api.add_resource(Catches, '/catches')
api.add_resource(CatchById, '/catches/<int:id>')
api.add_resource(Expeditions, '/expeditions')
api.add_resource(ExpeditionById, '/expeditions/<int:id>')
api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')

app.secret_key = '48D7090A3C0D9FB9'

if __name__ == '__main__':
    app.run(port=5555, debug=True)


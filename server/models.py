from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates

from config import db, bcrypt

class Region(db.Model, SerializerMixin):
    __tablename__ = 'regions'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    locales = db.relationship('Locale', back_populates='region')

    serialize_rules = ('-locales.region',)

    @validates('name')
    def validate_name(self, key, name):
        regions = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar", "Paldea", "Orre", "Ultra Space", "Kitakami", "Almia", "Oblivia", "Lental", "Uncharted"]
        if name not in regions:
            raise ValueError('Region not recognized. Please select from available options or confirm uncharted territory.')
        return name
    
class Pokedex(db.Model, SerializerMixin):
    __tablename__ = 'pokedexes'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship('User', back_populates='pokedex')

    serialize_rules = ('-users.pokedex')

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    age = db.Column(db.Integer)
    _password_hash = db.Column(db.String, nullable=False)

    pokedex = db.relationship('Pokedex', uselist=False, back_populates='user')

    serialize_rules = ('-pokedexes.user')
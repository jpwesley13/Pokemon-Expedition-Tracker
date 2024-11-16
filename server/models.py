from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates

from config import db, bcrypt

pokemon_types = db.Table('pokemon_types',
    db.Column('species_id', db.Integer, db.ForeignKey('species.id')),
    db.Column('type_id', db.Integer, db.ForeignKey('types.id'))
    )

class Type(db.Model, SerializerMixin):
    __tablename__ = 'types'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    species = db.relationship('Species', secondary=pokemon_types, back_populates='types')

    serialize_rules = ('-species.types',)

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

    serialize_rules = ('-users.pokedex',)

    def __repr__(self):
        return f'<Pokedex {self.id}: Belongs to {self.user.username}>'

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    age = db.Column(db.Integer)
    _password_hash = db.Column(db.String, nullable=False)

    pokedex = db.relationship('Pokedex', uselist=False, back_populates='user')
    goals = db.relationship('Goal', back_populates='user')
    catches = db.relationship('Catch', back_populates='user', cascade='all, delete-orphan')
    expeditions = db.relationship('Expedition', back_populates='user', cascade='all, delete-orphan')

    serialize_rules = ('-pokedex.user', '-goals.user', '-catches.user', '-expeditions.user', '-_password_hash',)

    # def total_counts(self, species_name):
    #     total = Catch.query.filter(Catch.user_id == self.id, Catch.species.name == species_name).count()
    #     return total

    def total_counts(self, species_name):
        total = (Catch.query.join(Species).filter(Catch.user_id == self.id, Species.name == species_name).count())
        return total
    

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    @validates('username')
    def validate_name(self, key, username):
        if not username:
            raise ValueError('Please enter a username.')
        return username
    
    @validates('age')
    def validate_age(self, key, age):
        if age < 10:
            raise ValueError('Users must be at least 10 years old.')
        return age

    def __repr__(self):
        return f'<User {self.id}: {self.username}, age: {self.age}>'
    
class Locale(db.Model, SerializerMixin):
    __tablename__ = 'locales'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    region_id = db.Column(db.Integer, db.ForeignKey('regions.id'))

    region = db.relationship('Region', back_populates='locales')
    expeditions = db.relationship('Expedition', back_populates='locale', cascade='all, delete-orphan')

    serialize_rules = ('-region.locales', '-expeditions.locale')

    __table_args__ = (db.UniqueConstraint('name', 'region_id', name='_name_region_uc'),)

    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise ValueError('Locale must be named.')
        name = name.strip().title()
        if 25 < len(name) < 2:
            raise ValueError('Locale names must be between 2-25 characters long')
        return name

    def __repr__(self):
        return f'<Locale {self.id}: {self.name}>'
    
class Goal(db.Model, SerializerMixin):
    __tablename__ = 'goals'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)
    target_date = db.Column(db.Date)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship('User', back_populates='goals')

    serialize_rules = ('-user.goals',)

    def __repr__(self):
        return f'<Goal {self.id}: {self.content} by {self.target_date}'

class Species(db.Model, SerializerMixin):
    __tablename__ = 'species'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    dex_number = db.Column(db.Integer, nullable=False)
    shiny = db.Column(db.Boolean, default=False)

    catches = db.relationship('Catch', back_populates='species', cascade='all, delete-orphan')
    types = db.relationship('Type', secondary=pokemon_types, back_populates='species')

    serialize_rules = ('-catches.species', '-types.species')

    def is_shiny(self):
        if self.shiny:
            return "is shiny!"
        return "is not shiny."

    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise ValueError('Please enter a name.')
        return name

    def __repr__(self):
        return f'<Pokemon {self.id}: Number {self.dex_number}, {self.name} the {self.types} Type. It {self.is_shiny()}>'

class Catch(db.Model, SerializerMixin):
    __tablename__ = 'catches'

    id = db.Column(db.Integer, primary_key=True)
    caught_at = db.Column(db.Date)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    species_id = db.Column(db.Integer, db.ForeignKey('species.id'))

    user = db.relationship('User', back_populates='catches')
    species = db.relationship('Species', back_populates='catches')

    serialize_rules = ('-user.catches', '-species.catches', '-expeditions.user')

    def __repr__(self):
        return f'<Capture {self.id}: {self.user.username} caught a {self.species.name} at {self.caught_at}>'

class Expedition(db.Model, SerializerMixin):
    __tablename__ = 'expeditions'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    locale_id = db.Column(db.Integer, db.ForeignKey('locales.id'))

    user = db.relationship('User', back_populates='expeditions')
    locale = db.relationship('Locale', back_populates='expeditions')

    serialize_rules = ('-user.expeditions', '-locale.expeditions')

    def __repr__(self):
        return f'<Expedition {self.id}: {self.user.username}\'s expedition at {self.locale.name}. Date: {self.date}>'
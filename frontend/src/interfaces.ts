export interface SpeciesType {
    name: string;
}
export interface Species {
    name: string;
    types: SpeciesType[];
}
export interface Catch {
    species: Species;
    user_id: number;
}
export interface Locale {
    name: string;
    region: {
        name: string;
    };
}
export interface Expedition {
    locale: Locale;
    catches: Catch[];
    date: string;
}
export interface User {
    username: string;
    catches: Catch[];
    id: number;
}

export interface Pokemon {
    name: string;
    dex_number: number;
    types: string[];
    shiny: boolean;
}
'use server'

import { createSupabaseClient } from "../supabase";

// export async function fetchAndSaveLanguages() {
//     const supabase = createSupabaseClient();
//     const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flags');
//     const countries = await res.json();

//     const languages = countries.map((country: any) => ({
//         name: country.name.common,
//         code: country.cca2?.toLowerCase(),
//         flag_url: country.flags.svg,
//     }))
//     // Remove items without code

//     console.log('Languages:', languages);

//     const { data, error } = await supabase
//         .from('languages')
//         .insert(languages);

//     if (error) {
//         console.error('Error inserting:', error);
//     } else {
//         console.log('Inserted successfully:', data);
//     }

//     return data
// }

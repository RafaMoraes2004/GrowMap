// Local: src/supabase-client.ts

import { createClient } from '@supabase/supabase-js';
import { environment } from './environments/environment'; // Importa do Angular

// Pega as chaves do environment.ts
const supabaseUrl = environment.supabaseUrl;
const supabaseKey = environment.supabaseKey;

// Cria e exporta o cliente
export const supabase = createClient(supabaseUrl, supabaseKey);
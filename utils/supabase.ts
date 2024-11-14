// utils/supabaseClient.ts

import { createClient } from "@supabase/supabase-js";

// Defina suas variáveis de URL e chave pública (você pode encontrar esses dados no painel do Supabase)
const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co"; // Substitua pelo seu URL do Supabase
const SUPABASE_ANON_KEY = "YOUR-ANON-KEY"; // Substitua pela sua chave anônima do Supabase

// Crie e exporte a instância do cliente do Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

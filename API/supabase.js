const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
dotenv.config();


if(!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase URL or Anonomys Key");
}

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);


module.exports = supabase;
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xjyjupxhvprbwiravysf.supabase.co'
const supabaseKey = 'sb_publishable_SILt0A3gRhFfsACsvnnyww_ARW42XIj'

export const supabase = createClient(supabaseUrl, supabaseKey)
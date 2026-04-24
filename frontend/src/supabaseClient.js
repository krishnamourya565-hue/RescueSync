import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ercobawmabwsxgyjyiyr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY29iYXdtYWJ3c3hneWp5aXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NDYzNzIsImV4cCI6MjA5MjQyMjM3Mn0.0L2FgstEtzTJ-dJnPRjYEwP2BZE_2GM061XQnXMGepk';

export const supabase = createClient(supabaseUrl, supabaseKey);

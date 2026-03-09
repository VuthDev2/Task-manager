import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yprwuzewpvrchljpylih.supabase.co',
  'sb_publishable__cqqrE1nlKKMBi6nOpM-eA_Ogimw-Ch'
);

async function test() {
  const { data, error } = await supabase.auth.signUp({
    email: 'test_user12345@example.com',
    password: 'password123',
    options: {
      emailRedirectTo: `http://localhost:3000/auth/callback`,
      data: {
        full_name: `Test User`
      }
    },
  });

  console.log("Data:", data);
  console.log("Error:", error);
}

test();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUser() {
  try {
    // Create test user
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          id: 'test-user-1',
          wallet_address: '0x1234567890123456789012345678901234567890',
          username: 'testuser',
          email: 'test@example.com',
          role: 'client',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Error creating test user:', error);
      return;
    }

    console.log('Test user created successfully:', data);

    // Also create a test review
    const { data: reviewData, error: reviewError } = await supabase
      .from('reviews')
      .insert([
        {
          id: 'test-review-1',
          rating: 4,
          comment: 'Great work! The project was delivered on time and exceeded expectations.',
          from_user_id: 'test-user-2',
          to_user_id: 'test-user-1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();

    if (reviewError) {
      console.error('Error creating test review:', reviewError);
    } else {
      console.log('Test review created successfully:', reviewData);
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createTestUser();

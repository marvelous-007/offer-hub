const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupTestData() {
  console.log('🚀 Setting up test data for Review Response system...\n');

  try {
    // 1. Create test users
    console.log('1. Creating test users...');
    const { data: user1, error: user1Error } = await supabase
      .from('users')
      .upsert({
        id: 'test-user-1',
        wallet_address: '0x1234567890123456789012345678901234567890',
        username: 'testuser1',
        name: 'Test User 1',
        email: 'test1@example.com',
        is_freelancer: true,
        role: 'client'
      })
      .select()
      .single();

    if (user1Error) console.log('User 1 error:', user1Error.message);
    else console.log('✅ User 1 created:', user1.username);

    const { data: user2, error: user2Error } = await supabase
      .from('users')
      .upsert({
        id: 'test-user-2',
        wallet_address: '0x2345678901234567890123456789012345678901',
        username: 'testuser2',
        name: 'Test User 2',
        email: 'test2@example.com',
        is_freelancer: false,
        role: 'client'
      })
      .select()
      .single();

    if (user2Error) console.log('User 2 error:', user2Error.message);
    else console.log('✅ User 2 created:', user2.username);

    // 2. Create test review
    console.log('\n2. Creating test review...');
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .upsert({
        id: 'test-review-1',
        from_user_id: 'test-user-1',
        to_user_id: 'test-user-2',
        rating: 4,
        comment: 'Great work! The project was delivered on time and exceeded expectations.',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (reviewError) console.log('Review error:', reviewError.message);
    else console.log('✅ Review created:', review.id);

    // 3. Create test review response
    console.log('\n3. Creating test review response...');
    const { data: response, error: responseError } = await supabase
      .from('review_responses')
      .upsert({
        id: 'test-response-1',
        review_id: 'test-review-1',
        responder_id: 'test-user-2',
        content: 'Thank you for your feedback! I\'m glad the project met your expectations.',
        status: 'approved',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        approved_at: new Date().toISOString()
      })
      .select()
      .single();

    if (responseError) console.log('Response error:', responseError.message);
    else console.log('✅ Response created:', response.id);

    // 4. Create test analytics
    console.log('\n4. Creating test analytics...');
    const { data: analytics, error: analyticsError } = await supabase
      .from('response_analytics')
      .upsert({
        id: 'test-analytics-1',
        response_id: 'test-response-1',
        helpful_votes: 5,
        unhelpful_votes: 1,
        views_count: 12,
        engagement_score: 4.2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (analyticsError) console.log('Analytics error:', analyticsError.message);
    else console.log('✅ Analytics created:', analytics.id);

    console.log('\n🎉 Test data setup complete!');
    console.log('\n📋 Test IDs:');
    console.log('  User 1 ID: test-user-1');
    console.log('  User 2 ID: test-user-2');
    console.log('  Review ID: test-review-1');
    console.log('  Response ID: test-response-1');
    console.log('  Analytics ID: test-analytics-1');

  } catch (error) {
    console.error('❌ Error setting up test data:', error);
  }
}

setupTestData();

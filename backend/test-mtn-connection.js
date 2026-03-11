import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const testMTNConnection = async () => {
    console.log('🔍 Testing MTN MoMo Connection...');
    console.log('Environment:', process.env.MTN_API_ENVIRONMENT);
    console.log('Currency:', process.env.MTN_CURRENCY);
    console.log('Subscription Key:', process.env.MTN_COLLECTION_SUBSCRIPTION_KEY ? '✅ Present' : '❌ Missing');
    
    try {
        // Try to get an access token (first step to verify credentials)
        const response = await axios.post(
            `${process.env.MTN_API_BASE_URL}/collection/token/`,
            {},
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': process.env.MTN_COLLECTION_SUBSCRIPTION_KEY
                }
            }
        );
        
        console.log('✅ SUCCESS! Connected to MTN MoMo');
        console.log('Access Token:', response.data);
        
    } catch (error) {
        console.error('❌ Connection failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
};

testMTNConnection();
import { NextResponse } from 'next/server';

export async function POST(request) {  // Remove 'response' from here

    try {
        // Parse the request body
        const details = await request.json(); // Read the body with request.json()
        
        if (!details) {
            return NextResponse.json({ error: 'Details are required' }, { status: 400 });
        }

        const payload = {
            "return_url": `http://localhost:3000/fundraisers/${details.fundraiser.slug}`,
            "website_url": process.env.WEBSITE_URL,
            "amount": 1300,
            "purchase_order_id": "test12",
            "purchase_order_name": "test",
            "customer_info": {
                "name": "Khalti Bahadur",
                "email": "example@gmail.com",
                "phone": "9800000123"
            },
        };

        const options = {
            'method': 'POST',
            'headers': {
                'Authorization': 'key ' + process.env.KHALTI_SECRET_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        };

        const khaltiResponse = await fetch('https://a.khalti.com/api/v2/epayment/initiate/', options);
        const khaltiData = await khaltiResponse.json();

        return NextResponse.json(khaltiData, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


export const EmailTemplate = ({ name, otp }) => (
    <div style={{
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        margin: '0 auto',
        maxWidth: '600px',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e1e1e1',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    }}>
        <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            paddingBottom: '20px',
            borderBottom: '1px solid #e1e1e1'
        }}>
            <img
                src="https://i.ibb.co/VYJwS05/logo5.png"
                alt="Shayata Logo"
                style={{ width: '80px', height: 'auto' }}
            />
        </div>
        <h1 style={{
            textAlign: 'center',
            color: '#43a5a1',
            fontSize: '26px',
            margin: '20px 0',
            fontWeight: '600'
        }}>
            Hello, {name}!
        </h1>
        <p style={{
            textAlign: 'center',
            fontSize: '16px',
            margin: '0 0 20px 0'
        }}>
            Your OTP code for password reset is:
        </p>
        <div style={{
            textAlign: 'center',
            padding: '15px',
            backgroundColor: '#f8f8f8',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px'
        }}>
            <h2 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'rgb(39, 77, 135)',
                margin: '0'
            }}>
                {otp}
            </h2>
        </div>
        <p style={{
            textAlign: 'center',
            fontSize: '16px',
            margin: '0 0 20px 0'
        }}>
            Please use this code to reset your password. This code will expire in 10 minutes.
        </p>
        <p style={{
            textAlign: 'center',
            fontSize: '16px',
            margin: '0 0 30px 0',
            color: '#666'
        }}>
            If you did not request this, please ignore this email.
        </p>
        <footer style={{
            textAlign: 'center',
            fontSize: '14px',
            color: '#555',
            borderTop: '1px solid #e1e1e1',
            paddingTop: '20px',
            paddingBottom: '10px',
            marginTop: '30px',
            backgroundColor: '#f9f9f9',
            borderRadius: '0 0 8px 8px'
        }}>
            <p style={{ margin: '0', fontSize: '15px' }}>Best regards,</p>
            <p style={{ margin: '5px 0 0 0', fontSize: '16px', fontWeight: 'bold' }}><strong>FundNepal</strong></p>
        </footer>
    </div>
);

export default EmailTemplate

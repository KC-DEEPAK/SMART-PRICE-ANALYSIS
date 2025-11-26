from flask import Flask
import requests

app = Flask(__name__)

@app.route('/')
def test():
    try:
        # Test backend connection
        backend_response = requests.get('http://localhost:5000/api/health', timeout=5)
        backend_status = "✅ Backend connected" if backend_response.status_code == 200 else "❌ Backend failed"
        
        return f"""
        <h1>Frontend Test</h1>
        <p>{backend_status}</p>
        <p>Backend Response: {backend_response.json() if backend_response.status_code == 200 else 'No response'}</p>
        <p>If you see this, frontend is working!</p>
        <a href="/">Go to main app</a>
        """
    except Exception as e:
        return f"""
        <h1>Frontend Test - Error</h1>
        <p>❌ Backend connection failed: {str(e)}</p>
        <p>Make sure backend is running on port 5000</p>
        """

if __name__ == '__main__':
    print("🚀 Starting Frontend Test on http://localhost:3000")
    app.run(debug=True, host='0.0.0.0', port=3000)
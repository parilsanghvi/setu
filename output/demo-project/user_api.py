from flask import Flask, request, jsonify
import uuid
import re

app = Flask(__name__)

@app.errorhandler(Exception)
def handle_exception(e):
    """
    Generic error handler for all unhandled exceptions, returning a 500 Internal Server Error.
    """
    # For debugging, one might log 'e', but per requirements, no console.logs.
    return jsonify({"error": "Internal server error"}), 500

@app.route('/users', methods=['POST'])
def create_user():
    """
    Handles POST requests to create a new user.
    Validates input, generates a unique ID, and returns the new user data.
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "Validation failed", "details": {"request_body": "Request must be JSON"}}), 400

    errors = {}

    name = data.get('name')
    if not isinstance(name, str) or not name.strip():
        errors['name'] = "Name is required and must be a non-empty string."

    email = data.get('email')
    if not isinstance(email, str) or not email.strip():
        errors['email'] = "Email is required and must be a non-empty string."
    elif not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        errors['email'] = "Invalid email format."
    elif '@' not in email or '.' not in email.split('@')[1]:
        # Additional check as regex might be too permissive or strict,
        # ensuring specific parts of the requirement are met.
        errors['email'] = "Email must contain '@' and a '.' after the '@'."


    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400

    # Simulate user creation by generating a unique ID
    user_id = str(uuid.uuid4())

    new_user = {
        "id": user_id,
        "name": name,
        "email": email
    }

    return jsonify(new_user), 201

if __name__ == '__main__':
    # For development purposes, Flask's debug mode can be enabled.
    # In production, use a production-ready WSGI server.
    app.run(debug=False, port=5000)

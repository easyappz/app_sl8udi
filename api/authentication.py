import jwt
from datetime import datetime, timedelta
from django.conf import settings
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from api.models import Member


JWT_SECRET = 'your-secret-key-change-in-production'
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_DAYS = 30


class JWTAuthentication(authentication.BaseAuthentication):
    """Custom JWT authentication for Member model"""
    
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return None
        
        try:
            prefix, token = auth_header.split(' ')
            if prefix.lower() != 'bearer':
                raise AuthenticationFailed('Invalid token prefix')
        except ValueError:
            raise AuthenticationFailed('Invalid authorization header format')
        
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')
        
        member_id = payload.get('member_id')
        if not member_id:
            raise AuthenticationFailed('Token payload invalid')
        
        try:
            member = Member.objects.get(id=member_id)
        except Member.DoesNotExist:
            raise AuthenticationFailed('Member not found')
        
        return (member, token)


def generate_token(member):
    """Generate JWT token for member"""
    expiration = datetime.utcnow() + timedelta(days=JWT_EXPIRATION_DAYS)
    
    payload = {
        'member_id': member.id,
        'username': member.username,
        'exp': expiration,
        'iat': datetime.utcnow()
    }
    
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    return token

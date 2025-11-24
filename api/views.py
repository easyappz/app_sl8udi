from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from api.models import Member
from api.serializers import RegisterSerializer, LoginSerializer, MemberSerializer
from api.authentication import JWTAuthentication, generate_token


class HelloView(APIView):
    def get(self, request):
        return Response({"message": "Hello, World!"})


class RegisterView(APIView):
    """Register new member and return JWT token"""
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            member = serializer.save()
            
            token = generate_token(member)
            
            return Response(
                {
                    'access_token': token,
                    'token_type': 'Bearer',
                    'member': MemberSerializer(member).data
                },
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            {'error': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )


class LoginView(APIView):
    """Login member and return JWT token"""
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(
                {'error': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        try:
            member = Member.objects.get(username=username)
        except Member.DoesNotExist:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not member.check_password(password):
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        token = generate_token(member)
        
        return Response(
            {
                'access_token': token,
                'token_type': 'Bearer',
                'member': MemberSerializer(member).data
            },
            status=status.HTTP_200_OK
        )

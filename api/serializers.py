from rest_framework import serializers
from api.models import Member, Message


class MemberSerializer(serializers.ModelSerializer):
    """Serializer for Member model - read only"""
    
    class Meta:
        model = Member
        fields = ['id', 'username', 'created_at']
        read_only_fields = ['id', 'username', 'created_at']


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for member registration"""
    password = serializers.CharField(
        write_only=True,
        min_length=6,
        style={'input_type': 'password'}
    )
    username = serializers.CharField(
        min_length=3,
        max_length=50
    )
    
    class Meta:
        model = Member
        fields = ['username', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def validate_username(self, value):
        """Check username uniqueness"""
        if Member.objects.filter(username=value).exists():
            raise serializers.ValidationError("A member with this username already exists.")
        return value
    
    def create(self, validated_data):
        """Create member with hashed password"""
        member = Member(
            username=validated_data['username']
        )
        member.set_password(validated_data['password'])
        member.save()
        return member


class LoginSerializer(serializers.Serializer):
    """Serializer for member login"""
    username = serializers.CharField(
        write_only=True,
        min_length=3,
        max_length=50
    )
    password = serializers.CharField(
        write_only=True,
        min_length=6,
        style={'input_type': 'password'}
    )
    
    class Meta:
        fields = ['username', 'password']


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for Message model with member details"""
    member_id = serializers.IntegerField(source='member.id', read_only=True)
    member_username = serializers.CharField(source='member.username', read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'member_id', 'member_username', 'text', 'created_at']
        read_only_fields = ['id', 'member_id', 'member_username', 'created_at']


class MessageCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating messages"""
    text = serializers.CharField(
        min_length=1,
        max_length=1000
    )
    
    class Meta:
        model = Message
        fields = ['text']
    
    def create(self, validated_data):
        """Create message with authenticated member"""
        member = self.context['request'].user
        message = Message.objects.create(
            member=member,
            text=validated_data['text']
        )
        return message

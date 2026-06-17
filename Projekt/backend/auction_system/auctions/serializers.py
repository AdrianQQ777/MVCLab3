from rest_framework import serializers

from .models import Auction, Bid


# Serializer zmienia model Auction na JSON i odwrotnie
class AuctionSerializer(serializers.ModelSerializer):
    class Meta:
        # Model, z którego korzysta serializer
        model = Auction

        # Wszystkie pola modelu mają być widpczne w API
        fields = "__all__"
        read_only_fields = ["current_price"]

    def create(self, validated_data):
        validated_data["current_price"] = validated_data["starting_price"]
        return Auction.objects.create(**validated_data)


class BidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bid
        fields = "__all__"
        read_only_fields = ["auction"]

from django.urls import path

from .views import (
    add_bid,
    auction_create,
    auction_delete,
    auction_detail,
    auction_list,
    auction_update,
)

urlpatterns = [
    path("", auction_list, name="auction-list-page"),
    path("create/", auction_create, name="auction-create-page"),
    path("<int:pk>/", auction_detail, name="auction-detail-page"),
    path("<int:pk>/edit/", auction_update, name="auction-update-page"),
    path("<int:pk>/delete/", auction_delete, name="auction-delete-page"),
    path("<int:pk>/bid/", add_bid, name="auction-bid-page"),
]
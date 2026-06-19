from django.contrib import messages
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect, render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .forms import AuctionForm, BidForm
from .models import Auction
from .serializers import AuctionSerializer, BidSerializer


# =========================
# REST API
# =========================

# Widok do wyświetlania listy aukcji i dodawanie nowych
class AuctionListCreateView(generics.ListCreateAPIView):
    serializer_class = AuctionSerializer

    def get_queryset(self):
        queryset = Auction.objects.all()

        # Pobranie parametrów filtrowania z adresu URL
        category = self.request.query_params.get("category")
        status_param = self.request.query_params.get("status")

        # Filtrowanie po kategorii
        if category:
            queryset = queryset.filter(category=category)

        # Filtrowanie po statusie
        if status_param:
            queryset = queryset.filter(status=status_param)

        return queryset


# Widok do pobierania, edycji i usuwania jednej aukcji
class AuctionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Auction.objects.all()
    serializer_class = AuctionSerializer


# Widok do składania ofert
class AuctionBiddingView(APIView):
    def post(self, request, auction_id):
        auction = get_object_or_404(Auction, id=auction_id)
        serializer = BidSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        amount = serializer.validated_data["amount"]

        if auction.status == "ended":
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if amount < 0 or amount < auction.current_price:
            return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(auction=auction)
        auction.current_price = amount
        auction.save()
        return Response()


# =========================
# MVC / MVT - widoki HTML
# =========================

# Lista aukcji z wyszukiwaniem, filtrowaniem i sortowaniem
def auction_list(request):
    auctions = Auction.objects.all()

    search_query = request.GET.get("q")
    selected_category = request.GET.get("category")
    selected_status = request.GET.get("status")
    sort = request.GET.get("sort")

    # Wyszukiwanie po nazwie i opisie
    if search_query:
        auctions = auctions.filter(
            Q(name__icontains=search_query) | Q(description__icontains=search_query)
        )

    # Filtrowanie po kategorii
    if selected_category:
        auctions = auctions.filter(category=selected_category)

    # Filtrowanie po statusie
    if selected_status:
        auctions = auctions.filter(status=selected_status)

    # Sortowanie aukcji
    if sort == "price_asc":
        auctions = auctions.order_by("current_price")
    elif sort == "price_desc":
        auctions = auctions.order_by("-current_price")
    elif sort == "end_date_asc":
        auctions = auctions.order_by("end_date")
    elif sort == "end_date_desc":
        auctions = auctions.order_by("-end_date")
    else:
        auctions = auctions.order_by("-start_date")

    # Lista kategorii do filtra
    categories = (
        Auction.objects.order_by("category")
        .values_list("category", flat=True)
        .distinct()
    )

    context = {
        "auctions": auctions,
        "categories": categories,
        "search_query": search_query,
        "selected_category": selected_category,
        "selected_status": selected_status,
        "selected_sort": sort,
    }

    return render(request, "auctions/auction_list.html", context)


# Szczegóły jednej aukcji razem z historią ofert
def auction_detail(request, pk):
    auction = get_object_or_404(Auction, pk=pk)
    bids = auction.bid_set.all().order_by("-created_at")
    bid_form = BidForm(auction=auction)

    context = {
        "auction": auction,
        "bids": bids,
        "bid_form": bid_form,
    }

    return render(request, "auctions/auction_detail.html", context)


# Dodawanie nowej aukcji
def auction_create(request):
    if request.method == "POST":
        form = AuctionForm(request.POST)

        if form.is_valid():
            auction = form.save()
            messages.success(request, "Aukcja została dodana.")
            return redirect("auction-detail-page", pk=auction.pk)
    else:
        form = AuctionForm()

    context = {
        "form": form,
        "title": "Dodaj aukcję",
    }

    return render(request, "auctions/auction_form.html", context)


# Edycja aukcji
def auction_update(request, pk):
    auction = get_object_or_404(Auction, pk=pk)

    if request.method == "POST":
        form = AuctionForm(request.POST, instance=auction)

        if form.is_valid():
            form.save()
            messages.success(request, "Aukcja została zaktualizowana.")
            return redirect("auction-detail-page", pk=auction.pk)
    else:
        form = AuctionForm(instance=auction)

    context = {
        "form": form,
        "auction": auction,
        "title": "Edytuj aukcję",
    }

    return render(request, "auctions/auction_form.html", context)


# Usuwanie aukcji
def auction_delete(request, pk):
    auction = get_object_or_404(Auction, pk=pk)

    if request.method == "POST":
        auction.delete()
        messages.success(request, "Aukcja została usunięta.")
        return redirect("auction-list-page")

    context = {
        "auction": auction,
    }

    return render(request, "auctions/auction_confirm_delete.html", context)


# Składanie oferty/licytacji przez formularz HTML
def add_bid(request, pk):
    auction = get_object_or_404(Auction, pk=pk)

    if request.method == "POST":
        form = BidForm(request.POST, auction=auction)

        if form.is_valid():
            bid = form.save(commit=False)
            bid.auction = auction
            bid.save()

            # Aktualizacja aktualnej ceny aukcji
            auction.current_price = bid.amount
            auction.save()

            messages.success(request, "Oferta została złożona.")
            return redirect("auction-detail-page", pk=auction.pk)

        bids = auction.bid_set.all().order_by("-created_at")

        context = {
            "auction": auction,
            "bids": bids,
            "bid_form": form,
        }

        return render(request, "auctions/auction_detail.html", context)

    return redirect("auction-detail-page", pk=auction.pk)
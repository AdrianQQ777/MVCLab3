from django import forms
from django.core.exceptions import ValidationError
from django.utils import timezone

from .models import Auction, Bid


class AuctionForm(forms.ModelForm):
    class Meta:
        model = Auction
        fields = [
            "name",
            "description",
            "category",
            "starting_price",
            "start_date",
            "end_date",
            "owner_id",
            "status",
        ]

        labels = {
            "name": "Nazwa aukcji",
            "description": "Opis",
            "category": "Kategoria",
            "starting_price": "Cena wywoławcza",
            "start_date": "Data rozpoczęcia",
            "end_date": "Data zakończenia",
            "owner_id": "ID właściciela",
            "status": "Status",
        }

        widgets = {
            "name": forms.TextInput(attrs={"class": "form-control"}),
            "description": forms.Textarea(attrs={"class": "form-control", "rows": 4}),
            "category": forms.TextInput(attrs={"class": "form-control"}),
            "starting_price": forms.NumberInput(
                attrs={"class": "form-control", "step": "0.01"}
            ),
            "start_date": forms.DateTimeInput(
                attrs={"class": "form-control", "type": "datetime-local"},
                format="%Y-%m-%dT%H:%M",
            ),
            "end_date": forms.DateTimeInput(
                attrs={"class": "form-control", "type": "datetime-local"},
                format="%Y-%m-%dT%H:%M",
            ),
            "owner_id": forms.NumberInput(attrs={"class": "form-control"}),
            "status": forms.Select(attrs={"class": "form-select"}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields["start_date"].input_formats = ["%Y-%m-%dT%H:%M"]
        self.fields["end_date"].input_formats = ["%Y-%m-%dT%H:%M"]

    def clean_starting_price(self):
        starting_price = self.cleaned_data.get("starting_price")

        if starting_price is not None and starting_price <= 0:
            raise ValidationError("Cena wywoławcza musi być większa od 0.")

        return starting_price

    def clean(self):
        cleaned_data = super().clean()

        start_date = cleaned_data.get("start_date")
        end_date = cleaned_data.get("end_date")

        if start_date and end_date:
            if end_date <= start_date:
                raise ValidationError(
                    "Data zakończenia musi być późniejsza niż data rozpoczęcia."
                )

            if end_date <= timezone.now():
                raise ValidationError(
                    "Data zakończenia nie może być z przeszłości."
                )

        return cleaned_data

    def save(self, commit=True):
        auction = super().save(commit=False)

        if not auction.current_price:
            auction.current_price = auction.starting_price

        if commit:
            auction.save()

        return auction


class BidForm(forms.ModelForm):
    class Meta:
        model = Bid
        fields = ["amount"]

        labels = {
            "amount": "Twoja oferta",
        }

        widgets = {
            "amount": forms.NumberInput(
                attrs={"class": "form-control", "step": "0.01"}
            ),
        }

    def __init__(self, *args, **kwargs):
        self.auction = kwargs.pop("auction", None)
        super().__init__(*args, **kwargs)

    def clean_amount(self):
        amount = self.cleaned_data.get("amount")

        if self.auction is None:
            raise ValidationError("Nie wybrano aukcji.")

        if self.auction.status == "ended":
            raise ValidationError("Nie można licytować zakończonej aukcji.")

        if amount is not None and amount <= self.auction.current_price:
            raise ValidationError(
                "Oferta musi być większa od aktualnej ceny aukcji."
            )

        return amount